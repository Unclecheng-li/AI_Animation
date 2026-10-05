# faqs — Design Notes

## Layout
- Left sidebar (560px): question list items, active/inactive styles
- Right area (flex:1): answer card with .answer-inner stacked panels
- Progress dots at bottom of sidebar

## Animation
- Active q-item: primaryColor text + bg tint via gsap.to color/backgroundColor
- Inactive: muted colours
- Answer panels swap via opacity (pre-built .answer-block)
- Progress dots: primaryColor → muted via gsap.to backgroundColor

## V3 Constraints
- No tl.call(), no classList
- gsap.to on CSS properties replaces class toggling
