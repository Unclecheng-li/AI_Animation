# UI2V 动效库 × 《全网最基础AI渗透教程》video-demo 结合分析

分析日期：2026-10-05
被测对象：`illli-studio/motions` 全量本地镜像（1262 个动效包 / 9,480 文件 / 616 MB）
对照对象：`C:\Users\UncleC\Desktop\【AI城】\全网最基础AI渗透教程\video-demos`（68 镜 HTML + `_模板_底盘.html` + `_可视化规范v4.md`）

---

## 0. 一句话结论

**能结合，而且比 Remotion 那条线更适合你**——因为 UI2V 的包本身就是「单文件 HTML + 一条 paused 的 GSAP 时间轴」，和你的底盘是同一类东西（都被时间驱动、都可冻结、都是 1920×1080）。

但**别整包当镜头用**：它的节奏、配色、字体、数字都是为了录屏演示设计的，直接搬会同时违反你规范里的 §2.6 实体锁色、§2.7 字体轮换、§2.4 数字白名单和 §2.5 禁止伪造回显。

正确用法是**摘它的「画面层 + 暂停时间轴」，挂到你自己的 cue 系统上**。这条路技术上是通的，而且有一个现成的官方接口可以直接用（`window.__timelines`，见第 4 节）。

---

## 1. 模板位置

### 本地根目录

```
C:\Users\UncleC\Desktop\UI2V动效库\01_动效库\itelmn\
```

每个动效一个目录，结构统一：

```
<slug>/
├── registry-item.json     # 元数据：title / duration / dimensions / tags / files[]
├── index.html             # 入口（部分包叫 <slug>.html）
├── shared/ 或 assets/     # 样式、字体、图片、音视频
└── src/                   # 少数多文件工程才有（自带 scene 引擎）
```

### ⚠️ 怎么看效果（实测踩到的坑）

**直接双击 `index.html` 是看不到动画的**——全库 1,225 个包统一写成 `gsap.timeline({ paused: true })`，而且**没有任何一处调用 `.play()`**。叠加 `.from()` 默认 `immediateRender` 会把元素先摆到"不可见"初始态，所以你打开只会看到一个近乎空白的冻结帧。

三种看法：

| 方式 | 怎么做 |
|---|---|
| **① 控制台播一下（最快）** | 打开 `index.html` → F12 → 输入 `window.__timelines[Object.keys(window.__timelines)[0]].play()` |
| **② 精确定位某一帧** | 同控制台：`window.__timelines['t1-ov-duallist'].pause(2.4)`（秒） |
| **③ 已做好的预览副本** | `04_预览\kallaway-t1-overview-duallist.html`——我在原文件末尾注入了一段 autoplay（空格暂停 / `r` 回零 / `e` 播放），双击即播 |

> 这个"默认暂停"的性质不是缺陷，正是它适合接你 cue 系统的原因（见第 3 节）。但也意味着**不能指望"看到什么就是什么"**，得主动 seek。
> 预览副本仅对「单 HTML 且不依赖 `assets/`」的包有效（859 个）；依赖本地素材的包移动路径后素材会 404，需原地看。

需要联网（GSAP 走 `cdn.jsdelivr.net`）。

### 三个辅助文件（先看这个，别一上来翻 1262 个目录）

| 文件 | 用途 |
|---|---|
| `03_清单与索引\ui2v_motions_index.csv` | 全部 1262 条：slug / 标题 / 时长 / 尺寸 / 标签，可用 Excel 筛 |
| `03_清单与索引\ui2v_母版映射.md` | 已按你的 N1–N19 / W1–W4 母版分好组，每格列出最相关的 slug |
| `03_清单与索引\INDEX.md` | 整个动画库镜像的总索引（含 Remotion / HyperFrames / UI2V 三部分） |

### 按用途直取的入口

