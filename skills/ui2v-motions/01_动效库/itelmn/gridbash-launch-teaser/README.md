# GridBash Launch Teaser

This HyperFrames composition renders the 13-second, silent launch teaser used
for GridBash publicity. It uses the existing product demo as real footage and
adds a dispatch-board motion system around it.

## Outputs

- `docs/assets/gridbash-launch-teaser.mp4` - final 1920x1080 MP4 at 30fps.
- `docs/assets/gridbash-launch-teaser-poster.png` - hook frame for embeds.

## Source

- `design.md` defines the exact palette, typography, and motion language.
- `.hyperframes/expanded-prompt.md` records the production breakdown.
- `index.html` is the composition source.
- `assets/gridbash-openvid-demo.mp4` is a keyframe-normalized copy of the
  committed product demo so frame-by-frame rendering remains deterministic.
- `assets/gsap.min.js` vendors GSAP 3.14.2 so validation and rendering do not
  depend on a CDN.

## Rebuild

Requires Node.js 22 or newer, HyperFrames 0.7.49, Chrome, FFmpeg, and FFprobe.

```powershell
cd docs/demo/gridbash-launch-teaser
npm run check
npx --yes hyperframes@0.7.49 render `
  --quality standard `
  --workers 1 `
  --video-frame-format png `
  --no-browser-gpu `
  --output gridbash-launch-teaser.mp4
```

If FFmpeg is installed but not on `PATH`, point HyperFrames at it explicitly:

```powershell
$env:HYPERFRAMES_FFMPEG_PATH = "C:\path\to\ffmpeg.exe"
$env:HYPERFRAMES_FFPROBE_PATH = "C:\path\to\ffprobe.exe"
```

The one-worker and software-browser settings are deliberate. Auto-calibration
reduced this composition to one worker on the reference machine, and software
rendering prevents intermittent glyph loss in long hardware-composited captures.
