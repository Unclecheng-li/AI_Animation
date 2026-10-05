# Attribution — frame-creative-voltage

Vendored and adapted from:

- **Source:** [nexu-io/html-video](https://github.com/nexu-io/html-video) — `templates/frame-creative-voltage`
- **License:** Apache-2.0 (attribution required, commercial use allowed)
- **Design lineage (upstream):** frontend-slides "Creative Voltage" preset, MIT © Zara Zhang — an electric-blue / dark split with a hand-drawn script accent and an outlined "volt" display word.

## Changes made in this repo

- Wrapped content in a HyperFrames 0.6 `#root` composition node.
- Replaced hardcoded sample copy with `data-composition-variables` slots: `meta`, `display_lines` (array, built into stacked lines), `accent_index` (which line gets the electric blue-outlined treatment), `script` (handwritten accent), `caption`.
- **Vietnamese fonts:** Syne → **Unbounded** (display) and Caveat → **Dancing Script** (handwritten) — both cover Vietnamese; **Space Mono** (mono meta/caption) kept as it already does.
- Added a **9:16 portrait** composition at `compositions/portrait.html` — re-laid-out as a top (blue) / bottom (dark) split; `index.html` keeps the upstream 16:9 left/right split. Pure CSS/SVG `@keyframes` are unchanged.
