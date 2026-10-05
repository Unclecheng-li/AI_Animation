const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const requests = [];
  const failed = [];
  page.on('request', req => requests.push({ url: req.url(), method: req.method() }));
  page.on('requestfailed', req => failed.push({ url: req.url(), failure: req.failure()?.errorText }));
  page.on('response', res => {
    if (!res.ok()) failed.push({ url: res.url(), status: res.status() });
  });

  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') pageErrors.push('CONSOLE: ' + m.text());
  });

  await page.goto('http://localhost:3004/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(30000);

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

  console.log('\n=== STATE AFTER 10s ===');
  console.log(JSON.stringify(state, null, 2));

  console.log('\n=== FAILED REQUESTS ===');
  failed.forEach(f => console.log('  ', JSON.stringify(f)));

  console.log('\n=== PAGE ERRORS ===');
  pageErrors.forEach(e => console.log('  ', e));

  console.log('\n=== TOTAL REQUESTS:', requests.length, '===');
  // Print external (non-localhost) requests
  const ext = requests.filter(r => !r.url.includes('localhost'));
  console.log('External:', ext.length);
  ext.slice(0, 20).forEach(r => console.log('  ', r.method, r.url));

  await browser.close();
})();
