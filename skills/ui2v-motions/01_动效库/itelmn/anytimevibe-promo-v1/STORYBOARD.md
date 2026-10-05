# 随码多引擎宣传片分镜

| 时间 | 画面 | 运动 | 屏幕文字 |
|---|---|---|---|
| 0–5s | 深墨背景、四家引擎 Logo、巨大品牌宣言 | 标题分层推入，四引擎标识依次出现 | 一个入口，接住四种引擎 |
| 5–10s | Web 新建任务界面、四引擎选择器、主机环境检测和 Cursor 执行终端 | 引擎卡片错峰进入，选中 Cursor 后任务信号进入远程主机 | 选引擎，发到电脑执行 |
| 10–15s | 左侧 Cursor 任务卡、右侧原生 Cursor CLI，中间接力箭头 | 使用 provider session 恢复上下文，结果箭头返回 Web | 同一引擎，原生 CLI 接力 |
| 15–20s | Codex、Claude、Grok、Cursor 混合任务队列 | 不同引擎任务错峰进入，统一状态流推进 | 四种引擎，一条任务流 |
| 20–25s | 四种引擎权限卡、安全边界和本机凭据提示 | 权限卡逐张落位，底部安全边界绘制 | 权限按引擎映射 |
| 25–30s | 图标、产品名、四引擎 Logo 和 CTA | 标志缩放落位，引擎标识聚合到产品名下方 | 四种引擎，一个远程工作台 |

## Asset Audit

- 品牌图标：`assets/icon.svg`
- 引擎图标：`assets/codex.png`、`assets/claude.png`、`assets/grok.png`、`assets/cursor.png`，与 Web/Agent 使用同一来源
- 产品界面：使用 HTML/CSS 重建当前多引擎选择、权限和任务状态，不依赖外部截图
- 字体：系统中文字体 + Rockwell + Cascadia Code
- 音频：原创 108 BPM 产品介绍风格 BGM，由 `scripts/generate-bgm.mjs` 确定性生成；场景切换点带轻量提示音，无旁白
