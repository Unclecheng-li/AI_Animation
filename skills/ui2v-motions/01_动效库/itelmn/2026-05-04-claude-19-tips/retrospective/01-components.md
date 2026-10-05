# 01 · 组件与模式库

> 扫描 21 个主线 composition + theme.css（7,588 行），按 HyperFrames 官方概念分三类
> 权威参照系：`docs/OFFICIAL_DOCS_VALUE_INDEX.md` · `参考库/catalog.json`（46 entries）

---

## 0. 头部数据（先把基底事实定下来）

### 文件层共性

| 项 | 占比 | 备注 |
|---|---|---|
| `gsap.timeline({ paused: true })` | 21/21 | 100% 一致 |
| `window.__timelines["<id>"] = tl` | 21/21 | 100% 一致 |
| `<link rel="stylesheet" href="../assets/theme.css" />` | 21/21 | 100% 一致 |
| GSAP CDN (`gsap@3.14.2`) | 21/21 | 100% 一致 |
| `<audio>` 标签 | 0/21 | 全片无声 |
| `<video>` 标签 | 0/21 | 全片无视频素材接入 |
| `data-composition-src` 嵌套引用（chapter → other chapter） | 0/21 | 无嵌套；只有 index.html 引用 chapter |
| `data-variable-values` 传参 | 0 | 未使用 |
| `data-start="<name> + N"` 相对时序 | 0 | 100% 绝对秒数 |
| Frame Adapter / Lottie / WAAPI / Anime.js / Three / CSS Animations | 0/21 | 仅 GSAP |
| Shader transition（catalog blocks） | 0/21 | 未使用任何官方转场 block |

### Ease 分布（全 21 文件总采样 ≈ 720 次）

| ease | 次数 | 占比 | 角色 |
|---|---|---|---|
| `power3.out` | 207 | 29% | 入场首选 |
| `power2.out` | 132 | 18% | 副入场 / chrome sweep |
| `sine.inOut` | 115 | 16% | 全程呼吸 yoyo |
| `power2.in` | 61 | 8.5% | 退场首选 |
| `none` | 57 | 8% | 线性背景滚动 / 计数 |
| `power3.in` | 47 | 6.5% | 强退场 |
| `back.out(1.4–2.4)` 系列 | 90+ | 12.5% | 弹入 chip / button |

### Stagger 分布

| 写法 | 次数 | 用途 |
|---|---|---|
| `{ each: 0.15, from: 'random' }` | 18 | crosshair 闪烁 |
| `{ each: 0.06, from: 'random' }` | 13 | particles drift |
| `{ each: 0.08, from: 'random' }` | 4 | 中频颗粒 |
| `0.10` / `0.18` 线性 stagger | 6 | list-item 序列入场 |

---

## A · 数据属性模式

### A.1 主时间线 clip 模板（`index.html`）

**每段 chapter clip 写法**（21 段，零变体）：

```html
<div class="clip" data-composition-id="tip-NN-<slug>"
     data-start="<sec>" data-duration="<sec>" data-track-index="1"
     data-composition-src="compositions/NN-<slug>.html"></div>
```

- 时间用绝对秒数硬编码（精度到小数 3 位）
- `track-index="1"` 全部相同
- 全片无 gap、无 overlap、无 transition clip
- **来源**：`index.html:36-138` （commit `51e4ebf` 脚手架定形，章节加入时只追加新行）

**对照官方**：
- `concepts/data-attributes.md` ⭐⭐⭐ 推荐相对时序写法 `data-start="prev-name + 0.5"`，本项目从未使用 → 改 SRT 时长须手算所有下游 offset。
- `reference/html-schema.md` ⭐⭐⭐ 列出的 `data-variable-values` 传参，本项目从未使用 → 21 个 composition 全部独立写死。

