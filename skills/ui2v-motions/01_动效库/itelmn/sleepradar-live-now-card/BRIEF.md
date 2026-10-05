---
schema_version: 1
workflow: motion-graphics
flow: automation
storyboard: false
message: "Three current SleepRadar signals resolve into one honest Live Now card"
destination: vertical-social
aspect: "720x1280"
language: en
audience: "Aqara FP2 owners who use Home Assistant"
length: "6s"
angle: live-state-proof
narration: false
claim: "The shipped SleepRadar card turns sleep stage, heart rate, and breathing into one honest current-state readout."
opening_state: "With no independent occupancy gate configured, legacy raw code 0 says Out of bed and retained vitals are hidden behind dashes."
payoff_state: "The same no-gate card shows the public Light sleep, 56 bpm, and 13 br/min fixture with sensor-reported-measurement-versus-estimate language attached."
motion_verb: resolve
uncertainty: "Whether the dense real-card truth copy remains readable at phone-feed scale."
truth:
  # Refs are line-ranged on purpose. A bare path is compared byte-for-byte
  # against the baseline, so whole-file pinning a growing file -- above all
  # tests/sleepradar-card.test.js -- makes "add a regression test" a
  # build-breaking act. Each range below is the narrowest span that carries the
  # claim it supports.
  source_refs:
    - "README.md:33-52"
    - "README.md:176-220"
    - "card/sleepradar-card.js:25-46"
    - "card/sleepradar-card.js:217-224"
  checked_at: "2026-08-06"
  baseline_commit: "906f6dcce80f206e624b7e205c0e54334745483b"
  # Not v1.2.1: that tag predates the occupancy gate entirely, so it cannot
  # certify the gate qualifiers below.
  release_tag: "unreleased"
  qualifiers:
    - "Heart rate and breathing are sensor-reported measurements; measured names the signal category, not independent validation or clinical accuracy."
    - "The approved Out of bed opening is the legacy no-gate code-0 state; an independent occupancy gate can override that raw-code label."
    - "Retained vitals are hidden when the card resolves the bed as empty."
  visible_required:
    - "Three signals."
    - "One honest live card."
    - "Out of bed"
    - "not measuring"
    - "Light sleep"
    - "56"
    - "bpm"
    - "13"
    - "br/min"
    - "best guess"
  visible_forbidden:
    - "Body movement"
    - "Illuminance"
---

## Intent

Create GIF 2 in the five-part SleepRadar batch. Open on the shipped card's
legacy no-gate code-`0` empty-bed state, then resolve the same three consumed
sensors into the canonical public live fixture. The optional independent
occupancy gate is not configured in this approved episode. The locked hook is:

> Three signals.<br>
> One honest live card.

## Locked product truth

Product truth was rechecked on 2026-07-31. The front-matter baseline pins the
implementation commit, so every repository source reference identifies
committed evidence. The latest release remains `v1.2.1`, published 2026-07-03
(tag commit `4f74afab5eccb0693dd0d0b536623ed432b9458d`).

- The README identifies the shipped card, limits it to sleep stage, heart
  rate, and breathing, and distinguishes sensor-reported measurement signals
  from the estimated stage.
- The README preserves **Out of bed** for code `0` only in no-gate mode and
  maps code `4` to Light sleep. With confirmed independent occupancy, code `0`
  instead renders **In bed** and does not measure vitals.
- `../../assets/now-live.png` is the canonical public fixture: READING NOW,
  Light sleep, 56 bpm, 13 br/min, and the visible best-guess qualifier.
- `../../card/sleepradar-card.js` owns the three consumed entities, legacy
  no-gate compatibility, independent-gate override, dashes for hidden values,
  and live-value gating.
- `../../tests/sleepradar-card.test.js` guards both no-gate compatibility and
  gate-aware code `0`/`1`/`2` behavior.

## Visual and motion contract

- Reuse the approved pilot shell: `720x1280`, six seconds, silent, Inter,
  `#101112` background, two-line frame-zero hook, one 608px solid card surface,
  thin `#2b2d31` border, and calm transform/opacity motion.
- Frame zero shows the legacy no-gate **Out of bed** state, a neutral `not
  measuring` badge, and dashes for both vitals. Every unavailable value remains
  visibly Paused out of bed.
- Motion starts exactly at `0.8s`. The live header, stage, vitals, and truth note
  settle in reading order and are complete by `3.0s`.
- Hold the complete payoff through `5.25s`, reverse the exact state sequence
  through `5.9s`, and hold the exact CSS opening state through `6.0s`.
- The live stage always keeps “the sensor's best guess” visibly attached.
  The footer keeps the approved `measured` signal-category label and estimated
  stage explicit in text; it does not claim independent or clinical accuracy.

## Truth guards

- Show only the card's three consumed sensors.
- Never show a retained numeric vital in the resolved empty-bed state.
- Do not present raw code `0` as authoritative occupancy: the approved opening
  is explicitly no-gate compatibility behavior.
- The values `56 bpm` and `13 br/min` are the public repository fixture, not
  personal telemetry.
- No diagnosis, precision, safety, timeline, session-summary, or future-product
  implication.

## Delivery boundary

Inter Variable and GSAP 3.14.2 remain pinned as local project assets. This
truth-source refresh does not alter or rerender the approved binary, refresh
its hashes, or claim new binary proof.
