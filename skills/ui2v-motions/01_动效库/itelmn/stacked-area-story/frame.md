---
colors:
  background: "#07100f"
  surface: "#0d1817"
  foreground: "#f4f7f2"
  muted: "#88928e"
  grid: "#21312e"
  lime: "#b8ed50"
  cyan: "#47d7cf"
  violet: "#8b79ff"
  coral: "#ff765f"
  accent_ink: "#07100f"
typography:
  display_family: "Inter"
  display_weight: 900
  data_family: "Inter"
  data_weights: "700-900"
spacing:
  outer_safe_area: "64px"
  chart_gap: "24px"
components:
  corner_style: "square chart field; compact 10px chips; circular live markers"
  border_width: 2
  depth: "flat fields, restrained area glow, no glass or dashboard shadows"
---

## Frame

A wide, cinematic stacked-area field fills the canvas beneath a concise headline. Four categorical bands create one flowing silhouette; a right-side mix rail reports the values at the live edge. The chart remains the hero rather than being placed inside a dashboard card.

## Data modes

- `absolute` scales the vertical domain to the largest total and reports source values.
- `percent` normalizes every date to 100% and reports each series' live share.
- Both modes use the same long-form `date / series / value` input and preserve series order.

## Motion

- Begin closed, open with a soft split shutter, then stage the headline, plot, and mix rail together.
- Reveal the complete precomputed area geometry with a left-to-right SVG clip so early data never stretches to the far edge.
- Keep the endpoint, date chip, values, and band labels derived from one normalized timeline progress value.
- Resolve into a final composition summary, hold, then close with the matching shutter.
- Never use wall-clock animation, requestAnimationFrame, random values, or library autoplay.