**标准化命名建议**（已是事实标准，无需重命名）：
- chapter slug = `NN-<topic-kebab>` (`01-statusline` / `15-api-vs-mcp`)
- composition-id = `tip-NN-<slug-no-prefix>` (`tip-01-statusline`)

**Catalog 对照**：N/A（顶层主时间线，不是 catalog 物件）。

### A.2 Sub-composition root 模板（`compositions/NN-*.html`）

**21 个 chapter root div 模板**（100% 一致）：

```html
<div
  id="root-tip-NN"                          <!-- 或 root-hook / root-outro -->
  data-composition-id="tip-NN-<slug>"
  data-start="0"
  data-duration="<sec>"
  data-width="1920"
  data-height="1080"
  data-layout-allow-overflow="true"
  style="width:1920px;height:1080px;background:var(--c-bg);
         position:relative;overflow:hidden;font-family:var(--f-zh);"
>
```

**关键 grep 证据**：
- `data-width="1920"` × 21
- `data-height="1080"` × 21
- `data-start="0"` × 21（每个 sub-comp 内部都从 0 起算，与 index.html 的绝对起点解耦）
- `data-layout-allow-overflow="true"` × 20（hook 含但 outro 也有；统计差异是 attribute 顺序导致 grep 漏一行）

**变体维度**：
- `data-duration` = 5.266 → 44.367（按 SRT 精确切分）
- `id="root-tip-NN"` / `id="root-hook"` / `id="root-outro"`

**标准化命名建议**：已成事实标准（root id 与 composition-id 一一对应）。

**抽取难度**：⭐ 直接抽
- 把 root 模板做成 skill/template snippet（已有 `templates/demo-fullscreen/`），脚手架就能省 7 行重复 HTML。

**Catalog 对照**：N/A（这是工程骨架，不是 catalog 物件）。

### A.3 局部数据属性

| 属性 | 出现位置 | 出现文件 | 角色 |
|---|---|---|---|
| `data-scene="N"` (N=1..6) | scene 容器 | `14-worktree.html`, `18-agent-teams.html` | 6-scene camera pan 标记（仅做 CSS 选择器，不参与 HF 时序解析） |
| `data-tool="search"` | 工具卡 | `13-screenshots.html` × 3 | 自定义语义标，纯 CSS 钩子 |

**注**：HF 框架本身不消费 `data-scene` / `data-tool`，这两个是项目自定义的 CSS 钩子。

### A.4 反向清单 — 漏用的官方数据属性

| 官方属性（来源页） | 本项目是否用 | 用了还能省什么 |
|---|---|---|
| 相对时序 `data-start="prev + N"` (`concepts/data-attributes.md`) | 否 | 改一段 SRT 时长，下游 21 段 offset 自动跟随 |
| 相对时序 `data-start="prev - 0.5"` overlap | 否 | 章节交叉淡入不必手算 |
| `data-variable-values` (`reference/html-schema.md`) | 否 | 同骨架不同主题 chapter 可参数化复用 |
| `data-composition-src` 嵌套（chapter → 子组件） | 否 | 跨 chapter 复用 cc-window / chrome-hero block 不必复制 HTML |

→ 详见 Step 3 `02-pitfalls.md` 的"高价值贡献候选"段落。

---

## B · 动画模式（GSAP）

### B.1 时间线注册三件套

**100% 一致的脚本骨架**（21/21）：

```html
<script>
  window.__timelines = window.__timelines || {};
  (function () {
    const root = '[data-composition-id="tip-NN-slug"]';
    const tl = gsap.timeline({ paused: true });
    const SLOT = <duration>;

    /* … 各 cue tween … */

    // pad 时间线到 SLOT
    tl.to({}, { duration: SLOT }, 0);
    window.__timelines["tip-NN-slug"] = tl;
  })();
</script>
```

