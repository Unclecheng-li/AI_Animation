# Starter film

A 9.6 second, two-scene film for a fictional invoicing product, Acme. It exists to be copied and
rewritten, and it shows the house style working end to end: one shot per idea, blur-to-sharp kinetic
type on the spoken word, a phrase that becomes the object it describes, a matched camera push through
the cut (no flash, no dip to black), a hold after the hit, 1px-border containers with no shadow, one
CTA with depth, deterministic moving grain, and captions in a reserved band.

## Set up a project

```bash
cp -r skills/no-slop-motion/starter my-film
mkdir -p my-film/scripts && cp -r skills/no-slop-motion/scripts/render my-film/scripts/render
cd my-film
pip install -r scripts/render/requirements.txt   # numpy, soundfile, librosa (for the mix)
```

Needs Node 20+, ffmpeg and python3. HyperFrames is pinned in `package.json` (`hyperframes@0.8.78`) and
runs through `npx`, so there is nothing to install for the picture.

## Run

| Command | What it does |
| --- | --- |
| `npm run dev` | Studio preview in the browser |
| `npm run check` | lint, runtime, layout, motion and contrast checks (must be 0 errors) |
| `npm run snapshot -- --at 2.4,4.36,4.4,9.5` | PNG frames at given seconds, for looking at |
| `npm run render` | picture only, no sound |
| `npm run render:film -- --quality draft` | picture plus mixed sound: `renders/<id>.mp4` |
| `npm run render:audio` | remix sound onto the last rendered picture (seconds, not minutes) |

`render:film` options: `--quality draft|standard|high` (standard is usually enough; high is a much
slower encode), `--workers <n|auto>`, `--out <file>`, `--x` (also write an export that stays under X's
512 MB limit), `--audio-only`. See the header of `scripts/render/render.ts`. On Linux, if renders are
slow, check `df -h /dev/shm`: at 64 MB Chrome falls back to one frame at a time. Fix it with
`sudo mount -o remount,size=4G /dev/shm`.

## Who owns what

| File | Owns |
| --- | --- |
| `index.html` | load order, the cut list `window.SCENES`, the build (scenes, captions, grain, `E.mount`), timeline registration |
| `assets/js/plan.js` | **every moment in the film**: VO onsets, music marks, duration, caption band |
| `assets/js/vo-data.js` | each voice take's file, speech on/off and word timings (from your transcription step) |
| `assets/js/engine.js` | the film engine (`window.E`): timeline, actors, cameras, captions, grain, SFX cue sheet |
| `assets/js/ui.js` | the product pieces and the geometry the matched cut depends on |
| `assets/js/s1-hook.js`, `s2-product.js` | one scene each: its motion, anchored to VO words |
| `assets/css/base.css` | design tokens (the only place a colour or font is typed) and shared primitives |
| `assets/css/ui.css`, `s1-hook.css` | styling for the product pieces and the hook's type |
| `assets/fonts/` | Inter and Archivo (SIL Open Font License, see `OFL-*.txt`); fonts are local so renders never hit the network |
| `assets/sfx/` | `click`, `whoosh`, `thud`: placeholder sounds synthesized by `scripts/render/synth_sfx.py`, public domain (CC0) |
| `assets/audio/vo/` | voice takes named in `vo-data.js` (none ship; the mix skips missing takes with a warning) |
| `assets/vendor/gsap.min.js` | GSAP 3.14.2 (GreenSock standard license, free to use and redistribute) |

## The one rule: never type a raw second in a scene file

A scene never says "at 5.1 seconds". It asks:

- `E.voAt(VOICE, 'p01').word('sends')`: when a word is spoken (`.end('again')` for when it ends, `.nth('the', 1)` for the second match)
- `PLAN.at('p01')`: when a voice line's speech starts
- `E.sceneAt('s2')`, `E.sceneEnd('s2')`: the scene's window from the cut list
- `PLAN.music.hit`: a mark in the score

Numbers in scene files are durations and offsets of motion ("this move takes 0.5 s", "land 60 ms before
the word"), never moments. Then retiming a line in `plan.js`, or replacing a take in `vo-data.js`, moves
every beat that belongs to it, and nothing drifts out of sync.

## Engine in one screen

- `E.tl`: the one paused GSAP timeline, in absolute seconds. Everything is a pure function of time.
- `E.actor(el, {x, y, s, r, o, ...}, {jitter, twos, origin})`: returns a state object to tween on `E.tl`.
  Before `PLAN.smoothFrom` actors move on twos (12 poses/s) with a small hand jitter; after it, on ones.
  Use `jitter: 0` for anything that crosses a matched cut.
- `E.camera(el, state)` and `E.frameOn(x, y, scale)`: a full-frame world wrapper that always moves on ones.
  Two scenes that share world coordinates hand a camera across a cut with the same `frameOn` state.
- `E.words(parent, text)` + `E.blurText(el, {at, out, d})`: kinetic type, blur to sharp.
- `E.at(t, fn)`, `E.texts(el, [[t, text], ...])`, `E.FRAME.push((t) => ...)`: seek-safe switches and per-frame hooks.
- `E.sfx(t, name, db, {pitch, pan, exact})`: records a cue for `assets/sfx/<name>.wav`. Nothing plays in the browser; the mixer reads the cue sheet.
- `E.captions(root, voice, lines)`: word-by-word captions for lines marked `cap: true` in `plan.js`, at `PLAN.captions.top`.
- `E.grain(root, [[t0, t1, opacity, onOnes]])`: deterministic moving grain.
- `E.warn(msg)`: a timing problem; `render.ts` prints these before rendering.
- `E.mount(root)`: call once after every builder; it writes `#film-data` (timing table, VO takes, SFX cues) for the mixer.

## Add a scene

1. Add `<div id="s3" class="scene"></div>` inside `#root` in `index.html`.
2. Add `['s3', PLAN.music.settle]` (or a VO-derived time) to `window.SCENES`, in order.
3. Write `assets/js/s3-name.js` defining `window.buildName = function (E, VOICE) { ... }`: make a camera
   inside `#s3`, build the shot, anchor every beat to VO words or scene times.
4. Load it with a `<script>` after the other scenes and add `window.buildName` to the builder list.
5. Add its voice line to `PLAN.vo` and its take to `vo-data.js`; extend `PLAN.duration` and `data-duration` on `#root` together.
6. `npm run check`, then snapshot both sides of each new cut and look at them.
