---
format: 1920x1080
message: "Every claim RepoPilot makes carries the file and line it came from"
arc: Lost → Who is asking → Facts before words → Six lenses → Shaped answer → Receipts → Flagged → Lockup
audience: developers on X / LinkedIn, muted autoplay
mode: collaborative
---

## Frame 1 — Lost

- scene: A wall of unreadable code scrolls past at speed, then stops dead
- duration: 6s
- transition_in: cut
- status: animated
- poster: 5.7s
- src: compositions/s1-lost.html
- rules: counting-dynamic-scale · depth-of-field-blur
- voiceover: "Four thousand files. Where do you start?"

Open cold. No logo, no title card, no product. Full-bleed `--canvas` (#0d1117) with
84 rows of real RepoPilot file paths and source lines scrolling upward, motion-blurred
at 2.6px. The viewer should feel the scroll before they parse anything.

**Motion:** the wall travels y 0 → −2400 at constant speed from 0.0s to 4.6s — no
ease-out, a **hard stop** at 4.6s, blur resolving to 0 by 4.85s. A file counter in the
lower right counts to `4,182` on a decelerating curve, swells 6% as it lands, then
drops to 34% opacity at 5.0s as the statement takes over.

**On-screen type:** `Where do you start?` lands lower-left at 5.0s — 96px Archivo
Black, one line. The counter is the only other text; the frame never carries two
display statements.

**Notes:** the freeze is the beat. No whoosh, no flash. The wall is excluded from the
layout audit (`data-layout-ignore`) — it is background texture that scrolls off-canvas
by design, under a lower third that is fully opaque where type lands.

## Frame 2 — Who is asking

- scene: The scroll recedes; a single input field asks who you are
- duration: 7s
- transition_in: cut
- status: animated
- poster: 5.5s
- src: compositions/s2-who.html
- rules: discrete-text-sequence · depth-of-field-blur
- voiceover: "Every other tool starts with the repo. This one starts with you."

The identical wall, parked at scene 1's final offset — the cut is a match cut. Over
0.7s it blurs to 11px, drops to 24% opacity and scales to 0.94 behind a radial scrim.
The repo does not leave; it stops being the subject.

Center: a 1440px card in the product's real style with the real label **"Who is
asking?"**. A cursor types the product's own placeholder at 34px over 3.0s:

    I'm writing a migration guide and need the breaking changes

The caret blinks on a finite square wave, then stops. An `--accent` underline draws
left-to-right beneath the field at 4.0s.

**On-screen type:** `Every other tool starts with the repo.` rides the top edge from
0.25s; at 4.6s it clears and the card lifts and dims, and `RepoPilot starts with you.`
lands lower-left at 5.05s in 100px Archivo Black.

**Notes:** the typed line is verbatim product copy. No accent on "you" — accent is
rationed to mean *verified source* and never decorates.

## Frame 3 — Facts before words

- scene: The code wall resolves into exact, boxed source spans
- duration: 7s
- transition_in: cut
- status: animated
- poster: 4.2s
- src: compositions/s3-graph.html
- rules: svg-path-draw · center-outward-expansion
- voiceover: "Every span comes from parsing the source. Not from a model."

A file resolves into exact spans, mechanically. Source lines sweep past, then
tree-sitter's boundaries land on them one function at a time — each symbol
boxed with its real start and end line, constant speed, no glow pulses. It
reads as a parser working, not as a model thinking.

Chips fade in top-left at 0.18s intervals from 2.0s: `tree-sitter AST` ·
`pgvector` · `Postgres`. The six deterministic tools arrive along the bottom
from 2.9s, one every 0.075s.

At 4.35s the spans lift, shrink and dim, clearing the lower band.
`Every span comes from` / `parsing the source.` lands at 4.75s in 96px Archivo
Black; `Not from a model.` follows at 5.55s in 54px `--text-secondary`.

**Scope note:** this frame previously drew the call graph assembling itself.
The graph and module-map surfaces are not being built, so the visual shows what
the product actually ships — deterministic parsing into exact spans — rather
than a picture the UI never renders.

**Notes — accuracy gate:** Python gets tree-sitter spans; other languages get
line-aware chunks. Neither invents anything, which is the claim being made.

## Frame 4 — Six lenses

- scene: One persona is chosen; the same findings reorder for each lens
- duration: 10s
- transition_in: cut
- status: animated
- poster: 5.2s
- src: compositions/s4-lenses.html
- rules: depth-of-field-blur · discrete-text-sequence
- voiceover: "Six lenses, or describe your own. Same verified facts — a different finding leads."

The left third holds the answer as it stands — a short stack of findings. The
right two thirds carry the real persona grid — six cards with the product's own labels and blurbs:

| Label | Blurb |
|---|---|
| Open-source contributor | Where to make a first change, and what protects it. |
| Competitive analyst | Capabilities, limits, and where the seams are. |
| Security reviewer | Trust boundaries, inputs, secrets, and authz. |
| Adopter / integrator | Public API, config, and cost of adoption. |
| Learner | How the system is shaped and why. |
| Maintainer | Fragility, debt, and what needs attention. |

Three selections, each **reordering the findings** rather than re-lighting a graph:
every row dims to 20% first, then the rows that lens puts first rise to
`--accent` and move to the top. The windows never overlap on the same property,
so GSAP's overwrite order can't decide the frame.

| At (local) | Persona | Finding strip |
|---|---|---|
| 1.75s | Security reviewer | `Session identity is asserted by the web app; the API trusts the cookie.` |
| 4.65s | Maintainer | `Three capabilities are implemented but gated off — their eval gates missed.` |
| 7.55s | Learner | `Intent is captured before analysis; every downstream agent reads it.` |

Kicker top-left from 0.2s: `Six lenses, or describe your own.` — six presets plus a
free-text option, so the line is never "six lenses" alone.

**Notes:** the three findings are stacked, opacity-enveloped elements — not a
`tl.call()` text swap, which would not survive a backward seek. No closing display
statement here; Frame 5 lands the thesis and this frame's job is to *show*.

## Frame 5 — The answer has a shape

- scene: The same question renders as a dossier for one persona, a narrative for another
- duration: 8s
- transition_in: cut
- status: animated
- poster: 5.5s
- src: compositions/s5-shape.html
- rules: anchored-layout-expand
- voiceover: "The persona doesn't just change the wording. It changes what the answer is."

The product's own ask placeholder `What is the tech stack?` sits in a real field along
the top. Below, two panels side by side — the contrast *is* the layout, so nothing
re-frames mid-scene.

**Left, Security reviewer** — a dossier: numbered headings with rules, stacking in
order of risk (`01 TRUST BOUNDARY`, `02 INPUT SURFACE`, `03 SECRETS`).
**Right, Learner** — the same question as flowing narrative, three paragraphs.

At 4.5s both panels drop to 50% and hand the frame to the statement:
`The persona decides` / `what the answer does.` at 4.7s, then
`Not just how it sounds.` at 5.75s.

**Notes:** the section *structure* is what must read at feed size, not the sentences.
Every line is authored short enough to avoid a wrap inside its panel.

## Frame 6 — Every claim, a receipt

- scene: A claim card draws a thread down to the exact source span it cites
- duration: 9s
- transition_in: cut
- status: animated
- poster: 7.5s
- src: compositions/s6-receipts.html
- rules: svg-path-draw · anchored-layout-expand
- voiceover: "Every factual claim carries a file and a line range. Open it, read the source."

**The signature shot.** A claim card settles across the top. At 0.8s a 3px `--accent`
thread draws downward out of it; at 1.25s a source panel slides up to meet it — real
path, real line range, six lines of code on `--code` with the cited lines washed in
`--code-highlight-strong`.

Content swaps twice, at 2.75s and 4.55s; the rig itself never moves. Three claims,
three refs, three spans:

| Claim | Ref |
|---|---|
| Unsupported claims are flagged rather than dropped. | `packages/agents/src/repopilot_agents/verifier/grounding.py : L41–L68` |
| Python files are parsed with tree-sitter before chunking. | `packages/ingestion/src/repopilot_ingestion/pipeline.py : L112–L140` |
| Provider keys are encrypted before they are stored. | `apps/api/src/repopilot_api/access.py : L88–L104` |

At 6.15s the whole rig scales to 0.84 and lifts, and `Every claim.` /
`A file. A line range.` lands in the cleared band at 6.5s.

**Notes:** refs render at 34px — heading size, deliberately larger than the 30px code.
Six code lines maximum, always. All three paths were verified against the repo before
the build; re-verify if the tree moves. Highlighted lines lift their gutter colour so
the line number keeps contrast against the wash.

## Frame 7 — And when it can't prove it

- scene: A fourth claim's thread finds nothing and the card is stamped "flagged"
- duration: 6s
- transition_in: cut
- status: animated
- poster: 4.5s
- src: compositions/s7-flagged.html
- rules: svg-path-draw · kinetic-beat-slam
- voiceover: "And when it can't prove something, it says so. Flagged — not quietly dropped."

The three verified claims from Frame 6 sit as dimmed, ticked rows along the top — they
persist. A fourth claim arrives: `Retrieval stays under one second on any repository.`
— a performance claim with no source span behind it.

Its thread draws downward from 0.72s to 1.34s, then **nothing moves for 0.42s**, then
it retracts. A `flagged` badge stamps on at 2.32s in `--warning` (#f0a15f, the
dark-mode token) with a single hard impact: scale 1.15 → 1.0 in 0.18s, no bounce.

`Unsupported claims` / `get flagged.` at 2.88s in 84px, then `Not deleted.` at 3.68s
in 96px `--warning`.

**Notes:** the card never leaves the frame. That persistence is the point of the whole
video, and the 0.42s silence is its punctuation — do not fill it.

## Frame 8 — Lockup

- scene: Everything clears; the product line, three principles, and the wordmark
- duration: 7s
- transition_in: cut
- status: animated
- poster: 5s
- src: compositions/s8-lockup.html
- rules: kinetic-beat-slam · center-outward-expansion
- voiceover: "RepoPilot. Ask a codebase anything, as anyone."

Empty `--canvas`. The product's own hero line sets across two display lines at 0.3s:
`Ask a codebase` / `anything, as anyone.`

Three principle rows fade up from 1.45s at 0.38s intervals, in the product's own words:

| Principle | Sub |
|---|---|
| Answers shaped by your purpose | Your persona decides which findings lead. |
| Verified source claims | Every factual claim links back to a concrete file range. |
| Repository-specific retrieval | Answers stay scoped to the indexed snapshot. |

Wordmark and tagline land at 3.35s and hold to 7.0s.

**Notes:** the 3.6s final hold is deliberate — feed players loop and the last frame is
the one that gets screenshotted.
