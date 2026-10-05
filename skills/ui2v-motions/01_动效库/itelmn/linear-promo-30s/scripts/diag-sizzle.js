const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const failed = [];
  page.on('requestfailed', req => failed.push({ url: req.url(), failure: req.failure()?.errorText }));

  // sizzle runs on port 3002
  await page.goto('http://localhost:3002/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(8000);

  const state = await page.evaluate(() => {
    const p = document.querySelector('hyperframes-player');
    if (!p) return { error: 'no player' };
    const iframe = p.shadowRoot?.querySelector('iframe');
    if (!iframe) return { error: 'no iframe' };
    return {
      ready: iframe.contentDocument?.readyState,
      bodyExists: !!iframe.contentDocument?.body,
      timelineKeys: iframe.contentWindow?.__timelines ? Object.keys(iframe.contentWindow.__timelines).length : null,
    };
  });

  console.log('SIZZLE STATE:', JSON.stringify(state, null, 2));
  console.log('FAILED:', failed.length);
  failed.forEach(f => console.log('  ', JSON.stringify(f)));

  await browser.close();
})();
