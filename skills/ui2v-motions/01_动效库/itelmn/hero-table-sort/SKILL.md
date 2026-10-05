# Hero Table Sort

A registry table flips the downloads arrow and reorders the top row to the highest count. Function: **data table / sort affordance**.

## Purpose

- Admin lists, analytics tables, catalog browsers
- Arrow flip + coordinated row translates
- Cool sky-slate chrome

## Specs

- Row `#r3` (2,410) moves to the top; `#r1`/`#r2` shift down one slot
- Soft highlight on the winning row after settle
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Row travel distances assume 92px row height — keep that constant if you restyle.
