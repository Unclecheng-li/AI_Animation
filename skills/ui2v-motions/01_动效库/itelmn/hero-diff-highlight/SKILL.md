# Hero Diff Highlight

A dark code editor reveals a red deletion then a green addition with a soft pulse. Function: **PR / code-change explainer**.

## Purpose

- Developer tools, changelog, and refactor heroes
- Contextual line chrome with traffic-light window bar
- Monospace diff readability at 28px

## Specs

- Neutral lines fade up first; del then add enter
- Add line pulses once after landing
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Escape `&` as `&amp;` in HTML source so lint/render stays valid.
