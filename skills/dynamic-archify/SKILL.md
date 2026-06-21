---
name: "dynamic-archify"
description: "Create professional architecture, workflow, sequence, data-flow, and lifecycle/state diagrams as standalone animated HTML files with SVG graphics, flowing animation effects, a built-in dark/light theme toggle, and one-click export to PNG / JPEG / WebP / SVG / GIF / WebM. Accepts plain-language descriptions or pasted Mermaid code and lays the diagram out from scratch. Use when the user asks for system architecture diagrams, infrastructure diagrams, cloud architecture visualizations, security diagrams, network topology, technical workflows, approval flows, runbooks, CI/CD flows, process diagrams, API call sequences, request lifecycles, data pipelines, ETL/ELT maps, PII boundaries, data lineage, state machines, lifecycle diagrams, status transitions, or asks to convert/beautify a Mermaid diagram."
version: "2.6"
license: MIT
triggers:
  - "架构图"
  - "流程图"
  - "时序图"
  - "状态机"
  - "数据流图"
  - "architecture diagram"
  - "workflow diagram"
  - "sequence diagram"
  - "dynamic-archify"
metadata:
  author: tt-a1i
  based_on: Cocoon-AI/architecture-diagram-generator (MIT, v1.0)
---

# Dynami-carchify Skill

Create professional technical diagrams as self-contained HTML files with inline SVG, a theme toggle, and a built-in image/SVG export menu.

