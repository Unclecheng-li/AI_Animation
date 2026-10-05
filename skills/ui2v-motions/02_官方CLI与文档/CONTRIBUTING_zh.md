# UI2V 贡献指南

[English](CONTRIBUTING.md)

感谢你帮助改进 UI2V。这个仓库聚焦 HyperFrames motion package 的注册表 CLI，
以及帮助 agent 发布、安装和介绍这些 package 的 Codex skill。

## 开发环境

要求：

- Node.js 20 或更新版本
- Bun 1.0 或更新版本

安装并验证：

```bash
bun install
bun run build
bun run test
node packages/ui2v/bin/ui2v.js --help
```

发布前验证：

```bash
bun run --filter "@ui2v/cli" verify
```

## 项目结构

```text
packages/ui2v/   active CLI package, npm @ui2v/cli, bin ui2v
skills/ui2v/     Codex skill for registry install, publish, and positioning
docs/            product, package, and legacy migration documentation
scripts/         maintenance scripts
```

## 当前范围

UI2V 负责注册表工作流：

- auth、search、install、update、list、inspect
- motion publish 和 sync
- package ownership、moderation、transfer、stars
- CLI upgrade 和 release support

HyperFrames 负责 composition 创作、预览、渲染和导出。不要在这个仓库里重新引入
已经移除的 JSON renderer 工具链。

## 代码准则

- 让 `@ui2v/cli` 保持聚焦：只做 registry operations。
- 保持 npm 命名清晰：package 是 `@ui2v/cli`，binary 是 `ui2v`。
- 行为变化时，为 CLI command、schema、auth、registry HTTP、publish/sync package
  scanning 添加聚焦测试。
- 英文和中文文档同步更新。
- 行为、定位、发布/安装指引变化时，同步更新 `skills/ui2v`。
- 不要提交 `.tmp/`、`out/`、生成的 archives、build output 或 media exports。

## 旧内容

旧 JSON-to-MP4 renderer examples 和 smoke scripts 已删除。迁移说明见
[docs/legacy-json-toolchain.zh.md](docs/legacy-json-toolchain.zh.md)。

## Commit Message

推荐使用 conventional commits：

- `feat: add new feature`
- `fix: bug fix`
- `docs: documentation update`
- `refactor: code refactoring`
- `test: add tests`
- `chore: maintenance`

## 许可

贡献即表示你同意贡献内容以 MIT 许可证授权。
