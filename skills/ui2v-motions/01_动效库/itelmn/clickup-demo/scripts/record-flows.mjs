// Record three live ClickUp flows for the v4 composition.
//
// Produces:
//   assets/recordings/raw/views.webm   (List → Board switch + pan)
//   assets/recordings/raw/task.webm    (Open task → priority → comment → subtasks)
//   assets/recordings/raw/brain.webm   (Type prompt → real Brain response)
//
// Uses .playwright-profile/ (same dir as open-for-login.mjs) so the ClickUp
// session cookies carry over. Close open-for-login before running this —
// Playwright persistent profile is a one-browser-at-a-time thing.
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const profileDir = path.resolve(projectRoot, ".playwright-profile");
const rawDir = path.resolve(projectRoot, "assets", "recordings", "raw");
fs.mkdirSync(rawDir, { recursive: true });

const ctx = JSON.parse(
  fs.readFileSync(path.resolve(projectRoot, "workspace-context.json"), "utf8"),
);

const context = await chromium.launchPersistentContext(profileDir, {
  headless: false,
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: rawDir, size: { width: 1920, height: 1080 } },
  args: [
    "--window-size=1920,1080",
    "--window-position=40,40",
    "--disable-blink-features=AutomationControlled",
  ],
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ClickUp's permission banner is a full-width bar at the top. We hide it via
// CSS injection because finding a reliable click target across ClickUp DOM
// variations is brittle. This runs on every dismissBanner call so it catches
// the banner after navigations / view switches.
const dismissBanner = async (page) => {
  await page
    .evaluate(() => {
      // 1. Try the style-injection nuke: hide any top-anchored banner whose
      //    text contains the notification-permission copy.
      const marker = "ClickUp needs your permission";
      const bannerEls = Array.from(document.querySelectorAll("*")).filter(
        (el) => {
          if (el.children.length > 40) return false;
          const txt = el.textContent || "";
          if (!txt.includes(marker)) return false;
          const rect = el.getBoundingClientRect();
          return (
            rect.top < 80 && rect.width > 600 && rect.height > 20 && rect.height < 120
          );
        },
      );
      // Walk up to a reasonable banner container and hide it.
      for (const el of bannerEls) {
        let target = el;
        for (let i = 0; i < 6; i++) {
          const r = target.getBoundingClientRect();
          if (r.top < 80 && r.width > 1000 && r.height < 120) {
            target.style.display = "none";
            break;
          }
          if (!target.parentElement) break;
          target = target.parentElement;
        }
      }
    })
    .catch(() => {});
};

// Wait for the ClickUp list UI to really be interactive (the known task name
// exists in the DOM). Doesn't throw on timeout — we surface via caller checks.
const waitForList = async (page, timeoutMs = 18000) => {
  try {
    await page
      .locator("text=/Record demo video/")
      .first()
      .waitFor({ timeout: timeoutMs });
    return true;
  } catch {
    return false;
  }
};

const saveVideo = async (page, targetName) => {
  await page.close();
  const video = page.video();
  if (!video) {
    console.error(`  [record] no video for ${targetName}`);
    return;
  }
  const original = await video.path();
  const target = path.join(rawDir, `${targetName}.webm`);
  for (let i = 0; i < 8; i++) {
    try {
      if (fs.existsSync(target)) fs.unlinkSync(target);
      fs.renameSync(original, target);
      const size = fs.statSync(target).size;
      console.log(
        `  [record] saved ${targetName}.webm (${(size / 1024 / 1024).toFixed(1)} MB)`,
      );
      return;
    } catch {
      await wait(400);
    }
  }
  console.error(`  [record] rename failed for ${targetName}`);
};

// ========================================================================
// FLOW A — VIEWS
// ========================================================================
const recordViews = async () => {
  console.log("  [record] flow A: views");
  const page = await context.newPage();
  await page.goto(ctx.listUrl, { waitUntil: "domcontentloaded" });
  await wait(2000);
  await dismissBanner(page);

  const listReady = await waitForList(page, 18000);
  console.log(`  [record] list ready: ${listReady}`);
  await wait(800);
  await dismissBanner(page);

  // Cursor nudge in, hover a row
  await page.mouse.move(960, 540, { steps: 20 });
  await wait(500);
  try {
    const row = page.locator("text=/Record demo video/").first();
    await row.hover({ timeout: 3000, force: true });
  } catch (e) {
    console.log(`  [record] row hover: ${e.message.split("\n")[0]}`);
  }
  await wait(1200);

  // Mini scroll to show life
  await page.mouse.wheel(0, 300);
  await wait(700);
  await page.mouse.wheel(0, -250);
  await wait(600);

  // Switch to Board view via direct navigation + wait for board-specific UI.
  await page.goto(ctx.boardUrl, { waitUntil: "domcontentloaded" });
  await wait(1500);
  let boardReady = false;
  try {
    await page
      .locator(
        '[class*="cu-board-column"], [class*="board-column"], [class*="BoardColumn"], [data-test*="board-column"]',
      )
      .first()
      .waitFor({ timeout: 12000 });
    boardReady = true;
  } catch {}
  console.log(`  [record] board ready: ${boardReady}`);
  await wait(1500);
  await dismissBanner(page);

  // Hover a card
  try {
    const card = page
      .locator(
        '[class*="cu-board-column-row"], [class*="board-card"], [class*="board-task"], [class*="cu-board-task"]',
      )
      .first();
    await card.hover({ timeout: 3000, force: true });
  } catch (e) {
    console.log(`  [record] card hover: ${e.message.split("\n")[0]}`);
  }
  await wait(1000);

  // Horizontal pan across board
  await page.mouse.move(960, 540, { steps: 10 });
  await page.mouse.wheel(500, 0);
  await wait(900);
  await page.mouse.wheel(-250, 0);
  await wait(700);

  await saveVideo(page, "views");
};

// ========================================================================
// FLOW B — TASK DETAIL
// ========================================================================
const recordTask = async () => {
  console.log("  [record] flow B: task");
  const page = await context.newPage();
  await page.goto(ctx.listUrl, { waitUntil: "domcontentloaded" });
  await wait(2000);
  await dismissBanner(page);

  const listReady = await waitForList(page, 20000);
  if (!listReady) {
    console.log("  [record] list never loaded — aborting task flow");
    await saveVideo(page, "task");
    return;
  }
  await wait(1000);
  await dismissBanner(page);

  // Open "Record demo video". Try multiple click strategies — ClickUp's
  // row wraps the task name in several non-clickable spans.
  let opened = false;
  const openStrategies = [
    async () => {
      const el = page.locator("text=/Record demo video/").first();
      await el.click({ timeout: 4000, force: true });
    },
    async () => {
      // Click via JS evaluate — most robust when elements are occluded
      await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll("*"));
        const named = all.find(
          (el) =>
            el.textContent?.trim() === "Record demo video" &&
            el.children.length === 0,
        );
        if (!named) throw new Error("task name node not found");
        // Walk up to a clickable row ancestor
        let target = named;
        for (let i = 0; i < 8; i++) {
          if (
            target.getAttribute("role") === "button" ||
            (target.className &&
              typeof target.className === "string" &&
              /row|task/i.test(target.className))
          ) {
            target.click();
            return;
          }
          if (!target.parentElement) break;
          target = target.parentElement;
        }
        named.click();
      });
    },
    async () => {
      // Keyboard shortcut: ClickUp honors Space to open the focused task
      const row = page.locator("text=/Record demo video/").first();
      await row.focus({ timeout: 2000 }).catch(() => {});
      await page.keyboard.press("Space");
    },
  ];
  for (const strat of openStrategies) {
    try {
      await strat();
      await wait(1500);
      // Check if task detail panel appeared
      const detailAppeared = await page
        .locator(
          '[class*="cu-task-detail"], [class*="TaskModal"], [class*="task-hero"], [class*="task-view"], [data-test*="task-view"], [data-cy*="task-view"]',
        )
        .first()
        .isVisible({ timeout: 2500 })
        .catch(() => false);
      if (detailAppeared) {
        opened = true;
        break;
      }
    } catch (e) {
      console.log(`  [record] open strategy failed: ${e.message.split("\n")[0]}`);
    }
  }
  if (!opened) {
    console.log("  [record] all task-open strategies failed, keeping recording");
  }

  // Wait for the task detail modal to render
  let detailReady = false;
  try {
    await page
      .locator(
        '[class*="cu-task-detail"], [class*="TaskModal"], [class*="task-hero"], [data-test*="task-view"]',
      )
      .first()
      .waitFor({ timeout: 8000 });
    detailReady = true;
  } catch {}
  console.log(`  [record] detail ready: ${detailReady}`);
  await wait(1800);
  await dismissBanner(page);

  // Priority — open & close
  try {
    const pri = page
      .locator(
        'button:has-text("Urgent"), [data-test*="priority"], [aria-label*="Priority"], [class*="priority-selector"]',
      )
      .first();
    await pri.click({ timeout: 3000 });
    await wait(1000);
    await page.keyboard.press("Escape");
  } catch (e) {
    console.log(`  [record] priority: ${e.message.split("\n")[0]}`);
  }
  await wait(900);

  // Scroll down the panel content
  await page.mouse.move(1300, 540, { steps: 10 });
  await page.mouse.wheel(0, 500);
  await wait(1100);

  // Type a comment
  try {
    const commentBox = page
      .locator(
        '[contenteditable="true"][data-placeholder*="comment" i], [contenteditable="true"][placeholder*="comment" i], [data-test*="comment-input"], [class*="comment-input"] [contenteditable="true"], [class*="comment-editor"] [contenteditable="true"]',
      )
      .first();
    await commentBox.click({ timeout: 3500 });
    await wait(400);
    await page.keyboard.type("Locked in for Q2 — let's ship.", { delay: 55 });
  } catch (e) {
    console.log(`  [record] comment: ${e.message.split("\n")[0]}`);
  }
  await wait(1400);

  // Scroll back up to reveal subtasks area then check one
  await page.mouse.wheel(0, -700);
  await wait(800);
  try {
    const checkbox = page
      .locator(
        '[class*="subtask"] [role="checkbox"][aria-checked="false"], [class*="subtask"] input[type="checkbox"]:not(:checked)',
      )
      .first();
    await checkbox.click({ timeout: 3000, force: true });
  } catch (e) {
    console.log(`  [record] subtask check: ${e.message.split("\n")[0]}`);
  }
  await wait(1500);

  await saveVideo(page, "task");
};

