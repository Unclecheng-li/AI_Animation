# 角色反应与字幕同步（浓缩版）

## 安安情绪速查表（素材在 `assets/examples/<项目>/anan - emotion rename/`，cp 到输出目录后引用）

| 文件 | 情绪→节拍 | 文件 | 情绪→节拍 |
|---|---|---|---|
| `01_淡漠凝睇_无口忧郁` | 冷场吐槽/无语 | `09_垂眸出神_淡然凝思` | 章法/沉思 |
| `02_抱书怀羊_恬静温柔` | 科普引入/过渡 | `10_闭目含笑_恬静满足` | 收尾回顾/安心 |
| `03_掩袖半垂_慵懒羞怯` | 害羞插话 | `11_懵然半睁_茫然迟疑` | 幻觉/假漏洞/问号 |
| `04_闭目莞尔_温柔娇羞` | 认可/点头 | `12_粉颊捧笺_娇羞雀跃` | 高光惊喜/求三连 |
| `05_阖眸轻语_雀跃腼腆` | 期待/小成功 | `13_掩袖低眸_羞怯暗思` | 小心思/攻击预兆 |
| `06_蹙眉闭唇_窘迫羞恼` | 被拒/被拦/烦闷 | `14_红腮含颦_腼腆欣喜` | 交卷/好成绩 |
| `07_睁眸微张_愕然疑惑` | 翻车/数字惊变 | `15_平举素纸_认真以待` | 严肃声明/规则 |
| `08_倦眼半阖_慵懒无力` | 被捆住/躺平 | | |

（引用时补全 `.png`。）情绪必须匹配节拍，宁可不用也不错用；同镜最多换 1 次。项目图标同理 cp：辑一 `icons/GLMicon.png`/`GPTicon.png`，辑二 `doubaoicon.png`/`doctor_ava.jpg`。

## 角色特写登场

```html
<div id="mascot"><!-- 底部角落 300–420px，允许出血；特写不是角标 -->
  <div class="say">吐槽台词，<b>关键词</b>高亮</div>
  <img src="anan - emotion rename/12_粉颊捧笺_娇羞雀跃.png">
</div>
```

```css
#mascot{position:absolute;left:-10px;bottom:-8px;width:400px;opacity:0;transition:opacity .9s ease}
#mascot.show{opacity:1}
#mascot img{width:100%;animation:bob 3.1s ease-in-out infinite alternate}
```

### 吐槽气泡强约束（形态锁定，跨项目统一）

**逐字采用以下模板**（基准：DSH 安全教程 shot-2-1），只允许改 4 个颜色参数与朝向镜像；不得加边框、不得改字号/圆角/偏移/箭头/入场曲线：

```css
/* 立绘在右 → 气泡朝左；立绘在左 → left/-200px 换 right/-200px、箭头 right:24px 换 left:24px，其余不变 */
#mascot .say{position:absolute;left:-200px;top:80px;width:220px;background:<气泡底色>;border-radius:16px;padding:13px 17px;
  font-size:23px;font-weight:900;color:<文字色>;line-height:1.45;opacity:0;transform:scale(.6);transition:all .45s cubic-bezier(.34,1.6,.64,1);box-shadow:0 12px 34px <阴影色>}
#mascot .say::after{content:'';position:absolute;right:24px;bottom:-18px;border:9px solid transparent;border-top:11px solid <气泡底色>}
#mascot .say b{color:<强调色>}
#mascot.show .say{opacity:1;transform:scale(1);transition-delay:.45s}   /* 人先现，话后到 */
```

**4 个可调配色**：①气泡底色=箭头色，跟随页面材质（纸页用纸色/暗页用深底）；②文字色与底强对比；③`<b>` 强调色须与底有足够对比（浅底禁浅金浅蓝→深红深蓝；深底用亮金亮红）；④阴影色=页面主题调 `rgba(…,.25)`。字体继承页面。台词一句以内、`<b>` 最多 1–2 处。

**使用规则**：每页 1–2 次、停留 4–8s 淡出；登场配 `pop(.6)`；吐槽是反应不是解释（「充 50 到账 100…双倍？!」）。无立绘时画纯 CSS 圆脸吉祥物，同位置同气泡规范。

## 字幕条与状态 HUD

- 字幕条：底部 96px 胶囊走廊（#cam 外），深底白字 23–25px/900；逐句 show/remove 对齐口播（间隔≥300ms），一页 2–5 条，`<b>` 高亮 1–2 处；cue 注释带口播时间戳。
- 状态 HUD（右上胶囊）：跨页数字从上页终值起滚（`cnt()` 1.4s + TnE 连击音）；落定 `.pump` 弹一下；重大加减分上方飘字 2.4s。
- 写 cue 前给每镜标 1–2 个**情绪锚点**（惊讶/笑点/严肃），角色、红章、慢放、音效重音围绕锚点排布。
