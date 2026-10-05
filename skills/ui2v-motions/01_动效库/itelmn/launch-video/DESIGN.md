# TDrive Launch Film Visual System

## Style Prompt

TDrive Launch Flow combines the real TDrive Vault desktop interface with the optimistic softness of the existing TDrive cloud artwork. The film should feel fast, capable, friendly, and trustworthy: deep blue-green product surfaces, Telegram cyan reserved for live actions, rounded panels, tactile spring motion, flowing file paths, and short moments of quiet clarity between dense transitions. Product UI remains legible and accurate; clouds, paper planes, file cards, paths, and status rings provide the expressive motion layer.

## Colors

- Canvas: `#0e171c`
- Surface: `#121e24`
- Raised surface: `#20343d`
- Primary text: `#e7f0f2`
- Muted text: `#94a7ad`
- Action accent: `#2aabee`
- Success accent: `#49b889`
- Friendly light field: `#eaf7ff`

## Typography

- Nunito Variable, 900 for launch statements and 350-500 for supporting copy.
- SFMono-Regular/monospace only for CLI commands and technical labels.
- Nunito is retained despite generic-video font guidance because it is TDrive's actual bundled product typeface.

## Motion

- Master: 1920x1080, 30 fps, 105 seconds.
- Fast UI actions use 0.18-0.32 second entries with `expo.out` or `back.out(1.35)`.
- Hero reveals use 0.65-1.1 second entries with `power4.out`, `sine.out`, and controlled overshoot.
- Use file-flight paths, expanding cards, camera pushes, radial wipes, and soft cyan cover wipes as recurring transitions.
- Dense sections alternate with 2-3 second breathing holds around the core promises.

## Editability

- Keep every headline and CTA as live text.
- Keep clouds, paths, cards, progress rings, cursors, and UI frames as separate DOM/SVG layers.
- Use named scene containers and one deterministic GSAP master timeline.
- Existing screenshots may be framed and cropped, but never flattened together with copy.

## What NOT to Do

- Do not invent storage limits, speed claims, or security guarantees.
- Do not imply that TDrive is affiliated with Telegram.
- Do not show a mobile app as a shipped product; the actual app is desktop-first.
- Do not use generic purple neon, glassmorphism everywhere, or unreadably tiny full-screen UI.
- Do not keep every scene at the same motion density or use the same entrance direction repeatedly.
