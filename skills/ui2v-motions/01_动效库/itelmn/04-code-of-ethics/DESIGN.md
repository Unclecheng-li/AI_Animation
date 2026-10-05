# DESIGN — code-of-ethics

Template: `code-of-ethics`  
V3 token version: v3-alpha  
Last updated: 2026-06-09

---

## What This Template Does

Displays multi-topic content as a horizontal tab bar with a sliding coloured
highlight. On composition start the title, kicker, and unit chip fade in, then
the tab bar drops from above and the first tab's content fades in. Each
subsequent tab's content cross-fades while the highlight slides to the new
position. A footer progress bar tracks position across tabs.

**Best for:** Ethics, principles, policies, frameworks, or any content with
3–8 equally-weighted topics that each need a heading + body paragraph.

---

## Token Map (from DESIGN-acs.md)

| Element | Token | Resolved value |
|---------|-------|----------------|
| Background | `canvas` | `#f5f2ea` |
| Tab highlight / heading | `plate-blue` | `#285f9f` |
| Tab bar background | `surface-light` blend | `#e8ebe4` |
| Card background | `surface-white` | `#fffdfa` |
| Body text | `ink` | `#182026` |
| Muted text (kicker, footer) | `ink-muted` | `#5a6e78` |
| Card left border accent | `plate-blue` at 24% opacity | `rgba(40,95,159,0.24)` |
| Card shadow | `shadows.card` | `0 24px 52px rgba(24,32,38,0.11)` |

### Typography

| Element | Token | Size / Weight |
|---------|-------|---------------|
| Kicker | `caption`-ish | 17px / 700 |
| Title | `display` | 62px / 800 |
| Tab label | `heading-md` | 22px / 700 |
| Content heading | `heading-lg` | 48px / 800 |
| Content body | `body-lg` | 28px / 400, lh 1.5 |
| Footer label | `caption` | 16px / 700 |

Font: `'Inter', Arial, Helvetica, sans-serif`

---

## Layout

```
┌─────────────────────────────── 1920px ─────────────────────────────┐
│  [unit-chip top-right]                                              │
│                                                                     │
│       kicker (uppercase)               ← 106px from top            │
│       TITLE (62px/800)                                              │
│                                                                     │
│  ┌─────────────────── tab-bar (1620px) ──────────────────────┐     │
│  │  [Tab 1]  [Tab 2]  [Tab 3]  [Tab 4]  [Tab 5]              │     │
│  │  ████████ ← sliding highlight                              │     │
│  └─────────────────────────────────────────────────────────── ┘     │
│  ┌─────────────────── content-card (1620 × 530px) ───────────┐     │
│  │ ║ Heading (48px/800)                                       │     │
│  │ ║ Body text (28px/400)                                     │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                     │
│  [progress-bar left:70]              [footer-label right:70]        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Animation Sequence

| t (s) | Element | Action |
|-------|---------|--------|
| 0.0 | Kicker | Fade in + slide up 12px, `power2.out` 0.7s |
| 0.1 | Title | Fade in + slide up 20px, `power2.out` 0.85s |
| 0.2 | Unit chip | Fade in, `power2.out` 0.7s |
| 0.45 | Tab bar | Drop in from y-40, `power2.out` 0.75s |
| 0.80 | Footer | Fade in, `power2.out` 0.65s |
| 0.95 | Panel[0] | Fade in + slide up 10px, `power2.out` 0.8s |
| i×dur | Panel[i-1] | Fade out, `power2.inOut` 0.55s |
| i×dur+0.25 | Highlight | Slide to new tab, `power2.inOut` 0.7s |
| i×dur+0.25 | Tab colours | Previous → muted, current → white |
| i×dur+0.25 | Progress fill | Expand to (i+1)/n, `power2.inOut` 0.65s |
| i×dur+0.9 | Panel[i] | Fade in + slide up 10px, `power2.out` 0.8s |
| TOTAL-0.5 | Fade overlay | Fade to black, `power2.in` 0.5s |

---

## Plate Options

| Variable value | Plate colour | Recommended `tabColor` |
|---------------|-------------|------------------------|
| `v2-base-green.png` | `#2f765f` | `#2f765f` |
| `v2-base-blue.png` ← default | `#285f9f` | `#285f9f` |
| `v2-base-red.png` | `#cd5746` | `#cd5746` |
| `v2-base-charcoal.png` | `#33424c` | `#33424c` |
| `v2-base-gold.png` | `#b1792f` | `#b1792f` |
| `v2-base-purple.png` | `#6957a6` | `#6957a6` |

Set `tabColor` to match the plate for a coherent look.

---

## Files

```
code-of-ethics/
├── index.html                      ← composition (V3-clean)
├── variables.sample.json           ← ACS default values
├── template-variables.schema.json  ← typed variable contract
├── README.md                       ← usage guide
├── DESIGN.md                       ← this file
├── v2-base-green.png
├── v2-base-blue.png
├── v2-base-red.png
├── v2-base-charcoal.png
├── v2-base-gold.png
└── v2-base-purple.png
```

Note: `base-plate-blue.png` (legacy) was renamed; all references now point to
`v2-base-blue.png`.

---

## Known Limits

- Tab count is fixed at runtime — the tab bar grid uses `repeat(n, 1fr)` where
  n is set by JS. Changing tab count requires a re-render.
- Highlight position is calculated from `el.offsetLeft` — requires the browser
  to have laid out the tab bar before the timeline starts. This works in
  HyperFrames' headless render because layout runs before timeline playback.
- Maximum recommended tab label length: ~20 characters per tab (5 tabs).
  Longer labels will overflow at the 22px/700 tab font size.
