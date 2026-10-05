// Launches Chromium headed with a persistent profile AND a CDP endpoint on
// port 9222 so other scripts can attach without relaunching the browser.
// This avoids dropping the ClickUp auth session between steps.
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const profileDir = path.resolve(__dirname, "..", ".playwright-profile");

const context = await chromium.launchPersistentContext(profileDir, {
  headless: false,
  viewport: { width: 1920, height: 1080 },
  args: [
    "--window-size=1920,1080",
    "--window-position=40,40",
    "--remote-debugging-port=9222",
    "--remote-allow-origins=*",
  ],
});

const page = context.pages()[0] ?? (await context.newPage());
await page.goto("https://app.clickup.com/", { waitUntil: "domcontentloaded" });

console.log("\n  [capture] Browser open. CDP endpoint: http://localhost:9222");
console.log("  [capture] If not logged in, log in and go to the Demo workspace.");
console.log("  [capture] Keep this process alive — all capture scripts will attach.\n");

await new Promise(() => {});
