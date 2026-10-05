# Template authoring

A Plotbeat template is a native HyperFrames composition plus a small manifest. It is not a renderer plugin.

## Required files

- `index.html`: renderable HyperFrames composition with root timing metadata and local dependencies.
- `hyperframes.json`: HyperFrames project configuration.
- `package.json`: pinned HyperFrames scripts.
- `template.json`: identity, data shape, required columns, output geometry, and license.
- `frame.md`: design and motion direction.
- `generated/data.js`: frozen sample data for an immediate preview.
- `runtime/plotbeat-data.js`: deterministic state helpers.
- `runtime/plotbeat-styles.js`: named visual tokens and shared style treatments.

## Runtime contract

Create geometry and labels as DOM/SVG elements, create one paused timeline, and register it in `window.__timelines`. The timeline may advance a plain driver from 0 to 1; render every visual property from that normalized progress through a pure controller.

The same progress must always produce the same DOM state, even after a backward seek. Avoid accumulating transforms or reading the previous frame as input.

## Manifest fields

Use a stable kebab-case `id`. Set `engine` to `hyperframes`. Describe `dataShape` as `wide`, `long`, or a more specific documented contract. Include realistic `bestFor` phrases so agents can route requests without opening the composition.

## Adding a family

Packaged families now include single-line story, multi-line rank, bar race, stacked-area story, scatter journey, animated map, KPI dashboard, and milestone timeline. Build every addition around a visual grammar and data contract, not around one hard-coded dataset.

Add generic interpolation or scale logic to the shared runtime only when two or more templates benefit. Keep layout, palette, typography, annotations, and story beats inside the template.

Load `runtime/plotbeat-styles.js` after `generated/data.js`, then call `window.PlotbeatStyles.apply(window.HF_VIDEO_SPEC.style)` before mounting controllers or creating the timeline. A new template must support every cataloged style unless its manifest explicitly declares a narrower set.
