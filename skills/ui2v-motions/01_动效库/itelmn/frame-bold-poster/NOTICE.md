# Attribution — frame-bold-poster

This template is vendored and adapted from:

- **Source:** [nexu-io/html-video](https://github.com/nexu-io/html-video) — `templates/frame-bold-poster`
- **License:** Apache-2.0 (attribution required, commercial use allowed)
- **Design lineage (upstream):** [frontend-slides](https://github.com/zarazhangrui/frontend-slides) "Bold Poster" template, MIT © Zara Zhang — inspired by 1970s European editorial / poster tradition.

## Changes made in this repo

- Wrapped content in a HyperFrames 0.6 `#root` composition node (`data-composition-id`, `data-duration`, `data-width/height`).
- Replaced hardcoded sample copy with `data-composition-variables` slots, injected deterministically at render time.
- **Vietnamese-capable type stack** (upstream Shrikhand / Libre Baskerville / Space Grotesk lack Vietnamese glyphs and dropped diacritics): display + figures → **Alfa Slab One**, serif standfirst → **Lora** italic, labels/chrome → **Be Vietnam Pro**.
- Added a **9:16 portrait** composition at `compositions/portrait.html` (1080×1920), re-laid-out vertically. `index.html` is the 16:9 landscape canvas.
- CSS `@keyframes` timeline and palette are unchanged from upstream.
