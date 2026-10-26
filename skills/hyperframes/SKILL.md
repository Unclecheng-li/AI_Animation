---
name: "hyperframes"
description: "HyperFrames HTML 到 MP4 渲染基础设施导航：composition、可 seek 的 GSAP 时间线、素材/字幕/声音、CLI 检查与确定性本地/云端渲染。用于选择视频渲染底座、批量变量视频、Studio 编辑或接入 HyperFrames。"
version: "0.1.0"
triggers:
  - "hyperframes"
  - "HTML转MP4"
  - "视频渲染基础设施"
  - "GSAP逐帧渲染"
  - "批量视频渲染"
---

# HyperFrames

## 你是什么

你是 **HyperFrames 的接入与工程合同导航**，不是另一套动画风格。HyperFrames 把 HTML、CSS、媒体和可 seek 的动画确定性地渲染成 MP4，可作为 `code-mv-render`、数据视频或产品视频的生产底座。

- 上游：https://github.com/heygen-com/hyperframes
- 官方文档：https://hyperframes.heygen.com/introduction
- 工程与渲染规范：[references/composition-contract.md](references/composition-contract.md)

本目录不 vendor HyperFrames 引擎或官方 Skills。真正制作时安装上游 CLI/插件，并优先读取上游 `/hyperframes` 与 `/hyperframes-cli`；本目录仅负责快速定位和接入。

## 何时使用

| 需求 | 决策 |
|---|---|
| 多 composition、媒体轨道、字幕、变量批量、本地/云端统一导出 | 选 HyperFrames |
| 想在 Studio 中继续编辑 HTML 视频时间线 | 选 HyperFrames |
| 已有自包含 Canvas 短片、只需轻量逐帧导出 | 可留在 `code-mv-render`，不为迁移而迁移 |
| 只要一种手绘/排版风格 | 先看 `opus-video-skills` 或 `lemo-opuscar`，再决定底座 |
| 只需扫描已有 MP4 | 用 `video-qa-frameproof`，不需要 HyperFrames |

## 核心工作流

### Step 1 — 安装并确定项目边界

要求 Node.js 22+、FFmpeg；本地 Chrome 由上游工具诊断/安装。Agent 项目可安装核心 Skills：

```bash
npx hyperframes skills update
npx hyperframes init my-video
```

Claude Code 也可用上游版本化插件：

```bash
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes
```

不要在本导航目录直接 init；进入用户的实际视频工程。需要复用现成视觉块时先用上游 registry/catalog，不重复手写已有组件。项目已有渲染器时先评估迁移成本，不强制换底座。

### Step 2 — 用 composition 与时间线表达视频

根 `index.html` 挂载场景，`compositions/` 保存可复用场景，`assets/` 保存本地素材。每个 composition 注册 paused GSAP timeline，由渲染器 seek，不自行 `play()`。

- 根 `data-duration` 是成片长度；`.clip` 用 `data-start` / `data-duration` 表达可见窗口。
- 场景 host、场景根和 timeline key 使用同一 composition id；scene 文件内容放在 `<template>` 内。
- 场景内使用 `fromTo` 保证反向 seek 可重建；不把场景 timeline 再嵌进根 timeline。
- 动画、媒体、字体与网络资源必须在导出前可确定读取。离线工程优先本地资源并保留许可。

### Step 3 — 检查并实际看图

```bash
npx hyperframes lint
npx hyperframes check --json
npx hyperframes snapshot
npx hyperframes preview
```

`lint` 用于编写过程，`check --json` 是运行/布局/对比度门禁；出现 “0 samples” 不能算检查完成。逐个查看 snapshot，覆盖每个场景、关键动作、转场和结尾。需要用户确认预览时按用户节奏停下；用户授权直接完成则继续导出。

### Step 4 — 渲染与成片复核

```bash
npx hyperframes render --quality draft --output out-draft.mp4
npx hyperframes render --quality delivery --output out.mp4
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 out.mp4
```

交付前确认文件非空、时长匹配根 `data-duration`，并查看最终 MP4 的解码帧和音轨。需要可复现容器、变量批量、Lambda/Cloud Run 时使用上游相应命令；云端/在线素材、转写或 TTS 不得被称作全离线流程。

## 硬约束

- 不读取墙钟驱动画面，不让动画依赖计时器自然播放、跨帧状态或未播种随机数。
- 不用实时录屏替代确定性逐帧渲染。
- `check` 通过不等于视觉验收；仍须打开图片查看，并复核最终编码文件。
- 不用布局豁免属性掩盖真实遮挡，只对有意设计的最小节点作精确豁免。
- HyperFrames 是通用工具，不写成 Opus 5.5 专属或必须由其运行。

## 来源与许可

上游 Apache-2.0。第三方 block、字体、媒体、生成服务和用户素材分别适用自己的条款。预览图来自上游文档，署名与路径见本目录 `README.md`。
