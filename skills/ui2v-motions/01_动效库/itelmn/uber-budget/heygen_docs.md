# HyperFrames Documentation Summary

Derived from https://hyperframes.heygen.com/llms.txt and related pages.

## Core Concepts

1. **Compositions**: The building blocks of HyperFrames videos.
2. **HTML Clips**: Video, images, audio, and nested compositions.
3. **Data Attributes**: Control timing (`data-start`, `data-duration`), ordering (`data-track-index`), and metadata.
4. **Deterministic Rendering**: No `Math.random()`, `Date.now()`, or network fetches. Every render must be identical.
5. **GSAP Integration**: All animations must be registered on `window.__timelines` using paused GSAP timelines.

## Structure Requirements

### Root Composition (`index.html`)
- Must have `data-width` and `data-height` on the root element.
- Root element should have `data-composition-id` matching the `window.__timelines` key.
- Root element needs `data-start="0"` to begin playback.

### Sub-Compositions (`compositions/*.html`)
- **Template Wrapper**: Each external composition file MUST be wrapped in a `<template>` tag.
- **Root Element**: Inside the template, there should be a root `div` with `data-composition-id`.
- **Dimensions**: Sub-compositions should have `data-width` and `data-height`.
- **Script**: Each template must include a `<script>` block that registers its timeline on `window.__timelines`.

## Attribute Reference

| Attribute | Required | Description |
|-----------|----------|-------------|
| `class="clip"` | Yes (visible) | Enables visibility management. Omit for audio. |
| `data-start` | Yes | Start time (seconds) or clip ID reference (relative timing). |
| `data-duration` | Varies | Required for images. Optional for video/audio. **Not used on compositions** (duration comes from GSAP). |
| `data-track-index` | Yes | Controls z-order and overlaps. |
| `data-composition-id` | Yes | Matches `window.__timelines` key. |
| `data-composition-src`| No | Path to nested composition HTML. |

## Animation Rules

- All timelines must be registered: `window.__timelines["id"] = tl;`.
- Timelines must be paused: `gsap.timeline({ paused: true });`.
- No infinite repeats: `repeat: -1` is forbidden. Use finite repeats.
- No `async/await` or `fetch` during timeline construction.
- Use `tl.set()` to "hard kill" visibility after exit animations to ensure clean seeking.

## Media Handling

- **Video**: Use `muted` attribute. Put audio in separate `<audio>` tags for mixing.
- **GSAP on Video**: Do not animate `width`, `height`, `top`, or `left` directly on `<video>` tags (wrap in a `div` instead).

## Checklist for Agents
- [ ] Every composition has `data-width` and `data-height`.
- [ ] Reusable compositions are in `<template>` files.
- [ ] Timelines registered correctly.
- [ ] `class="clip"` on timed visible elements.
- [ ] No `Math.random()`.
- [ ] Run `npx hyperframes lint` before finishing.
