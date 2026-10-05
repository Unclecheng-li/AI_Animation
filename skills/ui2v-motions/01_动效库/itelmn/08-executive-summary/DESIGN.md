# executive-summary — Design Notes

## Layout
- Centred grid of cards (2×2 for 4 cards)
- Inactive: compact icon + label card
- Active: expanded with heading + detail text

## Animation
- tl.set() toggles className 'card' ↔ 'card active' for CSS expansion
- gsap.to for scale and boxShadow on active card
- Composition div: display:flex; align-items:center; justify-content:center

## V3 Constraints
- CSS .card.active handles height/padding expansion
- No tl.call(), no direct DOM manipulation in timeline
