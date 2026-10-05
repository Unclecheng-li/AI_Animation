# Hero Slider Settle

A render-quality slider rises past the target, corrects, then settles on **75%**. Function: **range control / preference set**.

## Purpose

- Settings, export quality, and filter heroes
- Overshoot then settle (no overlapping property fights)
- Soft teal control panel

## Specs

- Path: 0 → 88 → 72 → 75
- Thumb and fill share one state object
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Drive width/left from one state so fill and thumb never desync.
