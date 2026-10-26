---
name: code-mv-render
description: 代码渲染 MV / 数据纪录片的确定性工程库——帧 = f(时间)，浏览器预览与离线导出逐帧一致。收录两支开源音乐视频参考工程（world.execute(me); 的 Canvas2D 三画面 + pdoom 的 three.js 逐字卡拉 OK），以及本库自建并已导出的《CVE 编号破十万》90 秒数据纪录片实现：镜头模型、15 种入场转场、字体/遮罩动效、纸底三墨风格、口播字幕时间轴、无头浏览器录制与质检。只要用户提到：代码渲染 MV、歌词 MV、音乐视频生成、MV 渲染工程、world.execute(me)、pdoom、卡拉 OK 排版、数据纪录片、口播视频、新闻数据动画、把文案做成同步动画视频、确定性 Canvas 视频——就用本 Skill。与 video-shot-demos / swiss-shot-demos 互补：那些产出分镜演示页，本 Skill 面向整片可导出的视频工程。
version: "0.3.0"
triggers:
  - "代码渲染 MV"
  - "歌词 MV"
  - "音乐视频"
  - "MV 渲染工程"
  - "world.execute(me)"
  - "pdoom"
  - "卡拉OK排版"
  - "code-mv-render"
  - "数据纪录片"
  - "口播视频"
  - "新闻数据动画"
  - "确定性动画"
---

# 代码渲染 MV 工程库（两支上游 + 一套自建实现）

本 Skill 不生成单页演示，而是一座**"整片视频渲染工程"参考库**：收录两支开源音乐视频工程，外加本库自建、已经导出成片的《CVE 编号破十万》数据纪录片实现。它们共用同一条底层原理——**每一帧只是时间的函数**（`frame = renderFrame(t)`），因此浏览器里的实时预览与离线导出的成片逐帧一致，可反复复现、可精确质检。要做同步视频时，从这里选最贴近的工程去 fork / 改编，而不是从零搭渲染管线。

## 你是什么

- 面向"**整片、带音轨或口播、逐帧确定**"的视频（MV / 歌词视频 / 数据纪录片 / 生成式视觉），不是分镜演示页。
- 提供的不只是参考工程，而是**可执行的方法论 + 模板**：镜头模型、转场库、运动语法、时间系统、导出与质检。
- 与 `video-shot-demos` / `swiss-shot-demos` 的边界：那两者是"一镜一 HTML"的演示片段；本 Skill 管的是**从时间轴到成片的整条工程链**（分析 → 时间线 → 镜头 → 预览 → 导出 → 质检）。

## 三支参考工程

| | `world-execute-me-lyric-mv` | `pdoom-video` | **本库自建：CVE 编号破十万** |
|---|---|---|---|
| 类型 | 歌词 MV（对话叙事） | 生成式 MV（逐字卡拉 OK） | 数据纪录片（口播字幕驱动） |
| 画面技术 | Canvas 2D + WebGL2 | three.js + TypeScript | Canvas 2D，单文件 HTML |
| 画面语言 | 聊天**界面** / 三墨**版画** / **代码** | 每片一个 GPU 场景 | **数据** / **界面** / **版画** 三型交替 |
| 状态系统 | 颜色 = 状态（off/on/warm/error/ash/dead） | 节拍吸附场景窗口 | 语义色：中性 / 里程碑 / 风险 |
| 同步依据 | 行级歌词时间 + cues 拍点 | Demucs + CTC × Whisper 词级时间 | 口播字幕段 + 句内事件时间 |
| 导出 | 无头 Chrome 逐帧 → ffmpeg | 无头 Chrome → WebSocket 帧 → ffmpeg | 无头 Edge + `captureStream` → WebM → ffmpeg |
| 亮点 | 成品级闪光安全、缩图表回归 | 块级自适应子帧运动模糊 | 单文件、零依赖、可直接改文案复用 |
| 许可 | 代码 MIT；剪影 CC BY-NC-SA；歌曲不在仓库 | 代码 MIT；歌曲不属 MIT | 本库自建，可自由改写 |

## 动效框架（从原片抽取，已落到本库模板）

完整参数见 `references/motion-system.md`。核心是五层：

### 1. 镜头模型

```js
{ id, at, lines, moment, layout, palette, enter, camera, render(ctx,t,f,u) }
```

- `moment` 一句话说清"这是哪一刻"，写不出来就是废镜头。
- 切点必须落在拍 / 半拍 / 小节线；口播视频落在句子边界或关键词上。
- `render` 是纯函数；`camera` 返回 `{x,y,zoom,rot}`。
- 镜头内部三拍：入场（0.25–0.8s）→ 展开 → 由事件结束。

### 2. 十五种入场转场

`cut / fade / glitch / scan / circle / diag / grid / zoom / shatter / dissolve / winclose / winpop / push / slices / flashcut`

