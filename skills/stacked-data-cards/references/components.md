# Stacked Data Cards — 组件规格

所有组件的动画都遵循同一原则：**卡片 `.active` 时才触发**，通过 CSS 级联延迟或 JS `reveal()` 依次入场。延迟从卡片入场后 ~300ms 起算，末个动画结束须早于切卡时刻 1.5s。

---

## 1. 折线对比图（趋势论证）

```html
<svg class="chart-svg" viewBox="0 0 860 340">
  <line class="grid-line" .../>            <!-- 浅灰网格 #f3f4f6 -->
  <path class="line-safe"  d="M 90 200 L 770 200"/>          <!-- 水平线：灰 -->
  <path class="line-syntax" d="M 90 240 L ... L 770 85"/>    <!-- 趋势线：--accent -->
  <circle class="dot syntax" cx="770" cy="85" r="6"/>        <!-- 端点 -->
  <text class="end-label syntax" x="790" y="90">语法↑</text>  <!-- 末端标注 -->
</svg>
```

- 描边：`getTotalLength()` 初始化 `stroke-dasharray = dashoffset = len`，强制重绘后 `transition: stroke-dashoffset 1.5s var(--ease-out)`，激活时置 0
- 数据点：`scale(0) → scale(1)` + `var(--ease-elastic)`，stagger 120~250ms
- 水平灰线可加 `wiggle` 抖动 + thud 音效强调"停滞"
- X 轴标签可 `rotate(30)` 防重叠；角注标来源

## 2. 大数字 + 环形仪表

```html
<div class="big-number count-up" data-target="45" data-suffix="%">0%</div>
<svg viewBox="0 0 100 100">
  <circle class="gauge-track" cx="50" cy="50" r="45"/>     <!-- 轨道 #f3f4f6 -->
  <circle class="gauge-progress" cx="50" cy="50" r="45"/>  <!-- 进度：渐变 -->
</svg>
```

- 大数字：`clamp(4rem, 12vw, 7rem)`、900 字重、渐变色文字（`background-clip: text`）
- 仪表：周长 `2π×45 ≈ 283`，`stroke-dashoffset: 283 → 283×(1-p)`，`transform: rotate(-90deg)` 从顶部起画
- count-up：`eased = 1 - (1-p)³`，支持 `data-prefix / data-suffix / data-decimals / data-delay / data-duration`

## 3. 对比条

```html
<div class="bar-row">
  <span>AI 生成</span>
  <div class="bar"><div class="bar-fill ai"></div></div>
  <span class="count-up" data-target="45" data-suffix="%">45%</span>
</div>
```

- 填充由 `.card.active .bar-fill { width: X% }` 触发，`transition: width 1s var(--ease-out)`
- 两行之间 delay 错开 200~300ms；危险方用 `--accent` 渐变，对照方用 `--green` 渐变

## 4. 数据表格（行内迷你条形）

- `tbody tr` 初始 `opacity: 0; translateY(12px)`，`.card.active` 下按 `nth-child` 级联（150ms 间隔）
- 单元格内条形：`<div class="td-bar"><div class="td-bar-fill" style="--target-width:62%"></div></div>`，`width: 0 → var(--target-width)`
- 数值列用 tabular-nums + count-up，与条形同 delay

## 5. 图标卡组

- 3 栏 grid，每卡：SVG 图标 + 标题 + 描述 +（可选）细节列表 `trap-detail`
- 入场：`translateY(30~40px) scale(0.92) → 原位`，stagger 200~400ms
- hover：`border-color` 主题色描边
- 细节列表项再按 150ms 二级级联

## 6. 金句横幅

```html
<div class="banner">Scaling Law <strong>解决不了</strong> 安全问题</div>
```

- 通栏 `--accent` 色块、白字、居中，`translateY(20px) scaleX(0.96) → 原位`
- 是每张卡的"结论句"，在该卡数据展示完后入场（通常 T+2s 左右）

## 7. 角色小场景 + 逻辑链

- 圆形头像（`border-radius: 50%` + 彩色描边）+ 身份标签 pill
- 气泡：`speech-bubble`，弹性 `scale(0.9)→1`，底部 `::after` 三角
- 流程箭头依次 `visible` + `lit`（主题色点亮）
- 逻辑链：`代码能编译 → 审得更松 → 漏洞拖到生产才暴露`，步骤依次高亮（`opacity 0.35 → 1`）

## 8. 角注

- 卡片右下角，mono 字体、`--muted` 色，`fade-in` 即可
- 格式：`{机构} {年份} · {样本量}`，如 `Veracode 2025 · 100+ 模型 · 80 任务`

## 音效：thud

```js
const ctx = new AudioContext();
osc.type = 'sine';
osc.frequency.setValueAtTime(80, ctx.currentTime);
osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
```

- 仅用于关键揭示（金句弹出、停滞线抖动），每卡 ≤1 次
- 整体 try/catch，浏览器自动播放策略拦截时静默失败
