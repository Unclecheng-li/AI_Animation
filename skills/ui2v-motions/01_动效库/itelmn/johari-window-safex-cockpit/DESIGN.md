# johari-window — Design Notes

## Layout
- Left (780px): 2×2 quadrant grid
- Right (flex:1): white info card with pre-built panels per quadrant

## Animation
- Active quadrant: scale 1.04, boxShadow, background color+'30' (30% opacity)
- Inactive: scale 1, no shadow, background color+'18'
- ACS plate colours per quadrant: blue, gold, green, purple
- Info panels cycle via opacity swap

## V3 Constraints
- No tl.call(), no classList
- Background opacity via hex suffix concatenation (color + '18' / color + '30')
- colors[] array indexed per quadrant for per-colour behaviour
