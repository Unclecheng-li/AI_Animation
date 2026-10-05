# 02 · 坑与解法

> 骨架来自 `docs/OFFICIAL_DOCS_VALUE_INDEX.md` 的"覆盖了我哪些坑"归类
> 不重新发明分类。所有"官方怎么说"的判断以索引为准（除非索引未覆盖才单独标注）

判定标准（按 prompt）：
- 同一文件 ≥3 次 commit → Tip 1（6）+ Tip 14（5）+ Tip 04 / Tip 16 / Tip 18（各 3）
- commit message 含修复词（fix / 修 / 改 / 不对 / 重写 / 调）→ 5 个 fix(...) + 1 个 Revert + 1 个"重写"
- 大段删除后重写 → `cc599ad` Tip 10 "替换早期占位实现"；`9757bb8` Tip 1 V5 重构终端 UI
- 同类问题在不同 composition 重复 → 居中失效 / GSAP transform 接管 / chrome-text stacking context

---

## 卡片格式

每张卡片：现象 / 触发场景 / 失败尝试 / 最终解法（commit）/ 下次怎么避免 / 文档归类 / 状态。

状态三档：
- 🔴 **官方已覆盖，我当时没读到** → 这是教训
- 🟡 **官方提了但讲得不够清楚** → 可贡献候选
- 🟢 **官方完全没提** → 可贡献候选（优先级最高）

---

## 第一类 · 🔴 教训：官方已覆盖，我当时没读到

### P1 · 全项目 0 处相对时序，改 SRT 时长须手算下游 21 段

| 项 | 内容 |
|---|---|
| **现象** | `index.html` 21 段 chapter 全用绝对秒数（`data-start="116.299"`），改任何一段时长都得重算下游所有起点 |
| **触发场景** | SRT 重切（hook 从 4.5s 改 5.266s、Tip 9 从 30s 拉到 44.367s 等），所有下游 offset 必须手动累加 |
| **失败尝试** | 不存在尝试——从脚手架 `51e4ebf` 开始就是绝对秒数，21/21 一致，从未触发改写 |
| **最终解法** | 项目结束时仍是绝对秒数（未修复） |
| **下次怎么避免** | 用相对时序：`data-start="hook + 0"` `data-start="tip-01-statusline + 0"` …`data-start="tip-19-skill-creator + 0"`。改任意中段时长，下游全部自动顺延。索引 73 行点名为"工作流漏洞 1" |
| **归类** | `concepts/data-attributes.md` ⭐⭐⭐ + `reference/html-schema.md` ⭐⭐⭐ |
| **状态** | 🔴 教训：两页 ⭐⭐⭐ 都明示该写法，整个项目从未用过 |

### P2 · Tip 1 V3：先想视觉再塞口播，节奏完全错位

| 项 | 内容 |
|---|---|
| **现象** | V3 做完 32 秒视觉效果（dolly through / chrome sweep / chip collapse），与 SRT 口播完全错位 |
| **触发场景** | 第一个 tip 起步，没 SRT 同步意识，先按"32 秒可以塞多少效果"反推视觉 |
| **失败尝试** | V3 视觉自洽但播放对照口播完全错（按 `a4c5843` commit body 自述："用户播视频对照后发现视觉与口播完全错位"） |
| **最终解法** | `a4c5843` V4 重写规则：**视觉跟着语义走**——为每段口播单独定一个视觉对应。commit body 自带逐字稿 → 视觉 6 段映射表 |
| **下次怎么避免** | 写视觉前先把 SRT 切成"段·语义·秒数"三列表，每段口播必须有对应一个视觉变化。这是 memory 已记的"视觉时间码必须精确对齐 SRT 逐字稿"原则的起源 |
| **归类** | `guides/prompting.md` ⭐⭐⭐ Caption Tone 表（字体+尺寸映射）+ `guides/video-editor-cheatsheet.md` ⭐⭐⭐（手动微调→Agent 清理循环） |
| **状态** | 🔴 部分覆盖：`prompting.md` 有 fast/medium/slow 时长映射，但**没专门讲 SRT 逐字稿对齐**。Caption Tone 表是出稿质量的杠杆，本项目未用 |

### P3 · 8 catalog snippet 脚手架带入，全片 0 引用（dead code）

