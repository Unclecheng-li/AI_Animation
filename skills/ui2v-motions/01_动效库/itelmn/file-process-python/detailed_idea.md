# Detailed Concept: The Infinite Schematic

This document outlines the in-depth visual and technical design for the "Infinite Schematic" HyperFrames composition.

## 1. Visual Design Language

**Aesthetic & Vibe:** A highly technical, information-dense "engineering blueprint" or motherboard. It should feel like zooming into a complex microchip where data is the electricity.

*   **Color Palette (Dark Mode Blueprint):**
    *   *Background:* Deep Slate / Navy (`#0f172a`).
    *   *Grid:* Subtle repeating dot or line grid in a slightly lighter blue (`#1e293b`).
    *   *Connecting Lines (Wires):* Base state is muted cyan (`#22d3ee` at 30% opacity). Active state is bright glowing cyan.
    *   *Nodes (Files):* Pill-shaped with solid borders and semi-transparent backgrounds. Color-coded by domain (e.g., Green for Structured, Purple for Media).
    *   *Nodes (Functions):* Diamond-shaped or hexagonal to denote processing.
    *   *Nodes (Memory Objects):* Large, rectangular glassmorphic panels (`backdrop-filter: blur()`, subject to performance testing).
*   **Typography:** Monospaced fonts for all technical terms and code (e.g., `Fira Code`, `JetBrains Mono`). Sans-serif for high-level labels (e.g., `Inter`).

## 2. Layout & Structure (The "Miro Board")

Instead of replacing elements on screen, the entire composition exists on a massive virtual canvas (e.g., 5000px by 3000px). The screen acts as a "camera" panning and zooming across this canvas using GSAP `x`, `y`, and `scale` transforms on the root container.

The canvas is divided into three vertical columns, and six horizontal rows (the domains):

1.  **Left Column:** Raw File Formats (Sources)
2.  **Center Column:** Ingestion Functions & In-Memory Python Objects (Processing)
3.  **Right Column:** End Applications (Output UI mockups)

## 3. Scene Breakdown (60 Seconds)

### Scene 1: The Macro View (0s - 8s)
*   **Action:** Starts zoomed out, showing the entire massive grid. All 6 domains (Structured, Config, Text, Media, Spatial, Binary) are visible.
*   **Animation:** A subtle pulse travels through all the connecting lines. High-level labels fade in: "PYTHON DATA ECOSYSTEM".

### Scene 2: Zoom on Tabular / Structured (8s - 16s)
*   **Action:** Camera zooms rapidly into the top sector.
*   **Visual:** `[ .csv ]`, `[ .parquet ]`, `[ .sqlite ]` nodes.
*   **Animation:** Glowing "data packets" travel along lines from the files to a hexagonal node: `pd.read_*()`. From there, a thick, glowing line pipes into a large glass panel: `<class 'pandas.DataFrame'>`.
*   **Micro-Animation:** Inside the DataFrame panel, a miniature grid animates, simulating rows being sorted.
*   **Output:** The line continues to a "Financial Dashboard" UI component where a miniature bar chart grows.

### Scene 3: Pan to Text / NLP (16s - 24s)
*   **Action:** Camera pans down smoothly.
*   **Visual:** `[ .pdf ]`, `[ .md ]` nodes.
*   **Animation:** Lines flow into `builtins.open()` and `PyMuPDF`. The flow combines into a text block `<class 'str'>` and then into `<class 'spacy.tokens.Doc'>`.
*   **Micro-Animation:** Code typing effect inside the string block.
*   **Output:** Flows into an "LLM Interface" where a chat bubble types out an automated summary.

### Scene 4: Pan to Media (Vision & Audio) (24s - 36s)
*   **Action:** Camera pans right.
*   **Visual (Vision):** `[ .jpg ]` flows through `cv2.imread()` into `<class 'numpy.ndarray'>`. The ndarray is represented as a 3D cascading matrix of numbers. Output is a photo with an animated bounding box.
*   **Visual (Audio):** `[ .wav ]` flows through `librosa.load()` into `<class 'torch.Tensor'>`. The tensor is represented by a pulsing audio waveform. Output is a text transcript appearing.

### Scene 5: Pan to Scientific / Spatial (36s - 45s)
*   **Action:** Camera pans up.
*   **Visual:** `[ .geojson ]` and `[ .shp ]` flow into `gpd.read_file()`, resulting in `<class 'geopandas.GeoDataFrame'>`.
*   **Micro-Animation:** The GeoDataFrame panel shows abstract polygonal shapes combining.
*   **Output:** An animated vector map drawing its borders.

### Scene 6: The Full Circuit Convergence (45s - 55s)
*   **Action:** Rapid, smooth zoom out to the initial Macro View.
*   **Animation:** "Data Flow" animation triggers across ALL paths simultaneously at high speed. The entire board lights up like a functioning CPU.
*   **Text Overlay:** "The Universal Processor" scales up in the center.

### Scene 7: Outro (55s - 60s)
*   **Action:** Grid fades down. Final branding or call to action.

## 4. Technical Implementation Strategy (HyperFrames)

1.  **The Virtual Camera:**
    *   Create a `#world-container` `div` that is much larger than the viewport (e.g., `width: 400vw; height: 400vh;`).
    *   Apply GSAP transformations to `#world-container`: `gsap.to("#world-container", { scale: 0.5, x: -1000, y: 500, duration: 2, ease: "power3.inOut" })`.
2.  **SVG Data Lines:**
    *   Use absolute positioned `<svg>` elements that span the `#world-container`.
    *   Draw the connecting pipes using `<path>`.
    *   Animate the data flow using `stroke-dasharray` and GSAP animating the `stroke-dashoffset`.
3.  **Composition Architecture:**
    *   **Crucial Pattern:** Do not put everything in `index.html`.
    *   Create `compositions/sector_tabular.html`, `compositions/sector_media.html`, etc.
    *   Use `<div data-composition-src="compositions/sector_tabular.html" class="absolute top-0 left-0 w-[1000px] h-[500px]"></div>` to place them on the massive board.
4.  **Performance Considerations:**
    *   Avoid heavy CSS filters (`blur()`, `drop-shadow()`) on elements that are moving. If the camera is panning, large blurred backgrounds can cause "slow frames" during rendering. Use solid colors or pre-rendered images for glows if necessary.
    *   Only use CSS transforms (`translate`, `scale`) for movement, never `top`/`left`.
