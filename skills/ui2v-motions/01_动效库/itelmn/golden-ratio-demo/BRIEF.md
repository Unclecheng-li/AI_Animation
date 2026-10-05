# Golden Ratio Demo — BRIEF

## Concept
37.7s AIS lesson on **the golden ratio of AI automation**: 60% deterministic logic → 30% AI-assisted → 10% human-in-the-loop. Framed as a "golden ratio" for process automation design. Dramatises the "AI = magic" vs "AI = trash" tension and lands the truth in the middle.

## Format
- **Dimensions:** 1920 × 1080 (16:9)
- **FPS:** 60 (matches source)
- **Duration:** 37.67s (full source, untrimmed)
- **Intent:** AIS educational lesson / YouTube-style explainer

## Script (verified via OpenAI Whisper-1, word timestamps)
> "Hey guys, my name is Nate. Today I wanted to talk to you about the golden ratio of AI automation, which basically means when you think of automating a process with AI, you think about the first 60% being automated with just deterministic logic, the next 30% being automated with AI, sort of AI assisted, and then that last 10% being kind of the human in the loop manual approval stage. And the reason why I think this is important is because some people think that AI is magic and it can do it all. Some people think that AI is trash and it can't do anything because they've only been using Copilot and really it's actually somewhere in the middle. So that's what I want to talk about in this video."

## Style profile
- **Brand:** AIS (pulled from workspace `assets/brand-tokens.css`)
  - Bg: `#07121c` navy
  - Accent cyan: `#37bdf8`
  - Cyan dim: `#5BA4C0` (derived)
  - Hot orange: `#f09025` (reserved for hot emphasis — one per scene per AIS rule)
  - Text: `#ffffff` + chrome gradient for hero headlines
- **Fonts:** Montserrat 500/700/900 (display), Roboto Mono 400/500/700 (labels/badges)
- **Hero visual:** Golden spiral + subdivided golden-ratio rectangle. 60/30/10 segments light up per beat.
- **Captions:** OFF
- **Face-cam:** Full-screen throughout. MG overlays float in safe zones around Nate.
- **Music:** None (face-cam audio only)
- **Outro text:** None beyond the spoken "So that's what I want to talk about in this video"

## Safe-zone map (verified against frame samples t=0,7,18,24,30,36)
- **Primary left:** x 60–640, y 80–1000 — hero spiral + giant % cards
- **Top chyron:** x 60–1860, y 40–180 — section title bars
- **Upper-right badge:** x 1420–1860, y 40–300 — small pill labels
- **Lower-left nameplate:** x 60–640, y 860–1020 — intro nameplate only
- AVOID: x 640–1400 (Nate's face/torso), x 1100–1860 × y 300–900 (mic/boom)

## Assets inventory
- `assets/golden-ratio-demo.mp4` — re-encoded source (CRF 23)
- `assets/transcript/whisper.json` — OpenAI Whisper verbose_json + word timestamps
- `assets/brand-tokens.css` — AIS palette variables
- Golden spiral — generated inline as SVG (1:φ subdivision, quarter-circle arcs)

## Word-level timing anchors (from whisper.json)
| t (s) | Word | Event |
|------:|------|-------|
| 0.86 | "Hey" | Nameplate enter from left |
| 2.16 | "Nate" | Nameplate fully locked |
| 4.62 | "golden" | Hero title begins reveal |
| 4.94 | "ratio" | "THE GOLDEN RATIO" complete + spiral draws in behind |
| 6.06 | "automation" | Subtitle "OF AI AUTOMATION" drops in |
| 7.80 | — | Nameplate exits |
| 8.20 | "when" | Section 02 (60%) whip-in + badge |
| 11.60 | "60" | **Giant 60% card slam** + spiral 60% cell ignites cyan |
| 14.22 | "deterministic" | "DETERMINISTIC LOGIC" label fills in |
| 15.26 | — | Whip transition to section 03 |
| 15.90 | "30" | **Giant 30% card slam** + spiral 30% cell ignites cyan-dim |
| 18.16 | "assisted" | "AI ASSISTED" label complete |
| 18.78 | "and then" | Whip transition to section 04 |
| 19.70 | "10" | **Giant 10% card slam** (ORANGE accent) + spiral 10% cell ignites orange |
| 21.80 | "loop" | "HUMAN IN THE LOOP" label complete |
| 22.34 | "approval" | Hand/check icon emphasis |
| 23.34 | "And" | Whip transition to section 05 |
| 26.32 | "magic" | "MAGIC" slams upper-left (rainbow iridescent) |
| 27.16 | "all" | Red ❌ crosses out MAGIC |
| 29.24 | "trash" | "TRASH" slams lower-left (dim gray) |
| 29.94 | "anything" | Red ❌ crosses out TRASH |
| 31.32 | "Copilot" | Copilot chip flashes briefly |
| 34.60 | "middle" | "IN THE MIDDLE" cyan bar zooms between the two ❌'d words, all 3 spiral segments dim-lit in background |
| 34.94 | "So" | Whip transition to outro |
| 37.67 | — | End of composition |

## Build order
1. Scaffold + copy assets (done)
2. `index.html` — root composition, video + audio + 6 section slots
3. `compositions/ambient-spiral.html` — full-duration faint golden-spiral texture
4. `compositions/01-intro-title.html` through `06-outro-recap.html`
5. Install `grain-overlay` via `npx hyperframes add`
6. Lint
7. Preview gate 1 → draft render → frame verify → preview gate 2 → final render

## Non-negotiables
- Nate's face (x 640–1400, y 80–900) never obscured by MG.
- `tl.to({}, { duration: SLOT }, 0)` anchor tween on every sub-comp timeline.
- Every transition uses a cyan whip-streak — no hard cuts.
- Orange `#f09025` used only once per scene as the hot word/number.
- Two preview gates before final render.
