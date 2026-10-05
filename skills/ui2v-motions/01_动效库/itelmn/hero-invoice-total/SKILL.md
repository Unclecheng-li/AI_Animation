# Hero Invoice Total

A clean invoice reveals three line items, then counts the total to **$610**. Function: **billing / paid receipt**.

## Purpose

- Pricing, checkout, and finance heroes
- Staggered rows + currency count-up
- Cool slate paper UI

## Specs

- Rows enter every 0.3s; total follows
- Counter eases to 610 over 1.1s
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep the PAID badge static — the motion story is the total lock-in.
