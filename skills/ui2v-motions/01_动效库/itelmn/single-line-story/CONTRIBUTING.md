# Contributing

Contributions should strengthen HyperFrames-native data visualization. New work must preserve the product boundary: HyperFrames remains the timeline, preview, check, and render engine.

## Adding a template

1. Start from the nearest existing composition.
2. Add a `template.json` manifest with `engine: "hyperframes"`.
3. Define the expected input shape and missing-data policy.
4. Include generic sample data and a generated local data file.
5. Derive every frame from normalized HyperFrames timeline progress.
6. Add deterministic tests for direct and backward seeking.
7. Run the complete HyperFrames check and inspect sampled snapshots.
8. Add the template to the portable skill and gallery.

Avoid live data fetches, timers, animation-frame loops, library-owned transitions, nondeterministic randomness, or separate render commands.

## Local checks

```bash
npm run package:skill
npm test
npm run check:all
npm --prefix website run build
```

Do not render final MP4 files until the composition has been approved in HyperFrames Studio.
