const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:3004/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  // Click on a specific composition item
  try {
    await page.locator('text=03-brand-reveal').first().click({ timeout: 3000 });
    console.log('Clicked 03-brand-reveal');
  } catch (e) {
    console.log('Click failed:', e.message.slice(0, 100));
  }
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'video-projects/linear-promo-30s/renders/studio-click-03.png' });

  const dur = await page.evaluate(() => {
    const m = document.body.innerText.match(/\d+:\d+\s*\/\s*\d+:\d+/);
    return m ? m[0] : null;
  });
  console.log('Time:', dur);

  await browser.close();
})();
