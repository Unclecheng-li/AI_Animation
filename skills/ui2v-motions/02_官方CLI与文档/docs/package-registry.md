# Compatible Package Registry

UI2V's primary product surface is the motion registry:

```bash
ui2v search "logo sting"
ui2v install <slug>
ui2v motion publish ./my-motion --version 1.0.0
```

The CLI also includes an advanced `package` command group for compatible
registry packages such as code plugins and bundle plugins.

```bash
ui2v package explore
ui2v package inspect <name>
ui2v package publish ./plugin-folder --family code-plugin
```

## Why It Exists

Some registry entries are not motion blocks. They may package code, plugins, or
bundles that support the broader UI2V/OpenClaw-compatible ecosystem. The
`package` command group keeps those workflows available without changing the
main motion workflow.

## Boundary

| Use | Command |
| --- | --- |
| Search/install/publish HyperFrames motion packages | `ui2v search`, `ui2v install`, `ui2v motion publish` |
| Browse or publish compatible plugin/bundle packages | `ui2v package ...` |
| Author, preview, or render compositions | HyperFrames, not UI2V |

## Copy Guidance

For public UI2V introductions, lead with motion registry messaging. Mention
`ui2v package` only in advanced CLI docs, release notes, or package-registry
specific tasks.
