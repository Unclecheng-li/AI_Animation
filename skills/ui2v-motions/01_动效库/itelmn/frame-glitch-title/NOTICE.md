# Attribution — frame-glitch-title

Vendored and adapted from:

- **Source:** [nexu-io/html-video](https://github.com/nexu-io/html-video) — `templates/frame-glitch-title`
- **License:** Apache-2.0 (attribution required, commercial use allowed)
- **Design:** cyberpunk "SIGNAL_LOST" — scanlines, grid, grain, vignette and a three-layer cyan×magenta RGB-split glitch title (SVG feOffset filter + jitter keyframes).

## Changes made in this repo

- Wrapped content in a HyperFrames 0.6 `#root` composition node (upstream relied on the viewport).
- Replaced the **Tailwind CDN runtime** with plain CSS (deterministic, offline).
- **Vietnamese fonts:** Space Grotesk → **Archivo** (glitch title) and JetBrains Mono → **Space Mono** (mono chrome) — both cover Vietnamese.
- Moved copy to `data-composition-variables` slots: `title` (set identically on all 3 glitch layers so the RGB split stays aligned) and `subtitle`. The corner "REC / SIGNAL / VFX" chrome and ASCII blocks are kept as static cyberpunk decoration.
- Added a **9:16 portrait** composition at `compositions/portrait.html`; `index.html` is the 16:9 canvas. The glitch/scanline `@keyframes` + SVG RGB filter are unchanged.
