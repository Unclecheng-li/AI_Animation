---
workflow: general-video
flow: companion
storyboard: yes
message: "Every claim RepoPilot makes carries the file and line it came from"
destination: x-feed
aspect: 1920x1080
language: en
length: 60s
angle: proof
---

## Intent

Routed by the intent layer to `/product-launch-video` (a product showcase from a
brief); `flow: companion` means `/general-video` is the executor, which is what the
`workflow` field records per the brief contract.

A 60-second feature showcase for RepoPilot, aimed at developers scrolling X and
LinkedIn — an audience that has seen a hundred "AI reads your codebase" demos and
discounts all of them. The video wins by showing the thing those demos cannot: a
claim tied to a real `file:line` span, and a claim the verifier refused to support
being stamped **flagged** on camera rather than quietly disappearing.

Three acts, each carrying one real differentiator:

1. **Lost** — the disorientation of an unfamiliar repo, and the question RepoPilot
   asks before it analyzes anything ("Who is asking?").
2. **Six lenses** — the same verified facts reordered for a security reviewer, a
   maintainer, and a learner. The persona decides what the answer *does*, not just
   how it is worded.
3. **The receipt** — claims threaded to their source spans, and one flagged claim
   that stays on screen.

Tone: engineer-credible, unhurried, no hype adjectives. Closer to a systems
diagram that moves than to a SaaS promo.

## Assets

No user-supplied material. All on-screen UI is rebuilt in HTML from the real product
surface (copy, personas, palette) rather than screen-captured — RepoPilot has no
public URL and runs locally.

Generated in-project:

- `assets/vo/line-1.wav` … `line-8.wav` — narration, HeyGen Starfish, voice
  **Relaxed Reece** (`0c2151d538844c70a8b096de533f2828`), synthesized from `SCRIPT.md`
  via `media-use/audio/scripts/heygen-tts.mjs`. Word timestamps alongside each as
  `line-N.words.json` (unused so far — the on-screen type is timed independently, so
  no caption pass depends on them).
- `assets/bgm/track.mp3` — the retrieved source, 63s, from the HeyGen catalog via the
  shared audio engine on the query "minimal ambient tech underscore, sparse pulse,
  restrained, no melody, tension". Kept for provenance; not mounted.
- `assets/bgm/bed60.mp3` — the same track rebuilt to exactly 60s with a crossfade loop,
  dropping its near-silent tail. Not mounted.
- `assets/bgm/track-ducked.mp3` — **the mounted bed**: `bed60.mp3` with the duck
  envelope baked in. Built by ffmpeg, not tweened; see `frame.md` for the expression
  and why.
- `assets/sfx/*.mp3` — six cues from the bundled `media-use` SFX library (`riser`,
  `impact-bass-1`, `impact-bass-2`, `typing`, `click-soft`, `ping`), copied in so the
  project is self-contained. Attribution: `media-use/audio/assets/sfx/CREDITS.md`.

Grounding sources for on-screen copy:

- `apps/web/src/components/repopilot-app.tsx` — hero line, section headings, placeholders, principle rows
- `apps/web/src/lib/personas.ts` — the six persona presets and their blurbs
- `apps/web/src/app/globals.css` — the palette (dark-mode tokens are the video's base)
- `README.md` — the six deterministic tools, ingestion pipeline, verifier behavior

## Customizations

- **No-capture mode.** Designed mockups only. No crawl, no screen recording, no
  running services required.
- **Muted-first.** The video must land with sound off: on-screen kinetic type is
  the primary carrier, narration is a secondary track. `SCRIPT.md` lines and the
  on-screen text are deliberately the same words so one pass serves both.
- **Span resolution** on Frame 3 — source lines resolve into exact, boxed spans
  mechanically, deliberately without any "AI shimmer" treatment. (Was node-graph
  growth; the graph and module-map surfaces are out of scope, so the video no
  longer depicts one.)
- **Thread-to-source path draw** on Frame 6 — each claim card draws a line down to
  the exact source span it cites. This is the video's signature shot.
- **Stamp impact** on Frame 7 for the `flagged` badge.
- **Design spec:** left to the workflow, seeded from the product's own dark palette
  (`--canvas: #0d1117`, `--accent: #49b9ad`, `--code: #111820`).

## Notes

- **Accuracy constraints — do not overstate.** Public GitHub repos only. Python
  is parsed by tree-sitter into exact spans; other supported languages get
  line-aware chunks. Neither invents anything, which is the only claim Frame 3
  makes. **No frame may depict a graph or dependency-map UI** — those surfaces
  are out of scope, and showing one would promise a screen the product does not
  have.
- Six persona presets plus a free-text option. Say "six lenses, or describe your
  own" — not "six lenses" alone.
- **Legibility ceiling for feed playback:** never more than 6 lines of code on
  screen at once, and render `file:line` refs at heading size rather than code size.
  A phone in a feed cannot read an IDE screenshot.
- Anti-pattern to avoid: cursor-driven screen recording with feature bullets sliding
  in over upbeat synth. Every competing dev-tool promo looks like that.
- No claim of speed, accuracy percentages, or benchmark numbers anywhere in the
  video. The product's own rule is truthful over fluent; the promo follows it.
