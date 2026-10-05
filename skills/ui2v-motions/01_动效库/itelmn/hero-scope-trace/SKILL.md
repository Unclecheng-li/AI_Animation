# Hero Scope Trace

An oscilloscope panel draws a cyan signal from left to right behind a scanning beam. Function: **lab signal / telemetry draw-on**.

## Purpose

- Hardware, DSP, and observability heroes
- SVG stroke-dashoffset line reveal
- Dark instrument chrome

## Specs

- Trace path length is authored via dasharray 1400
- Beam x matches the draw progress
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

If you edit the path, re-tune stroke-dasharray to the new length or the draw will finish early/late.
