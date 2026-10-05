# UI2V release guide

Use this when preparing, checking, or explaining an `@ui2v/cli` npm release.

## Versioning

The root workspace package and `packages/ui2v/package.json` should have the same
version.

```bash
node scripts/bump-version.mjs 2.0.2
```

## Local verification

```bash
bun install
bun run test
bun run build
bun run --filter "@ui2v/cli" verify
node packages/ui2v/bin/ui2v.js --cli-version
node packages/ui2v/bin/ui2v.js --help
```

## Package identity

- npm package: `@ui2v/cli`
- binary: `ui2v`
- package path: `packages/ui2v`
- Node engine: `>=20`

## GitHub release workflow

The npm publish workflow is `.github/workflows/publish-npm.yml`.

It expects:

- manual `workflow_dispatch`
- input `version`
- `NPM_TOKEN` secret
- root/package versions matching the input
- npm version higher than latest published `@ui2v/cli`

## Copy checklist

Before release, scan docs and README for stale install commands:

```bash
rg -n "npx ui2v|ui2v render|ui2v preview|ui2v validate|ui2v doctor|packages/cli"
```

Expected install examples:

```bash
npm install -g @ui2v/cli@latest
npx @ui2v/cli@latest install <slug>
```
