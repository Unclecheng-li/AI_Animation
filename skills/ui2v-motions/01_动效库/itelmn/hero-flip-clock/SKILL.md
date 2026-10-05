# Hero Flip Clock

Mechanical flip-clock cards roll toward a launch timestamp. This piece is about **time-to-event**, not abstract glow or kinetic slogans.

## Purpose

- Countdown and launch-window heroes
- Analog flip metaphor without image assets
- Dark instrument aesthetic for product opens

## Specs

- Canvas 1920×1080 @ 30fps, duration 4.5s
- Entry: `index.html`
- Digits rotate in on X, then tick via short flip pulses

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep digit contrast high so the clock still reads at homepage thumbnail size. Avoid animating letter-spacing; only transform and textContent updates are used.
