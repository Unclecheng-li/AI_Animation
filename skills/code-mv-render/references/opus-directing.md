# Opus JS Animations：导演前置与逐帧交付

来源：[klsoen/opus-js-animations](https://github.com/klsoen/opus-js-animations)（MIT），提炼其 `skills/opus-js-animations/SKILL.md`。本库只吸收工作流，不 vendor 上游脚本或模板；下述 `<skill>` 命令只有安装上游后可用。

## 导演前置：brief → 声音 → 视觉 → treatment

1. **复述 brief**：主题、感受、观众、平台/画幅、时长、屏幕文字、禁忌与参考片。已有答案不重复问，主动说明假设。
2. **确认声音来源**：用户音频、合法可获取的链接、代码合成配乐、用户授权的 TTS，或无声。密钥只走安全环境，不打印、不写入工程。
3. **先分析声音再设计画面**：时长、段落、停顿、关键字、onset、tempo、情绪、录音缺陷；语言内容核对可靠文本。不能用凭空猜测的 BPM 代替音频分析。
4. **补齐视觉方向**：风格、节奏/结构、2D/3D、 muted 观众必须理解的 1–2 个重点、hook 与结尾。默认 2D，只有内容需要才选 3D。
5. **提交 director’s treatment**：logline、中心视觉、 palette、声音、按音频时间排列的结构、逐场景画面/镜头/文字/声音、画幅与风险。上游默认等用户批准；用户已明确授权直接制作时按其授权继续，并把 treatment 留在工程内。

## 工程合同

交付建议包含：

```text
film/
├── index.html    # 自包含画面，资源就绪后 ready
├── FILM.md       # 已确认 treatment、时间表与关键决定
└── film.mp4      # 已验证的成片；其他比例分别导出
```

页面暴露 `duration / ready / seek(t) / shots / marks`。`seek(t)` 完整重建帧，画面和声音读取同一时间数据；物理模拟使用种子、固定步长，从镜头初态确定性重放，绘制函数不写模拟状态。

先实现**最难且最承载信息的镜头**，静帧通过后再铺满时间线。文字、图形 sprite 与离屏资源预生成；大范围模糊限制在小离屏层，避免每个元素都触发全帧 filter。

## 上游审查/渲染命令

仅在已安装上游完整 Skill 时使用：

```bash
node <skill>/scripts/verify.mjs film/index.html
node <skill>/scripts/stills.mjs film/index.html --every 1 --sheet
node <skill>/scripts/stills.mjs film/index.html --range 13.4:14.3:0.1 --sheet
node <skill>/scripts/stills.mjs film/index.html --times 12.9 --crop 250,800,560,760 --sheet
node <skill>/scripts/render.mjs film/index.html --fps 30 --audio source/voice.wav --out film/film.mp4 --workers 2 --ss 2
```

本库现有工程继续使用 `templates/qa-stills.mjs` 和 `templates/export-video.mjs`，不要把上游命令当成本地已存在的脚本。

## 多比例与交付

- 多比例共用场景/时间函数，通过布局函数重排，不在导出后硬裁或拉伸。
- 最终版本可 2× supersample + Lanczos 缩小；动态颗粒会消耗平台二压码率，交付上传版时谨慎使用。
- H.264/yuv420p、BT.709/TV range、faststart 等按发布平台明确设置；不只检查源 HTML。
- 不用实时录屏导出。交付列明 purity、帧数、文字、画幅和实际检查项，也说明未完成的听审或其他限制。
