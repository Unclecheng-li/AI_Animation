# four-ways-skills — Design Notes

## Layout
- Left col (360px): vertical list of numbered badges + labels
- Right col (flex:1): white info card with cycling content panels

## Animation
- Active badge: primaryColor bg, white text, scale 1.15, boxShadow
- Inactive badge: light bg, primaryColor text, scale 1
- Info panels pre-built in .info-inner (first: relative/opacity:1; rest: gsap.set opacity:0)
- Card scales 0.97 → 1 (back.out) on each transition for tactile feel

## V3 Constraints
- No tl.call(), no classList
- IIFE loop for var i capture
