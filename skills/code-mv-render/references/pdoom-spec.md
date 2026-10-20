# pdoom-video · 工程规范摘录

> 上游：github.com/mexicat/pdoom-video — "I'm Upping My P(doom)" 生成式 MV，逐字卡拉 OK 排版。
> 本文件为**方法论摘录**，非源码。要复现请 clone 上游仓库。

## 这是什么

一支**生成式、代码渲染**的音乐视频，带**逐字同步的卡拉 OK 排版**。每一帧都是歌曲时间的确定性函数，因此浏览器里的实时预览与离线导出的 1080p60（或 4K60）**完全一致**。概念、风格圣经与逐片处理在 `docs/TREATMENT.md`；引擎与场景 API 在 `docs/ENGINE.md`。由 Claude（Opus 5.5）在 Claude Code 中协作完成。

## 目录布局

```
audio/pdoom.mp3        歌曲（Claude-Pop 版）
lyrics/lyrics.src.js   原始行级歌词（近似时间）
analysis/              Python(uv) 工具：Demucs 分轨、CTC 强制对齐 × Whisper 交叉校验、节拍/强拍/起音分析
data/lyrics.json       词级（部分音节级）歌词时间
data/audio.json        速度(132.007 BPM)、拍、强拍、段落、鼓/人声起音、响度包络
app/                   渲染器：TypeScript + three.js，bun + Vite
  src/engine/          渲染核心：时间线播放、后处理(bloom/halation/grain)、排版
                       (Archivo、IBM Plex Mono、Cormorant Garamond、单线条绘图字体)、GPU 线批、HUD
  src/scenes/          每片一个模块（open/loss/prompt/hook/room/shoggoth/spacetime/ascent/
                       bureau/leftturn/paperclips/fuse/stack/dense/loom/ilya/outro）+ 共用母题
  src/timeline.ts      剪辑：场景窗口锚定到歌词行并对齐到拍网格
  scripts/render.ts    离线渲染器（无头 Chrome → 经 WebSocket 送原始帧 → ffmpeg）
out/                   导出（不入库）
```

## 预览

```bash
cd app && bun install && bunx vite      # 打开 http://localhost:5173/，?t=23 从指定秒开始
```

| 按键 | 作用 |
|---|---|
| `space` | 播放 / 暂停 |
| `←` / `→` | 跳 ±1s（`shift` 时 ±5s） |
| `,` / `.` | 逐帧步进 |
| `[` / `]` | 上一个 / 下一个场景 |
| `l` | 循环当前场景 |
| `h` | 隐藏 UI |

## 渲染管线（核心）

```bash
cd app
bun scripts/render.ts video --samples auto --shutter 0.2 --out ../out/pdoom.mp4
```

- **输出**：1920×1080 @ 60fps，x264 CRF 16，AAC 音频。
- **运动模糊**：每帧是许多子帧在短快门（`--shutter 0.2`，即帧时长的 1/5）内的平均，所以快速运动留下连续拖影而不是几个阶梯副本。
- **块级自适应采样**（`--samples auto`，本工程最有价值的机制）：按每 32×32 块挑采样数——**静止 12 / 常规运镜 36 / 甩镜·爆闪·快推 108 或 324**；某块当更多子帧不再使其变化超过 `--tol`（默认 3/255 级）即停止，后续子帧跳过该块，于是**快物体掠过静止背景的开销几乎只等于物体本身**。`--refine frame` 改为整帧一个采样数（更慢，是分块之前的老采样法）；`--samples N` 固定 N（`--samples 4` 出快速草稿）。
- **双渲染器管线**：两个无头 Chrome（`--workers 2`）轮流渲染 8 帧一块（`--chunk`），把帧**按序**流向同一个 ffmpeg——产物与单渲染器相同。一个渲染器在重场景已占满 GPU 时，第二个填轻场景的空档。等待编码的帧先缓存在内存（`--mem-gb`，默认 1）再落盘（`--spool-gb`，默认 20，系统临时目录），使轻场景里渲染器不必等 x264、重场景里 x264 再追上。
- 其它模式：`stills`、`sheet`（缩图表，`--cuts` 出每个场景边界）、`perf`、`plates`（重建 `public/plates/`，供 outro 倒带蒙太奇用的静帧；改场景后需重跑）。

### 4K

```bash
bun scripts/render.ts video --scale 2 --samples auto --shutter 0.2 \
  --x264 aq-mode=3:rc-lookahead=30 --out ../out/pdoom-4k.mp4
```

- 真正的 3840×2160 渲染（非放大）：每层、每线、每着色器都按物理分辨率渲染；场景仍以 1920×1080 逻辑像素布局，故 4K 帧看起来与 1080p 相同、只是更锐利。
- 成本：GPU 密集。一帧从约 40ms（静止帧）到数秒（光线步进房间在 108–324 子帧）。整曲在 M5 Pro 约 57 分钟；内存峰值约 23GB。
- 编码：胶片颗粒按 4K 每像素渲染，编码昂贵——默认 CRF 16 约 670 Mbit/s（整曲 13GB），`--crf 18` ≈ 450 Mbit/s、`--crf 20` ≈ 230 Mbit/s。
- `--scale 2` 对所有模式生效；`stills` 存全分辨率 PNG；浏览器预览加 `&scale=2`。

## 重算时间数据（换歌才需要）

已提交的 `data/*.json` 是渲染器所需的全部。重算需 stems 与中间产物（不在仓库）：
- **Stems**：Demucs `htdemucs_ft`，另加 mel-band-roformer 卡拉 OK 模型的主唱。
- **中间产物**：`ctc_emissions.py`、`whisper_run.py`、`vocal_feats.py` 写到 `analysis/work/`。
- 跑 `uv run python align.py`（→ `data/lyrics.json`）与 `uv run python analyze.py`（→ `data/audio.json`）；模型下载约 4GB 权重到 `analysis/.cache/`。

## 时间线

`src/timeline.ts` 是"编辑"：**场景窗口锚定到歌词行并对齐到拍网格**；`data/audio.json` 给出 132.007 BPM 的拍 / 强拍 / 段落用于吸附。

## 环境

bun、Google Chrome（离线渲染器经 playwright-core 驱动它）、带 libx264 的 ffmpeg。分析工具需 uv；渲染器不需要。

## 许可

- 代码：**MIT**，见 `LICENSE`。
- 字体（`app/public/fonts/`）：各自许可（SIL OFL / 公有领域，见 Credits）。
- **歌曲与歌词**（`audio/`、`lyrics/`、`data/lyrics.json`）：**不在 MIT 覆盖内**，属各自作者（歌词 by osmarks，基于 MusicPerson 的开场段与副歌；Claude-Pop 版由 deckard 发布）。
