# achievements-challenges — Design Notes

## Layout
- Left column (48%): green header + item panels (absolute stacked)
- Right column (48%): red header + item panels (absolute stacked)
- Progress dots row at bottom

## Animation
- Initial pair fades in at t=0
- Each subsequent pair: prev fades out → new pair fades in with y:-10
- Active dot: #5a6e78; inactive: #d8d2c8
- IIFE loop closure for var i capture

## V3 Constraints
- Pre-built .item-panel divs per item per column
- gsap.set() inactive panels to opacity:0
- No tl.call(), no classList
