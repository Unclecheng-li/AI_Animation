# 快速开始

[English](quick-start.md)

UI2V 是面向 AI 工作流的视频动效资源库。它负责在 ui2v.com 上发现、安装、
更新、同步和发布 HyperFrames 动效包；创作、预览和渲染请使用 HyperFrames。

## 环境要求

- Node.js 20 或更新版本
- 本地 workspace 开发需要 Bun 1.0 或更新版本
- 发布 motion 时需要一个 HyperFrames package 文件夹

## 安装 CLI

安装带作用域的 npm 包。安装后提供的命令仍然是 `ui2v`。

```bash
npm install -g @ui2v/cli@latest
# or: bun install -g @ui2v/cli
ui2v --cli-version
ui2v --help
```

也可以不全局安装：

```bash
npx @ui2v/cli@latest --cli-version
npx @ui2v/cli@latest search "logo sting"
npx @ui2v/cli@latest install <slug>
```

## 常用注册表命令

```bash
ui2v search "lower third"
ui2v install <slug>
ui2v list
ui2v update --all
ui2v explore
ui2v inspect <slug>
ui2v upgrade
```

## 发布 Motion

可发布的 motion 是一个 HyperFrames package 文件夹，包含 `registry-item.json`
和入口 HTML 文件。

```bash
ui2v login
ui2v motion publish ./path/to/package --version 1.0.0
```

批量扫描 workspace：

```bash
ui2v sync --dry-run
ui2v sync
```

package 结构和排查方式见 [入门指南](getting-started.zh.md)。

## 本地 Workspace

```bash
bun install
bun run build
bun run test
node packages/ui2v/bin/ui2v.js --cli-version
node packages/ui2v/bin/ui2v.js --help
```

修改 CLI 后，在发布 npm release 前运行 package 验证：

```bash
bun run --filter "@ui2v/cli" verify
```

## 下一步

- [入门指南](getting-started.zh.md)
- [架构](architecture.zh.md)
- [路线图](roadmap.zh.md)
- [旧 JSON 工具链](legacy-json-toolchain.zh.md)
- [命名迁移](naming-migration.zh.md)
- [兼容 Package Registry](package-registry.zh.md)
