// Re-capture the Brain page with the notification banner dismissed.
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

await page.goto(`https://app.clickup.com/${ctx.teamId}/ai/brain`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(10000);

// Click either "Remind me" or the X to dismiss the banner
for (const sel of [
  'button:has-text("Remind me")',
  'button:has-text("Enable")', // less ideal but dismisses too after a beat
]) {
  try {
    const b = page.locator(sel).first();
    if (await b.isVisible({ timeout: 1500 }).catch(() => false)) {
      await b.click();
      console.log(`  [rc] clicked: ${sel}`);
      await page.waitForTimeout(1500);
      break;
    }
  } catch {}
}

// Also try closing by clicking the X icon in the banner area
try {
  // The X close button usually sits at right side of the banner with aria-label="Close"
  const closer = page.locator('button[aria-label*="lose"], button[aria-label*="dismiss"], [role="button"]:has-text("×")').first();
  if (await closer.isVisible({ timeout: 1500 }).catch(() => false)) {
    await closer.click();
    await page.waitForTimeout(800);
  }
} catch {}

// Second chance: if banner is still there, hide it with a DOM tweak (cosmetic for the capture only)
await page.evaluate(() => {
  const banners = document.querySelectorAll('div, section, aside');
  banners.forEach((el) => {
    if (el.textContent && el.textContent.includes("ClickUp needs your permission")) {
      // Walk up to find the root banner container and hide it
      let cur = el;
      for (let i = 0; i < 6 && cur; i++) {
        if (cur.offsetWidth > 1400 && cur.offsetHeight < 120) {
          cur.style.display = "none";
          break;
        }
        cur = cur.parentElement;
      }
    }
  });
});
await page.waitForTimeout(800);

const buf = await page.screenshot({ fullPage: false });
const out = path.join(stillsDir, "07-brain-clean.png");
fs.writeFileSync(out, buf);
console.log(`  [rc] saved ${out} — ${fs.statSync(out).size} bytes`);

await browser.close();
