---
schema_version: 1
workflow: motion-graphics
flow: automation
storyboard: false
message: "Three configured previous-night histories expand into one optional Home Assistant dashboard view"
destination: vertical-social
aspect: "720x1280"
language: en
audience: "Aqara FP2 owners who use Home Assistant Recorder"
length: "6s"
angle: dashboard-structure-proof
narration: false
claim: "The current repository's optional dashboard puts sleep state, heart rate, and breathing history for the previous night into one Home Assistant view."
opening_state: "A compact Last night dashboard outline shows three collapsed, labelled history rails with no values or traces."
payoff_state: "The rails expand into three configured panels with the previous-night window, units, stage labels, and sensor-reported-measurement-versus-estimate qualifiers."
motion_verb: expand
uncertainty: "Whether viewers understand this as a structural proof of the configured dashboard rather than proof of one real recorded night."
truth:
  source_refs:
    - "README.md:223-250"
    - "examples/README.md:33-39"
    - "examples/dashboard-sleep.yaml:13-88"
    - "examples/dashboard-sleep.yaml:90-155"
    - "TODOS.md:98-110"
  checked_at: "2026-08-08"
  baseline_commit: "906f6dcce80f206e624b7e205c0e54334745483b"
  release_tag: "unreleased"
  qualifiers:
    - "This is an optional dashboard example that requires one night of Recorder history."
    - "Heart rate and breathing are sensor-reported measurements; measured names the signal category, not independent validation or clinical accuracy."
    - "The composition shows configured structure, not plotted or invented telemetry."
  visible_required:
    - "SleepRadar"
    - "Last night."
    - "Three histories. One view."
    - "Sleep state"
    - "Heart rate"
    - "Breathing"
    - "Previous night · 22:00–10:00"
    - "Optional dashboard example"
    - "Requires one night of Recorder history"
    - "Aqara estimate"
    - "measured"
  visible_forbidden:
    - "session duration"
    - "average"
    - "summary"
---

# GIF 6 — Last night dashboard structure

## Intent

Validate Quiet Proof Loops against a new, current repository feature without
inventing overnight telemetry. The frame-zero hook is:

> Last night.<br>
> Three histories. One view.

Three collapsed, labelled rails expand into the exact topology configured in
the optional dashboard example. No graph trace, readout, cursor, or personal
value appears. The visible footer keeps the Recorder requirement and
sensor-reported-measurement-versus-estimate distinction attached. The approved
visible word “measured” names the signal category and is not an accuracy claim.

A small static SleepRadar mark-and-name lockup identifies the detached clip
without adding another motion beat or competing with the proof hook.

This is a workflow validation episode, not a replacement for the real-data
overnight retrospective still selected in `TODOS.md`. The dashboard exists on
the current repository baseline but remains in the Unreleased changelog
section, so the clip does not attribute it to `v1.2.1`.

Truth sources were rechecked on 2026-07-31. The front-matter baseline pins the
implementation commit, so every repository source reference identifies
committed evidence. This documentation-only truth refresh does not alter or
rerender the approved binary, refresh its hashes, or claim new binary proof.

## Beat sheet

| Time | Beat |
| --- | --- |
| 0.00–0.80s | Hold the static brand lockup, hook, compact dashboard outline, and three collapsed labelled rails. |
| 0.80–1.45s | Expand Sleep state with Awake, REM, Light, Deep and its estimate qualifier. |
| 1.45–2.10s | Expand Heart rate with the configured bpm unit and measured label. |
| 2.10–2.75s | Expand Breathing with the configured br/min unit and measured label. |
| 2.75–3.00s | Reveal the previous-night window and Recorder requirement. |
| 3.00–5.25s | Hold the complete structural proof without ambient motion. |
| 5.25–5.90s | Collapse the panels in reverse and restore the exact outline. |
| 5.90–6.00s | Hold the exact frame-zero state for the seam. |

## Non-goals

- No claim that a real night was recorded or that these are actual values.
- No session duration, averaged vitals, summary, or segmented stage timeline.
- No simulated Home Assistant interaction; expansion is editorial explanation.
- No animated logo reveal or separate brand beat.
- No product, dashboard YAML, release, or publishing change.
