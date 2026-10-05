/**
 * Deterministically mounts the unmodified extension source on the public
 * GitHub profile, then probes gameplay seeds or inspects the live DOM.
 */
import { execFile } from "node:child_process";
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import puppeteer from "puppeteer-core";

const execFileAsync = promisify(execFile);
const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(TOOLS_DIR, "..");
const BUNDLE_PATH = path.join(TOOLS_DIR, "ext-bundle.js");
const PROFILE_URL = "https://github.com/toshi0607";

const FPS = 60;
const DEFAULT_PROBE_LIMIT_SEC = 400;
const PROBE_BATCH_FRAMES = 1800;
const DEFAULT_INSPECT_SEED = 0;
const MAX_SEED = 0xffffffff;
const BUNDLE_COMMAND =
  "npx --yes esbuild@0.25.10 tools/ext-entry.ts --bundle --format=iife --target=chrome120 --platform=browser --outfile=tools/ext-bundle.js --log-level=warning";

const ASSETS_DIR = path.join(PROJECT_DIR, "assets", "ext");
const FRAMES_DIR = path.join(TOOLS_DIR, ".frames");
const RECORD_WINDOW_NAMES = ["early", "peak", "end"];
const RECORD_CLEAR_TIMEOUT_FRAMES = 30000;
const POST_CLEAR_HOLD_FRAMES = 30;
const PEAK_WINDOW_FRAMES = 180;
const PEAK_WINDOW_PAD_FRAMES = 60;
const PEAK_ALIVE_THRESHOLD_RATIO = 0.25;
const EARLY_PRE_LAUNCH_SEC = 0.5;
const EARLY_POST_LAUNCH_SEC = 14;
const END_PRE_CLEAR_SEC = 8;
const END_POST_CLEAR_SEC = 0.5;
const REAL_HOVER_SETTLE_MS = 300;
const DEVICE_SCALE_FACTOR = 2; // matches setupPage's viewport deviceScaleFactor

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function chromePath() {
  const { stdout } = await execFileAsync("npx", ["hyperframes", "browser", "path"], { cwd: PROJECT_DIR });
  return stdout.trim().split("\n").pop().trim();
}

async function launchBrowser() {
  return puppeteer.launch({
    executablePath: await chromePath(),
    headless: true,
    args: ["--hide-scrollbars"],
    protocolTimeout: 300000,
  });
}

async function readBundleSource() {
  try {
    return await readFile(BUNDLE_PATH, "utf8");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      throw new Error(`Missing tools/ext-bundle.js. Run this from ${PROJECT_DIR} first:\n${BUNDLE_COMMAND}`);
    }
    throw error;
  }
}

async function installDeterminismStubs(page, seed) {
  await page.evaluate((initialSeed) => {
    const frameMs = 1000 / 60;
    let s = initialSeed >>> 0;
    // Call count is diagnostic only (exposed via window.__harness.lcgCalls for
    // `record` mode to compare pass 1 vs pass 2 if a determinism mismatch ever
    // shows up) — never read by probe/inspect, so it cannot change their output.
    let lcgCallCount = 0;
    function lcg() {
      lcgCallCount += 1;
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    }

    let virtualNow = 1700000000000;
    window.Math.random = lcg;
    window.performance.now = () => virtualNow;
    window.Date.now = () => virtualNow;

    let nextRafId = 1;
    const rafCallbacks = new Map();
    window.requestAnimationFrame = (callback) => {
      const id = nextRafId++;
      rafCallbacks.set(id, callback);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      rafCallbacks.delete(id);
    };

    let harnessStartMs = null;
    let pendingLaunchAtMs = null;
    let launchArmed = false;
    let lastState = null;
    let autopilotPaddleX = null;
    // 0-based, incremented once per tick() call (first tick's value is 0) —
    // this is the same "frame N" numbering `record` mode's stats/windows use.
    let nextFrame = 0;
    let currentFrame = -1;

    function drain() {
      const pending = [...rafCallbacks.entries()];
      rafCallbacks.clear();
      for (const [, callback] of pending) callback(virtualNow);
    }

    function autopilot() {
      const game = window.__game;
      if (!game) return;

      const state = game.state;
      const canvas = document.querySelector("canvas");
      if (canvas && autopilotPaddleX === null) {
        autopilotPaddleX = canvas.getBoundingClientRect().width / 2;
      }

      if (state === "ready" && !launchArmed) {
        pendingLaunchAtMs = harnessStartMs + 500;
        launchArmed = true;
      } else if (state === "ballLost" && lastState !== "ballLost") {
        pendingLaunchAtMs = virtualNow + 900;
      }

      if (
        pendingLaunchAtMs !== null &&
        virtualNow >= pendingLaunchAtMs &&
        (state === "ready" || state === "ballLost")
      ) {
        if (canvas) {
          // One-shot: only the very first launch (state === "ready") is the
          // initial launch: a ballLost relaunch must never overwrite this.
          if (state === "ready" && window.__harness.initialLaunchFrame === null) {
            window.__harness.initialLaunchFrame = currentFrame;
          }
          canvas.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          pendingLaunchAtMs = null;
        }
      } else if (state === "playing") {
        if (canvas && autopilotPaddleX !== null) {
          const canvasRect = canvas.getBoundingClientRect();

          let lowestBall = game.ballStates[0];
          for (const ball of game.ballStates) {
            if (ball.y > lowestBall.y) lowestBall = ball;
          }

          const wobble = Math.sin(virtualNow / 800) * 18;
          const target = lowestBall.x + wobble;
          const maxStep = 900 * (canvasRect.width / 960) * (1 / 60);
          const delta = Math.min(Math.max(target - autopilotPaddleX, -maxStep), maxStep);
          autopilotPaddleX += delta;

          window.dispatchEvent(
            new MouseEvent("mousemove", {
              clientX: canvasRect.left + autopilotPaddleX,
              clientY: canvasRect.top + game.paddleState.y,
              bubbles: true,
            }),
          );
        }
      }

      lastState = state;
    }

    function stats() {
      const game = window.__game;
      if (!game) return null;

      const bricks = game.liveBricks;
      return {
        state: game.state,
        aliveBricks: bricks.filter((brick) => brick.alive).length,
        totalBricks: bricks.length,
        balls: game.ballStates.length,
        life: game.life,
        paddleX: game.paddleState.x + game.paddleState.width / 2,
        paddleY: game.paddleState.y,
        score: game.score,
      };
    }

    window.__harness = {
      lcg,
      // One-shot, set by autopilot() the first time it fires the initial
      // launch click (never a ballLost relaunch). `record` mode reads this
      // after pass 1 to derive launchT instead of hardcoding it.
      initialLaunchFrame: null,
      lcgCalls() {
        return lcgCallCount;
      },
      markLaunchClicked() {
        harnessStartMs = virtualNow;
      },
      virtualNow() {
        return virtualNow;
      },
      elapsedMs() {
        return harnessStartMs === null ? 0 : virtualNow - harnessStartMs;
      },
      drain,
      stats,
      tick() {
        currentFrame = nextFrame;
        nextFrame += 1;
        virtualNow += frameMs;
        autopilot();
        drain();
        return stats();
      },
    };
  }, seed);
}

