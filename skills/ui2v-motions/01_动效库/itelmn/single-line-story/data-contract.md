# Data contract

The compiler accepts `.csv` and `.json`. JSON may be an array of row objects or an object with a `rows` array. All data is compiled to `generated/data.js` before HyperFrames playback.

## Source acquisition

The compiler intentionally reads local files only. For a source-based request, fetch the data before compilation, normalize the response into CSV or JSON, and keep that file as the composition input. Prefer an official API, first-party download, or user-authorized connector.

Record the source URL or API name, query parameters or filters, retrieval date, and any aggregation or gap-filling decisions. Pass a concise human-readable citation with `--source`. Do not fetch or refresh data during HyperFrames playback.

## Single-line story

Default columns:

| Field | Default column | Requirement |
| --- | --- | --- |
| Date | `date` | Parseable date or ISO date string |
| Value | `value` | Finite number |

At least two rows are required. Dates are sorted ascending. Duplicate dates should be resolved before compilation.

## Multi-series templates

Use long-form rows with these defaults:

| Field | Default column | Requirement |
| --- | --- | --- |
| Date | `date` | Parseable date or ISO date string |
| Series | `series` | Non-empty category label |
| Value | `value` | Finite number |

At least two distinct series are required. In v0.1, every series must contain the same ordered dates. Resolve gaps before compilation by dropping incomplete dates, carrying values forward, interpolating, or explicitly choosing another policy with the user.

The normalized contract powers three grammars:

- `multi-line-rank` compares trajectories and live rank changes.
- `bar-race` emphasizes ordered competition; use `--bar-mode absolute` or `--bar-mode leader-index`.
- `stacked-area-story` emphasizes contribution to a changing whole; use `--stack-mode absolute` or `--stack-mode percent`.

For a wide multi-series file such as `date,North,South,West`, pass `--series-columns North,South,West`. The compiler converts it to the same internal series contract. Pass `--colors '#74d000,#f3f5f4,#ff9f1c'` for an ordered palette.

For long-form data with a per-series color field, pass `--color-column color`. Every row for the same series must use a consistent color.

## Presentation fields

Pass `--title`, `--accent-text`, `--source`, `--unit`, and `--decimals` to keep story copy out of the raw data. `--accent-text` highlights the matching substring in the centered headline. The single-line template also accepts `--baseline-label` and `--finale-kicker`.

Use `--path-style linear` for the jagged reference treatment or `--path-style smooth` for a monotone curve. Use `--max-ranked` to cap the visible live and finale rankings; the reference-style layout supports up to 17 rows at 1920×1080.

Use `--bar-mode leader-index` only when relative position is the intended story; it converts the current leader to 100% while preserving the same ordering. Use `--stack-mode percent` when share-of-total matters more than absolute magnitude. State these transformations in the title or subtitle so the viewer is not misled.

Choose pacing explicitly with `--pace quick` (18s), `--pace standard` (30s), or `--pace deliberate` (45s). Ask the user for this preference when it is not already stated. `--duration` may override the preset length while retaining its transition proportions. For exact choreography, use `--intro-hold`, `--intro-end`, `--finale-start`, `--finale-transition`, and `--outro-start`. The finale transition must finish before the outro begins.

Choose visual direction independently with `--style signal-noir`, `--style paper-cut`, or `--style studio-blueprint`. The style changes design tokens and the default chart palette; it does not change normalized values, timing, or template behavior. Explicit color flags override only the preset palette.

When changing `--duration`, pass `--composition index.html`. The compiler updates the root and clip `data-duration` attributes so HyperFrames' compile-time duration matches `window.HF_VIDEO_SPEC`. The scaffold command does this automatically.

The output defines two globals:

- `window.HF_DATA`: normalized title, source, unit, and series points.
- `window.HF_VIDEO_SPEC`: visual style, pacing preset, duration, opening/finale/outro timing, formatting, and rank settings.

Never fetch or mutate these values during playback.

## Scatter journey

Use long-form rows with `date`, `series`, `x`, and `y`; `size` is optional. Every series traces its positions in date order. Use `--scatter-mode trail` for equal endpoints or `--scatter-mode bubble` when the size field is meaningful.

## Animated map

Use one row per point with `location`, `latitude`, `longitude`, and `value`. Latitude must be between -90 and 90 and longitude between -180 and 180. Use `--map-mode pulse` for independent locations or `--map-mode flow` to connect rows in their input order.

## KPI dashboard

Use one row per metric with `metric`, `value`, `target`, and `change`; `unit` and `suffix` are optional. Use `--kpi-mode cards` for a compact board or `--kpi-mode radial` for circular metric modules.

## Milestone timeline

Use one row per event with `date` and `title`; `description` and `category` are optional. Events are sorted chronologically. Use `--timeline-mode continuous` for an alternating timeline or `--timeline-mode chapters` for discrete event cards.
