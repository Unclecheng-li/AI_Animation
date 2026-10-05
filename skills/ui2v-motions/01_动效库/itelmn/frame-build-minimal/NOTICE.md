# Attribution — frame-build-minimal

Vendored and adapted from:

- **Source:** [nexu-io/html-video](https://github.com/nexu-io/html-video) — `templates/frame-build-minimal`
- **License:** Apache-2.0 (attribution required, commercial use allowed)
- **Design lineage (upstream):** huashu-design "Build Studio" philosophy, MIT © alchaincyf — luxury-minimal whitespace hero.

## Changes made in this repo

- Wrapped content in a HyperFrames 0.6 `#root` composition node.
- Replaced hardcoded sample copy with `data-composition-variables` slots (eyebrow, hero, desc, side_left, side_right); the hero word is split into per-character `.ch` spans at render time for the letter-by-letter reveal.
- Added a **9:16 portrait** composition at `compositions/portrait.html`.
- Font stack (Inter) is unchanged — it already covers Vietnamese.