**变体**：
- pad 写法：`tl.to({}, { duration: SLOT }, 0)`（多数）vs `tl.set({}, {}, SLOT)`（outro）vs 末尾自然铺满（如 06-ask-questions 末尾 particles 11.7s + 0.9s 已超过 11.6 + 1.0 = 接近 12.667）
- root selector 始终硬编码字符串 `'[data-composition-id="..."]'`，**没用 template literal**（与 CLAUDE.md 硬约束 1 一致）

**标准化命名建议**：已是事实标准。

**抽取难度**：⭐ 直接抽 → 已被 `/hyperframes` skill 内置。

### B.2 Blur Enter / Exit 模板（项目主导动效语言）

**Enter 模板（`power3.out`，21/21 文件至少出现 1 次）**：

```js
tl.fromTo(root + ' #<elem>',
  { opacity: 0, y: 20, filter: 'blur(14px)' },
  { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' },
  <start>);
```

**Exit 模板（`power2.in`）**：

```js
tl.to(root + ' #<elem>',
  { opacity: 0, y: -14, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in' },
  <start>);
```

**变体维度**：
| 维度 | 取值 | 出现频次 |
|---|---|---|
| 入场 y | 20 / 22 / 24 / 26 / 28 | 22 / 13 / 4 / 8 / 7 |
| 入场 blur | 14px（强烈）/ 12px / 10px（弱） | 主导 / 部分 / 部分 |
| duration | 0.55 / 0.6 / 0.65 / 0.7 | 0.6 是中位数 |
| 退场 y | -14 / -16 / -20 / -24 | 视当前 hero 大小 |

**代表代码**：`compositions/06-ask-questions.html:220-227` (`b5ed96b`) cue A hero opener 入退完整一对。

**标准化命名建议**：
- skill 中固定为 `enterBlur(<elem>, <start>, { y, blur, duration })`
- 退场 `exitBlur(<elem>, <start>)`

**抽取难度**：⭐⭐ 需小改（GSAP 原生没有 enter/exit 概念，要做 helper 函数）。

**Catalog 对照**：catalog 无对应 block —— 这是项目内自有的视觉语言，**MOTION_PHILOSOPHY** 应记录为标准入退场模板。

### B.3 Chrome-Text Sweep（hero 大字光泽扫）

**模板**（21 文件中 20 文件用过 `.chrome-text` 类）：

```js
tl.fromTo(root + ' #<hero> .chrome-text',
  { backgroundPosition: '100% 0' },
  { backgroundPosition: '0% 0', duration: 0.7–0.8, ease: 'power2.out' },
  <start + 0.2>);
```

**底层 CSS**（`assets/theme.css:425-453`）：
- `.chrome-text` —— 8-stop 灰色 chrome（米色背景的 dark bookends 防漏边）
- `.chrome-text-hot` —— Claude 橙版本（hot 词专用）

**代表代码**：`compositions/06-ask-questions.html:223-227` 与 `283-286`（同文件用了 2 次）。

**Catalog 对照**：
- `components/shimmer-sweep` ✅ 概念一致（CSS gradient mask + 光扫）。
- **差异点**：项目用 `background-clip:text + background-position` 做整字渐变，shimmer-sweep 是覆盖层光带。本项目方案对中文大字效果更好（漂浮的高光不易被中文笔画切碎）。
- **替代难度**：不建议替代，项目自制版更适合中文 hero。

### B.4 全程呼吸层（vignette + crosshair）

**模板**（每个 cue script 头部，20/21 文件用过）：

```js
tl.to(root + ' #grid',
  { backgroundPositionY: '+=40px', duration: SLOT, ease: 'none' }, 0);
tl.to(root + ' #vignette',
  { opacity: 0.95, duration: 4, repeat: 1, yoyo: true, ease: 'sine.inOut' }, 0);
tl.to(root + ' .crosshair',
  { opacity: 0.8, duration: 1.6, repeat: 3, yoyo: true, ease: 'sine.inOut',
    stagger: { each: 0.15, from: 'random' } }, 0);
```

