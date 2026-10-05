# Getting Started

[中文](getting-started.zh.md)

UI2V is the public registry for HyperFrames motion packages. The current
`@ui2v/cli` package is a registry client: it searches, installs, updates, syncs,
and publishes motions. It does not render `animation.json` projects.

## Workflow

1. Author and preview a composition with HyperFrames.
2. Package it as a motion folder with `registry-item.json` and entry HTML.
3. Check the package locally.
4. Log in with `ui2v login`.
5. Publish with `ui2v motion publish ./package --version 1.0.0`.
6. Share the ui2v.com page or install command.

## Package Shape

```text
my-motion/
├── registry-item.json
├── index.html
└── assets/
```

Required `registry-item.json` fields:

- `name`
- `type: "hyperframes:block"`
- `title`
- `description`
- `dimensions.width` and `dimensions.height`
- `duration`
- `files`

Versioning is passed to the CLI with `--version`; it is not stored in
`registry-item.json`.

## Publish

```bash
ui2v login
ui2v motion publish ./my-motion --version 1.0.0
ui2v motion publish ./my-motion --version 1.0.1 --changelog "Fix timing"
```

After publish:

- Page: `https://ui2v.com/<owner>/<slug>`
- Install: `npx @ui2v/cli@latest install <slug>`

## Install And Update

```bash
ui2v search "logo"
ui2v install <slug>
ui2v list
ui2v update --all
ui2v inspect <slug>
```

## Troubleshooting

Use `ui2v --cli-version` and `npm view @ui2v/cli version` when behavior depends
on the latest CLI.

Common failures:

- Missing CLI: install `npm install -g @ui2v/cli@latest`.
- Auth failure: run `ui2v login` again.
- Invalid version: pass a semver value with `--version`.
- Entry file missing: check `index.html` or `registry-item.json.files[]`.
- Manifest rejection: confirm `type`, dimensions, duration, and composition files.

## Legacy JSON Toolchain

The old `@ui2v/cli@1.x` JSON render/preview commands are removed. Do not use
`doctor`, `validate`, `preview`, `render`, `animation.json`, `@ui2v/core`,
`@ui2v/engine`, or `@ui2v/producer` as the current UI2V workflow. Author in
HyperFrames, then publish with this CLI.

## Related Docs

- [Quick Start](quick-start.md)
- [Architecture](architecture.md)
- [Roadmap](roadmap.md)
- [Legacy JSON Toolchain](legacy-json-toolchain.md)
