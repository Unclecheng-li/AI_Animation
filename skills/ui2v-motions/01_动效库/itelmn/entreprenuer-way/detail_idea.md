# Detailed Idea 1: The Geometry of Business (Sub-composition Edition)

This document expands on the abstract geometry concept, providing precise timings, shape definitions, and technical notes for building it using **nested sub-compositions** in the Hyperframes framework.

## 1. Visual Lexicon (CSS Shapes)

To ensure scoping, all styles must be prefixed with `[data-composition-id="..."]`.

*   **The Entrepreneur (`.entrepreneur`):** A smooth Blue Circle (`border-radius: 50%`).
*   **The Problem (`.problem`):** A jagged Red Polygon (created using CSS `clip-path: polygon(...)`).
*   **The Product (`.product`):** A glowing Yellow Triangle or Star.
*   **The Team (`.team-member`):** Small, sharp Squares of different colors.
*   **The Customers (`.customer`):** Gray Circles that turn bright Green when happy.
*   **The Profit (`.coin`):** Tiny golden-yellow circles.

---

## 2. Sub-composition Roadmap (45 Seconds Total)

### Sub-composition 1: The Problem & The Spark
*   **File:** `compositions/scene1.html`
*   **ID:** `scene1`
*   **Timing:** 0s - 15s
*   **Host Tag:** `<div class="clip scene-1" data-composition-src="compositions/scene1.html" data-composition-id="scene1" data-start="0" data-duration="15" data-track-index="1"></div>`

**Internal Logic (0s - 15s):**
*   **0s - 5s: The Struggle**
    *   `.problem` vibrates in center (GSAP `x/y` jitter).
*   **5s - 10s: Observation**
    *   `.entrepreneur` slides in from left.
*   **10s - 15s: The Solution**
    *   `.problem` scales to 0; `.product` pops out of `.entrepreneur` (GSAP `Elastic.easeOut`).

### Sub-composition 2: Building the Machine
*   **File:** `compositions/scene2.html`
*   **ID:** `scene2`
*   **Timing:** 15s - 30s
*   **Host Tag:** `<div class="clip scene-2" data-composition-src="compositions/scene2.html" data-composition-id="scene2" data-start="15" data-duration="15" data-track-index="1"></div>`

**Internal Logic (0s - 15s):**
*   **0s - 5s: Taking Center Stage**
    *   `.entrepreneur` + `.product` move to screen center.
*   **5s - 10s: Hiring the Team**
    *   Four `.team-member` squares pop in via `stagger: 0.2`.
*   **10s - 15s: The Work Process**
    *   `.product` clones fly between `.team-member` squares.

### Sub-composition 3: The Flow of Profit
*   **File:** `compositions/scene3.html`
*   **ID:** `scene3`
*   **Timing:** 30s - 45s
*   **Host Tag:** `<div class="clip scene-3" data-composition-src="compositions/scene3.html" data-composition-id="scene3" data-start="30" data-duration="15" data-track-index="1"></div>`

**Internal Logic (0s - 15s):**
*   **0s - 10s: Processing Customers**
    *   `.customer` stream enters left (gray), hits center, exits right (green).
*   **10s - 15s: Ultimate Success**
    *   `.coin` fountain shoots up; background graph draws itself.

---

## 3. Scoping & Implementation Rules

### CSS Scoping
All styles in `index.css` or within sub-composition `<style>` tags must be scoped:
```css
[data-composition-id="scene1"] .entrepreneur {
  background: #3498db;
  border-radius: 50%;
}
```

### GSAP Scoping
Initialize timelines with a specific scope to avoid targeting elements in other scenes:
```javascript
const scope = '[data-composition-id="scene1"]';
const tl = gsap.timeline({ paused: true });
tl.to(`${scope} .entrepreneur`, { x: 500, duration: 2 });
window.__timelines["scene1"] = tl;
```

### Sub-composition Structure
Every file in `compositions/*.html` must follow this template:
```html
<template id="scene1-template">
  <div data-composition-id="scene1" data-width="1920" data-height="1080" data-duration="15">
    <style> /* Scoped CSS */ </style>
    <div class="entrepreneur clip" data-start="0" data-duration="15" data-track-index="2"></div>
    <!-- Other elements -->
    <script>
      (function() {
        const scope = '[data-composition-id="scene1"]';
        const tl = gsap.timeline({ paused: true });
        // Animation logic...
        window.__timelines["scene1"] = tl;
      })();
    </script>
  </div>
</template>
```

---

## 4. Technical Checklist

1.  **[ ] Metadata Sync**: `data-duration` on the host (in `index.html`) must match the `data-duration` inside the sub-composition file.
2.  **[ ] Template Wrapping**: Sub-compositions must be inside a `<template>` tag.
3.  **[ ] Internal Timing**: Inside a sub-composition, elements use `data-start` relative to **that scene's start (0s)**, not the master timeline.
4.  **[ ] Library Availability**: Include GSAP `<script>` inside the `<template>` if the sub-composition is loaded dynamically.
5.  **[ ] Determinism**: Use hardcoded loops and offsets. No `Math.random()`.
6.  **[ ] Absolute Positioning**: Every timed element must have `class="clip"`.
