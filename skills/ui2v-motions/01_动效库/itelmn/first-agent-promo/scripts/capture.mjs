#!/usr/bin/env node
// Deterministic frame capture for the First Agent Promo React prototype.
// Boots a local HTTP server, drives a headless Chromium via Playwright,
// seeks window.__setFrame(t) at 1/fps increments, screenshots each frame.

import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_DIR = path.resolve(__dirname, '..');
const FRAMES_DIR = path.join(PROJECT_DIR, 'renders', 'frames');

const WIDTH = 1920;
const HEIGHT = 1080;
const DURATION = 32;
const FPS = 30;
const TOTAL_FRAMES = DURATION * FPS;
const PORT = 8087;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js':  'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.jsx': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function startServer() {
  const server = http.createServer((req, res) => {
    try {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      let rel = decodeURIComponent(url.pathname);
      if (rel === '/' || rel === '') rel = '/index.html';
      const full = path.join(PROJECT_DIR, rel);
      if (!full.startsWith(PROJECT_DIR)) { res.statusCode = 403; return res.end(); }
      if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) {
        res.statusCode = 404; return res.end('not found');
      }
      const ext = path.extname(full).toLowerCase();
      res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-store');
      fs.createReadStream(full).pipe(res);
    } catch (e) {
      res.statusCode = 500; res.end(String(e));
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function main() {
  // Reset frames dir
  if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  const server = await startServer();
  console.log(`Serving ${PROJECT_DIR} on http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  page.on('pageerror', (err) => console.error('[pageerror]', err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[${msg.type()}]`, msg.text());
    }
  });

  await page.goto(`http://localhost:${PORT}/?export=1`, { waitUntil: 'load' });

  // Wait for Babel to compile + React to mount + Stage export hook
  await page.waitForFunction(() => window.__stageReady === true, null, { timeout: 30000 });

  // Wait for fonts
  await page.waitForFunction(() => document.fonts && document.fonts.status === 'loaded', null, { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready.catch(() => {}));

  // Pre-warm: seek to a couple of moments so lazy-mounted Sprites register images etc.
  for (const t of [0, 2, 6, 10, 15, 20, 24, 28, 31.5]) {
    await page.evaluate((t) => window.__setFrame(t), t);
    await page.waitForTimeout(30);
  }
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));

  // Reset to 0
  await page.evaluate(() => window.__setFrame(0));
  await page.waitForTimeout(100);

  const canvas = page.locator('#capture-canvas');
  await canvas.waitFor({ state: 'visible' });

  const started = Date.now();
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / FPS;
    await page.evaluate((t) => window.__setFrame(t), t);
    // Force a paint cycle before screenshot
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const outPath = path.join(FRAMES_DIR, `f_${String(i).padStart(5, '0')}.png`);
    await canvas.screenshot({ path: outPath, omitBackground: false });
    if (i % 30 === 0 || i === TOTAL_FRAMES - 1) {
      const elapsed = ((Date.now() - started) / 1000).toFixed(1);
      process.stdout.write(`\rframe ${i + 1}/${TOTAL_FRAMES} (t=${t.toFixed(2)}s)  ${elapsed}s elapsed   `);
    }
  }
  process.stdout.write('\n');

  await browser.close();
  server.close();
  console.log(`Wrote ${TOTAL_FRAMES} frames to ${FRAMES_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
