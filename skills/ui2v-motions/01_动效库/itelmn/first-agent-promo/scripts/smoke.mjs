#!/usr/bin/env node
// Quick smoke test: grabs one frame per scene to verify the pipeline
// before running the full frame capture.

import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(PROJECT_DIR, 'renders', 'smoke');
const PORT = 8088;
const WIDTH = 1920;
const HEIGHT = 1080;

const SAMPLES = [
  { name: 'scene1-logo',     t: 1.0 },
  { name: 'scene2-question', t: 4.0 },
  { name: 'scene3-title',    t: 7.0 },
  { name: 'scene4-agenda',   t: 11.5 },
  { name: 'scene5-terminal', t: 16.5 },
  { name: 'scene6-stats',    t: 21.0 },
  { name: 'scene7-date',     t: 25.0 },
  { name: 'scene8-cta',      t: 30.0 },
];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jsx': 'application/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
};

function startServer() {
  const server = http.createServer((req, res) => {
    try {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      let rel = decodeURIComponent(url.pathname);
      if (rel === '/') rel = '/index.html';
      const full = path.join(PROJECT_DIR, rel);
      if (!full.startsWith(PROJECT_DIR) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
        res.statusCode = 404; return res.end();
      }
      res.setHeader('Content-Type', MIME[path.extname(full).toLowerCase()] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-store');
      fs.createReadStream(full).pipe(res);
    } catch (e) { res.statusCode = 500; res.end(String(e)); }
  });
  return new Promise((r) => server.listen(PORT, () => r(server)));
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('[err]', m.text()); });

  await page.goto(`http://localhost:${PORT}/?export=1`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__stageReady === true, null, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready.catch(() => {}));
  await page.waitForTimeout(500);

  const canvas = page.locator('#capture-canvas');
  await canvas.waitFor({ state: 'visible' });

  for (const { name, t } of SAMPLES) {
    await page.evaluate((t) => window.__setFrame(t), t);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.waitForTimeout(100);
    await canvas.screenshot({ path: path.join(OUT_DIR, `${name}_t${t.toFixed(1)}.png`) });
    console.log(`captured ${name} @ t=${t}s`);
  }

  await browser.close();
  server.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
