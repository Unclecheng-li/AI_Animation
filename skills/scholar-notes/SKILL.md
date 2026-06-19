---
name: "学霸笔记"
description: "生成手写笔记本风格的单文件 HTML 学习笔记。当用户需要将技术内容、漏洞分析、知识总结等转化为视觉精美的网页笔记时使用。"
version: "1.0.0"
triggers:
  - "学霸笔记"
  - "笔记"
  - "手写笔记"
  - "漏洞笔记"
  - "学习笔记"
  - "网页笔记"
  - "HTML笔记"
  - "note"
  - "notebook style"
  - "scholar-notes"
---

# 学霸笔记 Skill

生成**手写笔记本风格**的单文件 HTML 学习笔记。

> **⚠️ 硬性约束（P0 级别，必须遵守）**
> 1. **禁止使用 emoji 作为任何图标或装饰符号** — 所有图标必须使用平面 UI 库（Lucide 或 Remix Icon）
> 2. **内容页纸的高度不能超过皮革封面的高度** — 如果内容过多，必须压缩精简内容，以模板为参考

---

## 两种模板风格

### Style A · 学霸笔记本（默认）

**视觉**：米黄横线纸 + 螺旋装订孔 + 胶带/咖啡渍/回形针装饰
**字体**：Kalam + Patrick Hand + Zeyada
**图标**：Lucide SVG（`<i class="lucide-xxx"></i>`）
**交互**：单页滚动，write-in 入场动画
**适合**：技术笔记、知识点总结、科普内容

```
assets/template.html
```

### Style B · 手账皮革本

**视觉**：皮革封面 + 金属环装订 + 多页翻页
**字体**：Kalam + Ma Shan Zheng（毛笔）+ Zeyada
**图标**：Remix Icon（`<i class="ri-xxx-line"></i>`）
**交互**：翻页交互（键盘←→ / 点击），封面 + 内容页
**适合**：攻击链分析、漏洞笔记、深度技术研究

```
assets/template-journal.html
```

---

## 完整工作流

### Step 1 · 需求澄清

如果用户未提供完整内容，需澄清以下问题：

1. **笔记主题**：标题是什么？副标题？
2. **风格选择**：Style A（学霸笔记本）还是 Style B（手账皮革本）？
3. **内容大纲**：有哪些章节/知识点？
4. **技术术语**：需要高亮的关键词、代码术语？
5. **视觉元素**：需要哪些组件（流程图、对比框、警告框、代码块等）？

### Step 2 · 拷贝模板

```bash
mkdir -p "项目/XXX/notes"
# Style A
cp "<SKILL_ROOT>/assets/template.html" "项目/XXX/notes/index.html"
# Style B
cp "<SKILL_ROOT>/assets/template-journal.html" "项目/XXX/notes/index.html"
```

**立即修改** `<title>` 标签。

### Step 3 · 填充内容

1. **预检**：读取模板的 `<style>` 块，确认所有可用的组件类名。
2. **选择布局**：
   - Style A：从 `references/layouts.md` 中选择
   - Style B：从 `references/layouts-journal.md` 中选择
3. **使用组件**：从 `references/components.md` 中挑选组件。
4. **添加装饰图标**：**必须使用平面 UI 库图标**，**绝对禁止使用 emoji**。
   - Style A：Lucide SVG（`<i class="lucide-xxx"></i>`）
   - Style B：Remix Icon（`<i class="ri-xxx-line"></i>`）
5. **控制内容量**：**内容页纸的高度不能超过皮革封面的高度**，如果内容过多，压缩精简。

### Step 4 · 对照检查清单自检

生成后，打开 `references/checklist.md` 逐项检查。

### Step 5 · 本地预览

直接在浏览器中打开生成的 HTML 文件即可预览。

### Step 6 · 迭代

根据用户反馈修改，调整内容、样式、动画延迟等。

---

## 设计原则

1. **手写感第一**：字体用 Kalam 系列，模拟真实手写。
2. **纸质质感**：横线纸 + 装订线 + 阴影。
3. **装饰克制**：胶带、咖啡渍、涂鸦是点缀，不能喧宾夺主。
4. **颜色编码**：红=警告/强调、蓝=信息/术语、绿=安全/正面、紫=技术/代码。
5. **单文件输出**：所有 CSS/JS 内联，浏览器直接打开。
6. **禁止 emoji**：不使用 emoji 作为图标。Style A 用 Lucide，Style B 用 Remix Icon。
7. **内容适配**：内容页纸的高度不能超过皮革封面的高度，内容过多时压缩精简。

---

## 资源文件结构

```
scholar-notes/
├── SKILL.md                      # 本文件
├── README.md                     # 人类文档
├── LICENSE
├── assets/
│   ├── template.html             # Style A 模板
│   └── template-journal.html     # Style B 模板
├── references/
│   ├── layouts.md                # Style A 布局库
│   ├── layouts-journal.md        # Style B 布局库
│   ├── components.md             # 组件手册
│   └── checklist.md              # 质量检查清单
└── examples/
    ├── style-a/                  # Style A 示例（5 个）
    └── style-b/                  # Style B 示例（3 个）
```

**加载顺序**：SKILL.md → 确定风格 → 读取对应模板 → 参考对应布局文件 → 参考 components.md → 自检 checklist.md
