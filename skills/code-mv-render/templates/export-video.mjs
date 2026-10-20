#!/usr/bin/env node
/**
 * code-mv-render / templates/export-video.mjs
 *
 * 用无头 Edge/Chrome 录制一个确定性 Canvas 页面（页面需支持 ?record=1 自动录制）。
 * 录制完成后可直接转成 H.264 MP4（加静音轨，兼容性最好）。
 *
 * 用法：
 *   node export-video.mjs --page ../examples/cve-100k/demo.html --out ./out
 *   node export-video.mjs --page ./demo.html --out ./out --name my-film --mp4
 *
 * 参数：
 *   --page   页面路径（相对当前目录或绝对路径）
 *   --out    输出目录（默认 ./out）
 *   --name   文件名（不含扩展名，默认取页面名）
 *   --port   CDP 端口（默认 9412）
 *   --timeout 最长等待秒数（默认 180）
 *   --mp4    录制完成后调用 ffmpeg 转 MP4
 *   --edge   浏览器可执行文件路径（默认自动找 Edge / Chrome）
 *
 * 页面约定：
 *   ?record=1  → 加 export 样式、自动从 t=0 录制、到 DUR 自动下载
 *   下载名建议 *.webm；本脚本会等目录里最新 .webm 的大小稳定。
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

/* ---------- 参数 ---------- */
const argv = process.argv.slice(2);
const arg = (key, def = null) => {
  const i = argv.indexOf(`--${key}`);
  return i >= 0 && argv[i+1] && !argv[i+1].startsWith('--') ? argv[i+1] : def;
};
const flag = key => argv.includes(`--${key}`);

const PAGE = path.resolve(arg('page', 'demo.html'));
const OUT = path.resolve(arg('out', 'out'));
const NAME = arg('name', path.basename(PAGE, path.extname(PAGE)));
const PORT = Number(arg('port', 9412));
const TIMEOUT = Number(arg('timeout', 180)) * 1000;
const MAKE_MP4 = flag('mp4');
const EDGE = arg('edge', [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].find(p => fs.existsSync(p)) || 'msedge');

fs.mkdirSync(OUT, { recursive: true });
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-rec-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- 启动浏览器 ---------- */
const proc = spawn(EDGE, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${TMP}`,
  '--no-first-run', '--no-default-browser-check',
  '--hide-scrollbars', '--disable-gpu',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
  '--autoplay-policy=no-user-gesture-required',
  '--window-size=1920,1080',
  'about:blank',
], { stdio: 'ignore' });

async function waitVersion(){
  for(let i=0;i<100;i++){
    try{
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if(r.ok) return await r.json();
    }catch{}
    await sleep(250);
  }
  throw new Error('浏览器没有启动（检查 --edge 路径）');
}

/* ---------- 最小 CDP 客户端 ---------- */
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
  } else if(msg.method === 'Runtime.exceptionThrown'){
    console.log('[page-error]', JSON.stringify(msg.params.exceptionDetails).slice(0,600));
  } else if(msg.method === 'Browser.downloadProgress'){
    console.log('[download]', msg.params.state, msg.params.receivedBytes);
  }
};
function send(method, params = {}, sessionId){
  const id = ++seq;
  return new Promise((res, rej) => {
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}

await send('Browser.setDownloadBehavior', { behavior:'allow', downloadPath: OUT, eventsEnabled:true });
const { targetId } = await send('Target.createTarget', { url:'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten:true });
await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);
await send('Emulation.setDeviceMetricsOverride', {
  width:1920, height:1080, deviceScaleFactor:1, mobile:false,
}, sessionId);

const url = new URL('file:///' + PAGE.replace(/\\/g,'/'));
url.searchParams.set('record','1');
await send('Page.navigate', { url: url.href }, sessionId);
console.log('loading', url.href);
await sleep(1200);

/* ---------- 等录制文件 ---------- */
console.log('recording…');
const started = Date.now();
let found = null;
while(Date.now() - started < TIMEOUT){
  await sleep(2000);
  const files = fs.readdirSync(OUT).filter(f => f.endsWith('.webm'));
  if(files.length){
    const f = path.join(OUT, files[files.length-1]);
    const a = fs.statSync(f).size;
    await sleep(2500);
    const b = fs.statSync(f).size;
    if(a === b && a > 100000){ found = f; break; }
  }
}
if(!found){
  console.log('没有等到录制文件。检查页面是否支持 ?record=1，或调大 --timeout。');
  ws.close(); proc.kill(); process.exit(1);
}

const note = await send('Runtime.evaluate', { expression:'JSON.stringify({t: typeof t!=="undefined"?t:null, rec: typeof recorder!=="undefined"?!!recorder:null})' }, sessionId)
  .then(r => r.result.value).catch(() => '');
console.log('file ready:', found, 'state:', note);

ws.close();
proc.kill();
await sleep(500);

/* ---------- 转 MP4 ---------- */
if(MAKE_MP4){
  const mp4 = path.join(OUT, `${NAME}.mp4`);
  const args = [
    '-y', '-loglevel', 'error',
    '-i', found,
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
    '-r', '60',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart',
    mp4,
  ];
  console.log('ffmpeg', args.join(' '));
  const r = spawnSync('ffmpeg', args, { stdio:'inherit' });
  if(r.status === 0){
    const probe = spawnSync('ffprobe', ['-v','error','-show_entries','format=duration,size',
      '-show_entries','stream=codec_name,width,height,r_frame_rate','-of','default=noprint_wrappers=1', mp4],
      { encoding:'utf8' });
    console.log(probe.stdout);
    console.log('done:', mp4);
  } else {
    console.log('ffmpeg 失败；WebM 仍在:', found);
  }
} else {
  console.log('done:', found);
}
process.exit(0);
