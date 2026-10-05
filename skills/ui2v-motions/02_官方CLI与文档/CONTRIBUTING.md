# Contributing to UI2V

[中文](CONTRIBUTING_zh.md)

Thank you for helping improve UI2V. This repository focuses on the registry CLI
for HyperFrames motion packages, plus the Codex skill that helps agents publish,
install, and describe those packages.

## Development Setup

Requirements:

- Node.js 20 or newer
- Bun 1.0 or newer

Install and verify:

```bash
bun install
bun run build
bun run test
node packages/ui2v/bin/ui2v.js --help
```

For release readiness:

```bash
bun run --filter "@ui2v/cli" verify
```

## Project Layout

```text
packages/ui2v/   active CLI package, npm @ui2v/cli, bin ui2v
skills/ui2v/     Codex skill for registry install, publish, and positioning
docs/            product, package, and legacy migration documentation
scripts/         maintenance scripts
```

## Current Scope

UI2V handles registry workflows:

- auth, search, install, update, list, inspect
- motion publish and sync
- package ownership, moderation, transfer, stars
- CLI upgrade and release support

HyperFrames handles composition authoring, preview, rendering, and export. Do
not reintroduce the removed JSON renderer stack in this repository.

## Code Guidelines

- Keep `@ui2v/cli` focused on registry operations.
- Keep npm naming clear: package `@ui2v/cli`, binary `ui2v`.
- Add focused tests for CLI command behavior, schema handling, auth, registry
  HTTP behavior, and publish/sync package scanning.
- Update English and Chinese docs together.
- Update `skills/ui2v` when behavior, positioning, or publish/install guidance
  changes.
- Do not commit `.tmp/`, `out/`, generated archives, build output, or media
  exports.

## Legacy Material

The old JSON-to-MP4 renderer examples and smoke scripts were removed. Migration
notes live in [docs/legacy-json-toolchain.md](docs/legacy-json-toolchain.md).

## Commit Messages

Conventional commits are encouraged:

- `feat: add new feature`
- `fix: bug fix`
- `docs: documentation update`
- `refactor: code refactoring`
- `test: add tests`
- `chore: maintenance`

## License

By contributing, you agree that your contributions are licensed under MIT.
