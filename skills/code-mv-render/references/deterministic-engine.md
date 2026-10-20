# 确定性 Canvas 引擎 · 实现规范（已验证可导出）

> 本规范来自本库自建案例《CVE 编号破十万》的实际代码：单文件 HTML、Canvas 2D、`renderFrame(t)`、口播字幕时间轴、无头 Edge 录制、ffmpeg 转码。
> 目标：**浏览器里看到的每一帧，都能在导出文件里逐帧复现**；不依赖构建工具、不依赖网络、不依赖第三方动画库。

---

## 1. 核心契约

```js
function renderFrame(t) { /* 画面完全由 t 决定 */ }
```

四条不可违反的约束：

1. **不读系统时钟**：不要在 `render` 里 `Date.now()` / `performance.now()`。
2. **不留跨帧状态**：上一帧画的圆不能影响这一帧；每帧从背景重画。
3. **随机必须种子化**：`mulberry32(seed)`，种子来自固定常量或整数键（镜头 id、行号），不能用 `Math.random()`。
4. **资源在首帧前准备好**：字体、纸纹、网点、grain、预渲染底图只生成一次；渲染时不回读像素（`getImageData` 只用于一次性生成）。

`t` 的单位是秒，范围 `0..DUR`。片头警告页可以放在负时间，且不移动任何事件时间。

---

## 2. 文件结构（单文件即可）

```
demo.html
├── <style>            播放器外壳（暗底、舞台、控制条）
├── <canvas>           1920×1080 内部坐标系
└── <script>
    ├── 常量/调色板/字体
    ├── 数学与 PRNG
    ├── 离屏底图：darkCanvas / paperCanvas / grains[3]
    ├── 绘制工具：rule / tracked / crosshair / grain
    ├── 数据表：SHOTS / SUBS / CUES
    ├── 镜头函数：sceneCounter / sceneLedger / scenePlate / ...
    ├── renderFrame(t)
    └── 播放器 + 录制导出
```

不引入 npm 依赖；导出脚本在外部用 Node 调无头浏览器。

---

## 3. 时间表

### 3.1 分镜表

```js
const SHOTS = [
  { start: 0,  end: 7,  name: '00 冷开场' },
  { start: 7,  end: 22, name: '01 编号破十万' },
  { start: 22, end: 38, name: '02 口径对账' },
  // ...
];
```

### 3.2 字幕表（口播）

```js
const SUBS = [
  [0.9, 6.6,  ['2026 年 9 月 25 日，CVE 项目做了一件','27 年没做过的事。']],
  [7.6, 12.8, ['一年之内的编号，正在逼近 10 万。']],
];
```

- 每行手动断句，最多两行；不要依赖自动换行（断行位置决定阅读节奏）。
- 字幕带固定在画面底部同一位置（本案例 baseline 962 / 1014，33px，最多两行）。
- 字幕颜色随底图切换：暗底米白 + 黑晕；纸底近黑 + 米白晕。
- **数字与字幕同步**：字幕说最终值时，画面数字应已经或同时到达最终值；不要让观众读到两个不同的数。

### 3.3 事件表

不在字幕边界上的动作（印章落下、差额括号、节点点亮）直接用镜头内局部时间：

```js
const lt = t - 52;
const p = smooth(0, .8, lt);       // 0..1 的缓动进度
```

所有魔法数字集中写在镜头函数顶部，方便整体平移。

---

## 4. 绘制分层

每个镜头至少三层：

| 层 | 内容 | 例子 |
|---|---|---|
| 背景 | 永远不是纯黑/纯白 | 暖黑渐变 + 技术网格 + 暗角；纸底 + 纤维 + 网点 |
| 主体 | 必须撑住画面 | 计数器、双柱、记录页、时间线 |
| 前景/界面 | 角标、刻度、字幕、裁切标记 | 左上标签、右上日期、底部字幕 |

静态背景预渲染到离屏 canvas，每帧 `drawImage` 一次：

```js
const darkCanvas = (() => {
  const c = mk(W, H), x = c.getContext('2d');
  // 渐变、网格、尘土、暗角……
  return c;
})();
```

grain 用 3 张 640×360 噪声图循环，每帧只叠 4%–6%：

