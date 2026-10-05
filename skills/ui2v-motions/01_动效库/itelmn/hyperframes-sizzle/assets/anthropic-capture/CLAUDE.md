# Home \ Anthropic — Captured Website

Source: https://anthropic.com

## How to Create a Video

Invoke the `/website-to-hyperframes` skill. It walks you through the full workflow: read data → create DESIGN.md → plan video → build compositions → lint/validate/preview.

If you don't have the skill installed, run: `npx skills add heygen-com/hyperframes`

## What's in This Capture

| File | Contents |
|------|----------|
| `screenshots/scroll-*.png` | Viewport screenshots covering the full page (1920x1080 each, 30% overlap). **View scroll-000.png FIRST** (hero section), then scan through the rest to understand the full page. |
| `extracted/tokens.json` | Design tokens: 20 colors, 2 fonts, 20 headings, 0 CTAs, 5 sections |
| `extracted/visible-text.txt` | All visible text content in DOM order — use exact strings, never paraphrase |
| `extracted/assets-catalog.json` | Every asset URL (images, fonts, videos, icons) with HTML context |
| `extracted/animations.json` | Animation catalog: 0 web animations, 1 scroll triggers, 0 canvases |
| `assets/svgs/` | Extracted inline SVGs (logos, icons, illustrations) |
| `assets/` | Downloaded images and font files — **Read every image file to see what it contains** |
| `extracted/lottie-manifest.json` | Lottie animations found on this site — read this to see what animations are available (name, dimensions, duration). Embed via `lottie.loadAnimation({ path: 'assets/lottie/animation-0.json' })`. Do NOT read the raw JSON files — they are machine data. |


| `extracted/asset-descriptions.md` | One-line description of every downloaded asset — read this first |

> **DESIGN.md does not exist yet.** It will be created when you run the `/website-to-hyperframes` workflow. Do not write compositions without it.

## Brand Summary

- **Colors**: #141413, #FAF9F5, #F0EEE6, #B0AEA5, #E8E6DC, #3D3D3A, #C6613F, #1414131A, #14141333, #5E5D59
- **Fonts**: Anthropic Serif, Anthropic Sans
- **Sections**: 5 page sections detected
- **Headings**: 20 headings extracted
- **CTAs**: 0 calls-to-action found

## Source Patterns Detected

- CSS custom properties used extensively — preserve design tokens for colors, spacing, and typography.
- Typography: Anthropic Serif, Anthropic Sans. Match these exact font families and weights.

## Example Prompts

Try asking:

- "Make me a 15-second social ad from this capture"
- "Create a 30-second product tour video"
- "Turn this into a vertical Instagram reel"
- "Build a feature announcement video highlighting the top 3 features"
