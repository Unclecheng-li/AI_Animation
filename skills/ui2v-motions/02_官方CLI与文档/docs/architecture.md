# Architecture

[中文](architecture.zh.md)

UI2V is organized as a video motion asset library for HyperFrames packages. The
active package is `@ui2v/cli`, which installs the `ui2v` command. HyperFrames
owns authoring, preview, and rendering.

## Package

```text
packages/ui2v
  bin/ui2v.js               CLI executable
  src/cli.ts                command registration
  src/cli/commands          registry command implementations
  src/schema                package and registry schemas
  src/http.ts               registry HTTP client
  src/browserAuth.ts        browser login helpers
```

## Registry Flow

```text
HyperFrames package folder
  -> registry-item.json + entry HTML
  -> ui2v command
  -> local package checks
  -> authenticated registry request
  -> ui2v.com page and install command
```

## Command Boundaries

- Auth commands manage browser login and token storage.
- Search/install/list/update/inspect commands consume registry metadata.
- Publish/sync commands scan local HyperFrames package folders and upload
  validated package archives.
- Upgrade commands compare the installed CLI with the latest npm package.
- Ownership, transfer, moderation, star, and unstar commands operate on registry
  records.

## Package Boundary

UI2V package validation is about registry readiness, not video rendering. Local
checks confirm folder shape, `registry-item.json`, entry HTML, semver, and files.
Server-side validation still decides whether a package can be published.

## Legacy Boundary

The old JSON renderer packages and commands are no longer part of the current
architecture. Do not route new work through `@ui2v/core`, `@ui2v/runtime-core`,
`@ui2v/engine`, `@ui2v/producer`, `animation.json`, `validate`, `preview`, or
`render`. Rebuild old motions as HyperFrames packages, then publish with the
current CLI.

## Design Principles

1. Keep UI2V small: registry client, not renderer.
2. Keep npm package naming explicit: package `@ui2v/cli`, bin `ui2v`.
3. Keep package format checks close to schema and command tests.
4. Keep install/publish copy consistent across docs, skill files, README, and
   ui2v.com.
