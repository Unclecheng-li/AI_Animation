# value-innovation — Design Notes

## Layout
- Composition div: display:flex; flex-direction:row
- Left panel (50%): red column with eliminate/reduce items
- Divider: 4px vertical line, muted colour
- Right panel (50%): green column with raise/create items
- Centre top: title overlays both columns

## Animation
- Title fades in at t=0
- Left items stagger in from left
- Right items stagger in from right
- Fade-to-black at TOTAL−0.5

## V3 Constraints
- No tl.call(); all DOM pre-built
- body: position:relative only
