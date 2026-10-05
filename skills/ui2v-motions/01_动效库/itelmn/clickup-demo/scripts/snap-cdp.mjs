// Attach via CDP, visit each view of the populated list, screenshot it.
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "..", "renders", "inventory");
const ctx = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "workspace-context.json"), "utf8"));

const browser = await chromium.connectOverCDP("http://localhost:9222");
const context = browser.contexts()[0];
const page = context.pages()[0];

// Ensure the page viewport matches our render resolution. CDP-attached pages
// keep the window size from the launcher, which we set to 1920x1080 already.
await page.setViewportSize({ width: 1920, height: 1080 }).catch(() => {});

const snap = async (name, url, waitMs = 6000) => {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(waitMs);
  const p = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: p });
  console.log(`  [snap] ${name} — ${page.url()}`);
};

await snap("20-list-cdp", ctx.listUrl, 7000);
await snap("21-board-cdp", ctx.boardUrl, 7000);
await snap("22-calendar-cdp", ctx.calendarUrl, 7000);
await snap("23-gantt-cdp", ctx.ganttUrl, 7000);
await snap("24-brain-cdp", `https://app.clickup.com/${ctx.teamId}/ai/brain`, 6000);

await browser.close(); // detach only