async function setupPage(page, bundleSource, seed) {
  await page.setBypassCSP(true);
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
  await page.goto(PROFILE_URL, { waitUntil: "networkidle2" });
  await page.waitForSelector("table.ContributionCalendar-grid");
  await page.evaluate(() => document.fonts.ready);
  await sleep(1000);

  try {
    await page.setOfflineMode(true);
    console.error(`[seed ${seed}] offline mode enabled`);
  } catch (error) {
    console.error(`[seed ${seed}] offline mode could not be enabled; continuing: ${String(error)}`);
  }

  await installDeterminismStubs(page, seed);
  await page.addScriptTag({ content: bundleSource });

  const lcgRef = await page.evaluateHandle(() => window.__harness.lcg);
  try {
    await page.evaluate((random) => {
      window.__kz.DEFAULT_CONFIG.random = random;
    }, lcgRef);
  } finally {
    await lcgRef.dispose();
  }

  await page.evaluate(() => {
    const orig = window.__kz.Game.prototype.update;
    window.__kz.Game.prototype.update = function (dt) {
      window.__game = this;
      return orig.call(this, dt);
    };
  });

  await page.evaluate(() => {
    window.__kz.mount(document, window);
  });
}

async function clickLaunchButton(page) {
  await page.evaluate(() => {
    // No-op for probe/inspect (window.Math.random is always window.__harness.lcg
    // for them already). record mode's pass 2 parks window.Math.random on a
    // disposable decoy during its real pre-click hover sleeps and restores it
    // before calling this; re-asserting the real lcg here too, atomically with
    // the click itself, closes the last gap -- the separate page.evaluate
    // round trip that a "restore, then call clickLaunchButton" split would
    // otherwise leave between restoring it and the click actually firing.
    window.Math.random = window.__harness.lcg;
    const launchButton = document.getElementById("kusakuzushi-launch");
    if (!launchButton) throw new Error("#kusakuzushi-launch was not mounted");
    window.__harness.markLaunchClicked();
    launchButton.click();
    if (!document.querySelector("canvas")) throw new Error("launch button did not create the overlay canvas");
  });
}

async function advanceOneFrame(page) {
  return page.evaluate(() => window.__harness.tick());
}

function parseUnsignedInteger(value, label) {
  if (!/^\d+$/.test(value ?? "")) throw new Error(`invalid ${label}: ${value ?? "(missing)"}`);
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number > MAX_SEED) throw new Error(`invalid ${label}: ${value}`);
  return number;
}

function parsePositiveNumber(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) throw new Error(`invalid ${label}: ${value}`);
  return number;
}

function parseSeedRange(value) {
  const match = /^(\d+)-(\d+)$/.exec(value ?? "");
  if (!match) throw new Error(`invalid --seeds range: ${value ?? "(missing)"}`);
  const first = parseUnsignedInteger(match[1], "seed");
  const last = parseUnsignedInteger(match[2], "seed");
  if (first > last) throw new Error(`invalid --seeds range: ${value}`);
  return { first, last };
}