| 项 | 内容 |
|---|---|
| **现象** | `npx hyperframes init` 拉了 6 个 block snippet（`whip-pan` `flash-through-white` `cinematic-zoom` `flowchart` `logo-outro` `macos-notification`）+ 2 个 component snippet（`grain-overlay` `shimmer-sweep`），21 段 chapter 中**任何一段都未引用**它们（已 grep 验证：`compositions/[0-9]*.html` 中 0 处 `data-composition-src` 指向上述文件，0 处 class 名匹配） |
| **触发场景** | 脚手架默认行为，commit `51e4ebf` 一次性带入 |
| **失败尝试** | 整个项目周期内未尝试用任何一个（`commits=1` for all 8 = 仅脚手架那次 commit） |
| **最终解法** | 项目结束未删除（dead code 残留） |
| **下次怎么避免** | 索引中 `getting-started/quickstart.md` ⭐⭐ 引第 3 金句："`--non-interactive --example blank` 让 agent 无提示初始化工程"。下次脚手架用 `--example blank` 避免拉一堆鸡肋 snippet。已经在的就开 lint：`npx hyperframes lint --verbose` 应能查未引用 composition |
| **归类** | `getting-started/quickstart.md` ⭐⭐ |
| **状态** | 🟡 提了不够清楚：金句只说 `--example blank` 选项存在，没明确告"默认会带 ~8 个鸡肋 snippet"。可贡献"init flag 决策树" |

### P4 · 全片无 chapter 间转场：21 段直接相邻

| 项 | 内容 |
|---|---|
| **现象** | `index.html` 21 段 clip 头尾相接（end[N] === start[N+1]），无 transition clip、无 cross-fade overlap |
| **触发场景** | 21 段每段都"自洽"，跨段切换是硬切 |
| **失败尝试** | Tip 9 内部用过 `whip-pan` 转场（`8f0c59c` commit body 提到"H whip-pan 转场"，是 Tip 9 内部跨幕，不是 chapter 间）；Tip 11 用过 `whip-streak`（同 chapter 内 cue 间）。catalog 三个转场 block 全片 0 引用 |
| **最终解法** | 项目结束未加 chapter 间转场 |
| **下次怎么避免** | 用相对时序写 overlap：`data-start="prev-chapter - 0.5"` 制造交叉淡入；幕间大切换用 `flash-through-white`，文字穿越用 `cinematic-zoom`，章节间默认用 `whip-pan` |
| **归类** | `catalog/blocks/whip-pan` ⭐⭐⭐ + `catalog/blocks/flash-through-white` ⭐⭐⭐ + `catalog/blocks/cinematic-zoom` ⭐⭐⭐ |
| **状态** | 🔴 三个 ⭐⭐⭐ catalog block 我都"已读到"（OFFICIAL_DOCS_VALUE_INDEX 标"已体现：部分/否"），但项目里仅 chapter 内用过自制变体，从未用 catalog 三件套做 chapter 间过渡 |

### P5 · `20-outro.html` placeholder 25 秒，整片唯一 V1 都没做

| 项 | 内容 |
|---|---|
| **现象** | `20-outro.html` 48 行 / 1.6 KB / `commits=1`（仅脚手架），文字 `placeholder · 待实现` / `25.0s · outro`，占主时间线 25/453 秒 = 5.5% |
| **触发场景** | Day 1 脚手架时占了位，后续 30 个 commit 中无一指向它 |
| **失败尝试** | 无尝试 |
| **最终解法** | 项目结束仍 placeholder |
| **下次怎么避免** | `npx hyperframes add logo-outro` 现成替换 6s 片尾（piece-by-piece + glow bloom + URL pill + tagline fade-in），剩余 19s 接章节缩略图墙（`.thumbnails/` 已有 126 帧现成） |
| **归类** | `catalog/blocks/logo-outro` ⭐⭐ |
| **状态** | 🔴 索引已标"已体现：部分"，但实际项目里 outro 完全没动 = "已读到但没动手" |

### P6 · 媒体素材囤而未接入

