<div align="center">

# 学霸笔记 Skill

> *手写笔记本风格的单 HTML 学习笔记生成器，将技术内容转化为视觉精美的网页笔记。*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) [![WorkBuddy](https://img.shields.io/badge/WorkBuddy-Skill-green)](https://workbuddy.ai/) [![HTML5](https://img.shields.io/badge/HTML5-Single_File-orange)](assets/)

给 AI Agent 用的笔记生成 Skill，输入技术内容，输出手写风格的 HTML 笔记。

配合 WorkBuddy、OpenClaw 等 AI Agent 使用，将技术文本自动转换为手写笔记本风格的精美网页笔记。

[快速开始](#快速开始) · [两种风格](#两种风格) · [组件系统](#组件系统) · [效果示例](#效果示例)

</div>

---

## 它能做什么

输入一段技术内容，AI 自动生成手写风格笔记：

    用户输入：TCP 三次握手的原理是什么？
    
    输出：手写笔记本风格的单 HTML 文件，包含手写字体、纸质背景、
         螺旋装订孔、胶带装饰、流程图、代码块等元素。
<div align="center">
<img width="555" height="717" alt="image" src="https://github.com/user-attachments/assets/f7f4d020-4ba6-4977-8150-204821ca9217" />
<img width="768" height="630" alt="image" src="https://github.com/user-attachments/assets/ea7a17ec-57d4-40ef-86bd-aec4fec10bd5" />
<img width="755" height="632" alt="image" src="https://github.com/user-attachments/assets/50fd464a-f6db-408a-915b-4c04e7f87240" />
</div>
适用于技术笔记、漏洞分析、安全研究记录、知识点总结、课堂笔记等场景。

---

## 快速开始

### 安装

**方式一：手动安装**

1. 下载本项目
2. 将 `scholar-notes` 文件夹复制到 `~/.workbuddy/skills/` 目录
3. 重启 WorkBuddy

**方式二：命令行安装**

```bash
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/scholar-notes
```

### 使用

1. 在对话中输入技术内容，说「帮我做成学霸笔记」
2. 选择风格（Style A 学霸笔记本 / Style B 手账皮革本）
3. Skill 自动生成精美笔记 HTML 文件

---

## 两种风格

### Style A · 学霸笔记本（默认）

| 维度 | 描述 |
|------|------|
| **视觉** | 米黄横线纸 + 螺旋装订孔 + 胶带/咖啡渍装饰 |
| **字体** | Kalam + Patrick Hand + Zeyada（Google Fonts） |
| **图标** | Lucide SVG |
| **交互** | 单页滚动 + write-in 入场动画 |
| **适合** | 技术笔记、知识点总结、科普内容 |

### Style B · 手账皮革本

| 维度 | 描述 |
|------|------|
| **视觉** | 皮革封面 + 金属环装订 + 翻页交互 |
| **字体** | Kalam + Ma Shan Zheng + Zeyada（Google Fonts） |
| **图标** | Remix Icon |
| **交互** | 翻页动画（键盘←→ / 点击） |
| **适合** | 攻击链分析、漏洞笔记、深度技术研究 |

---

## 组件系统

### 文字样式

| 类名 | 效果 | 用途 |
|------|------|------|
| `.highlight` | 黄色高亮背景 | 关键术语、重点概念 |
| `.highlight-pink` | 粉色高亮背景 | 危险操作、警告内容 |
| `.code-term` | 等宽字体 + 下划线 | 代码术语、命令 |
| `.red-text` | 红色加粗 | 强调、警告 |
| `.blue-text` | 蓝色 | 信息、术语 |

### 布局组件

| 组件 | 用途 | 适用风格 |
|------|------|---------|
| `.flow-box` | 流程图 | A |
| `.compare-box` | 对比框 | A |
| `.attack-chain` | 攻击链 | B |
| `.concept-cards` | 概念卡片 | B |
| `.code-block` | 代码块 | A, B |
| `.side-note` / `.sticky-note` | 便签 | A, B |
| `.key-point-box` | 重点框 | B |
| `.big-warning` | 警告框 | A |

### 图标库

| 风格 | 图标库 | 使用方式 |
|------|--------|---------|
| Style A | Lucide SVG | `<i class="lucide-xxx"></i>` |
| Style B | Remix Icon | `<i class="ri-xxx-line"></i>` |

---

## 硬性约束

1. **禁止使用 emoji 作为任何图标** — 必须使用平面 UI 库（Lucide / Remix Icon）
2. **内容页纸的高度不能超过皮革封面的高度** — 内容过多时压缩精简

---

## 项目结构

```
scholar-notes/
├── SKILL.md                      # Skill 主文件（工作流定义）
├── README.md                     # 本文件
├── LICENSE                       # MIT 开源协议
├── assets/
│   ├── template.html             # Style A 模板
│   └── template-journal.html     # Style B 模板
├── references/
│   ├── layouts.md                # Style A 布局库（18 种）
│   ├── layouts-journal.md        # Style B 布局库（10 种）
│   ├── components.md             # 组件手册
│   └── checklist.md              # 质量检查清单
└── examples/
    ├── style-a/                  # Style A 示例（5 个）
    └── style-b/                  # Style B 示例（3 个）
```

---

## 效果示例

### Style A · 学霸笔记本

米黄横线纸 + 螺旋装订孔 + 手写字体，适合通用技术笔记。

### Style B · 手账皮革本

皮革封面 + 金属环装订 + 翻页交互，适合深度技术研究。

---

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript（原生，无框架依赖）
- **字体**：Google Fonts（Kalam, Patrick Hand, Zeyada, Ma Shan Zheng）
- **图标**：Lucide SVG / Remix Icon
- **兼容性**：现代浏览器（Chrome、Firefox、Safari、Edge）

---

## 开源协议

本项目采用 [MIT License](LICENSE)。

---

**如果对你有帮助，欢迎 Star ⭐**