**Catalog 对照**：`components/grain-overlay` ✅ 部分重叠（项目已用 `.global-grain`，写法不同但概念相同）。grain-overlay 是 catalog 写法，本项目是 inline 写法。**已在 OFFICIAL_DOCS_VALUE_INDEX 标记"已体现：是"**。

**抽取难度**：⭐ 直接抽（已是 paste-and-go 三件套）。

### B.5 Particles Drift

19/21 文件出现 `id="particles"` + `class="particle"`。

**模板**（`06-ask-questions.html:188-198, 320-325`）：

```html
<div id="particles" style="position:absolute; inset:0; pointer-events:none; opacity:0;">
  <span class="particle" style="left:18%; top:32%;"></span>
  …8 个 …
</div>
```

```js
tl.to(root + ' #particles', { opacity: 1, duration: 0.4 }, <near-end>);
tl.to(root + ' .particle',
  { y: '-=18', duration: 0.9, ease: 'sine.inOut',
    stagger: { each: 0.06, from: 'random' } }, <near-end + 0.1>);
```

**变体**：
- 粒子数 8 / 12 / 16
- y 位移 `-=12` / `-=18` / `-=24`
- 触发时机：每章末尾 1.0–1.5s 收尾

**抽取难度**：⭐ 直接抽。

### B.6 Camera Pan（多场景滚动舞台）

**仅在 2 个 chapter 出现**：
- `14-worktree.html` (`b034b42`) — Stage 1920 × 6480 = 6 scene × 1080，y 从 -5400 → 0
- `18-agent-teams.html` (`0977142`) — 同结构 6 scene

**模板**（`14-worktree.html:34-46` 注释 + 后续 GSAP）：

```js
// Stage：1920×6480，camera y 从 -5400 爬到 0
const stage = root + ' #scene-stage';
tl.set(stage, { y: -5400 }, 0);
tl.to(stage, { y: -4320, duration: 0.7, ease: 'power3.inOut' }, 2.50);
tl.to(stage, { y: -3240, duration: 0.7, ease: 'power3.inOut' }, 16.80);
// …继续 4 次 pan
```

**Catalog 对照**：catalog 无对应 block。
- 类似概念在 `nate-demos/aisoc-lesson-5-1`（参考库内）有体现 → 本项目作品级长视频常用，可考虑沉淀到 skill。

**抽取难度**：⭐⭐⭐ 不建议直接抽。每个 scene 内部布局完全独立，pan 时间表与 SRT 强耦合，模板化只能给"骨架 + scene 容器列表"。

### B.7 Chrome-Text 小工具：char-by-char 砸入

**仅在 hook 用**（`00-hook.html:101-109` `96a0ecd`）：

```html
<h1 id="hero-cue1" class="chrome-text">不会写代码的人</h1>
```

```js
// V10 注释：删 .hc span 包装（避免 inline-block stacking context 让 background-clip:text 失效）
tl.fromTo(root + ' #hero-cue1',
  { opacity: 0, scale: 0.92, filter: 'blur(8px)' },
  { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' },
  0.15);
```

> **关键 caveat**（来自 hook 注释 `96a0ecd`）：
> 早期 V8/V9 给 hero 文字每个字符包 `<span class="hc">`，但 `inline-block` 会在 chrome-text 父元素上创建 stacking context，让 `-webkit-background-clip: text` 失效（米色背景显示透明 = 看不见）。**V10 删除字符 span，改为整体砸入**。
> Step 3 `02-pitfalls.md` 会单独建卡。

**抽取难度**：⭐⭐ 概念可抽，但中文 char stagger 与 chrome-text 不兼容是硬约束，必须警示。

### B.8 反向清单 — 漏用的 GSAP 能力

