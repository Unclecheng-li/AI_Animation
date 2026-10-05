# DESIGN — process-flow

Template: `process-flow`  
V3 token version: v3-alpha  
Last updated: 2026-06-09

---

## What This Template Does

Sequential step-process reveal. A horizontal track of numbered circles sits
below the title and subtitle. One content card sits below the track. On each
step transition the previous circle deactivates (grey), the current circle
activates (primary colour, scale 1.2), the completed connector fills with the
primary colour, and the content panel crossfades.

**Best for:** Workflows, negotiation guidelines, how-to processes, onboarding
sequences, or any numbered list where each step deserves focus time.

---

## Token Map (from DESIGN-acs.md)

| Element | Token | Resolved value |
|---------|-------|----------------|
| Background | `canvas` | `#f5f2ea` |
| Active circle / heading / connector | `plate-blue` | `#285f9f` |
| Inactive circle background | `surface-mid` | `#d8d2c8` |
| Inactive circle / label text | `ink-muted-light` | `#8a9ba8` |
| Card background | `surface-white` | `#fffdfa` |
| Card shadow | `shadows.card` | `0 8px 40px rgba(24,32,38,0.09)` |
| Body text | `ink` | `#182026` |
| Muted text (subtitle, labels) | `ink-muted` | `#5a6e78` |

### Typography

| Element | Size / Weight |
|---------|---------------|
| Title | 46px / 700 |
| Subtitle | 20px / 400, lh 1.55 |
| Step circle number | 22px / 700 |
| Step label | 14px / 600 |
| Panel heading | 34px / 700 |
| Panel body | 22px / 400, lh 1.7 |
| Ghost step number | 80px / 800, opacity 0.08 |

Font: `'Inter', Arial, Helvetica, sans-serif`

---

## Layout

```
┌──────────────────────────── 1920px ──────────────────────────────┐
│                                                                   │
│         TITLE (46px/700)                  ← padding-top 88px     │
│         Subtitle (20px, max 900px)                               │
│                                                                   │
│   ○──────────○──────────○──────────○──────────○                  │
│  [1] Step   [2] Step   [3] Step   [4] Step   [5] Step            │
│   Name      Name       Name       Name       Name                │
│                            ← margin-top 52px                     │
│  ┌──────────────── content-card (1100 × 400px) ──────────────┐   │
│  │  80                                          heading (34px)│   │
│  │       body text (22px / 1.7 lh)                           │   │
│  │                                              [ghost num]  │   │
│  └────────────────────────────────────────────────────────── ┘   │
│                           ← V2 plate footer region               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Animation Sequence

| t (s) | Element | Action |
|-------|---------|--------|
| 0.0 | Title | Fade in + slide up 12px, `power2.out` 0.6s |
| 0.25 | Subtitle | Fade in, `power2.out` 0.5s |
| 0.45 | Step track | Fade in + slide up 10px, `power2.out` 0.55s |
| 0.65 | Content card | Fade in + slide up 14px, `power2.out` 0.5s |
| i×dur | Panel[i-1] | Fade out, `power2.in` 0.25s |
| i×dur | Circle[i-1] | To grey, scale 1, `linear` 0.3s |
| i×dur | Label[i-1] | To `#8a9ba8`, 0.3s |
| i×dur | Connector[i-1] | To primary, 0.3s |
| i×dur+0.1 | Circle[i] | To primary, scale 1.2, boxShadow, 0.3s |
| i×dur+0.1 | Label[i] | To primary, 0.3s |
| i×dur+0.1 | Card | Scale 0.985, 0.13s (micro-bounce start) |
| i×dur+0.23 | Card | Scale 1, `back.out(1.3)` 0.4s |
| i×dur+0.25 | Panel[i] | Fade in, `power2.out` 0.45s |
| TOTAL-0.5 | Fade overlay | Fade to black, `power2.in` 0.5s |

---

## Plate Options

| `basePlateImage` | `primaryColor` |
|-----------------|----------------|
| `v2-base-green.png` | `#2f765f` |
| `v2-base-blue.png` ← default | `#285f9f` |
| `v2-base-red.png` | `#cd5746` |
| `v2-base-charcoal.png` | `#33424c` |
| `v2-base-gold.png` | `#b1792f` |
| `v2-base-purple.png` | `#6957a6` |

---

## Files

```
process-flow/
├── index.html                      ← composition (V3-clean)
├── variables.sample.json           ← ACS default values
├── template-variables.schema.json  ← typed variable contract
├── README.md                       ← usage guide
├── DESIGN.md                       ← this file
├── render.bat                      ← Windows render helper
├── v2-base-green.png
├── v2-base-blue.png
├── v2-base-red.png
├── v2-base-charcoal.png
├── v2-base-gold.png
└── v2-base-purple.png
```

---

## V3 Changes from Original

- Removed duplicate CSS `body {}` block (V2 base injection merged into single rule set)
- Fixed UTF-8 encoding artifacts (`â€"` → `—`)
- Replaced `#2B579A` → `#285f9f`, `#E74C3C` removed, `#F8F9FB` → `#f5f2ea`, `#FFFFFF` → `#fffdfa`
- Font: `'Segoe UI'` → `'Inter'` + Google Fonts CDN link
- GSAP: `gsap@3` → `gsap@3.14.2`
- Converted `hfCall()` DOM manipulation → pre-built panels + gsap opacity animation
- Added fade-to-black overlay (`#el-fade`, z-index 99)
- Added `basePlateImage` variable for plate swapping
- Added `template-variables.schema.json`, `DESIGN.md`, `render.bat`

## Known Limits

- Step labels in the track: max ~25 characters before overflow at 14px/130px width.
- Step body text: long passages may overflow the 400px card height — keep body under ~250 characters.
- `activeStep` variable is parsed but not animated — all sequences start from step 0.
