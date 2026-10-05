# Final master QA

Verdict: **PASS — rights-safe public release candidate.**

## Artifact identity

- Public master: `../../../demos/cutsteward-product-walkthrough-30s.mp4`
- Size: 15,719,941 bytes
- SHA-256: `09822c55be4fe00e576f76cbf249daca89b1a6e436458908e826e447df7c1989`

## Technical verification

- H.264 High, 1920x1080, yuv420p, limited BT.709, progressive.
- Constant 30/1 fps with exactly 900 stored and 900 decoded frames.
- Exact video and container duration: 30.000000s.
- AAC-LC, 48 kHz stereo, exact 30.000000s presentation duration.
- Complete all-stream FFmpeg decode with error escalation: pass, no warning.
- Integrated loudness: -16.2 LUFS; LRA: 4.6 LU; true peak: -1.0 dBTP.
- No silence interval of 250 ms or longer below -50 dB.
- Strict black-frame scan: no black or blank interval found.
- Fast-start layout verified: the MP4 `moov` atom precedes `mdat`.
- Container metadata contains only ordinary FFmpeg codec/handler tags; a
  bounded string scan found no C2PA/JUMBF record, ElevenLabs identifier,
  private absolute path, credential marker, or `AURA` text.

## Visual verification

The 1 fps whole-film sheet, 2 fps delivery-only sheet, all 13 caption moments,
and before/at/after frames around 1.20, 7.60, 9.295, 11.295, 14.46, 15.995,
25.10, and 26.38 seconds were inspected as JPEGs. No corrupt frame,
unintended blank frame, clipping, caption/UI collision, or CTA overlap was
found.

The opening uses the authentic CutSteward home recording; the locally retained
ElevenLabs Image & Video Beta evaluation is not present. The entire
11.295–25.400 delivery block shows only the dedicated public-safe local
conformance run: project-authored color/test media, genuine decode evidence,
SHA-256, approval state, and certificate. No unrelated private run, person,
portrait, user-supplied likeness, or AURA text appears.

Low-motion intervals correspond to readable product evidence and the resolved
premium CTA. The CTA finishes its transition by 26.033 seconds and remains
clean and readable through the final frame.

## Truth and rights boundary

The edit explicitly labels the handoff as `SEPARATE VERIFIED DELIVERY`. The
planning demonstration and certified conformance delivery are different stored
runs; the final sequence does not imply that the demonstrated plan produced the
certified master.

The English narration was generated once with Eleven v3 in an active Grant
workspace; ElevenLabs documents the Grant as Scale access for product launch
and Eleven v3 as generally available. The raw provider voice file is excluded
from the repository, while the transformed mixed soundtrack remains subject to
the account agreement and provider policies. The Image & Video Beta evaluation
is both Git-ignored and absent from the public master.
