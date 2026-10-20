#!/usr/bin/env node
/**
 * code-mv-render / templates/qa-stills.mjs
 *
 * 在无头 Edge/Chrome 里按指定时间点渲染静帧，用来逐帧检查构图。
 * 页面需支持 ?t=<秒>&still=1（本库模板与案例都支持）。
 *
 * 用法：
 *   node qa-stills.mjs --page ../examples/cve-100k/demo.html --times 13.6,24.6,46,59.5 --out ./qa
 *   node qa-stills.mjs --page ./demo.html --times 3,8 --ui          # 连播放器外壳一起截
 *   node qa-stills.mjs --page ./demo.html --times 0..90 --step 5    # 每隔 5 秒一张
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const argv = process.argv.slice(2);
const arg = (k, d = null) => {
  const i = argv.indexOf(`--${k}`);
  return i >= 0 && argv[i+1] && !argv[i+1].startsWith('--') ? argv[i+1] : d;
};
const flag = k => argv.includes(`--${k}`);

const PAGE = path.resolve(arg('page', 'demo.html'));
const OUT = path.resolve(arg('out', 'qa'));
const UI = flag('ui');
const PORT = Number(arg('port', 9413));
const EDGE = arg('edge', [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].find(p => fs.existsSync(p)) || 'msedge');

let TIMES = (arg('times', '0') || '').split(',').map(Number).filter(n => !Number.isNaN(n));
const range = arg('range');
if(range){
  const [a,b] = range.split('..').map(Number);
  const step = Number(arg('step', 5));
  TIMES = [];
  for(let x=a; x<=b+1e-6; x+=step) TIMES.push(Number(x.toFixed(2)));
}

fs.mkdirSync(OUT, { recursive:true });
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-qa-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));

const proc = spawn(EDGE, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${TMP}`,
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--disable-gpu',
  '--window-size=1920,1080', 'about:blank',
], { stdio:'ignore' });

async function waitVersion(){
  for(let i=0;i<100;i++){
    try{ const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if(r.ok) return r.json(); }catch{}
    await sleep(250);
  }
  throw new Error('浏览器没有启动');
}
const info = await waitVersion();
const ws = new WebSocket(info.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let seq = 0;
const pending = new Map();
ws.onmessage = ev => {
  const msg = JSON.parse(ev.data);
  if(msg.id && pending.has(msg.id)){
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
  }
};
const send = (method, params = {}, sessionId) => {
  const id = ++seq;
  return new Promise((res, rej) => {
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
};

const { targetId } = await send('Target.createTarget', { url:'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten:true });
await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);
await send('Emulation.setDeviceMetricsOverride', {
  width: UI ? 1600 : 1920, height: UI ? 1250 : 1080, deviceScaleFactor:1, mobile:false,
}, sessionId);

const url = new URL('file:///' + PAGE.replace(/\\/g,'/'));
if(!UI) url.searchParams.set('clean','1');
url.searchParams.set('still','1');
await send('Page.navigate', { url:url.href }, sessionId);
await sleep(1800);

for(const t of TIMES){
  await send('Runtime.evaluate', {
    expression:`t = ${t}; playing = false; renderFrame(${t}); updateUI();`,
  }, sessionId);
  await sleep(160);
  const { data } = await send('Page.captureScreenshot', { format:'png', fromSurface:true }, sessionId);
  const file = path.join(OUT, `qa_${String(t).replace('.','_')}.png`);
  fs.writeFileSync(file, Buffer.from(data,'base64'));
  console.log('shot', file);
}

ws.close(); proc.kill();
setTimeout(() => process.exit(0), 300);
