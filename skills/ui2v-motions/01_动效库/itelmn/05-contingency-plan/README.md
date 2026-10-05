# contingency-plan

**Pattern:** Vertical node flow (left) + detail panel (right)  
**Canvas:** 1920 × 1080px | **Duration:** `nodes.length × durationPerNode + 1` (default 15s for 4 nodes)  
**V3 status:** Clean ✅ — no tl.call(), Inter font, ACS colour defaults, fade-to-black

---

## Purpose

Left panel: numbered flow nodes on a vertical connector line.  
Right panel: full detail for the active node (large ghost number, heading, body).

Each node activates in sequence: the accent-coloured circle scales up on the left
while the right panel crossfades to the matching detail block.

Suitable for: risk registers, contingency processes, decision trees, or any
numbered workflow where each step has a title and explanatory paragraph.

---

## Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | `"Contingency Plan"` | Composition title |
| `nodes` | string (JSON) | 4-node array | `[{id, label, desc}, ...]` — 2–6 nodes |
| `activeNode` | number | `0` | Node active at start (0-based) |
| `primaryColor` | color | `#285f9f` | Inactive circle, title, info heading |
| `accentColor` | color | `#cd5746` | Active node circle highlight |
| `basePlateImage` | string | `"v2-base-blue.png"` | V2 base plate background |
| `bgColor` | color | `#f5f2ea` | Page background |
| `durationPerNode` | number | `3.5` | Seconds per node (2–8) |

---

## Animation Beats

| Time | Element | Effect |
|------|---------|--------|
| 0.0s | Title | Fade in |
| 0.3s | Flow area | Fade in |
| 0.5s | Flow nodes | Stagger in from x-28, 0.14s apart |
| 1.1s | Info panel | Fade in + slide left |
| i×dur | Previous info block | Fade out |
| i×dur | Previous circle | Deactivate → primary, scale 1 |
| i×dur+0.1 | Current circle | Activate → accent, scale 1.2 |
| i×dur+0.22 | Current info block | Fade in |
| TOTAL−0.5s | Overlay | Fade to black |

---

## Plate / Colour Options

| `basePlateImage` | `primaryColor` | suggested `accentColor` |
|-----------------|----------------|------------------------|
| `v2-base-blue.png` ← default | `#285f9f` | `#cd5746` (red) |
| `v2-base-green.png` | `#2f765f` | `#cd5746` (red) |
| `v2-base-charcoal.png` | `#33424c` | `#b1792f` (gold) |
| `v2-base-red.png` | `#cd5746` | `#285f9f` (blue) |
| `v2-base-gold.png` | `#b1792f` | `#285f9f` (blue) |
| `v2-base-purple.png` | `#6957a6` | `#cd5746` (red) |

---

## Known Limits

- Node `desc` text: max ~220 characters before overflow in the 420px panel height.
- Node labels: max ~30 characters at 20px/600.
- Vertical connector SVG is static — it does not animate per-segment.
