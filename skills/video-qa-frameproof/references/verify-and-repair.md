# FrameProof 扫描、修复与回归闭环

来源：上游 README、`generated-video-auditor` 工作流与项目文档。本文只保留常用合同；参数以当前 `npx frameproof-video-qa --help` 和上游文档为准。

## 1. 文件级扫描

适合任何渲染器生成的 MP4：

```bash
npx frameproof-video-qa scan out/video.mp4 \
  --aspect 16:9 \
  --json artifacts/frameproof.json \
  --html artifacts/frameproof.html
```

添加最终导出音频、静音和字幕检查：

```bash
npx frameproof-video-qa scan out/video.mp4 \
  --captions out/captions.srt \
  --audio --check-silence \
  --json artifacts/frameproof.json \
  --html artifacts/frameproof.html \
  --fix-packets artifacts/fix-packets.json
```

音频分析是显式选项；未加 `--audio` 时不能报告“音频已验收”。字幕适配 SRT、WebVTT、Remotion 风格数组与 JSON word/segment timing。

## 2. 源码感知扫描

当缺陷需要回到源码最小修复时，验证并传入 manifest：

```bash
npx frameproof-video-qa manifest validate .frameproof/manifest.json

npx frameproof-video-qa scan out/video.mp4 \
  --manifest .frameproof/manifest.json \
  --captions out/captions.srt \
  --audio --check-silence \
  --json artifacts/frameproof.json \
  --html artifacts/frameproof.html \
  --fix-packets artifacts/fix-packets.json
```

Manifest 可声明：

- 帧区间、composition/sequence/component 和源文件/行号；
- 元素区域与文字元数据；
- `motion`、`text`、`visible`、`audio`、`safe-area` 断言。

核心扫描本身 renderer-agnostic，不要求运行时安装 React 或 Remotion。没有映射的内容不能假装具备源码定位；Agent 修复不应猜测不存在的源文件。

## 3. 读报告，但不只读报告

1. 先看 error，再看 warning 和检测覆盖范围。
2. 打开 Finding 指向的实际视频帧，必要时扩大前后时间带或做 1:1 裁切。
3. 判断是缺陷、可解释的有意静止/设计，还是检测局限。
4. 按 Fix Packet 的源文件、expected/actual、建议动作与复现命令修复源头。
5. 用同一 brief、输入、种子和输出设置重渲，避免同时改变无关变量。
6. 重新扫描新 MP4，并人工检查受影响帧、接缝、字幕和音频。

不要通过删除输入、跳过音频、全局降低阈值、随意 accept 或覆盖 baseline 让报告变绿。边缘活动不等于 OCR；自动可见性/运动检查不等于叙事和审美验收。

## 4. Revision gate

```bash
npx frameproof-video-qa scan out/current.mp4 \
  --manifest .frameproof/manifest.json \
  --baseline .frameproof/baseline.json \
  --acceptances .frameproof/acceptances.json \
  --json artifacts/current.json \
  --revision-json artifacts/revision.json \
  --revision-html artifacts/revision.html \
  --markdown artifacts/frameproof-pr.md \
  --sarif artifacts/frameproof.sarif \
  --junit artifacts/frameproof.xml
```

使用 baseline 后，CI 重点阻断新增或恶化的 error；旧的 unchanged findings 仍应可见。accepted 是审计决定，不是修复。两版报告可生成 changed-frame filmstrip，但仍需结合实际视频判断。

退出码：`0` 通过当前门禁；`1` 存在当前或新增/恶化错误（`--fail-on-warning` 时 warning 也失败）；`2` 输入、配置、manifest 或环境无效。退出码 2 不能当成质量通过。

## 5. 与本库现有 QA 的组合

- `code-mv-render` 的 contact sheet、逐格看图与音画复核负责创作阶段。
- HyperFrames `check` / `snapshot` 负责工程结构、布局与渲染前检查。
- FrameProof 负责最终视频的可重复扫描、源码定位、修复包与版本间回归。

三者互补。最终交付必须说明哪些由工具检查、哪些由人工看图/听审、哪些未覆盖。
