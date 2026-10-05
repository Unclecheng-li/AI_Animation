# Hero Radar Sweep

A CRT-green radar scope rotates its sweep arm while fixed contact blips light up. Function: **detection / monitoring** — observability energy, not marketing gradients.

## Purpose

- Security, ops, and infrastructure heroes
- Circular sweep choreography
- Retro terminal palette (green on near-black)

## Specs

- Sweep rotates ~360° across the clip
- Three blips appear at authored bearings (no randomness)
- Entry: `index.html`

## Usage

```bash
npx hyperframes preview
ui2v motion publish . --version 1.0.0
```

## Notes

Blip positions are constants. If you add more contacts, keep them sparse so the scope silhouette stays readable.
