# Hero Barcode Scan

A packing-slip barcode sits on paper stock while a cyan laser sweeps across the bars and confirms verification. Function: **scan / verify**, logistics energy — not kinetic type or neon glow.

## Purpose

- Commerce, warehouse, and inventory product heroes
- Utilitarian light UI against a gray dock background
- Horizontal verification motion with a clear success state

## Specs

- 1920×1080, 4.5 seconds, 30fps
- Bars are static widths; only the laser and status animate
- Entry file: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep the slip slightly paper-like (near-white, soft shadow). Do not randomize bar widths — authored constants keep the composition seek-safe.
