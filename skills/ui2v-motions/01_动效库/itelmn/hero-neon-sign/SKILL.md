# Hero Neon Sign

A night storefront frame flickers a magenta neon **OPEN** until the tubes lock on. Function: **status / availability ignition**.

## Purpose

- Launch, open-hours, and live-status heroes
- Flicker then steady glow
- Dark violet night palette

## Specs

- Flicker is authored as sequential opacity pulses; glow is always CSS-owned
- Sign eases slightly larger after lock-on
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep neon opacity tweens sequential — never overlap opacity on `#neon`.
