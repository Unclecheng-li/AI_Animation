const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  const pages = [
    { url: 'https://linear.app/plan',    out: 'screenshot-plan.png',    scroll: 1200 },
    { url: 'https://linear.app/build',   out: 'screenshot-build.png',   scroll: 1100 },
    { url: 'https://linear.app/monitor', out: 'screenshot-monitor.png', scroll: 1200 },
  ];

  const outDir = path.join(__dirname, '..', 'assets');

  for (const { url, out, scroll } of pages) {
    try {
      console.log(`Capturing ${url} ...`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(1500);
      await page.evaluate((s) => window.scrollTo({ top: s, behavior: 'instant' }), scroll);
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(outDir, out),
        fullPage: false,
        clip: { x: 0, y: 0, width: 1920, height: 1080 }
      });
      console.log(`Saved ${out}`);
    } catch (e) {
      console.error(`Failed ${url}:`, e.message);
    }
  }

  await browser.close();
})();
