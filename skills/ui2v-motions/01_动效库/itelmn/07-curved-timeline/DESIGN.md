# curved-timeline — Design Notes

## Layout
- Left col (1050px, absolute): SVG curved line + milestone dots + year labels
- Right col: white info card with .info-inner stacked panels

## Animation
- Active dot: primaryColor, larger, boxShadow glow
- Active year label: primaryColor, larger font
- Info panels cycle same as tuckman-model pattern
- gsap.set() initialises milestone[0] as active

## V3 Constraints
- No tl.call(), no classList
- Absolute positioned left column keeps SVG curve precise
