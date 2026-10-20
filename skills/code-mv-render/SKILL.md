---
name: code-mv-render
description: 代码渲染 MV 工程库——两支"确定性音乐视频"（帧 = f(歌曲时间)，浏览器预览与离线导出逐帧一致）开源参考工程的选型、复现与改编指南：歌词 MV（world.execute(me);：Canvas2D+WebGL2，聊天界面 / 三墨版画 / 代码三种画面，颜色=状态）+ 生成式 3D MV（pdoom：three.js 逐字卡拉 OK 排版 + 子帧运动模糊 + 节拍吸附时间线）。只要用户提到：代码渲染 MV、歌词 MV、音乐视频生成、MV 渲染工程、world.execute(me)、pdoom、"帧由歌曲时间决定"的视频、逐字卡拉 OK 排版、把口播 / 歌词做成同步动画 MV——就用本 Skill。与 video-shot-demos / swiss-shot-demos 互补：那些产出分镜演示页，本 Skill 面向整片可导出的 MV 工程。
version: "0.1.0"
triggers:
  - "代码渲染 MV"
  - "歌词 MV"
  - "音乐视频"
  - "MV 渲染工程"
  - "world.execute(me)"
  - "pdoom"
  - "卡拉OK排版"
  - "code-mv-render"
---

# 代码渲染 MV 工程库（两支持续确定性音乐视频参考工程）

本 Skill 不生成单页演示，而是一座**"整片 MV 渲染工程"参考库**：收录两支开源音乐视频工程，它们共用同一条底层原理——**每一帧只是歌曲时间的函数**（`frame = renderFrame(t)`），因此浏览器里的实时预览与离线导出的成片逐帧一致，可反复复现、可精确质检。要做一个同步音乐视频时，从这里选一支最贴近的工程去 fork / 改编，而不是从零搭渲染管线。

## 你是什么

- 面向"**整片、带音轨、逐帧确定**"的音乐视频（MV / 歌词视频 / 生成式视觉），不是分镜演示页。
- 提供的不是模板代码，而是**两支已验证的参考工程 + 它们的渲染方法论**：画面法则、节拍对齐、光效与运动模糊、闪光安全、导出质检。
- 与 `video-shot-demos` / `swiss-shot-demos` 的边界：那两者是"一镜一 HTML"的演示片段；本 Skill 管的是**从音轨到成片的整条工程链**（分析 → 时间线 → 场景 → 预览 → 导出）。

## 两支参考工程

| | `world-execute-me-lyric-mv` | `pdoom-video` |
|---|---|---|
| 类型 | 歌词 MV（对话叙事） | 生成式 MV（逐字卡拉 OK 排版） |
| 画面技术 | Canvas 2D + WebGL2（浏览器绘制） | three.js + TypeScript（GPU 场景） |
| 画面语言 | 三种：聊天**界面** / 暗暖纸底三墨**版画** / **代码**（EXECUTION 段） | 每片一个场景模块：线性线画、纸表单、霓虹屏、燃烧引线… |
| 状态系统 | **颜色 = 状态**（off/on/warm/error/errWarm/ash/dead） | 节拍吸附的场景窗口 + 逐字/逐音节卡点 |
| 反复现性 | `renderFrame(t)`，PRNG 种子化，不读墙上时钟 | 每帧确定性函数；预览 = 导出 |
| 音画同步 | `data/lyric_timing.json` 行级时间 + `cues.js` 拍点；LRC 自动填词 | Demucs 分轨 + CTC 强制对齐 × Whisper 交叉校验；词级时间 |
| 导出 | 无头 Chrome 逐帧 → ffmpeg（1080p60 / 4K60） | 无头 Chrome → WebSocket 原始帧 → ffmpeg（1080p60 / 4K60，子帧运动模糊） |
| 亮点机制 | 成品级**闪光安全**（WCAG 2.3.1 自检）、误差比对缩图表 | **按块自适应子帧采样**的运动模糊、双 Chrome + 单 ffmpeg 管线 |
| 运行环境 | Node.js 20+，Windows 11（Chrome/Edge） | bun + Vite，Chrome + ffmpeg(libx264)；分析需 uv/Python |
| 许可 | 代码/文档 MIT；角色剪影 CC BY-NC-SA 4.0；**歌曲歌词不在仓库** | 代码 MIT；字体 OFL；**歌曲歌词不属 MIT** |

## 共同原理（做 MV 的六条铁律）

1. **确定性优先**：`renderFrame(t)` 只依赖时间，不读系统时钟、不留跨帧状态，随机数走种子化 PRNG。这样预览可拖动、导出可复现、出错可逐帧定位。
2. **时间基准唯一**：全片用"歌曲时间"（音轨起点 = 0）。片头警告页等前置内容放在负时间或整体 `preroll` 偏移，绝不移动任何拍点。
3. **一切卡在拍上**：歌词行、鼓点、单字/音节时间集中一张表；不在拍上的零散时间集中在单个 `cues` 文件里凭耳朵修。
4. **视觉状态由事件驱动**：颜色 / 材质只在"发生了什么"时改变（如颜色=状态），不做装饰性渐变。
5. **字体与图形按角色分工**：等宽体=系统、衬线体=叙事声、无衬线体=界面；图形先"具象成一个世界观"（版画 / 表单 / 线画），再谈排版。
6. **安全与质检内建**：任意一秒大面积亮度往返 ≤3 次（WCAG 2.3.1）、红色闪烁独立统计、导出后跑音画同步与单帧突跳自检。

