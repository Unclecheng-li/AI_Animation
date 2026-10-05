# Hero Keymap Press

A dark keyboard chord presses **Ctrl → Shift → P** then confirms a publish queue. Function: **shortcut / power-user action**.

## Purpose

- CLI, IDE, and productivity heroes
- Physical key depress (translate + shadow)
- Warm stone keys on zinc board

## Specs

- Keys light 0.35s apart
- Board micro-punch when the chord completes
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Prefer class toggles for pressed state so shadow/offset stay CSS-owned.
