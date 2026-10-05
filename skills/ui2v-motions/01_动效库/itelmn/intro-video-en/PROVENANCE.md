# intro-video-en — Provenance and handling

HyperFrames source for the former Demo (replaced in v0.11.0 by the v2 full cut under `media/intro-video-v2`).

## Provenance

- Originally produced in the standalone directory `~/Projects/work/rite-intro-video-en/`; imported under repository management (`media/intro-video-en/`).
- Imported as-is without altering the source, then updated to the v0.7 spec in a separate commit.

## Build / preview

```bash
cd media/intro-video-en
npm run check    # hyperframes lint && validate && inspect
npm run dev      # hyperframes preview
npm run render   # hyperframes render (produces the MP4)
```

Rendering requires HyperFrames (`npx hyperframes`) + headless Chromium + ffmpeg.

## Not committed (`.gitignore`d)

| Item | Reason |
|------|--------|
| `*.mp4` (`rite-intro-en.mp4` / `rite-intro-en-bgm*.mp4`, etc.) | Build artifacts re-derivable via `npm run render`. The playable README video is uploaded separately as a GitHub user-attachment |
| `*.mp3` (BGM) | License constraint (below) |

## About the BGM

- Track: **BombinSound — Technology** (Pixabay, track ID `499581`)
- Source: <https://pixabay.com/users/bombinsound-54782632/>
- License: [Pixabay Content License](https://pixabay.com/service/terms/) — free for commercial use, no attribution required, **but prohibits distributing the Content on a standalone basis** (no creative effort applied, substantially the same form), including as an audio file.
- Therefore the **raw mp3 is not committed** to this repository (placing it in a public repo would make it standalone-downloadable). To render with BGM, download `bombinsound-technology-tech-technology-90-second-499581.mp3` from the Pixabay page above and place it in this directory.
- Distributing the **rendered video itself** (a new creative work combining the BGM with the visuals) is permitted under the Pixabay license.
