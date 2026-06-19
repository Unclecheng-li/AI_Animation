# ppt-animation

> PPT 风格翻页 HTML 演示动画 Skill

## 简介

生成 PPT 风格的翻页 HTML 动画页面，支持多种视觉主题，适合：

- 📹 视频录制（教程、科普、讲解）
- 🎓 教学演示（直播、课堂）
- 📱 技术分享（无需安装软件，浏览器直开）

## 支持的主题

| 主题 | 描述 | 示例文件 |
|------|------|---------|
| `dark-tech` | 暗色科技风（默认） | `assets/PPT-dark-demo.html` |
| `warm-paper` | 暖色报纸风 | `assets/PPT-warm-demo.html` |
| `clean-white` | 简约白色 | `assets/PPT-white-demo.html` |
| `cyber-red` | 赛博朋克红橙 | — |
| `gradient-dark` | 渐变暗色 | — |

## 使用方式

在 AI Agent 中说：

```
用 ppt-animation 制作"TCP协议三次握手"的演示，暗色科技风，6页
```

```
基于 ppt-animation 生成一个介绍神经网络的 PPT，要图文并茂
```

## 模板文件

`assets/` 目录中存放可直接使用的模板 HTML，可以用它们作为重构基础：

```
以 assets/PPT-dark-demo.html 为模板演示以上内容
```

## 参考 Prompts

详见 `references/prompts.md`

## 技术栈

- 纯 HTML5 + CSS3 + Vanilla JS
- CSS Animation / @keyframes / 3D Transform
- 无外部框架依赖
