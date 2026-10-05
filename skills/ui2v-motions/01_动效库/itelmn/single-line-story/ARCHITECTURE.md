# Architecture

## Product boundary

Plotbeat is a specialization layer for HyperFrames. It does not provide an alternate preview server, timeline, frame loop, encoder, or renderer.

HyperFrames owns:

- composition timing and clip visibility;
- deterministic timeline seeking;
- Studio preview and approval;
- lint, runtime, layout, motion, and contrast checks;
- snapshots, rendering, and publishing.

This repository owns:

- template discovery and manifests;
- CSV/JSON normalization and validation;
- generic chart geometry and state derivation;
- data-story layouts, typography, color, annotations, and finales;
- agent instructions for selecting and adapting templates.

## Frozen-data pipeline

`scripts/prepare-data.mjs` compiles source rows into a local JavaScript file that defines `window.HF_DATA` and `window.HF_VIDEO_SPEC`. The render page performs no data fetch and has no dependency on a remote API.

The compiler is responsible for input truthfulness: parse numbers, sort dates, reject missing fields, validate shared multi-series dates, and freeze presentation options. The composition is responsible for display truthfulness: scales, formatting, axes, ranks, labels, and annotations.

## Deterministic frame model

Each composition uses one paused GSAP timeline registered in `window.__timelines`. Its driver advances from 0 to 1. The chart controller treats that number as the sole time input and returns or applies the entire frame state.

That makes these operations equivalent:

```text
seek directly to 42%  =  play to 80%, then seek back to 42%
```

No frame depends on the prior frame. The runtime avoids `Date.now()`, `Math.random()`, timers, animation-frame loops, network responses, and accumulating transforms.

## Template contract

A distributable template includes:

- a renderable HyperFrames `index.html`;
- `hyperframes.json` and pinned package scripts;
- `template.json` validated by `schemas/template.schema.json`;
- a design brief and frame direction;
- frozen sample data;
- the shared deterministic runtime.

Templates are copied, not remotely executed. The result remains an ordinary editable HyperFrames project.

## Why not embed a chart library?

General chart libraries are useful sources of scale, shape, and interaction primitives, but their animation loops and responsive layout assumptions often conflict with frame-accurate video seeking. The initial templates therefore keep a small runtime and render SVG directly.

Future adapters may use D3 modules for pure math or a chart library for static geometry, provided HyperFrames remains the only clock and arbitrary seeks remain deterministic. Library-owned transitions are not permitted in the render path.