按语义选：`scan` = 打印/写入，`grid` = 参数/数据，`winpop` = 记录页/弹窗，`glitch` = 异常，`zoom` = 深入，`circle` = 聚焦，`shatter` = 推翻，`flashcut` = 大段落切换。支持 `align: start|end|center` 与 `flash`。一个视频最多用 4–6 种。

Canvas 2D 版已实现：`templates/transitions2d.js`（15 种，零依赖）+ `templates/transitions-demo.html`（逐段预览）。

### 3. 镜头内运动六条

1. 缓动优先（机械计数/扫描线除外）。
2. 错峰：主体 0ms，附属 +60–120ms，第三层 +180–300ms。
3. 二次运动：落定后 1–2% 过冲或轻微回弹。
4. 快速运动必须带模糊；静止背景不参与重绘。
5. 禁止只做透明度；淡入必须伴随位移/遮罩/印刷揭示。
6. 闪入要整块（1–2 帧），前面不加白场。

### 4. 字体与遮罩

`slam`（砸下）、`typed`（逐字）、`onPath`（沿路径）、`wall`（字墙）、`sliced`（切条）、`scramble`（乱码收敛）、`limp`（竖带压扁下坠）、`masked`（用字/形状当窗口）。中文按"字"计时，标点不单独占拍。

### 5. 时间与后期

- 音乐：130 BPM 网格（beat 0 = 0.344s，1 beat = 0.4615s）。
- 口播：字幕段为主网格，句内关键词为次网格；非网格时间集中在一个 `CUES` 表。
- 时间特效：掉帧 `floor(t*12)/12`、重放、插入镜头、撕裂保持 6 帧、余像 `t-0.05`、白场 11–16 帧。
- 后期默认全关；只在事件上开 `glow / bloomAll / rays / streak / zoomBlur`，镜头结束回 0。

## Opus 导演与审查工作流

在既有引擎之外，补入三套 Opus 项目的方法论，不重复建设渲染器：

| 规范 | 用在什么时候 | 核心增量 |
|---|---|---|
| `references/opus-directing.md` | 从想法/参考片开始制作 | brief → 声音来源与分析 → 视觉方向 → director’s treatment → 多比例逐帧交付 |
| `references/motion-design-production.md` | 产品发布、品牌 Reel、UI morph | 真实事实/品牌输入、beat map、共享形态、声音能量与真实峰值、设计审查 |
| `references/visual-review-loop.md` | 每次改动视觉/时间与交付前 | contact sheet → 时间带 → 1:1 裁切 → 修复重渲 → MP4 解码帧与音频复核 |

执行顺序：先确认 brief 与声音，再提交 treatment/镜头表；用户明确授权直接制作时可不停下等审批，但仍要留存方案。先做最难镜头与关键静帧，通过后再铺满全片。画面与声音读取同一时间数据，音效对齐实际波形瞬态。

## 核心工作流

### 第 0 步 · 选型

- **对话 / 叙事 / 强概念** → `world-execute-me-lyric-mv` 路线（三画面 + 颜色状态 + 版画）。
- **抽象文本 / 逐字排版 / 需要 3D 光** → `pdoom-video` 路线。
- **数据 / 新闻 / 口播 / 工具链** → 本库自建路线（数据 / 界面 / 版画 + 字幕时间轴）。模板：`templates/mv-engine.html`。

### 第 1 步 · 素材与许可清障

两支上游都**不含歌曲与歌词**，必须自备；发布前确认许可（剪影 CC BY-NC-SA、歌曲遵循原作者指引）。自建路线无此限制，但字体与数据来源仍需注明。

### 第 2 步 · 时间轴

先写 `SHOTS`（分镜）与 `SUBS`（字幕/歌词），再写画面。**不要先做画面再对时间。**
所有切点、关键词落定、印章、差额出现，都要在表里能查到。

### 第 3 步 · 镜头

从这些配方里选：计数器 / 对账双柱 / 纸底版画 / 记录页 / 时间线 / 收束三行。
每种配方在 `references/style-cve-100k.md` 里有完整字号、坐标、时长。

### 第 4 步 · 预览与逐帧质检

```bash
# 关键帧静帧（改完必看）
node templates/qa-stills.mjs --page examples/cve-100k/demo.html --times 13.6,24.6,46,59.5,79,86.5 --out ./qa

# 每 5 秒扫一遍
node templates/qa-stills.mjs --page examples/cve-100k/demo.html --range 0..90 --step 5 --out ./qa_all
```

看：切后第一帧、关键词落定帧、事件帧、首尾帧；数字与字幕是否同步。

### 第 5 步 · 导出

```bash
# 无头 Edge 录制 + 直接转 MP4
node templates/export-video.mjs --page examples/cve-100k/demo.html --out ./out --name cve-demo --mp4
```

页面内也可直接点「导出 WebM」。导出后 `ffprobe` 校验 1920×1080 / 60fps / 时长。

