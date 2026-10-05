# golden-ratio-demo — Notes

The committed `final.mp4` is the latest draft (v2 baseline + section 01 tweaks). Two items were still open when this project was archived for the GitHub release:

1. **Section 01 title pass** — the opening title card's kerning and entrance timing were on the punch list but not finalized.
2. **Keyframe re-encode** — render inherited the draft profile (CRF 28, `power2.out` on the mask). A standard-quality final (CRF 18) hasn't been run.

Students reverse-engineering this project: the composition is complete and renderable. To produce a proper standard-quality final, run:

```bash
cd video-projects/golden-ratio-demo
npx hyperframes lint
npx hyperframes render --quality standard --output renders/golden-ratio-demo-standard.mp4
```

Then compare against `final.mp4` for the left-mask contrast fix reference.
