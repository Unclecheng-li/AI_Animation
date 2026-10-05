# 影刀短视频 · 视觉宪章

> HyperFrames 会自动读取此文件作为**品牌真理源**。本目录及未来同源 composition
> 一律遵循。修改色 / 字体 / 间距前先改这里,再改 composition,而不是反过来。

---

## Mood

浅色 · 紫色调 · **安静且自信**。让视觉为故事服务,不抢戏。

参考:Linear / Anthropic / Read.cv 的克制美学;Cosmos.so 的紫调氛围。

---

## Palette

| Role            | Hex       | Tailwind 引用 | 用途                                          |
| --------------- | --------- | ------------- | --------------------------------------------- |
| bg-base         | `#f5f3ff` | iris-50       | 顶层背景起色                                  |
| bg-soft         | `#ede9fe` | iris-100      | 背景中段                                      |
| bg-deep         | `#ddd6fe` | iris-200      | 背景落地色                                    |
| accent          | `#7c3aed` | iris-600      | **品牌主紫**(button / dot / 渐变焦点)       |
| accent-soft    | `#a78bfa` | iris-400      | 渐变伴生色                                    |
| accent-deep    | `#6d28d9` | iris-700      | hover / 深态                                  |
| text-primary    | `#4c1d95` | iris-900      | 大标题                                        |
| text-secondary | `#5b21b6` | iris-800      | 描述                                          |
| text-muted      | `#7c3aed` | iris-600      | Eyebrow / 小标签                              |
| ink             | `#1a1a1a` | -             | body 字色(很少用,通常用 iris-9xx 替代)      |
| white           | `#ffffff` | -             | pill 文字 / glass 透贴                        |

**Gradient**:

- 背景:`linear-gradient(180deg, #f5f3ff 0%, #ede9fe 45%, #ddd6fe 100%)`
- 文字 accent:`linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)` + `background-clip: text` + `color: transparent`
- Glow:`radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, transparent 70%)`

---

## Typography

- **主字体**:`Inter`(英文/拉丁) + `Noto Sans SC`(中文)
- **系统兜底**:`system-ui, sans-serif`
- **禁止**:PingFang SC(hyperframes 无 deterministic mapping)、Roboto(已 mapped 到 Inter,但语义弱)

### 字号阶梯(@ 1080×1920 9:16)

| Role          | Size  | Weight | Letter-spacing | Line-height | 备注                     |
| ------------- | ----- | ------ | -------------- | ----------- | ------------------------ |
| Display       | 168px | 800    | -0.02em        | 1.02        | 主标题(.title)         |
| Headline      | 96px  | 800    | -0.01em        | 1.10        | 章节                     |
| Eyebrow       | 36px  | 600    | 0.18em         | -           | **uppercase**            |
| Body          | 40px  | 400    | -              | 1.5         | 描述                     |
| Caption / CTA | 32-48px | 600  | -              | -           | pill 内 / badge          |
| Micro         | 28-32px | -     | -              | -           | 元数据                   |

### Numbers

需要展示数字时:`font-variant-numeric: tabular-nums` 让数字等宽对齐。

---

## Corners(圆角)

| Element            | Radius   |
| ------------------ | -------- |
| Pill / 按钮         | 80-100px |
| Card / Badge        | 60px     |
| 小元件 / kbd        | 12-20px  |
| 锐边                | 禁用     |

---

## Spacing

- **scene-content padding**:`200px 100px`(纵向呼吸非常大)
- **gap 阶梯**:18px(密)/ 24px(标准)/ 36px(中)/ 60px(组间)
- **元素间最小间距**:18px

---

## Depth(阴影 / 光晕)

| Tier              | Shadow                                                              |
| ----------------- | ------------------------------------------------------------------- |
| Card              | `0 10px 30px -10px rgba(124, 58, 237, 0.25)`                        |
| Pill / Floating   | `0 20px 50px -15px rgba(124, 58, 237, 0.5)`                         |
| Glow(装饰图层)    | `radial-gradient(...)` 见 Palette 段,不是 box-shadow                |

避免:线性 box-shadow(灰色)、纯黑阴影。

---

## Motion(GSAP)

### 入场 eases(轮换使用,至少 3 种 ease per scene)

- `power3.out` — 标题、重要文字(快进慢出,稳)
- `expo.out` — 横向滑入(更戏剧)
- `power2.out` — 辅助元素(柔)
- `back.out(1.6)` — 按钮、活泼元素(有弹性)
- `sine.inOut` — 持续运动 / yoyo

### 时长

- 单元素入场:0.5-0.9s,**最长不超 1.2s**
- Stagger 间隔:0.2-0.3s
- 第一个动画从 **t=0.2s** 开始(避免 t=0 突兀)

### 出场(只允许 final scene)

- `power2.in` 退场
- 全 composition fade out:opacity 1→0 over 0.4-0.5s

---

## Do's and Don'ts

### ✅ 做

- 用渐变背景制造空间深度
- 紫色光晕作为装饰图层(右上 / 左下错位,非对称)
- 大圆角 + 大字号 + 大留白
- 文字 accent 用渐变 clip 形成视觉焦点
- Hover 才出元信息(留白即设计)
- 至少 3 种 ease 混合
- 偏移第一个动画(t≥0.2s)

### ⛔ 避

- 黑色背景 + 白字(违反浅色宪章)
- 锐角矩形(违反圆角宪章)
- 字号低于 28px(竖屏识别困难)
- 同色系硬切(必须有渐变/转场)
- **全屏线性渐变**(H.264 banding —— 必须 radial 或 solid + glow)
- `Math.random()` / `Date.now()`(非确定性,hyperframes 禁止)
- `repeat: -1`(无限循环,hyperframes 禁止)
- `<br>` 在 body 文本里(只在 display 标题分行用)

---

## 兼容性

- **主**:1080×1920 (9:16) — 抖音 / TikTok / Bilibili 竖版
- **副**:1920×1080 (16:9) — Bilibili 横版 / 演示
- **字体来源**:Google Fonts(hyperframes 自动 cache 到 `~/.cache/hyperframes/fonts`)
- **浏览器**:hyperframes 用 headless Chrome,无需用户浏览器兼容
