# terms-definitions — Design Notes

## Layout
- Left col (400px): stacked icon badges + term labels
- Right col (flex:1): white card, .def-inner contains stacked .def-block panels

## Animation
- Icon active: accentColor bg, scale 1.15, boxShadow (hex concat '55')
- Icon inactive: #d8d2c8 bg, scale 1, boxShadow none
- gsap.set() initialises icon[0] as active
- Definition panels: same opacity swap pattern as four-ways-skills

## V3 Constraints
- No tl.call(), no classList
- IIFE loop for index capture
