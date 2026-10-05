# Asset provenance

This record covers the sources used by the 30-second CutSteward promo. It distinguishes authentic product evidence, narration, licensed music, and a provider evaluation that was deliberately excluded from release.

## Authentic CutSteward captures

All four release screen recordings were captured locally on 2026-08-09 from the running CutSteward app. The first three came from the normal local workspace; the fourth came from an isolated, project-generated conformance workspace. The capture script used browser automation only to reproduce a safe, read-only tutorial journey. No cloud/provider execution was triggered. The preflight confirmation control was not activated.

| File | Purpose | Technical facts | SHA-256 |
|---|---|---|---|
| `assets/screen-recordings/01-home-guided.webm` | Real home prompt and Guided/Autonomous choice | VP8, 1600×900, 25 fps, 6.200s, 711,981 bytes | `7bf64b20423048142524a7031fc179fe53dbb78fff279fef31dce4e823118708` |
| `assets/screen-recordings/02-rights-preflight.webm` | SAMPLE PLAN, Demonstration only, and rights gate | VP8, 1600×900, 25 fps, 4.120s, 258,139 bytes | `7ea806f3529ad52de7e0d5f8777dd6b9e44b7d392b8b3a58d7a842b3e90582a3` |
| `assets/screen-recordings/03-plan-inspection.webm` | Separate stored planning run with Planned only / No recorded media | VP8, 1600×900, 25 fps, 3.680s, 286,813 bytes | `6eb4d1a41f395222b625f44067be44595b9fc604a90418c17c29593c4ba6df42` |
| `assets/screen-recordings/04-verified-delivery-public.webm` | Separate public-safe certified local conformance delivery, project-authored test media, decode evidence, SHA-256, and release state | VP8, 1600×900, 25 fps, 11.320s / 283 decoded frames, 1,002,526 bytes | `cb2535cefb64d22eb8e84cabb35a7b94c79229af446b452ef29501ccc062b2ee` |

The planning demonstration and certified conformance delivery are unrelated stored runs. The edit retains the explicit `SEPARATE VERIFIED DELIVERY` bridge and does not imply that the demonstration produced the certified master. The conformance run uses project-authored test media; no unrelated private run, user-supplied media, or likeness is included.

## ElevenLabs voice

- Source: logged-in ElevenLabs Text to Speech website.
- Voice: `Ben - Deep, Warm, Conversational`.
- Model: `Eleven v3`.
- Output selected: the first downloaded result from the single authorized generation action.
- Script: the exact 60-word English script in `SCRIPT.md`; display and pronunciation are `Cut Steward`.
- Local source file: `assets/elevenlabs/cutsteward-voice-ben-v3.mp3` (Git-ignored; not redistributed as a standalone provider output).
- Technical facts: MP3, 44.1 kHz, mono, 22.831s, 381,981 bytes.
- SHA-256: `bfd7b5939e9f059d0262535065f45f35bf83ea285ece155995723e0daa05432f`.
- Plan evidence: the logged-in workspace showed an active ElevenLabs Grant plan through 2027-01-12. ElevenLabs documents Startup Grants as Scale access for building, testing, and launching a product, and documents Eleven v3 as generally available. The public repository distributes only the transformed final mix. Publication remains subject to the account agreement, applicable voice rights, laws, and current provider policies; no ownership or exclusivity beyond those terms is asserted here.

## ElevenLabs Image & Video evaluation — excluded from release