function readOptionValues(rest, allowed) {
  const values = new Map();
  for (let index = 0; index < rest.length; index += 1) {
    const option = rest[index];
    if (!allowed.has(option)) throw new Error(`unknown option: ${option}`);
    if (values.has(option)) throw new Error(`duplicate option: ${option}`);
    const value = rest[++index];
    if (value === undefined || value.startsWith("--")) throw new Error(`missing value for ${option}`);
    values.set(option, value);
  }
  return values;
}

function parseArgs(argv) {
  const [mode, ...rest] = argv;
  if (mode === "probe") {
    const values = readOptionValues(rest, new Set(["--seeds", "--limit"]));
    if (!values.has("--seeds")) throw new Error("probe requires --seeds A-B");
    return {
      mode,
      ...parseSeedRange(values.get("--seeds")),
      limit: values.has("--limit")
        ? parsePositiveNumber(values.get("--limit"), "--limit")
        : DEFAULT_PROBE_LIMIT_SEC,
    };
  }

  if (mode === "inspect") {
    const values = readOptionValues(rest, new Set(["--seed"]));
    return {
      mode,
      seed: values.has("--seed")
        ? parseUnsignedInteger(values.get("--seed"), "--seed")
        : DEFAULT_INSPECT_SEED,
    };
  }

  if (mode === "record") {
    const values = readOptionValues(rest, new Set(["--seed"]));
    if (!values.has("--seed")) throw new Error("record requires --seed N");
    return {
      mode,
      seed: parseUnsignedInteger(values.get("--seed"), "--seed"),
    };
  }

  throw new Error(
    "usage: node tools/record-ext.mjs probe --seeds A-B [--limit N] | inspect [--seed N] | record --seed N",
  );
}

function roundedSeconds(milliseconds) {
  return Number((milliseconds / 1000).toFixed(3));
}

async function runProbeBatch(page, frameCount, previousState) {
  return page.evaluate(
    ({ frames, stateBeforeBatch }) => {
      let maxBalls = 0;
      let ballLostEpisodes = 0;
      let lastState = stateBeforeBatch;
      let finalStats = null;
      let result = null;
      let terminalElapsedMs = null;
      let framesRun = 0;

      for (let index = 0; index < frames; index += 1) {
        const snapshot = window.__harness.tick();
        framesRun += 1;
        if (!snapshot) continue;

        finalStats = snapshot;
        maxBalls = Math.max(maxBalls, snapshot.balls);
        if (snapshot.state === "ballLost" && lastState !== "ballLost") ballLostEpisodes += 1;
        lastState = snapshot.state;

        if (snapshot.aliveBricks === 0) {
          result = "cleared";
          terminalElapsedMs = window.__harness.elapsedMs();
          break;
        }
        if (snapshot.state === "gameOver") {
          result = "gameOver";
          terminalElapsedMs = window.__harness.elapsedMs();
          break;
        }
      }

      return {
        framesRun,
        result,
        terminalElapsedMs,
        maxBalls,
        ballLostEpisodes,
        lastState,
        finalStats,
      };
    },
    { frames: frameCount, stateBeforeBatch: previousState },
  );
}

async function probeSeed(page, seed, limitSeconds) {
  await clickLaunchButton(page);

  const frameLimit = Math.ceil(limitSeconds * FPS);
  let framesRun = 0;
  let result = null;
  let clearedAt = null;
  let maxBalls = 0;
  let ballLostEpisodes = 0;
  let previousState = null;
  let finalStats = null;

  while (framesRun < frameLimit && result === null) {
    const batchFrames = Math.min(PROBE_BATCH_FRAMES, frameLimit - framesRun);
    const batch = await runProbeBatch(page, batchFrames, previousState);
    framesRun += batch.framesRun;
    result = batch.result;
    maxBalls = Math.max(maxBalls, batch.maxBalls);
    ballLostEpisodes += batch.ballLostEpisodes;
    previousState = batch.lastState;
    finalStats = batch.finalStats ?? finalStats;

    if (result === "cleared") clearedAt = roundedSeconds(batch.terminalElapsedMs);
  }

  return {
    seed,
    result: result ?? "timeout",
    clearedAt,
    maxBalls,
    ballLostEpisodes,
    finalLife: finalStats?.life ?? null,
  };
}

function printProbeSummary(results) {
  console.table(results);

  const qualifying = results
    .filter((result) => result.result === "cleared" && result.maxBalls >= 20)
    .sort((a, b) => a.clearedAt - b.clearedAt || a.seed - b.seed);

  if (qualifying.length > 0) {
    const selected = qualifying[0];
    console.log(`SELECTED SEED: ${selected.seed} clearedAt=${selected.clearedAt}s maxBalls=${selected.maxBalls}`);
    return;
  }

  const cleared = results
    .filter((result) => result.result === "cleared")
    .sort((a, b) => a.clearedAt - b.clearedAt || a.seed - b.seed);
  const gameOverCount = results.filter((result) => result.result === "gameOver").length;
  const timeoutCount = results.filter((result) => result.result === "timeout").length;

  console.log("NO SEED QUALIFIED");
  console.log("Cleared seeds sorted by clearedAt (maxBalls filter ignored):");
  console.table(cleared);
  console.log(`gameOver=${gameOverCount} timeout=${timeoutCount}`);
}