| 项 | 内容 |
|---|---|
| **现象** | `assets/audio/` 8 个 SFX（keyboard-tick / notification-ding / pulse / reference-voice / rewind-tick / soft-whoosh / stop-tap / ui-click）+ `assets/video/statusbar.mp4` 1 个视频，全片 21 个 composition 中 `<audio>` `<video>` 标签数 = 0 |
| **触发场景** | 早期收了 SFX 备用，最终未接 audio track |
| **失败尝试** | 无尝试 |
| **最终解法** | 未接入 |
| **下次怎么避免** | `packages/cli.md` ⭐⭐⭐ 的 `tts` 命令本地 Kokoro-82M 生成配音 + `transcribe` 自动逐字时间戳。SFX 用 `<audio data-start="" data-duration="" data-track-index="2">` 即可。Tip 10 "ESC 暴力撞击三件套" 没接 stop-tap.wav 是明显遗憾 |
| **归类** | `packages/cli.md` ⭐⭐⭐ + `packages/producer.md` ⭐⭐（外部资产 auto-copy） |
| **状态** | 🔴 索引第 76 行点名"漏洞 2 · CLI 子命令 4 件套"包含 tts，但本项目从未触发 |

### P7 · 文字溢出未在渲染前用 `inspect` 扫

| 项 | 内容 |
|---|---|
| **现象** | Tip 1 commit `f2f0de1` body："Tip 2 — polaroid 命令行溢出：theme.css `.polaroid-term-cmd` font-size 18→14px"。即"V2 渲染后才发现命令行字超出 polaroid 卡片"，靠肉眼回看抓到 |
| **触发场景** | preview 分辨率与 mp4 渲染尺寸看起来同步但 polaroid 内文字在边缘的微溢出，preview 不易察觉 |
| **失败尝试** | V2 commit `4b57ab9` 当时未发现 |
| **最终解法** | `f2f0de1` 改字号 |
| **下次怎么避免** | `npx hyperframes inspect` 逐帧扫描文字溢出 / 容器裁切，按 OFFICIAL_DOCS_VALUE_INDEX 第 78 行 `inspect` 是"agent 可直接消费的 finding 列表" |
| **归类** | `packages/cli.md` ⭐⭐⭐ |
| **状态** | 🔴 索引点名 4 件套之一，本项目 `npm run check` 调用了 `inspect`（package.json 第 6 行），但是否实际跑过、跑出什么 → 待确认（git 中无 lint 输出快照） |

---

## 第二类 · 🟡 提了但讲得不够清楚

### P8 · 视觉 teaser 不能 spoiler 下一句

| 项 | 内容 |
|---|---|
| **现象** | 早期视觉同步时倾向"提前展示下一句视觉" → 削弱内容节奏感（已记录在 memory） |
| **触发场景** | 上一段 hold 末段空窗，想填东西，本能地把下一段视觉提前露 |
| **失败尝试** | Tip 1 早期 V3/V4 未明示，但 `f2f0de1` 修补："kicker 顶部 slide / teaser「↓ 在终端输入 /statusline」3.6s 淡入避 spoiler" 是反过来的——teaser 出现时间被刻意推后避免提前露下一句 |
| **最终解法** | `f2f0de1` Tip 1 三处改造按逐字稿精确同步 |
| **下次怎么避免** | 每段视觉 brief 时显式标"哪些信息可以提前 hint，哪些必须等到 cue 内当口播说出再露"。空窗段不准用下一段视觉填 |
| **归类** | `guides/prompting.md` ⭐⭐⭐ Caption Tone 表 |
| **状态** | 🟡 Caption Tone 讲风格不讲叙事节奏，**完全没提 spoiler 准则** → 可贡献"叙事节奏 vs 视觉提前量"段落 |

### P9 · `tl.fromTo` 0 秒处的预渲染会让元素第一帧就显示

| 项 | 内容 |
|---|---|
| **现象** | `tl.fromTo(el, {opacity:0, ...}, {opacity:1, ...}, 5)` 即使 5s 才触发，**第 0 帧 GSAP 就把 from 状态写到元素上**——但有时反而需要保持元素自然初始 CSS 状态直到 5s |
| **触发场景** | Tip 11 ripple 元素 |
| **失败尝试** | 默认 fromTo 在 0s 预渲染，导致 ripple 元素第一帧已经"摆好出场前姿势"被看到 |
| **最终解法** | `a021199` commit body 末尾："ripple fromTo 加 immediateRender:false 防止 0s 预渲染显示" |
| **下次怎么避免** | 只要 fromTo 的起始位置不是 0、且元素初始视觉应该用 CSS 控制 → 必须 `immediateRender: false` |
| **归类** | `guides/common-mistakes.md` ⭐⭐ |
| **状态** | 🟡 索引 3 个金句覆盖图片尺寸 / blur 上限 / Debugging Checklist，**未明确摘录 immediateRender** → 可能页面里有但未被索引高亮 → 待确认 |

