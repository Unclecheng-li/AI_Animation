---
name: "opus-video-skills"
description: "Opus 5.5 代码视频双风格库：painted-animation 手绘水彩/水墨角色动画与逐字歌词 MV，kinetic-reel 动态排版/WebGL 作品集与产品 Reel。用于手绘短片、角色 MV、卡拉 OK、motion reel、kinetic typography 或程序化配乐视频。"
version: "0.1.0"
triggers:
  - "opus-video-skills"
  - "painted-animation"
  - "kinetic-reel"
  - "水彩角色动画"
  - "动态排版Reel"
  - "代码卡拉OK"
---

# Opus Video Skills

## 你是什么

你是两套 Opus 5.5 代码视频工作流的**选型与接入导航**。完整模板、渲染器、示例与脚本在上游，本目录只收录浓缩规范和预览。

- 上游：https://github.com/tuzhechen2005/opus-video-skills
- 制作与 QA 合同：[references/production.md](references/production.md)
- `painted-animation`：p5.js + p5.brush，水彩/水墨角色短片、MV、歌词视频与循环动画。
- `kinetic-reel`：Canvas 2D + three.js/WebGL，动态排版、作品集、产品/片头 Reel 与合成配乐。

## 支持的内容/类型

| 用户需求 | 选择 | 不适用的方向 |
|---|---|---|
| 角色表演、绘本、手绘 MV、逐字歌词 | `painted-animation` | 大量正文排版、数据仪表、真实 3D |
| 作品集、项目集、产品宣传、强节奏片头 | `kinetic-reel` | 柔软角色演技、水彩材质、长对白剧情 |
| 只要其中一种风格 | 仅安装对应 Skill | 不需要为了另一个风格安装整套项目 |

## 核心工作流

### Step 1 — 确认 brief 与上游环境

确认主题、时长、比例、重点内容、事实来源、语言与已有素材。歌词视频需要歌曲文件和 LRC；作品集需要真实项目材料与篇幅分配。用户已授权直接创作时，不必反复追问可选细节。

安装上游插件（可按需只装一个）：

```bash
/plugin marketplace add tuzhechen2005/opus-video-skills
/plugin install painted-animation@opus-video-skills
/plugin install kinetic-reel@opus-video-skills
```

需要 Node.js、Google Chrome、FFmpeg；仅 `painted-animation` 的速度检测额外需要 Python 3 + numpy。按上游所选 Skill 的脚手架创建工程，并读取其完整指南；本目录不复制 `template/`、`render.mjs` 或示例工程。

### Step 2 — 先写故事板

在工程内建立 `STORYBOARD.md`：时长预算、视觉母题、统一线索、每镜头机制/事件、转场和声音。角色片增加情绪弧线与关键姿势；Reel 增加事实来源、章节比例与 HUD 信息层级。

除非用户明确说直接制作，先让用户对故事板反馈。不要把故事板当成一堆“文字出现”的镜头：手绘片每镜要有事件，Reel 每镜要有证明内容的视觉机制。

### Step 3 — 逐帧构建与声音同步

- 每帧是时间 `t` 的纯函数，整帧可独立、乱序渲染。禁止墙钟、未播种随机数、计时器和跨帧状态。
- 手绘片：每场景一个 IIFE，先关键姿势再补动作；使用 p5.brush 绘制语言，保持角色与材质一致。
- Reel：`cues.js` 统一场景开始、节拍、章节与总时长；每个 shot 重画背景、WebGL 层、2D 字体/图形与 HUD。配乐从同一时间数据生成。
- 音乐、歌词、音效和画面读取同一时间数据；音效对齐实际瞬态，不只按 BPM 猜。合成音频也要做响度与峰值检查。

### Step 4 — 渲染审查后导出

每镜头至少一张 contact sheet；关键动作/转场加时间带；承载剧情的表情或密集排版加全分辨率裁切。实际打开图片检查，修复后重渲。

短视频可单进程；长视频并行逐帧渲染、可恢复，再由 FFmpeg 编码。音频单独修改时优先重混/复用已验证画面，不无意义重渲全片。最终解码 MP4 再检查接缝、字幕、空帧、音画同步、分辨率、时长与音频。

## 风格硬约束

### painted-animation

- 水彩/水墨视觉使用 `paint()`、`inkLine()` 等笔刷语言，不退回普通 p5 几何填充；平面 2D，不用 3D 投影模拟转身。
- 默认不用画面文字讲故事；逐字卡拉 OK 与少量拟声字是例外。
- 每个镜头有事件和因果，观众一次只接收一个重点；角色不能只是静止摆件。
- 镜头接缝都要设计转场；动作有预备、跟随与合理的接触关系。

### kinetic-reel

- 字体是主角，视觉机制证明标题，不用大段说明文字替代演示。
- 章节时长按 brief 分配，核心章节不过度挤占其他内容；剪辑、字形与计数对齐 `hits`。
- 事实数字来自用户材料；示意 ID、样例回答、结构图等明确标记 `SCHEMATIC`，不编造指标或临床效果。
- 转场优先形状/视觉连续性；声音服务结构，避免每个切点都堆刺激 whoosh。

## 来源与许可

上游 MIT；`painted-animation` 引擎/指南及 `kinetic-reel` 渲染器包含 John Heibel 的 [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) 派生内容，复用时保留其版权与 MIT 说明。p5.js、p5.brush、three.js、Puppeteer、FFmpeg、字体、歌曲和用户素材分别适用各自许可。
