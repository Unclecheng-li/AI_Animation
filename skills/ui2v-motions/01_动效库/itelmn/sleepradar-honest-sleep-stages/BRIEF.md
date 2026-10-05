---
schema_version: 1
workflow: motion-graphics
flow: automation
storyboard: false
message: "SleepRadar exposes sleep stages while keeping the sensor-estimate qualifier attached"
destination: vertical-social
aspect: "720x1280"
language: en
audience: "Aqara FP2 owners who use Home Assistant"
length: "6s"
angle: honest-stage-cycle
narration: false
claim: "SleepRadar exposes the Aqara FP2's sleep-stage states while keeping their estimate status visible."
opening_state: "The current-stage slot is unresolved and an amber sensor-estimate qualifier is already attached."
payoff_state: "The slot cycles through REM, Light sleep, and Deep sleep before landing on Light sleep with the qualifier still attached."
motion_verb: cycle
uncertainty: "Whether the finite stage cadence is understood as possible current states rather than a historical timeline."
truth:
  source_refs:
    - "README.md:37-50"
    - "README.md:287-308"
    - "examples/sleep_tracking.yaml:10-44"
    - "https://opendoc.aqara.com/en/docs/developmanual/apiDocument/ResourceManagement.html"
    - "https://gist.github.com/Komzpa/396e66fb99592c14ba88e1bca21c11eb"
  checked_at: "2026-08-06"
  baseline_commit: "906f6dcce80f206e624b7e205c0e54334745483b"
  # Not v1.2.1: the indicative template labels this episode cites are not in
  # that tag.
  release_tag: "unreleased"
  qualifiers:
    - "Sleep stage is the sensor's best estimate, not a measured fact."
    - "Only codes 3, 4, and 5 appear; the public enumeration is community-derived and unverified."
  visible_required:
    - "Sleep stages."
    - "The sensor's best guess."
    - "Current stage"
    - "sensor estimate"
    - "REM"
    - "Light sleep"
    - "Deep sleep"
  visible_forbidden:
    - "timeline"
    - "duration"
    - "average"
    - "session"
    - "last night"
    - "measured"
---

# GIF 4 — Honest sleep stages

## Intent

Create one silent six-second feature reveal around a single current-stage Home
Assistant card. The frame-zero hook is “Sleep stages. The sensor’s best guess.”
The value cycles through REM, Light sleep, and Deep sleep before settling on
Light sleep. A fixed amber outlined chip reading “sensor estimate” remains
attached to the card in every state.

## Locked product truth

- Product truth was rechecked on 2026-07-31. The front-matter baseline pins the
  implementation commit, so every repository source reference identifies
  committed evidence.
- Current released baseline: v1.2.1, published 2026-07-03. The gate-aware
  labels this episode cites are unreleased.
- README.md identifies sleep stages as the device’s best estimate at
  ../../README.md:37-42.
- The README's community-derived, unverified table maps codes 3, 4, and 5 to
  REM, Light sleep, and Deep sleep; the episode makes no claim about disputed
  codes 0, 1, or 2.
- The approved binary shows the unsuffixed stage names REM, Light sleep, and
  Deep sleep, which are the card's own labels
  (../../card/sleepradar-card.js:37-44). The shipped optional template adds an
  "(indicative)" qualifier to each at ../../examples/sleep_tracking.yaml:10-25;
  the suffix is template-only and the episode is not rerendered for it.
- Session duration, averaged vitals, and a segmented stage timeline are
  explicitly future work, not current card behavior, at
  ../../README.md:265-276.

## Beat sheet

- 0.00–0.80s — Hook, empty Current stage value, and attached estimate chip are
  fully readable. Nothing moves.
- 0.80–1.35s — Move the em dash up and settle pre-authored REM from below.
- 1.35–1.90s — Move REM up and settle Light sleep from below.
- 1.90–2.45s — Move Light sleep up and settle Deep sleep from below.
- 2.45–3.00s — Move Deep sleep up and settle the final Light sleep payoff.
- 3.00–5.25s — Hold the complete payoff without decorative motion.
- 5.25–5.90s — Retrace the stage sequence in reverse and return to the em dash.
- 5.90–6.00s — Hold the exact opening CSS state for the loop seam.

## Visual and motion contract

- Reuse the approved GIF 1 shell: 720×1280, #101112 background, direct Inter,
  two-line 56px hook, 608px solid Home Assistant card, thin border, and calm
  transform/opacity motion.
- Keep all stage values neutral #e8e8ea. Amber is reserved for the visible
  “sensor estimate” text chip and its outline.
- Pre-author every value in the DOM. Use one paused, seek-safe GSAP 3.14.2
  timeline; do not mutate text while seeking.
- Use no media assets, camera movement, decorative effects, numeric readings,
  or additional product surface.

## Truth guard

The composition presents one current-stage estimate using only codes `3`–`5`.
The enumeration remains community-derived and unverified. It includes no
history view, duration, average, night summary, session summary, numeric
reading, or factual-scoring wording. The estimate qualifier is communicated by
both text and an outlined shape and remains visible at frame zero, throughout
the cycle, during the payoff hold, and after the exact return.

## Delivery state

Inter Variable and GSAP 3.14.2 remain pinned as local project assets. This
truth-source refresh does not alter or rerender the approved binary, refresh
hashes, or claim new binary proof.