### P10 · CSS `transform: translate(-50%, -50%)` 居中遇到 GSAP 操作 x/y/scale 时失效

| 项 | 内容 |
|---|---|
| **现象** | 元素用 CSS `top:50%; transform:translate(-50%,-50%)` 居中，GSAP `tl.to(el, {x:100, scale:0.92})` 跑过后元素跑偏，因为 GSAP 直接覆盖了整个 `transform` 属性 |
| **触发场景** | Tip 10 ESC 大键 + 终端的居中处理 |
| **失败尝试** | 早期版本元素居中用 CSS `transform: translate(-50%)`，GSAP 操作 x/scale 时居中失效 |
| **最终解法** | `cc599ad` commit body 末尾："修复 GSAP transform 接管陷阱: 用 GSAP `xPercent: -50` / `yPercent: -50` 替代 CSS `transform: translate(-50%)` 居中" |
| **下次怎么避免** | 项目准则：**任何会被 GSAP 动到 x/y/scale/rotate 的元素，居中一律用 `xPercent`/`yPercent` 不用 CSS transform**。或者改用 flexbox 居中（与 P11 同方案） |
| **归类** | `guides/gsap-animation.md` ⭐⭐ |
| **状态** | 🟡 索引 3 个金句讲时间线长度 / `tl.set` padding / `<video>` 包裹，**没专门讲 transform 接管** → 可贡献"GSAP transform 接管陷阱 + xPercent/yPercent 标准用法"小节 |

### P11 · `top:50% + translate(-50%, -50%)` 居中：高度难预估时偏 5%

| 项 | 内容 |
|---|---|
| **现象** | Tip 1 V5 截图显示 cc-window grid layout 实际渲染高度比 CSS 预设高 ~50px → 终端中心约在屏幕 55% 位置而非 50% |
| **触发场景** | grid layout（cc-window 是 `grid-template-rows: 56px 1fr auto`）实际高度依赖内容，translate(-50%) 算的中心点不准 |
| **失败尝试** | V5 commit `9757bb8` 仍用 absolute + translate |
| **最终解法** | `f36f96e` Tip 1 修复："所有居中元素改用 flexbox `inset:0; display:flex; align-items:center; justify-content:center` —— 不依赖元素自身高度" |
| **下次怎么避免** | 项目准则：**容器内居中一律用 flexbox `inset:0`+`place-items:center`/`align-items:center`**，不用 absolute + transform。这是与 P10 共用的居中规范 |
| **归类** | 通用 CSS 知识，不在 HF 文档范围 |
| **状态** | 🟢 完全没提（也不该 HF 文档讲，但项目内可写到 MOTION_PHILOSOPHY 居中准则） |

### P12 · `--quality draft` 与 `standard` 视觉差异未在工作流标准化

| 项 | 内容 |
|---|---|
| **现象** | `package.json` `render` 脚本未带 `--quality` 参数，默认值未明示 |
| **触发场景** | 迭代时不知道用 draft 还是 standard，每次重渲耗时不可控 |
| **失败尝试** | 项目周期内未渲染过最终 mp4（待确认 — `renders/` 下只有 work 目录无最终 mp4） |
| **最终解法** | 未触发 |
| **下次怎么避免** | `guides/rendering.md` ⭐⭐⭐：迭代用 `--quality draft`，final 交付用 `--quality standard`（CRF 18 = 1080p 视觉无损）。本地 local 模式迭代，最终 `--docker` 锁定 Chrome + 字体 |
| **归类** | `guides/rendering.md` ⭐⭐⭐ |
| **状态** | 🟡 索引已标"已体现：部分"，但项目内 `package.json` 没把这套体现成两个 npm script（如 `render:draft` `render:final`） → 可贡献"渲染参数决策树"模板 |

---

## 第三类 · 🟢 完全没提（最高价值贡献候选）

### P13 · `chrome-text` + 字符 `<span>` 包装：`inline-block` 创建 stacking context 让 `background-clip:text` 失效