## 从零做一支（命令级流程）

```
1. 复制 templates/mv-engine.html → my-film.html
2. 改 DUR / SHOTS / SUBS，先让字对齐时间
3. 复制镜头配方，替换数字与文案（一屏一个英雄数字）
4. 加颜色事件：只在里程碑/风险发生的那一帧切换
5. 逐帧截图，修排版（差额标注、字幕遮挡、标签重叠）
6. node templates/export-video.mjs ... --mp4
```

## 可复用要点

- **预览与导出同源**：同一个 `renderFrame(t)`，杜绝"预览好看导出差"。
- **颜色 = 状态**：调色板是语义不是风格；观众靠颜色跨镜追踪同一实体。
- **纸底是呼吸**：每 3–4 个暗底镜头插一个纸底定义页。
- **数据同步**：字幕说最终值时，数字必须已到位。
- **闪光预算**：任意 1 秒大面积亮度往返 ≤3 次；红色闪烁独立统计。
- **缩图表/静帧回归**：改共用文件前后各出一组静帧，逐格比对。
- **单文件优先**：无构建、无网络、双击即播，方便交付与归档。

## 红线

- **歌曲与歌词不在上游仓库**、也不在代码许可内：不得把原曲/原词一并打包分发。
- 角色剪影及含剪影画面为 **CC BY-NC-SA 4.0**：署名 + 禁商用 + 同许可再分享。
- 上游成片均标注"**含 AI 生成内容**"；发布时须显式声明。
- 上游均为**非官方同人作品**，不得暗示背书。
- 数据类内容：编号 ≠ 发布数；估算必须标注；CNA 评分 ≠ NVD 评分。
- 不要把平台特定实现（Windows 路径、ffmpeg-static）当作可移植承诺。

## Token 纪律

- **禁止通读**上游源码（`src/engine/`、`src/scenes/`、`app/src/` 都是大块）。
- 方法论优先取本 Skill 的 `references/`，不要现场读源码反推。
- 需要看实现时，先 `grep` 定位，再按行号窗口读 ≤80 行。
- 本库自建实现只有 `examples/cve-100k/demo.html` 一个文件，可以整读（约 1000 行）。

## 目录结构

```
code-mv-render/
├── SKILL.md / README.md
├── references/
│   ├── world-execute-spec.md       上游歌词 MV 规范摘录
│   ├── pdoom-spec.md               上游生成式 MV 规范摘录
│   ├── motion-system.md            ★ 动效框架：镜头模型 / 15 转场 / 运动语法 / 时间特效 / 质检
│   ├── deterministic-engine.md     ★ 确定性 Canvas 实现规范：renderFrame / 时间表 / 录制 / 导出 / 坑
│   ├── opus-directing.md           ★ Opus 导演流程：brief / 声音 / treatment / 多比例交付
│   ├── motion-design-production.md ★ 品牌动态设计：事实约束 / beat map / 共享形态 / 声音
│   ├── visual-review-loop.md       ★ 静帧审查：sheet / 时间带 / 裁切 / MP4 与音频复核
│   ├── style-cve-100k.md           ★ 风格系统：调色板 / 字体 / 版式 / 组件配方 / 数据红线
│   └── case-cve-100k.md            ★ 案例：90 秒镜头表、参数、扩展成 23 分钟的路径
├── templates/
│   ├── mv-engine.html              最小可运行引擎（3 镜头 + 播放器 + 录制）
│   ├── transitions2d.js            15 种入场转场的 Canvas 2D 移植
│   ├── transitions-demo.html       逐段预览 15 种转场
│   ├── export-video.mjs            无头 Edge 录制 → WebM → MP4
│   └── qa-stills.mjs               关键帧静帧质检
├── examples/cve-100k/demo.html     完整 90 秒实现（单文件）
└── assets/preview/                 上游与自建案例截帧
```

## 上游与本地案例

- `world-execute-me-lyric-mv` — github.com/Nyankomintsu/world-execute-me-lyric-mv （Mili《world.execute(me);》歌词 MV，v4）
- `pdoom-video` — github.com/mexicat/pdoom-video （"I'm Upping My P(doom)" 生成式 MV）
- 自建案例《CVE 编号破十万》— 内容源为本机 `【AI城】/CVE编号破十万` 的 v3 方案与调查笔记；90 秒演示成片 1920×1080 / 60fps。
- `opus-js-animations` — github.com/klsoen/opus-js-animations （MIT）：导演前置、纯 `seek(t)`、静帧与多比例交付工作流。
- `claude-motion-design` — github.com/howseen-ai/claude-motion-design （MIT）：品牌动态设计、真实数据、beat map、声音与 critic 工作流。
- `claude-motion` — github.com/whaleyxbt/claude-motion （MIT）：contact sheet / 时间带 / 1:1 裁切的 review loop 与音频验收参考。
