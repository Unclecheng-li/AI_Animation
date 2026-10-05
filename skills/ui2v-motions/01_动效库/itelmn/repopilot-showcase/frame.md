# frame.md — design truth for repopilot-showcase

The brand truth file. Every composition reads from here; nothing overrides it.

## Concept angle

**Evidence, not assertion.** The video is shot like a forensic exhibit sheet that
happens to move: a confident statement lands, then the machine-precise source that
backs it slides in underneath. The one moment the source does not arrive, the
statement is stamped rather than removed. Everything else — palette, type, motion —
serves that single contrast between a blunt claim and its precise receipt.

## Palette

Lifted verbatim from the product's own dark-mode tokens
(`apps/web/src/app/globals.css`). Do not invent colors outside this table.

| Token | Value | Used for |
|---|---|---|
| `--canvas` | `#0d1117` | every scene's full-bleed background |
| `--surface` | `#151b23` | panels, strips |
| `--surface-raised` | `#1a212b` | claim cards, persona cards, the input card |
| `--text` | `#edf1f5` | display statements |
| `--text-secondary` | `#aab3bd` | supporting copy, blurbs |
| `--text-tertiary` | `#818b98` | kickers, labels — large sizes only |
| `--border` | `#2b3440` | card and panel edges |
| `--border-strong` | `#3a4552` | active card edges |
| `--accent` | `#49b9ad` | the receipt: threads, refs, active state, highlights |
| `--accent-soft` | `#173b39` | active card fill |
| `--accent-border` | `#2b6c67` | active card edge |
| `--code` | `#090d12` | source panels, the code wall |
| `--code-text` | `#dce3ea` | source lines |
| `--code-muted` | `#697583` | gutters, inactive graph nodes — never below 28px |
| `--code-highlight-strong` | `rgba(73,185,173,0.36)` | the cited lines inside a source panel |
| `--warning` | `#f0a15f` | the `flagged` stamp (dark-mode value, not `#a14f16`) |
| `--warning-soft` | `#3d291d` | flagged badge fill |
| `--warning-border` | `#69452b` | flagged badge edge |

Accent is rationed: it means **verified source**. It never decorates.

## Typography

Both families are pre-bundled by the renderer — no `@font-face`, no fetch.

| Role | Family | Weight |
|---|---|---|
| Display statements | **Archivo Black** | 400 **only** — the family ships no other cut |
| Code, refs, labels, data | **JetBrains Mono** | 400 · 700 |

**The tension:** a blunt, unqualified display face against a machine-precise mono.
That is the video's argument — confident claims, machine-checkable evidence — said
in type before it is said in words. Sans + mono crosses the classification boundary;
no two-sans pairing anywhere.

**Feed sizes** (destination is a scrolling X / LinkedIn feed — the video plays small):

| Element | Size |
|---|---|
| Display statement | 96–124px |
| Secondary statement | 60–72px |
| Kicker / label | 34–38px |
| Body / blurb | 32–36px |
| Ref chip (`file : L41–L68`) | 34px — heading-sized on purpose, never code-sized |
| Source code line | 30px |
| Graph node label | 28px |

Tracking `-0.03em` on display sizes. Line-height +0.05 over the light-background
value — light-on-dark reads tighter than it measures. `tabular-nums` on the file
counter and every line number.

## Frame anatomy

- **Focal element:** one per scene, never two. Frame 1 the moving wall · 2 the input
  card · 3 the graph · 4 the persona grid · 5 the answer shape · 6 the claim-to-source
  thread · 7 the stamped card · 8 the hero line.
- **Edge anchors:** display statements sit at 120px margins. Kickers ride the top edge,
  statements the lower-left. Nothing touches the outer 80px.
- **Supporting detail:** mono chips and strips, never more than one strip per scene.
- **Background treatment:** flat `--canvas` on a full-bleed child (never on the
  composition root — the producer can drop a root background and render black), plus
  one **background light** in every scene: a single soft neutral radial source at
  50% / 36%, peaking at 0.10 alpha. Deliberately *not* accent-tinted — accent means
  verified source and stays rationed — and static, so it costs nothing in
  determinism. Scenes 1–2 also carry the code wall; 3–8 are otherwise flat.

## Density ceiling

- Max **6 lines of code** visible at once, at 30px.
- Max **one** display statement on screen at a time.
- Refs are hero text. Code is texture. If a viewer on a phone can read only one
  thing in a frame, it must be the ref.

## Motion identity

Mechanical, not magical. Constant-speed draws, hard stops, single-impact stamps.
No glow pulses, no particle shimmer, no easing that reads as "thinking". The two
deliberate silences — the scroll's hard stop in Frame 1 and the stalled thread in
Frame 7 — are the piece's punctuation and must not be softened.

Cited motion (from `hyperframes-animation`):

