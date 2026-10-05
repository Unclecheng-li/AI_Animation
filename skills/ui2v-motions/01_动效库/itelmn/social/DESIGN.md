# AXI Browser Benchmark — Race Poster

## Style Prompt

A warm, editorial-poster aesthetic: coral-red canvas with a soft frosted-glass frame, serif headline, monospace labels and numerals. Three vertical lanes compete side by side, each accented by a thin colored bar in its signature hue (teal for AXI, blue for CLI, amber for MCP). Metrics animate cleanly with tabular numerals; steps fade from dim to fully lit as each lane advances. Feel: crafted, considered, print-inspired - not neon, not "tech demo," not marketing slick.

## Colors

- `#ff4736` - poster background base (coral red)
- `#ff6a52` - top-of-canvas gradient highlight
- `#fffcf6` at 82-94% alpha - frame and lane panel (warm ivory glass)
- `#171411` - primary text (near-black, warm)
- `#6b645b` - muted text, labels, footer (warm grey-brown)
- `#0f766e` - AXI lane accent (teal)
- `#2563eb` - CLI lane accent (blue)
- `#b45309` - MCP lane accent (amber)

## Typography

- Task line (serif headline): `"EB Garamond", "Iowan Old Style", Palatino, Georgia, serif` - old-style classical serif, deterministic at render time.
- Lane labels, step titles, metric values, eyebrow, footer (monospace): `"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace` - modern monospace, deterministic at render time.
- Eyebrow ("AXI BROWSER BENCHMARK") and metric labels: monospace, uppercase, 0.1em letter-spacing, small-caps feel.
- Tabular numerals on all metric values (`font-variant-numeric: tabular-nums`).

## Motion

- Metrics count up from 0 to their target (turns, tokens, time) on a per-lane duration curve - fast lanes finish early and hold.
- Step blocks transition from opacity 0.18 to 1.0 with a small y-lift (`translateY(10px) scale(0.985)` -> `translateY(0) scale(1)`) as each step activates.
- The currently-active step on each lane gets a tinted background (`color-mix(lane-color 12%, white)`) and a subtle outline.
- Final hold: once the slowest lane finishes, the frame holds for ~1.2s so the end state reads clearly.
- No jump cuts. No shader flourishes. Motion is information, not decoration.

## What NOT to Do

- No neon/electric palette, no pure-black background, no dark-mode reskin.
- No sans-serif headlines (the serif / mono contrast is the identity).
- No confetti, particles, celebratory flourishes, or 3D tilt on the lanes.
- No animated gradients or moving background - the canvas stays still; only lane content moves.
- No exit animations on lane content before the final hold; once a step is active it stays active.
