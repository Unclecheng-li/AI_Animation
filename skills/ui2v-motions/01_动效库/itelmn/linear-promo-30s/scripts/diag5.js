const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:3004/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(8000);

  await page.screenshot({ path: 'video-projects/linear-promo-30s/renders/studio-state.png', fullPage: false });

  const bodyText = await page.evaluate(() => document.body?.innerText?.slice(0, 800));
  console.log('Body text (first 800 chars):');
  console.log(bodyText);

  // Inspect the player
  const info = await page.evaluate(() => {
    const p = document.querySelector('hyperframes-player');
    if (!p) return { none: true };
    const attrs = {};
    for (const a of p.attributes) attrs[a.name] = a.value;
    return {
      has: true,
      attrs,
      outerLen: p.outerHTML.length,
      shadowChildren: p.shadowRoot ? p.shadowRoot.children.length : null,
    };
  });
  console.log('\nPlayer info:', JSON.stringify(info, null, 2));

  await browser.close();
})();
