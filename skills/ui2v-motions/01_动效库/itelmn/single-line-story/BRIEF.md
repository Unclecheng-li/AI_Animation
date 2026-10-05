---
workflow: general-video
flow: automation
storyboard: no
message: "Show how several categories combine and change over time in one editable HyperFrames composition"
aspect: 1920x1080
language: en
length: 18s
---

## Intent

Provide a reusable, HyperFrames-native stacked-area template for multi-series long-form data. The composition must support absolute totals and percentage share through `window.HF_VIDEO_SPEC.stackMode`, remain deterministic under forward and backward seeking, and keep all chart state driven by HyperFrames' paused timeline.

## Notes

- This template fills a catalog gap; no stacked-area registry block exists, so its data-to-geometry layer is hand-authored.
- Use the same normalized `window.HF_DATA.series[].points[]` contract as the multi-line template.
- Keep the local upbeat music bed subtle and synchronize its fades with the opening and closing shutters.
- Open cleanly, complete the chart before the finale, hold the final composition long enough to read, and close without a frame flash.
- Do not fetch data or media at runtime, and do not render as part of template authoring.
