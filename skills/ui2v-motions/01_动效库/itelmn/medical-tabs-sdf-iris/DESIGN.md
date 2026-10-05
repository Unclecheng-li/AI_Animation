# medical-tabs — Design Notes

## Layout
- Header (absolute, top): title + horizontal tab bar
- Content area (positioned below header): .card-inner with stacked .tab-block panels

## Animation
- Active tab button: primaryColor text, primaryColor borderBottomColor via gsap.to
- Inactive tab: muted text, transparent border
- Tab content panels: opacity swap in .card-inner
- Card slight scale pulse on tab change

## V3 Constraints
- No tl.call(), no classList
- gsap.to on color/borderBottomColor replaces active class on buttons
- Header absolute; content-area top offset accounts for header height