| Frame | Rules |
|---|---|
| 1 | `counting-dynamic-scale` (file counter) · `depth-of-field-blur` (the freeze) |
| 2 | `discrete-text-sequence` (typed intent) · `depth-of-field-blur` (wall recedes) |
| 3 | `svg-path-draw` (edges) · `center-outward-expansion` (nodes settle) |
| 4 | `depth-of-field-blur` (node re-light) · `discrete-text-sequence` (finding strip) |
| 5 | `anchored-layout-expand` (dossier sections stack) |
| 6 | `svg-path-draw` (claim-to-source thread) · `anchored-layout-expand` (source panel) |
| 7 | `svg-path-draw` (the thread that stalls) · `kinetic-beat-slam` (the stamp) |
| 8 | `kinetic-beat-slam` (hero line) · `center-outward-expansion` (principle rows) |

## Audio identity

Three layers, three tracks, all root-level so playback survives every scene cut.

**Track 10 — narration.** Eight lines in HeyGen Starfish voice **Relaxed Reece**,
each placed against its measured `ffprobe` duration (`SCRIPT.md`). Secondary by
design: the on-screen type carries the piece muted, which is how a feed plays it.

**Track 11 — music bed.** `assets/bgm/track-ducked.mp3` at 0.18, landing ~14 dB under
the narration. A bed, not a score.

> This revises an earlier "no music bed" position. The original reasoning was that a
> bed would soften the two silences the piece is built on. The bed stays because it
> **ducks** at both — measured at −14 dB across the scroll's hard stop and −19 dB
> across the stalled thread. Ducking makes those moments land harder than continuous
> silence did, because the drop is now audible. Anyone re-scoring this must keep both
> ducks; a flat bed loses the argument of Frames 1 and 7.

**How the bed is built — two steps, both deliberate:**

1. **`track.mp3` → `bed60.mp3`.** The retrieved track is 63s and its last 8s fade to
   −64 dB, which left a near-silent hole at 53.5s right before the closing line. The
   bed is rebuilt as source 2–52s crossfaded (1s) onto source 5–16s — exactly 60s,
   −13 to −20 dB throughout, no dead tail.
2. **`bed60.mp3` → `track-ducked.mp3`.** The duck envelope is **baked into the asset**
   with an ffmpeg `volume=eval=frame` expression, *not* tweened on the timeline.
   Timeline volume keyframes were tried first in both `fromTo` and `.to` form; the
   runtime applied the outro fade but measurably did **not** apply either mid-timeline
   dip — the bed sat flat through both silences at −32.8 dB where the ungucked gap
   beside it read −35.0 dB. Baking removes the dependency entirely.

   Envelope (re-bake with this if any timing moves):

   ```
   if(lt(t,4.55),1,if(lt(t,4.62),1-0.85*(t-4.55)/0.07,if(lt(t,5.05),0.15,
   if(lt(t,5.75),0.15+0.85*(t-5.05)/0.70,if(lt(t,48.28),1,
   if(lt(t,48.34),1-0.88*(t-48.28)/0.06,if(lt(t,48.78),0.12,
   if(lt(t,49.30),0.12+0.88*(t-48.78)/0.52,if(lt(t,58.60),1,
   if(lt(t,60.00),1-(t-58.60)/1.40,0))))))))))
   ```

   The root timeline is therefore empty, and should stay that way.

**Track 12 — SFX marks.** Nine cues, every one tied to a beat, none decorative. No
whooshes on the scene cuts: the cuts are hard by design and the bed carries continuity.

| Cue | At | Serves |
|---|---|---|
| `riser` (first 4.6s of source) | 0.0 | the opening hook — still climbing when the picture freezes |
| `impact-bass-1` | 4.62 | the hard stop; bed ducks under its decay |
| `typing` ×2 | 7.95, 9.5 | the intent being typed |
| `click-soft` ×3 | 21.75, 24.65, 27.55 | the three persona selections |
| `ping` ×3 | 39.35, 41.0, 42.8 | each source panel meeting its thread |
| `impact-bass-2` | 49.32 | the `flagged` stamp |

The riser is the reason the first frame now has a hook: sound builds under the
unreadable scroll from 0.0 and cuts dead with the picture at 4.6s. Before it, the
video's first four seconds were silent.

**Play `riser.mp3` from 0, not from its end.** Its energy is in the source's first
5.2s — it climbs to full scale around 5s and is silent afterwards. An earlier cut used
`data-media-start="5.43"` on the assumption that risers peak at the end, and shipped
4.6s of near-silence (−58 dB) as the "hook".

**Measured mix levels** (all `volumedetect` mean, from the render):

| | |
|---|---|
| Narration (reference) | −18 dB |
| Bed in a narration gap | −31 to −35 dB |
| Riser at 2.5–3.5s | −15 dB |
| Scroll's hard stop | −14 dB below the bed |
| Stalled thread | −51.5 dB, a 19 dB drop from the gap beside it |
