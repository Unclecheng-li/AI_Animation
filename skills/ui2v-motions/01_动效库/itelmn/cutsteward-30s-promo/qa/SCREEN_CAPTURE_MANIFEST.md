# Screen-capture manifest

## Capture contract

- Product: the actual local CutSteward UI at `http://127.0.0.1:4173`.
- Capture canvas: 1600×900.
- Codec/rate: VP8 at 25 fps.
- Interaction policy: safe local navigation only; no external provider call, spend, upload, publish, or destructive action.
- Visual pointer: a local cursor/ripple overlay used to make the tutorial path legible.
- Script: `scripts/record-cutsteward.mjs`.

## Truthful journey

1. `01-home-guided.webm`: prefilled tutorial prompt and the real Guided/Autonomous choice.
2. `02-rights-preflight.webm`: demonstration preflight, SAMPLE PLAN, rights checkbox, and unactivated confirmation.
3. `03-plan-inspection.webm`: stored planning run, Product beat and Shot 11, with Planned only / No recorded media visible.
4. `04-verified-delivery-public.webm`: dedicated public-safe certified local conformance run, project-authored test media, decode evidence, evidence sheet, SHA-256, and certified delivery state. No private run or user-supplied likeness appears.

## Validation

All four release captures passed full decode. Contact sheets are stored in `qa/01-home-guided-sheet.jpg` through `qa/03-plan-inspection-sheet.jpg` plus `qa/04-public-delivery-sheet.jpg`. The final edit must keep the planning run and certified delivery visually and verbally separate.
