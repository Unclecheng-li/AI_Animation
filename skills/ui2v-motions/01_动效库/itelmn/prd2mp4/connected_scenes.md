This document outlines the rules and best practices for maintaining high-fidelity motion graphics compositions with connected sub-compositions in the HyperFrames framework.

**Official Documentation:** [Nested Compositions](https://hyperframes.heygen.com/concepts/compositions#nested-compositions)

## 1. File Structure & Templates
- **Sub-composition Files**: Every external scene (e.g., `compositions/scene1.html`) should be wrapped in a `<template>` tag. This follows the HyperFrames pattern for external assets.
- **Template ID**: Give the template a unique ID (e.g., `<template id="scene1-template">`).
- **Inner Root**: The direct child of the template must be the composition root `div` containing all metadata. This div must have the `data-composition-id` matching the sub-composition name.

## 2. Metadata Synchronization
For a scene to load and animate correctly, attributes **must match exactly** between the host and the source:
- **`data-composition-id`**: Must be identical on the container `div` (in `index.html`) and the root `div` (in the scene file).
- **Dimensions**: `data-width` and `data-height` must match (typically 1920x1080).
- **Duration**: `data-duration` on the container should match the duration defined in the scene logic.

## 3. Style & Script Scoping
To prevent styles or animations from "leaking" between scenes:
- **CSS Selectors**: Always prefix styles with the composition ID attribute selector:
  ```css
  [data-composition-id="scene1"] .element { ... }
  ```
- **GSAP Selectors**: Use a scope variable in your IIFE to target only elements within the specific composition:
  ```javascript
  const scope = '[data-composition-id="scene1"]';
  tl.to(`${scope} .element`, { ... });
  ```

## 4. Timeline Registration
- Every scene must register its timeline on the global `window.__timelines` object.
- The key used in `window.__timelines["key"]` must match the `data-composition-id`.
- Timelines must be created with `{ paused: true }`.

## 5. Dependency Management
- If a sub-composition uses GSAP or other libraries, include the `<script>` tag **inside** the template. This ensures the library is available when the composition is instantiated by the loader.

## 6. Deterministic Rendering
- **Avoid Infinite Loops**: Never use `repeat: -1`. Always calculate a finite number of repeats based on the scene duration.
- **Data-Start**: Ensure the root element of a sub-composition has `data-start="0"` (relative to its own timeline) to satisfy the rendering engine requirements.

## 7. Main Orchestration
- In `index.html`, use the `scene` class (or `.clip`) to ensure proper absolute positioning.
- Use `data-track-index` to manage layering (e.g., track 1 for backgrounds, track 2 for overlays).
- Ensure the `root` composition's `data-duration` is long enough to encompass all sub-compositions.
