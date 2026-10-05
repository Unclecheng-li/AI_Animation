const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:3004/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(8000);

  const iframeInfo = await page.evaluate(() => {
    const p = document.querySelector('hyperframes-player');
    const iframe = p?.shadowRoot?.querySelector('iframe');
    if (!iframe) return null;
    const attrs = {};
    for (const a of iframe.attributes) attrs[a.name] = a.value;
    return {
      attrs,
      srcdoc: iframe.srcdoc?.slice(0, 500),
      currentUrl: iframe.contentWindow?.location?.href,
    };
  });
  console.log(JSON.stringify(iframeInfo, null, 2));

  await browser.close();
})();
