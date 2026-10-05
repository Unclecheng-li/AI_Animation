import { LIME } from "./timeline.js";

export const ROWS = 7;
export const COLS = 53;
export const CELL = 13;
export const GAP = 4;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(1337);

export const ACTIVITY = Array.from({ length: ROWS * COLS }, (_, i) => {
  const col = Math.floor(i / ROWS);
  const streakStart = COLS - 7;
  if (col >= streakStart) return 1;
  const density = 0.05 + (col / streakStart) * 0.35;
  return rand() < density ? 1 : 0;
});

export const LIT_ORDER = ACTIVITY.map((v, i) => i).filter((i) => ACTIVITY[i] === 1);

export function buildGridSvg(litCount, { dim = false } = {}) {
  const litSet = new Set(LIT_ORDER.slice(0, litCount));
  const width = COLS * (CELL + GAP);
  const height = ROWS * (CELL + GAP);
  let rects = "";
  for (let i = 0; i < ROWS * COLS; i++) {
    const col = Math.floor(i / ROWS);
    const row = i % ROWS;
    const lit = litSet.has(i);
    const x = col * (CELL + GAP);
    const y = row * (CELL + GAP);
    const fill = lit ? LIME : "rgba(255,255,255,0.06)";
    const opacity = lit ? (dim ? 0.35 : 1) : 1;
    rects += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="3" fill="${fill}" opacity="${opacity}"></rect>`;
  }
  return `<svg width="${width}" height="${height}" style="overflow:visible">${rects}</svg>`;
}