async function runProbe(options) {
  const bundleSource = await readBundleSource();
  const browser = await launchBrowser();
  const results = [];

  try {
    for (let seed = options.first; seed <= options.last; seed += 1) {
      const page = await browser.newPage();
      try {
        await setupPage(page, bundleSource, seed);
        const result = await probeSeed(page, seed, options.limit);
        results.push(result);
        console.log(JSON.stringify(result));
      } finally {
        await page.close();
      }

      if (seed < options.last) await sleep(1000);
    }
  } finally {
    await browser.close();
  }

  printProbeSummary(results);
}

async function inspectPage(page) {
  return page.evaluate(() => {
    function rect(element) {
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        left: box.left,
      };
    }

    const table = document.querySelector("table.ContributionCalendar-grid");
    const launchButton = document.getElementById("kusakuzushi-launch");
    const canvas = document.querySelector("canvas");
    if (!table) throw new Error("contribution calendar table missing during inspection");
    if (!launchButton) throw new Error("launch button missing during inspection");

    const ancestors = [];
    let element = table.parentElement;
    for (let depth = 0; element && depth < 8; depth += 1) {
      ancestors.push({
        tag: element.tagName.toLowerCase(),
        className: element.className,
        borderTopWidth: getComputedStyle(element).borderTopWidth,
        rect: rect(element),
      });
      if (element.matches(".js-yearly-contributions")) break;
      element = element.parentElement;
    }

    return {
      scrollY: window.scrollY,
      grassTableRect: rect(table),
      launchButtonRect: rect(launchButton),
      overlayCanvasRect: rect(canvas),
      ancestors,
    };
  });
}

