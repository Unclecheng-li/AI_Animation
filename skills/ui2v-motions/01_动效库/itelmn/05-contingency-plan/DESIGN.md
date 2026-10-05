# DESIGN — contingency-plan

Template: `contingency-plan`  
V3 token version: v3-alpha  
Last updated: 2026-06-09

---

## What This Template Does

Left-right split layout. Left panel shows a vertical flow of numbered circles
connected by a subtle SVG line. Right panel shows the full detail for the
currently active node. On each transition the active circle switches from
`accentColor` (red) to `primaryColor` (blue inactive), the new circle activates,
and the info block crossfades.

**Best for:** Risk registers, contingency plans, decision trees, stage-gate
processes — content with 2–6 numbered items each requiring a title + paragraph.

---

## Token Map

| Element | Token | Value |
|---------|-------|-------|
| Background | `canvas` | `#f5f2ea` |
| Title / inactive circle / info text | `plate-blue` | `#285f9f` |
| Active circle highlight | `plate-red` | `#cd5746` |
| Body text | `ink` | `#182026` |
| Ghost number opacity | — | 0.12 |
| Card shadow | — | none (open layout) |

### Typography

| Element | Size / Weight |
|---------|---------------|
| Title | 42px / 700 |
| Node circle number | 20px / 700 |
| Node label | 20px / 600 |
| Info ghost number | 72px / 800, opacity 0.12 |
| Info heading | 34px / 700 |
| Info body | 20px / 400, lh 1.72 |

Font: `'Inter', Arial, Helvetica, sans-serif`

---

## Layout

```
┌─────────────────────────────── 1920px ────────────────────────────────┐
│  TITLE (42px/700)                              ← left: 100px, top: 60 │
│                                                                        │
│  ●──────────── Identify Risks     │  01                               │
│  │                                │  Identify Risks                   │
│  ●──────────── Assess Impact      │  Brainstorm and catalogue…        │
│  │                                │                                   │
│  ●──────────── Plan Response      │  ← right: 100px, top: 160        │
│  │                                │    width: 580px                   │
│  ●──────────── Monitor & Review   │                                   │
│                                   │                                   │
│  ← left:100, top:180, 880×700     │                                   │
└────────────────────────────────────────────────────────────────────── ┘
```

Node vertical positions: `top = 40 + i × 160px`. SVG line from y=72 to y=590.

---

## Animation Sequence

| t (s) | Element | Action |
|-------|---------|--------|
| 0.0 | Title | Fade in, 0.5s |
| 0.3 | Flow area | Fade in, 0.5s |
| 0.5–0.92 | Flow nodes | Stagger in from x=-28, 0.4s each |
| 1.1 | Info panel | Fade in + x=-14, 0.5s |
| i×dur | iBlock[i-1] | Fade out, 0.22s |
| i×dur | circle[i-1] | To primary, scale 1, 0.3s |
| i×dur+0.1 | circle[i] | To accent, scale 1.2, boxShadow, 0.3s |
| i×dur+0.1 | Info panel | Scale 0.97, 0.12s (bounce) |
| i×dur+0.22 | Info panel | Scale 1, back.out(1.3), 0.45s |
| i×dur+0.22 | iBlock[i] | Fade in, 0.45s |
| TOTAL-0.5 | Fade overlay | Fade to black, power2.in, 0.5s |

---

## Files

```
contingency-plan/
├── index.html                      ← composition (V3-clean)
├── variables.sample.json
├── template-variables.schema.json
├── README.md
├── DESIGN.md                       ← this file
├── render.bat
├── v2-base-green.png … v2-base-purple.png (6 plates)
```

---

## V3 Changes

- Merged duplicate `body {}` CSS block
- `#2B579A` → `#285f9f`, `#E74C3C` → `#cd5746`, `#F8F9FB` → `#f5f2ea`
- Font: `'Segoe UI'` → `'Inter'` + Google Fonts link
- GSAP: `gsap@3` → `gsap@3.14.2`
- Removed `color-mix()` (not reliable in HyperFrames Puppeteer) → direct hex boxShadow
- Removed CSS `transition` from `.node-circle` — all animation via GSAP
- Converted `hfCall()` DOM swaps → pre-built `.info-block` panels + opacity animation
- Added `basePlateImage` variable
- Added fade-to-black overlay
