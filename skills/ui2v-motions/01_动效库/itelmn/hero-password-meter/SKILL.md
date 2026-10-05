# Hero Password Meter

A dark auth card grows a masked passphrase while four strength segments light from weak to strong. Function: **security / signup strength**.

## Purpose

- Account creation, password reset, and security heroes
- Segmented meter with labeled strength states
- Warm stone dark chrome

## Specs

- Segments color in order: red → amber → lime → green
- Field mask length increases with each tier
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Do not animate real password text — keep dots only for privacy-safe demos.
