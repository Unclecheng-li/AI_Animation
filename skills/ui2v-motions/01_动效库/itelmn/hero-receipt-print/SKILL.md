# Hero Receipt Print

A thermal receipt feeds down from a dark checkout slot. Function: **transaction / publish confirmation print**.

## Purpose

- Checkout, billing, and "shipped" confirmation heroes
- Paper feed from a fixed mouth
- Monospace receipt typography

## Specs

- Receipt starts above the mouth (`top: -520px`) and translates down
- Soft settle nudge at the end
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep receipt lines short so they stay readable at 22px monospace.
