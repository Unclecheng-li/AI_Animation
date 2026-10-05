# Hero Compass Spin

A mint compass dial spins its needle past north, then settles. Function: **orientation / wayfinding settle**.

## Purpose

- Maps, travel, and "find your way" heroes
- Overshoot then settle rotation
- Soft emerald field

## Specs

- Needle starts at −220°, overshoots to 18°, corrects to −6°, then 0°
- Compass scales slightly after settle
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep needle rotation sequential — never overlap rotation tweens on `#needle`.
