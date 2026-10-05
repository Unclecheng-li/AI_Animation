> ⚠️ 本目录说明：动效库已整理到桌面 `UI2V动效库\`，本文件里的相对路径已按新结构改写。
> 但 `INDEX.md` 原本是整个动画库（Remotion / HyperFrames / UI2V 三部分）的总索引，本次**只把 UI2V 部分复制到了桌面**；
> 文中出现的 HyperFrames（`src/hyperframes/`）与 Remotion（`src/remotion/`）路径**不在本文件夹内**，仍在工作区 `C:\Users\UncleC\WorkBuddy\2026-10-01-17-06-08\anim-libs\` 下。

# 动画库本地镜像：Remotion + HyperFrames + UI2V

抓取日期：Remotion / HyperFrames / 社区 Skill 部分 2026-10-01；UI2V 部分 2026-10-05（含**全量媒体素材**，均为各仓库 `main` 分支最新提交）
根目录：`C:\Users\UncleC\Desktop\UI2V动效库\`
抓取方式：GitHub Trees API 列目录 → 按路径过滤 → 逐文件拉取落盘（镜像代理 + 16 线程分片）
总规模：`src/` 共 **11,260 文件 / 630 MB**
完整性校验：UI2V `illli-studio/motions` 仓库 9,480 文件 / 616.35 MB —— **本地 9,480，0 缺失**（`_final_full.txt` / `_missing_full.txt`）

---

## 一、总览

| 来源 | 仓库 | 文件数 | 体积 | 许可 | 可直接复用? |
|---|---|---|---|---|---|
| Remotion 动画内核 | `remotion-dev/remotion` | 214 | 1.08 MB | Remotion License（源码可得，非 OSI 开源） | 抄数学/思路可以，整段搬要留意 |
| HyperFrames 官方组件库 | `heygen-com/hyperframes` | 1,214 | 10.4 MB | **Apache-2.0** | ✅ 可放心改 |
| HyperFrames Animation Skill（社区） | `firstsun-dev/skills` | 244 | 2.34 MB | 仓库未见 LICENSE | 当参考资料 |
| **UI2V 动效社区库** | `illli-studio/motions` + `illli-studio/ui2v` | **9,600** | **616.9 MB** | 仓库未见 LICENSE | ⚠️ 见第八节 |

---

## 二、Remotion（React 系，帧驱动）

路径：`src/remotion/packages/`

### 1. 动画原语 `core/src/`（8 文件 / 71.7 KB）—— 最值得抄的部分

| 文件 | 内容 |
|---|---|
| `easing.ts` | `Easing` 全类：linear/quad/cubic/poly/sin/circle/exp/elastic/back/bounce/bezier + `in/out/inOut` 修饰器 + `Easing.spring()`（把弹簧压成 30 帧缓动曲线） |
| `bezier.ts` | 三次贝塞尔求值（牛顿迭代 + 二分兜底） |
| `interpolate.ts` | 多段插值、extrapolate clamp/extend、CSS transform 字符串插值、数值元组插值 |
| `interpolate-colors.ts` | 颜色插值 |
| `spring/index.ts` `spring-utils.ts` `measure-spring.ts` | 弹簧物理：阻尼比 ζ、欠阻尼/临界阻尼两套解析解 + 缓存；默认 `{damping:10, mass:1, stiffness:100}`；`measureSpring()` 预测量动画时长 |

> 这批是纯函数，不依赖 React，数学部分可以直接抽出来给任何引擎用。

### 2. 转场 `transitions/src/`（21 种 presentation / 105 KB）

`fade` `slide` `wipe` `iris` `clock-wipe` `flip` `dissolve` `ripple` `film-burn` `dreamy-zoom` `cross-zoom` `crosswarp` `blur-slide` `linear-blur` `push-cut` `swap` `book-flip` `zoom-blur` `zoom-in-out` `none`
配套：`TransitionSeries.tsx`（33 KB，转场编排）、`timings/{linear-timing,spring-timing}.ts`、`html-in-canvas-presentation.tsx`

### 3. 特效 `effects/src/`（131 文件 / 807 KB）
WebGL 着色器特效，79 个顶层效果：blur / glow / chroma-aberration / pixelate / halftone / zigzag / waves / venetian-blinds / tv-signal-off / light-trail / paper / emboss / thermal-vision / lut / corner-pin …

### 4. 其他
- `animation-utils/`：interpolateStyles、make-transform（`transform-functions.ts` 14 KB）
- `motion-blur/`：`CameraMotionBlur` `Trail` `HtmlInCanvasMotionBlur`
- `gsap/src/use-gsap-timeline.ts`（20 KB）：把 GSAP 时间轴对齐到 Remotion 帧时钟
- `noise/src/index.ts`

---

## 三、HyperFrames（HTML 原生，seek 驱动）

路径：`src/hyperframes/`

### 1. 组件库 `registry/`（1,096 文件 / 9.2 MB）—— 这是真正的"动画库"

`registry.json` 共 **394 个条目**：

| 类型 | 数量 | 说明 |
|---|---|---|
| `hyperframes:block` | 164 | 可直接 `npx hyperframes add <name>` 拉走的整段镜头（HTML+CSS+GSAP） |
| `hyperframes:component` | 222 | 可复用组件/效果片段 |
| `hyperframes:example` | 8 | 完整示例 |

单个 block 形如 `registry/blocks/flash-through-white/flash-through-white.html`（12 KB，1920×1080，`data-start/data-duration` + GSAP CDN + 暂停时间轴 `window.__timelines`）。典型：`bar-chart-race`、`camera-dolly-zoom`、`code-morph`、`glitch`、`carousel-orbit-*`、`canopy-part-title`（62 KB）、`frost-sequence-camera-orbit`（171 KB）。

### 2. 帧适配器 `packages/core/src/runtime/adapters/`（15 个）
`gsap` `css` `waapi` `lottie` `three` `animejs` `typegpu` `d3` `leaflet` `mapbox` `maplibre` `google-maps` `video-texture-compat` `seek-dispatch` `_readiness`
→ 即"任何可 seek 的运行时都能接进逐帧渲染"的实现，是 HyperFrames 区别于 Remotion 的核心。

### 3. 运行时内核 `packages/core/src/runtime/`（49 文件 / 652 KB）
`timeline.ts`（30 KB）、`customEase.ts`、`wiggleEase.ts`、`vfx.ts`（59 KB）、`colorGrading.ts`、`clock.ts`、`init.ts`（224 KB）、`window.d.ts` 等。

### 4. 着色器转场 `packages/shader-transitions/src/`
`hyper-shader.ts`（82 KB）、`shaders/registry.ts`（10.6 KB）、`webgl.ts`、`capture.ts`、`seamTransitionLoop.ts`

### 5. 官方 Agent Skills `.agents/skills/`（18 文件）
`motion-doctrine`（运镜教条 + `seam-gate.mjs` 校验脚本 23 KB）、`cut-the-curve`（含 `gsap-implementation.md`）、`seam-craft`、`captions-overlay`、`changelog-video`、`oversized-cursor`

---

## 四、社区 Skill：hyperframes-animation

路径：`src/skills/external/video-design/hyperframes-animation/`

| 目录 | 数量 | 说明 |
|---|---|---|
| `rules/` | 48 | 原子动效配方（kinetic-beat-slam、chromatic-glitch、gradient-text-sweep、asr-keyword-glow…），每条含标签与可运行片段 |
| `blueprints/` | 22 | 多阶段场景模板（brand-reveal、titlecard-reveal、dataviz-countup…） |
| `transitions/` | 16 | 场景间转场 |
| `adapters/` | 12 | GSAP/Lottie/Three/Anime.js/CSS/WAAPI/TypeGPU 等运行时 API 速查 |
| `examples/` | 13 | 可运行 HTML 示例 |
| `scripts/` | 6 | `animation-map.mjs` 等审计脚本 |

**契约（这套东西最值钱的地方）**：单一暂停 GSAP 时间轴 → 双向 seek 安全（`fromTo` + 显式初始态，禁用 `+=`）→ 确定性（禁 `Math.random`/`Date.now`）→ 只动 transform 与 paint 属性（禁 width/left/top）→ 组 stagger 总时长 ≤0.5s → 动画元素上禁止 CSS transition。

---

## 五、给你（HyperAnimation / AI_Animation 动效 Skill 集）的取用建议

| 想要什么 | 拿哪一份 |
|---|---|
| 缓动 + 弹簧数学 | `src/remotion/packages/core/src/{easing,bezier,spring/*}.ts`（纯函数，零依赖） |
| 转场效果 | Remotion 21 种 `presentations/*.tsx`（React）＋ HyperFrames `shader-transitions`（WebGL，HTML 可直接套） |
| 现成镜头/组件 | `src/hyperframes/registry/` 394 个（Apache-2.0，改了就能用） |
| 动效编排规范 | 社区 Skill `rules/` + `blueprints/` 的 seek-safe 契约 |
| 多运行时接入 | `src/hyperframes/packages/core/src/runtime/adapters/` |
| 画面特效 | `src/remotion/packages/effects/`（着色器，需自行重写为你的渲染后端） |
| **现成成片镜头（1262 个）** | `01_动效库/itelmn/<slug>/`，先查 `ui2v_motions_index.csv` |

---

## 六、UI2V 动效社区库（ui2v.com）

### 这是什么

`ui2v.com` 自我定位是 **「UI to video motion community」**——一个面向 AI 工作流的 **HyperFrames 动效资源库**：发现 / 安装 / 发布 / 同步 / 分享动效包。官方把边界划得很清：**创作·预览·渲染归 HyperFrames，分发归 UI2V**。

口号：`让 AI 帮你发现、安装和分享 UI2V 视频动效资源`

### 官方入口（三条）

| 入口 | 用法 |
|---|---|
| CLI（npm `@ui2v/cli`，bin `ui2v`，MIT，v2.0.2） | `npx @ui2v/cli@latest install <slug>` / `ui2v search "logo sting"` / `ui2v list` / `ui2v update --all` / `ui2v inspect <slug>` / `ui2v motion publish ./my-motion --version 1.0.0` |
| Agent Skill | `npx skills add illli-studio/ui2v --skill` |
| 后端 API | `https://ui2v.com/api/v1/motions`（站内 robots.txt 对爬虫 `Disallow: /api/`，所以本次没走 API） |

### 我实际拿到了什么

| 路径 | 内容 | 规模 |
|---|---|---|
| `01_动效库/` | `illli-studio/motions` 仓库 —— **1,262 个动效包**（作者 `itelmn`）的完整源，**含全部媒体素材** | 9,480 文件 / 616.34 MB |
| `02_官方CLI与文档/` | `illli-studio/ui2v` 仓库 —— CLI 源码 + 官方 Skill + 中英双语文档 | 120 文件 / 0.6 MB |
| `ui2v_motions_index.csv` | 全部 1,262 个动效的清单（slug / title / duration / 尺寸 / tags / author） | 由全部 `registry-item.json` 生成 |

**单个动效包的结构**（`01_动效库/itelmn/<slug>/`）：

```
<slug>/
├── registry-item.json   # type: "hyperframes:block"，含 title/description/dimensions/duration/tags/files[]
├── index.html 或 <slug>.html   # 入口 composition（1920×1080，GSAP + 暂停时间轴）
├── SOURCE.md / _meta.json      # 部分包有
└── assets/                     # 可选，图片/音频/视频/字幕
```

**关键数字**
- 动效总数 **1,262**；其中 **144** 个依赖 `assets/` 外部素材，其余 **1,118 个是自包含 HTML**，拿到就能跑
- 标签共 **742 个**，Top 10：`community` 667、`student-kit` 420、`style-card` 406、`motion-primitive` 160、`hyperframes` 133、`hero` 78、`showcase` 76、`heygen` 68、`official` 68、`typography` 58
- 动效里能直接看到来源标注（例如某条写着 *"Original HyperFrames educational template from dgcruzing/hyperslides-hyperframes-educational-catalog"*）——说明这是社区模板的聚合镜像，**不是 ui2v 独家原创**

**全量已下齐**：整个 motions 仓库 9,480 文件 / 616.35 MB 已 100% 落地，含 1,781 个媒体素材（mp4 / mp3 / wav / webm / png，约 606 MB）。动效自带素材可直接用于方案 C（整包录屏）与离线预览。

---

## 七、注意事项

1. **Remotion 许可**：个人及 ≤3 人组织免费商用；**4 人及以上必须买 Company License**（Creators $25/席/月，Automators $0.01/渲染、$100/月起）。代码不是 OSI 开源，别整包搬进 Apache/MIT 项目。
2. **HyperFrames Apache-2.0**，可自由复用（LICENSE 已存 `src/hyperframes/LICENSE.txt`）。
3. 社区 Skill 仓库没看到 LICENSE 文件，只作参考，别直接发布。
4. 未下载：HyperFrames 的 `docs/catalog/blocks/*.mdx`（文档页，约 200 个）、`docs/public/catalog/assets/`（wav/webp 预览素材）、Git LFS 的 mp4 回归基线、Remotion 的渲染/Lambda/Studio 等与动画无关的包。（UI2V 部分已于 2026-10-05 补全，见第六节。）
5. HyperFrames 的 block HTML 默认从 CDN 引 `gsap@3.14.2`，离线渲染前需改成本地资源。
6. **UI2V 两仓库都没有 LICENSE 文件**，且动效描述里大量标注来自其它社区仓库。自用改没问题，**对外发布或商单使用前必须回原站/原作者确认授权**。
7. UI2V 动效包里的字体同样走 Google Fonts CDN，离线渲染要替换。
