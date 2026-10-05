/**
 * Writes assets/ext/cursor-path.json: the crosshair's page position for every
 * 60fps output frame of e-hook / e-early / e-end, so the cursor follows the
 * paddle the recording actually moved (x = canvas left + recorded paddle
 * centre, y fixed just above the paddle). The frame maps mirror the speed
 * changes in tools/build-clips.sh.
 *
 *   node tools/cursor-path.mjs   (after tools/record-ext.mjs record --seed 38)
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stats = JSON.parse(readFileSync(path.join(PROJECT, "assets/ext/stats.json"), "utf8"));
const paddleX = new Map(stats.frames.map((f) => [f.frame, f.paddleX]));
const lastFrame = stats.frames.length - 1;

const CANVAS_LEFT = 714.83;
const CANVAS_TOP = 676.0;
const Y = CANVAS_TOP + 165;
const round2 = (v) => Math.round(v * 100) / 100;
// The shipped path was generated with Python's round(), which rounds halves to
// even. The 1.5x section lands on x.5 source frames every other output frame,
// so Math.round (halves up) would pick a different paddle frame there.
const roundHalfEven = (v) => {
  const floor = Math.floor(v);
  const frac = v - floor;
  if (frac !== 0.5) return Math.round(v);
  return floor % 2 === 0 ? floor : floor + 1;
};
const xOf = (absFrame) => round2(CANVAS_LEFT + paddleX.get(Math.max(0, Math.min(absFrame, lastFrame))));

// e-hook = ext-peak from 1.0s (the peak window starts at abs frame 971).
const hook = Array.from({ length: 180 }, (_, k) => xOf(1031 + k));
// e-early = frame 0 held 0.15s, 0–0.5s at 1x, then 2x.
const early = Array.from({ length: 234 }, (_, k) => xOf(k < 9 ? 0 : k < 39 ? k - 9 : 30 + (k - 39) * 2));
// e-end = ext-end (starts at abs frame 1001) from 4.5s at 1.5x, then 1x through the clear, then held.
const end = Array.from({ length: 225 }, (_, k) => {
  const src = k < 140 ? 270 + roundHalfEven(k * 1.5) : k < 171 ? 480 + (k - 140) : 510;
  return xOf(1001 + src);
});

const out = {
  fps: 60,
  y: Y,
  canvasLeft: CANVAS_LEFT,
  canvasTop: CANVAS_TOP,
  note: "page CSS coords of the crosshair per output frame; x = canvasLeft + recorded paddleX",
  hook,
  early,
  end,
};
writeFileSync(path.join(PROJECT, "assets/ext/cursor-path.json"), JSON.stringify(out));
console.log(`cursor path → assets/ext/cursor-path.json (${hook.length}/${early.length}/${end.length} frames)`);
