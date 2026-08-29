# 角色反应与字幕同步（浓缩版）

## 角色阵容：双人喜剧（安安 × 橘雪莉）

- **安安**（`anan - emotion rename/`，15 情绪）：主吐槽役。左下角 390px、z-28；中段快闪与结尾定场都归她。
- **橘雪莉 shery**（`assets/shery - emotion rename/`，20 情绪）：**笨蛋吐槽役**。右下角 340px、z-27（略低于安安）；品牌配色锁定：气泡奶油底 `#fff6ec`/强调橘 `#e8722a`/字棕 `#4a2c1a`。**只在重点页登场（约 1/4 页面，高潮/漏洞/翻车页）**：安安结尾出场前 1.2s 先吐槽，安安随后接茬，同框至结尾一起退场。分工：雪莉惊叹犯傻（「是<b>闹鬼</b>了吧？！」），安安接茬点破（「凌晨两点…<b>谁在用它</b>?!」）。
- 素材复制（勿读内容）：`cp -r "assets/shery - emotion rename" <输出目录>/`；安安在 `assets/examples/<项目>/anan - emotion rename/`。

## 安安情绪速查（引用补全 `.png`）

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

## 雪莉情绪速查（`shery - emotion rename/`，引用补全 `.png`）

| 文件 | 情绪→节拍 | 文件 | 情绪→节拍 |
|---|---|---|---|
| `01_兴奋自信发现线索` | 发现线索兴奋 | `11_紧张语塞慌乱` | 被问住慌乱 |
| `02_胸有成竹讲解` | 装内行讲解 | `12_释然松口气微笑` | 虚惊一场 |
| `03_开怀大笑得意` | 得意大笑 | `13_疑惑好奇发呆` | 好奇发呆（默认款） |
| `04_从容自信微笑` | 自信微笑 | `14_兴高采烈大笑` | 高兴到失态 |
| `05_为难不情愿抱怨` | 嫌麻烦抱怨 | `15_震惊被吓到` | 被吓到 |
| `06_斗志昂扬加油` | 打鸡血 | `16_无奈摊手解释` | 摊手甩锅 |
| `07_愤怒不甘咬牙` | 气到咬牙 | `17_灵机一动想到主意` | 灵光一现 |
| `08_严肃认真质疑` | 假装严肃 | `18_惊恐万状阴影眼` | 惊恐万状 |
| `09_尴尬心虚冒汗` | 说漏嘴心虚 | `19_惊慌举手制止` | 慌忙制止 |
| `10_惊讶恍然大悟` | 恍然大悟 | `20_疑惑摊手询问` | 摊手反问 |

情绪必须匹配节拍，宁可不用也不错用；同镜最多换 1 次；雪莉选图偏"过火"（笨蛋属性要夸张），安安偏"克制"（接茬要冷静）。

## 出场率规范（不是只在结尾！）

- 每页 **≥2 次**：中段（30–45% DUR）**快闪** + 结尾（75–85% DUR）定场；短页(<10s) 仅结尾 1 次；超长页(>100s) 3 次分布前/中/后。
- 不遮挡内容：左右下角、允许出血；双人同框时两个气泡都**朝舞台中心**（安安立绘左侧→气泡在其右侧，雪莉立绘右侧→气泡在其左侧），其中一方气泡 `top` 可由 80px 降至 60px 防碰撞。

## 中段快闪（连续切立绘——最生动的手法，实测自 DSH shot-0-1）

复用**同一个** `#anan` 元素，每次出场都换台词+换情绪立绘；`remove('show')`→160ms→`add('show')` 的闪换让她像"重新探出头"，一页可连切 2–3 张：

```js
on(4500,()=>{$('#anan .say').innerHTML='没跑任务，也在<b>扣钱</b>？！';   // 换台词
  $('#anan img').src='anan - emotion rename/11_懵然半睁_茫然迟疑.png';   // 换立绘
  $('#anan').classList.remove('show');after(160,()=>{$('#anan').classList.add('show');__sfx.pop(.5)})});  // 闪换重弹
on(7700,()=>{$('#anan').classList.remove('show');                        // 再快闪一次，铺垫结尾
  $('#anan .say').innerHTML='凌晨两点…<br><b>谁在用它</b>?!';
  $('#anan img').src='anan - emotion rename/07_睁眸微张_愕然疑惑.png'});
on(10800,()=>$('#anan').classList.add('show'));                          // 结尾定场（用刚换入的立绘）
```

