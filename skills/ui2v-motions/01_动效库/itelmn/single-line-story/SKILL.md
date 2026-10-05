---
name: plotbeat
description: Build deterministic, editable data-visualization videos from local CSV/JSON or data fetched from a user-approved URL, API, or public source by adapting native HyperFrames templates and selectable visual-style presets. Requires the HyperFrames AI skill. Use when a user wants a line-chart story, multi-series ranking, animated chart, data-driven motion graphic, or a new reusable data-video template in HyperFrames. This is a HyperFrames templating workflow, not a standalone video generator or renderer.
---

# Plotbeat

Turn user-supplied data into a local HyperFrames composition. Start from a proven template, compile the data before playback, then use HyperFrames for timing, preview, validation, and rendering.

## Require HyperFrames

Treat this as a fail-closed dependency gate. Before acquiring data, listing templates, scaffolding, editing, previewing, validating, or rendering:

1. Resolve and read the installed `hyperframes` AI skill.
2. If it is unavailable, stop and ask the user to install it with:

   ```bash
   npx skills add heygen-com/hyperframes --all
   ```

3. Do not approximate the missing skill from general knowledge, use Plotbeat as a standalone generator, or continue with only the HyperFrames npm CLI.
4. After the dependency is installed, resume through the `hyperframes` skill, then use Plotbeat for the data-video template workflow.

## Preserve the product boundary

- Treat HyperFrames as the composition and rendering engine.
- Start through the main `hyperframes` skill and load its `hyperframes-core`, `hyperframes-animation`, and `hyperframes-cli` guidance as required.
- Do not add a competing render loop, video encoder, scene scheduler, or standalone animation runtime.
- Keep the output editable as an ordinary HyperFrames HTML project.
- Use one paused, seek-safe timeline per scene. Derive visual state from timeline progress.
- Keep the bundled music as a separate local `<audio>` element. Let HyperFrames own playback and use the registered GSAP timeline for volume fades; never call `play()`, `pause()`, or set `currentTime` yourself.
- The bundled master covers the quick, standard, and deliberate presets (up to 56 seconds). For a longer exact duration, resolve or ingest a longer local BGM asset before previewing.
- Compile CSV or JSON into a frozen local `generated/data.js`. Do not fetch live data during playback.
- Do not use `requestAnimationFrame`, timers, D3 transitions, or nondeterministic randomness as playback clocks.

## Acquire the dataset

- Accept either a local `.csv`/`.json` file or a request to retrieve data from a named source, URL, public API, or authorized connector.
- When retrieval is requested, fetch during preparation with the available connector, browser, API, or CLI. Do not make the user manually download a file when the agent can obtain it safely.
- Prefer first-party and authoritative sources. Clarify the metric, entities or geography, date range, and frequency only when ambiguity would materially change the story.
- Save the retrieved rows locally as CSV or JSON before scaffolding. Preserve the source URL or API name, query or filters, retrieval date, and material transformations; pass a concise citation through `--source`.
- Never invent missing observations or silently join incompatible series. State any interpolation, aggregation, filtering, or carry-forward policy.
- Fetch authenticated or private data only through access the user has authorized. Never expose credentials in the composition.

## Route the request

List the packaged catalog, then choose the closest starting template:

```bash
node {skill-dir}/scripts/scaffold.mjs --list
```

- `single-line-story`: one time series in the supplied reference style: near-black canvas, neon trace and area glow, zero-anchored expanding Y domain, upper-right value/change/date readout, endpoint label, and a dimmed final lockup.
- `multi-line-rank`: synchronized series in the supplied reference style: thin luminous paths, numbered endpoint badges, a live rank/multiplier/value rail, and a centered final ranking table.
- `bar-race`: long-form multi-series data becomes ranked horizontal bars with continuous overtakes, a rescaling axis, a current-period readout, and absolute or leader-indexed variants.
- `stacked-area-story`: long-form multi-series data becomes a contribution story with continuously revealed layers, a live total, and absolute or 100% stack variants.
- `scatter-journey`: dated X/Y positions become connected entity trails or size-aware bubble trails with live coordinates.
- `animated-map`: latitude/longitude rows become a pulsing location map or animated connection-flow story.
- `kpi-dashboard`: metric rows become staged target cards or a radial performance board.
- `milestone-timeline`: dated events become a continuous playhead timeline or chapter-card story.
- New template: start from the nearest template, keep the same data compiler/runtime boundary, and follow [references/template-authoring.md](references/template-authoring.md).

