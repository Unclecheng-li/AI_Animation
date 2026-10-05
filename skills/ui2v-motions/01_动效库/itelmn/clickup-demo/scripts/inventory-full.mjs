// Broader inventory — visits multiple surfaces with generous wait times so
// the actual content renders (ClickUp lazy-loads heavily).
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

async function snap(name, { waitMs = 5000, url } = {}) {
  if (url) await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(waitMs);
  const p = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: p, fullPage: false });
  console.log(`  [inv] ${name} — ${page.url()}`);
}

// 1. Land on current workspace home (List view from the earlier run).
await snap("01-list-loaded", { url: "https://app.clickup.com/", waitMs: 6000 });

const teamMatch = page.url().match(/app\.clickup\.com\/(\d+)\//);
const teamId = teamMatch?.[1];
console.log(`  [inv] teamId = ${teamId}`);

// 2. Try clicking sidebar items one by one. Use accessible names so we're resilient to DOM churn.
const sidebarTargets = [
  { name: "02-chat", label: "Chat" },
  { name: "03-planner", label: "Planner" },
  { name: "04-ai", label: "AI" },
  { name: "05-docs", label: "Docs" },
  { name: "06-dashboard", label: "Dashboard" },
];

for (const t of sidebarTargets) {
  try {
    // Sidebar has a nav with the label text near the icon. Try a few selectors.
    const btn = page
      .locator(`nav, aside, [role="navigation"]`)
      .locator(`text=${t.label}`)
      .first();
    await btn.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
    await btn.click({ timeout: 5000 });
    await page.waitForTimeout(4500);
    const p = path.join(outDir, `${t.name}.png`);
    await page.screenshot({ path: p, fullPage: false });
    console.log(`  [inv] ${t.name} — ${page.url()}`);
  } catch (err) {
    console.log(`  [inv] ${t.name} — SKIP (${err.message.split("\n")[0]})`);
  }
}

// 3. Back to home, try view switching on the list.
try {
  await page.goto("https://app.clickup.com/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);
  await snap("07-list-home-again", { waitMs: 3000 });

  // Click "+ View" or the view tabs area — ClickUp exposes these as tabs.
  const viewAdd = page.locator('text="+ View"').first();
  if (await viewAdd.isVisible({ timeout: 2000 }).catch(() => false)) {
    await viewAdd.click();
    await page.waitForTimeout(2000);
    await snap("08-view-picker", { waitMs: 2000 });
    await page.keyboard.press("Escape");
  }
} catch (err) {
  console.log(`  [inv] view picker SKIP (${err.message.split("\n")[0]})`);
}

fs.writeFileSync(path.join(outDir, "_context.json"), JSON.stringify({
  timestamp: new Date().toISOString(),
  teamId,
  lastUrl: page.url(),
}, null, 2));

await context.close();
console.log("  [inv] done.");
