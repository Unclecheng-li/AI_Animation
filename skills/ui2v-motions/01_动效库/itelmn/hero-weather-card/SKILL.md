# Hero Weather Card

A frosted pastel weather widget rises on a sky gradient while the sun blooms and temperature climbs. Function: **ambient status card** for consumer-app storytelling.

## Purpose

- Soft product heroes (travel, lifestyle, consumer apps)
- Icon + metric pairing without charts
- Light palette contrast against dark neon catalog pieces

## Specs

- 1920×1080, 4.5s
- Sun uses back.out scale; temperature uses deterministic onUpdate counter
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep the city label short. A long location string crowds the sun/cloud composition.
