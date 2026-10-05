# short-pipe - Marketing Video

## Style prompt

Paper and Ink.
A calm editorial desk where a long recording is read, marked up, and cut down to a few captioned shorts.
Warm newsprint canvas, near-black ink type, one vermillion signal color, a quiet ultramarine for "ready".
Serif for the things you read (titles, the transcript, the rendered headline), sans for the controls, mono for timecodes and the install line.
No gradients as decoration, no emoji, no neon, no bounce during the product workflow.
Motion is deliberate and short - ease-out, like a page being turned, not a spring.
The product reads an hour of footage and hands back the best thirty seconds, so the video practices the same restraint: it shows the real editor doing real work.
The only flourish is the outro pipe, whose three bars settle into place once - the long-form funneling down to a single short - before resting on the identical loop frame.

## Colors

Pulled verbatim from `design/tokens/colors_and_type.css` (the canonical token source).

### Paper & canvas (the page)
- **paper** `#faf9f5` - app background, warm newsprint
- **paper-2** `#fffffe` - raised paper, topbars, panels
- **paper-edge** `#efede6` - hairline between paper surfaces
- **canvas** `#f3f3f0` - recessed wells, the stage pane, tracks
- **canvas-2** `#ffffff` - cards, inputs, controls
- **canvas-hover** `#ecece8` - control hover
- **canvas-press** `#e4e4df` - mousedown

### Ink (text + dark frames)
- **frame** `#0f0e0c` - near-black frame, primary button, phone body
- **ink** `#16161a` - primary text
- **ink-2** `#5a5750` - secondary text
- **ink-3** `#8b8678` - tertiary / muted labels
- **ink-4** `#b8b2a2` - faint big rank numerals, disabled
- **ink-on-dark** `#fbf7eb` - text on dark frames

### Lines
- **line** `#e5e4de` - default hairline
- **line-paper** `#e5e2d5` - hairline on warm paper
- **line-strong** `#cfcdc4` - input borders, stronger rules
- **line-dark** `#2a2924` - rules on dark surfaces

### Accents - vermillion (the brand red) + ultramarine
- **vermillion** `#c7361f` - the only loud accent: keywords, the accent Export button, scrubber fill, selected waveform bars, the bottom pipe bar, keyword chips, the live caption keyword
- **vermillion-soft** `#e8b8ae`, **vermillion-wash** `#fbe4dd`
- **ultramarine** `#1f3a7a` - quiet secondary: the "ready" pill, info
- **ultramarine-soft** `#b8c3dc`, **ultramarine-wash** `#e4ebfa`

### Semantic status
- **ok** `#2f7d46` / **ok-wash** `#d9eede` - rendered, approved
- **caution** `#bd8400` / **caution-wash** `#fbe7bc` - running, the trim range highlight
- **danger** `#c0301a`
- **mute** `#9a9587` / **mute-wash** `#eceae2` - none / rejected

The rendered short on the phone, when `dark` theme is shown, flips to surface `#16161a`, ink `#fbf7eb`, accent `#ef6a4d` (vermillion lifted for contrast on the ink page).

## Typography

- **Display** - `DM Serif Display`. The "Short Pipe" wordmark, the library/section headings, the rendered short's serif headline, the empty-state heading. Weight 400.
- **Body** - `Newsreader`. Candidate titles, the inspector reason/passage, the trim transcript. Weights 400/500/600, italic for the masthead title style.
- **UI** - `Inter`. Every control, label, pill, button, meta line. Weights 400/500/600/700. Uppercase tracked labels at 0.6px.
- **Caption** - `Outfit`. The rendered short's captions only (clean 700, karaoke 800, bold-pop 900 uppercase). Never in the app chrome.
- **Mono** - `JetBrains Mono`. Timecodes, fps/resolution specs, the rank/duration meta, file paths, and the `brew install` line. Tabular numerals on every number.

Video scale: the editor is drawn at native app pixel sizes then the whole stage is scaled ~1.35x so 12-13px control copy reads on a phone. The phone preview itself is the real 1080x1920 short composition, scaled down into a 9:16 device.

