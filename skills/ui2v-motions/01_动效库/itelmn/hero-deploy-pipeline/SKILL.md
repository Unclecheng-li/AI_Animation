# Hero Deploy Pipeline

Four CI stages (Lint → Test → Build → Deploy) turn green with connecting rails. Function: **ship / CI success / release**.

## Purpose

- DevOps, release, and platform reliability heroes
- Sequential stage pass + connector fills
- Night ops chrome with emerald success

## Specs

- Each stage: queued → running → passed
- Connectors fill after each pass
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep stage copy short — long status lines wrap inside the 280px cards.
