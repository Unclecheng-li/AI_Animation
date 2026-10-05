/**
 * Drives tools/harness.html frame by frame and writes the gameplay footage
 * the promo is built from.
 *
 *   node tools/record.mjs probe            measure how long a full clear takes
 *   node tools/record.mjs record [seconds] capture PNGs and mux them to MP4
 *
 * The harness advances on an explicit dt (never rAF) behind a virtual clock,
 * so a capture that takes minutes of wall time still produces frames that are
 * exactly 1/FPS apart. Reruns are byte-identical.
 */
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import puppeteer from "puppeteer-core";

const execFileAsync = promisify(execFile);
const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(TOOLS_DIR, "..");
const FRAMES_DIR = path.join(TOOLS_DIR, ".frames");
const OUT_MP4 = path.join(PROJECT_DIR, "assets", "play-full.mp4");
const STATS_JSON = path.join(PROJECT_DIR, "assets", "play-full.stats.json");

const FPS = 60;
const DT = 1 / FPS;
const PROBE_LIMIT_SEC = 600;

const MIME = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json" };

async function serveTools() {
  const server = createServer(async (req, res) => {
    const rel = decodeURIComponent((req.url ?? "/").split("?")[0]).replace(/^\/+/, "");
    const file = path.join(TOOLS_DIR, rel || "harness.html");
    if (!file.startsWith(TOOLS_DIR)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, port: server.address().port };
}

async function chromePath() {
  const { stdout } = await execFileAsync("npx", ["hyperframes", "browser", "path"], { cwd: PROJECT_DIR });
  return stdout.trim().split("\n").pop().trim();
}

async function openHarness(port) {
  const browser = await puppeteer.launch({
    executablePath: await chromePath(),
    headless: true,
    args: ["--force-device-scale-factor=1", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${port}/harness.html`, { waitUntil: "load" });
  await page.waitForFunction("window.__ready === true", { timeout: 20000 }).catch(() => {
    throw new Error(`harness never became ready. page errors:\n${errors.join("\n") || "(none)"}`);
  });
  const box = await page.evaluate(() => {
    const c = document.getElementById("stage");
    return { width: c.width, height: c.height };
  });
  await page.setViewport({ width: box.width, height: box.height, deviceScaleFactor: 1 });
  return { browser, page, box };
}

async function probe() {
  const { server, port } = await serveTools();
  const { browser, page, box } = await openHarness(port);
  console.log(`canvas ${box.width}x${box.height}`);

  const timeline = await page.evaluate(
    async (dt, limitFrames) => {
      const samples = [];
      let clearedAt = null;
      for (let i = 0; i < limitFrames; i += 1) {
        window.__advance(dt);
        if (i % 30 === 0) {
          const s = window.__stats();
          samples.push({ t: +(i * dt).toFixed(2), ...s });
          if (s.aliveBricks === 0) {
            clearedAt = i * dt;
            break;
          }
        }
      }
      return { samples, clearedAt, final: window.__stats() };
    },
    DT,
    Math.round(PROBE_LIMIT_SEC * FPS),
  );

  const { samples, clearedAt, final } = timeline;
  console.log(`total: ${final.totalContributions} contributions across ${final.totalBricks} bricks`);
  for (const s of samples.filter((_, i) => i % 10 === 0)) {
    console.log(`  t=${String(s.t).padStart(6)}s  remaining=${String(s.remaining).padStart(5)}  bricks=${String(s.aliveBricks).padStart(4)}  balls=${s.balls}`);
  }
  console.log(clearedAt === null ? `NOT cleared within ${PROBE_LIMIT_SEC}s (state=${final.state})` : `cleared at ${clearedAt.toFixed(2)}s`);

  await browser.close();
  server.close();
}

async function record(seconds) {
  await rm(FRAMES_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });
  await mkdir(path.dirname(OUT_MP4), { recursive: true });

  const { server, port } = await serveTools();
  const { browser, page, box } = await openHarness(port);

  const totalFrames = Math.round(seconds * FPS);
  const stats = [];
  console.log(`recording ${totalFrames} frames at ${FPS}fps (${seconds}s) — ${box.width}x${box.height}`);

  for (let i = 0; i < totalFrames; i += 1) {
    const s = await page.evaluate(
      (dt) => {
        window.__advance(dt);
        return window.__stats();
      },
      DT,
    );
    stats.push({ frame: i, t: +(i * DT).toFixed(4), remaining: s.remaining, aliveBricks: s.aliveBricks, balls: s.balls, state: s.state });
    await page.screenshot({ path: path.join(FRAMES_DIR, `f${String(i).padStart(5, "0")}.png`), optimizeForSpeed: true });
    if (i % 300 === 0) console.log(`  frame ${i}/${totalFrames} remaining=${s.remaining} bricks=${s.aliveBricks} balls=${s.balls}`);
  }

  await browser.close();
  server.close();

  await writeFile(STATS_JSON, JSON.stringify({ fps: FPS, width: box.width, height: box.height, frames: stats }, null, 2));
  console.log(`stats → ${STATS_JSON}`);

  await execFileAsync("ffmpeg", [
    "-y", "-framerate", String(FPS),
    "-i", path.join(FRAMES_DIR, "f%05d.png"),
    "-c:v", "libx264", "-preset", "slow", "-crf", "16",
    "-pix_fmt", "yuv420p", "-an",
    OUT_MP4,
  ]);
  console.log(`video → ${OUT_MP4}`);
  await rm(FRAMES_DIR, { recursive: true, force: true });
}

/** Advance to `seconds` without capturing, then write one frame. */
async function still(seconds, outName) {
  const { server, port } = await serveTools();
  const { browser, page } = await openHarness(port);

  const s = await page.evaluate(
    (dt, frames) => {
      for (let i = 0; i < frames; i += 1) window.__advance(dt);
      return window.__stats();
    },
    DT,
    Math.round(seconds * FPS),
  );

  const out = path.join(PROJECT_DIR, "assets", outName);
  await page.screenshot({ path: out });
  console.log(`t=${seconds}s state=${s.state} remaining=${s.remaining} balls=${s.balls} → ${out}`);

  await browser.close();
  server.close();
}

const [mode, arg, arg2] = process.argv.slice(2);
if (mode === "probe") await probe();
else if (mode === "record") await record(Number(arg ?? 60));
else if (mode === "still") await still(Number(arg ?? 34), arg2 ?? "still.png");
else {
  console.error("usage: node tools/record.mjs probe | record [seconds] | still <seconds> <out.png>");
  process.exit(1);
}
