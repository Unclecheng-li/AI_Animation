# 命名迁移

UI2V 代码里仍然保留了一些早期注册表命名：`clawhub`、`clawdhub`、`clawdbot`、
`skill` 和 `OpenClaw`。

这些名字不全是死代码。有些是兼容 alias、config fallback、registry API 字段，
或者仍可能被现有用户和服务使用的 package-registry 能力。

## 当前推荐命名

| 推荐 | 旧名 / 兼容名 |
| --- | --- |
| `ui2v` | `clawhub`, `clawdhub` |
| `motion` | 指 UI2V motion 时的 `skill` |
| `motion package` | `skill package` |
| `UI2V registry` | `Clawhub registry` |

## 迁移规则

1. 不要在没有 deprecation release 的情况下移除公开 alias。
2. 在确认无人使用前，保留 `CLAWHUB_*` 和 `CLAWDHUB_*` 这类环境变量 fallback。
3. 新代码优先使用新命名。
4. 修改附近代码时，顺手迁移 tests 和局部变量名。
5. 面向用户的 docs 和 README 使用新词汇。

## 高价值目标

- `packages/ui2v/bin/clawdhub.js` — 作为兼容 binary 保留，或明确 deprecate。
- `packages/ui2v/src/cli/clawdbotConfig.ts` — 调用方更新后再做内部重命名。
- `ui2v skill publish` — 作为 legacy alias 保留；文档优先使用
  `ui2v motion publish`。
- `hashSkillFiles`、`readSkillOrigin` 等本地命名 — 逐步迁移到 `motion`。

## 测试策略

任何命名迁移前后都运行：

```bash
bun run test
bun run build
node packages/ui2v/bin/ui2v.js --help
node packages/ui2v/bin/ui2v.js motion publish --help
```
