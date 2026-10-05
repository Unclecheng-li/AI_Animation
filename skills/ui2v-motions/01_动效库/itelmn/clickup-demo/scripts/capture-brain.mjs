// Recapture the Brain page with a longer wait so it isn't stuck on the loading logo.
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stillsDir = path.resolve(__dirname, "..", "assets", "stills");
const ctx = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "workspace-context.json"), "utf8"));

const browser = await chromium.connectOverCDP("http://localhost:9222");
const context = browser.contexts()[0];
const page = context.pages()[0];
await page.setViewportSize({ width: 1920, height: 1080 }).catch(() => {});

await page.goto(`https://app.clickup.com/${ctx.teamId}/ai/brain`, { waitUntil: "networkidle" }).catch(() => {});
await page.waitForTimeout(12000);

// Dismiss banner
try {
  const b = page.locator('button:has-text("Remind me")').first();
  if (await b.isVisible({ timeout: 1500 }).catch(() => false)) {
    await b.click();
    await page.waitForTimeout(500);
  }
} catch {}

const save = async (name) => {
  const p = path.join(stillsDir, `${name}.png`);
  const buf = await page.screenshot({ fullPage: false });
  fs.writeFileSync(p, buf);
  console.log(`  [brain] ${name} — ${fs.statSync(p).size} bytes`);
};

await save("07-brain-clean");

// Try focusing the Brain input. ClickUp uses a Slate-like contenteditable.
const tryClick = async (selector) => {
  try {
    const el = page.locator(selector).first();
    if (await el.isVisible({ timeout: 1500 }).catch(() => false)) {
      await el.click({ timeout: 2000 });
      return true;
    }
  } catch {}
  return false;
};

const clicked =
  (await tryClick('[contenteditable="true"]')) ||
  (await tryClick('[data-testid*="brain"] [role="textbox"]')) ||
  (await tryClick('[role="textbox"]')) ||
  (await tryClick('textarea'));

if (clicked) {
  await page.waitForTimeout(800);
  await save("08-brain-focused");
  await page.keyboard.type("Summarize the Q2 Product Launch status", { delay: 40 });
  await page.waitForTimeout(600);
  await save("09-brain-typed");
} else {
  console.log("  [brain] could not focus input — clean shot only");
}

await browser.close();