| 项 | 内容 |
|---|---|
| **现象** | Hook 早期 V8/V9 给 hero 文字每个字符包 `<span class="hc">` 做 stagger 砸入，但 `display:inline-block` 在父 `.chrome-text` 上创建 stacking context → `-webkit-background-clip:text` 在子元素上失效 → 米色背景显示透明 = 看不见 |
| **触发场景** | 中文 hero 大字 + 字符级 stagger 入场（"不会写代码的人" 7 字逐个砸入）+ `chrome-text` 8-stop 渐变 |
| **失败尝试** | V8/V9 char span 包装，米色背景看不见字（commit body `96a0ecd` 自述） |
| **最终解法** | `96a0ecd` V10："删 .hc span 包装（避免 inline-block stacking context 让 chrome-text background-clip:text 失效），整体淡入与 cue2 同款" |
| **下次怎么避免** | **项目硬约束：`.chrome-text` 元素的子节点不能有 `display:inline-block` 或 `position:absolute`**（任何创建 stacking context 的属性都会让 background-clip:text 失效）。char stagger 与 chrome-text 互斥——选一个 |
| **归类** | 通用 CSS 知识 + 中文 hero 项目独有需求叠加 |
| **状态** | 🟢 完全没提：通用 CSS 文档讲过 background-clip:text 的 stacking context 限制，但**没人讲 char stagger 和 chrome-text 互斥**。中文 hero 是项目独有需求 → 可贡献"中文 hero 动效兼容性矩阵" |

### P14 · 视觉风格"推全 → 撤销"链：4 分钟内连发 9cf40e3 → 2c5a82b → 2d69585

| 项 | 内容 |
|---|---|
| **现象** | wavy 透视网格在 Tip 14 单点验证 OK 后，commit `9cf40e3` 推全 19 招（改 `index.html` + `theme.css` + 删 Tip 14 命名空间）→ 4 分钟后 commit `2c5a82b` Revert → 5 分钟后 commit `2d69585` 改为 Tip 1 单点 sample 重做 |
| **触发场景** | "Tip 14 验证过 → 直接推全 18 招" 的乐观推断 |
| **失败尝试** | `9cf40e3` 推全后视觉不达预期（具体不达预期点未在 commit 体记录，只有 Revert） |
| **最终解法** | `2d69585`：**先做 Tip 1 sample 作"推全前模板"**，commit body 自述"推全 18 招前的模板"，然后 commit body 末尾"下一步：派 sonnet 并行推 17 招" |
| **下次怎么避免** | 项目准则：**视觉风格变更——先单点 sample 做完整 cue 验证，再推全**。Revert 链是节奏代价（30 分钟内 3 个 commit + 1 个 Revert），用 `templates/` 模板复制更安全 |
| **归类** | 工程方法论，不在 HF 文档范围 |
| **状态** | 🟢 完全没提：`guides/video-editor-cheatsheet.md` ⭐⭐⭐ 讲"手动 DOM 微调 → Agent 清理 diff"循环但是单文件级别。**跨 19 文件推全的方法论没人写过** → 可贡献"sample → broadcast → cleanup"三段式工作流 |

### P15 · GSAP 多元素同帧合成（"撞击三件套"）没文档

| 项 | 内容 |
|---|---|
| **现象** | Tip 10 ESC 暴力撞击需要多个元素在**同一帧**做不同动画：白闪 0.45 + 冲击波 ripple scale 0.5→12 + screen shake 5 段抖动 + 终端红光爆闪 + 7 行碎裂 + STOPPED badge 弹出脉动 |
| **触发场景** | 任何"动作戏"片段（撞击 / 爆炸 / 闪现） |
| **失败尝试** | 早期 V0 占位实现弱效果（cc599ad commit body："替换早期占位实现"） |
| **最终解法** | `cc599ad` 一次性写 7 cue 28 个 GSAP tween 同时安排在撞击瞬间 ±0.05s 内 |
| **下次怎么避免** | 提炼成 skill 工具集："impact moment 同帧合成模板"——给定撞击时刻 T，自动生成 white flash + ripple + shake + sound flash 5-7 个 tween |
| **归类** | `guides/gsap-animation.md` ⭐⭐ |
| **状态** | 🟢 完全没提：索引中 GSAP 页只讲 `tl.set` padding 和 `<video>` 包裹，**没讲 N 元素同帧合成模板**。MOTION_PHILOSOPHY 应记录 |

### P16 · 内容真实性：Codex 不在 Claude Agent Teams 内（事实错误差点上线）

