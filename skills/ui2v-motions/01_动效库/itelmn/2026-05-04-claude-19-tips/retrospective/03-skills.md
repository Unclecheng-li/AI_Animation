# 03 · 能力地图

> 项目开始时不会的、做完会的，过程怎么走的
> 权威参照系：`docs/OFFICIAL_DOCS_VALUE_INDEX.md`（HF 概念分层 + 评级）

---

## 1. HyperFrames 知识层 · 自评矩阵

按官方概念分层，标注"项目结束时的掌握档"+ 证据。

档位说明：
- **熟练** — 21/21 一致用，且有教训沉淀（不仅会用，理解陷阱）
- **基础** — 用过但有限，停在脚手架/脚本默认行为上
- **入门** — 见过/读过文档，未在项目里实操
- **未触及** — 项目内 0 痕迹

### 1.1 Concepts（概念层）

| 概念页 | 评级 | 项目档位 | 证据 |
|---|---|---|---|
| `concepts/compositions.md` | ⭐⭐ | **入门** | index.html → 21 chapter 单层引用，0 处嵌套 sub-composition，0 处 `data-variable-values` 传参 |
| `concepts/data-attributes.md` | ⭐⭐⭐ | **基础（缺一半）** | data-start / data-duration / data-track-index 100% 用，但 0 处相对时序（P1 教训） |
| `concepts/determinism.md` | ⭐ | **熟练** | 21/21 paused timeline，0 `Math.random` / `Date.now` / `fetch`（脚手架默认带 + CLAUDE.md 第 6 条强制） |
| `concepts/frame-adapters.md` | ✗ | **未触及** | 全片 100% GSAP，0 Lottie / 0 WAAPI / 0 CSS Animations / 0 Anime.js / 0 Three |

### 1.2 Reference（参考层）

| 参考页 | 评级 | 项目档位 | 证据 |
|---|---|---|---|
| `reference/html-schema.md` | ⭐⭐⭐ | **基础** | clip 模板（21/21 一致 root div + window.__timelines）已是事实标准，但 7 条 Timeline Contract 没系统对照过；`data-variable-values` 0 用 |

### 1.3 Guides（指南层）

| 指南页 | 评级 | 项目档位 | 证据 |
|---|---|---|---|
| `guides/gsap-animation.md` | ⭐⭐ | **熟练** | 21/21 一致 paused timeline + pad pattern (`tl.to({}, { duration: SLOT }, 0)`)；ease 4 件套（power3.out / power2.out / sine.inOut / power2.in）+ stagger random 模式自然形成；含 transform 接管教训（P10 cc599ad） |
| `guides/common-mistakes.md` | ⭐⭐ | **基础** | 踩过 immediateRender（P9 a021199）+ polaroid 字号溢出（P7 f2f0de1）+ chrome-text inline-block stacking（P13 96a0ecd），但**没系统读过 8 条 mistake 列表**，是事后撞墙才学到 |
| `guides/prompting.md` | ⭐⭐⭐ | **未触及** | Caption Tone 表（Hype/Tutorial/Storytelling）+ smooth/snappy/bouncy → ease 词汇表 0 用。Tip 1 V3→V4 教训（P2）正是因为没用 prompting 框架 |
| `guides/rendering.md` | ⭐⭐⭐ | **基础** | `package.json` 的 `render` 脚本无 `--quality` 参数 → 默认值未明示；Docker 模式 0 用；MOV ProRes 4444 / WebM VP9 alpha 0 用；项目周期内**未渲染过最终 mp4**（renders/ 仅有 work 目录） |
| `guides/performance.md` | ⭐⭐ | **基础** | 21/21 用 blur 14px 入场，但 backdrop-filter 上限 2-3 层规则未明显遵守；图片尺寸未做 ≤2× canvas 检查 |
| `guides/timeline-editing.md` | ⭐⭐ | **基础** | 21/21 用 `track-index="1"` 单 row；overlay/caption 0 用（全片无字幕） |
| `guides/video-editor-cheatsheet.md` | ⭐⭐⭐ | **未触及** | 手动 DOM 微调 → Agent 清理 diff 循环 0 用；commit history 全是 Agent 写完整文件再 git diff |
| `guides/hyperframes-vs-remotion.md` | ⭐⭐⭐ | **未触及** | 哲学层（HTML+GSAP 比 React 更适合 AI 写视频）未读未消化 |
| `guides/troubleshooting.md` | ⭐ | **入门** | `npx hyperframes doctor` 0 用；preview 不刷新等 0 触发 |
| `guides/claude-design.md` | ⭐ | **未触及** | claude.ai/design 路径未走 |
| `guides/website-to-video.md` | ⭐ | **未触及** | URL→视频管线非本项目场景 |

