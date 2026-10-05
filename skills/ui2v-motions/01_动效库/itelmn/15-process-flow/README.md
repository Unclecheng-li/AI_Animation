# process-flow

**Pattern:** Numbered step track with sequential panel reveal  
**Canvas:** 1920 × 1080px | **Duration:** `steps.length × durationPerStep + 1` (default 21s for 5 steps)  
**V3 status:** Clean ✅ — no tl.call(), no CSS injection conflict, Inter font, ACS colour defaults

---

## Purpose

Displays a multi-step process as a horizontal numbered track. Each step has a
circle, step name, and a full content card with heading and body text. The active
circle scales and fills with the primary colour; the content panel crossfades on
each transition.

Suitable for: workflows, processes, guidelines, checklists, or any sequential
content with 2–8 steps.

---

## Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | `"Negotiation Guidelines"` | Composition title |
| `subtitle` | string | *(see default)* | Subtitle paragraph below title |
| `steps` | string (JSON) | 5-step array | `[{label, name, body}, ...]` — 2–8 steps |
| `activeStep` | number | `0` | Step shown at composition start (0-based) |
| `primaryColor` | color | `#285f9f` | Active circle, heading, connector colour |
| `basePlateImage` | string | `"v2-base-blue.png"` | V2 base plate background file |
| `bgColor` | color | `#f5f2ea` | Page background |
| `cardColor` | color | `#fffdfa` | Content card background |
| `durationPerStep` | number | `4` | Seconds per step (2–10) |

---

## Animation Beats

| Time | Element | Effect |
|------|---------|--------|
| 0.0s | Title | Fade in + slide up |
| 0.25s | Subtitle | Fade in |
| 0.45s | Step track | Fade in + slide up |
| 0.65s | Content card | Fade in + slide up |
| each `i × durPerStep` | Previous circle | Deactivate (grey, scale 1) |
| each `i × durPerStep + 0.1` | Current circle | Activate (primary, scale 1.2) |
| each `i × durPerStep` | Previous panel | Fade out |
| each `i × durPerStep + 0.25` | Current panel | Fade in |
| each `i × durPerStep` | Connector[i-1] | Fill with primary colour |
| TOTAL − 0.5s | Overlay | Fade to black |

---

## Plate Options

| File | Colour | `primaryColor` |
|------|--------|----------------|
| `v2-base-green.png` | `#2f765f` | `#2f765f` |
| `v2-base-blue.png` ← default | `#285f9f` | `#285f9f` |
| `v2-base-red.png` | `#cd5746` | `#cd5746` |
| `v2-base-charcoal.png` | `#33424c` | `#33424c` |
| `v2-base-gold.png` | `#b1792f` | `#b1792f` |
| `v2-base-purple.png` | `#6957a6` | `#6957a6` |

Set `primaryColor` to match the plate.

---

## Render

Double-click `render.bat` in this folder, or via PowerShell from batch-tools:

```powershell
.\run-tomorrow-batch.ps1 -TemplateNames process-flow -Render -ExtractFrames
```

---

## Known Limits

- Step count is fixed at render time (2–8 steps recommended).
- Long step names may overflow the 130px label area at 14px — keep under ~25 characters.
- All steps cycle in forward order from step 0. The `activeStep` variable is reserved for future use.