async function runInspect(options) {
  const bundleSource = await readBundleSource();
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    try {
      await setupPage(page, bundleSource, options.seed);
      await clickLaunchButton(page);
      await advanceOneFrame(page);
      const report = await inspectPage(page);
      console.log(JSON.stringify(report, null, 2));
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

// ---------------------------------------------------------------------------
// record mode
//
// Two passes against the same seed: pass 1 (recordPass1) runs headless with
// no screenshots, to compute the frame-accurate stats timeline, the clip
// windows, and REGION. Pass 2 (recordPass2) re-runs the identical,
// deterministic seed and takes the actual screenshots, asserting its own
// live measurements match pass 1's before trusting them.
// ---------------------------------------------------------------------------

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toFrame(t) {
  return Math.round(t * FPS) - 1;
}

function frameSeconds(frame) {
  return (frame + 1) / FPS;
}

function makeFrameEntry(frame, stats) {
  return {
    frame,
    t: frameSeconds(frame),
    state: stats.state,
    aliveBricks: stats.aliveBricks,
    totalBricks: stats.totalBricks,
    balls: stats.balls,
    paddleX: stats.paddleX,
    paddleY: stats.paddleY,
    score: stats.score,
    life: stats.life,
  };
}

/**
 * Measures the canvas rect, the bordered ancestor container (same
 * ancestor-walk algorithm `inspect` uses, but returning the matching element
 * itself rather than the whole ancestor chain), and totalBricks. Pass 1
 * stores this once; pass 2 re-measures it and must match exactly (see
 * assertGeometryMatches).
 */
async function measureGeometrySnapshot(page) {
  return page.evaluate(() => {
    function rect(element) {
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
      };
    }

    function findBorderedContainer(table) {
      let element = table.parentElement;
      for (let depth = 0; element && depth < 8; depth += 1) {
        const borderTopWidth = parseFloat(getComputedStyle(element).borderTopWidth);
        if (borderTopWidth > 0) return element;
        if (element.matches(".js-yearly-contributions")) {
          console.error("kusakuzushi-record: no bordered ancestor before .js-yearly-contributions; using it as fallback");
          return element;
        }
        element = element.parentElement;
      }
      throw new Error("bordered container not found: ancestor walk exhausted");
    }

    const table = document.querySelector("table.ContributionCalendar-grid");
    const canvas = document.querySelector("canvas");
    const game = window.__game;
    if (!table) throw new Error("contribution calendar table missing during geometry snapshot");
    if (!canvas) throw new Error("overlay canvas missing during geometry snapshot");
    if (!game) throw new Error("window.__game missing during geometry snapshot");

    return {
      canvasRect: rect(canvas),
      containerRect: rect(findBorderedContainer(table)),
      totalBricks: game.liveBricks.length,
    };
  });
}

/**
 * REGION = the union of the bordered container, the canvas, and the result
 * banner's rect computed analytically from the canvas rect (the banner
 * doesn't exist yet when this runs) -- see apps/extension/src/content.ts's
 * showResultBanner: left/top equal the canvas's own left/top, height is half
 * the canvas's height, anchored at the canvas's own vertical midpoint.
 * Rounded outward to whole CSS px so the deviceScaleFactor-2 clip is even.
 */
function computeRegion(geometry) {
  const { canvasRect, containerRect } = geometry;
  const bannerRectAnalytic = {
    left: canvasRect.left,
    top: canvasRect.top + canvasRect.height / 2,
    right: canvasRect.left + canvasRect.width,
    bottom: canvasRect.top + canvasRect.height,
    width: canvasRect.width,
    height: canvasRect.height / 2,
  };

  const rects = [containerRect, canvasRect, bannerRectAnalytic];
  const left = Math.floor(Math.min(...rects.map((r) => r.left)));
  const top = Math.floor(Math.min(...rects.map((r) => r.top)));
  const right = Math.ceil(Math.max(...rects.map((r) => r.right)));
  const bottom = Math.ceil(Math.max(...rects.map((r) => r.bottom)));

  return { left, top, right, bottom, width: right - left, height: bottom - top };
}

function assertEvenDevicePixelClip(region, seed) {
  const deviceWidth = region.width * DEVICE_SCALE_FACTOR;
  const deviceHeight = region.height * DEVICE_SCALE_FACTOR;
  if (!Number.isInteger(deviceWidth) || deviceWidth % 2 !== 0) {
    throw new Error(`[seed ${seed}] region width ${region.width} does not yield an even device-px width`);
  }
  if (!Number.isInteger(deviceHeight) || deviceHeight % 2 !== 0) {
    throw new Error(`[seed ${seed}] region height ${region.height} does not yield an even device-px height`);
  }
}

function assertGeometryMatches(pass1Geometry, pass2Geometry, seed) {
  for (const field of ["left", "top", "right", "bottom", "width", "height"]) {
    if (pass1Geometry.canvasRect[field] !== pass2Geometry.canvasRect[field]) {
      throw new Error(
        `[seed ${seed}] geometry mismatch: canvasRect.${field} pass1=${pass1Geometry.canvasRect[field]} pass2=${pass2Geometry.canvasRect[field]}`,
      );
    }
  }
  if (pass1Geometry.totalBricks !== pass2Geometry.totalBricks) {
    throw new Error(
      `[seed ${seed}] geometry mismatch: totalBricks pass1=${pass1Geometry.totalBricks} pass2=${pass2Geometry.totalBricks}`,
    );
  }
}

function assertRegionMatches(pass1Region, pass2Region, seed) {
  for (const field of ["left", "top", "right", "bottom", "width", "height"]) {
    if (pass1Region[field] !== pass2Region[field]) {
      throw new Error(`[seed ${seed}] region mismatch: ${field} pass1=${pass1Region[field]} pass2=${pass2Region[field]}`);
    }
  }
}

/**
 * Ticks `frameCount` times, collecting every frame's full stats snapshot.
 * Stops early (fewer than frameCount snapshots returned) once aliveBricks
 * hits 0 when stopOnClear is true, or unconditionally the instant state
 * becomes "gameOver" (surfaced as gameOverIndex so the caller can throw
 * immediately with a precise frame number instead of spinning to timeout).
 */
async function runRecordStatsBatch(page, frameCount, stopOnClear) {
  return page.evaluate(
    ({ frameCount, stopOnClear }) => {
      const collected = [];
      let gameOverIndex = null;
      for (let index = 0; index < frameCount; index += 1) {
        const snapshot = window.__harness.tick();
        collected.push(snapshot);
        if (snapshot.state === "gameOver") {
          gameOverIndex = index;
          break;
        }
        if (stopOnClear && snapshot.aliveBricks === 0) break;
      }
      return { collected, gameOverIndex };
    },
    { frameCount, stopOnClear },
  );
}

/**
 * Finds the 180-frame (3.0s) window with the highest mean `balls`, among
 * windows fully inside the prefix where aliveBricks stays >= 25% of
 * totalBricks (aliveBricks is monotonically non-increasing, so that prefix
 * is contiguous from frame 0). Ties break to the smallest start frame. Pads
 * the winner by +-60 frames (1s) and clamps to the run's frame range.
 */
function computePeakWindow(frames, endFrame, seed) {
  const totalBricks = frames[0].totalBricks;
  const threshold = PEAK_ALIVE_THRESHOLD_RATIO * totalBricks;

  let qualifyingEnd = -1;
  for (const entry of frames) {
    if (entry.aliveBricks >= threshold) {
      qualifyingEnd = entry.frame;
    } else {
      break;
    }
  }

  if (qualifyingEnd < PEAK_WINDOW_FRAMES - 1) {
    throw new Error(`[seed ${seed}] no valid PEAK window: 25%-alive threshold first crossed at frame ${qualifyingEnd + 1}`);
  }

  const prefixSums = new Array(frames.length + 1).fill(0);
  for (let i = 0; i < frames.length; i += 1) {
    prefixSums[i + 1] = prefixSums[i] + frames[i].balls;
  }

  let bestScore = -Infinity;
  let bestStart = null;
  for (let s = 0; s + PEAK_WINDOW_FRAMES - 1 <= qualifyingEnd; s += 1) {
    const score = (prefixSums[s + PEAK_WINDOW_FRAMES] - prefixSums[s]) / PEAK_WINDOW_FRAMES;
    if (score > bestScore) {
      bestScore = score;
      bestStart = s;
    }
  }

  return {
    startFrame: clamp(bestStart - PEAK_WINDOW_PAD_FRAMES, 0, endFrame),
    endFrame: clamp(bestStart + PEAK_WINDOW_FRAMES - 1 + PEAK_WINDOW_PAD_FRAMES, 0, endFrame),
  };
}

async function recordPass1(browser, bundleSource, seed) {
  const page = await browser.newPage();
  try {
    await setupPage(page, bundleSource, seed);
    await clickLaunchButton(page);
    const frame0Stats = await advanceOneFrame(page);

    const geometry = await measureGeometrySnapshot(page);
    const region = computeRegion(geometry);
    assertEvenDevicePixelClip(region, seed);

    const frames = [makeFrameEntry(0, frame0Stats)];
    let frame = 1;
    let clearFrame = null;

    while (clearFrame === null) {
      if (frame > RECORD_CLEAR_TIMEOUT_FRAMES) {
        throw new Error(`[seed ${seed}] aliveBricks never reached 0 within ${RECORD_CLEAR_TIMEOUT_FRAMES} frames`);
      }
      const batchStartFrame = frame;
      const batchSize = Math.min(PROBE_BATCH_FRAMES, RECORD_CLEAR_TIMEOUT_FRAMES - frame + 1);
      const { collected, gameOverIndex } = await runRecordStatsBatch(page, batchSize, true);
      for (const stats of collected) {
        frames.push(makeFrameEntry(frame, stats));
        if (stats.aliveBricks === 0) clearFrame = frame;
        frame += 1;
      }
      if (gameOverIndex !== null) {
        throw new Error(`[seed ${seed}] game reached gameOver at frame ${batchStartFrame + gameOverIndex}, expected a clear`);
      }
    }

    const endFrame = clearFrame + POST_CLEAR_HOLD_FRAMES;
    while (frame <= endFrame) {
      const batchSize = Math.min(PROBE_BATCH_FRAMES, endFrame - frame + 1);
      const { collected, gameOverIndex } = await runRecordStatsBatch(page, batchSize, false);
      for (const stats of collected) {
        frames.push(makeFrameEntry(frame, stats));
        frame += 1;
      }
      if (gameOverIndex !== null) {
        throw new Error(`[seed ${seed}] game reached gameOver during post-clear hold, at frame ${frame - collected.length + gameOverIndex}`);
      }
    }

    const clearedAt = frameSeconds(clearFrame);
    const initialLaunchFrame = await page.evaluate(() => window.__harness.initialLaunchFrame);
    if (initialLaunchFrame === null || initialLaunchFrame === undefined) {
      throw new Error(`[seed ${seed}] initialLaunchFrame was never recorded`);
    }
    const launchT = frameSeconds(initialLaunchFrame);

    const early = {
      startFrame: clamp(toFrame(launchT - EARLY_PRE_LAUNCH_SEC), 0, endFrame),
      endFrame: clamp(toFrame(launchT + EARLY_POST_LAUNCH_SEC), 0, endFrame),
    };

    const endTargetFrame = toFrame(clearedAt + END_POST_CLEAR_SEC);
    if (endTargetFrame !== endFrame) {
      throw new Error(`[seed ${seed}] END window's own endFrame ${endTargetFrame} does not equal run endFrame ${endFrame}`);
    }
    const end = {
      startFrame: clamp(toFrame(clearedAt - END_PRE_CLEAR_SEC), 0, endFrame),
      endFrame: clamp(endTargetFrame, 0, endFrame),
    };

    const peak = computePeakWindow(frames, endFrame, seed);

    const attachSeconds = (w) => ({ ...w, startT: frameSeconds(w.startFrame), endT: frameSeconds(w.endFrame) });
    const windows = { early: attachSeconds(early), peak: attachSeconds(peak), end: attachSeconds(end) };

    return { seed, launchT, clearedAt, windows, region, frames, endFrame, clearFrame, geometry };
  } finally {
    await page.close();
  }
}

/**
 * Captures whatever of {grass table, its bordered container, the overlay
 * canvas, the launch button, the result banner, the banner's やめる button,
 * the board-space anchor} exist right now, plus scrollY. Fields for anything
 * absent at this moment are `null` -- measured from the live DOM rather than
 * assumed from which of the four states (mounted/ready/result/restored) the
 * caller thinks it's in.
 */
async function captureRects(page) {
  return page.evaluate(() => {
    function rect(element) {
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
      };
    }

    function findBorderedContainer(table) {
      let element = table.parentElement;
      for (let depth = 0; element && depth < 8; depth += 1) {
        const borderTopWidth = parseFloat(getComputedStyle(element).borderTopWidth);
        if (borderTopWidth > 0) return element;
        if (element.matches(".js-yearly-contributions")) {
          console.error("kusakuzushi-record: no bordered ancestor before .js-yearly-contributions; using it as fallback");
          return element;
        }
        element = element.parentElement;
      }
      throw new Error("bordered container not found: ancestor walk exhausted");
    }

    if (window.scrollY !== 0) throw new Error(`scrollY expected 0, got ${window.scrollY}`);

    const table = document.querySelector("table.ContributionCalendar-grid");
    if (!table) throw new Error("contribution calendar table missing during rects capture");
    const banner = document.getElementById("kusakuzushi-result-banner");
    const quitButton = banner ? (banner.querySelectorAll("button")[1] ?? null) : null;

    return {
      scrollY: window.scrollY,
      grassTableRect: rect(table),
      containerRect: rect(findBorderedContainer(table)),
      boardSpaceAnchorRect: rect(table.parentElement),
      launchButtonRect: rect(document.getElementById("kusakuzushi-launch")),
      overlayCanvasRect: rect(document.querySelector("canvas")),
      resultBannerRect: rect(banner),
      resultBannerQuitButtonRect: rect(quitButton),
    };
  });
}

