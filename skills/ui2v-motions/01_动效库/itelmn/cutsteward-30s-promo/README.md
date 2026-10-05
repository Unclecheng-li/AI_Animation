# CutSteward 30-second governed product walkthrough

This HyperFrames project is the editable source for CutSteward's narrated,
English-first product walkthrough for international audiences.

## Released media

- [Full-quality 30-second MP4](../../demos/cutsteward-product-walkthrough-30s.mp4)
- [README animated preview](../../demos/previews/cutsteward-product-walkthrough.gif)
- [Poster](../../demos/posters/cutsteward-product-walkthrough.jpg)

The released master is 15,719,941 bytes: 1920×1080 progressive, H.264 High
yuv420p limited BT.709, 30 fps CFR, exactly 30.000s / 900 frames, with AAC-LC
48 kHz stereo audio at exactly 30.000s. It passed full A/V decode and measures
-16.2 LUFS / -1.0 dBTP. SHA-256:
`09822c55be4fe00e576f76cbf249daca89b1a6e436458908e826e447df7c1989`.

The 640×360 GIF is a silent 11.99-second, 6 fps / 72-frame derivative that
passed full decode. Its SHA-256 is
`e36e83a0d9ba1dc21f803810b2812d1debcc824fbe3c6d96be15900b1c083647`.
The 62,642-byte poster SHA-256 is
`4a7885177eef7e8fb0854de6da36fcb890dee921367b1bd659767ade85809bac`.

## What the walkthrough shows

The edit moves from a governed brief through guidance choice, rights review,
planned-shot inspection, and verified-delivery evidence. Four authentic local
CutSteward screen recordings provide the product proof. The planning
demonstration and the certified public-safe conformance delivery are separate stored runs; the
explicit `SEPARATE VERIFIED DELIVERY` bridge prevents the edit from implying
that the demonstration produced the certified master.

The first 1.2 seconds use the authentic CutSteward home capture under a
restrained editorial treatment. English narration uses
`Ben - Deep, Warm, Conversational` with Eleven v3. The logged-in account was on
an active Grant plan, and Eleven v3 was generally available rather than Beta at
generation time. A single Veo 3.1 Fast evaluation was generated as requested,
but it is local, Git-ignored, and absent from the public master because
ElevenLabs documents Image & Video as a Beta service. The
background track is Mixkit's `Close Up` by Michael Ramir C. Use of provider
outputs remains subject to the applicable account plan and service terms; the
music remains subject to the applicable Mixkit license.

See [ASSET_PROVENANCE.md](ASSET_PROVENANCE.md) for source hashes and rights
boundaries, [qa/SCREEN_CAPTURE_MANIFEST.md](qa/SCREEN_CAPTURE_MANIFEST.md) for
capture evidence, and
[qa/GENERATION_AND_CREDIT_RECEIPT.md](qa/GENERATION_AND_CREDIT_RECEIPT.md) for
the exact provider-action ledger.

## Credit discipline

The provider workflow used exactly one video submit and one TTS submit. The
observed ElevenLabs balance change was 9,067 credits. There was no retry,
enhancement, alternate submit, upscale, extension, lip sync, ElevenLabs music
generation, purchase, or top-up.

## Edit and verify

The timeline logic is deterministic and pinned to HyperFrames 0.7.102. The
project bundles the exact Inter font files used by the composition. From this
folder:

```sh
npm run check -- --samples 15 --frame-check
npm run render -- . \
  --output=renders/cutsteward-30s-product-walkthrough-1080p.mp4 \
  --resolution=landscape --fps=30 --quality=high \
  --skill=product-launch-video --video-bitrate=5.5M --gpu \
  --workers=1 --low-memory-mode --experimental-fast-capture=false \
  --frames-cache-dir=off --video-frame-format=jpg --strict
```

The committed `assets/audio/cutsteward-30s-mix.m4a` is the render-ready final
mix. The raw Mixkit source stays outside the public repository, so rebuilding
the mix with `scripts/build-audio-mix.sh` requires a separately acquired,
rights-cleared local source file. Re-verify duration, frame count, full decode,
audio loudness, SHA-256, and visual seams after any source or timing change.
