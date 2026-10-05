// Attach to the running browser via CDP and report the current URL.
import { chromium } from "playwright";

const browser = await chromium.connectOverCDP("http://localhost:9222");
const context = browser.contexts()[0];
const page = context.pages()[0];

const url = page.url();
const title = await page.title();
console.log(JSON.stringify({ url, title }));

await browser.close(); // Only closes the CDP connection, not the browser itself.
