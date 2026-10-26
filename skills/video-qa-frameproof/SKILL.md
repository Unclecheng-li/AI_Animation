---
name: "video-qa-frameproof"
description: "FrameProof 代码/Agent 生成视频的生成后 QA：空帧冻结、字幕、音频、编码元数据、Render Manifest 源码定位、Fix Packets 与 baseline 回归门禁。用于验收 MP4、定位渲染缺陷、自动修复后复检或为视频 PR/CI 增加质量门。"
version: "0.1.0"
triggers:
  - "frameproof"
  - "video-qa-frameproof"
  - "视频质量检查"
  - "视频空帧检测"
  - "视频回归测试"
  - "视频QA"
---

# FrameProof Video QA

## 你是什么

你是 **FrameProof 的生成后 QA 接入导航**。它扫描最终 MP4、可选字幕/音频和 Render Manifest，产出机器可读问题、源码定位与修复包；它不是创作工具、渲染器或人工看图/听审的替代品。

- 上游：https://github.com/yocchi12345jp/frameproof-video-qa
- 扫描与修复闭环：[references/verify-and-repair.md](references/verify-and-repair.md)
- 本目录不 vendor CLI、Studio 或 Agent Skill，实际验收需安装/调用上游工具。

## 支持的内容/类型

| 层级 | 能发现的问题 |
|---|---|
| 帧与画面 | 空帧、非预期冻结、边缘活动、宽高比；manifest 可断言运动/可见性 |
| 字幕 | 过短/过快、行数/行宽、重叠、间隙、越界、与已声明 UI 区域碰撞 |
| 音频 | 音轨缺失、异常静音、综合响度、true peak；需显式启用音频分析 |
| 元数据与平台 | 分辨率、容器、编码、像素格式、fps、时长、文件大小与平台预设 |
| 源码定位 | Render Manifest 将帧区间映射到 composition、组件和源文件 |
| 回归 | 新出现、恶化、改善、已解决、不变、已接受问题及 Fix Packets |

## 核心工作流

### Step 1 — 准备最终导出与声明意图

要求 Node.js 20+，FFmpeg 与 FFprobe 在 `PATH`。输入应是**准备交付的实际 MP4**，不是只用 HTML 预览代替。准备画幅、平台、时长、字幕文件、音频预期等验收条件。

```bash
npx frameproof-video-qa doctor
npx frameproof-video-qa init --video out/video.mp4
npx frameproof-video-qa verify
```

`init` 非破坏性生成 `.frameproof/` 配置；`verify` 输出 JSON、HTML、Fix Packets、SARIF、JUnit 与摘要。先阅读项目已有配置，不用默认配置覆盖用户已声明的验收标准。

### Step 2 — 需要源码定位时加入 manifest

核心扫描器不依赖 Remotion；有 React/Remotion 或其他源码映射需求时，增加 Render Manifest。manifest 声明帧区间、源码位置、元素区域及 motion/text/visible/audio/safe-area 等期望。

边缘活动不是 OCR，声明的字体大小也不是实际字形识别。对“文字写了什么”“是否美观”“表演是否自然”等，仍需人工查看关键帧。平台 UI overlay 是近似预览，不是所有设备/App 版本的像素保证。

### Step 3 — 从报告回到最小修复

- 按 Finding / Fix Packet 的源文件、帧区间、expected/actual 与复现命令定位。
- 实际打开受影响帧、时间带或 1:1 裁切，区分真实缺陷、有意静止和检测误报。
- 优先修复源头，同输入、同种子、同配置重渲；不要只修改报告、阈值或 baseline 来制造通过。
- 修复后再次扫描最终 MP4，并复核相邻镜头、字幕和音画同步，防止局部修复引入回归。

### Step 4 — 人工验收后建立 baseline

```bash
npx frameproof-video-qa baseline set .frameproof/artifacts/latest/report.json
npx frameproof-video-qa baseline status
```

只有看过成片和报告、确认当前状态可作为基准时才 set。CI 的 revision gate 默认阻止新增/恶化 error，不等于旧问题自动消失；已接受例外要有明确理由并可审计。

## 交付要求

交付报告路径、视频路径、实际检查范围、未解决 error/warning 和人工复核结论。无法听音时不能声称已完成听审；自动报告通过也不能声称不存在所有视觉或叙事问题。

## 来源与许可

上游 MIT。视频、字幕、字体、音乐和第三方素材的许可独立处理。FrameProof 是渲染器无关的通用 QA 工具，不是 Opus 5.5 专属项目。预览图来源见本目录 `README.md`。
