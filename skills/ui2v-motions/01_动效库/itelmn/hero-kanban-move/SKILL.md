# Hero Kanban Move

A yellow sticky card slides from the Doing column into Done on a warm cork-board style kanban. Function: **workflow state change** — productivity motion, not decorative particles.

## Purpose

- Project management and maker-tool heroes
- Explicit column-to-column handoff
- Paper sticky aesthetic on a honey background

## Specs

- 1920×1080, 4.5s
- Only the active sticky translates; other cards stay put
- Done column gains a green inset glow when the card arrives

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Scrub around 2.5s to verify the card lands cleanly inside Done. If the travel distance feels short on a different host font, nudge the x tween, not the column layout.