| 官方能力（来源页） | 本项目是否用 |
|---|---|
| `tl.set({}, {}, 5)` 短时间线 padding (`guides/video-editor-cheatsheet.md` ⭐⭐⭐) | 仅 outro 1 处用，其他用 `tl.to({}, { duration: SLOT }, 0)` 等价 |
| `<video>` 必须 `<div>` 包裹（`guides/gsap-animation.md` ⭐⭐） | 本项目 0 视频引用 → 未触发 |
| Frame Adapter（GSAP 之外的 runtime） | 未触发 |

---

## C · 视觉与布局模式

### C.1 Design Token（`assets/theme.css:1-49`）

**调色板（暖米色系 + Claude 橙岛屿）**：
| Token | 值 | 角色 |
|---|---|---|
| `--c-bg` | `#F7F2EA` | 主背景（米色 warm beige） |
| `--c-surface` / `--c-surface-2` | `#EFE7DC` / `#E5DACA` | 二/三级表面 |
| `--c-text` / `--c-muted` | `#2B2622` / `#6D6259` | 字色主/次 |
| `--c-line` | `#D8CEC2` | 描边 |
| `--c-orange` | `#D97757` | Claude 橙（hot 词、强调） |
| `--c-orange-glow` | `rgba(217,119,87,0.45)` | halo |
| `--c-teal` | `#2F7D73` | 终端 prompt > 符号 |
| `--c-success` / `--c-warning` / `--c-danger` | `#4E8F72` / `#C78A3B` / `#B85138` | 状态三色 |
| `--c-terminal` / `--c-terminal-soft` / `--c-terminal-text` | `#221F1C` / `#322D28` / `#F8F1E7` | 暗色岛屿（终端 UI 用） |

**字体**：
- `--f-zh` = Noto Sans SC + PingFang SC + Inter（中文 hero）
- `--f-en` = Inter（英文 副标 / kicker）
- `--f-mono` = JetBrains Mono + SF Mono（终端、代码、数字仪表）

**字号阶梯**：
| Token | px | 用途 |
|---|---|---|
| `--fs-hero` | 104 | hero 大字 |
| `--fs-headline` | 72 | 副大字 |
| `--fs-card-title` | 48 | 卡片标题 |
| `--fs-body` / `--fs-body-sm` | 32 / 26 | 正文 |
| `--fs-mono` | 26 | 终端、数字 |
| `--fs-kicker` | 22 | 章号 |
| `--fs-meta` | 18 | 元信息 |

**Catalog 对照**：catalog 无对应"主题包"概念。该 token 系是项目自有 DNA，对应 `MY_VISUAL_DNA.md`。

**标准化命名建议**：已成事实标准。

**抽取难度**：⭐ 直接抽 → `assets/theme.css` 复制即可，是真正的可移植资产。

### C.2 章号 Kicker（20/21 文件，仅 hook 不用）

**模板**：

```html
<div class="kicker">
  <span class="kicker-num">第 NN 招</span>
  <span style="opacity:.5">/</span>
  <span>CLAUDE CODE</span>
</div>
```

**底层**：`.kicker` (theme.css:72-86) 圆角胶囊 + soft shadow + var(--c-line) 描边。

**Catalog 对照**：无（章号是项目内独有的"播客式 chapter chip"语义）。

**抽取难度**：⭐ 直接抽。

### C.3 Hero 大字（20/21）

3 种 hero 元件名：

| 类 | 用法 | 文件占比 |
|---|---|---|
| `hero-zh chrome-text` | 中文 hero 标题（多数章节） | 16/21 |
| `chrome-text` 单独 | hook 多 cue + outro 替换 | 5/21 |
| `chrome-text-hot` | hot 词橙色版（hook "极致"、tip 02 commit） | 仅 2 处 |

**模板（chapter 通用）**：

```html
<h1 class="hero-zh chrome-text">让它追问你</h1>
<div style="font-family:var(--f-en); font-size:30px; letter-spacing:0.18em;
            text-transform:uppercase; color:var(--c-muted); font-weight:600;">
  Make It Ask Back
</div>
```

