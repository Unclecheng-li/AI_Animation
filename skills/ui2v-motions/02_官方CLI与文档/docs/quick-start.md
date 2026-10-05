# Quick Start

[中文](quick-start.zh.md)

UI2V is a video motion asset library for HyperFrames packages. It helps you
discover, install, update, sync, and publish motions on ui2v.com. Authoring,
preview, and rendering belong to HyperFrames.

## Requirements

- Node.js 20 or newer
- Bun 1.0 or newer for local workspace development
- A HyperFrames package folder when publishing a motion

## Install The CLI

Install the scoped npm package. It exposes the `ui2v` command after installation.

```bash
npm install -g @ui2v/cli@latest
# or: bun install -g @ui2v/cli
ui2v --cli-version
ui2v --help
```

Run without a global install:

```bash
npx @ui2v/cli@latest --cli-version
npx @ui2v/cli@latest search "logo sting"
npx @ui2v/cli@latest install <slug>
```

## Common Registry Commands

```bash
ui2v search "lower third"
ui2v install <slug>
ui2v list
ui2v update --all
ui2v explore
ui2v inspect <slug>
ui2v upgrade
```

## Publish A Motion

A publishable motion is a HyperFrames package folder with `registry-item.json`
and an entry HTML file.

```bash
ui2v login
ui2v motion publish ./path/to/package --version 1.0.0
```

Bulk workspace scan:

```bash
ui2v sync --dry-run
ui2v sync
```

See [Getting Started](getting-started.md) for package shape and troubleshooting.

## Local Workspace

```bash
bun install
bun run build
bun run test
node packages/ui2v/bin/ui2v.js --cli-version
node packages/ui2v/bin/ui2v.js --help
```

For CLI changes, run the package verification before publishing npm releases:

```bash
bun run --filter "@ui2v/cli" verify
```

## Next Steps

- [Getting Started](getting-started.md)
- [Architecture](architecture.md)
- [Roadmap](roadmap.md)
- [Legacy JSON Toolchain](legacy-json-toolchain.md)
- [Naming Migration](naming-migration.md)
- [Compatible Package Registry](package-registry.md)