## 双人同框 cue 模式（重点页专用）

```js
on(9600 ,()=>{$('#shery').classList.add('show');__sfx.pop(.55)});        // 雪莉先吐槽
on(10800,()=>$('#anan').classList.add('show'));                          // +1.2s 安安接茬
on(13600,()=>{$('#anan').classList.remove('show');$('#shery').classList.remove('show')});  // 一起退场
```

HTML（双角色结构，气泡强约束见下）：

```html
<div id="anan"><div class="say">安安接茬台词，<b>关键词</b>高亮</div>
  <img src="anan - emotion rename/07_睁眸微张_愕然疑惑.png" alt="安安"></div>
<div id="shery"><div class="ssay">雪莉吐槽台词，<b>闹鬼</b>了吧？！</div>
  <img src="shery - emotion rename/13_疑惑好奇发呆.png" alt="橘雪莉"></div>
```

```css
#anan{position:absolute;left:-6px;bottom:-10px;width:390px;z-index:28;opacity:0;transition:opacity .9s ease}
#shery{position:absolute;right:24px;bottom:-8px;width:340px;z-index:27;opacity:0;transition:opacity .8s ease;
  filter:drop-shadow(0 14px 30px rgba(60,40,20,.35))}
#anan.show,#shery.show{opacity:1}
#anan img,#shery img{width:100%;display:block;animation:bob 3.2s ease-in-out infinite alternate}
```

### 吐槽气泡强约束（形态锁定，跨项目统一，双人皆适用）

**逐字采用**（基准：DSH 安全教程 shot-2-1），只允许改 4 个颜色参数与朝向镜像；不得加边框、不得改字号/圆角/偏移/箭头/入场曲线。下例为"立绘在右→气泡朝左"；立绘在左则 `left:-200px` 换 `right:-200px`、箭头 `right:24px` 换 `left:24px`：

```css
#mascot .say{position:absolute;left:-200px;top:80px;width:220px;background:<气泡底色>;border-radius:16px;padding:13px 17px;
  font-size:23px;font-weight:900;color:<文字色>;line-height:1.45;opacity:0;transform:scale(.6);transition:all .45s cubic-bezier(.34,1.6,.64,1);box-shadow:0 12px 34px <阴影色>}
#mascot .say::after{content:'';position:absolute;right:24px;bottom:-18px;border:9px solid transparent;border-top:11px solid <气泡底色>}
#mascot .say b{color:<强调色>}
#mascot.show .say{opacity:1;transform:scale(1);transition-delay:.45s}   /* 人先现，话后到 */
```

**4 个可调配色**：①气泡底色=箭头色（安安随页面材质；雪莉锁定 `#fff6ec`）；②文字色强对比（雪莉锁定 `#4a2c1a`）；③`<b>` 强调色须与底对比足够（雪莉锁定 `#e8722a`）；④阴影色=页面主题调 `rgba(…,.25)`。字体继承页面。台词一句以内、`<b>` 最多 1–2 处。登场配 `pop(.5~.6)`；吐槽是反应不是解释。无立绘素材时画纯 CSS 圆脸吉祥物，同规范。

## 字幕条与状态 HUD

- 字幕条：底部 96px 胶囊走廊（#cam 外），深底白字 23–25px/900；逐句 show/remove 对齐口播（间隔≥300ms），一页 2–5 条，`<b>` 高亮 1–2 处；cue 注释带口播时间戳。
- 状态 HUD（右上胶囊）：跨页数字从上页终值起滚（`cnt()` 1.4s + TnE 连击音）；落定 `.pump` 弹一下；重大加减分上方飘字 2.4s。
- 写 cue 前给每镜标 1–2 个**情绪锚点**，角色快闪、双人同框、红章、慢放、音效重音围绕锚点排布。
