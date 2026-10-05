import { test } from "node:test";
import assert from "node:assert/strict";
import { ROWS, COLS, LIT_ORDER, buildGridSvg } from "./grid-data.js";

test("grid dimensions match the Remotion source", () => {
  assert.equal(ROWS, 7);
  assert.equal(COLS, 53);
});

test("LIT_ORDER is deterministic and includes the full trailing streak", () => {
  assert.equal(LIT_ORDER.length > 0, true);
  // Last 7 columns (COLS - 7 .. COLS-1) are fully lit — 7 columns * 7 rows = 49 cells
  const streakStartCol = COLS - 7;
  const streakCells = LIT_ORDER.filter((i) => Math.floor(i / ROWS) >= streakStartCol);
  assert.equal(streakCells.length, 49);
});

test("buildGridSvg renders the correct number of lit rects", () => {
  const svg = buildGridSvg(10);
  const litMatches = svg.match(/fill="#ccff00"/g) || [];
  assert.equal(litMatches.length, 10);
});

test("buildGridSvg supports dim option", () => {
  const svg = buildGridSvg(5, { dim: true });
  assert.equal(svg.includes('opacity="0.35"'), true);
});

