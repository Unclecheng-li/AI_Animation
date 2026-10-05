# Quality gates

Run these gates in order.

1. Data compile: no invalid numbers, missing series labels, or incompatible date sets.
2. Determinism tests: direct seek, forward seek, and backward seek at the same progress produce identical state.
3. HyperFrames check: lint, runtime, layout, motion, and contrast checks pass.
4. Snapshot review: inspect the closed opening frame, multiple frames through the opening reveal, early growth, midpoint, an extreme/crossing frame, the completed live chart immediately before the finale, staggered finale arrival, held finale, and closing frame. The first segment must advance gradually across the full time domain; it must never snap from the left edge to the right edge. Opening and closing overlays must be complete at both endpoints and free of one-frame flashes.
5. Studio preview: confirm typography, pacing, clipping, data truthfulness, safe margins, music level, and clean audio fades at target resolution.
6. Approval: obtain user approval before rendering final video.
7. Render: use HyperFrames CLI; never add a separate frame-capture or encoder path.

Overlap suppressions must be narrow and documented. For example, a moving rank list may permit overlap within the exact list container while the rest of the frame remains audited normally.

Finale labels should settle before the closing transition begins, long values must not collide, and dynamic axes should not make the story visually jittery. Positive-only datasets should keep zero at the bottom of the Y domain. Multi-series endpoint rank badges, live ranking rows, multipliers, and finale rows must agree at every sampled time.

For a new or changed visual preset, inspect the same representative dataset in every preset. Confirm that the difference is structural—not palette-only—and that foreground, muted labels, source copy, date chips, chart marks, and finale text retain readable contrast. The same seek time must produce the same data values and geometry in every style.
