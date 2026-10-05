# Hero Battery Charge

A oversized battery fills from **8%** critical red to **100%** lime. Function: **power / charge / capacity status**.

## Purpose

- Device health, energy, and capacity heroes
- Color thresholds at 20% and 55%
- Zinc night chrome

## Specs

- Width and percent share one state object
- Charge ease is power1.inOut over 2.6s
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep the tip static — only the inner fill should animate.
