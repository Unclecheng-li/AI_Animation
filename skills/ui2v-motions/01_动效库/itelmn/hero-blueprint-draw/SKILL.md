# Hero Blueprint Draw

A navy blueprint grid fills as construction lines draft across the sheet and lock a plan box. Function: **engineering / architecture reveal**.

## Purpose

- Infra, CAD-adjacent, and systems product heroes
- Line-draw choreography (scaleX from origin)
- Blueprint blue aesthetic

## Specs

- Grid background is static; lines animate in sequence
- Plan box fades/scales in after the path completes
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Lines use transformOrigin 0% 50% so they draw from their start points. Do not center-scale them or the draft reads as a wipe.
