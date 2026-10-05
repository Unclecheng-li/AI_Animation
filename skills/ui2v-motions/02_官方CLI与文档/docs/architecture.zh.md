# 架构

[English](architecture.md)

UI2V 现在是面向 AI 工作流的 HyperFrames 视频动效资源库。当前活跃包是
`@ui2v/cli`，安装后提供 `ui2v` 命令。创作、预览和渲染由 HyperFrames 负责。

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

## 注册表流程

```text
HyperFrames package folder
  -> registry-item.json + entry HTML
  -> ui2v command
  -> local package checks
  -> authenticated registry request
  -> ui2v.com page and install command
```

## 命令边界

- Auth 命令管理浏览器登录和 token 存储。
- Search/install/list/update/inspect 命令消费 registry metadata。
- Publish/sync 命令扫描本地 HyperFrames package 文件夹并上传通过检查的包。
- Upgrade 命令比较当前安装的 CLI 和 npm 最新包。
- Ownership、transfer、moderation、star 和 unstar 命令操作 registry record。

## Package 边界

UI2V 的 package validation 关注能否进入注册表，不负责视频渲染。本地检查会确认
文件夹结构、`registry-item.json`、入口 HTML、semver 和文件列表。服务端校验仍然
决定 package 是否可以发布。

## 旧工具链边界

旧 JSON renderer 包和命令不再属于当前架构。不要把新工作路由到 `@ui2v/core`、
`@ui2v/runtime-core`、`@ui2v/engine`、`@ui2v/producer`、`animation.json`、
`validate`、`preview` 或 `render`。请把旧 motion 重建为 HyperFrames package，
再用当前 CLI 发布。

## 设计原则

1. 保持 UI2V 小而清晰：注册表客户端，不是 renderer。
2. 明确 npm 命名：package 是 `@ui2v/cli`，bin 是 `ui2v`。
3. 让 package format 检查贴近 schema 和 command tests。
4. 让 docs、skill、README 和 ui2v.com 上的安装/发布文案保持一致。