```js
function grain(t){
  const idx = Math.abs(Math.floor(Math.max(0,t)*12) % 3);
  ctx.save();
  ctx.globalAlpha = .045;
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(grains[idx], 0, 0, W, H);
  ctx.restore();
}
```

---

## 5. 镜头注册与渲染入口

```js
function renderFrame(t){
  ctx.setTransform(1,0,0,1,0,0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#080807';
  ctx.fillRect(0,0,W,H);

  if (t < 22)      sceneCounter(t);
  else if (t < 38) sceneLedger(t);
  else if (t < 52) scenePlate(t);
  else if (t < 68) sceneRecord(t);
  else if (t < 82) sceneTimeline(t);
  else             sceneOutro(t);

  grain(t);
  drawSubtitles(t);
}
```

优点：一个文件读完所有镜头，便于整体调时间；镜头之间共享底图与工具函数。

更大的项目再拆模块：

```
engine.js   renderFrame + palette + draw
scenes/01_boot.js … 13_shutdown.js
cues.js     所有非网格时间
```

---

## 6. 绘制工具（几个必须写对的）

### 6.1 带字距的标签

```js
function tracked(text, x, y, size, color, spacing = 3, align = 'left', family = MONO, weight = 400){
  ctx.save();
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.fillStyle = color;
  const chars = [...text];
  const widths = chars.map(ch => ctx.measureText(ch).width);
  const total = widths.reduce((s,w) => s+w, 0) + spacing * (chars.length-1);
  let cx = align === 'center' ? x-total/2 : align === 'right' ? x-total : x;
  chars.forEach((ch,i) => { ctx.fillText(ch, cx, y); cx += widths[i]+spacing; });
  ctx.restore();
}
```

小标签（12–17px，字距 3–5）是这套风格的骨架；中文不要用过大的字距（>6 会散）。

### 6.2 细线必须叠乘透明度

```js
function rule(x1, y, x2, color = LINE, alpha = 1, h = 1){
  ctx.save();
  ctx.globalAlpha *= alpha;   // 不能写 = alpha
  ctx.fillStyle = color;
  ctx.fillRect(x1, y, x2-x1, h);
  ctx.restore();
}
```

**已验证的坑**：写成 `globalAlpha = alpha` 会让处于"0 透明度父组"里的分隔线重新可见，导致未入场的卡片提前露出边框。

### 6.3 缓动

```js
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const smooth = (a,b,x) => { const t = clamp01((x-a)/(b-a)); return t*t*(3-2*t); };
const easeOut = t => 1 - Math.pow(1-t,3);
const easeInOut = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
```

- 数字/条形：`easeOut`，收尾减速明显。
- 镜头推近：`smooth`（起止都软）。
- 扫描线/滚动：线性。

### 6.4 种子随机

```js
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
```

纸纹、尘土、撕裂带、碎片都用它；同一个种子每次生成完全一样。

---

## 7. 播放器

```js
let t = 0, playing = true, lastNow = performance.now();

function loop(now){
  const dt = Math.min(.1, Math.max(0, (now-lastNow)/1000));
  lastNow = now;
  if (playing){
    t = Math.min(DUR, Math.max(0, t+dt));
    if (t >= DUR){ t = DUR; playing = false; }
  }
  renderFrame(t);
  requestAnimationFrame(loop);
}
```

要点：

- `dt` 必须 **clamp 到 ≥0**。录制启动时 `rAF` 时间戳可能小于 `lastNow`，负 `dt` 会把 `t` 推成负数，进而让 `Math.floor(t*12)%3` 取到 `-1`，`drawImage(undefined)` 抛异常，整个循环停住。
- 键盘：空格播放/暂停，←/→ 1 秒，`,` `.` 逐帧（1/30s）。
- 进度条用 pointer 事件，拖拽时直接 `renderFrame(t)`。
- URL 参数：`?t=59&still=1` 直接出静帧，便于质检；`?clean=1` 隐藏 UI；`?record=1` 自动录制。

---

## 8. 导出

### A. 页面内录制（本案例采用，最快）

