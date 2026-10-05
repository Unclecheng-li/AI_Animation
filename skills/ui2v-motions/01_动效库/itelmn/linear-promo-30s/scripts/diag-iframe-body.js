const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:3004/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(15000);

  const iframeFrame = page.frames().find(f => f.url().includes('/preview'));
  if (!iframeFrame) {
    console.log('No preview frame found. Frames:');
    page.frames().forEach(f => console.log(' ', f.url()));
    await browser.close();
    return;
  }

  console.log('Preview frame found:', iframeFrame.url());

  const result = await iframeFrame.evaluate(() => ({
    bodyLen: document.body.innerHTML.length,
    headLen: document.head.innerHTML.length,
    timelineKeys: window.__timelines ? Object.keys(window.__timelines) : null,
    timelineDurations: window.__timelines ? Object.fromEntries(Object.entries(window.__timelines).map(([k,v])=>[k, +v.duration().toFixed(2)])) : null,
    beats: document.querySelectorAll('.beat-layer').length,
    gsapLoaded: !!window.gsap,
    rootDur: document.querySelector('[data-composition-id="linear-promo-30s"]')?.getAttribute('data-duration'),
  }));

  console.log(JSON.stringify(result, null, 2));

  await browser.close();
})();