| 想看什么 | 去哪 |
|---|---|
| **设计系统（最有价值）** | `kallaway-t1-overview-*`（约 300 个，全部 1920×1080） |
| 卡片装饰件 | `kallaway-lb-*`（badge / metric / step / warning / quote…）、`kallaway-lt-*`（chapterbar / nameplate3d / ticker…） |
| 原子动效 | 带 `motion-primitive` 标签的 160 个，如 `binary-decrypt`、`blur-resolve`、`bottom-up-letters`、`ascii-trail-reveal` |
| 微交互原语 | 带 `video-primitive` 标签的 30 个，如 `badge-pop`、`number-pop-in`、`icon-swap`、`menu-morph`、`dynamic-grid` |
| 标题/开场 | `hero-*` 系列 78 个，如 `hero-blueprint-draw`、`hero-barcode-scan`、`hero-checklist-pop` |
| 完整长片工程（学结构用） | `aisoc-lesson-5-1`、`actova-launch-film-wide`、`clickup-demo` |
| 离线可用的 GSAP 副本 | `code-slice-hero\assets\gsap-3.14.2.min.js`（另有 42 个包自带，共 43 个） |

---

## 2. 库的体检数据（实测，非估计）

| 指标 | 数值 | 对你的意义 |
|---|---|---|
| 动效包总数 | 1262 | — |
| **1920×1080（可直接套）** | **1150** | 与你的舞台尺寸完全一致，不用换算 |
| 竖屏 1080×1920 / 720×1280 | 112 | 直接排除 |
| 注册 `window.__timelines` | **1225** | 官方 seek 接口，接你的 cue 系统靠它 |
| 用 `window.__hyperframes` 变量 API | 346 | 可按参数改文案/配色，不必改代码 |
| 单 HTML 包 | 859 | 摘取成本低 |
| 多文件包（自带 scene 引擎） | 403 | 结构复杂，不建议直接抄 |
| GSAP 来源 | jsdelivr 1110 / cdnjs 44 / 本地副本 43 | 本地那 43 个可以直接拿来 vendored |
| 标签 `style-card` | 406（**全部 1920×1080**） | 一套成体系的版式卡，最对口你的母版 |
| 标签 `student-kit` | 420 | 教学向模板 |
| 标签 `motion-primitive` | 160（全部 1920×1080） | 原子动效，可拆件用 |
| 标签 `cliporous` | 35（全部竖屏） | 白名单外的，别浪费时间 |

---

## 3. 你的底盘 vs 动效包：差异对照

| 维度 | 你的 `_模板_底盘.html` | UI2V / HyperFrames 动效包 |
|---|---|---|
| 时间源 | 自建虚拟时钟（劫持 `performance.now` + `rAF`），黑场「启动播放」后起走 | 没有时钟概念，只有一条 `gsap.timeline({paused:true})` |
| 播放控制 | `on(ms, fn)` 绝对 cue + `tws.push({t,d,e,f})` 补间 | 完全靠外部 seek：`tl.time(秒)` |
| 时间轴注册 | 无（cue 散在脚本里） | `window.__timelines["<composition-id>"] = tl` |
| 动画实现 | CSS transition + class 切换 + JS 补间 | GSAP tween / fromTo |
| 尺寸 | `#stage` 1920×1080，自动等比缩放 | `data-width/height`，1150 个正好也是 1920×1080 |
| 依赖 | 仅 Google Fonts + `Shark-GIF/` | GSAP **CDN**（jsdelivr/cdnjs）+ 部分自带字体 |
| QA 冻结 | `#auto,t=毫秒` → 停 tick + 禁用 transition | 没有；但因为它是 paused 的，你不动它它就不动 |
| 音效 | `__sfx` 六个合成音（pop/whoosh/type/ding/thud/swipe） | 部分自带音轨 / 无音效 |

**关键结论**：动效包默认是「冻结的」，节奏完全由调用方决定。这个性质**恰好和你「cue 逐句对齐口播」的要求是天然契合的**——比 CSS 动画那套好接得多。

---

## 4. 三种结合方案

### 方案 A：只抄视觉层（成本最低）
把动效的 **CSS + DOM 结构**复制进你的 ③④ 区，动画用你自己的 `tws` 重写。

