const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  try {
    await page.goto('https://linear.app', { waitUntil: 'networkidle', timeout: 45000 });
  } catch (e) {
    console.error('Navigation failed:', e.message);
    await browser.close();
    process.exit(1);
  }

  const svgs = await page.$$eval('svg', nodes =>
    nodes.map(n => {
      const r = n.getBoundingClientRect();
      return { html: n.outerHTML, w: r.width, h: r.height, x: r.x, y: r.y };
    })
  );

  console.log('SVG bboxes found (top 15):');
  svgs.slice(0, 15).forEach((s, i) => console.log(`[${i}] w=${s.w.toFixed(0)} h=${s.h.toFixed(0)} @ (${s.x.toFixed(0)},${s.y.toFixed(0)})`));

  const wordmark = svgs.find(s => s.w > 70 && s.h < 40 && s.y < 200);
  const symbol   = svgs.find(s => Math.abs(s.w - s.h) < 4 && s.w > 20 && s.y < 200);

  const outDir = path.join(__dirname, '..', 'assets');
  if (wordmark) fs.writeFileSync(path.join(outDir, 'linear-logo.svg'), wordmark.html);
  if (symbol)   fs.writeFileSync(path.join(outDir, 'linear-symbol.svg'), symbol.html);

  await browser.close();
  console.log('Wordmark saved:', !!wordmark, '| Symbol saved:', !!symbol);
})();