## 核心工作流

### 第 0 步 · 选型

按内容气质二选一（也可混用两套方法论）：

- **对话 / 叙事 / 强概念**、想"用程式画出一个世界观" → `world-execute-me-lyric-mv` 路线（三画面 + 颜色状态 + 版画质感）。
- **抽象文本 / 反直觉句 / 需要 3D 空间与光**、以歌词排版为主角 → `pdoom-video` 路线（逐字卡拉 OK + GPU 场景 + 运动模糊）。

### 第 1 步 · 素材与许可清障（关键，先做）

**两支工程都不含歌曲与歌词**，必须自备：

- `world-execute-me-lyric-mv`：把原曲 WAV 与任意时间轴的 LRC/纯文本放进 `音頻&歌詞/`；`tools/fill_lyrics.mjs` 只要求"同样的词、同样的顺序"，会按片内时间表自动重排/重分行。
- `pdoom-video`：自带示例音轨与词级时间数据，换歌则需重跑 `analysis/`（Demucs + 对齐）。

**发布前先确认许可**：用上游源码渲染的成片含角色剪影 → 须署明 CC BY-NC-SA 4.0 且不得商用；只用提示词、画面自绘 → 无法定要求但请照格式注明出处；歌曲一律遵循原作者版权指引（个人、非商业、标注含 AI 生成内容）。

### 第 2 步 · 复现与对齐

`git clone` 目标工程 → 按其 README 装依赖（npm / bun）→ `npm run preview` 或 `bunx vite` 起实时预览。改歌词/节拍时只动**时间表与 cues 文件**，画面代码交给 `renderFrame(t)`。

### 第 3 步 · 预览 → 导出 → 质检

1. 浏览器预览逐段确认（两工程都支持按秒 seek、逐帧步进、场景跳转）。
2. 导出：`npm run export:preview` / `export:4k`（world-execute）或 `bun scripts/render.ts video --samples auto --shutter 0.2`（pdoom）。
3. 质检：跑闪光安全自检（`npm run check` / `tools/check_flash.py`）、音画同步偏移、单帧突跳；`world-execute` 另有改共用文件前后的缩图表逐格回归比对。

## 可复用要点（抽取给自建工程）

- **以"块级自适应采样"做运动模糊**：把画面切 32×32 块，静止块 12 采样、常规运镜 36、快速甩镜/爆闪 108–324，且某块收敛后跳过后续子帧——快物体压静止背景几乎不额外花销（pdoom 的 `--samples auto`）。
- **预览与导出同源**：预览器直接复用导出帧函数，杜绝"预览好看导出差"。
- **颜色 = 状态**的调色板设计：角色色（bg/panel/raised/line/text/sub/mute/me/meHot/meDim/err/errDim）随剧情事件切换，观众靠颜色跨页追踪同一实体。
- **成品级闪光预算**：写进 config 的 `maxFlash` / `flashRange` / `preroll`，导出脚本自动把警告页与警示文案生成到 README 与片头。
- **缩图表回归**：改动共用引擎前先出基准缩图表，改后逐格比对——没打算改的地方应当一格不差。

## 红线

- **歌曲与歌词不在仓库**、也不在代码许可内：不得把原曲/原词一并打包分发。
- 角色剪影及其所在画面为 **CC BY-NC-SA 4.0**：署名 + 禁商用 + 同许可再分享。
- 两支工程的成片均标注"**含 AI 生成内容**"：发布时须显式声明。
- 上游均为**非官方同人作品**，与权利人无关，不得暗示背书。
- 别把平台特定的实现（Windows 路径、`ffmpeg-static`）当作可移植承诺——跨平台需自行适配。

## Token 纪律

- **禁止通读**参考工程源码（`world-execute` 的 `src/engine/`、`src/scenes/` 与 pdoom 的 `app/src/` 都是大块源码）。
- 渲染方法论优先取本 Skill 的 `references/` 两份浓缩规范，不要现场读源码反推。
- 需要看某段实现时，先 `grep` 定位函数/文件名，再按行号窗口读 ≤80 行。

## 目录结构

```
code-mv-render/
├── SKILL.md / README.md              ← 本文件与人类文档
├── references/
│   ├── world-execute-spec.md         ← 歌词 MV 工程规范摘录（画面三型/颜色状态/版画/剪影/确定性/闪光安全/命令）
│   └── pdoom-spec.md                 ← 生成式 MV 工程规范摘录（引擎/场景 API/运动模糊采样/时间线/渲染管线/命令）
└── assets/preview/                   ← 预览截帧（cover + pdoom plates）
```

## 上游来源

- `world-execute-me-lyric-mv` — github.com/Nyankomintsu/world-execute-me-lyric-mv （Mili《world.execute(me);》歌词 MV，v4）
- `pdoom-video` — github.com/mexicat/pdoom-video （"I'm Upping My P(doom)" 生成式 MV）
