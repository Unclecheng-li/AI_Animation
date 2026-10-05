# Lesson 5.1 Demo — Storyboard

**Topic**: When and how to pitch an audit
**Duration**: 1:52.79 (112.79 s, 25 fps → ~2,820 frames)
**Face-cam**: Bottom-right PiP, 360×540 portrait crop (center vertical slice of the source), 32 px rounded corners, drop shadow + 1 px cyan rim. Stays in corner throughout — no fullscreen moments (maintains the "teacher + lesson materials" energy).
**Visual canvas**: LEFT 2/3 of the 1920×1080 frame (roughly `x=80..1440, y=80..960`). The PNG backdrop already owns top-right (AIS logo) and bottom-center (`@AI Automation Society` watermark) — MG content avoids those zones.
**Brand**: AIS DESIGN.md — navy bg, cyan `#37bdf8` primary, orange `#f09025` for the single contrast highlight per scene. Montserrat Bold for headlines, Roboto Mono for labels/stats, Montserrat Light for body.

## Narrative arc

The video walks a consultant from the **moment they notice** more problems in a client's business → through the **fear of bringing it up** → to the **framework** (trust → audit, two paths) → and ends mid-way through the **three-signals** teaching. It's one coherent teaching beat cut off at the moment the first signal is revealed.

## Section table

| # | t-start | t-end | Dur | Beat | Visual metaphor | Key word anchors |
|---|---|---|---|---|---|---|
| 01 | 0.00 | 19.00 | 19.00 s | **The moment you know** — you're mid-project and see problems outside scope | Lesson title card (cold open) → "THE PROJECT" box with dashed "REAL SCOPE" halo → 4 problem bubbles pop in around it → ends with a "???" hanging in the air | `0.74` Lesson, `2.04` When and how, `5.46` project, `8.20` problems, `10.68` inefficiencies, `11.42` workflows, `14.80` single automation, `17.58` But you won't be sure how |
| 02 | 19.00 | 30.82 | 11.82 s | **The cost of hesitation** — you stay silent, finish and leave, it costs you | "SCOPE CREEPER ❌ NOT YOU" pill → 3-step checklist reveal (FINISH · INVOICE · MOVE ON) → orange payoff "HESITATION COSTS YOU" | `19.88` bigger engagement, `23.20` consultant, `24.70` expand the scope, `26.10` finish, `27.32` invoice, `28.30` move on, `29.44` hesitation, `30.10` costs |
| 03 | 30.82 | 38.34 | 7.52 s | **Why this lesson exists** — nobody showed you WHEN and HOW | Two emphasized words slam in: **WHEN** and **HOW** as giant cyan type on a split stage | `30.82` Not because, `32.60` WHEN, `35.10` HOW, `37.44` salesy |
| 04 | 38.34 | 48.96 | 10.62 s | **The promise** — by the end, you'll know WHEN / HOW / CHARGE | "WHAT YOU'LL LEARN" title + 3-step numbered list (cyan pills: 01 WHEN, 02 HOW, 03 CHARGE?) | `38.34` That's what this lesson is for, `42.00` when an audit, `43.00` how to pitch, `45.40` charge for it |
| 05 | 48.96 | 69.64 | 20.68 s | **Audits are relationship expansion tools** — they need trust; trust has two sources | Section divider "WHEN AUDITS MAKE SENSE" → definition callout "AUDIT = RELATIONSHIP EXPANSION TOOL" → single word TRUST under spotlight → split into two cards (A: EARNED TRUST via past project, B: INHERITED TRUST via referral/network) | `48.96` When audits, `51.56` relationship expansion, `54.40` trust already exists, `57.44` two places, `58.30` successful project, `64.32` a referral, `65.90` personal connection |
| 06 | 69.64 | 83.74 | 14.10 s | **Cold prospect ≠ audit** — they want the problem fixed, not a bigger engagement | Email/chat bubble "Can you fix our reporting?" → crossed-out bad response "Let's step back and audit your operations" (big red X) → viewer watches prospect walk to next vendor | `69.64` If neither, `72.30` premature, `73.80` cold prospect, `75.00` reporting problem, `79.60` let's step back, `82.00` someone else |
| 07 | 83.74 | 94.88 | 11.14 s | **Two paths framework** — cold lead builds trust via project; warm lead already has it | Two-column diagram. LEFT COLD LEAD → PROJECT → TRUST → AUDIT (arrows stagger in). RIGHT WARM LEAD → AUDIT (direct, with pre-existing TRUST glow) | `83.74` This maps, `85.00` two paths, `87.26` Cold leads, `88.50` project, `90.00` builds trust, `91.50` door to an audit, `92.40` Warm leads, `94.00` trust is already there |
| 08 | 94.88 | 101.78 | 6.90 s | **It's about WHEN, not WHETHER** — punchy ending to the framework | Split-screen: LEFT `WHETHER` (grayed out, struck through) · RIGHT `WHEN` (huge cyan, pulse-in on the final word) | `94.88` distinction matters, `97.00` how you enter, `99.80` not whether, `101.00` but when |
| 09 | 101.78 | 112.79 | 11.01 s | **Three signals (teaser + signal 1)** — video ends on signal 1 as a cliff | "3 SIGNALS IT'S TIME" title with three placeholder dots → ambient hold → Signal 01 card reveals "SUCCESSFUL PROJECT DELIVERY · client has seen your work" — last frame leaves signals 02 & 03 as faint silhouettes (to be continued) | `101.78` Three signals, `103.00` right moment, `106.80` first signal, `109.32` successful project delivery, `111.12` client has seen |

## Motion language (whole video)

- Palette per section: `#07121c` bg (inherited from the PNG), `#37bdf8` primary cyan, `#f09025` orange reserved for the single hottest word / the cost / the warning per scene, `#96a2b6` dim for meta labels.
- At least 3 different eases per section (`power3.out`, `expo.out`, `back.out(1.4)`, `power4.out` for entrances; `sine.inOut` for ambient drifts).
- Every element enters via `gsap.from()` — no exit tweens (transitions handle handoff).
- Transitions between sections: mostly a `blur-crossfade` (0.5 s, `sine.inOut`) or a `push-slide-left` (0.35 s, `power2.inOut`). Section 1 → 2 = blur. Section 7 → 8 = zoom-through for the punch. Sections 8 → 9 = push.
- Ambient: subtle 3–6 % scale pulse on the face-cam wrapper driven by audio amplitude (keeps the talking head alive without pulling eyes from MG).

## Build order

1. **This review loop**: sections 01 + 02 built; draft rendered; Nate signs off on style.
2. Post-signoff: build 03 → 09 in the same voice + transitions.
3. Full-length draft render → frame-by-frame visual verification → standard-quality final render.
