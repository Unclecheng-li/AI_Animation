# Hero Sparkline Rise

A dark analytics card draws a green sparkline while the delta counts to **+38%**. Function: **KPI / growth / analytics hero**.

## Purpose

- Dashboard, growth report, and metrics heroes
- Stroke draw + area fade + endpoint dot
- Night slate analytics chrome

## Specs

- Line dashoffset 1600 over 2.2s
- Area and endpoint appear after the draw
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

If you reshape the path, re-tune stroke-dasharray so the draw finishes with the counter.
