# 背景层大字幕（口播文案的舞台化）

用户迭代出的关键设计：**口播字幕不放底部字幕条**，而是作为舞台的一部分放在背景层——手机图层（z-index:8）下方（z-index:5）的左右两侧。观众视线在"两侧大字 → 手机屏幕"之间流动，画面饱满且有冲击力。

## 底盘结构

```css
.bgtW{position:absolute;top:50%;height:0;width:620px;z-index:5}   /* 定位走廊 */
.bgtW.L{left:80px}   .bgtW.R{right:80px;text-align:right}
.bgt-t{font-size:58px;font-weight:800;line-height:1.55;           /* 渐变文字 */
  background:linear-gradient(118deg,#f5f7ff 22%,#a5b4fc 58%,#67e8f9 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent}
```

- 左右各一组，一组 2–3 行，每行 ≤10 字；`<b>` 用更亮的渐变（白→天蓝）高亮关键词；
- **字号要大**（58px 起步，重要镜头可上探 72px），字距 2px，行高 1.55；
- 每镜 2 组：第一组随开场出现，中段切第二组（`.show` 移除/添加，成对不重叠）；
- 手机 3D 幅度收敛（见 phone-stage.md），保证大字永不被手机压住。

## 11 种入场效果库（每镜轮换，禁止连续两镜同款）

| 效果类 | 手法 | 适合 |
|---|---|---|
| `fx-rise` | 上浮 + 模糊聚焦 + 常驻**流光扫过**（background-position 循环）| 开场主命题 |
| `fx-wave` | **逐字波浪**：拆字 span 后 stagger 48ms，46px 上浮 + 5° 旋转归位 | 强调节奏的短句 |
| `fx-slam` | scale 1.42 + blur 9px → 弹性砸落（cubic-bezier(.2,1.45,.34,1)）| 冲击性结论 |
| `fx-flip` | 3D 翻转入场 | 观点反转 |
| `fx-zoom` | 由超大缩放推进到正常（纵深推字）| 纵深叙事 |
| `fx-lines` | 逐行依次展开 | 分条陈述 |
| `fx-drift` | 横向漂移 + 淡入 | 平缓过渡段 |
| `fx-slide` | 整体侧滑入场 | 承接上镜方向 |
| `fx-pop` | 弹性弹出（过冲回弹）| 轻快亮点 |
| `fx-glow` | 光晕呼吸渐显 | 情绪/品牌句 |
| `fx-blur` | 大模糊缓缓聚焦 | "看清一件事"的隐喻 |

实现模式统一：初始态写在类上（位移/缩放/模糊），`.show` 归位——全部走 transform/filter/opacity，60fps。

## 逐字拆字工具（fx-wave 等逐字效果用）

```js
function splitChars(el){ /* 递归遍历文本节点，每个字包 span.ch，保留 <br>/<b> 结构 */ }
function stagger(chs,step){chs.forEach((c,i)=>c.style.transitionDelay=(i*step)+'ms')}
stagger(splitChars($('#bg2')),48);   // 页面加载时预备，cue 里只切 .show
```

注意：逐字效果每个字的渐变要**逐字自裁剪**（span 上独立 background-clip:text），兼容无头渲染。

## 文案纪律

- 一组大字 = 一句口播的浓缩，不是原文照搬；关键词加粗高亮 ≤2 处；
- 大字与屏幕内容**互补不重复**：屏幕演"事实"，大字说"意义"；
- cue 注释标节拍：`on(1200,()=>$('#bg1').classList.add('show'));  // 背景大字①：流光上浮`。