**Catalog 对照**：catalog 无中文 hero block；hero block 视觉与 `nate-demos/claude-edit-intro` 接近（参考库内已收）。

**抽取难度**：⭐ 直接抽 (CSS class 已 ready，HTML 也是固定 2 行)。

### C.4 Claude Code 终端 UI（cc-window 体系）

**12/21 文件用** —— 项目第二大复用单元（仅次于 chrome-text + kicker）。

**完整结构**（`assets/theme.css:466-674`）：
```
cc-window
├── cc-titlebar  (mac dots + cc-title)
├── cc-body      (cc-prompt-line > cc-prompt-arrow + cc-cmd + cc-cursor;
│                 cc-info; cc-response > cc-agent-call + cc-agent-name + cc-agent-desc;
│                 cc-question; cc-bullets > cc-bullet)
└── cc-statusline (cc-sl-seg × N: cc-sl-icon + cc-sl-label + cc-sl-value)
```

**示例**：`compositions/06-ask-questions.html:77-104`（commit `b5ed96b`）—— callback Tip 4 时复用了完整结构。

**Catalog 对照**：catalog 无对应 block。
- 与 `catalog/blocks/macos-notification` 不重叠（后者是通知 banner，不是终端窗口）。
- 与 `catalog/blocks/app-showcase` 不重叠。
- **结论**：cc-window 是**本项目独有的高价值视觉资产**，建议沉淀到 catalog（详见 Step 3 高价值贡献清单）。

**抽取难度**：⭐⭐ 需小改 → 已是 CSS class，但每个 chapter 内的 cc-body 内容差异大（命令行 / agent call / question / bullets / typing）。可抽成 skill 工具集："cc-window 骨架 + 5 种 body 变体"。

### C.5 Mode Toggle Bar（plan mode 视觉）

**3/21 文件用**：
- `04-plan-mode.html` (`049ac0a`) —— 首发，Tip 4 就是 plan mode 主讲
- `06-ask-questions.html` (`b5ed96b`) —— callback Tip 4
- `07-plan-reviewer.html` (`17eaa67`) —— Tip 7 plan-reviewer 也涉及 plan 模式

**模板**：
```html
<div class="mode-toggle-bar" id="mode-toggle">
  <span class="pause">‖</span>
  <span>plan mode on</span>
  <span class="dot">·</span>
</div>
```

**Catalog 对照**：无。

**抽取难度**：⭐⭐ 概念可抽 → "callback 历史 Tip 视觉" 是叙事手法，需要跨 chapter 复用。当前是手动 copy 类名 + theme.css 提供样式，可考虑沉淀。

### C.6 对话气泡（claude-bubble / user-bubble）

**3/21 文件用**：`06-ask-questions`、`09-claude-md`、`11-double-esc`。

**模板**：
```html
<div class="claude-bubble" id="qa-1">
  <span class="claude-bubble-dot"></span>
  <span>这个功能要不要支持离线？</span>
</div>
<div class="user-bubble" id="ub-1">
  <span class="user-bubble-dot"></span>
  <span>你也可以主动要求它…</span>
</div>
```

**Catalog 对照**：无（catalog 没有"对话气泡"原型）。

**抽取难度**：⭐ 直接抽（CSS class 已 ready）。

### C.7 对比双卡（compare-card）

**仅 1 个文件用了 CSS 类**：`13-screenshots.html`（"精确 vs 模糊对比"）。

**theme.css 中定义但未用**：
- `.compare-grid` (theme.css:334-340) — 定义了但 0 文件用
- `.compare-label` / `.compare-value` (theme.css:361-377) — 定义但 0 文件用

→ 多个章节有"双卡对比"视觉（`05-specific-requests` BAD vs GOOD、`15-api-vs-mcp` 双卡 MCP/API），但都**自己重新写了 grid + 卡片样式**而没用 theme.css 的 `.compare-grid` 系列 → **dead code 预警**（详见 Step 3）。

