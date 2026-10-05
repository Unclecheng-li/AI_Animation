# SVG Logo Sources for HyperFrames

This document lists reliable sources for organization and service logos, optimized for use within the HyperFrames framework.

> [!IMPORTANT]
> **HyperFrames Rule:** To ensure deterministic rendering, avoid fetching logos via external APIs at runtime. Always download the SVG or embed the raw SVG code directly into your compositions.

## Recommended Libraries

### 1. [Simple Icons](https://simpleicons.org/)
*   **Focus:** Monochrome brand icons.
*   **Collection:** 3,000+ logos.
*   **Usage:** Best for clean, consistent UI. Copy the SVG path data directly into your HTML.

### 2. [svgl](https://svgl.app/)
*   **Focus:** Modern tech stacks and web services.
*   **Variants:** Often includes full-color, light mode, and dark mode versions.
*   **Usage:** Excellent for "Powered by" sections or tech-focused animations.

### 3. [theSVG](https://thesvg.org/)
*   **Focus:** Massive variety and variants.
*   **Collection:** 5,600+ icons.
*   **Usage:** Best when you need specific logo variants (e.g., wordmarks vs. symbols).

### 4. [Super Tiny Icons](https://github.com/edent/SuperTinyIcons)
*   **Focus:** Extreme optimization.
*   **Usage:** Use these if you have many logos on screen at once and need to keep the file size minimal.

## Logo Search APIs (For Discovery)

If you need to find a logo for a specific domain, use these services to discover the asset, then download it to your `/assets` folder.

*   **[Logo.dev](https://logo.dev/):** `https://img.logo.dev/DOMAIN?token=YOUR_TOKEN`
*   **[Clearbit Logo API](https://clearbit.com/logo):** `https://logo.clearbit.com/google.com`

## How to Embed an SVG in HyperFrames

Instead of using an `<img>` tag, paste the `<svg>` code directly to allow for easy animation of internal paths:

```html
<div class="clip" data-start="1" data-duration="5" data-track-index="1">
    <svg viewBox="0 0 24 24" width="100" height="100">
        <!-- Paste Path Data Here -->
        <path fill="currentColor" d="..." />
    </svg>
</div>
```

By embedding the code, you can use GSAP to animate properties like `stroke-dashoffset`, `fill`, and `transform` on individual parts of the logo.
