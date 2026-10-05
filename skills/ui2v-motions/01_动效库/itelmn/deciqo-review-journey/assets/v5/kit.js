// v5 toolkit: time helpers, eases, seeded random, canvas text textures.
// Everything is a pure function of time so any frame can be rendered in isolation.
import * as THREE from "three";

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const E = {
  lin: (p) => p,
  inOut: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  out: (p) => 1 - Math.pow(1 - p, 3),
  in: (p) => p * p * p,
  out4: (p) => 1 - Math.pow(1 - p, 4),
  expo: (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
  expoInOut: (p) => (p <= 0 ? 0 : p >= 1 ? 1 : p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2),
  back: (p) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  backBig: (p) => { const c1 = 3, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  elastic: (p) => (p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
  sine: (p) => -(Math.cos(Math.PI * p) - 1) / 2,
};
// progress of t inside [a, b], eased
export const ramp = (t, a, b, ease = E.inOut) => ease(clamp((t - a) / (b - a)));
// 0 → 1 → 0 window with ramps
export const win = (t, a, b, fi = 0.4, fo = 0.4) => Math.min(ramp(t, a, a + fi, E.out), 1 - ramp(t, b - fo, b, E.in));
// piecewise keyframes [[t, value], ...] with per-segment ease; value may be number or array
export function keys(t, ks, ease = E.inOut) {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i][0]) {
      const [t0, v0] = ks[i - 1], [t1, v1, e] = ks[i];
      const p = (e || ease)((t - t0) / (t1 - t0));
      return Array.isArray(v0) ? v0.map((x, j) => lerp(x, v1[j], p)) : lerp(v0, v1, p);
    }
  }
  return ks[ks.length - 1][1];
}
// deterministic spring-ish settle: overshoot then decay (for pops)
export const pop = (t, a, dur = 0.6) => (t < a ? 0 : t > a + dur * 3 ? 1 : E.backBig(clamp((t - a) / dur)));
// seeded PRNG
export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let z = s; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
}
export const col = (hex) => new THREE.Color(hex);

export const PAL = {
  // pitch-deck palette: navy night, royal blue = model, cool white = code, Hold orange = seller
  bg: 0x040b1f, ai: 0x2f7bf6, ai2: 0x80aefd, bone: 0xe6edfb, seller: 0xff6b1a, ok: 0x3ddc97, bad: 0xff4d5e, dim: 0x8593b3,
  navy: 0x0a1e45, navy2: 0x113478, sky: 0x6d98e0, ice: 0xbfdafd, gold: 0xf5c451,
};

// Canvas text → texture. Draw function receives (ctx, w, h).
export function canvasTex(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
export function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
// wrap text into lines that fit maxW
export function wrap(ctx, text, maxW) {
  const words = text.split(" "), lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}
export const FONT = { disp: '"Poppins"', mono: '"JetBrains Mono"', body: '"Inter"' };