- Source: logged-in ElevenLabs Image & Video website.
- Model/settings: Google Veo 3.1 Fast, 16:9, 720p, 4 seconds, generated audio off, one generation.
- Evaluation role: one requested low-credit pilot, never product proof.
- Prompt: `Premium cinematic macro shot of a physical film strip gliding across a dark graphite editing desk, with one restrained warm brass light moving across the frame marks. Realistic optical reflections, shallow depth of field, slow controlled camera push, sophisticated production-studio mood. No people, no screens, no logos, no text, no symbols, no watermark. One continuous 16:9 shot, subtle motion, photorealistic.`
- Local file: `assets/elevenlabs/filmstrip-veo31-fast-4s.mp4` (Git-ignored).
- Technical facts: H.264, 1280×720, 24 fps, exactly 4.000s / 96 frames, silent, 1,146,958 bytes.
- SHA-256: `d6e42c0b892af1b509703bc9b4231384f1d9bfb5554896d7dbdd35e8765c39ed`.
- Release decision: ElevenLabs documents Image & Video as a Beta service, and its publishing guidance/Beta Services Addendum prohibit commercial or production use of Beta output. The clip is therefore absent from the public master and repository. The public opening uses authentic CutSteward screen footage instead.
- Official references: <https://elevenlabs.io/docs/eleven-creative/playground/image-video>, <https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform>, and <https://elevenlabs.io/bsa>.

## Internet-sourced music

- Track: `Close Up` by Michael Ramir C.
- Official Mixkit listing: <https://mixkit.co/free-stock-music/tag/corporate/>
- Official source file acquired: <https://assets.mixkit.co/music/1167/1167.mp3>
- Official license hub: <https://mixkit.co/license/>
- Local source: `.media/audio/bgm/bgm_001.mp3`.
- Technical facts: MP3, 44.1 kHz stereo, 95.137959s, 3,045,294 bytes.
- SHA-256: `a7f05a29d07a84d38072ccd2b35204bca812db86e75b2a837e71cc144d3e739b`.
- License note: Mixkit identifies Stock Music under its Free License and its official music page permits use in video projects including social media, websites, YouTube, and online advertising. The raw music file must not be republished as a standalone stock download; publish the transformed finished video and retain this provenance record.

## Release rules

- Keep authentic product pixels unaltered except for whole-frame crop, scale, and timing.
- Do not paint, reconstruct, or fabricate hashes, statuses, approvals, or provider receipts.
- Beta Image & Video output must not enter the released master without a written provider exception that covers the intended use.
- Keep the prior rights-restricted private capture, raw ElevenLabs voice, and provider video evaluation local and Git-ignored; none is a public repository asset.
- Do not redistribute the raw Mixkit music as a standalone asset.
- Recalculate the finished master's checksum after the final render; never reuse a source-asset hash as a delivery hash.

## Final mix and released derivatives

The render-ready mix is `assets/audio/cutsteward-30s-mix.m4a`: AAC-LC,
48 kHz stereo, exactly 30.000s, 757,204 bytes, SHA-256
`490e727dad51eef63209db8aa67072d60e33793ba111bb8ad310ff2ff3c5a7c2`.
Its lossless project master remains local and Git-ignored.

| Released file | Verified facts | SHA-256 |
|---|---|---|
| `../../demos/cutsteward-product-walkthrough-30s.mp4` | 15,719,941 bytes; H.264 High, 1920x1080, yuv420p limited BT.709 progressive, 30 fps CFR, exactly 30.000s / 900 decoded frames; AAC-LC 48 kHz stereo, exactly 30.000s; full A/V decode passed; -16.2 LUFS, -1.0 dBTP | `09822c55be4fe00e576f76cbf249daca89b1a6e436458908e826e447df7c1989` |
| `../../demos/posters/cutsteward-product-walkthrough.jpg` | 1920x1080 JPEG poster, 62,642 bytes | `4a7885177eef7e8fb0854de6da36fcb890dee921367b1bd659767ade85809bac` |
| `../../demos/previews/cutsteward-product-walkthrough.gif` | Silent 640x360, 6 fps, 72 frames, 11.99s, 1,613,582 bytes; full decode passed | `e36e83a0d9ba1dc21f803810b2812d1debcc824fbe3c6d96be15900b1c083647` |

The full final-master verification record is in
`qa/FINAL_MASTER_QA.md`.
