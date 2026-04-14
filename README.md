# AI Animation

> 使用 AI 生成 HTML 演示动画的 Prompt 模板集合

[English](README.md) · [Prompts](prompt.md)

---

## 项目简介
<img width="2560" height="1440" alt="QQ_1775901765825" src="https://github.com/user-attachments/assets/77ee698e-7e88-43b7-b048-8eed006ed278" />
<img width="2560" height="1440" alt="QQ_1775901779039" src="https://github.com/user-attachments/assets/e06a3dc6-a57f-40f6-b88b-d4da2c049f45" />
<img width="2560" height="1440" alt="QQ_1775901789295" src="https://github.com/user-attachments/assets/657be29c-2770-46e2-8780-4d28712e3683" />

本项目整理了用于生成**炫酷 HTML 动画网页**的 AI Prompts，涵盖动画效果、3D 可视化、PPT 风格演示、UI 美化等多个类别。

配合 `web_animation/` 中的示例文件，可以快速生成用于：

- 📹 **视频创作** — AI City 系列视频的动画演示
- 📚 **教学演示** — 技术概念的可视化呈现
- 🔬 **技术科普** — 网络协议、神经网络等抽象概念的图形化展示

---

## 目录结构

```
AI Animation/
├── README.md          # 项目说明文档
├── prompt.md          # Prompt 模板集合（分类整理）
├── prompt.txt         # 原始 Prompt 文本
├── UI/                # UI 设计参考图
│   ├── design1.png ~ design6.png
│   └── timeline.png
└── web_animation/     # 示例 HTML 动画文件
    ├── Animation/         # AI/ML 概念演示（RNN、LSTM、Word2Vec、GPU 等）
    ├── Pirated websites/  # 钓鱼网站演示
    ├── PPT Template/       # PPT 风格模板
    ├── catch the packet/  # 数据包捕获演示
    ├── DHCP/              # DHCP 协议演示
    ├── geometry/           # 几何图形演示
    ├── 3D - demonstrate.html
    ├── animation.html
    ├── ethernet-frame-animated.html
    ├── HTTPS.html
    ├── ipv4_datagram.html
    ├── ipv4_datagram - 3d.html
    ├── ppp_frame_complete.html
    ├── router-routing-table-animated.html
    ├── switch-mac-table-animated.html
    └── tcp-visualization.html
```

---

## 快速开始

### 方式一：直接使用示例

```bash
# 克隆仓库
git clone https://github.com/Unclecheng-li/AI_Animation.git
cd AI_Animation

# 在浏览器中打开任意 .html 文件
# 使用 ← → 方向键或鼠标滚轮翻页
```

### 方式二：AI 生成新动画

1. 打开 [prompt.md](prompt.md)，选择或修改合适的 Prompt
2. 将 Prompt 发送给 AI（推荐 [Trae](https://trae.ai/)、Claude、GPT-4o）
3. 指定输出文件路径
4. 在浏览器中预览

**推荐 AI 工具：**

| 工具 | 特点 | 适合场景 |
|------|------|----------|
| [Trae](https://trae.ai/) | 免费，可直接生成 HTML | 快速生成 |
| Claude | 长上下文，代码质量高 | 复杂动画 |
| Codex | 图形理解能力强 | UI 重构 |

### 方式三：UI 参考重构

1. 在 `UI/` 文件夹中选择设计风格
2. 使用 [prompt.md](prompt.md) 中「UI 置换」类 Prompt
3. 让 AI 参考 UI 图片进行视觉重构

---

## 示例预览

| 文件 | 主题 | 特点 |
|------|------|------|
| `tcp-visualization.html` | TCP 可视化 | 3D 效果、交互演示 |
| `ipv4_datagram - 3d.html` | IPv4 数据报 | 3D 旋转、动态展示 |
| `router-routing-table-animated.html` | 路由表 | 表格动画、路径高亮 |
| `Animation/RNN-*.html` | RNN 神经网络 | 分步动画、概念可视化 |
| `Animation/GPU.html` | GPU 架构 | 图形化演示 |

---

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript（原生，无框架依赖）
- **动画**：CSS Animation / Keyframes / 3D Transform
- **图表**：纯 CSS/JS 图形绘制，无外部库
- **兼容性**：现代浏览器（Chrome、Firefox、Safari、Edge）

---

## 开源协议

本项目仅供学习和研究使用，请勿用于非法用途。
请勿用于商业用途。
---

## 致谢

- AI 工具：[Trae](https://trae.ai/)、Claude、ChatGPT 等
- 所有参与测试和反馈的社区成员(虽然目前还没有desuwa)
