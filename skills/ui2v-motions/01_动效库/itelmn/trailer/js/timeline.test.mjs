import { test } from "node:test";
import assert from "node:assert/strict";
import { HF_TIMELINE } from "./timeline.js";

test("beat cue points convert Remotion frames (30fps) to seconds", () => {
  assert.deepEqual(HF_TIMELINE.B1, { from: 0, duration: 7 });
  assert.deepEqual(HF_TIMELINE.B2, { from: 6.5, duration: 8 });
  assert.deepEqual(HF_TIMELINE.B3, { from: 14, duration: 10.5 });
  assert.deepEqual(HF_TIMELINE.B4, { from: 24, duration: 12 });
  assert.deepEqual(HF_TIMELINE.B5, { from: 35.5, duration: 8 });
  assert.deepEqual(HF_TIMELINE.B6, { from: 43, duration: 7 });
  assert.equal(HF_TIMELINE.TOTAL_SECONDS, 50);
});

test("REAL_STATS are ported verbatim, not invented", () => {
  assert.deepEqual(HF_TIMELINE.REAL_STATS, {
    totalHours: 199,
    totalSessions: 97,
    streakDays: 45,
    subjects: 5,
  });
});
