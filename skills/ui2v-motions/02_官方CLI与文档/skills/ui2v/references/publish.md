# Publish to UI2V

## Prerequisites

1. HyperFrames package folder ready (`registry-item.json` + entry HTML).
2. Logged in: `ui2v login` (or `ui2v login --token clh_...`).
3. Semver for this release: `--version 1.2.3`.

## Commands

```bash
ui2v motion publish ./path/to/package --version 1.0.0
ui2v motion publish ./path/to/package --version 1.0.1 --changelog "Fix timing" --tags latest
ui2v motion publish ./path/to/package --version 1.0.0 --slug my-slug --name "My Motion"
```

Bulk / workspace scan:

```bash
ui2v sync
ui2v sync --dry-run
ui2v sync --all --bump patch
```

## What the CLI checks locally

- Folder exists
- At least one file
- `registry-item.json` present
- Entry HTML present (`index.html` or `*.html`)
- Valid semver `--version`

Server-side validation still runs on upload (duration ≥ 1s, manifest shape, etc.).

## After publish

- Page: `https://ui2v.com/<owner>/<slug>`
- Install: `npx @ui2v/cli@latest install <slug>`

Published motions are released under MIT-0 on UI2V.

## Do not

- Publish `@ui2v/core` `animation.json` / `project.json` / legacy `MOTION.json`
- Call `@ui2v/cli@1.x` JSON toolchain commands (`validate` / `preview` / `render`) as a publish gate
- Use `clawhub` as the primary binary name (legacy); prefer `ui2v`

## Troubleshooting

- `ui2v: command not found` → install `npm install -g @ui2v/cli@latest`, then run `ui2v --cli-version`.
- `401` / `403` / auth prompt loops → run `ui2v login` again, or use `ui2v login --token clh_...` when the user provides a token.
- Invalid version → pass a semver release with `--version`, for example `1.0.1`.
- Entry file missing → ensure `index.html` exists, or that `registry-item.json.files[]` points to an existing composition HTML file.
- Server validation failure → re-check duration, dimensions, package type, and composition file shape in `references/package-format.md`.