### 1.4 Packages（包层）

| 包页 | 评级 | 项目档位 | 证据 |
|---|---|---|---|
| `packages/cli.md` | ⭐⭐⭐ | **基础** | `lint` / `validate` / `inspect` 在 `npm run check` 内调用（package.json 第 6 行），`preview` 用过，`render` 未实跑；**`tts` / `capture` / `transcribe` / `snapshot` / `doctor` 0 用** |
| `packages/engine.md` | ⭐ | **入门** | seek-and-capture 原理读过；质量预设 / fps 选择未实操 |
| `packages/producer.md` | ⭐⭐ | **未触及** | WebM VP9 alpha / HDR / 外部资产 auto-copy 0 用 |
| `packages/studio.md` | ⭐ | **入门** | `npx hyperframes preview` 用过；Studio 编辑器未深用（move/trim/stack 操作） |
| `packages/player.md` | ✗ | **未触及** | YouTube 视频不需嵌入 Web Component |
| `packages/core.md` | ✗ | **未触及** | 不写工具 |

### 1.5 Catalog（零件层）

| 零件 | 评级 | 项目档位 | 证据 |
|---|---|---|---|
| `catalog/blocks/whip-pan` | ⭐⭐⭐ | **入门** | 脚手架带入 `compositions/whip-pan.html`，全片 0 引用；自制版 `theme.css:677-693 .whip-streak` |
| `catalog/blocks/flash-through-white` | ⭐⭐⭐ | **入门** | 脚手架带入，全片 0 引用 |
| `catalog/blocks/cinematic-zoom` | ⭐⭐⭐ | **入门** | 脚手架带入，全片 0 引用 |
| `catalog/blocks/logo-outro` | ⭐⭐ | **入门** | 脚手架带入，**`20-outro.html` 是空 placeholder（P5）**，明明 catalog 现成 6s 片尾未取用 |
| `catalog/blocks/macos-notification` | ⭐ | **入门** | 脚手架带入，Tip 12 自制居中通知 banner 替代 |
| `catalog/blocks/flowchart` | ⭐ | **入门** | 脚手架带入，Tip 18 自制顾问→worker 派发图 |
| `catalog/blocks/ui-3d-reveal` | ⭐⭐ | **未触及** | 13s 透视 3D UI 入场未用 |
| `catalog/blocks/data-chart` | ⭐ | **未触及** | 数据可视化无场景 |
| `catalog/components/grain-overlay` | ⭐⭐ | **基础** | 自制版 `.global-grain` (theme.css:178-187) |
| `catalog/components/shimmer-sweep` | ⭐⭐ | **基础** | 自制版 `.chrome-text` 整字渐变（与 shimmer-sweep 不同实现，但功能重叠） |

---

## 2. 还模糊的点（诚实标出）

| 点 | 模糊在哪 |
|---|---|
| **相对时序写法** | 知道 `data-start="prev + 0.5"` 存在，但**不确定 prev 用 composition-id 还是 sub-composition root id**；不确定能不能跨 chapter 引用（如 chapter 5 内的 cue 引用 chapter 4 的 cue 名）（待查 `reference/html-schema.md`） |
| **Timeline Contract 7 条** | 知道有 7 条但**没系统读过完整列表**，目前只在被坑后才知道某条（如 P10 的 transform 接管） |
| **`data-variable-values` 传参机制** | 不知道**怎么读**——索引 269 行说"脚本手动读取并应用"，但具体 API 不明（待查） |
| **嵌套 composition 时间轴叠加** | 父 composition 时间轴怎么和嵌套 sub-comp 内部时间轴对齐？嵌套 sub-comp 的 `data-start="0"` 是相对父 clip 起点还是绝对？（待查 `concepts/compositions.md`） |
| **Frame Adapter 注册** | 整个机制不懂，但因为用 GSAP 也没必要现在懂 |
| **`tts` 命令的语音引擎** | Kokoro-82M 是什么、有几个声音、中文支持如何（待实操） |
| **`capture` 抓的视觉 token 是什么格式** | 抓出来怎么喂给 `prompting.md` 的词汇表（待实操） |
| **Docker 渲染的字体一致性范围** | 系统字体 vs Web font 在 Docker 内行为（待实操） |
| **WebM VP9 alpha 在 Premiere/DaVinci 的兼容性** | 索引说 ProRes 4444 是行业标准，WebM 是网页/AE 用，但**DaVinci 21 是否支持 WebM alpha** 未知 |
| **`backdrop-filter` 性能警戒线下行为** | 索引说 2-3 层 blur / 单帧 200ms 警戒，但**项目跑 preview 时具体什么表现 = 卡** 没量化记录 |

