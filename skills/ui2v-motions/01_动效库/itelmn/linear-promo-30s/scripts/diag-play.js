const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:3004/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(10000);

  // Shot 1: initial state
  await page.screenshot({ path: 'video-projects/linear-promo-30s/renders/studio-t0.png' });

  // Try clicking play
  try {
    await page.locator('button[aria-label="Play"], button[title*="Play"], button:has-text("Play")').first().click({ timeout: 3000 });
    console.log('Clicked play');
  } catch(e) {
    console.log('Could not find play button:', e.message.slice(0, 80));
  }
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'video-projects/linear-promo-30s/renders/studio-t3.png' });

  // Check what the duration display reads
  const dur = await page.evaluate(() => {
    const el = document.body.innerText;
    const m = el.match(/(\d+:\d+)\s*\/\s*(\d+:\d+)/);
    return m ? m[0] : 'no time display';
  });
  console.log('Time display:', dur);

  await browser.close();
})();