- 适合：N9 结论大字、N13 双列、N16 概念卡这类结构简单、动效只是「入场 + 定格」的页面
- 成本：每页 20–40 分钟
- 风险：低。完全不引入新依赖

### 方案 B：摘「暂停时间轴」挂到 cue 上（**推荐**）
把动效的 DOM + 样式 + 脚本原样搬进镜头页，只改两处：把 GSAP 换成本地副本、把时间轴交给你的 cue 驱动。

```html
<!-- ③ 动效原本的 <style> 原样贴进来 -->

<!-- ④ 动效原本的 DOM 原样贴进来 -->

<!-- ⑤ 之前：把 CDN 换成本地 vendored gsap -->
<script src="Shark-GIF/../_vendor/gsap.min.js"></script>
<!-- 动效原本的 <script> 原样贴进来（它会自己注册 window.__timelines） -->
<script>
  // —— 接管时间轴 ——
  const HFTL = window.__timelines['t1-ov-duallist'];  // id 就是动效的 composition-id
  HFTL.pause().time(0);                                // 确保姿态可控

  // 用法一：整段映射（把 4 秒动效摊到 12 秒，贴合口播节奏）
  on(2600, () => {
    tws.push({ t: 2600, d: 12000, e: eo, f: p => HFTL.time(p * 4.0) });
  });

  // 用法二：按口播拆拍（每句口播触发动效里的一段）
  on(2600,  () => HFTL.time(0.0));   // 2:41「先看这张表」
  on(7800,  () => HFTL.time(1.6));   // 2:46「左边这一栏」
  on(12400, () => HFTL.time(3.1));   // 2:51「右边这一栏」
</script>
```

四条硬要求：

1. **GSAP 必须本地化**。你规范 §2.12 禁止除 Google Fonts 外的外链，而 `--virtual-time-budget` 的无头 QA 遇到 CDN 抖动会直接拍出空白帧。从 `code-slice-hero\assets\gsap-3.14.2.min.js` 拷一份到 `video-demos\_vendor\gsap.min.js` 即可。
2. **不要用 iframe 套**。你的 QA 走 `file://`，Chromium 把 iframe 当不透明源，`contentWindow` 拿不到，通信和 seek 都会失效。必须**内联进同一个文档**。
3. **进来先 `.pause()`**，并且在 QA 冻结时确认没有 `tl.play()` 被漏掉（paused 时间轴不受你停 tick 的影响，这正是我们要的）。
4. **尺寸**：1150 个包是 1920×1080，可直接用；若挑到 720p 的，要把字号/间距等比放大 1.5 倍。

- 成本：第一页 1–1.5 小时（含摸接口），之后每页 30–50 分钟
- 收益：拿到一整套成品级动效，不用从零写

### 方案 C：整包当独立镜头录屏（补充手段）
把动效单独渲染成 mp4，剪进片子，不参与口播对齐。

- 适合：`motion-primitive` 里的氛围/转场（`halftone-field`、`shot-glitch-displace`、`chromatic-aberration-wipe`）、开场（`hero-*`）
- 不适合：任何需要跟着口播逐句出现的卡片

---

## 5. 母版映射短名单（可直接开工）

从 `ui2v_母版映射.md` 里挑出的最值得试的对应关系：

