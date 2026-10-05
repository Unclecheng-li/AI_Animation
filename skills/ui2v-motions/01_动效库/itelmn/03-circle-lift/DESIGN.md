# circle-lift — Design Notes

## Layout
- Left text zone (600px): panels for "left" side steps
- Centre (360px): large circle with letter + progress dots below
- Right text zone (600px): panels for "right" side steps

## Animation
- tl.set(circle, {textContent: steps[idx].letter}) at t+0.25
- Left/right panels swap via opacity (pre-built stacks)
- Dots: active 14px → 22px with glow; inactive 14px muted
- idx % 2 determines which side; left and right panel arrays indexed separately

## V3 Constraints
- No tl.call()
- Separate leftPanels[] and rightPanels[] arrays
- IIFE loop for var i
