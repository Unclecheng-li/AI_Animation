# Scripts

This folder contains maintenance scripts for the current UI2V registry CLI
workspace.

Use the package scripts for ordinary verification:

```bash
bun run build
bun run test
bun run ui2v --help
```

Available scripts:

- `bump-version.mjs` — update the root workspace and `packages/ui2v` versions
  together.
