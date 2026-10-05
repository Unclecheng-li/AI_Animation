# Golden Ratio Demo — Storyboard

**Duration:** 37.67 s · **FPS:** 60 · **Dimensions:** 1920×1080 · **Source frames:** 2,260

**Face-cam:** Full-screen throughout. MG = floating chyrons/callouts in safe zones. No corner PiP. No captions.

**Brand:** AIS — navy `#07121c`, cyan `#37bdf8`, cyan-dim `#5BA4C0`, orange `#f09025` (one per scene), white for chrome-gradient hero type. Montserrat display + Roboto Mono labels.

**Through-line:** Golden spiral SVG (1:φ recursive subdivision + quarter-circle arcs). Sits as faint `opacity 0.12` ambient layer during 02–05, full opacity hero reveal at outro (MOTION_PHILOSOPHY Law 6 callback).

---

## Section table (6 sections + ambient layer)

| # | t-start | t-end | Dur | Beat | Visual metaphor | Word anchors |
|---|---|---|---|---|---|---|
| ambient | 0.00 | 37.67 | 37.67 s | Faint golden-spiral + grain texture — unifying layer | 1:φ rectangle subdivided 5 deep, spiral in cyan at 12% opacity, CSS grain 3-radial-dot recipe | n/a |
| 01 | 0.00 | 8.20 | 8.20 s | **Cold open — "The Golden Ratio of AI Automation"** | Lower-left nameplate (NATE HERK · AIS) → hero title "THE GOLDEN RATIO" in chrome-gradient + cyan halo on the left 1/3 → spiral draws in behind title via SVG stroke-dasharray → subtitle "OF AI AUTOMATION" drops under | 0.86 Hey · 2.16 Nate · 4.62 golden · 4.94 ratio · 6.06 automation · 7.80 exit |
| 02 | 8.20 | 15.26 | 7.06 s | **60% deterministic logic** | Whip-streak in (cyan, 0.35s) → upper-right badge "01 · DETERMINISTIC" → giant chrome-gradient "60%" card slides up from left-zone bottom at 11.60 "60" → Roboto Mono label "DETERMINISTIC LOGIC" types in under (cyan, mono) → golden-spiral 60% cell (largest square) ignites solid cyan | 8.20 when · 11.60 60 · 14.22 deterministic · 14.82 logic |
| 03 | 15.26 | 18.78 | 3.52 s | **30% AI-assisted** | Whip-streak → prev card slides out left `power2.in` → "30%" card slides in from left `power2.out` → badge "02 · AI ASSISTED" → label "AI ASSISTED" in cyan-dim → spiral 30% cell (next-largest square) ignites cyan-dim | 15.68 next · 15.90 30 · 18.16 assisted |
| 04 | 18.78 | 23.34 | 4.56 s | **10% human-in-the-loop (ORANGE accent)** | Whip-streak → "10%" card slams in big, chrome-gradient on ORANGE background highlight → badge "03 · HUMAN" → label "HUMAN IN THE LOOP" → checkmark ✓ punches in on 22.34 "approval" with `back.out(1.4)` → spiral 10% cell ignites orange (hot) | 19.70 10 · 21.34 human · 21.80 loop · 22.34 approval |
| 05 | 23.34 | 34.94 | 11.60 s | **Magic ❌ / Trash ❌ → Middle ✅** (payoff) | (a) 26.32 "magic" → "MAGIC" word slams upper-left with iridescent gradient + sparkle particles · (b) 27.16 "all" → red-ish (NOT the AIS orange — use a single #E54848 red only here to mean "wrong") ❌ diagonal stroke sweeps over MAGIC via `clipPath` animation 0.4s · (c) 29.24 "trash" → "TRASH" slams lower-left in dim gray · (d) 29.94 "anything" → ❌ over TRASH · (e) 31.32 "Copilot" → tiny Copilot logo chip flashes upper-right for 0.6s · (f) 34.04 "somewhere" → both ❌'d words fade to 25%, cyan highlight bar zooms in between them with label "IN THE MIDDLE" in chrome gradient · (g) all 3 spiral segments dim-lit in background at this moment | 26.32 magic · 27.16 all · 29.24 trash · 29.94 anything · 31.32 Copilot · 34.04 somewhere · 34.60 middle |
| 06 | 34.94 | 37.67 | 2.73 s | **Outro callback — full spiral revealed** | Whip-streak → full golden-ratio rectangle + spiral hero reveal on left 1/3 with all 3 cells glowing (60 cyan, 30 cyan-dim, 10 orange) → 3 recap labels stagger in on the right side of the spiral: "60 · DETERMINISTIC" / "30 · AI ASSISTED" / "10 · HUMAN" → ambient hold on full spiral through the final "So that's what I want to talk about in this video" | 34.94 So · 36.28 talk · 36.84 video |

---

## Motion language (whole piece)

- **Palette:** ≤ 5 active hues total. Navy bg, cyan primary, cyan-dim, orange (one per scene), white/chrome. A single red `#E54848` appears ONLY in section 05 for the ❌ marks — the semantic "wrong" color. 6 hues total but the red is confined.
- **Eases per section:** minimum 3 distinct eases. Mix of `power3.out` / `expo.out` / `back.out(1.4)` / `power2.inOut` / `sine.inOut`.
- **Transitions between sections:** Cyan whip-streak (custom div, `power3.in` 0.35s). Fires at each section boundary. Never a hard cut.
- **Scene openers:** every element enters via `gsap.from()` or `gsap.fromTo()`. No opacity-only fades.
- **Chrome gradient hero type:** `linear-gradient(180deg, #fff 0%, #c8d4e6 60%, #8fa3c0 100%)` + `text-shadow: 0 0 24px rgba(55,189,248,0.55), 0 0 48px rgba(55,189,248,0.25)` halo on AIS emphasis moments.
- **Timeline anchor:** every sub-comp ends with `tl.to({}, { duration: SLOT }, 0)` per MOTION_PHILOSOPHY Law 11.
- **Ambient:** the `ambient-spiral` layer has a 4s `sine.inOut` yoyo breathing opacity 0.10↔0.14 so the "still" background texture is never static.

## Build order

1. `index.html` root — face-cam video layer (`track-index 0`) + audio (`track-index 4`) + ambient-spiral (`track-index 1`) + 6 section slots (`track-index 2`) + whip-streak layer (`track-index 3`)
2. `ambient-spiral.html`
3. `01-intro-title.html`
4. `02-sixty-deterministic.html`
5. `03-thirty-ai-assisted.html`
6. `04-ten-human.html`
7. `05-magic-trash-middle.html`
8. `06-outro-recap.html`
9. `npx hyperframes add grain-overlay` → wire into ambient
10. `npx hyperframes lint` — zero errors
11. Preview Gate 1 → Draft render → frame verify → Preview Gate 2 → Final render
