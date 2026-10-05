import { access, mkdir, rename } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIRECTORY = path.resolve(SCRIPT_DIRECTORY, "..");
const BASE_URL_VALUE = process.env.CUTSTEWARD_BASE_URL || "http://127.0.0.1:4173";
const BASE_URL_OBJECT = new URL(BASE_URL_VALUE);
const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "[::1]"]);
if (BASE_URL_OBJECT.protocol !== "http:" || !LOOPBACK_HOSTS.has(BASE_URL_OBJECT.hostname)) {
  throw new Error("CUTSTEWARD_BASE_URL must be an HTTP loopback URL.");
}
if (BASE_URL_OBJECT.username || BASE_URL_OBJECT.password || BASE_URL_OBJECT.search || BASE_URL_OBJECT.hash) {
  throw new Error("CUTSTEWARD_BASE_URL must not include credentials, query parameters, or a fragment.");
}
const BASE_URL = BASE_URL_OBJECT.origin;
const BROWSER_PATH = process.env.CUTSTEWARD_CHROME_PATH;
const OUTPUT_DIRECTORY = path.join(PROJECT_DIRECTORY, "assets", "screen-recordings");
const DRY_RUN = process.argv.includes("--dry-run");
const ONLY = process.argv.find((argument) => argument.startsWith("--only="))?.slice("--only=".length);
const VERIFIED_RUN_ID = process.env.CUTSTEWARD_VERIFIED_RUN_ID;
const VIEWPORT = { width: 1600, height: 900 };

if (!BROWSER_PATH) {
  throw new Error("CUTSTEWARD_CHROME_PATH is required.");
}

await access(BROWSER_PATH, constants.X_OK);
await mkdir(OUTPUT_DIRECTORY, { recursive: true });

const cursorCss = `
  html { scroll-behavior: smooth !important; }
  * { cursor: none !important; }
  #cutsteward-demo-cursor {
    position: fixed;
    left: 0;
    top: 0;
    width: 24px;
    height: 24px;
    border: 2px solid rgba(245, 241, 232, 0.96);
    border-radius: 999px;
    background: rgba(205, 186, 145, 0.36);
    box-shadow: 0 3px 16px rgba(11, 12, 15, 0.42);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 2147483647;
  }
  #cutsteward-demo-cursor.is-clicking {
    background: rgba(205, 186, 145, 0.78);
    transform: translate(-50%, -50%) scale(0.78);
  }
  .cutsteward-demo-ripple {
    position: fixed;
    width: 38px;
    height: 38px;
    border: 2px solid rgba(205, 186, 145, 0.72);
    border-radius: 999px;
    transform: translate(-50%, -50%) scale(0.4);
    opacity: 0;
    pointer-events: none;
    z-index: 2147483646;
    animation: cutsteward-demo-ripple 420ms ease-out both;
  }
  @keyframes cutsteward-demo-ripple {
    0% { opacity: 0.9; transform: translate(-50%, -50%) scale(0.4); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(1.7); }
  }
`;

async function installCursor(page) {
  await page.addStyleTag({ content: cursorCss });
  await page.evaluate(() => {
    const old = document.getElementById("cutsteward-demo-cursor");
    old?.remove();
    const cursor = document.createElement("div");
    cursor.id = "cutsteward-demo-cursor";
    document.body.append(cursor);
    document.addEventListener("mousemove", (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    document.addEventListener("mousedown", (event) => {
      cursor.classList.add("is-clicking");
      const ripple = document.createElement("div");
      ripple.className = "cutsteward-demo-ripple";
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      document.body.append(ripple);
      window.setTimeout(() => ripple.remove(), 500);
    });
    document.addEventListener("mouseup", () => cursor.classList.remove("is-clicking"));
  });
  await page.mouse.move(144, 965);
}

async function goto(page, route, expectedText) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 15_000 });
  await page.getByText(expectedText, { exact: false }).first().waitFor({ state: "visible", timeout: 12_000 });
  await installCursor(page);
  await page.waitForTimeout(650);
}

async function moveTo(page, locator, options = {}) {
  const box = await locator.boundingBox();
  if (!box) throw new Error(`Target has no visible box: ${options.label || "unknown"}`);
  const x = box.x + box.width * (options.xFraction ?? 0.5);
  const y = box.y + box.height * (options.yFraction ?? 0.5);
  await page.mouse.move(x, y, { steps: options.steps ?? 18 });
  await page.waitForTimeout(options.pauseMs ?? 260);
  return { x, y };
}

async function clickVisible(page, locator, label) {
  await moveTo(page, locator, { label });
  await locator.click();
  await page.waitForTimeout(380);
}

async function ensureAbsent(filePath) {
  try {
    await access(filePath, constants.F_OK);
  } catch {
    return;
  }
  throw new Error(`Refusing to overwrite existing recording: ${filePath}`);
}

