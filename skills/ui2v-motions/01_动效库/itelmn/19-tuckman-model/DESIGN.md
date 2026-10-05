# tuckman-model — Design Notes

## Layout
- Top area: SVG bell-curve with stage dots + year labels
- Bottom: white info card with pre-built panels per stage

## Animation
- Dots: inactive 14×14 #d8d2c8 → active 24×24 dotColor with glow ring
- Labels: inactive #5a6e78 14px → active dotColor 17px
- gsap.set() initialises dot[0] and label[0] as active before timeline
- Info panels cycle same as four-ways-skills pattern

## V3 Constraints
- No tl.call(), no classList
- boxShadow via dotColor + '33' string concatenation
