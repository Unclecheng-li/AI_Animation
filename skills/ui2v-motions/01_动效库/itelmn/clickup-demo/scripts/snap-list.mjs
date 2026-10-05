import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const profileDir = path.resolve(__dirname, "..", ".playwright-profile");
const outDir = path.resolve(__dirname, "..", "renders", "inventory");
const ctx = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "workspace-context.json"), "utf8"));

const context = await chromium.launchPersistentContext(profileDir, {
  headless: false,
  viewport: { width: 1920, height: 1080 },
  args: ["--window-size=1920,1080", "--window-position=40,40"],
});
const page = context.pages()[0] ?? (await context.newPage());

const snap = async (name, url) => {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(6000);
  const p = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: p });
  console.log(`  [snap] ${name} → ${p}`);
};

await snap("10-list-populated", ctx.listUrl);
await snap("11-board-populated", ctx.boardUrl);
await snap("12-calendar-populated", ctx.calendarUrl);
await snap("13-gantt-populated", ctx.ganttUrl);

await context.close();
