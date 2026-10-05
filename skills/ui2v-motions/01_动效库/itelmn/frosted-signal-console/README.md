# 8-16 Exact Effect / HyperFrames Template

这是 8-16 原视频效果的模板化版本，不是重新设计的近似版本。母版直接来自原项目的 `index.html`，因此保留原有的毛玻璃/纸张层、阴影、颗粒、彩色便签、图钉、morph-text 和 GSAP 入场编排。

已做的模板化处理：

- 原时间线压缩为 0.5 倍，约 89.7 秒，整体节奏更快。
- 替换 UI2V 专属标题、项目标签和工具名，改为 `YOUR SYSTEM`、`[工具 A]`、`YOUR DATE` 等占位符。
- 保留原背景视频、录屏框架、海报和 SFX 素材入口，方便替换成新项目内容。
- 保留原组件目录和 `morph-text` 组件。

## 运行

```bash
npm install
npx hyperframes check
npx hyperframes preview --background
npx hyperframes render --quality high --output renders/8-16-exact-template.mp4
```

具体替换位置见 `TEMPLATE.md`。原版 `8-16` 和上一版 `8-16-template` 均未改动。
