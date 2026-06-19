<div align="center">

# AI Animation Skills

**一套用 AI 生成炫酷 HTML 动画的 [Agent Skills](https://support.claude.com/en/articles/12512176-what-are-skills) 集合 · A collection of skills for generating cool HTML animations with AI**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](#contributing)
[![Skills count](https://img.shields.io/badge/Skills-5-orange?style=flat-square)](#skills-gallery)
[![Spec](https://img.shields.io/badge/Spec-SKILL.md-black?style=flat-square)](https://agentskills.io)

[中文](#中文) · [English](#english)

</div>

---

## 中文

### 项目简介

本仓库是基于 WorkBuddy / Claude Code / Cursor 等 AI Agent 的**动效 Skill 集合**。每个 Skill 是一个自包含文件夹，包含 `SKILL.md`（Agent 执行指令）、`README.md`（人类文档）、`references/`（Prompt 参考）和 `assets/`（模板 HTML）。安装后，AI Agent 会根据你的描述自动激活对应 Skill，生成完整的单文件 HTML 动画。

一句话生成：
- 📊 **PPT 风格演示** — 科普、技术讲解、视频配套演示
- 📈 **流程图 / 原理演示** — 流程图、概念图、对比图、时序图、AI 模型可视化等
- 🌐 **网络协议可视化** — TCP/IP、IPv4、以太帧、路由、DHCP 等
- 🏗️ **动态架构图** — 系统架构、流程图、时序图、数据流图、状态机，带流动动画 + 多格式导出
- 📝 **学霸笔记** — 手写笔记本风格的精美 HTML 学习笔记，两种模板风格

<div align="center">

**👇 点击预览图查看各 Skill 详情**

</div>

<table>
<tr>
<td width="50%" valign="top" align="center">
<a href="#ppt-animation"><img src="<!-- IMAGE:ppt-animation-preview -->" alt="ppt-animation preview" width="100%"></a>
<br/><a href="#ppt-animation"><strong>ppt-animation</strong></a>
<br/><sub>PPT 演示 / 翻页动画</sub>
</td>
<td width="50%" valign="top" align="center">
<a href="#flowchart"><img src="<!-- IMAGE:flowchart-preview -->" alt="flowchart preview" width="100%"></a>
<br/><a href="#flowchart"><strong>flowchart</strong></a>
<br/><sub>流程图 / 概念图 / 原理演示</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top" align="center">
<a href="#network-protocol-viz"><img src="<!-- IMAGE:network-protocol-viz-preview -->" alt="network-protocol-viz preview" width="100%"></a>
<br/><a href="#network-protocol-viz"><strong>network-protocol-viz</strong></a>
<br/><sub>网络协议 / 数据包演示</sub>
</td>
<td width="50%" valign="top" align="center">
<a href="#dynami-carchify"><img src="<!-- IMAGE:dynami-carchify-preview -->" alt="dynami-carchify preview" width="100%"></a>
<br/><a href="#dynami-carchify"><strong>dynami-carchify</strong></a>
<br/><sub>动态架构图 / 流程图 / 时序图</sub>
</td>
</tr>
<tr>
<td colspan="2" valign="top" align="center">
<a href="#scholar-notes"><img src="<!-- IMAGE:scholar-notes-preview -->" alt="scholar-notes preview" width="50%"></a>
<br/><a href="#scholar-notes"><strong>scholar-notes</strong></a>
<br/><sub>学霸笔记 / 手写笔记本风格</sub>
</td>
</tr>
</table>

---

### Skills Gallery

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `ppt-animation`

<a href="./skills/ppt-animation">
<img src="<!-- IMAGE:ppt-animation-banner -->" alt="ppt-animation Skill" width="100%">
</a>

**分类:** PPT 演示 / 翻页动画
**适用于:** 视频录制、技术科普、教学演示、直播课件——需要"PPT 翻页 + 元素依次缓入"动画效果的场景。

`ppt-animation` 生成 PPT 风格的单文件 HTML 翻页演示。每次翻页后页面内元素依次缓入出现，支持暗色科技风、暖色报纸风、简约白色、赛博朋克红橙、渐变暗色等多套主题。键盘 / 滚轮 / 点击均可翻页，适配全屏播放和录屏。

亮点:
- 16:9 宽高比，适配全屏播放与录屏
- 每次翻页后元素依次缓入出现（细化到每行文字）
- 5 套内置主题：`dark-tech` / `warm-paper` / `clean-white` / `cyber-red` / `gradient-dark`
- 核心概念用图形化元素（图表、流程图、示意图）展示，不依赖外部图片
- 支持以已有模板为基础重构（`以 assets/xxx.html 为模板演示以上内容`）

<table>
<tr>
<td align="center" width="20%"><a href="./skills/ppt-animation/README.md#主题画廊"><img src="<!-- IMAGE:ppt-theme-dark-tech -->" alt="dark-tech preview" /></a><br /><sub><code>dark-tech</code><br />暗色科技风</sub></td>
<td align="center" width="20%"><a href="./skills/ppt-animation/README.md#主题画廊"><img src="<!-- IMAGE:ppt-theme-warm-paper -->" alt="warm-paper preview" /></a><br /><sub><code>warm-paper</code><br />暖色报纸风</sub></td>
<td align="center" width="20%"><a href="./skills/ppt-animation/README.md#主题画廊"><img src="<!-- IMAGE:ppt-theme-clean-white -->" alt="clean-white preview" /></a><br /><sub><code>clean-white</code><br />简约白色</sub></td>
<td align="center" width="20%"><a href="./skills/ppt-animation/README.md#主题画廊"><img src="<!-- IMAGE:ppt-theme-cyber-red -->" alt="cyber-red preview" /></a><br /><sub><code>cyber-red</code><br />赛博朋克红橙</sub></td>
<td align="center" width="20%"><a href="./skills/ppt-animation/README.md#主题画廊"><img src="<!-- IMAGE:ppt-theme-gradient-dark -->" alt="gradient-dark preview" /></a><br /><sub><code>gradient-dark</code><br />渐变暗色</sub></td>
</tr>
</table>

<sub>↑ 5 套主题一览 — <a href="./skills/ppt-animation/README.md#主题画廊"><b>打开完整画廊</b></a> 查看预览与适用场景。</sub>

Links: [README](./skills/ppt-animation/README.md) · [SKILL.md](./skills/ppt-animation/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `flowchart`

<a href="./skills/flowchart">
<img src="<!-- IMAGE:flowchart-banner -->" alt="flowchart Skill" width="100%">
</a>

**分类:** 流程图 / 概念图 / 原理演示
**适用于:** 视频科普、技术讲解、PPT 配图——需要动画流程图、概念对比、原理演示的场景。

`flowchart` 生成教育/科普类流程图与原理演示的动画 HTML。暗色科技风格，节点发光、箭头流动、数据粒子效果。不只是 AI 模型——任何概念、流程、对比、交互都能用动画呈现。与 `dynami-carchify` 互补：flowchart 偏教育演示（好看 + 直观），dynami-carchify 偏工程架构（精确 + 可导出）。

亮点:
- 7 种图表类型：流程图 / 概念图 / 原理演示 / 时序图 / 对比图 / 时间线 / 系统概览
- AI/ML 模型可视化完整保留（RNN / LSTM / GRU / MLP / Word2Vec / GPU）
- 暗色科技风：深色背景 + 蓝/紫/橙渐变节点 + 发光效果
- 连接线流动动画 + 数据粒子效果，页面始终保持动态感
- 支持自动播放 / 手动步进 / hover 高亮三种交互模式

<table>
<tr>
<td align="center" width="25%"><a href="./skills/flowchart/README.md#支持的图表类型"><img src="<!-- IMAGE:flowchart-rnn -->" alt="RNN preview" /></a><br /><sub><code>RNN</code><br />时间步展开</sub></td>
<td align="center" width="25%"><a href="./skills/flowchart/README.md#支持的图表类型"><img src="<!-- IMAGE:flowchart-lstm -->" alt="LSTM preview" /></a><br /><sub><code>LSTM</code><br />三门门控动画</sub></td>
<td align="center" width="25%"><a href="./skills/flowchart/README.md#支持的图表类型"><img src="<!-- IMAGE:flowchart-gpu -->" alt="GPU preview" /></a><br /><sub><code>GPU</code><br />并行架构</sub></td>
<td align="center" width="25%"><a href="./skills/flowchart/README.md#支持的图表类型"><img src="<!-- IMAGE:flowchart-process -->" alt="process preview" /></a><br /><sub><code>流程图</code><br />攻击链/工作流</sub></td>
</tr>
</table>

<sub>↑ 部分图表预览 — <a href="./skills/flowchart/README.md#支持的图表类型"><b>查看完整图表类型列表</b></a>。</sub>

Links: [README](./skills/flowchart/README.md) · [SKILL.md](./skills/flowchart/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `network-protocol-viz`

<a href="./skills/network-protocol-viz">
<img src="<!-- IMAGE:network-protocol-viz-banner -->" alt="network-protocol-viz Skill" width="100%">
</a>

**分类:** 网络协议 / 数据包演示
**适用于:** 网络课程、安全教育、技术分享——需要动态展示协议交互流程、数据包结构、路由转发的场景。

`network-protocol-viz` 生成网络协议工作原理的动态 HTML 可视化页面。根据协议类型自动选择可视化方式：数据包/帧结构用分层矩形块 + hover 字段说明；交互流程用客户端/服务端时序图 + 数据包流动；路由转发用拓扑图 + 路径动画。必须包含播放/暂停/重置控制。

亮点:
- 支持 TCP/IP / IPv4 / 以太网帧 / 路由 / 交换机 / DHCP / HTTPS / PPP 等协议
- 三种可视化模式：结构展开 / 时序交互 / 拓扑转发
- 协议层颜色区分：物理层(灰) / 链路层(蓝) / 网络层(绿) / 传输层(橙) / 应用层(紫)
- 数据包带发光尾迹沿路径流动
- 安全教育模式：底部自动添加免责声明

<table>
<tr>
<td align="center" width="25%"><a href="./skills/network-protocol-viz/README.md#协议列表"><img src="<!-- IMAGE:net-tcp -->" alt="TCP preview" /></a><br /><sub><code>TCP</code><br />三次握手</sub></td>
<td align="center" width="25%"><a href="./skills/network-protocol-viz/README.md#协议列表"><img src="<!-- IMAGE:net-ipv4 -->" alt="IPv4 preview" /></a><br /><sub><code>IPv4</code><br />数据报 3D</sub></td>
<td align="center" width="25%"><a href="./skills/network-protocol-viz/README.md#协议列表"><img src="<!-- IMAGE:net-routing -->" alt="Routing preview" /></a><br /><sub><code>Routing</code><br />路由表转发</sub></td>
<td align="center" width="25%"><a href="./skills/network-protocol-viz/README.md#协议列表"><img src="<!-- IMAGE:net-https -->" alt="HTTPS preview" /></a><br /><sub><code>HTTPS</code><br />TLS 握手</sub></td>
</tr>
</table>

<sub>↑ 部分协议预览 — <a href="./skills/network-protocol-viz/README.md#协议列表"><b>查看完整协议列表</b></a>。</sub>

Links: [README](./skills/network-protocol-viz/README.md) · [SKILL.md](./skills/network-protocol-viz/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `dynami-carchify`

<a href="./skills/dynami-carchify">
<img src="<!-- IMAGE:dynami-carchify-banner -->" alt="dynami-carchify Skill" width="100%">
</a>

**分类:** 动态架构图 / 流程图 / 时序图 / 数据流图 / 状态机
**适用于:** 技术文档、系统设计评审、安全分析、CI/CD 可视化——需要专业级技术图表（带流动动画 + 多格式导出）的场景。

`dynami-carchify` 生成专业级技术图表的单文件 HTML，包含内联 SVG、暗/亮主题切换、连接线流动动画、沿路径移动的发光粒子。接受自然语言描述或粘贴的 Mermaid 代码，从零开始布局。支持 5 种图表类型：架构图、工作流图、时序图、数据流图、状态机。内置 Node.js 渲染器 + JSON Schema 验证，也支持无 Node 环境的手动 SVG 模式。

亮点:
- 5 种图表类型：`architecture` / `workflow` / `sequence` / `dataflow` / `lifecycle`
- 自动流动动画：CSS `stroke-dasharray` 流动 + SVG 粒子沿路径移动，按连接类型自动调速
- 暗/亮主题切换（持久化到 `localStorage`，尊重 `prefers-color-scheme`）
- 一键导出：PNG / JPEG / WebP / SVG / 动画 GIF / WebM 视频
- 接受 Mermaid 代码输入，自动映射到对应图表类型并重新布局
- CSS 变量色彩系统，组件类型语义化（前端/后端/数据库/云/安全/消息队列/外部）

<table>
<tr>
<td align="center" width="20%"><a href="./skills/dynami-carchify/README.md#支持的图表类型"><img src="<!-- IMAGE:arch-architecture -->" alt="architecture preview" /></a><br /><sub><code>architecture</code><br />系统架构图</sub></td>
<td align="center" width="20%"><a href="./skills/dynami-carchify/README.md#支持的图表类型"><img src="<!-- IMAGE:arch-workflow -->" alt="workflow preview" /></a><br /><sub><code>workflow</code><br />工作流图</sub></td>
<td align="center" width="20%"><a href="./skills/dynami-carchify/README.md#支持的图表类型"><img src="<!-- IMAGE:arch-sequence -->" alt="sequence preview" /></a><br /><sub><code>sequence</code><br />时序图</sub></td>
<td align="center" width="20%"><a href="./skills/dynami-carchify/README.md#支持的图表类型"><img src="<!-- IMAGE:arch-dataflow -->" alt="dataflow preview" /></a><br /><sub><code>dataflow</code><br />数据流图</sub></td>
<td align="center" width="20%"><a href="./skills/dynami-carchify/README.md#支持的图表类型"><img src="<!-- IMAGE:arch-lifecycle -->" alt="lifecycle preview" /></a><br /><sub><code>lifecycle</code><br />状态机</sub></td>
</tr>
</table>

<sub>↑ 5 种图表类型预览 — <a href="./skills/dynami-carchify/README.md#支持的图表类型"><b>查看完整说明</b></a>。</sub>

Links: [README](./skills/dynami-carchify/README.md) · [SKILL.md](./skills/dynami-carchify/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `scholar-notes`

<a href="./skills/scholar-notes">
<img src="<!-- IMAGE:scholar-notes-banner -->" alt="scholar-notes Skill" width="100%">
</a>

**分类:** 学霸笔记 / 手写笔记本风格 HTML
**适用于:** 技术笔记、漏洞分析、安全研究记录、知识点总结、课堂笔记——需要将技术内容转化为视觉精美的手写笔记本风格网页的场景。

`scholar-notes` 生成手写笔记本风格的单文件 HTML 学习笔记。两种模板风格：Style A（米黄横线纸 + 螺旋装订孔 + 胶带/咖啡渍装饰，适合通用技术笔记）和 Style B（皮革封面 + 金属环装订 + 翻页交互，适合攻击链分析、漏洞笔记）。内置丰富的组件系统：流程图、对比框、攻击链、代码块、便签等。所有图标使用平面 UI 库（Lucide / Remix Icon），禁止 emoji。

亮点:
- 两种模板风格：`Style A`（学霸笔记本 / 单页滚动）/ `Style B`（手账皮革本 / 翻页交互）
- 手写感字体：Kalam + Patrick Hand + Zeyada / Ma Shan Zheng
- 丰富组件：流程图 / 对比框 / 攻击链 / 代码块 / 便签 / 警告框 / 概念卡片
- 颜色编码系统：红=警告/强调、蓝=信息/术语、绿=安全/正面、紫=技术/代码
- 严格质量约束：禁止 emoji、内容高度适配封面、checklist 自检

<table>
<tr>
<td align="center" width="50%"><a href="./skills/scholar-notes/README.md#两种风格"><img src="<!-- IMAGE:scholar-notes-style-a -->" alt="Style A preview" /></a><br /><sub><code>Style A</code><br />学霸笔记本</sub></td>
<td align="center" width="50%"><a href="./skills/scholar-notes/README.md#两种风格"><img src="<!-- IMAGE:scholar-notes-style-b -->" alt="Style B preview" /></a><br /><sub><code>Style B</code><br />手账皮革本</sub></td>
</tr>
</table>

<sub>↑ 两种风格预览 — <a href="./skills/scholar-notes/README.md#两种风格"><b>查看完整说明</b></a>。</sub>

Links: [README](./skills/scholar-notes/README.md) · [SKILL.md](./skills/scholar-notes/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

### 安装

| # | 方式 | 适用于 | 指定版本? |
|---|------|--------|-----------|
| A | [`skills` CLI (`npx`)](#option-a--skills-cli-npx) | 任意 Agent，一行安装，按需选择 Skill | ✅ via tag URL |
| B | Git Clone + 手动复制 | 本地开发 / 魔改 | ✅ via commit |
| C | GitHub Releases `.zip` | CI / 生产环境固定版本 | ✅ via release tag |

#### Option A · `skills` CLI (npx)

```bash
# 安装全部 Skill（推荐）
npx skills add https://github.com/Unclecheng-li/AI_Animation

# 安装单个 Skill
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/ppt-animation
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/flowchart
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/network-protocol-viz
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/dynami-carchify
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/scholar-notes
```

> **默认安装 `main` 分支最新版本。** CLI 会从源码树直接读取每个 Skill 的最新 `SKILL.md`。

#### Option B · Git Clone

```bash
git clone https://github.com/Unclecheng-li/AI_Animation.git
# 将 skills/<skill-name> 复制到你的 Agent 技能目录
```

#### Option C · GitHub Releases

前往 [Releases 页面](https://github.com/Unclecheng-li/AI_Animation/releases) 下载 `.zip`，解压后复制到 Agent 技能目录。

### 兼容性

| Agent / Runtime | Skill 存放路径 | 状态 |
|---|---|---|
| **WorkBuddy** | `~/.workbuddy/skills/<name>/` | ✅ 已测试 |
| **Claude Code** | `.claude/skills/<name>/` | ✅ 兼容 |
| **Cursor** | `.agents/skills/<name>/` | ✅ 兼容 |
| **Codex CLI** | `.codex/skills/<name>/` | ✅ 兼容 |
| **Gemini CLI** | extension manifest | ✅ 兼容 |

> `SKILL.md` 格式与 Agent 无关，只要 Agent 支持 Skills 规范，将文件夹复制到对应目录即可。

### 快速上手

安装 Skill 后，直接在 AI Agent 中说：

```
用 ppt-animation 制作一个关于"HTTP协议"的演示，暗色主题，5页
```

```
用 flowchart 演示 LSTM 的工作原理
```

```
用 network-protocol-viz 可视化 TCP 三次握手
```

```
用 dynami-carchify 画一个微服务架构图，带流动动画
```

```
把以上内容做成学霸笔记，Style A 风格
```

### 目录结构

```text
ai-animation-skills/
├── skills/
│   ├── SKILL_TEMPLATE.md        ← 新增 Skill 的标准模板
│   ├── ppt-animation/
│   │   ├── SKILL.md             ← Agent 执行指令（核心）
│   │   ├── README.md            ← 人类可读文档
│   │   ├── references/          ← Prompt 参考
│   │   └── assets/              ← 模板 HTML 文件
│   ├── flowchart/
│   │   ├── SKILL.md
│   │   ├── README.md
│   │   ├── references/
│   │   └── assets/
│   ├── network-protocol-viz/
│   │   ├── SKILL.md
│   │   ├── README.md
│   │   ├── references/
│   │   └── assets/
│   ├── dynami-carchify/
│   │   ├── SKILL.md
│   │   ├── README.md
│   │   ├── renderers/           ← 5 种图表渲染器
│   │   ├── schemas/             ← JSON Schema 验证
│   │   ├── examples/            ← 示例 JSON
│   │   └── assets/              ← 模板 + GIF 导出库
│   └── scholar-notes/
│       ├── SKILL.md
│       ├── README.md
│       ├── assets/              ← Style A + Style B 模板
│       ├── references/          ← 布局库 + 组件手册 + checklist
│       └── examples/            ← Style A/B 示例（8 个）
├── web_animation/               ← 原始示例 HTML（历史存档）
├── UI/                          ← UI 设计参考图
├── prompt.md                    ← Prompt 模板集合
├── package.json
├── CONTRIBUTING.md
└── README.md
```

---

## English

### Overview

A collection of AI Agent skills for generating stunning HTML animation pages. Each skill is a self-contained folder with `SKILL.md` (agent instructions), `README.md`, `references/`, and `assets/`. Once installed, the AI agent auto-activates the matching skill based on your description.

### Skills

| Skill | Description | Templates |
|-------|-------------|-----------|
| [`ppt-animation`](./skills/ppt-animation) | PPT-style slideshow animations with 5 built-in themes | 30+ |
| [`flowchart`](./skills/flowchart) | Animated flowcharts, concept maps, process diagrams, AI model viz | 7 types + 7 examples |
| [`network-protocol-viz`](./skills/network-protocol-viz) | Network protocol animations (TCP, IPv4, routing, etc.) | 10+ |
| [`dynami-carchify`](./skills/dynami-carchify) | Animated architecture/workflow/sequence/dataflow/lifecycle diagrams | 5 types |
| [`scholar-notes`](./skills/scholar-notes) | Handwritten notebook-style HTML learning notes | 2 styles |

### Installation

```bash
# Install all skills
npx skills add https://github.com/Unclecheng-li/AI_Animation

# Install a single skill
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/ppt-animation
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/dynami-carchify
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/scholar-notes
```

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). New animation skills are welcome!

### License

MIT — for educational use only.
