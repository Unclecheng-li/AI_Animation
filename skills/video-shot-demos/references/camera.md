# 镜头语言（推拉摇移 · 跟拍 · 慢放）

网页演示最容易显得"平"的原因：镜头不动。解法是把全部画面内容包进一个 `#cam` 层，用 transform 做**摄影机运动**，配合 whoosh 音效——观众会本能地感觉到"这是片子，不是 PPT"。

## 基础设施

```css
#cam{position:absolute;inset:0;transform-origin:0 0;
     transform:scale(1.2);                    /* 初始=开场特写位 */
     transition:transform var(--cd,1.4s) cubic-bezier(.16,1,.3,1);z-index:10}
```

```js
function camTo(tx,ty,s,dur){cam.style.setProperty('--cd',dur+'s');
  cam.style.transform=`translate(${tx}px,${ty}px) scale(${s})`;
  if(window.__sfx)__sfx.whoosh(dur,0.65)}            // 镜头必配呼啸
function camFocus(fx,fy,s,dur){                      // 对准 (fx,fy) 推到 s 倍
  let tx=960-fx*s,ty=540-fy*s;
  tx=Math.min(0,Math.max(1920-1920*s,tx));           // 收边：不出画
  ty=Math.min(0,Math.max(1080-1080*s,ty));camTo(tx,ty,s,dur)}
```

要点：

- `transform-origin:0 0` + 显式 translate，才能精确控制"看哪里、放大几倍"；缓动统一 `cubic-bezier(.16,1,.3,1)`（快速起步、柔软刹停，电影感）。
- 缩放范围 **1.0–1.35**，推近一般 1.12–1.3。超过 1.35 会穿帮（看到像素/糊边），除非风格允许（像素风反而加分）。
- 字幕条、角注、HUD、黑边放在 `#cam` **外面**——它们属于"放映层"，不随摄影机移动。

## 六种必用调度（每页至少用 2-3 种）

### 1. 开场拉镜（几乎每页都用）
CSS 初始 transform 设为特写位（如 `translate(0,-80px) scale(1.32)` 对准主视觉），开演 300ms 后 `camTo(0,0,1,1.8~2.2)` 拉开全景。观众第一眼是"凑近看的细节"，随后世界展开——比一上来就全屏静止画面高级一个档次。

### 2. 关键时刻推近
数字揭晓、印章砸下、对战爆发、结论定格：`camFocus(目标x,目标y,1.15~1.25,0.8~1.2)`。**推近 = 强调**，一页 2-4 次，多了就廉价。

### 3. 转场前拉回
场景切换、新面板入场前 `camTo(0,0,1,1.0~1.3)` 拉回全景，给新内容腾出视野，也 reset 观众的空间感。

### 4. 跟拍
镜头跟着主体走：流程图逐站点亮（`camFocus` 依次对准每个工位，1.28 倍紧跟）、时间线逐节点走镜、角色登峰跟跳。连续跟拍时长 0.8~1.0s/段，形成"巡视"的节奏。

### 5. Ken Burns 缓推
标题卡/情绪段：极慢推近，如 `camFocus(960,470,1.13,5.0)`——5 秒里几乎察觉不到地在放大，画面始终"活着"。

### 6. 冲击快推
爆发瞬间（BAM/VS 对撞/答案揭晓）：0.45~0.6s 内怼脸，配 thud，随后 1.2s 拉回。

## 高级：慢放段落（RACE CAM 模式）

演示"毫秒级过程"（并发请求、时序漏洞、微观机制）时的组合拳：

1. `#stage` 加 `.letter` —— 上下黑边条滑入（74px，0.9s），画面立刻变"电影";
2. 暗角 `#dim` 淡入聚光；
3. 标签胶囊出现：`● SLOW CAM · 慢放 ×0.02`；
4. 现实时间计数器 `T+0.0 ms` 滚动；
5. 镜头推近主体（或用 `#world` 变体：对世界容器 `transform-origin:中心点; .zoom{scale(1.26)}`）；
6. 段落结束：黑边收起、暗角退场、拉回全景、whoosh。

## 调度注释规范

每个 camTo/camFocus 写一行注释说明意图，便于质检和返工：

```js
on(300,()=>camTo(0,0,1,2.2));                        // 开场拉镜：XX特写 → 全景
on(4650,()=>camFocus(1700,250,1.16,0.8));            // 号外章盖下瞬间推向右上
on(12100,()=>camTo(0,0,1,1.3));                      // 收尾拉回
```
