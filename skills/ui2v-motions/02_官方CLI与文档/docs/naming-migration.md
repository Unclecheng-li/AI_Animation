# Naming Migration

UI2V still contains compatibility names from earlier registry iterations:
`clawhub`, `clawdhub`, `clawdbot`, `skill`, and `OpenClaw`.

These names are not all dead code. Some are compatibility aliases, config
fallbacks, registry API fields, or package-registry features that may still be
used by existing users and services.

## Current Preferred Names

| Prefer | Legacy / compatibility |
| --- | --- |
| `ui2v` | `clawhub`, `clawdhub` |
| `motion` | `skill` when referring to UI2V motions |
| `motion package` | `skill package` |
| `UI2V registry` | `Clawhub registry` |

## Migration Rules

1. Do not remove public aliases without a deprecation release.
2. Keep environment fallbacks such as `CLAWHUB_*` and `CLAWDHUB_*` until usage is
   known to be gone.
3. Prefer new internal names for new code.
4. Rename tests and local variables opportunistically when touching nearby code.
5. Keep user-facing docs and README on the new vocabulary.

## High-Value Targets

- `packages/ui2v/bin/clawdhub.js` — keep as a compatibility binary or deprecate
  explicitly.
- `packages/ui2v/src/cli/clawdbotConfig.ts` — rename internally once callers are
  updated.
- `ui2v skill publish` — keep as a legacy alias; prefer `ui2v motion publish` in
  documentation.
- `hashSkillFiles`, `readSkillOrigin`, and related local names — migrate toward
  `motion` naming.

## Test Strategy

Before and after any naming migration:

```bash
bun run test
bun run build
node packages/ui2v/bin/ui2v.js --help
node packages/ui2v/bin/ui2v.js motion publish --help
```
