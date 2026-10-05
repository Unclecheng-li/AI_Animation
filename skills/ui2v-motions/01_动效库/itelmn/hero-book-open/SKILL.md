# Hero Book Open

A hardcover spread opens from the spine — left and right pages rotate into place on a stone-gray stage. Function: **story object reveal**, editorial and narrative products.

## Purpose

- Publishing, education, and storytelling heroes
- Physical object metaphor (not UI chrome)
- Warm paper pages on a cool stone ground

## Specs

- Pages use rotateY from closed to open
- Spine stays centered as the hinge
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Keep chapter copy short. Long paragraphs overflow the page silhouette at thumbnail scale.
