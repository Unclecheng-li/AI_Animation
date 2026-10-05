const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const msgs = [];
  page.on('pageerror', e => msgs.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') msgs.push('ERR: ' + m.text()); });

  await page.goto('http://localhost:3004/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Poll every 2s up to 60s
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(2000);
    const state = await page.evaluate(() => {
      const p = document.querySelector('hyperframes-player');
      const iframe = p?.shadowRoot?.querySelector('iframe');
      const iw = iframe?.contentWindow;
      const idoc = iframe?.contentDocument;
      return {
        elapsed: Math.round(performance.now()/1000),
        ready: idoc?.readyState,
        body: !!idoc?.body,
        bodyLen: idoc?.body?.innerHTML?.length ?? null,
        beats: idoc?.querySelectorAll('.beat-layer').length ?? null,
        timelines: iw?.__timelines ? Object.keys(iw.__timelines).length : null,
      };
    });
    console.log(`[${i}]`, JSON.stringify(state));
    if (state.timelines && state.timelines > 0) break;
  }

  console.log('ERRORS:', msgs.length);
  msgs.slice(0, 5).forEach(m => console.log(' ', m));

  await browser.close();
})();
