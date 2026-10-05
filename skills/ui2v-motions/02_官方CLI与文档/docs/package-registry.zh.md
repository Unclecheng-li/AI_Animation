# 兼容 Package Registry

UI2V 的主要产品面是 motion registry：

```bash
ui2v search "logo sting"
ui2v install <slug>
ui2v motion publish ./my-motion --version 1.0.0
```

CLI 里也包含高级的 `package` 命令组，用于兼容 registry packages，例如 code
plugins 和 bundle plugins。

```bash
ui2v package explore
ui2v package inspect <name>
ui2v package publish ./plugin-folder --family code-plugin
```

## 为什么存在

有些 registry entries 不是 motion blocks。它们可能是 code、plugins 或 bundles，
用于支持更广义的 UI2V/OpenClaw-compatible ecosystem。`package` 命令组保留这些
工作流，同时不改变主要的 motion workflow。

## 边界

| 用途 | 命令 |
| --- | --- |
| 搜索/安装/发布 HyperFrames motion packages | `ui2v search`, `ui2v install`, `ui2v motion publish` |
| 浏览或发布兼容 plugin/bundle packages | `ui2v package ...` |
| 创作、预览或渲染 compositions | HyperFrames，不是 UI2V |

## 文案建议

公开介绍 UI2V 时，优先讲 motion registry。只在高级 CLI 文档、release notes 或
package-registry 相关任务中提到 `ui2v package`。