---

## 3. Claude Code 协作开窍点（按时间序）

| commit | 时间 | 开窍点 | 之前 vs 之后 |
|---|---|---|---|
| `a4c5843` | Day 1 17:02 | **从"先想视觉"切到"视觉跟语义走"** | V3 commit body 自述："V3 严重问题：先想视觉效果，再把效果塞到 32 秒里 → 完全脱离口播节奏"。V4 起每个 commit body 自带"时段→口播→视觉"映射表，prompt 内自然带 SRT 时间码 |
| `9757bb8` | Day 1 17:09（V4 后 7 分钟） | **基于用户反馈做大重构** | V5 commit body 列了 "V4 用户反馈 3 个问题"，每条问题有具体修法。开始把"用户反馈→commit body 自查表"作为标配格式 |
| `f36f96e` | Day 1 17:12（V5 后 3 分钟） | **commit body 写"原因 + 修法"双段** | 不只描述 what 改了什么，还描述 why 之前错了。如："top:50% + translate(-50%,-50%) 依赖元素 height 计算，但 cc-window grid layout 的实际渲染高度比预期大 ~50px" |
| `4bade5b` | Day 1 19:08（Tip 3） | **callback 历史 chapter 视觉的明确意图** | Tip 3 commit body："callback: reuses Tip 1's `.cc-window` + `.cc-statusline` (model/ctx/cost)" → 跨 chapter 视觉复用从此刻起被刻意标注 |
| `049ac0a` | Day 1 19:55（Tip 4） | **callback 关联词进 commit message 标题** | "Tip 4 plan mode V2 — dual-card layout + 2x mode-toggle hero transition" — 第一次主动把 V2 / 2x 等版本/比例数字明示在 message |
| `b5ed96b` | Day 1 20:30（Tip 6） | **callback 历史 Tip 视觉作为叙事手法** | Tip 6 commit body："cue B: ‖ plan mode on · (Tip 4 callback) + dual-card layout" → mode-toggle-bar 在 Tip 4/6/7 三处复用，"叙事一致性"成显式设计目标 |
| `cc599ad` | Day 1 22:53（Tip 10）"重写" | **commit body 自带技术注释 + 第一次大段重写** | "替换早期占位实现"+ 7 cue 详细分解 + 末尾"修复 GSAP transform 接管陷阱"独立段落记录技术教训 |
| `b034b42` | Day 2 11:53（Tip 14） | **6 场景 stage（1920×6480）模板** | 第一次把"长视频用 camera pan 多场景"明示为模板（Tip 18 后续直接用同套） |
| `9cf40e3` `2c5a82b` `2d69585` | Day 2 15:36-15:45 | **9 分钟内：推全 → 撤销 → 单点 sample 方法论转向** | 推全提交 → 4 分钟后 Revert → 5 分钟后 commit body 自述"推全 18 招前的模板"。**第一次承认推全前必须单点 sample**，并写进 commit body 作未来引用 |
| `6f81556` | Day 2 13:27（Tip 18 fix） | **联网 2 源交叉验证内容真实性** | commit body："联网核实 (Tavily 2 源交叉验证 heyuan110.com / barronfolly.com)" — **第一次把内容审核流程写进 commit body**，与 CLAUDE.md "证据协议"对齐 |
| `f2f0de1` | Day 2 16:21 | **跨章节批量打磨意识** | Tip 1+Tip 2 同 commit 修，message："Tip 1 视觉重做对齐口播 + Tip 2 polaroid 溢出修复"。从"一个 commit 一个 chapter"转为"一个 commit 一个主题"（视觉/口播对齐 = 主题，跨多个 chapter） |
| `96a0ecd` | Day 2 19:52（Hook V10） | **commit body 内嵌 V8a/V9/V10 多版本说明** | 一个 commit 内承载 hook 多次内迭代（V8a 修字体可见性 → V10 删 char span），实质上 hook 一个文件的 6 个版本只占 2 个 commit。"内迭代写 body 里" 成为新模式 |

