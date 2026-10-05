const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const failed = [];
  const pageErrors = [];
  const msgs = [];
  page.on('requestfailed', req => failed.push({ url: req.url(), failure: req.failure()?.errorText }));
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('console', m => msgs.push(m.type() + ': ' + m.text()));

  const url = 'http://localhost:3004/api/projects/linear-promo-30s/preview';
  console.log('Direct preview URL:', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(8000);

  const state = await page.evaluate(() => ({
    ready: document.readyState,
    timelineKeys: window.__timelines ? Object.keys(window.__timelines) : null,
    timelineDurations: window.__timelines ? Object.fromEntries(Object.entries(window.__timelines).map(([k,v]) => [k, +v.duration().toFixed(4)])) : null,
    gsapLoaded: !!window.gsap,
    bodyTextLen: document.body?.textContent?.length,
    beatLayerCount: document.querySelectorAll('.beat-layer').length,
  }));

  console.log('\n=== STATE ===');
  console.log(JSON.stringify(state, null, 2));
  console.log('\n=== FAILED ===');
  failed.forEach(f => console.log('  ', JSON.stringify(f)));
  console.log('\n=== ERRORS ===');
  pageErrors.forEach(e => console.log('  ', e));
  console.log('\n=== CONSOLE ===');
  msgs.slice(0, 30).forEach(m => console.log('  ', m));

  await browser.close();
})();
