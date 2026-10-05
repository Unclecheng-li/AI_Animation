# Hero Heatmap Pulse

A night activity board lights contribution cells week by week. Function: **engagement / streak / activity heatmap**.

## Purpose

- Developer activity, publishing streaks, usage density
- Deterministic level pattern (no Math.random)
- Emerald-on-slate analytics chrome

## Specs

- 7×12 grid authored from a fixed level array
- Cells illuminate in a left-to-right wave
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep the pattern array length at 84 (7 rows × 12 cols) if you resize the grid.