**Catalog 对照**：无。

**抽取难度**：⭐⭐ 概念可抽 → 需要先把 `.compare-grid` 接入到现有用过的 chapter 验证可用，再向外推。

### C.8 章节末 outro（项目骨架级 dead code）

**`20-outro.html`（48 行 / 1.6 KB）—— 整片唯一 placeholder**：
- `commits=1`（仅脚手架 commit `51e4ebf`，从未单独迭代）
- 文字写着 `placeholder · 待实现` / `25.0s · outro`
- 仅 1 个 GSAP `tl.from` 入场动画
- 占主时间线 25 秒（428.000–453.000s）

**Catalog 对照**：
- ✅ `catalog/blocks/logo-outro` 6s（piece-by-piece + glow bloom + URL pill + tagline fade-in）
- ✅ 索引中评级 ⭐⭐ "值得读"，且 OFFICIAL_DOCS_VALUE_INDEX 已标"已体现：部分"
- **结论**：直接 `npx hyperframes add logo-outro` 替换 placeholder，零成本上手 6s 片尾。25s 长度可用 logo-outro 6s + 后接 19s 章节缩略图墙（项目 `.thumbnails/` 现成）。详见 Step 3。

### C.9 Catalog 已带入但项目未用（dead code）

| 文件 | 类型 | 项目对应自制版 | 是否可替代 |
|---|---|---|---|
| `compositions/whip-pan.html` (367 行) | block · shader | `theme.css:677-693 .whip-streak`（自制白光转场） | 可替代，但项目目前**全片无 chapter 间转场**，未触发使用场景 |
| `compositions/flash-through-white.html` (367 行) | block · shader | 无对应 | 可作为幕间大转场首选（DNA 推荐） |
| `compositions/cinematic-zoom.html` (367 行) | block · shader | 无对应 | 文字穿越 3D 场景的首选（DNA 漏列） |
| `compositions/flowchart.html` (472 行) | block · diagram | Tip 18 agent-teams 自制顾问 → worker 派发图 | 概念重叠但视觉风格不同（catalog 是 sticky-note，项目是 logo + 连线），不建议替代 |
| `compositions/logo-outro.html` (227 行) | block · branding | `20-outro.html` placeholder | **强烈建议直接替换**（见上） |
| `compositions/macos-notification.html` (202 行) | block · overlay | Tip 12 自制居中通知 banner | 视觉风格相近，但项目版强调 hooks 触发节奏，需自定义内容 → 不建议替代，可借鉴动画时序 |
| `components/grain-overlay.html` | component · texture | `theme.css:178-187 .global-grain` 自制 | 项目自制版已用，无替代必要 |
| `components/shimmer-sweep.html` | component · highlight | `.chrome-text` 整字渐变（不同实现） | 不建议替代（中文 hero 适配差异，详见 B.3） |

→ 这 8 个 snippet 在 `index.html` 主时间线**和**任意 sub-composition 中**均无引用**（已用 `grep -E "data-composition-src|whip-pan|flash-through-white|…" compositions/[0-9]*.html` 验证）。

---

## D · 反向清单：伪重复（看似可合并实际不能）