```js
const stream = canvas.captureStream(60);
const rec = new MediaRecorder(stream, {
  mimeType: 'video/webm;codecs=vp9',
  videoBitsPerSecond: 16_000_000,
});
rec.ondataavailable = e => chunks.push(e.data);
rec.onstop = () => { /* Blob → a.download */ };
rec.start(400);
```

- 90 秒 1080p60 约 120–130MB WebM，转 H.264 后约 22–23MB。
- 导出模式隐藏播放器外壳（`body.export`），画布铺满 1920×1080。
- 录制是实时时钟：不要同时做重 CPU 的事；不要切到后台标签。

### B. 无头 Edge + CDP 下载

```powershell
msedge.exe --headless=new --remote-debugging-port=9412 ^
  --user-data-dir=%TEMP%\rec --disable-gpu ^
  --disable-background-timer-throttling ^
  --disable-renderer-backgrounding ^
  --disable-backgrounding-occluded-windows ^
  --window-size=1920,1080 about:blank
```

通过 CDP：

```
Browser.setDownloadBehavior { behavior:'allow', downloadPath, eventsEnabled:true }
Target.createTarget → Target.attachToTarget(flatten)
Emulation.setDeviceMetricsOverride { width:1920, height:1080, deviceScaleFactor:1 }
Page.navigate → file:///...?record=1
轮询 downloadProgress / 目录文件大小稳定
```

脚本见 `templates/export-video.mjs`。

### C. 转码（加静音轨，兼容性最好）

```bash
ffmpeg -y -i demo.webm -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 \
  -r 60 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -shortest -movflags +faststart out.mp4
```

检查：

```bash
ffprobe -v error -show_entries format=duration,size \
  -show_entries stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 out.mp4
```

### D. 逐帧导出（最严格，慢）

用 CDP 的 `Page.captureScreenshot` 在固定 `t` 上截帧，按 30/60fps 写进 ffmpeg 管道：

```
Runtime.evaluate: t=12.5; playing=false; renderFrame(12.5)
Page.captureScreenshot { format:'jpeg', quality:92 }
ffmpeg -f image2pipe -framerate 60 -i - ...
```

优点：完全不受实时性能影响，帧时间精确；缺点：2700 帧约数分钟。用于最终 4K 或需要逐帧一致的交付。

---

## 9. 质检流程

1. **关键帧静帧**：对每个切点后 0.2s、每个关键词落定、每个事件，各截一张 1920×1080 PNG，逐张看构图。
2. **首尾帧**：每个镜头第一帧和最后一帧必须成立（不能靠中间帧"路过"好看）。
3. **数字同步**：字幕出现最终值时，画面数字必须已到位。
4. **视频回看**：从成片按 10 秒间隔抽帧，检查有没有黑帧、错位、UI 漏进画面。
5. **闪光**：任意 1 秒内大面积亮度往返 ≤3 次；红色闪烁单独统计；快速图案至少保持 6 帧。
6. **时长/编码**：`ffprobe` 确认 60fps、90.0s、无可变帧率。

---

## 10. 性能与稳定

- 1920×1080 Canvas 2D，60fps 的目标是"每帧 <8ms"。静态底图、网点、grain 全部预生成。
- 不要在每帧创建 `CanvasPattern`、渐变、大数组；在初始化时创建。
- 避免每帧绘制 100+ 段文字；用离屏 canvas 缓存重复的字墙/编号背景。
- 长文本不要每帧 `measureText` 换行；字幕行已在数据表里手动断行。
- 录制前关闭浏览器缩放（`devicePixelRatio=1`），否则导出分辨率会被放大。

---

## 11. 复用清单

- [ ] `renderFrame(t)` 纯函数，无 `Date` / `Math.random` / 跨帧状态
- [ ] 三张时间表：`SHOTS` / `SUBS` / 局部事件时间
- [ ] 三层画面：背景 / 主体 / 前景
- [ ] 颜色语义固定，只在事件时切换
- [ ] 字幕带位置与字号全片一致
- [ ] 数字与字幕同步
- [ ] 切点全部落在字幕边界或事件点
- [ ] 首尾帧检查通过
- [ ] `?still=1` 可逐帧质检
- [ ] 导出 1080p60，`ffprobe` 校验