async function recordTake(browser, take) {
  const outputPath = path.join(OUTPUT_DIRECTORY, take.file);
  if (!DRY_RUN) await ensureAbsent(outputPath);
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    colorScheme: "dark",
    reducedMotion: "no-preference",
    ...(DRY_RUN ? {} : { recordVideo: { dir: OUTPUT_DIRECTORY, size: VIEWPORT } })
  });
  await context.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());
    const localHttp = requestUrl.protocol === "http:" && LOOPBACK_HOSTS.has(requestUrl.hostname);
    const embedded = ["about:", "blob:", "data:"].includes(requestUrl.protocol);
    if (localHttp || embedded) {
      await route.continue();
      return;
    }
    await route.abort("blockedbyclient");
  });
  const page = await context.newPage();
  const video = page.video();
  try {
    await take.run(page);
  } finally {
    await context.close();
  }
  if (!DRY_RUN && video) {
    const temporaryPath = await video.path();
    await rename(temporaryPath, outputPath);
  }
  return outputPath;
}

const tutorialPrompt = "Create a 30-second 16:9 CutSteward product tutorial in English. Use authentic screen recordings, keep approvals visible, and deliver a verified master.";

const takes = [
  {
    file: "01-home-guided.webm",
    async run(page) {
      await goto(page, "/", "What should we make?");
      const outcome = page.locator("#outcome");
      await outcome.fill(tutorialPrompt);
      await page.waitForTimeout(900);
      const guided = page.locator("button.composer-action").filter({ hasText: "Guided" });
      await clickVisible(page, guided, "Guided mode button");
      await page.getByRole("dialog", { name: "How should it work?" }).waitFor({ state: "visible" });
      await moveTo(page, page.getByRole("button", { name: /Autonomous/ }), { label: "Autonomous option", pauseMs: 520 });
      await moveTo(page, page.getByRole("button", { name: /Guided/ }).last(), { label: "Guided option", pauseMs: 620 });
      await clickVisible(page, page.getByRole("button", { name: "Close" }), "Close mode sheet");
      await page.waitForTimeout(750);
    }
  },
  {
    file: "02-rights-preflight.webm",
    async run(page) {
      await goto(page, "/runs/run-mskn2p9m-8b93d6", "Confirm the Director route");
      await page.waitForTimeout(600);
      const rights = page.getByText("I may use the requested and attached material", { exact: false });
      await clickVisible(page, rights, "Rights confirmation");
      await moveTo(page, page.getByRole("button", { name: /Confirm & open workspace/ }), { label: "Confirm and open workspace", pauseMs: 950 });
      await page.waitForTimeout(700);
    }
  },
  {
    file: "03-plan-inspection.webm",
    async run(page) {
      await goto(page, "/runs/run-mskwuo17-9c45a9a1", "Building your film");
      const productBeat = page.getByRole("button", { name: /^Product,/ });
      await clickVisible(page, productBeat, "Product story beat");
      const shotEleven = page.getByRole("button", { name: /^Shot 11,/ });
      await clickVisible(page, shotEleven, "Shot 11");
      await page.waitForTimeout(1150);
    }
  },
  {
    file: "04-verified-delivery-public.webm",
    async run(page) {
      if (!VERIFIED_RUN_ID) {
        throw new Error("CUTSTEWARD_VERIFIED_RUN_ID is required for the public delivery take.");
      }
      await goto(page, `/runs/${VERIFIED_RUN_ID}`, "Your verified package is ready");
      await page.waitForTimeout(600);
      const media = page.locator("video");
      await media.waitFor({ state: "visible", timeout: 8_000 });
      await media.evaluate(async (element) => {
        element.muted = true;
        element.currentTime = 0;
        await new Promise((resolve) => {
          const finish = () => resolve(undefined);
          element.addEventListener("seeked", finish, { once: true });
          window.setTimeout(finish, 900);
        });
        try { await element.play(); } catch { /* the visible frame still proves the artifact */ }
      });
      await page.waitForTimeout(1800);
      await media.evaluate((element) => element.pause());
      const evidence = page.getByRole("button", { name: "Evidence" });
      await clickVisible(page, evidence, "Evidence");
      await page.getByRole("dialog", { name: "Artifact evidence" }).waitFor({ state: "visible" });
      await page.waitForTimeout(6500);
    }
  }
];

const browser = await chromium.launch({
  executablePath: BROWSER_PATH,
  headless: true,
  args: ["--autoplay-policy=no-user-gesture-required", "--hide-scrollbars"]
});

try {
  const selectedTakes = ONLY ? takes.filter((take) => take.file.startsWith(ONLY)) : takes;
  if (!selectedTakes.length) throw new Error(`No take matches --only=${ONLY}`);
  for (const take of selectedTakes) {
    const outputPath = await recordTake(browser, take);
    console.log(`${DRY_RUN ? "verified" : "recorded"}: ${path.relative(process.cwd(), outputPath)}`);
  }
} finally {
  await browser.close();
}
