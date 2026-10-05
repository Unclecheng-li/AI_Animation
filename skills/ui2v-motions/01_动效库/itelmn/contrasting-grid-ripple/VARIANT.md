# Contrasting Grid - Ripple Colour Scheme Variant

Status: accepted variant

Source:
- Settled V4 Contrasting Grid workset copied as the base.
- Notion reference page: contrasting-grid-frame-3s.png / Ripple Waves.

Changes:
- Uses the Ripple Waves palette: `#264653` background, `#e9c46a` accent, `#8aaa9a` muted support colour.
- Removes the V2 base-plate image dependency for this variant so the palette reads cleanly.
- Adds a blueprint-style grid texture from the reference.
- Adds three GSAP ripple rings on each active cell reveal.
- Keeps the accepted Contrasting Grid layout and timing model intact.

Notes:
- This is intentionally separate from the locked base template.
- The Notion WebGL shader was used as motion/palette reference; this variant uses DOM/GSAP rings for render stability inside the existing HyperFrames template.
- 2026-06-10: Accepted by Daniel. Ripple movement across the four inserts is locked in as a usable alternate version.