| 项 | 内容 |
|---|---|
| **现象** | Tip 18 V1 `0977142` 把 Agent Teams worker 画成 claude/claude/codex，commit `6f81556` 联网 2 源交叉验证发现 Agent Teams 是 Anthropic 内部多 Claude 实例协作，**Codex 不可能在 Agent Teams 里** |
| **触发场景** | 教程内容涉及最新功能（Agent Teams 是 2026-02-05 发布），训练数据可能滞后 |
| **失败尝试** | V1 凭直觉把 Codex 加进 Agent Teams 渲染（视觉直觉：异厂商 worker 更有"团队"感） |
| **最终解法** | `6f81556` 全部去掉 Codex，用 Haiku 4.5 替代第 3 worker；同时加 worker↔worker 横向沟通（Agent Teams 与 sub-agent 的关键差异） |
| **下次怎么避免** | **项目硬约束：教程涉及最新产品功能必须 grok-search + Tavily 2 源交叉验证**（与全局 CLAUDE.md "证据协议"一致）。视觉先做 V1 → 内容审核 → 改正 |
| **归类** | 内容真实性流程，不在 HF 文档范围 |
| **状态** | 🟢 完全没提：HF 框架文档不讲内容审核，但**视频教程工作流必备**。可贡献"内容真实性审查"步骤到 cyxj-new-video skill |

### P17 · `theme.css` 5 个类定义但 0 文件引用（dead code 累积）

| 项 | 内容 |
|---|---|
| **现象** | `theme.css` 有 7,588 行，其中 5 个类**0 composition 引用**：`.compare-grid` / `.compare-label` / `.compare-value` / `.mac-terminal` / `.token-stream` / `.token-line` |
| **触发场景** | 早期定义了一套对比组件 / 终端组件 / token 流组件，后续每章自己重写 grid / 用 `.cc-window` 替代 `.mac-terminal` / 自制 token chip |
| **失败尝试** | 不存在尝试——theme.css 只增不删（commit history 里 theme.css 始终在长） |
| **最终解法** | 项目结束未清理 |
| **下次怎么避免** | 每次新章发现已有同名 CSS 类时，先 grep `class="<name>"` 确认是否还有人用，无人用就直接改类签名而不是新增。或者周期性跑：`for c in compare-grid mac-terminal token-stream …; do grep -L $c compositions/*.html; done` |
| **归类** | `packages/cli.md` ⭐⭐⭐ `lint` 不查 dead CSS |
| **状态** | 🟢 完全没提：HF lint 不查 CSS dead code → 可贡献"项目内 CSS dead code 检测脚本" |

### P18 · Tip 14 wavy filter prototype 命名空间→推全→单点回退（与 P14 同源）

| 项 | 内容 |
|---|---|
| **现象** | wavy 命名空间从 `wavy-distort-14`（commit `8475dc5` Tip 14 prototype）→ `wavy-distort-global`（commit `9cf40e3` 推全）→ Revert（`2c5a82b`）→ `wavy-distort-1`（commit `2d69585` Tip 1 sample）→ `wavy-distort-hook`（commit `96a0ecd` Hook V10）。最终全片 4 个独立 SVG filter 命名空间共存 |
| **触发场景** | SVG filter id 全局唯一，命名空间冲突 + 推全失败导致命名空间变多 |
| **失败尝试** | `9cf40e3` "delete Tip 14 命名空间 + 用 wavy-distort-global"，4 分钟后 Revert 但 Revert 没把"删 Tip 14 命名空间"加回来——**实际 Revert 不一定恢复 commit 之前完整状态**（待确认） |
| **最终解法** | `2d69585` 改用 Tip-XX 局部命名空间避免冲突 |
| **下次怎么避免** | SVG filter 一律按 chapter 命名空间（`wavy-distort-tip-NN`），永远不要全局共享 SVG filter id |
| **归类** | 工程方法论 |
| **状态** | 🟢 完全没提 |

### P19 · 项目自创视觉范式不在任何官方文档：cc-window 完整体系

| 项 | 内容 |
|---|---|
| **现象** | `.cc-window` + `cc-titlebar` + `cc-body` + `cc-statusline` 用在 12/21 文件，含 5 种 body 变体：prompt-line / agent-call / question / bullets / typing；statusline 5 种 segment：model / ctx / cost / tokens / rate |
| **触发场景** | Claude Code 工具教程内最高频复用单元 |
| **失败尝试** | 无（合并验证通过）|
| **最终解法** | 项目内默认模板 |
| **下次怎么避免** | 沉淀到 catalog 作为新 block：`catalog/blocks/claude-code-window`（详见 Step 4 / 高价值贡献候选总表） |
| **归类** | catalog 无对应 block |
| **状态** | 🟢 完全没提 → 可贡献给官方 catalog（项目独有高价值视觉资产） |

