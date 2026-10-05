# 入门指南

[English](getting-started.md)

UI2V 是 HyperFrames motion package 的公共注册表。当前 `@ui2v/cli` 包是注册表
客户端：负责搜索、安装、更新、同步和发布 motion。它不再渲染 `animation.json`
项目。

## 工作流

1. 用 HyperFrames 创作并预览 composition。
2. 打包成包含 `registry-item.json` 和入口 HTML 的 motion 文件夹。
3. 本地检查 package。
4. 用 `ui2v login` 登录。
5. 用 `ui2v motion publish ./package --version 1.0.0` 发布。
6. 分享 ui2v.com 页面或安装命令。

## Package 结构

```text
my-motion/
├── registry-item.json
├── index.html
└── assets/
```

`registry-item.json` 必填字段：

- `name`
- `type: "hyperframes:block"`
- `title`
- `description`
- `dimensions.width` 和 `dimensions.height`
- `duration`
- `files`

版本号通过 CLI 的 `--version` 传入，不写在 `registry-item.json` 里。

## 发布

```bash
ui2v login
ui2v motion publish ./my-motion --version 1.0.0
ui2v motion publish ./my-motion --version 1.0.1 --changelog "Fix timing"
```

发布后：

- 页面：`https://ui2v.com/<owner>/<slug>`
- 安装：`npx @ui2v/cli@latest install <slug>`

## 安装和更新

```bash
ui2v search "logo"
ui2v install <slug>
ui2v list
ui2v update --all
ui2v inspect <slug>
```

## 排查

当行为依赖最新 CLI 时，用 `ui2v --cli-version` 和
`npm view @ui2v/cli version` 检查版本。

常见问题：

- CLI 缺失：安装 `npm install -g @ui2v/cli@latest`。
- 登录失败：重新运行 `ui2v login`。
- 版本非法：用 `--version` 传入 semver。
- 入口文件缺失：检查 `index.html` 或 `registry-item.json.files[]`。
- manifest 被拒绝：确认 `type`、尺寸、时长和 composition 文件。

## 旧 JSON 工具链

旧的 `@ui2v/cli@1.x` JSON render/preview 命令已经移除。不要把 `doctor`、
`validate`、`preview`、`render`、`animation.json`、`@ui2v/core`、
`@ui2v/engine` 或 `@ui2v/producer` 当作当前 UI2V 工作流。请在 HyperFrames
中创作，再用这个 CLI 发布。

## 相关文档

- [快速开始](quick-start.zh.md)
- [架构](architecture.zh.md)
- [路线图](roadmap.zh.md)
- [旧 JSON 工具链](legacy-json-toolchain.zh.md)