| 你的母版 | 推荐 slug | 备注 |
|---|---|---|
| N8 清单·条目 | `kallaway-t1-overview-checklist`、`hero-checklist-pop` | 直接对口 |
| N13 双列对照 | `kallaway-t1-overview-duallist`、`-featurecompare`、`-tiercompare` | 三个粒度可选 |
| N12 快照/回滚时间线 | `kallaway-t1-overview-timeline`、`-milestones`、`-roadmap` | |
| N5 数据大字卡 | `kallaway-t1-overview-kpirow`、`kallaway-lb-metric`、`-counter`、`apple-money-count` | 注意 §2.4 数字白名单 |
| N4 数字对撞 | `kallaway-lb-deltachip`、`-percent`、`number-pop-in` | |
| N10 嵌套架构 | `kallaway-t1-overview-layers`、`-nested`、`-levels` | 对应镜 12「电脑中的电脑」 |
| N11 汇总/对账 | `kallaway-t1-overview-summary`、`-vstable`、`-matrix` | 对应镜 66 三准备对账 |
| N15 机制闸门 | `kallaway-t1-overview-flow`、`-funnel`、`-pipeline` | 对应镜 43 证据闸门 |
| N17 三步/循环 | `kallaway-t1-overview-steps`、`-cycle`、`-phases` | 对应镜 27 / 36 |
| N14 信息卡+时间线 | `kallaway-t1-overview-agenda`、`-toc`、`-journey` | |
| N3 翻车时间线 | `process-flow-bounce-wow`、`15-process-flow` | 需要自己加「逐级恶化」的状态色 |
| N2 命令行祛魅 | `terminal-window`、`terminal-simulator`、`ascii-trail-reveal`、`binary-decrypt` | ⚠️ 见第 6 节红线 |
| N1 开场氛围 | `hero-blueprint-draw`、`hero-barcode-scan`、`yt-lcd-background`、`halftone-field` | 扫描线/网格，同族气质 |
| W1–W4 写实仿真 | 无直接对口 | 库里 UI 复刻类（`cliporous`）全是竖屏，只能借控件样式 |

---

## 6. 风险与红线（必须先看）

1. **§2.5 禁止伪造回显——这条和 `terminal-window` / `terminal-simulator` / `code-typing` 类动效直接冲突**。这些包会逐行打出命令与输出。要用，必须把内容替换成你的抽象样式（英文感线条 + 光标闪烁，不写真实回显），或者只借它的窗口外框（`.term-bar` 三个圆点 + 标题栏）而不要它的打字逻辑。
2. **授权**：`motions` 仓库没有 LICENSE，且包描述里大量标注来源是其它社区仓库（如 `dgcruzing/hyperslides-hyperframes-educational-catalog`）。自己改着用没问题，**对外发布/商单前要回原站确认**。
3. **配色要重刷**：动效配色五花八门，必须按 §2.6 改到你的色族（flag 品红 / AI 青 / 风险橙红 / git 绿 / 命令行琥珀 / 隔离靛紫）。
4. **字体要换**：动效自带字体栈（很多是 Inter / Space Mono 一类），和你 §2.7「每页 2–4 个 Google Fonts 且页间不重复」冲突，统一时注意别把主组合撞了。
5. **数字纪律**：动效里的示例数字（如某教育模板写着「revenue targets by 24%」）**绝不能**跟着搬进去，全靠 §2.4 白名单自己填。
6. **别碰 403 个多文件包**：它们自带 scene 引擎和构建脚本（`src/scenes/*.js`），摘取成本远高于收益。
7. **音效**：动效里自带的音轨（`.agents/skills/changelog-video` 之类）和你的 `__sfx` 是两套体系，混用会打架，建议只用 `__sfx`。

---

## 7. 建议的下一步

1. **先做 1 页试点**：拿 `kallaway-t1-overview-duallist`（对应 N13 双列对照卡）套进 `shot-0-14_快照与git.html` 的骨架，验证「本地 gsap + `window.__timelines` + cue 驱动」这条链在你的 QA 流程（Edge 无头 + `#auto,t=`）里能不能跑通、能不能冻结。
2. 试点过了再批量：优先 N13 → N5 → N8 → N11，这四类在 68 镜里出现频次最高。
3. 把 `_vendor\gsap.min.js` 一次性放到项目里，后面所有页面复用。**注意你的 `video-demos\` 目前还没有 `_vendor\` 目录，要新建。**
4. 选包时先用第 1 节的三种方式看效果（推荐控制台 `.play()`，或 `04_预览\` 里的副本模式），别靠猜 slug 名。
5. 若确认长期用，建议在 `video-demos\` 下建 `_动效件\` 放摘好的组件库（每件一个 HTML 片段或一段可复用 `<style>+<script>`），避免每页重新从 1,262 个包里翻。
