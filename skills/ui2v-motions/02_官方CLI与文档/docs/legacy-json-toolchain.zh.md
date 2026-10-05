# 旧 JSON 工具链

UI2V 以前包含一套围绕 `animation.json` 的 JSON-to-MP4 renderer，相关包包括
`@ui2v/core`、`@ui2v/runtime-core`、`@ui2v/engine` 和 `@ui2v/producer`。

这套工具链已经不属于当前仓库的产品方向。现在的 UI2V 是面向 AI 工作流的
HyperFrames 视频动效资源库。

## 已移除内容

- JSON project validation 和 preview 命令
- Browser renderer 和 WebCodecs export pipeline
- Runtime frame planning APIs
- Renderer smoke examples 和 demo `animation.json` projects
- `doctor`、`validate`、`preview`、`render`、`inspect-runtime` 等旧命令

## 当前方向

```text
HyperFrames authoring
  -> HyperFrames package folder
  -> registry-item.json + entry HTML
  -> ui2v motion publish
  -> ui2v.com
```

请用 HyperFrames 做 composition 创作、预览和渲染。UI2V 负责已经完成的 motion
package 的搜索、安装、发布、更新和同步。

## 迁移建议

不要在这个仓库里恢复旧 JSON renderer 项目。请把它们重建或迁移成 HyperFrames
composition package。当 package 拥有 `registry-item.json` 和入口 HTML 后，用下面
命令发布：

```bash
ui2v motion publish ./path/to/package --version 1.0.0
```
