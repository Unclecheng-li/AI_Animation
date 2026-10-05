// Attach via CDP and capture high-res stills of each key UI state.
// Static images + HTML animation > video recording for a tight demo.
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "..", "assets");
const stillsDir = path.join(assetsDir, "stills");
fs.mkdirSync(stillsDir, { recursive: true });
const ctx = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "workspace-context.json"), "utf8"));

const browser = await chromium.connectOverCDP("http://localhost:9222");
const context = browser.contexts()[0];
const page = context.pages()[0];
await page.setViewportSize({ width: 1920, height: 1080 }).catch(() => {});

const snap = async (name, waitMs = 2500) => {
  await page.waitForTimeout(waitMs);
  const p = path.join(stillsDir, `${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  console.log(`  [still] ${name}`);
};

const goto = async (url, waitMs = 6000) => {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(waitMs);
};

// Dismiss the "ClickUp needs your permission to send notifications" banner if present.
// It shows on every page-load; clicking Remind Me keeps it dismissed for a few hours,
// clicking X closes it. Either works for still captures.
const dismissBanner = async () => {
  try {
    const x = page.locator('button:has-text("Remind me")').first();
    if (await x.isVisible({ timeout: 1500 }).catch(() => false)) {
      await x.click();
      await page.waitForTimeout(500);
    }
  } catch {}
};

// ==================== FLOW 1: LIST VIEW ====================
await goto(ctx.listUrl, 7000);
await dismissBanner();
await snap("01-list-clean");

// Hover over a mid-list task to catch the row highlight state
try {
  const taskRow = page.locator('[data-test^="task-row"], [data-cy^="task-row"], .cu-task-row__task-name').first();
  await taskRow.hover({ timeout: 3000 });
  await snap("02-list-hover", 700);
} catch (e) {
  console.log(`  [still] hover skipped: ${e.message.split("\n")[0]}`);
}

// ==================== FLOW 2: BOARD VIEW ====================
await goto(ctx.boardUrl, 7000);
await dismissBanner();
await snap("03-board-clean");

// Hover over a Board card
try {
  const card = page.locator('.cu-board-column-row, [class*="board-card"], [class*="board-task"]').first();
  await card.hover({ timeout: 3000 });
  await snap("04-board-hover", 700);
} catch (e) {
  console.log(`  [still] board hover skipped: ${e.message.split("\n")[0]}`);
}

// ==================== FLOW 3: TASK DETAIL ====================
// Open a task with rich content (subtasks + comments). "Record demo video" has 4 subtasks.
// Click via locator pointing to its title.
try {
  const namedTask = page.locator('text=/Record demo video/').first();
  if (await namedTask.isVisible({ timeout: 3000 }).catch(() => false)) {
    await namedTask.click();
    await page.waitForTimeout(6000);
    await dismissBanner();
    await snap("05-task-detail", 1500);

    // Scroll the task modal/panel down a little to surface subtasks + comments
    await page.mouse.wheel(0, 400);
    await snap("06-task-detail-scrolled", 1200);

    // Close the task detail (Escape is the standard ClickUp hotkey)
    await page.keyboard.press("Escape");
    await page.waitForTimeout(2000);
  }
} catch (e) {
  console.log(`  [still] task detail skipped: ${e.message.split("\n")[0]}`);
}

// ==================== FLOW 4: BRAIN / AI ====================
await goto(`https://app.clickup.com/${ctx.teamId}/ai/brain`, 7000);
await dismissBanner();
await snap("07-brain-clean");

// Hover the input to get the focus state
try {
  const brainInput = page.locator('[contenteditable="true"], textarea, [placeholder*="Ask"], [placeholder*="mention"]').first();
  await brainInput.click({ timeout: 3000 });
  await page.waitForTimeout(500);
  await snap("08-brain-focused", 800);

  // Type a realistic query. Don't submit — we just want the visual state.
  await page.keyboard.type("Summarize the Q2 Product Launch", { delay: 45 });
  await snap("09-brain-typed", 600);
} catch (e) {
  console.log(`  [still] brain interactions skipped: ${e.message.split("\n")[0]}`);
}

// ==================== FLOW 5: SIDEBAR-ONLY / WIDE SHOT ====================
// Pan back to the list for the hero/wide shot if we want a different crop later.
await goto(ctx.listUrl, 6000);
await dismissBanner();
await snap("10-list-hero");

console.log(`  [still] done. Output: ${stillsDir}`);
await browser.close(); // detach CDP only
