const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const failed = [];
  const pageErrors = [];
  page.on('requestfailed', req => failed.push({ url: req.url(), failure: req.failure()?.errorText }));
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') pageErrors.push('CONSOLE: ' + m.text()); });

  const url = 'http://localhost:3004/?comp=01-problem-type';
  console.log('Testing:', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(8000);

  const state = await page.evaluate(() => {
    const p = document.querySelector('hyperframes-player');
    if (!p) return { error: 'no player element' };
    const iframe = p.shadowRoot?.querySelector('iframe');
    if (!iframe) return { error: 'no iframe' };
    return {
      iframeReady: iframe.contentDocument?.readyState,
      bodyExists: !!iframe.contentDocument?.body,
      bodyHTMLLen: iframe.contentDocument?.body?.innerHTML?.length ?? null,
      timelineKeys: iframe.contentWindow?.__timelines ? Object.keys(iframe.contentWindow.__timelines) : null,
      gsapLoaded: !!iframe.contentWindow?.gsap,
    };
  });

  console.log('\n=== STATE ===');
  console.log(JSON.stringify(state, null, 2));
  console.log('\n=== FAILED ===');
  failed.forEach(f => console.log('  ', JSON.stringify(f)));
  console.log('\n=== ERRORS ===');
  pageErrors.forEach(e => console.log('  ', e));

  await browser.close();
})();
