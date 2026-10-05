# 瑞士设计系统（Swiss Style 正本 · 唯一依据）

来源血统：lieflat 灰阶正本 × diagram-design 纸底 tokens × WIRE「编辑部红」（黑灰阶+一点荧光橙）——三者天然同族，本系统即"瑞士风 × WIRE"。

## Tokens（锁定，禁改）

```css
:root{
  --paper:#F0EFEB;   /* 页面底 = 纸灰（纸底 ≥90%） */
  --card:#FFFFFF;    /* 面板/卡片底 */
  --ink:#1C1C1A;     /* 墨：标题/主数据 */
  --muted:#8F8E88;   /* 次级文字 */
  --faint:#C6C5BF;   /* 来源行/辅助刻度 */
  --grid:#DEDDD6;    /* 网格线/发丝线 */
  --accent:#F5572F;  /* 唯一强调橙（每页只给一个主角） */
  --dark:#1C1C1A;    /* 墨底反白卡（终端/焦点/结论） */
  --darkink:#F0EFEB; --darkgrid:#2E2D29;
}
/* 灰阶阶梯（明度即数据，重要=最黑）：
   L1 #1C1C1A / L2 #4A4944 / L3 #6A6963 / L4 #8F8E88 / L5 #B0AFA9 / L6 #C6C5BF / L7 #D8D7D1 */
```

**禁用清单**：glow/霓虹 text-shadow、径向光斑、光泽渐变、vignette、扫描线、胶片颗粒、3D 高光、大模糊阴影、弹跳闪烁发光脉冲动画。
**允许清单**：平面色块、1-2px 发丝线、虚线、反白（墨底纸字）、细网格 `rgba(28,28,26,.06~.1)`。
**强调纪律**：橙 #F5572F 每页 ≤3 处且只标一个主角（最大数字/结论/焦点节点/警示）；"通过/成功"用**墨底反白卡 + ✓**，不用绿色。

## 字体三件套（全系列统一，不再轮换）

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

- **Inter**：西文/数字——标题 700-900 / 正文 400-500 / 断言数值 800 / 轴标签 600 uppercase tracking .06-.1em；
- **Noto Sans SC**：中文——标题 900 / 正文 400-500 / 强调 700；
- **IBM Plex Mono**：终端/代码/哈希/路径（400-600）。
- 大字排版：主标题 64-120px、断言数字 120-260px·800-900、eyebrow 13-16px uppercase；来源行 Inter 500·12-15px·letter-spacing .08em。

## 版式（1920×1080）

- 页边距 88px；12 列网格（列宽 132px/槽 32px）；允许非对称（左重右轻）。
- **结构三件套**：① eyebrow（编号块+章节 uppercase）② 大标题 ③ 主体图形区（≥55% 面积）；底部可选结论条（1px 顶线 + 一句话）。
- 发丝分隔线 1px `--grid`；编号块（01/02/03）墨底反白或橙块；排名顺序用大号 Inter 800 数字。
- 白卡：1px 发丝边框、圆角 ≤12px、**无阴影**。

## 组件库（模板已预装，直接取用）

`.eyebrow`（+.no 墨底编号块）｜`.h1/.h2` 大标题｜`.bignum` 断言数字（tabular-nums）｜`.hair` 发丝线｜`.card` 白卡｜`.dark` 墨底反白卡（+.dim 灰字）｜`.acc-bar` 5px 橙规则条｜`.tag-acc` 橙标签块｜`.node`+`.node-num` 流程节点｜`.key` 键帽｜`.trow/.thead` 灰阶表格｜`.fx-pop/.fx-fade/.fx-draw` 入场三式。

## 动画性格

- 缓动 quarticOut/cubicOut「快进快停」；时长 350-700ms；列表 stagger 100-180ms；
- 入场三式：**pop**（缩放/上浮）**fade**（淡入）**draw**（SVG 描线 stroke-dashoffset）；
- 节拍动画（打字机/计数/描线/升起）一律 cue+tws（可暂停可冻结）；纯装饰（光标闪烁/漂浮）才用 CSS animation；
- 镜头调度沿用 camTo/camFocus + **camCut 硬切**（幕切换配 swipe/thud）；推近幅度收敛 ≤1.15 保住网格版式。

## 角色与标注

- 大肥鱼 GIF（每页 1-2 次，放留白区）：**纸底气泡**=白底+1px 墨边+黑字，关键词 `<b>` 橙色；入场 fx-pop；
- 角注 `#chap`/`#src` 灰小字 uppercase；拟真/示意页保留「示意图 · 非实拍」角注（墨底反白小胶囊）；
- 数字白名单纪律：只出现素材给过的数字，不编造；同一数据全系列一致。
