# Attribution — frame-logo-outro

Vendored and adapted from:

- **Source:** [nexu-io/html-video](https://github.com/nexu-io/html-video) — `templates/frame-logo-outro`
- **License:** Apache-2.0 (attribution required, commercial use allowed)
- **Design:** segmented logo assembly + glow bloom + tagline reveal on a deep violet radial canvas (accent #7c5cff).

## Changes made in this repo

- Wrapped content in a HyperFrames 0.6 `#root` composition node with explicit canvas size (upstream relied on the viewport).
- Replaced the **Tailwind CDN runtime** with plain CSS so the render is deterministic and needs no external script.
- Dropped the **Noto Sans SC** (Chinese) font; kept Inter Tight + Inter, which cover Vietnamese.
- Moved copy to `data-composition-variables` slots: `brand_name`, `tagline`, `primary_url`.
- Added a **9:16 portrait** composition at `compositions/portrait.html`; `index.html` is the 16:9 canvas. The glow/shimmer animation is kept from upstream.
- Replaced the upstream "H" monogram mark with a **`</>` code glyph** (purple brackets + white slash) to suit the "AI Coding" brand, keeping the same assembling-pieces + glow motion.
