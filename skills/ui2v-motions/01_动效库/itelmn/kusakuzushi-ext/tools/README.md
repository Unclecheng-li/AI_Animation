# Extension recording harness

This harness injects the unmodified extension source into the real public
GitHub profile at `https://github.com/toshi0607` and advances its animation
frames under a deterministic clock.

Bundle the extension entry point before probing or inspecting:

```bash
npx --yes esbuild@0.25.10 tools/ext-entry.ts --bundle --format=iife --target=chrome120 --platform=browser --outfile=tools/ext-bundle.js --log-level=warning
```

Search an inclusive range of seeds. `--limit` is simulated seconds per seed
and defaults to 400:

```bash
node tools/record-ext.mjs probe --seeds 0-99
node tools/record-ext.mjs probe --seeds 100-199 --limit 500
```

Inspect the live calendar, injected controls, overlay canvas, and calendar
ancestor geometry. The default seed is 0:

```bash
node tools/record-ext.mjs inspect
node tools/record-ext.mjs inspect --seed 42
```

Capture the promo assets for a chosen seed. `record` reproduces the seed in
two passes: pass 1 (no screenshots) computes the frame-accurate stats
timeline and a fixed capture REGION — the whole-CSS-px union of the grass's
bordered container, the overlay canvas, and the result banner's rect
(computed analytically from the canvas rect, since the banner doesn't exist
yet), held constant for every clip frame of the run. Pass 2 re-runs the
identical seed and takes the actual screenshots, asserting its own live
measurements match pass 1's before trusting them:

```bash
node tools/record-ext.mjs record --seed 38
```

Writes to `assets/ext/`:

- `mounted.png`, `button-hover.png`, `ready.png`, `result.png`,
  `result-quit-hover.png`, `restored.png` — full-viewport screenshots.
- `ext-early.mp4`, `ext-peak.mp4`, `ext-end.mp4` (60fps, cropped to REGION),
  plus each clip's first and last frame as `ext-<name>-first.png` /
  `ext-<name>-last.png`.
- `stats.json` — seed, launchT, clearedAt, the early/peak/end windows (frame
  and second bounds), REGION, and the full per-frame stats timeline.
- `rects.json` — measured element rects at the mounted/ready/result/restored
  moments.

## Rebuilding the shipped cut

`renders/e1-screen.mp4` (the extension promo) is rebuilt in this order:

```bash
npx --yes esbuild@0.25.10 tools/ext-entry.ts --bundle --format=iife --target=chrome120 --platform=browser --outfile=tools/ext-bundle.js --log-level=warning
node tools/record-ext.mjs record --seed 38    # screens + region clips → assets/ext/
bash tools/build-clips.sh                     # e-hook / e-early / e-end, cursor-path.json, fonts
npm run render -- -c compositions/e1-screen.html -q delivery -o renders/e1-screen.mp4
```

The recording runs on the live https://github.com/toshi0607, so the graph (and
therefore the game) is whatever the profile shows on the day it runs. Seed 38
cleared the 2026-09-27 graph in 24.7s; on another day, run
`node tools/record-ext.mjs probe --seeds 0-60` first and pick a seed again. The
composition inlines that day's cursor path and page coordinates, so a
re-recording also means regenerating `cursor-path.json` and updating those
constants.
