---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "Direct the shot — don't re-roll the dice"
destination: youtube
aspect: 1920x1080
language: en
audience: "Creators and small studios making AI short-form drama who are tired of regenerating a clip five times hoping the blocking comes out right"
length: 60s
angle: new-capabilities
---

## Intent

A 60-second promo for **Wind Comic (青枫漫剧) v12.319** — an open-source (MIT) AI short-drama studio that turns one line of text into a finished, deliverable short film.

This is not a "look, AI makes video" promo. Every competitor can generate a clip. The one thing this video must land is **control**: the last three releases added the two capabilities that turn generation from a slot machine into direction —

- **Director's console** — place actors and the camera on a stage, and the exact blocking ("who stands where, who occludes whom, what focal length") becomes both a precise prompt directive and a layout sketch that locks composition. Composition problems are reported *before* you spend money generating, not after.
- **Segment retake** — hate 2 seconds out of an 8-second shot? Retake only those 2 seconds. The other 6 are byte-copied, not re-encoded, so they don't degrade a generation. Shot duration is unchanged by construction, so the timeline, voiceover delays, subtitle starts and EDL record-ins never need recomputing.

Tone: confident, precise, engineer-to-engineer. No hype adjectives, no "revolutionary". The proof is in specifics — 4131 tests, EDL/FCPXML/AAF that come out of the same source as the film, BYO-key across engines.

## Assets

- `assets/banner.jpg` — homepage hero screenshot (2880×1800), the product's own front page
- `assets/promo/wind-comic-promo-en.mp4` — the previous 39s promo; reference for pacing and register only, do not reuse its cuts wholesale
- `http://localhost:3000` — live dev server, the real product UI for capture

## Customizations

- Capture the running local product at `http://localhost:3000` for brand tokens and real UI screens — the featured assets should be the product's own interface, not stock.
- Chinese dub follows this same cut as a second audio pass, voiced by the platform's **own MiniMax TTS** (`speech-02-hd`, `presenter_male`) — dogfooding is itself part of the pitch. English narration uses local Kokoro. Output both `-en` and `-zh` mp4s, same visuals.
- Final deliverable also needs a **silent GIF** condensed from the finished cut, for the README hero (the current one is 15s @ 760px, 4.9 MB — match or beat that budget).

## Notes

- BGM: use the platform's own MiniMax music engine, as the previous promo did (`videos/wc-promo/gen-bgm.mjs` is the prior art). MusicGen is deliberately not installed — it would pull ~2.5 GB of torch for something we can dogfood.
- Not signed in to HeyGen; running on local/own engines by choice, not by accident.
- Avoid claiming anything unverified: HappyHorse 9:16 aspect handling is **not** live-verified (gateway 429s), so do not put engine-specific aspect claims on screen.
- The old project `videos/wc-promo` is a previous-generation pipeline layout; do not read or resume from it.
