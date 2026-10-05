# HyperFrames scaffold findings (Task 1)

Source of truth for Tasks 3-8. Everything below was directly observed by running
`hyperframes` v0.8.3 on the `ampere-dev` VM (Node v26.7.0, npm 11.19.0, FFmpeg
n9.0.1, system Chromium 151.0.7922.34, linux/arm64) on 2026-08-18. The scaffold
used was `npx hyperframes init hyperframes-init --example blank --non-interactive`,
rendered and then deleted per Step 6 — nothing from it is checked in.

## Toolchain check (Step 1)

```
node --version   -> v26.7.0
npm --version    -> 11.19.0
ffmpeg -version  -> ffmpeg version n9.0.1-6-g9d4ca21220-20260818
chromium --version        -> command not found
chromium-browser --version -> Chromium 151.0.7922.34
```

Note: the binary is `chromium-browser` on this VM, not `chromium`. The render
step later confirmed hyperframes auto-detects it: "Using system Chrome at
`/usr/bin/chromium-browser`".

## `hyperframes init` is not fully non-interactive by default

`npx hyperframes init hyperframes-init` with no flags fails:
`Non-interactive init requires --example, --video, or --audio. For an empty
starter project, pass --example blank explicitly.` Later tasks scaffolding
`trailer/` for real must pass `--example <name>` (or `-e`). The `blank`
example was used for this probe; `hyperframes init --help` also lists
`warm-grain` and `swiss-grid` as bundled starter examples. `--non-interactive`
additionally suppresses prompts once an example is chosen.

`init` also clones and installs 9 HyperFrames/GSAP skill packs into
`~/.claude/skills` and `~/.agents/skills` on whatever machine runs it (global,
not project-scoped) and reports anonymous telemetry unless disabled via
`hyperframes telemetry disable`. This is a side effect of `init` itself, not
of the scaffolded project — expect it again whenever a later task scaffolds a
fresh project on the VM.

## Scaffold layout (`blank` example)

```
hyperframes-init/
  AGENTS.md
  CLAUDE.md
  hyperframes.json
  index.html
  meta.json
  package.json
```

No `node_modules/` — the project has no installed dependencies; `dev`,
`check`, `render`, `publish` in `package.json` all shell out to
`npx --yes hyperframes@0.8.3 <cmd>`, pinned to the exact version that scaffolded
it:

```json
"scripts": {
  "dev": "npx --yes hyperframes@0.8.3 preview",
  "check": "npx --yes hyperframes@0.8.3 check",
  "render": "npx --yes hyperframes@0.8.3 render",
  "publish": "npx --yes hyperframes@0.8.3 publish"
}
```

`hyperframes.json` (project config, not a script manifest):

```json
{
  "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
  "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  "paths": {
    "blocks": "compositions",
    "components": "compositions/components",
    "assets": "assets"
  },
  "media": { "autoProxy": true }
}
```

## GSAP inclusion (confirmed)

The `blank` example's `index.html` loads GSAP from a CDN, not a vendored or
npm-resolved local file:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
```

This is the **exact tag to reuse verbatim** in `trailer/index.html` for
Task 3+ (same pinned version, `gsap@3.14.2`). Confirmed during `render` (Step
4 log line): `[Compiler] Inlined CDN script:
https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js` — the renderer
fetches and inlines the CDN script at compile time before capture, so the CDN
dependency does not require network access during frame capture itself, only
during the compile phase of `render`/`preview`/`check`.

Composition-level timeline registration pattern (from the same file):

```html
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
  // tl.from("#title", { opacity: 0, y: -50, duration: 1 }, 0);
  window.__timelines["main"] = tl;
</script>
```

The timeline is registered on `window.__timelines[<data-composition-id>]` and
must be created `paused: true` — the render runtime drives the timeline's
`.seek()` itself per captured frame; it does not `.play()` it.

## `data-track-index` semantics (confirmed authoritative)

**`data-track-index` is a temporal-overlap lane, not a visual z-order.**
Confirmed against the HyperFrames skill docs installed by `init`
(`~/.claude/skills/hyperframes-core/references/tracks-and-clips.md` and
`data-attributes.md` on the VM — these are the framework's own maintained
reference, not something inferred from the scaffold alone, which only shows
the attribute once in a comment):

- Two clips sharing the same `data-track-index` **must not overlap in time**
  (`[data-start, data-start + data-duration)` ranges). `hyperframes lint`
  flags same-track time overlap as an error.
- **Visual stacking (front/back) is controlled by CSS `z-index`, not by
  `data-track-index`.** A clip on track 5 is not drawn above a clip on track
  1 — they're just on different sequencing lanes.
- No fixed numbering convention is enforced, but the common pattern documented
  is: track 0 for a base video/A-roll, track 1+ for visual scenes/overlays/
  captions, and higher tracks (10+) reserved for audio clips to keep visual
  and audio linting separate.
- `data-track-index` is **required** on every clip (`Yes` in the attribute
  table), alongside `data-start` (required) and `data-duration` (required for
  `div`/`img`/sub-composition clips; optional for `video`/`audio` which can
  infer duration from the media).
- `class="clip"` is **required** on visible timed elements (`div`, `img`,
  etc.) or the runtime ignores `data-start`/`data-duration` and keeps the
  element visible for the whole composition. Not required on `video`/`audio`.
- Visual clips must be **direct children of the composition root** — a clip
  nested inside a wrapper `div` is not registered as a clip at all (its
  timing attributes are ignored). Wrap *inside* the clip if a transform
  wrapper is needed.
- `data-start` accepts either an absolute number in seconds or a relative
  reference to another clip's `id` (`"introId + 2"`, `"introId - 0.5"`) meaning
  "N seconds after/before that clip ends". Negative offsets create an
  overlap for crossfades and must live on a **different** track than the clip
  they overlap.

Practical implication for Tasks 3-8: pick track indices by checking for time
overlap, not by desired stacking order. Use CSS `z-index` for stacking.

## `hyperframes lint` output on the default template (Step 4, confirmed)

```
◆  Linting hyperframes-init/index.html

