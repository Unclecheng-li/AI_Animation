# Legacy JSON Toolchain

UI2V used to include a JSON-to-MP4 renderer built around `animation.json` and
packages such as `@ui2v/core`, `@ui2v/runtime-core`, `@ui2v/engine`, and
`@ui2v/producer`.

That stack is no longer part of this repository's active product direction.
Current UI2V is the video motion asset library for HyperFrames packages.

## What Was Removed

- JSON project validation and preview commands
- Browser renderer and WebCodecs export pipeline
- Runtime frame planning APIs
- Renderer smoke examples and demo `animation.json` projects
- Old commands such as `doctor`, `validate`, `preview`, `render`, and
  `inspect-runtime`

## Current Direction

```text
HyperFrames authoring
  -> HyperFrames package folder
  -> registry-item.json + entry HTML
  -> ui2v motion publish
  -> ui2v.com
```

Use HyperFrames for composition authoring, preview, and rendering. Use UI2V for
searching, installing, publishing, updating, and syncing completed motion
packages.

## Migration Guidance

Do not revive old JSON renderer projects inside this repository. Rebuild or
migrate them as HyperFrames composition packages. Once a package has
`registry-item.json` and entry HTML, publish it with:

```bash
ui2v motion publish ./path/to/package --version 1.0.0
```