## Motion

- `--dur-1` 120ms (hover/press), `--dur-2` 220ms (enter/leave, pill flips, caption swaps), `--dur-3` 480ms (deliberate panel + camera moves). For video pacing, stretch reveals to 0.4-0.8s.
- Primary ease is the token ease `cubic-bezier(0.2, 0.7, 0.2, 1)`; use `power2.out`, `power3.out`, `expo.out`, `sine.inOut`. The caption entrances mirror the real renderer: `power3.out` rise for clean/karaoke, `back.out(1.7)` pop for bold-pop (the one allowed overshoot, because it is the product's own caption animation).
- The agent run is a spinner + a single rotating status line (Transcribing -> Reading the transcript -> Scanning -> Choosing the best shorts), never a chat log.
- Render export progress is determinate in-product: the Export / Re-export button fills left to right behind the label as HyperFrames reports percentages.
- Camera: a single `.stage` transform that holds the whole editor at identity, then pushes in on the filmstrip as shorts land, on the phone as captions play, and on the inspector as a style is swapped. Pull back to identity between beats. No GPU layer on the stage (text must re-rasterize crisply at scale).
- No springs, no 3D, no bounce during the workflow. The outro pipe's three bars may slide/settle once (`power3.out`, a hair of `power2`), then rest - the short-pipe equivalent of a turned page, not a boing.

## What this video shows

A frame-0 outro poster (the pipe mark + `Short Pipe` wordmark + tagline + Homebrew install, used as the X thumbnail and the seamless loop point), then the story of one real cut, told from the very beginning:

start on the project library -> drag a long-form file (`the-focus-hour.mp4`) onto the dropzone -> the project opens in the editor with the hour-long `The Focus Hour` loaded -> the empty stage invites the agent -> click `Find shorts with AI` -> the agent transcribes locally and scans the transcript (nothing leaves the machine) -> ranked shorts drop into the filmstrip -> select the top one -> the 9:16 phone plays the captioned short (`WHY BOREDOM IS GOOD FOR YOU`, boredom in vermillion) -> swap the caption style and watch the preview update live -> open the transcript editor, drag the transcript end handle to extend the clip by words, then nudge the exact out point on the waveform (the duration ticks up) -> `Save range` -> back to the preview -> `Export 1080x1920` -> the export button fills with a percentage while rendering -> the pill flips to rendered with a written path -> wipe back to the outro.

The subject is the everyday-curious, never controversial: a podcast on focus and attention, with shorts like "Why boredom is good for you", "The myth of multitasking", and "The two-minute focus reset".

The agent's work is never a chat. It is one quiet status line on a spinner, replaced by ranked cards when the real proposals land. The user never sees a terminal, a prompt, or a token count. The trim is the real highlight-to-select transcript plus waveform timeline: drag a rounded transcript handle to grow the quote by words, then drag free in/out waveform handles to land on the clean audio cut.

## What NOT to do

- No emoji anywhere. Status is a pill word or a small lucide glyph.
- No gradients as decoration. Warm paper and solid ink only (the phone's stand-in footage may use one quiet radial "studio" backdrop, and the dark theme a solid ink page).
- No second loud accent. Vermillion is the only red; ultramarine stays quiet and small.
- No pure `#000` text and no pure `#fff` page - ink is `#16161a`, paper is `#faf9f5`.
- No springy easing during the workflow; the only overshoot is the bold-pop caption pop, because it is the product's own.
- No transcript-as-chat, no message bubbles, no token meters, no terminal.
- Never show a real file path that leaks a private home dir; the rendered path reads `~/.short-pipe/.../why-boredom-is-good-for-you.mp4`.
- No em dashes. Plain dashes only.
- Wordmark stays `Short Pipe` (display serif, title case). UI copy matches the app: sentence case, terse.

## Outro copy

Wordmark: `Short Pipe`

Product tagline (also shown in the app topbar): `long-form in, captioned shorts out`

Hook line (the prominent italic vermillion line): `life is too short to be cutting shorts all day`

Install command:

```
brew install --cask kunchenguid/tap/short-pipe
```
