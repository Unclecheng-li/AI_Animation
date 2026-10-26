# 制作与 QA 合同

来源：`painted-animation` 与 `kinetic-reel` 的上游 `SKILL.md`、风格/声音规范和模板说明。本文是入口摘要；实际工程以所选 Skill 随附的完整指南为准。

## 共同时间合同

```js
frame = renderFrame(t)
```

- 任意 `t` 都能独立重建完整画面，预览与导出共用这一函数。
- 不使用 `Date.now()`、`performance.now()`、真实帧计数、未播种 `Math.random()` 或依赖上一帧的模拟状态。
- 并行渲染允许乱序完成；资源必须在首帧前就绪。
- 场景、字幕、节拍、章节与声音事件读取同一份时间数据。不用实时录屏作为最终导出，因为实时录屏会掉帧。

## painted-animation 要点

1. `STORYBOARD.md` 先写 logline、世界与色彩弧线、母题、角色情绪弧线，以及每镜观众必须理解的 reads。
2. 一个场景一个 IIFE 文件，通过 `shots([[t0, fn], ...])` 注册。先 blocking 关键姿势，看图后再做中间动作。
3. MV/歌词片先测量 tempo；歌曲 + LRC 是逐字卡拉 OK 的必要输入。歌词出现速度通常比直觉快，应据真实音频与歌词时间校准。
4. 使用手绘材质、平面 2D、可见的角色表演。文本默认退位，逐字歌词与少量拟声字例外。
5. 独立元素使用稳定的 boil seed，避免后续所有图形一起抖动；不创建与 p5 全局 API 冲突的顶层函数名。

上游典型命令（在完整工程内，而非本导航目录）：

```bash
node render.mjs --sheet=0.1,0.8,1.6,2.4 --cols=4 --w=480 --out=out/check/a.jpg
node render.mjs --strip=2.1:2.6 --out=out/check/strip.jpg
node render.mjs --sheet=2.3 --crop=760,420,500,400 --w=500 --out=out/check/face.jpg
node render.mjs --frames --workers=4
node render.mjs --encode --out=out/video.mp4 --audio=assets/song.mp3
```

## kinetic-reel 要点

1. 明确篇幅比例与事实来源。示例“Work Reel”使用章节制；真实项目不能凭视觉需要杜撰指标。
2. `reel/cues.js` 维护场景起点 `S`、节拍 `hits`、章节 `CH` 与时长 `dur`。`reel/reel.js` 每镜重画背景、GL、2D 字体图形与 HUD。
3. 标题命名机制，画面实际演示机制。纯示意内容标记 `SCHEMATIC`，医疗等敏感领域不作未经验证的效果声明。
4. 字体层级稳定：condensed display、wide grotesk、少量 italic serif、mono HUD；中文字体子集包含实际绘制的所有字符。
5. 音乐由同一 `cues.js` 合成。完成音频后检查波形/频谱、分段 RMS、峰值与响度；不能亲自听时要如实说明，不声称完成听审。

上游典型命令（在完整工程内）：

```bash
node render.mjs --sheet=1,4,7,10,13,15.5 --cols=3 --w=640 --out=out/check/sheet.jpg
node music/score.mjs
node render.mjs --frames --workers=4
node render.mjs --encode --audio=assets/score.m4a --out=out/reel.mp4 --fps=30
```

## 必做审查

| 层级 | 要检查什么 |
|---|---|
| Contact sheet | 构图、信息层级、角色大小、每镜事件、章节比例 |
| 时间带/逐帧 strip | 预备与跟随、转场接缝、文字速度、突跳、空帧 |
| 1:1 裁切 | 表情、手部/道具接触、细字、HUD 碰撞、笔刷与材质 |
| 最终 MP4 解码帧 | 编码后的真实画面、帧率、时长、接缝、字幕与音画同步 |
| 音频 | 音轨存在、非异常静音、真实瞬态、峰值与目标响度、许可 |

任何修复都要重渲并重看受影响位置。报告时长、输出路径与实际 QA 范围；不把自动脚本通过等同于视觉与听感验收完成。