Read [references/data-contract.md](references/data-contract.md) before mapping a new dataset. Read [references/quality-gates.md](references/quality-gates.md) before presenting or rendering.
Read [references/visual-styles.md](references/visual-styles.md) before selecting or customizing the visual direction.

## Build a composition

1. Acquire the requested data or inspect the supplied file, then identify its columns, date grain, missing values, number of series, source, and desired unit.
2. Obtain the visual style and pacing before scaffolding. If the user supplies JSON copied from the Plotbeat style builder, treat that as an explicit custom visual direction: validate its documented fields, choose the nearest preset only as the scaffold base, then apply the supplied tokens and composition choices in the copied project. Do not replace the supplied JSON with the base preset. If style or pacing is otherwise missing, ask one short grouped question: “Should the visual direction be dark or light, which preset character fits the story, and should it feel quick (~18s), standard (~30s), deliberate (~45s), or use an exact duration?” Offer the installed presets from `--list-styles`; map the answer to its `--style <id>` flag and pacing to `--pace quick`, `--pace standard`, `--pace deliberate`, or `--duration <seconds>`. When a user asks the agent to decide, choose from the data context using the style reference and state the choice.
3. Normalize dates and numbers. Ask only when another choice changes the story materially; otherwise choose safe column defaults and state them.
4. Scaffold a template:

   ```bash
   node {skill-dir}/scripts/scaffold.mjs \
     --template single-line-story \
     --input /absolute/path/to/data.csv \
     --output /absolute/path/to/composition \
     --date date --value value \
     --title "What if Revenue kept compounding?" \
     --accent-text "Revenue" --unit "USD" \
     --style paper-cut --pace quick
   ```

   For long-form multi-series data, add `--series series` and select `multi-line-rank`. For wide data such as `date,North,South`, pass `--series-columns North,South` instead.

   Select `bar-race` for ranking changes or `stacked-area-story` for contribution-to-total stories. Add `--bar-mode leader-index` to normalize the current leader to 100, or `--stack-mode percent` for a 100% stacked composition. Scatter, map, KPI, and milestone inputs use the documented contracts and the `--scatter-mode`, `--map-mode`, `--kpi-mode`, and `--timeline-mode` variant flags.

5. Edit the copied `index.html`, `frame.md`, and metadata in the output project. Preserve local script paths and HyperFrames timing attributes.
6. Run the compiler again after changing column mappings, story copy, or pacing:

   ```bash
   node scripts/prepare-data.mjs \
     --template single-line-story \
     --input data/input.csv \
     --output generated/data.js \
     --composition index.html \
     --date date --value value \
     --title "What if Conversion kept compounding?" \
     --accent-text "Conversion" --unit "%" \
     --style studio-blueprint --pace standard --duration 24 --path-style linear
   ```

   `--duration` overrides only the pace preset's length; the selected pace still supplies suitable opening, finale, and closing proportions unless explicit timing flags override them. Recompiling with a different `--style` changes the design system and default chart palette without changing the data, template, or timing.

7. Validate from the composition directory:

   ```bash
   npm test
   npx hyperframes check --snapshots --samples 12
   npx hyperframes preview
   ```

8. Inspect the closed first frame, multiple opening-transition frames, early growth, middle, rank-crossing/extreme, pre-finale, staggered finale, finale hold, and closed last frame. Confirm that each line grows continuously from the left without snapping to the right edge, the live date chip follows the endpoint, axes expand from zero for positive datasets, endpoint values match the compiled rows, rank rows glide rather than jump, the finale begins only after the full chart is visible, neither transition produces a one-frame flash, and the music fades cleanly at both ends without overpowering the chart. Obtain preview approval before `npx hyperframes render`.

## Extend the template set

When the existing templates do not fit, add a new native HyperFrames template rather than branching into a new generator. Define its manifest, data shape, deterministic state model, example data, preview frames, and quality checks. Reuse `assets/runtime/plotbeat-data.js` for interpolation and formatting where practical.

Keep template-specific visual decisions in the composition and generic math in the runtime. A template is ready only when arbitrary forward and backward seeks produce the same frame and HyperFrames checks pass without unexplained suppressions.

## Resources

- `scripts/scaffold.mjs`: copies a complete template and compiles the selected dataset.
- `scripts/prepare-data.mjs`: compiles CSV/JSON to frozen local JavaScript.
- `assets/templates/`: native HyperFrames composition starters.
- `assets/catalog/templates.json`: machine-readable catalog used for template discovery.
- `assets/runtime/`: shared deterministic chart-state helpers and visual-style tokens.
- `assets/samples/`: generic sample datasets for smoke tests.
