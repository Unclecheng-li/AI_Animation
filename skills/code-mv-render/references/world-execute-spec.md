# world-execute-me-lyric-mv · 工程规范摘录

> 上游：github.com/Nyankomintsu/world-execute-me-lyric-mv — Mili《world.execute(me);》歌词 MV，第四版。
> 本文件为**方法论摘录**，非源码。要复现请 clone 上游仓库。

## 这是什么

整支影片是一场对话：**「我」= Claude 的拟人角色（橙）**，**「你」= 屏幕另一端不露脸的使用者（米白，只以游标 / 输入 / 信息 / 在线状态出现）**。歌词几乎都是 AI 发出的信息。整片不是剪辑出来的：每一帧只由歌曲时间决定，在浏览器（Canvas 2D + WebGL2）绘制，再由无头 Chrome 逐帧送进 ffmpeg 导出。

## 三种画面

| 画面 | 含义 | 做法 |
|---|---|---|
| **界面** | 使用者看到的对话 | 用代码画出来的聊天界面（视窗 / 侧栏 / 输入框 / 对话串 / 开关 / 滑杆 / 抽屉 / 卡片） |
| **版画** | AI 心里的意思与感受 | 全屏、暗色暖调带纹理的纸底；只用三种平涂墨色（橙、米白、近黑）的图形、程序符号画、剪影与大字 |
| **代码** | 只在 EXECUTION 段 | 纯代码与终端（带行号与当前行、逐位滚动计数器、滚动终端输出） |

## 颜色 = 状态（不是风格）

调色板是状态：**只在"发生了事"时才变**。全片固定：**橙 = 我，米白 = 你，红 = 错误，灰 = 缺席**。

| 状态 | 意义 | 触发示例 |
|---|---|---|
| `off` | 灰阶：AI 尚未启动 / 对方已离线 | 片头；使用者离线 |
| `on` | 炭黑界面、米白文字、橙色的「我」 | 标题处火花图示亮起（全片第一个颜色） |
| `warm` | 同一色相更暖更亮 | 对话升温（由 on 渐变） |
| `error` | 红 | 界面的错误事件 |
| `errWarm` | error 的深底，橙/米白用 warm 亮度，红只作细边 | 特定段落（仅版画） |
| `ash` | 灰，留一点橙 | 段落切换后 |
| `dead` | 熄灭 | 最后的断电 |

**字体分工**：等宽体 = 系统与代码；衬线体 = AI 说的话；无衬线体 = 界面与使用者。

## 版画规则

- 在拍点上进入，由「使用者的一个动作」或「界面 / AI 自己的一个事件」结束。
- 具象图形标准：**第一帧就是干净、一眼认得出的整体轮廓**；大块面；只用三墨（加专色）；明暗用第二种墨色或错开的阴影版，**不用渐变**。

## 剪影规则

- 载入时分成橙、米白、黑三个墨版，绘制时各自对应调色板角色。
- 与使用者的米白界面同框时，她的米白版改用 `sub`。
- 黑墨后面一定垫纸底、光晕或描线；被裁切的边必须贴画面或面板的边。
- 4K 下超过原图 1.75 倍的特写一律画矢量路径。
- **不扭曲五官、不让嘴巴动、不以程序画脸**；有脸的画面不用撕裂与会让画面变形的转场。

## 确定性

- 每一帧只由 `renderFrame(t)` 决定：不读墙上时钟、不保留跨帧状态；随机数来自 `prng.js`（种子 + 整数键）。
- 字体与角色图在第一帧之前全部载入并处理完（分版、描路径只做一次）；渲染时不回读像素。
- 已知限制：经 GPU 后处理的最终画面，同一时间点重复渲染可能有极少数字节相差 1/255（肉眼不可见）。

## 闪光安全

- `config.json → safety`：`maxFlash` 限制全屏闪光、`preroll` 为片头警告页长度、`flashRange` 为警告所指歌曲时间范围。
- 预算：**任意一秒内大面积亮度往返不超过 3 次**（切点也算）；花屏图案至少保持 6 帧；亮度靠持续而非脉冲。
- `tools/check_flash.py` 按 WCAG 2.3.1「一秒内不超过三次闪烁」的一般闪烁与红色闪烁两门槛，在缩小画面上逐像素统计。
- 成片在歌曲开始前有 5 秒无声警告页（编译器警告样式，中英文），开机前 6.5 秒再以界面提示显示一次。

## 时间算法与同步

