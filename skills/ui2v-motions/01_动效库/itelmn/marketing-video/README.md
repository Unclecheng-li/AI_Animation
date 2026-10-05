# Short Pipe marketing video

This folder contains the HyperFrames source for the Short Pipe README hero video and the committed marketing assets generated from it.

## Outputs

- `short-pipe-marketing.mp4` - rendered source video (1080x1080, 43s).
- `short-pipe-marketing-square.gif` - 860x860 README hero GIF at 9fps.

## Workflow

Run commands from the repository root with `pnpm --dir marketing-video <script>`.

```sh
pnpm --dir marketing-video dev
pnpm --dir marketing-video check
pnpm --dir marketing-video render
```

`dev` opens the HyperFrames preview, `check` runs lint / validate / inspect, and `render` produces the MP4.
After rendering, regenerate `short-pipe-marketing-square.gif` from the MP4 before updating the README hero asset:

```sh
ffmpeg -y -i short-pipe-marketing.mp4 \
  -vf "fps=9,scale=860:860:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=96[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5" \
  short-pipe-marketing-square.gif
```

## Composition Notes

Frame 0 is the settled outro: the three-bar pipe mark (the app icon), the `Short Pipe` wordmark, the `long-form in, captioned shorts out` tagline, the `life is too short to be cutting shorts all day` hook, and the Homebrew install command.
It doubles as the X thumbnail and a seamless loop point, so the ending wipes back to the identical frame.

The story between is one real cut, told from the very beginning and drawn in the product's own paper-and-ink editorial identity (see `DESIGN.md`):
the project library appears, a long-form file (`the-focus-hour.mp4`) is dragged onto the dropzone to create the project, the three-pane editor opens on the hour-long `The Focus Hour`, the user clicks `Find shorts with AI`, the agent transcribes locally and scans the transcript (one quiet on-device status line, never a chat), ranked shorts drop into the filmstrip, the top one plays as a captioned 9:16 short, the caption style is swapped live from `clean` to `bold-pop`, the transcript editor opens, the end handle is dragged to extend the clip word by word, the exact out point is fine-tuned on the waveform (the duration ticks 3.7s -> 5.7s), `Save range` returns to the preview, it is exported to 1080x1920 with the export button filling by percentage, and the inspector and filmstrip pills flip to `rendered` before the wipe back to the outro.

A single `#stage` camera holds the whole app at identity and pushes in on the library, the filmstrip, the phone, the transcript, and the inspector for each beat.
The cursor lives outside the stage and only ever clicks while the camera is static, so its screen targets map exactly through the current transform.
The phone preview is the real `center-square` short composition with full source framing, the dark theme, a kicker serif headline, and animated captions, with a CSS stand-in for the source footage so no video ships with the repo.
The example subject is deliberately neutral and broadly interesting - a podcast on focus, with shorts like "Why boredom is good for you", "The myth of multitasking", and "The two-minute focus reset".