◇  0 errors, 0 warnings
```

Exit code 0. Pristine — no warnings glossed over.

## `hyperframes render` CLI invocation (confirmed)

Command actually run (from the project directory, VM PATH includes both nvm's
Node and `~/tools/ffmpeg-9.0/bin`):

```bash
npx hyperframes render
```

(No flags needed to get a working MP4 — this is what "render the default
template" resolves to with zero configuration.) Full flag surface from
`npx hyperframes render --help`, the ones later tasks are likely to need:

- `-o, --output=<output>` — output path. **Default: `renders/<name>.mp4`**
  (name = project directory name), confirmed by observed output path below.
- `-c, --composition=<composition>` — render a specific composition file
  instead of `index.html` (e.g. `compositions/intro.html`); pass `.` or omit
  to render `index.html`.
- `-f, --fps=<fps>` — defaults to the root's `data-fps`, else 30.
- `-q, --quality=<quality>` — `draft | standard | high`, default `standard`.
- `--format=<format>` — `mp4 | webm | mov | gif | png-sequence`, default `mp4`.
- `-w, --workers=<workers>` — parallel Chrome workers, default `auto`.
- `--strict` / `--strict-all` — fail the render on lint errors / errors+warnings.
  Off by default (`--best-effort` is on by default), so a render can succeed
  even with lint issues unless one of these is passed.

Observed output path for this run (exit 0):

```
renders/hyperframes-init_2026-08-18_20-46-07.mp4
```

i.e. `renders/<project-dir-name>_<YYYY-MM-DD>_<HH-MM-SS>.mp4`, relative to the
project directory, matching the documented default `renders/<name>.mp4` with
a timestamp suffix auto-appended when `-o` is not passed. **Later tasks that
need a stable/predictable filename should pass `-o` explicitly** rather than
relying on this timestamped default.

Render used the system Chromium (`/usr/bin/chromium-browser`) since
`chrome-headless-shell` isn't installed; hyperframes logged a one-line note
that this forces "screenshot mode" capture (still fully functional, just not
the perf-optimized capture path) — not a failure, just informational. Full
run: 300 frames (10s @ 30fps) captured in ~26s wall time, output
`25.9 KB · 10.0s video`. No errors in the log; the only non-progress line
worth flagging is `[non-blocking] Failed to load resource: the server
responded with a status of 404 (Not Found)` which the tool itself prefixes
`[non-blocking]` — this is expected on the blank template (it has no favicon)
and did not affect the render outcome.

## `window.__timelines` is not required for a bare-declarative composition (Task 2)

Confirmed empirically on 2026-08-18 while spiking a one-clip composition with
no GSAP animation at all (just a `<video>` timed via `data-start`/
`data-duration`/`data-track-index`, no `<script>` block). Running
`hyperframes lint` against it without any `window.__timelines` registration
produced, among other errors, both `missing_timeline_registry` and
`missing_data_no_timeline`:

```text
✗ missing_timeline_registry: Missing `window.__timelines` registration.
  Fix: Register each composition timeline on `window.__timelines[compositionId]`.
⚠ missing_data_no_timeline: This composition has no `window.__timelines` registration but is missing `data-no-timeline`. The producer polls for timeline registration for up to 45 seconds before timing out, adding 45 s to every render.
  Fix: Add `data-no-timeline` to the root element to skip the poll: `<div data-composition-id="..." data-no-timeline ...>`.
```

The fix is **not** to register an empty `gsap.timeline({ paused: true })` —
it's to add the `data-no-timeline` boolean attribute to the composition root:

```html
<div id="stage" data-composition-id="FrameAccuracyProbe" data-width="1000"
     data-height="200" data-duration="10" data-start="0" data-no-timeline>
```

With that attribute set (plus `data-width`/`data-height`/`data-start` on the
root, `muted` and a unique `id` on the `<video>` — all separately required by
lint, unrelated to the timeline question), lint reports `0 errors, 0
warnings`. Without `data-no-timeline`, the render would still likely succeed
but would burn an extra ~45s per render on the pointless timeline poll.

**Practical rule for Task 3+:** a composition with zero GSAP-driven animation
should skip `window.__timelines` entirely and set `data-no-timeline` on the
root. Register `window.__timelines[<composition-id>]` only for compositions
that actually drive GSAP (e.g. Task 7).

## What Tasks 3-8 should copy verbatim

1. GSAP script tag: `<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>`
2. Timeline registration pattern: `window.__timelines[<composition-id>] = gsap.timeline({ paused: true })`
3. Render command: `npx hyperframes render` (add `-o <path>` for a stable filename; add `--strict` if lint errors should fail the render instead of best-effort).
4. Lint command: `npx hyperframes lint` — must show `0 errors, 0 warnings` before a composition is considered done.
5. `data-track-index` — assign by time-overlap avoidance only; use CSS `z-index` for visual layering; every clip needs `data-track-index`, `data-start`, and (for div/img) `data-duration`; visible `div`/`img` clips need `class="clip"` and must be direct children of the composition root.
