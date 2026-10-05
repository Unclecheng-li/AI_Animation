# code-of-ethics

**Pattern:** Horizontal tab bar with sliding highlight — sequential topic reveal  
**Canvas:** 1920 × 1080px | **Duration:** `tabs.length × durationPerTab` (default 32.5s for 5 tabs)  
**V3 status:** Clean ✅ — no CSS injection conflict, Inter font, ACS colour defaults

---

## Purpose

Displays multi-topic content as a horizontal tab bar. Each tab contains a
heading and body paragraph. The coloured highlight slides between tabs in
sequence; content cross-fades per transition.

Suitable for: ethics codes, policy frameworks, principles, any content with
3–8 equally-weighted topics.

---

## Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | `"Code of Ethics"` | Module title at top |
| `kicker` | string | `"ETHICS AND PROFESSIONAL PRACTICE"` | Uppercase kicker above title |
| `unitCode` | string | `"ACS"` | Unit code chip (top-right) |
| `basePlateImage` | string | `"v2-base-blue.png"` | Base plate filename |
| `tabs` | string (JSON) | 5-tab array | `[{label, heading, body}, ...]` — 2–8 tabs |
| `activeTab` | number | `0` | Tab shown at composition start (0-based) |
| `tabColor` | color | `#285f9f` | Tab highlight + heading colour (use ACS plate colour) |
| `tabBgColor` | color | `#e8ebe4` | Tab bar background |
| `cardColor` | color | `#fffdfa` | Content card background |
| `textColor` | color | `#182026` | Body text colour |
| `bgColor` | color | `#f5f2ea` | Page background (ACS canvas) |
| `durationPerTab` | number | `6.5` | Seconds per tab (4–14) |

---

## Animation Beats

| Time | Element | Effect |
|------|---------|--------|
| 0.0s | Kicker | Fade in + slide up |
| 0.1s | Title | Fade in + slide up |
| 0.2s | Unit chip | Fade in |
| 0.45s | Tab bar | Drop in from above |
| 0.80s | Footer | Fade in |
| 0.95s | Panel 0 | Fade in + slide up |
| each tab transition | Highlight | Slides to new position |
| each tab transition | Content | Cross-fade out → in |
| TOTAL−0.5s | Overlay | Fade to black |

---

## Plate Options

| File | Colour | tabColor |
|------|--------|----------|
| `v2-base-green.png` | `#2f765f` | `#2f765f` |
| `v2-base-blue.png` | `#285f9f` | `#285f9f` |
| `v2-base-red.png` | `#cd5746` | `#cd5746` |
| `v2-base-charcoal.png` | `#33424c` | `#33424c` |
| `v2-base-gold.png` | `#b1792f` | `#b1792f` |
| `v2-base-purple.png` | `#6957a6` | `#6957a6` |

Set `tabColor` to match the plate.

---

## Render

```bash
npx hyperframes render code-of-ethics/index.html \
  --variables code-of-ethics/variables.sample.json \
  --output code-of-ethics/output.mp4
```

---

## Known Limits

- Tab count is fixed at render time. Max ~8 tabs before labels overflow.
- Tab label recommended max: ~20 characters per tab (at 5 tabs).
- `activeTab` sets the *starting* tab — the composition always cycles through all tabs in order from `activeTab` onward.
