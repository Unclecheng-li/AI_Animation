# Hero Pie Slice

A dark donut chart grows category wedges for Product, Docs, and Community while a center percent updates. Function: **share-of-mix data reveal**.

## Purpose

- Analytics and growth storytelling
- Conic-gradient chart without canvas libraries
- Clear legend pairing with color wedges

## Specs

- CSS variables `--a/--b/--c` drive the conic fill
- Center label is a deterministic counter
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep three wedges max for thumbnail clarity. More slices turn into noise at homepage scale.
