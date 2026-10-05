---
name: ui2v
version: 2.1.0
display_name: UI2V视频动效资源库
display_name_en: UI2V Video Motion Asset Library
description_zh: 让 AI 帮你发现、安装和分享 UI2V 视频动效资源。支持 HyperFrames 动效包的搜索、安装、发布、同步与更新，让已有动效轻松复用，也让原创作品更容易被发现。
description_en: Let AI help you discover, install, and share UI2V video motion assets. Search, install, publish, sync, and update HyperFrames motion packages so existing animations are easy to reuse and original work can reach more people.
description: Use when helping users discover, install, publish, share, sync, or update UI2V video motion assets and HyperFrames motion packages. Route video creation, preview, and rendering to HyperFrames skills.
metadata:
  short-description: AI 驱动的 UI2V 视频动效资源库
---

# ui2v Skill

UI2V 是面向 AI 工作流的 **视频动效资源库**。它帮助用户发现、安装、复用和分享 HyperFrames 动效包；实际的视频创作、预览和渲染由 HyperFrames 完成。

For project positioning, README copy, npm copy, website copy, or launch/promo
text, read `references/positioning.md`.

## Mental model

```text
HyperFrames authoring -> package folder -> ui2v login -> ui2v motion publish -> ui2v.com
```

| Layer | Tool |
| --- | --- |
| Author / preview / render | HyperFrames (`/hyperframes` and related skills) |
| Search / install / publish / sync | **`ui2v` CLI** (npm package `@ui2v/cli`, bin `ui2v`) |

Do **not** use the abandoned `@ui2v/cli@1.x` JSON render/preview stack (`doctor`, `validate`, `preview`, `render`, `animation.json`, `@ui2v/core`, `@ui2v/engine`, `@ui2v/producer`). The current `@ui2v/cli` package is the registry client.

## Task routing

Use this skill for registry work and CLI/package maintenance:

- **Publish/share/install/search a motion on ui2v.com** → use this skill and the `ui2v` CLI.
- **Fix or extend the UI2V CLI** → inspect `packages/ui2v/src/cli`, update focused tests, then run the repo verification commands below.
- **Fix registry package metadata or a publish failure** → read `references/package-format.md` and `references/publish.md`.
- **Update website, README, npm, or promo copy** → read `references/positioning.md`; keep package references as npm `@ui2v/cli`, bin command `ui2v`, and npx command `npx @ui2v/cli@latest ...`.
- **Clean project structure** → read `references/cleanup.md`; remove or route away from legacy JSON renderer examples/scripts; do not present them as current UI2V capabilities.
- **Prepare or explain a release** → read `references/release.md`; verify versions, tests, build, and npm copy.

Route away from this skill when the user is not doing registry work:

- **Make / edit / preview / render a video composition** → use HyperFrames skills, not this CLI.
- **Old JSON ui2v projects** → do not revive the old JSON toolchain. Migrate to a HyperFrames package, then publish with `ui2v`.

## CLI version gate

Before publish/install/sync that depends on current CLI behavior:

```bash
ui2v --cli-version
npm view @ui2v/cli version
```

- Missing CLI → install: `npm install -g @ui2v/cli@latest` (or `bun install -g @ui2v/cli`)
- Behind latest → `ui2v upgrade` (alias `self-update`), or `npm install -g @ui2v/cli@latest`
- Under `--no-input`, `ui2v upgrade` only prints the install command and exits non-zero when outdated

`npm view` is metadata only. Do not upgrade as a routine first step unless the CLI is missing, too old for the task, broken, or the user asks for latest.

From this monorepo before publishing:

```bash
cd packages/ui2v && bun run build && node bin/ui2v.js --cli-version
```

## Monorepo development workflow

For CLI source changes in this repository:

```bash
bun install
bun run build
bun run test
bun run --filter "@ui2v/cli" verify
node packages/ui2v/bin/ui2v.js --help
node packages/ui2v/bin/ui2v.js --cli-version
```

Prefer the narrowest useful test first while iterating:

```bash
cd packages/ui2v
bun run test:src
bun run verify:build
bun run test:artifact
```

## Package shape

A motion folder must include:

- `registry-item.json` with `type: "hyperframes:block"`
- Entry composition HTML (`index.html` or listed composition file)
- Optional `assets/`, `README.md`, thumbnail

Details: `references/package-format.md`.

## Positioning

When introducing the project, use this core message:

```text
让 AI 帮你发现、安装和分享 UI2V 视频动效资源：
搜索并安装现成动效，发布原创作品，让动画像依赖一样轻松复用。
```

Do not call UI2V a renderer. Keep the boundary crisp:

- HyperFrames creates, previews, and renders motion.
- UI2V distributes completed motion packages through search, install, publish,
  sync, and inspect workflows.

## Publish flow

```bash
ui2v login
ui2v motion publish ./my-motion --version 1.0.0
# optional: ui2v sync
```

Aliases: `ui2v skill publish`, legacy `ui2v publish`.

Full checklist: `references/publish.md`.

## Release flow

For npm release preparation, use `references/release.md`. Do not publish or bump
versions casually; first confirm the requested version and run local
verification.

## Common registry commands

```bash
ui2v search "logo sting"
ui2v install <slug>
ui2v list
ui2v update --all
ui2v explore
ui2v inspect <slug>
ui2v upgrade
```

Install command shown on the site: `npx @ui2v/cli@latest install <slug>`.

## Troubleshooting cookbook

- **CLI not found** → install `@ui2v/cli`, then confirm `ui2v --cli-version`.
- **Outdated CLI** → run `ui2v upgrade` or `npm install -g @ui2v/cli@latest`.
- **Auth failure** → run `ui2v login`; for automation use `ui2v login --token clh_...` only when the user provides a token.
- **Publish rejects version** → ensure `--version` is valid semver and is newer than the published release.
- **Missing entry HTML** → check `index.html`, first `files[]` composition path, or `{name}.html`.
- **Manifest validation failure** → check `type: "hyperframes:block"`, dimensions, duration, and `files[]` using `references/package-format.md`.
- **Render/preview request appears** → stop using UI2V commands and route to HyperFrames.
