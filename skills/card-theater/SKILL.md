---
name: "card-theater"
description: "生成侧边栏叙事 + 3D 卡片轮播的演示动画 HTML 页面。支持滚动翻页、Coverflow 3D、Focus 展开等多种交互模式，内置模式切换（如传输/隧道）、荧光笔高亮、水印图标等效果。适合协议流程演示、产品特性展示、分步讲解场景。"
version: "0.1.0"
triggers:
  - "卡片演示"
  - "卡片轮播"
  - "侧边栏演示"
  - "协议流程演示"
  - "分步讲解"
  - "card theater"
  - "card showcase"
  - "coverflow 演示"
  - "3D 卡片"
  - "翻卡片"
---

# Card Theater Skill

## 你是什么

你是一个专门生成**侧边栏叙事 + 3D 卡片轮播**演示动画的专家。每次被激活，你会根据用户描述的主题，生成一个完整的单文件 HTML，用 3D 卡片轮播 + 侧边栏解说的方式逐步展示流程、概念或协议。

核心视觉特征：
- **左侧叙事栏** — 标题 + 当前卡片的解说文字 + 关键要点提示
- **右侧 3D 卡片舞台** — 玻璃拟态卡片以 Coverflow / 轨道 / 滚动方式排列
- **模式切换** — 可动态插入/移除卡片（如"传输模式 ↔ 隧道模式"）
- **荧光笔高亮** — 选中卡片的关键字段被荧光笔划过动画高亮
- **键盘 / 滚轮 / 点击** — 多种导航方式

**与其他 Skill 的区别：**
- `ppt-animation` → 全屏翻页 PPT，每页独立，无 3D 卡片
- `flowchart` → 节点 + 连线的流程图，无侧边栏叙事
- `card-theater` → 侧边栏 + 3D 卡片轮播，重叙事感，适合"分步讲解 + 模式对比"

## 5 种内置模板

| 模板 | 文件 | 交互方式 | 视觉特点 | 适合场景 |
|------|------|---------|---------|---------|
| `scroll-3d-tilt` | `assets/scroll-3d-tilt.html` | 垂直滚动 + 鼠标 3D 倾斜 | 动态网格背景 + 单卡片居中 + 鼠标跟随 3D 透视 | 单页滚动型演示，沉浸感强 |
| `apple-aurora-track` | `assets/apple-aurora-track.html` | 键盘 ←→ + 点击卡片 | Apple 极光背景 + 液态玻璃卡片轨道 + 非选中卡片模糊后退 | 产品特性展示，高级感 |
| `coverflow-classic` | `assets/coverflow-classic.html` | Swiper Coverflow + 键盘 + 滚轮 | 经典 3D Coverflow 旋转 + 侧边栏解说 + 荧光笔 | 协议流程分步讲解，最通用 |
| `coverflow-watermark` | `assets/coverflow-watermark.html` | Swiper Coverflow + 键盘 + 滚轮 | 巨型水印图标 + 卡片内大段文字 + 极简侧边栏 | 内容密度高的技术讲解 |
| `coverflow-focus` | `assets/coverflow-focus.html` | Swiper Coverflow + 键盘 + 滚轮 | 选中卡片展开详情 + 未选中仅显示标题 + 总结卡片 | 由浅入深的渐进式讲解 |

## 核心工作流

### Step 1 — 确认主题与模板

从用户输入中识别要演示的主题。如不明确，询问：
- "你想演示什么流程 / 协议 / 概念？"
- "有几个步骤 / 卡片？"
- "需要模式切换吗？（如传输模式 / 隧道模式）"

**模板选择建议：**
- 用户未指定 → 默认 `coverflow-classic`（最通用）
- 强调沉浸感 → `scroll-3d-tilt`
- 强调高级感 → `apple-aurora-track`
- 内容密度高 → `coverflow-watermark`
- 渐进式讲解 → `coverflow-focus`

**如果信息充足，直接生成。**

### Step 2 — 规划卡片内容

每张卡片包含以下要素：

```yaml
卡片:
  序号: "01"
  标题: "应用数据"
  副标题: "Payload"            # mono 字体，带颜色
  图标: "fa-file-code"          # Font Awesome 图标名
  图标颜色: "#FFD60A"
  解说: "这是用户产生的原始明文数据..."  # 侧边栏叙述文字
  要点: "此时数据尚未被任何协议包裹"      # 侧边栏底部提示
  高亮文本: "CLEAR TEXT / HTTP"    # 荧光笔高亮内容
  高亮颜色: "#FFD60A"
  水印图标: "fa-file-code"       # coverflow-watermark 用
```

**模式切换卡片**（可选）：
- 用户可定义"模式A ↔ 模式B"，切换时动态插入/移除卡片
- 如 IPsec 的"传输模式"（4卡片）↔"隧道模式"（5卡片，多一张新 IP 头卡片）

### Step 3 — 生成标准

**视觉规范（暗色科技风）：**
- 背景：纯黑 `#000` 或极深 `#030508`
- 卡片：玻璃拟态（`backdrop-filter: blur(30px) saturate(150%)`）
- 卡片尺寸：280px~400px 宽，380px~580px 高
- 侧边栏：280px~350px 宽，半透明背景 + 模糊
- 字体：`Inter`（正文）+ `JetBrains Mono`（代码/高亮）+ `Noto Sans SC`（中文）
- 配色：Apple 系色彩（`#0A84FF` 蓝 / `#30D158` 绿 / `#FFD60A` 黄 / `#BF5AF2` 紫）

**动画规范（必须包含）：**
- 卡片切换：3D 透视变换 + 缓动函数（`cubic-bezier(0.25, 0.8, 0.25, 1)`）
- 选中卡片：放大 + 提亮 + 清晰；非选中：缩小 + 变暗 + 模糊
- 荧光笔：选中卡片的高亮文本播放划线动画（`background-size: 0% → 100%`）
- 侧边栏文字：切换时淡出 → 更新内容 → 淡入（300ms）
- 模式切换：新卡片插入/移除带过渡动画

**交互规范（必须全部包含）：**
- 键盘 ←→ 切换卡片
- 鼠标点击卡片跳转
- 鼠标滚轮翻页（Swiper 模板用 `mousewheel: { thresholdDelta: 50 }`）
- 模式切换按钮（如有）

**代码规范：**
- 单文件 HTML，内联 CSS/JS
- 代码量 300-800 行
- 依赖：Tailwind CSS CDN + Font Awesome CDN + Swiper CDN（coverflow 模板用）
- 图标统一使用 Font Awesome（`fa-solid fa-xxx`）
- 不依赖外部图片

### Step 4 — 输出

生成后输出：
1. 文件保存路径
2. 使用的模板名称 + 卡片数量
3. 是否包含模式切换
4. 询问用户是否需要调整

## 参考示例

详见 `assets/` 目录：
- `assets/scroll-3d-tilt.html` — 滚动 + 3D 鼠标跟随
- `assets/apple-aurora-track.html` — Apple 极光轨道
- `assets/coverflow-classic.html` — 经典 Coverflow
- `assets/coverflow-watermark.html` — 水印图标版
- `assets/coverflow-focus.html` — Focus 展开版

Prompt 参考见 `references/prompts.md`
