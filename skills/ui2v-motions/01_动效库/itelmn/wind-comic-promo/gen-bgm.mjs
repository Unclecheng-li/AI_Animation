/**
 * 宣传片 BGM —— 用平台自家 MiniMax music-2.6 生成原创配乐(dogfood + 规避版权音乐)。
 * 输出 videos/wind-comic-promo/assets/audio/bgm.mp3。Usage: node videos/wind-comic-promo/gen-bgm.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
function loadEnv() {
  const p = path.join(ROOT, '.env.local');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf-8').split('\n')) {
    const t = line.trim(); if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('='); if (i < 0) continue;
    const k = t.slice(0, i).trim(); const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();
const KEY = process.env.MINIMAX_API_KEY || '';
const BASE = 'https://api.minimaxi.com/v1';
const OUT = path.join(__dirname, 'assets', 'audio', 'bgm.mp3');

async function main() {
  if (!KEY) { console.error('MINIMAX_API_KEY missing'); process.exit(1); }
  // v12.336:**先建目录再发请求**。此前目录不存在时,请求已经发出、额度已经扣掉,
  // 却在写盘那一步才抛 ENOENT —— 生成的音频直接丢失。订阅是每天 3 条,烧一条就少一条。
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const body = {
    model: 'music-2.6',
    prompt: 'restrained cinematic underscore, warm analog pads, steady muted pulse, sparse felt piano, quietly determined, editorial and precise, no drums build, no epic swell, instrumental, no vocals',
    lyrics: '##\n[Music]\n##',
    audio_setting: { sample_rate: 44100, bitrate: 256000, format: 'mp3' },
  };
  const r = await fetch(`${BASE}/music_generation`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok || (j?.base_resp?.status_code && j.base_resp.status_code !== 0)) {
    console.error('music err:', r.status, j?.base_resp?.status_msg || JSON.stringify(j).slice(0, 200));
    process.exit(2);
  }
  const hex = j?.data?.audio;
  if (typeof hex === 'string' && /^[0-9a-fA-F]+$/.test(hex.slice(0, 64))) {
    fs.writeFileSync(OUT, Buffer.from(hex, 'hex'));
    console.log('BGM saved:', OUT, (fs.statSync(OUT).size / 1024).toFixed(0) + 'KB');
    return;
  }
  const url = j?.data?.audio_url || j?.audio_url;
  if (url) {
    const a = await fetch(url); fs.writeFileSync(OUT, Buffer.from(await a.arrayBuffer()));
    console.log('BGM saved (url):', OUT); return;
  }
  console.error('no audio in response:', JSON.stringify(j).slice(0, 200)); process.exit(3);
}
main();
