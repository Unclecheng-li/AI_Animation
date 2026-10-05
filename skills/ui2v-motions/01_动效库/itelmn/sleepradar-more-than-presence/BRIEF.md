---
workflow: motion-graphics
flow: automation
storyboard: no
message: "SleepRadar reveals five FP2 signals in Home Assistant instead of only presence"
destination: vertical-social
aspect: 720x1280
language: en
audience: "Aqara FP2 owners who use Home Assistant"
length: 6s
angle: feature-reveal
narration: no
---

## Intent

Create the first SleepRadar GIF pilot as one strong, silent feature reveal.
Open on a single muted Home Assistant presence entity, then expand it into
heart rate, breathing, sleep stage, body movement, and illuminance. The hook
is "Same sensor. Now 5 sleep signals."

## Assets

- `../../DESIGN.md` — canonical SleepRadar product voice and visual tokens.
- `../../assets/sleepradar-mark.svg` — approved compact brand mark, available
  only if the closing hold needs subtle product identification.

## Customizations

- Deliver a high-quality MP4 master and an optimized animated GIF.
- Build a seamless six-second loop whose final state returns naturally to the
  opening presence card.

## Notes

- Canvas is exactly 720×1280.
- Heart rate, breathing, body movement, and illuminance are sensor-reported
  measurement signals. "Measured" names the signal category, not independent
  validation or clinical accuracy.
- Sleep stage is the sensor's estimate; do not imply medical precision.
- No credentials, personal telemetry, medical language, narration, music, or
  unshipped Last Night/session-summary claims.
- Pilot approved on 2026-07-17. GIFs 2–5 may now be built using
  `../GIF-BATCH-PLAYBOOK.md` as the locked batch baseline.
- Do not commit, publish, or modify Home Assistant.

## Verification

- The hook's count was verified on 2026-07-16 against both `origin/main` at
  `a03399c6d72799a015c559ad0a72d4c1b6811ea3` and release `v1.2.1`.
  `aqara_fp2_sleep/aqara_fp2_sleep_poller.py` publishes exactly five MQTT
  discovery sensors, and `scripts/validate_repository.py` guards that exact
  five-item contract.
- The bundled Live Now card reads three of those five sensors: sleep stage,
  heart rate, and breathing. Body movement and illuminance remain published
  Home Assistant entities; they are not card-only or unavailable features.
- PR #6 aligned examples with the published entity IDs, and PR #7 added
  `default_entity_id` without changing the five-sensor surface.
- No maximum GIF file-size budget is defined in the pilot request or repository.
  Report size changes explicitly until a ceiling is agreed.
