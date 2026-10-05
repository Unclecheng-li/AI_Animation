# Hero Progress Ring

A slate SaaS card with a cyan circular meter that fills to **100%**. Function: **onboarding / sync / install completion**.

## Purpose

- Setup wizards, import progress, and install complete heroes
- Stroke-dashoffset ring + live percent counter
- Dark product UI chrome

## Specs

- Circumference authored as `stroke-dasharray: 1131` (r=180)
- Counter and arc share the same 2.4s ease
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

If you change the radius, recompute circumference (`2 * π * r`) for dasharray/offset.
