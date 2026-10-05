# Roadmap

[中文](roadmap.zh.md)

This roadmap describes the current UI2V video motion asset library. Rendering
and composition authoring are owned by HyperFrames.

## Completed

- Bun workspace monorepo.
- `@ui2v/cli` package with `ui2v` bin.
- Registry commands for auth, search, install, list, update, inspect, publish,
  sync, ownership, moderation, stars, transfer, and CLI upgrade.
- HyperFrames package scanning and local publish checks.
- Tests for CLI commands, schema handling, registry HTTP behavior, auth, and
  artifact-level command flows.
- Removal of the old JSON render/preview toolchain from the active workflow.

## Near Term

- Keep install and publish copy consistent across README, docs, skill files, and
  ui2v.com.
- Improve publish diagnostics for missing entry files, manifest shape, and
  server-side validation errors.
- Tighten sync dry-run summaries for workspaces with many packages.
- Expand examples for valid HyperFrames package folders.

## Registry Reliability

- Make auth token handling clearer for local use and automation.
- Preserve useful retry behavior around transient registry/network failures.
- Keep upgrade warnings precise without making routine commands noisy.
- Add fixtures for package edge cases that commonly fail at publish time.

## Ecosystem

- Documentation site.
- Better package previews on ui2v.com.
- Community motion templates.
- HyperFrames-to-UI2V publishing examples.
- Registry metadata improvements for discovery and install confidence.