| 配对 | 看似相同 | 实际差异 | 是否合并 |
|---|---|---|---|
| `03-clear .ctx-meter` ↔ `15-api-vs-mcp .ctx-fill` | 都是横条 + 数字百分比 | 03 是"上下文清空动画 → 0%"；15 是"双 MCP/API 卡各一条对比累计 ctx 消耗" | 不合并 — 语义维度不同（单时序 vs 并列 |
| `04-plan-mode .mode-toggle-bar` ↔ `06-ask-questions .mode-toggle-bar` | 类名一致，视觉一致 | 06 是 callback Tip 4 视觉（叙事手法），刻意保持视觉同步 | 已经合并（同一 CSS 类） — 不要再"抽小组件"，它就是一行 HTML |
| `08-self-check todo list` ↔ `11-double-esc node list` | 都是序号+条目 stagger 入场 | 08 是动态 todo（用户插入 QA 项 + spinner 流转）；11 是历史节点（双 ESC 选回退点 + 已丢弃 ghost 标记） | 不合并 — 条目状态机完全不同 |
| `02-commit polaroid stack` ↔ `13-screenshots compare-card` | 都是双面板视觉对比 | 02 是 polaroid 卡片堆叠 + cross-fade（Tip 2 commit history 隐喻）；13 是 BAD/GOOD 截图对比 | 不合并 — polaroid 是 Tip 2 独有视觉 metaphor |
| `03-clear ctx-meter reset` ↔ `17-thinking-budget budget-ramp` | 都是条状仪表动画 | 03 从 80% 撞向 0%（清空隐喻）；17 从 0 ramp 到 max（思考预算上升） | 不合并 — 方向相反 + 语义不同 |
| `01-statusline cc-statusline` ↔ `04-plan-mode cc-statusline` | 同一类，视觉一致 | 01 是讲解 statusline 本身（聚焦底部状态条本身）；04 是 plan 模式高亮 mode 字段 | 已经合并 — 同 CSS 类，状态切换通过 active class 修饰 |
| `00-hook .perspective-grid.wavy` ↔ `14-worktree .perspective-grid.wavy` | 都用 SVG `feTurbulence` filter 给 grid 加 wavy | hook 在片头用作"黑洞引力"基底；14 在场景过渡作 dimensional flow | 已经合并 — 同 wavy class，参数也一致 (`baseFrequency="0.010 0.014"` `scale="22"`) |

---

## E · 抽取优先级总表

| 模式 | 难度 | 价值 | 建议落地位置 |
|---|---|---|---|
| theme.css design token 全套 | ⭐ 直接抽 | 高 | 已是事实模板（hyperframes-student-kit `templates/demo-fullscreen` 可参考） |
| Sub-composition root 模板 | ⭐ 直接抽 | 高 | 已被 skill 内置 |
| Window.__timelines 注册三件套 | ⭐ 直接抽 | 高 | 已被 `/hyperframes` skill 内置 |
| Kicker 章号 chip | ⭐ 直接抽 | 中 | `cyxj-new-video` skill 段落骨架可加入 |
| Hero 大字 + chrome-text sweep | ⭐ 直接抽 | 高 | 同上 |
| Vignette + crosshair + grain 三件套 | ⭐ 直接抽 | 高 | 已是 paste-and-go |
| Particles drift（每章末尾） | ⭐ 直接抽 | 中 | 同上 |
| Blur enter/exit 模板 | ⭐⭐ 需小改 | 高 | 沉淀到 `MOTION_PHILOSOPHY.md` 标准动效语言 |
| cc-window 完整体系 | ⭐⭐ 需小改 | 高 | **可贡献给 catalog**（项目独有，6 种 body 变体） |
| Mode toggle bar (callback 历史 Tip) | ⭐⭐ 需小改 | 中 | 沉淀到 skill 作"叙事手法" |
| Camera pan 多 scene | ⭐⭐⭐ 不建议直接抽 | 高 | 给"骨架 + scene 容器列表"作 skill 注释，不做模板 |
| 对比双卡 compare-grid | ⭐⭐ 需小改 | 中 | theme.css 已定义，先把现有 chapter 接入 |
| Char-by-char hero 砸入 | ⭐⭐ 需小改 | 中 | 必须警示 chrome-text + inline-block 兼容陷阱（B.7） |

---

> 第 2 步完成。下一步：基于 `OFFICIAL_DOCS_VALUE_INDEX.md` 的文档页骨架挖坑 → `02-pitfalls.md`。