---

## 高价值贡献候选汇总（🟢 + 🟡）

按"可移植性 × 价值"排序：

| 序 | 候选 | 来自 | 落地建议 |
|---|---|---|---|
| 1 | **GSAP transform 接管陷阱：xPercent/yPercent 标准用法**（P10） | `cc599ad` | 提 issue/PR 到官方 `guides/gsap-animation.md` |
| 2 | **chrome-text 与字符 stagger 互斥（中文 hero 兼容性矩阵）**（P13） | `96a0ecd` Hook V10 | 沉淀到 `MOTION_PHILOSOPHY.md` 中文 hero 章节 |
| 3 | **`cc-window` 完整体系**（P19） | 12 个 chapter | 沉淀到 catalog 作 `claude-code-window` block，5 种 body × 5 种 statusline 变体 |
| 4 | **撞击同帧合成模板**（P15） | `cc599ad` Tip 10 | 沉淀到 `MOTION_PHILOSOPHY.md` "动作戏"章节 + skill 工具集 |
| 5 | **sample → broadcast → cleanup 视觉风格推全方法论**（P14） | `9cf40e3 → 2c5a82b → 2d69585` | 沉淀到 `cyxj-new-video` skill 阶段 D |
| 6 | **`immediateRender: false` 项目规则**（P9） | `a021199` | 沉淀到 `MOTION_PHILOSOPHY.md` GSAP 注记 |
| 7 | **教程内容真实性 grok-search 双源审核步骤**（P16） | `6f81556` | 沉淀到 `cyxj-new-video` skill 阶段 D（已部分有，需明确） |
| 8 | **居中规范：flexbox/inset 0 vs absolute+transform vs xPercent**（P10+P11） | `f36f96e` `cc599ad` | 沉淀到 `MOTION_PHILOSOPHY.md` 居中准则段 |
| 9 | **CSS dead code 检测脚本**（P17） | theme.css 5 类 dead | 写 `scripts/lint-dead-css.sh` |
| 10 | **视觉 teaser 不能 spoiler 准则**（P8） | `f2f0de1` + memory | 沉淀到 `MOTION_PHILOSOPHY.md` 叙事节奏段 |
| 11 | **渲染参数决策树（draft / standard / docker）**（P12） | 索引 P5 | 改 `package.json` 增 `render:draft` `render:final`，并写到 cyxj-new-video skill |
| 12 | **SVG filter id 命名空间规则**（P18） | `9cf40e3` 链 | 沉淀到 `MOTION_PHILOSOPHY.md` 注记 |

---

## 教训汇总（🔴）

| 教训 | 索引中应该读的页面 | 修正动作 |
|---|---|---|
| 全用绝对秒数 → 改 SRT 时长须手算下游（P1） | `concepts/data-attributes.md` ⭐⭐⭐ + `reference/html-schema.md` ⭐⭐⭐ | 下次脚手架 `index.html` 直接用相对时序 |
| Tip 1 V3 视觉与口播错位（P2） | `guides/prompting.md` ⭐⭐⭐ Caption Tone | 视觉前先做 SRT 三列表 |
| 8 catalog snippet 鸡肋残留（P3） | `getting-started/quickstart.md` ⭐⭐ `--example blank` | 下次 init 用 `--example blank` |
| 全片无 chapter 间转场（P4） | catalog 三件套 ⭐⭐⭐ | 下次脚手架 `index.html` 时就把 whip-pan 排在 chapter 之间 |
| outro 25 秒 placeholder（P5） | `catalog/blocks/logo-outro` ⭐⭐ | 下次直接 `npx hyperframes add logo-outro` |
| 媒体素材囤而未接入（P6） | `packages/cli.md` ⭐⭐⭐ tts/transcribe | 工作流补 tts/SFX 步骤 |
| 文字溢出未跑 inspect（P7） | `packages/cli.md` ⭐⭐⭐ inspect | 渲前必跑 `npm run check` 含 inspect |

---

> 第 3 步完成。下一步：能力地图 → `03-skills.md`。
