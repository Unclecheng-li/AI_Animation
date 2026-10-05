# 路线图

[English](roadmap.md)

这份路线图描述当前 UI2V 视频动效资源库。渲染和 composition 创作由
HyperFrames 负责。

## 已完成

- Bun workspace monorepo。
- 带 `ui2v` bin 的 `@ui2v/cli` 包。
- 注册表命令：auth、search、install、list、update、inspect、publish、
  sync、ownership、moderation、stars、transfer 和 CLI upgrade。
- HyperFrames package 扫描和本地发布检查。
- CLI command、schema、registry HTTP、auth 和 artifact command flow 测试。
- 从当前工作流中移除旧 JSON render/preview 工具链。

## 近期目标

- 让 README、docs、skill 文件和 ui2v.com 上的安装/发布文案保持一致。
- 改进入口文件缺失、manifest 结构和服务端校验失败时的发布诊断。
- 优化大型 workspace 下的 sync dry-run 摘要。
- 扩充有效 HyperFrames package 文件夹示例。

## 注册表可靠性

- 让本地和自动化场景的 auth token 处理更清晰。
- 保留对临时 registry/network 失败有帮助的 retry 行为。
- 让 upgrade 提醒足够准确，同时避免普通命令太吵。
- 为发布时常见失败的 package 边界情况增加 fixtures。

## 生态

- 文档站。
- ui2v.com 上更好的 package preview。
- 社区 motion templates。
- HyperFrames 到 UI2V 的发布示例。
- 改进用于发现和安装判断的 registry metadata。