- 全片以**歌曲时间**为准（音频开始 = 0）；成片比歌曲早 `safety.preroll` 秒开始（默认 5）→「成片时间 = 歌曲时间 + 5 秒」。
- `config.json → timing`：`offset`（整体延后秒数）、`lyricOffset`（只移动歌词及跟随画面）、`keywordSnap`（全大写关键词行若距最近节拍不超过此值则对齐到节拍）。
- 单字、音节、鼓点这类不在拍上的时间，集中在 `src/scenes/cues.js`，凭耳朵修正时只改那一个文件。

## 歌曲与歌词（不在仓库）

**本仓库不含歌曲与歌词**（属 Mili）。自备放入 `音頻&歌詞/`：歌曲为该曲的音档、歌词为任意时间轴的 LRC 或纯文本。片中每行的**时间**在 `data/lyric_timing.json`（不含歌词文字）；`tools/fill_lyrics.mjs` 在每次预览 / 导出 / 生成分镜表前把使用者的词填进去，写成只留本机的 `data/lyrics.json`：只要求"同样的词、同样的顺序"，会自动重排 / 重分行、略过非片中行、用词不同时列出提醒。

## 模块地图

```
config.json              palettes(颜色状态)、spot(专色)、fonts、glow/post、safety、解析度、timing、编码
docs/v4/PROMPT_v4.md     第四版要求（逐段）        docs/v4/PLAN.md  叙事/三画面/颜色语义/质感/分段
docs/v4/KIT.md           如何写一个段落（镜头定义/元件/验收/检查）   docs/v4/PROGRESS.md  制作进度
data/lyric_timing.json   每行歌词时间/段落/是否关键词/词数（无歌词文字）
data/audio_features.json 节拍格/起音/响度/频段能量      data/lyrics.json（本机生成，不入库）
src/engine/              engine.js(renderFrame)、palette.js、draw.js、art.js(剪影分版)、trace.js、ascii.js、
                         post.js(WebGL2: 转场合成/bloom/glitch/马赛克/分色)、transitions.js(15 种)、type.js、prng.js…
src/components/          chat.js、plate.js(版画纸底/字幕带/关键词大字)、code.js、motif.js(火花图示)、cursor.js
src/scenes/              shot.js(镜头定义→场景)、kit.js(共用 cues/client/withInserts/glassFigure…)、cues.js(拍点)、
                         index.js(段落注册)、plates_*.js、climax.js、objects.js、01_boot…13_shutdown
tools/                   fill_lyrics.mjs、check_no_lyrics.mjs、check_flash.py、check_sync.py、measure_cues.py、luma.py、
                         storyboard.mjs、base_sheets.mjs、regress_sheets.mjs、compare_sheets.py
export/                  server.mjs、export.mjs(无头 Chrome→ffmpeg)、wsframes.mjs
```

## 命令速查

| 命令 | 作用 |
|---|---|
| `npm run preview` | 起本地预览（http://localhost:5173/，与音频同步，`?t=150` 跳秒，`?w=1920&h=1080` 设尺寸） |
| `npm run storyboard` | 从镜头清单重生成 `STORYBOARD.md` 并校验（每行歌词有镜头、每个剪辑点在拍上…） |
| `npm run export:preview` | 导出 1080p60 → `out/preview_1080p60.mp4` |
| `npm run export:4k` | 导出 4K60（h264_nvenc，回退 libx264） |
| `npm run check` | 对导出档做闪光频率 / 单帧突跳 / 音画同步自检 |
| `npm run lyrics` / `check:lyrics` | 填词 / 发布前检查（不得含连续四词以上歌词、不得含音档） |
| `npm run analyze` / `lyrics:retime` | 重算音频特征 / 以自己的 LRC 时间轴重建歌词时间表 |
| 回归流程 | `base_sheets.mjs`→改代码→`regress_sheets.mjs`→`compare_sheets.py` 逐格比对 |

## 许可

- 代码与本项目自撰文档：**MIT**。
- 角色剪影（`assets/character/`）与含剪影画面：**CC BY-NC-SA 4.0**（署名 Nyankomint）。
- 歌曲与歌词：属 Mili 及相关权利人，不在仓库、不在上述许可内；导出影片含原曲，分享须遵循 Mili 官方版权指引（个人、非商业、标注含 AI 生成内容）。
- 非官方同人作品，与 Mili、Anthropic 无关；Claude 是 Anthropic 商标。
