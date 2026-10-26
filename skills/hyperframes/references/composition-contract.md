# HyperFrames 工程与渲染合同

来源：上游 `skills/hyperframes/references/format.md`、`skills/hyperframes-cli/SKILL.md` 与 README。命令和规则可能更新，实际工程用 `npx hyperframes docs <topic>` 和上游当前文档复核。

## 项目形状

```html
<div id="root"
  data-composition-id="main"
  data-start="0"
  data-duration="12"
  data-width="1920"
  data-height="1080">
  <div id="intro"
    data-composition-id="intro"
    data-composition-src="compositions/intro.html"
    data-start="0"
    data-duration="4"
    data-width="1920"
    data-height="1080"></div>
</div>
```

`compositions/intro.html` 的场景内容置于 `<template>`，场景根、host 和注册 key 都为 `intro`。样式和脚本也必须放在 `<template>` 内，否则会被丢弃。

```html
<template>
  <style>#root { position: absolute; inset: 0; }</style>
  <div id="root" data-composition-id="intro" data-width="1920" data-height="1080">
    <h1 id="intro-title" class="clip" data-start="0.4" data-duration="3">Title</h1>
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.fromTo('#intro-title', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4);
    window.__timelines = window.__timelines || {};
    window.__timelines.intro = tl;
  </script>
</template>
```

## 容易破坏导出的规则

- 只暂停 composition 根 timeline，不主动 `play()`。场景 timeline 不 `add()` 到根 timeline，避免被重复 seek。
- 场景内用 `fromTo` 明确起止状态，避免 `from` 在回退 seek 后继承错误初态。
- id 在装配后的页面内唯一，建议加场景前缀；场景 timeline 不跨文件查找节点。
- 根 `data-duration` 必须覆盖所有 clip 的结束时间。clip 可见区间为 `[start, start + duration)`。
- `data-track-index` 是 Studio 轨道，不控制绘制层级；绘制层级仍由 CSS `z-index` 决定。
- 场景 host 的 `data-duration` 是显示窗口；窗口不足会提前消失，时间线较短则可能保持末帧。
- 场景根用 `inset: 0` 适配画布，不写死输出像素；全屏背景同样显式定位。
- 对 `data-start="intro + 0.5"` 等相对时间务必 snapshot，因为 id 拼写或循环引用问题可能静默落到 0。
- 字体应在实际使用文件中 `@font-face`，优先本地资源；不要假设上游内置 Latin 字体覆盖中文。
- 媒体的 `muted`、`data-has-audio`、音量、裁切和播放速率必须明确，链接的视频/音频同步修改时间。

## 检查与导出

| 阶段 | 命令/动作 | 通过标准 |
|---|---|---|
| 结构检查 | `npx hyperframes lint` | 无阻断错误；不能用警告豁免掩盖问题 |
| 综合检查 | `npx hyperframes check --json` | lint、runtime、layout、contrast 实际执行且错误清零 |
| 静帧 | `npx hyperframes snapshot` | 打开 PNG，覆盖每个场景、转场、密排版与结尾 |
| 时间线 | `npx hyperframes timeline --json` | 媒体/clip 的绝对区间、时长与归属符合设计 |
| 交互预览 | `npx hyperframes preview` | 页面可打开，动画 seek 与交互预览一致 |
| 草稿/交付 | `render --quality draft/delivery` | 文件非空，时长/画幅/fps/编码符合 brief |
| 最终复核 | `ffprobe` + 解码帧 + 音频检查 | 不只看 HTML，检查真正交付的 MP4 |

`check` 的采样数为 0 意味着没有完成相应检查。单帧入场中的布局提示和持续遮挡应区别判断。`data-layout-allow-*` 只用于有意设计的最小节点，不为让门禁通过而全局关闭检查。

## 渲染位置

- 本地：`render --quality delivery --output out.mp4`。
- 可复现容器：`render --docker --strict --output out.mp4`。
- 变量批量：`render --batch rows.json --output "renders/{name}.mp4"`。
- 托管或自有云：使用上游 `cloud`、`lambda`、`cloudrun` 文档，明确认证、费用、网络和数据边界。

最终视频可再交给 `video-qa-frameproof` 做空帧、冻结、字幕、音频、元数据和 revision gate 检查；两类工具互补，不互相替代。
