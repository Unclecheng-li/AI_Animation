# 长期记忆

## AI-Animation Skill

AI 生成 HTML 演示动画的 Skill，位于：
- 源：`C:\Users\UncleC\.workbuddy\skills\AI-Animation\SKILL.md`
- 桌面副本：`C:\Users\UncleC\Desktop\AI-Animation-Skill\`

### 三步工作流
1. **Step 1**：生成基础 HTML（PPT 风格轮播）
2. **Step 2**：使用 PPT 模板重构（必须包含「将emoji图标换成平面ui库的图标」）
3. **Step 3（可选）**：使用 RNN 模板重构为流程图风格

### 模板路径
- PPT 模板：`C:/Users/UncleC/Desktop/AI Animation/web_animation/PPT Template/`
- RNN 模板：`C:/Users/UncleC/Desktop/AI Animation/web_animation/Animation/`

### 输出路径
`C:/Users/UncleC/Desktop/AI Animation/web_animation/AI_Animation.html`

---

## 学霸笔记 Skill

手写笔记本风格的单文件 HTML 学习笔记生成器。
- 位置：`~/.workbuddy/skills/note-skill/`
- 桌面副本：`C:\Users\UncleC\Desktop\note-skill\`

### 两种模板风格
- **Style A（学霸笔记本）**：米黄横线纸 + 螺旋装订孔 + Lucide 图标
- **Style B（手账皮革本）**：皮革封面 + 金属环 + 翻页交互 + Remix Icon

### 硬性约束
1. 禁止使用 emoji，Style A 用 Lucide，Style B 用 Remix Icon
2. 内容页纸的高度不能超过皮革封面的高度

### 文件结构
- 模板：`assets/template.html`（A）、`assets/template-journal.html`（B）
- 布局：`references/layouts.md`（A）、`references/layouts-journal.md`（B）
- 组件：`references/components.md`
- 检查：`references/checklist.md`
