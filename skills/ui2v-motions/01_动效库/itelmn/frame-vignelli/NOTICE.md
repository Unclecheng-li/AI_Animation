# Attribution — frame-vignelli

Vendored and adapted from:

- **Source:** [nexu-io/html-video](https://github.com/nexu-io/html-video) — `templates/frame-vignelli`
- **License:** Apache-2.0 (attribution required, commercial use allowed)
- **Design lineage (upstream):** the Massimo Vignelli editorial / Swiss-grid tradition — charcoal canvas, a single red (#cc0000) accent, a 6-column grid, heavy grotesque numerals.

## Changes made in this repo

- The upstream template is a **video composite** (background A-roll footage + GSAP-timed overlays + a synced caption track). It was redesigned here into a **static, fillable HyperFrames 0.6 composition**: no background video, no caption layer, no tuned multi-stat timeline.
- Captured the Vignelli signature (charcoal #1a1a1a, red #cc0000 accent column, 6-col grid, heavy numerals) as a single self-contained CSS `@keyframes` stat hero with `data-composition-variables` slots (kicker, number, label, note, brand).
- Added a **9:16 portrait** composition at `compositions/portrait.html` (1080×1920); `index.html` is the 16:9 canvas.
- Helvetica Neue → **Archivo** (Google-served grotesque) so the renderer can supply the font and Vietnamese is covered.