---

## 4. 没用上但能提效的能力（来自 OFFICIAL_DOCS_VALUE_INDEX ⭐⭐⭐ + ⭐⭐）

按"提效杠杆"从大到小排序。仅列项目从未碰过、且评级 ⭐⭐ 以上的能力。

### 4.1 一线杠杆（⭐⭐⭐ + 直接省时间）

| 能力 | 来源页 | 提效在哪 | 上手成本 |
|---|---|---|---|
| **相对时序 `data-start="prev + N"`** | `concepts/data-attributes.md` ⭐⭐⭐ + `reference/html-schema.md` ⭐⭐⭐ | 改任意 chapter 时长，下游 21 段 offset 自动顺延，省手算 | 低：改 `index.html` 21 行即可 |
| **`tts` 本地配音** | `packages/cli.md` ⭐⭐⭐ | 不用录配音也能预演节奏 + 接 `transcribe` 自动生成 SRT，开始视觉前节奏感更准 | 中：需要确认 Kokoro-82M 中文质量 |
| **`transcribe` 自动逐字时间戳** | `packages/cli.md` ⭐⭐⭐ | 把 SRT 直接转成"时段·语义·秒数"三列表（P2 修法），免手切 | 低：单命令 |
| **`inspect` 逐帧文字溢出扫描** | `packages/cli.md` ⭐⭐⭐ | 渲染前自动抓 polaroid 字号溢出（P7）、cc-window 文字裁切等 | 低：`npm run check` 已含，需要看输出 |
| **`flash-through-white` 幕间大转场** | `catalog/blocks` ⭐⭐⭐ | chapter 间过渡（P4），30 秒装好 | 低：`npx hyperframes add flash-through-white` |
| **`whip-pan` chapter 间默认转场** | `catalog/blocks` ⭐⭐⭐ | 同上 | 低 |
| **`cinematic-zoom` 文字穿越 3D** | `catalog/blocks` ⭐⭐⭐ | 章节切换时配合大字 hero 出现（如 hook→Tip 1） | 低 |
| **prompting 词汇表（smooth/snappy/bouncy）** | `guides/prompting.md` ⭐⭐⭐ | 写 prompt 不再说"动画好看一点"，直接说 "snappy entrance + smooth hold"，agent 出稿质量阶跃 | 低：背 1 张表 |
| **Caption Tone 表（Hype/Tutorial/Storytelling）** | `guides/prompting.md` ⭐⭐⭐ | 19 招属 Tutorial 调，对应字体+尺寸+动画风格表，避免 V3 那种风格漂移 | 低 |
| **手动 DOM 编辑 → Agent 清理** | `guides/video-editor-cheatsheet.md` ⭐⭐⭐ | 最后 10% 的位置/字号微调自己拖更快，再让 Agent 清理 diff（防止 inline style 失控） | 中：要敢手动改 |
| **透明 MOV ProRes 4444 / WebM VP9 alpha** | `guides/rendering.md` ⭐⭐⭐ + `packages/producer.md` ⭐⭐ | 录屏铺底 + overlay 工作流（达芬奇用 MOV，AE/网页用 WebM）。19 招纯演示无录屏没用上，但下次有"教程内带录屏 demo"时是必需 | 中 |
| **Docker 渲染模式** | `guides/rendering.md` ⭐⭐⭐ | preview/render 视觉差异时锁 Chrome+字体；跨机器渲染一致性 | 中：需 Docker 装好 |

### 4.2 二线杠杆（⭐⭐ + 中长期投入）

