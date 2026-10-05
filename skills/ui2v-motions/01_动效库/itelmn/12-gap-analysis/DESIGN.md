# gap-analysis — Design Notes

## Layout
- Left column (600px): title, subtitle, overall score ring
- Right column (flex:1): horizontal bar chart, one row per item
- Bar groups: current (red) + target (green) per row

## Animation
- Title/subtitle fade in at t=0
- Score ring animates strokeDashoffset 0→value at t=0.5
- Bars animate width 0→value with stagger

## V3 Constraints
- No tl.call(); all DOM pre-built
- Fade-to-black at TOTAL−0.5
- body: position:relative only; flex on composition div
- GSAP 3.14.2 from jsDelivr CDN
