// Reuses the persistent profile from open-for-login.mjs.
// Connects to the already-open browser via CDP? No — launchPersistentContext can't
// share a profile dir with a running Playwright instance. So this script is run
// AFTER the user closes the login browser (Ctrl+C on open-for-login), while the
// profile/cookies remain on disk.
//
// Flow:
//   1. Nate logs in via open-for-login.mjs and lands in the Demo workspace.
//   2. Nate tells Claude "ready". Claude Ctrl+Cs the login script.
//   3. This script reopens the browser with the same profile (still logged in),
//      walks a few surfaces, and screenshots each one for triage.

import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const profileDir = path.resolve(__dirname, "..", ".playwright-profile");
const outDir = path.resolve(__dirname, "..", "renders", "inventory");
fs.mkdirSync(outDir, { recursive: true });

const context = await chromium.launchPersistentContext(profileDir, {
  headless: false,
  viewport: { width: 1920, height: 1080 },
  args: ["--window-size=1920,1080", "--window-position=40,40"],
});
const page = context.pages()[0] ?? (await context.newPage());

async function snap(name, url, { waitMs = 2500 } = {}) {
  console.log(`  [inventory] → ${name}`);
  if (url) await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(waitMs);
  const p = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  console.log(`  [inventory]   saved ${p}`);
}

// Start at whatever app.clickup.com resolves to — the user's last view.
await snap("00-home", "https://app.clickup.com/");

// Bounce through a few common surfaces. These URLs will 404 or redirect if the
// workspace doesn't have them, which is fine — the screenshot still tells us.
const surfaces = [
  // ClickUp URLs usually look like /{team_id}/{space|v|...}/...
  // We'll infer team_id from the current URL after initial nav.
];

const currentUrl = page.url();
console.log(`  [inventory] current URL: ${currentUrl}`);

// Surface the URL so Claude can decide next moves.
fs.writeFileSync(path.join(outDir, "_context.json"), JSON.stringify({
  timestamp: new Date().toISOString(),
  initialUrl: currentUrl,
}, null, 2));

await page.waitForTimeout(1000);
await context.close();
console.log("  [inventory] done. See clickup-demo/renders/inventory/");
