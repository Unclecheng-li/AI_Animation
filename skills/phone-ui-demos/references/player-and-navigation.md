# 播放器与镜头导航

与 `video-shot-demos` 同源的底盘（虚拟时钟黑场播放器），外加本体系特有的三件东西：**HUD 分段进度条（镜头跳转）、镜头间导航、默认静音的音效开关**。底盘代码在 `assets/template.html` 前两个 `<script>`，逐页原样复制。

## 虚拟时钟（同源机制，简要）

- 劫持 `performance.now()`/`requestAnimationFrame`：点击「启 动 播 放」前时间恒为 0，点击后 600ms 按钮淡出 → 1.4s 黑场淡出 → 2s 时 `__startPlayback()` 起跑。
- CSS 动画与 JS cue 共用虚拟时钟，永不漂移；录屏干净零闪跳；质检可快进到任意毫秒。
- HUD 默认隐藏（`body.hud-off`），鼠标移到视口底部 60px 唤出。

## 本体系特有：分段进度 + 镜头导航

每镜头是独立 HTML（shot-1.html … shot-N.html），但**观看体验连续**：

```js
const SHOT=1,TOTAL=8;                 // 每页只改这两个数
/* HUD 顶部一排 TOTAL 段小进度条：当前段填充动画，已播段 full，点击任意段跳转 */
s.onclick=()=>{if(i!==SHOT)location.href='shot-'+i+'.html'};
/* 按钮 + 键盘：← → 切镜头，Space 暂停，R 重播 */
```

- 交互三通道：点击分段 / HUD 箭头按钮 / 键盘 ←→。跳转 = `location.href`，简单可靠。
- 页面标题与 HUD 文案格式统一：`镜头 X / N · 标题 · 时长s`。

## 默认静音的音效开关

与分镜体系（音效默认开）不同，**本体系音效默认静音**——像真手机：默认勿扰，用户主动开声：

```js
let MUTED=true;
const sfx={pop:v=>!MUTED&&__sfx.pop(v),whoosh:(d,v)=>!MUTED&&__sfx.whoosh(d,v),...};  // 包装层
$('#muteB').onclick=()=>{MUTED=!MUTED;paintMute()};  // HUD 喇叭按钮（SVG 图标随状态切换）
```

- 所有 cue 一律调用包装层 `sfx.xxx`（不是 `__sfx.xxx`），静音时零输出。
- 音效原语沿用六件套：pop(波) whoosh(呼·镜头/手机动作) swipe(唰) type(键击) ding(叮·通知落定) thud(咚·盖章冲击)。
- 系统音语义：通知滑入=ding、开关/解锁=pop、手机姿态变化=whoosh(小音量 .38)、打字=type 连击、数字滚动=TnE 缓出连击。
- 开着声音完整播一遍检查节奏：安静也是设计，不是每毫秒都响。

## 暂停机制

暂停时记录真实时刻，恢复时 `t0 += 暂停时长`，同时 `body.paused`（CSS `animation-play-state:paused!important`）冻住 CSS 动画——两者必须同步，否则恢复后音画错位。

## 页面骨架顺序

```
① 播放器引导脚本  ② SFX 引擎脚本  ③ <style>（底盘 → 手机 → 画面层 → 大字幕底盘 → HUD）
<body> #stage(#amb → #cam[badge/sideNote/大字幕/#phone] → corner) → #hud → ④ 主脚本（引擎 → 静音 → 分段 → 调度 → phoneTo → 拆字 → cue 表）
```