Every diagram ships with a **dark/light theme toggle** (persists in `localStorage`, respects `prefers-color-scheme`), an **export menu** (copy PNG to clipboard; download PNG/JPEG/WebP rasterized natively at up to 4× resolution; download a **dual-theme SVG** that follows the embedding host's `prefers-color-scheme` — ideal for GitHub READMEs), and a **CSS-variable color system** that keeps both themes consistent.

## Setup (one-time, renderer modes only)

The four typed renderers validate JSON against schemas via `ajv`. From this skill's folder:

```bash
npm install
```

Without it the renderers still run — they print a warning and skip schema validation, keeping their own layout checks. The **generated HTML never has dependencies**; only the renderers do.

If you have no shell access at all (e.g. the skill was added as project knowledge), fall back to architecture mode for every request: hand-place SVG into `assets/template.html` following the Design System below, and run the self-review checklist before delivering.

## Choosing a Diagram Type

| Type | Use for | How |
|------|---------|-----|
| `architecture` | System components, cloud resources, services, security boundaries, infrastructure | `renderers/architecture/render-architecture.mjs` + JSON (or hand-place SVG when renderers can't run) |
| `workflow` | Technical flows, approval gates, tool calls, runbooks, CI/CD, incident response | `renderers/workflow/render-workflow.mjs` + JSON |
| `sequence` | API call chains, request lifecycles, cache fallback, async traces, return paths | `renderers/sequence/render-sequence.mjs` + JSON |
| `dataflow` | Pipelines, ETL/ELT, PII isolation, lineage, warehouse sync, consumers | `renderers/dataflow/render-dataflow.mjs` + JSON |
| `lifecycle` | State machines, status transitions, wait states, retries, terminal states | `renderers/lifecycle/render-lifecycle.mjs` + JSON |

Trigger phrases: "architecture/system/cloud diagram" → `architecture` (unless clearly process-oriented). "workflow/flow/process/runbook/approval/CI-CD/incident" → `workflow`. "sequence/interaction/call chain/who calls whom" → `sequence`. "data flow/pipeline/ETL/lineage/PII/governance" → `dataflow`. "state/status/lifecycle/state machine/retry/terminal" → `lifecycle`.

## Mermaid as an Input Dialect

When the user pastes Mermaid code, do NOT try to render or parse it mechanically — read it for structure and **lay out from scratch** in the matching archify mode:

| Mermaid | Archify mode | Mapping |
|---------|--------------|---------|
| `flowchart` / `graph` | `workflow` (or `architecture` if it's a component map) | `subgraph` → lane or region boundary; node shape `{}` (diamond) → decision/security node; `-->` labels → edge labels (use sparingly); `classDef`/`style` → nearest semantic type |
| `sequenceDiagram` | `sequence` | `participant` → participants (pick semantic `type` from the name); `->>` → message, `-->>` → `return` variant; `Note` → message `note`; `rect` blocks → segments |
| `stateDiagram` | `lifecycle` | states → states (pick `start`/`active`/`waiting`/`success`/`failure` from names); `[*]` start/end → `start` type / `terminal` lane; transition labels → event-like labels |

Drop Mermaid styling; keep only the topology and meaning. You choose grouping, lane order, and what deserves emphasis — that judgment is the product.

## Renderer Modes (workflow / sequence / dataflow / lifecycle)

All four modes follow the same loop:

1. **Read first**: the schema (`schemas/<type>.schema.json`) and the complete worked example (`examples/*.{workflow,sequence,dataflow,lifecycle}.json`) — copy its patterns instead of guessing field shapes.
2. Write `<name>.<type>.json`.
3. Render: `node renderers/<type>/render-<type>.mjs <input>.json <output>.html` (paths relative to this skill's folder).
4. If it fails, the error names the JSON path or the fix (thresholds, valid ranges, which knob to change). Fix the JSON and re-run; never edit the renderer.

Schema violations exit non-zero with path-prefixed messages like `/nodes/3 (id/label: "router") must NOT have additional properties`. The renderers additionally fail fast on layout problems: node/state overlap (including cross-lane), labels colliding with nodes or other labels, labels wider than their node, out-of-range columns/rows, too-short edges, and legends outside the viewBox. CJK text is measured at double width automatically.

### Workflow

```json
{
  "schema_version": 1,
  "diagram_type": "workflow",
  "meta": { "title": "Release Workflow", "subtitle": "PR to production", "output": "release.html" },
  "lanes": [ { "id": "dev", "label": "Developer" }, { "id": "ci", "label": "CI" } ],
  "nodes": [
    { "id": "pr", "lane": "dev", "col": 0, "type": "frontend", "label": "Open PR", "sublabel": "feature branch" },
    { "id": "build", "lane": "ci", "col": 1, "type": "backend", "label": "Build", "sublabel": "lint + test", "tag": "blocking" }
  ],
  "edges": [
    { "from": "pr", "to": "build", "label": "webhook", "variant": "emphasis", "fromSide": "bottom", "toSide": "top", "route": "drop" }
  ],
  "cards": []
}
```

**Layout budget**: 6 columns (`col` 0–5) at fixed x positions `[88, 220, 300, 430, 500, 625]` — columns 1↔2 and 3↔4 are only 70–80px apart, so default-width (92px) nodes in those adjacent columns of the same lane overlap; skip a column or shrink `width`. Lane content width is 640px. Omit `meta.viewBox` — the renderer sizes height to the lane count automatically. Edge routes: `straight`, `drop` (bend between lanes; `bias` 0–1 picks where), `outside-right`, `return-left`, `bottom-channel`, `up-channel`, or explicit `via` points. Keep adjacent-step edges unlabeled; reserve labels for cross-lane transitions, approvals, async writes, and returns.

### Sequence

```json
{
  "schema_version": 1,
  "diagram_type": "sequence",
  "meta": { "title": "Cache Miss Request", "subtitle": "auth and cache fallback", "output": "cache-miss.html" },
  "participants": [
    { "id": "web", "type": "frontend", "label": "Web App", "sublabel": "React UI" },
    { "id": "api", "type": "backend", "label": "API", "sublabel": "handler" }
  ],
  "segments": [ { "from": 160, "to": 320, "label": "01 / AUTH" } ],
  "messages": [
    { "from": "web", "to": "api", "y": 200, "label": "GET /data", "variant": "emphasis" },
    { "from": "api", "to": "web", "y": 290, "label": "200 JSON", "variant": "return" }
  ],
  "activations": [ { "participant": "api", "from": 190, "to": 300, "type": "backend" } ],
  "cards": []
}
```

**Layout budget**: participants sit at x = 62 + index×108, so a 920-wide viewBox fits at most 8. Message `y` must stay within `[160, viewBox_height − 83]`; messages that share horizontal space need ≥28px vertical separation; arrows need ≥60px horizontal span. `segments[].from/to` and `activations[].from/to` are **y pixel coordinates**, not participant ids. A taller `meta.viewBox` (default `[920, 760]`) buys more timeline room. Keep labels short: "GET /path", "verify JWT", "cache miss", "200 JSON".

### Dataflow

```json
{
  "schema_version": 1,
  "diagram_type": "dataflow",
  "meta": { "title": "Product Analytics", "subtitle": "events to consumers", "output": "analytics.html" },
  "stages": [ { "label": "Sources" }, { "label": "Ingest" }, { "label": "Store" } ],
  "nodes": [
    { "id": "web", "type": "frontend", "label": "Web App", "stage": 0, "row": 0, "sublabel": "clickstream" },
    { "id": "kafka", "type": "messagebus", "label": "Kafka", "stage": 1, "row": 0, "tag": "accepted events" }
  ],
  "flows": [
    { "from": "web", "to": "kafka", "label": "events", "classification": "PII touch", "variant": "emphasis" }
  ],
  "cards": []
}
```

**Layout budget**: 2–5 stages at x = 100 + stage×215; 5 rows (`row` 0–4) at y `[128, 242, 356, 470, 584]`; default node 112×58. Default viewBox `[940, 720]`. Flow labels are mandatory and asset-like ("clickstream", "identity map", "feature vectors"); put sensitivity in `classification` ("PII touch", "approved only", "non-PII"). Variants: `emphasis` = primary path, `security` = PII/policy/consent, `dashed` = async/batch.

### Lifecycle

```json
{
  "schema_version": 1,
  "diagram_type": "lifecycle",
  "meta": { "title": "Agent Run Lifecycle", "subtitle": "states and terminal outcomes", "output": "agent-run.html" },
  "lanes": [
    { "id": "main", "label": "Lifecycle phases" },
    { "id": "waiting", "label": "Interruptions" },
    { "id": "terminal", "label": "Terminal exits" }
  ],
  "states": [
    { "id": "queued", "type": "start", "label": "Queued", "lane": "main", "col": 0, "step": "01" },
    { "id": "running", "type": "active", "label": "Executing", "lane": "main", "col": 2, "step": "02" },
    { "id": "approval", "type": "waiting", "label": "Needs Approval", "lane": "waiting", "col": 0 },
    { "id": "done", "type": "success", "label": "Completed", "lane": "terminal", "col": 2 }
  ],
  "transitions": [
    { "from": "queued", "to": "running", "variant": "emphasis" },
    { "from": "running", "to": "approval", "label": "needs approval", "variant": "security", "fromSide": "bottom", "toSide": "right" },
    { "from": "running", "to": "done", "label": "success", "variant": "emphasis", "fromSide": "bottom", "toSide": "top" }
  ],
  "cards": []
}
```

**Layout budget — lane ids are semantic and reserved**: `main` is required and maps to the top phase band (cols 0–4); `terminal` maps to the bottom outcome band (cols 0–2); **every other lane id shares the single middle event band** (cols 0–2) — separate same-band states with different `col` or `yOffset`. Band headers render from your lane labels. Default viewBox `[980, 660]`. Keep transition labels event-like and sparse ("retry", "timeout", "cancel"); prefer state `tag`s, `step` numbers, and summary cards over label-heavy arrows. Put terminal states in the `terminal` lane so endings are unambiguous.

### Per-mode deep guidance

Each renderer has a README with its full design language (route presets, semantic types, story guidance): `renderers/workflow/README.md`, `renderers/sequence/README.md`, `renderers/dataflow/README.md`, `renderers/lifecycle/README.md`. Read the matching one before your first diagram of that mode in a session.

## Architecture Mode

Architecture has the same read-schema-then-render loop as the other modes — prefer it. Hand-placed SVG is the fallback for when renderers can't run.

```json
{
  "schema_version": 1,
  "diagram_type": "architecture",
  "meta": { "title": "Sample Web App", "subtitle": "3-tier SaaS on AWS", "output": "web-app.html" },
  "components": [
    { "id": "users", "type": "external", "label": "Users", "sublabel": "Browser", "pos": [40, 300] },
    { "id": "api", "type": "backend", "label": "API Server", "sublabel": "FastAPI :8000", "pos": [460, 300] },
    { "id": "db", "type": "database", "label": "PostgreSQL", "sublabel": ":5432", "pos": [680, 300] }
  ],
  "boundaries": [
    { "kind": "region", "label": "AWS us-west-2", "wraps": ["api", "db"] }
  ],
  "connections": [
    { "from": "users", "to": "api", "label": "HTTPS", "variant": "emphasis" },
    { "from": "api", "to": "db", "label": "SQL" }
  ],
  "cards": []
}
```

Render: `node renderers/architecture/render-architecture.mjs <input>.json <output>.html`.

**The renderer does the mechanical work that used to be hand-tuned**, so you only choose coordinates and meaning:

- **Free coordinates** — `pos: [x, y]` is the component's top-left; `size: [w, h]` defaults to `[120, 60]`. Unlike the typed modes there is no lane/stage grid — asymmetric placement is yours to choose. `meta.viewBox` is optional (auto-fitted to your components + a legend row).
- **Boundaries from `wraps`** — list the component ids a `region` (dashed amber) or `security-group` (dashed rose) encloses; the renderer computes the box with correct 30/50 padding automatically. Never hand-arithmetic a boundary again.
- **Connections** route like edges (`variant`, `fromSide`/`toSide`, `route: straight|orthogonal-h|orthogonal-v|auto`, `via`, `labelDx/labelDy/labelAt`). For a vertical labeled connection, push the label into the gap with `labelDy` (the validator will tell you if it lands on a box).
- The renderer auto-emits the two-rect `c-mask` pattern, draws arrows before boxes (z-order), builds the legend from the component types you used, and **fails fast on component overlap, off-canvas components/boundaries, unknown wraps/connection ids, label-vs-component collisions, and non-finite coordinates** — the same reliability the other four modes already had.

### Hand-placed fallback (no renderer available)

When Node/ajv can't run, copy `assets/template.html` and place SVG by hand. Study the worked diagram inside the template and `examples/web-app.html` for coordinate idioms, follow the Design System below, and run the self-review checklist before delivering.

### The Cardinal Rule: CSS classes, not inline colors

The theme toggle works by switching CSS custom properties. Hardcoded `fill="rgba(...)"` or `stroke="#22d3ee"` will NOT update on theme change. Always use the class system:

```svg
<rect x="X" y="Y" width="W" height="H" rx="6" class="c-mask"/>
<rect x="X" y="Y" width="W" height="H" rx="6" class="c-backend" stroke-width="1.5"/>
<text x="CX" y="CY" class="t-primary" font-size="11" font-weight="600" text-anchor="middle">API Server</text>
<text x="CX" y="CY+16" class="t-muted" font-size="9" text-anchor="middle">FastAPI :8000</text>
```

### Design system

Component fills `c-frontend` (clients/UI), `c-backend` (services/APIs), `c-database` (stores/caches), `c-cloud` (managed infra), `c-security` (auth/secrets), `c-messagebus` (Kafka/queues), `c-external` (3rd parties); text accents `t-<same>` plus neutrals `t-primary` / `t-muted` / `t-dim`. Arrows `a-default`, `a-emphasis` (hot path), `a-security` (dashed), `a-dashed` (async) — always set `stroke-width` and pair `marker-end="url(#arrowhead[-variant])"` with the matching class. Boundaries: `c-security-group` (dashed rose), `c-region` (dashed amber), `c-lane` (swimlane).

Typography inherits JetBrains Mono from the SVG root. Sizes: 11–12px component names, 9px sublabels, 8px annotations, 7px tiny labels.

### Hard layout rules

- **Two-rect pattern everywhere**: opaque `c-mask` rect first, styled `c-<type>` rect on top — semi-transparent fills otherwise let arrows bleed through.
- **Arrows before components** in document order (SVG paints in order; arrows must sit behind boxes).
- **Vertical stacking**: ≥40px gap between components; inline connectors (message buses, 20px tall) live inside the gap, never overlapping boxes.
- **Boundary padding**: boundary `y` = inner `y` − 30, boundary `height` = inner `height` + 50, label baseline 18px below the boundary top.
- **Legend placement**: outside ALL boundary boxes, ≥20px below the lowest one; grow the viewBox if needed.

### Self-review checklist (run before delivering)

1. `grep -E 'fill="(#|rgb)|stroke="(#|rgb)' out.html` inside the SVG returns nothing except the template's own defs (Cardinal Rule).
2. Every `c-<type>` rect has an identical-geometry `c-mask` rect immediately before it.
3. All `<line>`/`<path>` arrows appear before all component rects in document order.

## Export Options

Archify supports multiple export formats for both static and animated diagrams:

### Static Exports
- **PNG** — High-resolution raster image (4x source resolution)
- **JPEG** — Compressed raster image with background
- **WebP** — Modern compressed format with transparency
- **SVG** — Vector format with auto-theme support
- **Copy to Clipboard** — Quick PNG copy for pasting

### Animated Exports (for diagrams with flowing animations)
- **GIF** — Animated GIF capturing flowing animations
  - Uses gif.js library for client-side encoding
  - **User-configurable settings dialog** appears before export:
    - Resolution: 1x / 2x (default) / 3x / 4x
    - Frame rate: 10 / 15 / 20 (default) / 24 / 30 / 60 fps
    - Duration: 2 / 3 (default) / 5 / 8 seconds
  - Shows live frame count preview (e.g. "60 frames · 20 fps · 3s")
  - File size: typically 1-10 MB depending on settings and complexity

- **WebM** — High-quality video format
  - Uses MediaRecorder API for native video capture
  - **Same user-configurable settings dialog** as GIF
  - Better quality than GIF, smaller file size
  - Supported in Chrome, Firefox, Edge

### Export Tips

**For best GIF quality:**
1. Use dark theme (better contrast for animations)
2. Keep diagram size moderate (large diagrams = larger GIF files)
3. Wait for "GIF exported successfully!" toast message

**For WebM video:**
1. Works best in Chrome and Firefox
2. Safari has limited MediaRecorder support
3. Use VLC or browser to play WebM files

**File size optimization:**
- GIF: 1-5 MB for typical diagrams
- WebM: 0.5-2 MB for same content
- For sharing: WebM is recommended (better quality/size ratio)

## Flowing Animation Effects

All diagrams now include **automatic flowing animation effects** on connection paths. This feature is built into the renderers and template — no additional configuration needed.

### Animation Behavior

**CSS Animations (stroke-dasharray flow):**
- **`a-emphasis`**: Fast flow (0.8s cycle) with pulse effect, 3px glow
- **`a-default`**: Medium flow (1.2s cycle), 2px glow
- **`a-dashed`**: Steady flow (1s cycle)
- **`a-security`**: Steady flow (1s cycle)

**SVG Animations (moving dots):**
- Each connection path has an animated dot that flows along the path
- Dot properties vary by variant:
  - `emphasis`: 3px radius, high opacity (0.9), 2-3.5s duration
  - `default`: 2.5px radius, medium opacity (0.8), 2.5-3.7s duration
  - `dashed`: 2px radius, lower opacity (0.7), 2.2-3.4s duration
  - `security`: 2px radius, lower opacity (0.7), 2.5-3.5s duration

### Flow Direction Rule

**Critical constraint**: Flowing animations must flow **from the source (no arrow) to the destination (arrow)**. 

The renderers automatically handle this:
- All paths use `marker-end` for arrowheads
- Animation direction follows the path from start to end
- Dots travel from the component without arrow toward the component with arrow

### Visual Effects

1. **Stroke dash animation**: Creates the illusion of flowing dashes along the path
2. **Moving dots**: Animated circles travel along the path trajectory
3. **Glow effects**: Emphasis paths have enhanced drop-shadow filters
4. **Pulse effects**: Emphasis paths have subtle opacity pulsing

### Customization

The flowing effects are automatically applied based on the `variant` property of connections/edges/flows/transitions:

```json
{
  "from": "source",
  "to": "target",
  "variant": "emphasis",  // Fast flow with glow
  "label": "data flow"
}
```

Available variants:
- `emphasis` — Primary data flow, fastest animation, strongest glow
- `default` — Standard connections, medium animation
- `dashed` — Async/batch operations, steady flow
- `security` — Security/policy paths, steady flow

### Technical Implementation

The flowing effects are implemented in two layers:

1. **CSS layer** (`assets/template.html`):
   - `@keyframes flowDash` — Animates `stroke-dashoffset` for flowing dashes
   - `@keyframes flowPulse` — Animates opacity for emphasis pulse
   - Applied via `.a-emphasis`, `.a-default`, `.a-dashed`, `.a-security` classes

2. **SVG layer** (renderers):
   - `<animateMotion>` elements on `<circle>` dots
   - Path data from connection routing
   - Duration varies by variant and index for visual variety

### Backward Compatibility

- Existing diagrams without animations will continue to work
- Animations are purely additive — no breaking changes
- All theme toggle and export features remain fully functional
4. Compute max(y + height) over all SVG elements: viewBox height must exceed it by ≥20px; same for x/width.
5. Legend y is below every boundary's y + height.
6. The `.toolbar`, `<script>` blocks, and `:root` / `[data-theme]` CSS are untouched — they ARE the theme toggle and export menu.

## Output

A single self-contained `.html`: embedded CSS (Google Fonts loads async and degrades to system monospace offline), inline SVG, embedded gif.js library + worker for animated GIF export, ~60KB embedded JS for theme + export + animation. It renders directly in any modern browser. Raster exports render natively at up to 4× the viewBox (large diagrams step down to 3×/2× to stay under canvas limits); the SVG download is dual-theme self-contained and follows the host's `prefers-color-scheme` (manual override via `svg[data-theme="..."]`). Animated GIF/WebM exports capture the flowing animations with user-configurable resolution, frame rate, and duration.
