# Johari SafeX Cockpit Variant

Status: accepted-locked

Sources:
- Editorial product-surface design notes.
- SafeX-style diagnostic cockpit reference cues, adapted into a reusable learning frame.

Implementation notes:
- Kept accepted Johari content, variable schema, and animation sequence intact.
- Reworked the visual system into a dark diagnostic cockpit.
- Used Claude design cues: coral accents, dark product surfaces, restrained elevated panels.
- Used SafeX reference cues: navy/cyan grid, glow, scanline, top status rail, raised audit panel.
- Added matrix shell, topbar, scanline, and cyan/coral/teal/amber quadrant signals.
- Increased right-card contrast after proof review so body text stays readable.

Proof outputs:
- `..\..\renders\johari-window-safex-cockpit.mp4`
- `..\..\renders\johari-window-safex-cockpit-frame-1s.png`
- `..\..\renders\johari-window-safex-cockpit-frame-7s.png`

Known warnings:
- Existing panel opacity swap still triggers an unresolved GSAP overlap lint warning.
- Google Fonts warning remains from the base template pattern.

Lock decision:
- 2026-06-10: Accepted as a locked Johari visual variant.
- Base Johari remains unchanged; this version is retained as an isolated variant for future template styling.
