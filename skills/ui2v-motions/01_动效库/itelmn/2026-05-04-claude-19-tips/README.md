# claude-19-tips (453s · 28 compositions)

19 招 Claude Code 教程视频的全片源工程。**最大的 HyperFrames 工程**（28 个 sub-composition，7.5 分钟）。

## 做了什么

- 总时长 453 秒（≈7.5 分钟）
- 28 个 sub-composition（hook + 19 招 + outro 等）
- cc-window 组件首次出现（templates/components/cc-window/ 抽自这条）
- 总结报告见 [`retrospective/`](retrospective)

## 用了什么技术

- HyperFrames CLI
- cc-window 组件（终端 UI 沉淀）
- 占位录屏 → 真录屏二次合成

## 怎么复用

适合做"逐条 tips / 招式合集" 类型的长教程。技术要点：
- **大工程内存预防**：每 beat 注 3 个 Proxy + 25 个 helper 会内存爆。8+ sub-composition 时必读 `MY_MOTION_NOTES.md` 相关段
- **bundler 吃 wrapper**：sub-composition 内层 `<div id="X">` 会被 strip，CSS/JS 必须用 `[data-composition-id="X"]`
- **复制 beat html 时**：全局换 beat id（CSS class + GSAP selector + window.__timelines）

⚠️ 这条视频踩过的坑沉淀成了 `docs/HARD_CONSTRAINTS.md` 的大部分约束。先读硬约束再开新工程。