// ========================================================================
// FLOW C — BRAIN
// ========================================================================
const recordBrain = async () => {
  console.log("  [record] flow C: brain");
  const page = await context.newPage();
  await page.goto(`https://app.clickup.com/${ctx.teamId}/ai/brain`, {
    waitUntil: "domcontentloaded",
  });
  await wait(3500);
  await dismissBanner(page);

  // Wait for the Brain input to appear
  let brainReady = false;
  try {
    await page
      .locator('[contenteditable="true"], textarea')
      .first()
      .waitFor({ timeout: 15000 });
    brainReady = true;
  } catch {}
  console.log(`  [record] brain input ready: ${brainReady}`);
  await wait(800);

  await page.mouse.move(960, 540, { steps: 25 });
  await wait(400);

  try {
    const input = page
      .locator('[contenteditable="true"], textarea')
      .first();
    await input.click({ timeout: 3500 });
    await wait(500);

    await page.keyboard.type("Summarize the Q2 Product Launch", { delay: 65 });
    await wait(800);
    await page.keyboard.press("Enter");

    // Wait for Brain: poll for "Working on it..." placeholder to disappear
    // (Brain resets the input placeholder once the response is done).
    const start = Date.now();
    const maxMs = 32000;
    let done = false;
    let checks = 0;
    while (Date.now() - start < maxMs) {
      checks++;
      // Check for working-on-it placeholder still being present.
      const working = await page
        .evaluate(() => {
          const text = document.body.innerText;
          return (
            text.includes("Working on it") || text.includes("Thinking") || text.includes("Evaluating")
          );
        })
        .catch(() => true);
      if (!working && Date.now() - start > 8000) {
        // No thinking signal and at least 8s have passed — response is in.
        done = true;
        break;
      }
      await wait(700);
    }
    console.log(
      `  [record] brain wait: ${((Date.now() - start) / 1000).toFixed(1)}s over ${checks} checks, done=${done}`,
    );
    await wait(1500);
  } catch (e) {
    console.log(`  [record] brain: ${e.message.split("\n")[0]}`);
  }

  await saveVideo(page, "brain");
};

try {
  await recordViews();
  await wait(500);
  await recordTask();
  await wait(500);
  await recordBrain();
} catch (err) {
  console.error("  [record] fatal:", err);
} finally {
  console.log("  [record] closing context...");
  await context.close();
  // Clean up any orphan auto-named recordings (e.g. the blank initial page)
  for (const f of fs.readdirSync(rawDir)) {
    if (f.startsWith("page@") && f.endsWith(".webm")) {
      try {
        fs.unlinkSync(path.join(rawDir, f));
      } catch {}
    }
  }
  const files = fs.readdirSync(rawDir).filter((f) => f.endsWith(".webm"));
  console.log("  [record] files in raw/:");
  for (const f of files) {
    const size = fs.statSync(path.join(rawDir, f)).size;
    console.log(
      `    - ${f} (${(size / 1024 / 1024).toFixed(1)} MB)`,
    );
  }
  console.log("  [record] done.");
}
