# Hero Timeline Scrub

A dark edit timeline advances its playhead while the timecode ticks. Function: **editor / scrub / review**.

## Purpose

- Video tools, HyperFrames editor, and NLE heroes
- Playhead + timecode driven by one state
- Rose accent on charcoal rails

## Specs

- Playhead maps t∈[0,4.2] across 4%→96% of the track
- Active clip brightens when the head crosses it
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep the scrub ease `none` so timecode and playhead stay linear and honest.
