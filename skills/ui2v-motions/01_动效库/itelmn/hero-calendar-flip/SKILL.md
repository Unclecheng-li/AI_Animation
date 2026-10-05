# Hero Calendar Flip

A red-header desk calendar flips its page from 3 to 4. Function: **date advance / ship-day marker**.

## Purpose

- Launch-day and scheduling heroes
- Physical page flip (rotateX from top edge)
- Warm paper on blush background

## Specs

- Top page rotates away to reveal the next day
- Soft settle on the calendar block after the flip
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep the month label short. Locale-long month names crowd the red header bar.
