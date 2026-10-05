---
name: ui2v-motions
description: UI2V 动效库——1,262 个 GSAP 动效包（616MB 全量离线镜像，源自 ui2v.com / illli-studio/motions）+ 按镜头用途的选型索引 + 接入演示动画的完整配方。给视频演示页/产品页/落地页挑选和嵌入高质量 UI 动效：图表入场、列表滚动、卡片翻转、文字编排、数字滚动、背景循环等即插即用。只要用户提到：UI 动效、动效库、ui2v、GSAP 动效素材、给演示页加动效、motion 素材、页面动效不够炫——就用本 Skill。与 swiss-shot-demos / video-shot-demos 等演示动画技能配套：动效包的 paused GSAP 时间轴可直接挂到 cue 时间轴上驱动。
---

# UI2V 动效库（1,262 个 GSAP 动效包 · 全量离线镜像）

ui2v.com（UI-to-video 动效社区）背后 motions 仓库的全量本地镜像：**1,262 个动效包**（9,669 文件 / 641MB），每个包 = 单文件 HTML + 一条 **paused 的 GSAP 时间轴**（1920×1080 为主）——与自建演示底盘同构（时间驱动/可冻结/可 seek），是演示动画页"画面层"的即插即用素材库。

## 怎么选（别翻 1,262 个目录！）

先查 `03_清单与索引/`：

| 文件 | 用途 |
|---|---|
| **`镜头用途总览.md`** | **按"你要讲什么"查件的主入口**：25 类逐类讲解 + 1,262 条全量用途表（含适合挂哪个母版） |
| `ui2v_motions_index.csv` | 全量清单：slug/标题/时长/尺寸/标签，可编程筛 |
| `ui2v_母版映射.md` | 已按视频母版 N1–N19 / W1–W4 分好组的短名单 |
| `UI2V动效库_结合分析.md` | 结合方案 + 代码示例 + 红线清单 |

**硬过滤**：只取 1920×1080（1,150 个符合）；竖屏 1080×1920/720×1280 共 112 个排除；403 个多文件包（自带 scene 引擎/构建脚本）摘取成本高，慎碰。

## 怎么看效果（不看不选件）

双击 `index.html` 只会看到**空白冻结帧**——全库统一 `gsap.timeline({paused:true})` 且无 `.play()`。三种看法：

1. 控制台播放：`window.__timelines[Object.keys(window.__timelines)[0]].play()`
2. 定位某帧：`window.__timelines['t1-ov-duallist'].pause(2.4)`
3. `04_预览/` 的 autoplay 副本（双击即播；仅对不依赖 assets/ 的单文件包有效）

需联网（GSAP 走 cdn.jsdelivr.net）。

## 怎么接入演示页（核心配方）

摘画面层 + 暂停时间轴，挂到自己的 cue 系统上：

```js
const TL = window.__timelines['t1-ov-duallist'];
TL.pause().time(0);
// 整段映射：4s 动效摊到 12s 贴合口播
on(2600, () => tws.push({ t: 2600, d: 12000, e: eo, f: p => TL.time(p * 4.0) }));
// 或按口播拆拍
on(7800,  () => TL.time(1.6));   // 「左边这一栏」
on(12400, () => TL.time(3.1));   // 「右边这一栏」
```

**四条硬约束**：
1. **GSAP 本地化**（禁 CDN 外链；库内 43 个包自带 `gsap-3.14.2.min.js` 可直接拷，如 `01_动效库/itelmn/code-slice-hero/assets/`）；
2. **禁 iframe**——`file://` 下 contentWindow 取不到，seek 失效；必须内联同文档；
3. 进来先 `.pause()`，QA 冻结核路径上不能漏 `.play()`；
4. 720p 包按 1.5 倍等比放大字号间距。

## 红线（选件与改造）

- `terminal-window` / `terminal-simulator` / `code-typing` 类会**逐行打真实终端回显**——与"禁止伪造终端回显"冲突：只借窗口外框（三圆点+标题栏），弃打字逻辑；
- 包内示例数字（如写死的 "24%"）**绝不照搬**，按项目数字白名单填；
- 配色/字体按宿主项目规范重刷（包自带多为 Inter/Space Mono）；
- 包自带音轨与 `__sfx` 两套体系，只用 `__sfx`；
- motions 仓库本身无 LICENSE、部分素材源自其它社区——自用无碍，**对外发布/商单前回 ui2v.com 原站确认授权**。

## 目录结构

```
ui2v-motions/
├── SKILL.md / README.md         ← 本文件与人类文档
├── _先看这里.md                  ← 镜像总指南（快速上手）
├── 01_动效库/itelmn/<slug>/      ← 1,262 个动效包本体（registry-item.json + index.html + assets）
├── 02_官方CLI与文档/             ← ui2v 官方 CLI 源码 + 官方 Skill + 双语文档
├── 03_清单与索引/                ← 选型主入口（镜头用途总览/CSV/母版映射/结合分析）
├── 04_预览/                      ← autoplay 注入的可直开预览副本
└── 05_抓取日志/                  ← 镜像完整性校验证据（9,480/9,480 无缺失）
```

## Token 纪律

- **禁止通读** `01_动效库`（9,669 文件）；也勿整读 `镜头用途总览.md` 全表——先按 25 类目定位，再窗口读对应段；
- 看中一个包后，读它的 `registry-item.json`（元数据小文件）+ 按需窗口读 `index.html` 关键段（时间轴结构/图层名）；
- 与 swiss-shot-demos 配合时，动效包并入后按其瑞士 tokens 换肤。
