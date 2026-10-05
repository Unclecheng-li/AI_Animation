---
schema_version: 1
workflow: motion-graphics
flow: automation
storyboard: false
message: "Heart rate and breathing are sensor-reported measurement signals exposed contact-free to Home Assistant"
destination: vertical-social
aspect: "720x1280"
language: en
audience: "Aqara FP2 owners who use Home Assistant"
length: "6s"
angle: measured-signals
narration: false
claim: "SleepRadar exposes the Aqara FP2's sensor-reported heart-rate and breathing measurement signals to Home Assistant without a wearable."
opening_state: "Two labelled Home Assistant sensor cards are present but show no readings."
payoff_state: "Both cards activate as measured contact-free signals while showing units but no invented numeric telemetry."
motion_verb: activate
uncertainty: "Whether the finite radar pulse reads as activation rather than decorative motion."
truth:
  source_refs:
    - "README.md:9-11"
    - "README.md:37-50"
    - "DESIGN.md:12-20"
    - "aqara_fp2_sleep/aqara_fp2_sleep_poller.py:111-137"
  checked_at: "2026-08-06"
  baseline_commit: "906f6dcce80f206e624b7e205c0e54334745483b"
  release_tag: "v1.2.1"
  qualifiers:
    - "The visible word measured identifies a sensor-reported signal category, not independent validation or clinical accuracy."
    - "No personal or numerical telemetry is depicted."
  visible_required:
    - "Heart + breathing."
    - "Measured contact-free."
    - "Heart rate"
    - "Breathing"
    - "bpm"
    - "br/min"
    - "measured"
  visible_forbidden:
    - "clinical"
    - "diagnosis"
---

## Intent

Create GIF 3 in the approved five-GIF SleepRadar family. Open on the canonical
SleepRadar mark and two subdued, unknown Home Assistant sensor cards. A single
finite radar pulse activates Heart rate first and Breathing second, resolving
to the concrete hook “Heart + breathing. Measured contact-free.” The approved
word “measured” names the signal category, not independently verified
accuracy.

## Assets

- `../../assets/sleepradar-mark.svg:1-21` — canonical SleepRadar mark geometry
  and accessible description. The project-local copy preserves that geometry
  while flattening its fills to the locked solid batch palette; the canonical
  product asset remains untouched.
- `../sleepradar-more-than-presence/` — approved GIF 1 shell for palette,
  Inter typography, hook geometry, card surfaces, calm motion, and loop return.
- `assets/inter-latin-wght-normal.woff2` and `assets/gsap.min.js` — pinned local
  Inter Variable and GSAP 3.14.2 runtime assets for self-contained rendering.

## Product truth

- Product truth was rechecked on 2026-07-31. The front-matter baseline pins the
  implementation commit, so every repository source reference identifies
  committed evidence. Latest release: `v1.2.1`, dated 2026-07-03.
- `../../README.md:9-11` describes contact-free heart rate and breathing from
  an Aqara FP2 in Home Assistant.
- The README identifies heart rate and breathing as sensor-reported
  measurements, distinguishes that category from independent or clinical
  accuracy, and identifies sleep stages as estimates.
- The README defines Heart rate in `bpm` and Respiration rate in breaths/min as
  sensor-reported measurement entities.

## Locked beat sheet

- `0.00–0.80s` — readable frame-zero hook; canonical mark and two unknown
  sensor cards hold still. No readings are shown.
- `0.80–1.75s` — one finite solid-border radar pulse starts at the mark; Heart
  rate resolves to `bpm · measured` with a red accent and visible text.
- `1.75–3.00s` — Breathing resolves to `br/min · measured` with a blue accent;
  the full two-card payoff is complete by 3.00s.
- `3.00–5.25s` — exact readable payoff hold.
- `5.25–5.90s` — reverse the activation in breathing-then-heart order and
  restore the subdued mark and unknown cards.
- `5.90–6.00s` — exact opening CSS state holds for the loop seam.

## Constraints

- Silent, `720×1280`, 30 fps source timeline, exactly six seconds.
- No numerical readings, personal telemetry, independently validated or
  clinical accuracy claim, diagnosis, medical framing, bed-empty claim, audio,
  gradients in authored UI/pulse, random motion, timers, or infinite repeats.
- Semantic red and blue accents are always paired with a visible unit and the
  word “measured”; that word identifies the signal category, while unknown
  states remain neutral gray.
- The canonical mark's geometry is the sole visual asset; its project-local
  fills are flattened to solid locked palette colors so the no-gradient rule is
  literal.

## Delivery

This truth-source refresh does not alter or rerender the approved binary and
does not claim new binary proof. A future render-affecting change still requires
strict checks, snapshots, final rendering, binary-derived proof, size and loop
verification, and localhost handoff.
