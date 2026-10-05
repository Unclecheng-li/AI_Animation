# transformation-map — Design Notes

## Layout
- Road SVG spans full width (lower 40% of canvas)
- Milestone dot divs positioned along the road
- Info card centred above road, panels cycling per milestone

## Animation
- Active dot: accentColor, enlarged with glow ring
- Active year label: accentColor, larger font
- Info panels: opacity swap pattern (same as tuckman-model)
- gsap.set() initialises milestone[0] as active before tl starts

## V3 Constraints
- No tl.call(), no classList
- accentColor used for active state; primaryColor for road/structure elements