| 能力 | 来源页 | 提效在哪 | 上手成本 |
|---|---|---|---|
| **`logo-outro` 直接替换 placeholder** | `catalog/blocks` ⭐⭐ | P5：25s 空 outro 立刻能补 6s 模板 | 极低：1 行 |
| **`data-variable-values` 传参** | `reference/html-schema.md` ⭐⭐⭐ + `concepts/compositions.md` ⭐⭐ | 19 招里 Tip 1 / 6 / 7 三章同型 chapter（kicker + hero + cc-window）可参数化复用骨架 | 高：需重构 chapter |
| **`ui-3d-reveal` 13s 透视 3D UI** | `catalog/blocks` ⭐⭐ | hook 后接 Tip 1 时配工具界面入场用 | 低：`npx hyperframes add` |
| **`backdrop-filter` 上限规则（2-3 层）** | `guides/performance.md` ⭐⭐ | 项目用 14px blur 较多但没量化 → preview 卡时知道往哪改 | 低：背规则 |
| **嵌套 composition 模块化** | `concepts/compositions.md` ⭐⭐ | cc-window（12 chapter 复用）抽成独立 sub-comp，每个 chapter `<div data-composition-src="components/cc-window.html" data-variable-values=...>` | 高：重构 |
| **`capture` 抓站点视觉 token** | `packages/cli.md` ⭐⭐⭐ | 视觉 brief 时直接抓参考站（如 anthropic.com）的色板、字体、节奏作为 prompt 输入 | 中 |
| **`snapshot` 单帧导出** | `packages/cli.md` ⭐⭐⭐ | 选题阶段做封面预演、Step 2 提到的 "封面.png"（项目里有 `assets/skill 视频封面.png` 是手做的，可用 snapshot 取代） | 低 |
| **GSAP `<video>` 包裹规则** | `guides/gsap-animation.md` ⭐⭐ | 下次接录屏 demo（如 statusbar.mp4）时避坑 | 低 |
| **`shimmer-sweep` component** | `catalog/components` ⭐⭐ | 与 chrome-text 互补：chrome-text 整字渐变，shimmer-sweep 是覆盖光带，logo hold / outro 阶段铬光扫 | 低 |
| **`tl.set({}, {}, 5)` 短时间线 padding** | `guides/video-editor-cheatsheet.md` ⭐⭐⭐ | 项目 21/21 用 `tl.to({}, { duration: SLOT }, 0)`，等价但 `tl.set` 更精炼 | 低 |
| **HF 哲学：HTML+GSAP vs React** | `guides/hyperframes-vs-remotion.md` ⭐⭐⭐ | 写 prompt 时知道为什么 HF 偏 HTML 而不是 React 组件思维，避免误用 React 风格 | 低：1 篇文章 |
| **`packages/producer.md` 外部资产 auto-copy** | `packages/producer.md` ⭐⭐ | VO 文件放 Downloads 自动 copy 到 renders，不用手挪 | 低 |

---

## 5. 一句话能力地图（项目结束时的我 vs 项目开始时的我）

| 维度 | 开始时 | 结束时 |
|---|---|---|
| **HF clip 模板写法** | 不会 | 熟练（21/21 一致） |
| **GSAP timeline + paused 注册** | 不会 | 熟练 |
| **GSAP ease 4 件套（power3.out / power2.out / sine.inOut / power2.in）** | 不知 | 内化（不查文档自然写） |
| **GSAP transform 接管陷阱** | 撞过墙 | 知道用 xPercent/yPercent |
| **居中规范（flexbox vs absolute+transform）** | 撞过墙 | 一律 flexbox |
| **chrome-text + 中文 hero 兼容** | 撞过墙 | 知道与 inline-block 互斥 |
| **immediateRender:false** | 撞过墙 | 知道何时加 |
| **多场景 camera pan 模板** | 不会 | Tip 14 + Tip 18 验证过 |
| **撞击同帧合成** | 不会 | Tip 10 模板可复用 |
| **wavy SVG filter（feTurbulence + feDisplacementMap）** | 不会 | 整套参数熟（baseFrequency 0.010-0.014, scale 22, seed 1-3） |
| **相对时序 / 嵌套 composition / data-variable-values** | 不会 | 仍不会 |
| **CLI tts/capture/inspect/snapshot/transcribe** | 不会 | 仍不会 |
| **prompting 词汇表 + Caption Tone** | 不会 | 仍不会 |
| **catalog 转场三件套** | 不会 | 知道存在但未实用 |
| **透明 MOV / Docker 渲染** | 不会 | 仍不会 |
| **Claude Code 协作：commit body 写"原因+修法"** | 不会 | 已是默认习惯 |
| **Claude Code 协作：跨章节批量打磨意识** | 不会 | f2f0de1 起内化 |
| **Claude Code 协作：单点 sample → 推全方法论** | 不会 | 9cf40e3 链事故后内化 |
| **Claude Code 协作：联网 2 源交叉验证内容** | 不会 | 6f81556 起内化 |

---

> 第 4 步完成。下一步：四向交叉索引 → `README.md`。
