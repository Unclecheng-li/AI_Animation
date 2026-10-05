# freelancer-tips — Design Notes

## Layout
- Central white card (max 900px)
- Top: icon badge + heading
- Body: tip text
- Bottom: progress dots

## Animation
- Tip panels pre-built in .card-inner
- Dots: active primaryColor 14×14 → inactive muted 8×8 via gsap.to
- Card slight scale pulse on transition

## V3 Constraints
- No tl.call(), no classList
- IIFE loop for var i