/**
 * Takes ONE clipped screenshot for `frame` if it falls inside any window,
 * writing the same buffer into every matching window's own gapless frame
 * sequence (a per-window counter, not the absolute frame number).
 */
async function captureIfInWindow(page, frame, windows, region, windowCounters) {
  const matches = RECORD_WINDOW_NAMES.filter((name) => frame >= windows[name].startFrame && frame <= windows[name].endFrame);
  if (matches.length === 0) return;

  const buffer = await page.screenshot({
    clip: { x: region.left, y: region.top, width: region.width, height: region.height },
    captureBeyondViewport: false,
    optimizeForSpeed: true,
  });
  for (const name of matches) {
    const index = windowCounters[name];
    windowCounters[name] += 1;
    await writeFile(path.join(FRAMES_DIR, name, `f${String(index).padStart(5, "0")}.png`), buffer);
  }
}

async function recordPass2(browser, bundleSource, seed, pass1) {
  const { windows, region, geometry: geometry1, endFrame, clearFrame } = pass1;
  const page = await browser.newPage();
  try {
    await setupPage(page, bundleSource, seed);

    // installDeterminismStubs shares ONE lcg between window.Math.random and
    // DEFAULT_CONFIG.random (the game's own injected randomness) -- core's
    // renderer.ts also calls the bare global Math.random() for particle
    // bursts, so that sharing is load-bearing for reproducing pass 1 exactly
    // and must not change. But the real sleeps below (needed for the hover
    // CSS transition to settle) hand the live page's own background JS real
    // wall-clock time, and if any of it calls Math.random() during that
    // window it silently steals an LCG tick before the game ever starts,
    // desyncing this whole pass from pass 1 (seen empirically: lcgCalls()
    // already differed by frame 0). Parking window.Math.random on a
    // disposable decoy for just this pre-click, real-time window -- and
    // restoring the real lcg right before clicking -- keeps background
    // noise off it without touching DEFAULT_CONFIG.random or
    // installDeterminismStubs, so probe/inspect and the click-onward
    // sequence are unaffected.
    await page.evaluate(() => {
      let decoyState = 0x2545f491;
      window.Math.random = () => {
        decoyState = (decoyState * 1103515245 + 12345) >>> 0;
        return decoyState / 4294967296;
      };
    });

    await page.mouse.move(5, 5);
    const rects = { mounted: await captureRects(page) };
    await page.screenshot({ path: path.join(ASSETS_DIR, "mounted.png") });

    const launchButtonCenter = await page.evaluate(() => {
      const r = document.getElementById("kusakuzushi-launch").getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    await page.mouse.move(launchButtonCenter.x, launchButtonCenter.y);
    await sleep(REAL_HOVER_SETTLE_MS);
    await page.screenshot({ path: path.join(ASSETS_DIR, "button-hover.png") });

    await page.mouse.move(5, 5);
    await sleep(REAL_HOVER_SETTLE_MS);

    // clickLaunchButton restores window.Math.random = window.__harness.lcg
    // atomically with the click itself (see its own comment) -- no separate
    // restore call needed here.
    await clickLaunchButton(page);
    await advanceOneFrame(page);

    const geometry2 = await measureGeometrySnapshot(page);
    assertGeometryMatches(geometry1, geometry2, seed);
    const region2 = computeRegion(geometry2);
    assertEvenDevicePixelClip(region2, seed);
    assertRegionMatches(region, region2, seed);

    rects.ready = await captureRects(page);
    await page.screenshot({ path: path.join(ASSETS_DIR, "ready.png") });

    await mkdir(FRAMES_DIR, { recursive: true });
    for (const name of RECORD_WINDOW_NAMES) {
      await mkdir(path.join(FRAMES_DIR, name), { recursive: true });
    }
    const windowCounters = { early: 0, peak: 0, end: 0 };

    // Frame 0 (the tick that produced "ready", captured above) can itself
    // fall inside a window -- EARLY starts at launchT-0.5s, which clamps to
    // frame 0 for this seed -- so it must be checked here too, not just
    // inside the frame-1..endFrame loop below.
    await captureIfInWindow(page, 0, windows, region, windowCounters);

    let observedClearFrame = null;
    for (let frame = 1; frame <= endFrame; frame += 1) {
      const stats = await advanceOneFrame(page);
      if (observedClearFrame === null && stats.aliveBricks === 0) observedClearFrame = frame;
      await captureIfInWindow(page, frame, windows, region, windowCounters);
    }

    if (observedClearFrame !== clearFrame) {
      throw new Error(`[seed ${seed}] pass 2 clearFrame ${observedClearFrame} does not match pass 1 clearFrame ${clearFrame}`);
    }

    rects.result = await captureRects(page);
    if (!rects.result.resultBannerRect || !rects.result.resultBannerQuitButtonRect) {
      throw new Error(`[seed ${seed}] result banner or its やめる button missing at endFrame`);
    }
    await page.screenshot({ path: path.join(ASSETS_DIR, "result.png") });

    const quitButtonCenter = await page.evaluate(() => {
      const btn = document.querySelectorAll("#kusakuzushi-result-banner button")[1];
      if (!btn) throw new Error("result banner's second button (やめる) not found");
      const r = btn.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    await page.mouse.move(quitButtonCenter.x, quitButtonCenter.y);
    await sleep(REAL_HOVER_SETTLE_MS);
    await page.screenshot({ path: path.join(ASSETS_DIR, "result-quit-hover.png") });
    await page.mouse.click(quitButtonCenter.x, quitButtonCenter.y);

    await page.mouse.move(5, 5);
    await sleep(REAL_HOVER_SETTLE_MS);
    const restoredCheck = await page.evaluate(() => ({
      hasCanvas: document.querySelector("canvas") !== null,
      hasBanner: document.getElementById("kusakuzushi-result-banner") !== null,
      launchButtonText: document.getElementById("kusakuzushi-launch")?.textContent ?? null,
    }));
    if (restoredCheck.hasCanvas || restoredCheck.hasBanner || restoredCheck.launchButtonText !== "🎮 崩す") {
      throw new Error(`[seed ${seed}] restored state check failed: ${JSON.stringify(restoredCheck)}`);
    }
    rects.restored = await captureRects(page);
    await page.screenshot({ path: path.join(ASSETS_DIR, "restored.png") });

    const clipFrameCounts = {};
    for (const name of RECORD_WINDOW_NAMES) {
      const dir = path.join(FRAMES_DIR, name);
      const files = (await readdir(dir)).sort();
      if (files.length === 0) {
        throw new Error(`[seed ${seed}] window "${name}" captured 0 frames`);
      }

      await copyFile(path.join(dir, files[0]), path.join(ASSETS_DIR, `ext-${name}-first.png`));
      await copyFile(path.join(dir, files[files.length - 1]), path.join(ASSETS_DIR, `ext-${name}-last.png`));

      await execFileAsync("ffmpeg", [
        "-y",
        "-framerate", String(FPS),
        "-i", path.join(dir, "f%05d.png"),
        "-c:v", "libx264",
        "-crf", "14",
        "-pix_fmt", "yuv420p",
        "-an",
        path.join(ASSETS_DIR, `ext-${name}.mp4`),
      ]);
      await rm(dir, { recursive: true, force: true });
      clipFrameCounts[name] = files.length;
    }

    return { rects, clipFrameCounts };
  } finally {
    await page.close();
  }
}

function printRecordSummary(seed, pass1, pass2) {
  const { region } = pass1;
  console.log(
    JSON.stringify(
      {
        seed,
        launchT: pass1.launchT,
        clearedAt: pass1.clearedAt,
        windows: pass1.windows,
        region: {
          css: region,
          devicePx: {
            left: region.left * DEVICE_SCALE_FACTOR,
            top: region.top * DEVICE_SCALE_FACTOR,
            right: region.right * DEVICE_SCALE_FACTOR,
            bottom: region.bottom * DEVICE_SCALE_FACTOR,
            width: region.width * DEVICE_SCALE_FACTOR,
            height: region.height * DEVICE_SCALE_FACTOR,
          },
        },
        clipFrameCounts: pass2.clipFrameCounts,
      },
      null,
      2,
    ),
  );
}

async function runRecord(options) {
  const bundleSource = await readBundleSource();
  await mkdir(ASSETS_DIR, { recursive: true });
  await rm(FRAMES_DIR, { recursive: true, force: true });

  const browser = await launchBrowser();
  let completed = false;
  try {
    const pass1 = await recordPass1(browser, bundleSource, options.seed);
    const pass2 = await recordPass2(browser, bundleSource, options.seed, pass1);

    await writeFile(
      path.join(ASSETS_DIR, "stats.json"),
      JSON.stringify(
        {
          seed: options.seed,
          launchT: pass1.launchT,
          clearedAt: pass1.clearedAt,
          windows: pass1.windows,
          region: pass1.region,
          fps: FPS,
          frames: pass1.frames,
        },
        null,
        2,
      ),
    );
    await writeFile(path.join(ASSETS_DIR, "rects.json"), JSON.stringify(pass2.rects, null, 2));

    printRecordSummary(options.seed, pass1, pass2);
    completed = true;
  } finally {
    await browser.close();
    await rm(FRAMES_DIR, { recursive: true, force: true });
    if (!completed) {
      await rm(ASSETS_DIR, { recursive: true, force: true });
      console.error(`[seed ${options.seed}] record failed; removed partial output from assets/ext`);
    }
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.mode === "probe") {
    await runProbe(options);
  } else if (options.mode === "record") {
    await runRecord(options);
  } else {
    await runInspect(options);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
