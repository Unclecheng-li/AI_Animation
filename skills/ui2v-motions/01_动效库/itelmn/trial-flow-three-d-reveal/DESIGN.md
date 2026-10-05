# trial-flow — Design Notes

## Layout
- Left col (720px): vertical step list — num badge + step label per row
- Right col (flex:1): white info card, .info-inner with stacked panels

## Animation
- Active badge: primaryColor bg, white text, scale 1.12
- Active label: primaryColor text
- Info card scales 0.97 → 1 (back.out) on each step change for tactile feel
- Info panels: opacity swap (first panel relative/opacity:1; rest gsap.set opacity:0)

## V3 Constraints
- No tl.call(), no classList
- IIFE loop for var i capture
- Badge bg colour via hex string; no color-mix()
