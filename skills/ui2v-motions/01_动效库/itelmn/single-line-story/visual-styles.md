# Visual styles

Template and style are separate choices. The template controls data grammar and motion structure. The style controls palette, typography, atmosphere, panel geometry, borders, and chart marks. Keep timing and data truth identical when switching styles.

## Presets

| Theme | Style | Flag | Character | Prefer for |
| --- | --- | --- | --- | --- |
| Dark | Signal Noir | `--style signal-noir` | Near-black, acid-lime signal, warm-white type, cinematic restraint | Markets, technical stories, dramatic reveals |
| Dark | Studio Blueprint | `--style studio-blueprint` | Drafting navy, desaturated cyan measurements, amber references | Engineering, AI metrics, operations |
| Dark | Velvet Ledger | `--style velvet-ledger` | Obsidian-brown, brass rules, serif display, architectural calm | Investor updates, premium and executive narratives |
| Dark | Ember Terminal | `--style ember-terminal` | Charcoal instruments, amber readouts, ember alerts, mono type | Live operations, security, developer metrics |
| Light | Paper Cut | `--style paper-cut` | Warm paper, serif display, hard ink shadows, coral and cobalt | Reports, culture, human-centered stories |
| Light | Newsroom Ink | `--style newsroom-ink` | Newsprint, ink serif hierarchy, red annotation, hairline rules | Public data, research, journalistic explainers |
| Light | Swiss Signal | `--style swiss-signal` | Warm white stock, black grid, red anchors, oversized grotesk type | Benchmarks, launches, bold comparisons |
| Light | Soft Organic | `--style soft-organic` | Mineral paper, forest marks, terracotta signals, contour rhythm | Wellness, community, sustainability |

List the installed presets with:

```bash
node {skill-dir}/scripts/scaffold.mjs --list-styles
```

If the user names a mood instead of a preset, first choose light or dark, then map it to the closest character above and state the mapping before preview. Do not treat a palette request as a new template.

## Palette behavior

Each preset supplies a default single-series accent and multi-series palette. An explicit `--color`, `--colors`, or `--color-column` overrides the preset palette while retaining the preset's typography, surface, and atmosphere.

Preserve contrast when applying brand colors. Use the selected preset's foreground, background, and panel treatment unless the user explicitly asks for a custom art direction. Avoid generic AI design tells: gradient text, purple-to-blue defaults, interchangeable glass cards, equal-weight card grids, and glow on every mark. Each preset must retain its own typographic hierarchy, edge treatment, density, and chart-mark behavior.

## Custom direction

Start from the closest preset, then edit the copied `runtime/plotbeat-styles.js` in the output project. Change the named preset tokens rather than scattering hard-coded colors across template HTML. Keep these roles complete: background, surface, foreground, muted, grid, accent, accent ink, border, display type, body type, corner radius, panel depth, and atmosphere.

JSON copied from the [Plotbeat style builder](https://plotbeat.app/style-builder) is a complete custom direction, not a request to select another preset. Preserve its `chartType`, `tokens`, `typography`, `chart`, and `composition` groups. Use the closest packaged preset only to scaffold the composition, then map the JSON values into the copied runtime and composition styles. Reject unknown enum values, malformed colors, non-finite numbers, or missing contrast-critical tokens; otherwise preserve the user's values. The custom JSON affects presentation only and must never alter normalized data, timing truth, citations, or seek safety.

After customization, run HyperFrames check and inspect opening, midpoint, finale, and closing snapshots. A custom style is not ready if labels, grid values, endpoint readouts, or source text lose contrast.
