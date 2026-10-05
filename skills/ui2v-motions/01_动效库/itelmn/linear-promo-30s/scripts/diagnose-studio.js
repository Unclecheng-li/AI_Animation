const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const errors = [];
  const warnings = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') errors.push(text);
    if (type === 'warning') warnings.push(text);
  });
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));

  try {
    await page.goto('http://localhost:3004/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    console.error('Load failed:', e.message);
    await browser.close();
    process.exit(1);
  }
  await page.waitForTimeout(15000);

  // Try to inspect the player
  const info = await page.evaluate(() => {
    const p = document.querySelector('hyperframes-player');
    if (!p) return { error: 'no <hyperframes-player> element' };
    const sr = p.shadowRoot;
    if (!sr) return { error: 'no shadowRoot' };
    const iframe = sr.querySelector('iframe');
    if (!iframe) return { error: 'no iframe in shadowRoot' };
    try {
      const iw = iframe.contentWindow;
      const idoc = iframe.contentDocument;
      const out = {
        iframeSrc: iframe.src,
        iframeTitle: idoc ? idoc.title : null,
        readyState: idoc ? idoc.readyState : null,
        bodyHTMLLen: idoc && idoc.body ? idoc.body.innerHTML.length : null,
        hasTimelines: !!(iw && iw.__timelines),
        timelineKeys: iw && iw.__timelines ? Object.keys(iw.__timelines) : null,
        rootDiv: idoc ? (idoc.querySelector('[data-composition-id]') ? idoc.querySelector('[data-composition-id]').getAttribute('data-composition-id') : null) : null,
        beatLayers: idoc ? idoc.querySelectorAll('.beat-layer').length : null,
        scriptCount: idoc ? idoc.querySelectorAll('script').length : null,
      };
      if (iw && iw.__timelines) {
        out.durations = Object.fromEntries(Object.entries(iw.__timelines).map(([k, v]) => [k, +v.duration().toFixed(4)]));
      }
      return out;
    } catch (e) {
      return { error: 'iframe access error: ' + e.message };
    }
  });

  console.log('\n=== PLAYER INFO ===');
  console.log(JSON.stringify(info, null, 2));
  console.log('\n=== CONSOLE ERRORS ===');
  errors.forEach(e => console.log('  -', e));
  console.log('\n=== CONSOLE WARNINGS ===');
  warnings.forEach(w => console.log('  -', w));

  await browser.close();
})();
