# Retrospective · 19 招 Claude Code Tips · HyperFrames 工程档案

> 项目根：`2026-05-04/claude-19-tips-hf/`
> 整片：21 段 clip × 453 秒（≈ 7:33） · 30 commits / 27.7 小时 / 跨 2 天
> 权威参照系：`docs/OFFICIAL_DOCS_VALUE_INDEX.md`

---

## 文件目录

| 文件 | 内容 | 主表数 |
|---|---|---|
| [`00-overview.md`](./00-overview.md) | 仓库结构 / 21 段 clip 清单 / commit 节奏 / 知识基线 | 6 |
| [`01-components.md`](./01-components.md) | 数据属性 / GSAP / 视觉布局三类模式 + Catalog 对照 + 伪重复 7 对 | 12 |
| [`02-pitfalls.md`](./02-pitfalls.md) | 19 张坑卡（教训 7 / 提了不够清楚 5 / 完全没提 7） | 19 |
| [`03-skills.md`](./03-skills.md) | HF 知识层自评矩阵 + 协作开窍点 12 + 未用能力 24 | 5 |
| `README.md` | 四向交叉索引（本文件） | 4 |

---

## 索引 1 · 按 Composition

> 每章 → 组件 / 坑 / 依赖文档页
> 链接：组件 → `01-components.md` 节号 / 坑 → `02-pitfalls.md` Pn / 文档 → `OFFICIAL_DOCS_VALUE_INDEX.md` 行号

通用基底（21/21 章节都用，下表不重复列）：
- root 模板 ([§A.2](./01-components.md#a2-sub-composition-root-模板-compositionsnn-html))
- window.__timelines 注册 ([§B.1](./01-components.md#b1-时间线注册三件套))
- 全程层 perspective-grid + crosshair + vignette ([§B.4](./01-components.md#b4-全程呼吸层vignette--crosshair))
- kicker 章号（除 hook） + chrome-text 大字（除 hook 用 chrome-text-hot 变体）
- particles drift（每章末尾，19/21）

| # | 文件 | 章节专属组件 | 踩到的坑（commit） | 依赖的官方文档页 |
|---|---|---|---|---|
| 0 | `00-hook.html` | wavy-distort-hook (SVG filter), scatter words, hook-chip 飞入, chrome-text-hot 极致 zoom, 圆环 collapse | P13 chrome-text + char stagger 互斥（96a0ecd V8/V9 → V10）· P18 SVG filter 命名空间链（96a0ecd） | gsap-animation ⭐⭐ · prompting ⭐⭐⭐（未读）· data-attributes ⭐⭐⭐（未用相对时序） |
| 1 | `01-statusline.html` ⭐ 样片 | cc-window **首发** (12 章复用)、cc-statusline 5 段式、char-by-char typing, agent-call dot, sl-rate 进度 | P2 V3 视觉/口播错位（a4c5843）· P8 spoiler（f2f0de1 teaser 推后）· P11 translate(-50%) 居中失效（f36f96e）· P7 polaroid 字号（f2f0de1，跨 Tip 2 修） | prompting ⭐⭐⭐ · video-editor-cheatsheet ⭐⭐⭐ · gsap-animation ⭐⭐ · cli ⭐⭐⭐（inspect） |
| 2 | `02-commit.html` | polaroid stack 3 卡 + cross-fade to terminal、polaroid-term-cmd | P7 polaroid 命令行字号溢出（f2f0de1） | cli ⭐⭐⭐（inspect 应该跑） |
| 3 | `03-clear.html` | cc-window、ctx-meter（首发）、token chips 12 个 explode、ctx 0→78%→0 ramp | — | gsap-animation ⭐⭐ |
| 4 | `04-plan-mode.html` | cc-window、mode-toggle-bar **首发**、keycap (Shift+Tab)、plan-panel 5 步、approval-chip | — | gsap-animation ⭐⭐ |
| 5 | `05-specific-requests.html` | compare-card BAD/GOOD（首发，但 theme.css `.compare-grid` 0 用）、quality meter、mode-toggle-bar callback Tip 4 | — | — |
| 6 | `06-ask-questions.html` | cc-window、mode-toggle-bar callback Tip 4、claude-bubble + user-bubble（首发对话气泡）、questions-panel、95% pct hold | — | data-attributes ⭐⭐⭐（未用相对时序） |
| 7 | `07-plan-reviewer.html` | plan-panel（callback Tip 4）、role-badge swap、light-streak whip、gold-sweep、audit-warn/audit-fail | — | — |
| 8 | `08-self-check.html` | cc-window、todo-panel 4 态、cursor-glyph SVG、todo-spinner、gold-sweep（共享 Tip 4+7+8）、verdict-chip | — | — |
| 9 | `09-claude-md.html` (44.4s 最长之一) | cc-window、IDE 文件树（双幕）、whip-pan **chapter 内首用**、claude-bubble + user-bubble、CLAUDE.md 文档卡、骨架树 IDE 风格卡 | — | catalog/whip-pan ⭐⭐⭐（chapter 内用过，章间未用） |
| 10 | `10-esc-stop.html` ⭐ 样片 (重写) | esc-keycap、impact-ripple、white-flash、screen shake、stopped-badge、token-counter、cc-window 碎裂 | **P10 GSAP transform 接管**（cc599ad）· **P15 撞击同帧合成**（cc599ad，自创 7 cue 28 tween） | gsap-animation ⭐⭐（transform 接管未在索引摘录） |
| 11 | `11-double-esc.html` | cc-window、ESC keycap × 2 节奏 0.45s、whip-streak、node-list、ghost discard banner、ripple | **P9 immediateRender:false**（a021199） | common-mistakes ⭐⭐ |
| 12 | `12-hooks.html` | cc-window、/hooks 菜单、🚶 Focus walking chip、banner 居中通知 720px、sound wave 扩散 | — | catalog/macos-notification ⭐（自制 banner，未替换） |
| 13 | `13-screenshots.html` | error-card 红框、inspo-card 4 彩条、shrink to terminal 📎 chip、compare-card 精确 vs 模糊 | — | — |
| 14 | `14-worktree.html` (43.1s) | **scene-stage 1920×6480 6 scene camera pan 首发**、agent-logo claude/codex、wavy-distort-14 prototype、6 次 config.ts 反复覆盖 | **P14 推全→撤销链**（9cf40e3→2c5a82b→2d69585，wavy 起源）· **P18 SVG filter 命名空间链** | gsap-animation ⭐⭐ |
| 15 | `15-api-vs-mcp.html` | source-card 双栏（替代 compare-grid）、tool-list with active/dim、ctx-meter 双（callback Tip 3）、stamp 旋转盖上 | — | — |
| 16 | `16-remote-control.html` | cc-window、qr-frame 13×13 + 扫描线、cb-logo（emoji→pixel logo 替换）、三端环绕 SVG dashoffset 流动 | claude-code-logo 替换 🤖 emoji（e870d49，与 memory 对齐） | — |
| 17 | `17-thinking-budget.html` | pain-card 双（plan-fail / bug-loop）、term-wrap (cc-window)、ult-keyword + ult-flash、budget-meter 0→100%、claude logo 呼吸 | — | — |
| 18 | `18-agent-teams.html` (35.7s 最长) | **scene-stage 6 scene camera pan**（同 Tip 14 模板）、advisor + 3 worker、lateral link/chip、sub-parent vs team 双卡对比 | **P16 内容真实性**：Codex 不在 Agent Teams（6f81556 联网双源验证去 Codex） | — |
| 19 | `19-skill-creator.html` | skill-file-card SKILL.md 暗色文件、之前讲过封面（+11:24 label）、三栏流程「事情→方式→自动」、skill-orb 220px、done-chip 4 绿 ✓ | — | — |
| 20 | `20-outro.html` (placeholder) | stage-stack、kicker 改 OUTRO、hero-title placeholder · 待实现 | **P5 outro 25s placeholder（commits=1）** | catalog/logo-outro ⭐⭐（应替换） |

**衍生提示**：
- 单章踩坑最密集：Tip 1（P2 + P8 + P11 + P7 跨章）+ Tip 10（P10 + P15）+ Hook（P13 + P18）
- 全片级影响（不挂任何单章）：P1 / P3 / P4 / P6 / P12 / P14 / P17

---

## 索引 2 · 按组件

> 组件 → 用在哪些章 / Catalog 替代 / 难度

| 组件 | 详细位置 | 用在 chapter | Catalog 替代？ | 抽取难度 |
|---|---|---|---|---|
| theme.css design token 全套 | [§C.1](./01-components.md#c1-design-tokenassetsthemecss1-49) | 21/21 | 无对应 | ⭐ 直接抽 |
| Sub-composition root 模板 | [§A.2](./01-components.md#a2-sub-composition-root-模板-compositionsnn-html) | 21/21 | N/A（骨架） | ⭐ 直接抽 |
| window.__timelines 注册三件套 | [§B.1](./01-components.md#b1-时间线注册三件套) | 21/21 | N/A | ⭐ 直接抽（已在 skill 内置） |
| 章号 kicker | [§C.2](./01-components.md#c2-章号-kicker2021-文件仅-hook-不用) | 20/21（除 hook） | 无 | ⭐ 直接抽 |
| chrome-text 大字 + sweep | [§B.3](./01-components.md#b3-chrome-text-sweephero-大字光泽扫) [§C.3](./01-components.md#c3-hero-大字2021) | 20/21（除 outro） | `components/shimmer-sweep` ⭐⭐ 概念重叠但不替代（中文 hero 适配差异） | ⭐ 直接抽 |
| Vignette + crosshair + grain 全程层 | [§B.4](./01-components.md#b4-全程呼吸层vignette--crosshair) | 20/21（除 outro） | `components/grain-overlay` ⭐⭐（已实质替代为自制版） | ⭐ 直接抽 |
| Particles drift | [§B.5](./01-components.md#b5-particles-drift) | 19/21 | 无 | ⭐ 直接抽 |
| Blur enter/exit 模板 | [§B.2](./01-components.md#b2-blur-enter--exit-模板项目主导动效语言) | 21/21 | 无（项目主导动效语言） | ⭐⭐ 需小改（写 helper） |
| **cc-window 完整体系** | [§C.4](./01-components.md#c4-claude-code-终端-uicc-window-体系) | **12/21**（Tip 1, 3, 4, 6, 8, 9, 10, 11, 12, 13, 16, 17 + Tip 17 用 term-wrap 别名） | **无 catalog 对应** → 项目独有，可贡献候选（[02-pitfalls P19](./02-pitfalls.md#p19--项目自创视觉范式不在任何官方文档cc-window-完整体系)） | ⭐⭐ 需小改 |
| Mode toggle bar (plan mode 视觉 + 历史 callback) | [§C.5](./01-components.md#c5-mode-toggle-barplan-mode-视觉) | 3/21（Tip 4, 6, 7） | 无 | ⭐⭐ 需小改 |
| 对话气泡（claude-bubble / user-bubble） | [§C.6](./01-components.md#c6-对话气泡claude-bubble--user-bubble) | 3/21（Tip 6, 9, 11） | 无 | ⭐ 直接抽 |
| 对比双卡 compare-card | [§C.7](./01-components.md#c7-对比双卡compare-card) | 1/21（仅 13） + 多章自制变体 | 无 | ⭐⭐ 需小改（先把 dead `.compare-grid` 接入） |
| Camera pan 多 scene stage | [§B.6](./01-components.md#b6-camera-pan多场景滚动舞台) | 2/21（Tip 14, 18） | 无 | ⭐⭐⭐ 不建议直接抽（每 scene 内部独立） |
| Char-by-char hero 砸入 | [§B.7](./01-components.md#b7-chrome-text-小工具char-by-char-砸入) | 仅 hook | 无 | ⭐⭐ 概念可抽，但与 chrome-text 互斥（[P13](./02-pitfalls.md#p13--chrome-text--字符-span-包装inline-block-创建-stacking-context-让-background-cliptext-失效)） |
| 全片转场（chapter 间） | — | **0/21** | catalog 三件套 ⭐⭐⭐（[P4](./02-pitfalls.md#p4--全片无-chapter-间转场21-段直接相邻)） | ⭐ 直接抽 |
| outro | [§C.8](./01-components.md#c8-章节末-outro项目骨架级-dead-code) | 1/21（placeholder） | `catalog/blocks/logo-outro` ⭐⭐（[P5](./02-pitfalls.md#p5--20-outrohtml-placeholder-25-秒整片唯一-v1-都没做)） | 极低 |
| theme.css dead code 5 类 | [§C.7](./01-components.md#c7-对比双卡compare-card) | 0/21 | — | 删 |
| 8 catalog snippet 脚手架带入 | [§C.9](./01-components.md#c9-catalog-已带入但项目未用dead-code) | 0/21 | — | 删（除 logo-outro 应该接入） |

---

## 索引 3 · 按坑

> 坑 → 出现章节 / 官方覆盖状态 / 是否解决

详细卡片在 [`02-pitfalls.md`](./02-pitfalls.md)。

| Pn | 坑 | 出现章节 | 状态 | 是否解决 |
|---|---|---|---|---|
| [P1](./02-pitfalls.md#p1--全项目-0-处相对时序改-srt-时长须手算下游-21-段) | 全片 0 处相对时序 | index.html 全片级 | 🔴 教训（concepts/data-attributes ⭐⭐⭐） | **未解决**（项目结束仍是绝对秒数） |
| [P2](./02-pitfalls.md#p2--tip-1-v3先想视觉再塞口播节奏完全错位) | Tip 1 V3 视觉/口播错位 | Tip 1（a4c5843 V4 修） | 🔴 部分覆盖（prompting ⭐⭐⭐ Caption Tone） | ✅ V4 后纠正 |
| [P3](./02-pitfalls.md#p3--8-catalog-snippet-脚手架带入全片-0-引用dead-code) | 8 catalog snippet 0 引用 | 全项目（脚手架 51e4ebf） | 🟡 quickstart `--example blank` 提到但不够清楚 | **未解决**（dead code 残留） |
| [P4](./02-pitfalls.md#p4--全片无-chapter-间转场21-段直接相邻) | 全片无 chapter 间转场 | index.html 21 段头尾相接 | 🔴 catalog 三件套 ⭐⭐⭐ 已读未用 | **未解决** |
| [P5](./02-pitfalls.md#p5--20-outrohtml-placeholder-25-秒整片唯一-v1-都没做) | outro 25s placeholder | Tip 20 仅脚手架 commit | 🔴 catalog/logo-outro ⭐⭐ | **未解决** |
| [P6](./02-pitfalls.md#p6--媒体素材囤而未接入) | 8 SFX + statusbar.mp4 全片 0 引用 | assets/audio + assets/video | 🔴 cli/tts ⭐⭐⭐ | **未解决** |
| [P7](./02-pitfalls.md#p7--文字溢出未在渲染前用-inspect-扫) | polaroid 命令行字号溢出 | Tip 2（f2f0de1 跨 Tip 1 修） | 🔴 cli/inspect ⭐⭐⭐（npm run check 含但实际 finding 是否消费待确认） | ✅ 已修字号 |
| [P8](./02-pitfalls.md#p8--视觉-teaser-不能-spoiler-下一句) | 视觉 teaser 不能 spoiler | Tip 1（f2f0de1） | 🟡 prompting Caption Tone 未涉叙事节奏 | ✅ 项目内 + memory 已记 |
| [P9](./02-pitfalls.md#p9--tlfromto-0-秒处的预渲染会让元素第一帧就显示) | `tl.fromTo` 0 秒预渲染 | Tip 11 ripple（a021199） | 🟡 common-mistakes ⭐⭐ 索引未明确摘录 | ✅ 用 immediateRender:false |
| [P10](./02-pitfalls.md#p10--css-transform-translate-50-50-居中遇到-gsap-操作-xyscale-时失效) | GSAP transform 接管 | Tip 10 esc-stop（cc599ad） | 🟡 gsap-animation ⭐⭐ 索引未涉 | ✅ 用 xPercent/yPercent |
| [P11](./02-pitfalls.md#p11--top50--translate-50-50-居中高度难预估时偏-5) | absolute + translate 居中失效 | Tip 1 V5（f36f96e） | 🟢 通用 CSS（不属 HF 文档） | ✅ 改 flexbox inset:0 |
| [P12](./02-pitfalls.md#p12----quality-draft-与-standard-视觉差异未在工作流标准化) | 渲染参数未标准化 | package.json 无 quality 区分 | 🟡 rendering ⭐⭐⭐ | **未触发**（项目周期未渲最终 mp4） |
| [P13](./02-pitfalls.md#p13--chrome-text--字符-span-包装inline-block-创建-stacking-context-让-background-cliptext-失效) | chrome-text + char span 互斥 | Hook V8/V9 → V10（96a0ecd） | 🟢 通用 CSS + 中文 hero 项目独需 | ✅ V10 删 char span |
| [P14](./02-pitfalls.md#p14--视觉风格推全--撤销链4-分钟内连发-9cf40e3--2c5a82b--2d69585) | 推全 → 撤销链 | wavy 全片级（9cf40e3 → 2c5a82b → 2d69585） | 🟢 工程方法论无文档 | ✅ 改 sample-first |
| [P15](./02-pitfalls.md#p15--gsap-多元素同帧合成撞击三件套没文档) | 撞击同帧合成（撞击三件套） | Tip 10（cc599ad） | 🟢 GSAP 文档无 | ✅ 项目内 7 cue 28 tween 模板（可贡献） |
| [P16](./02-pitfalls.md#p16--内容真实性codex-不在-claude-agent-teams-内事实错误差点上线) | 内容真实性（Codex 不在 Agent Teams） | Tip 18（6f81556 联网修） | 🟢 不属 HF 文档 | ✅ 已修 |
| [P17](./02-pitfalls.md#p17--themecss-5-个类定义但-0-文件引用dead-code-累积) | theme.css 5 类 dead code | 全项目（compare-grid / mac-terminal / token-stream / token-line / compare-label） | 🟢 cli/lint 不查 dead CSS | **未解决** |
| [P18](./02-pitfalls.md#p18--tip-14-wavy-filter-prototype-命名空间推全单点回退与-p14-同源) | SVG filter 命名空间链 | hook + Tip 1 + Tip 14（4 个独立 filter id 共存） | 🟢 工程方法论 | ✅ 改 chapter 局部命名 |
| [P19](./02-pitfalls.md#p19--项目自创视觉范式不在任何官方文档cc-window-完整体系) | cc-window 完整体系无 catalog | 12/21 章节 | 🟢 catalog 缺失 | N/A（这是机会，可贡献） |

**汇总**：
- 已解决：12 / 19（P2 / P7 / P8 / P9 / P10 / P11 / P13 / P14 / P15 / P16 / P18 / P19 vs N/A）
- 未解决：7 / 19（P1 / P3 / P4 / P5 / P6 / P12 / P17）—— 全是"全项目级"或"工作流级"未触发
- 状态分布：🔴 教训 7 / 🟡 提了不够清楚 5 / 🟢 完全没提 7

---

## 索引 4 · 按官方文档页（反向）

> 直接从 `OFFICIAL_DOCS_VALUE_INDEX.md` ⭐⭐⭐ + ⭐⭐ 共 21 页反向到本项目

每行：官方页（评级 / 索引行号）→ 项目里关联的组件 / 坑 / 章节。

### ⭐⭐⭐ 必读（10 页）

| 官方页 | 索引行 | 项目关联组件 | 项目关联坑 | 项目档位（[03-skills.md](./03-skills.md)） |
|---|---|---|---|---|
| `guides/prompting.md` | 14 | — | [P2](./02-pitfalls.md#p2--tip-1-v3先想视觉再塞口播节奏完全错位) Tip 1 V3 错位 · [P8](./02-pitfalls.md#p8--视觉-teaser-不能-spoiler-下一句) spoiler 准则 | **未触及**（[§1.3](./03-skills.md#13-guides指南层) 一线杠杆） |
| `guides/rendering.md` | 15 | — | [P12](./02-pitfalls.md#p12----quality-draft-与-standard-视觉差异未在工作流标准化) 渲染参数未标准化 | **基础**（无 final mp4） |
| `guides/video-editor-cheatsheet.md` | 16 | Blur enter/exit (项目主导动效) [§B.2](./01-components.md#b2-blur-enter--exit-模板项目主导动效语言) | — | **未触及**（手动 DOM→Agent 清理循环 0 用） |
| `guides/hyperframes-vs-remotion.md` | 17 | 整套 GSAP 选型（21/21 用 GSAP） | — | **未触及**（哲学未消化） |
| `concepts/data-attributes.md` | 18 | 数据属性模式 [§A](./01-components.md#a--数据属性模式) | **[P1](./02-pitfalls.md#p1--全项目-0-处相对时序改-srt-时长须手算下游-21-段) 全片 0 相对时序**（最大教训）| **基础（缺一半）** |
| `reference/html-schema.md` | 19 | clip 模板 [§A.1](./01-components.md#a1-主时间线-clip-模板indexhtml) + Sub-comp root [§A.2](./01-components.md#a2-sub-composition-root-模板-compositionsnn-html) | P1 同源（相对时序）· data-variable-values 未用 | **基础** |
| `packages/cli.md` | 20 | npm run check 调用 lint/validate/inspect | [P6](./02-pitfalls.md#p6--媒体素材囤而未接入) tts/transcribe 0 用 · [P7](./02-pitfalls.md#p7--文字溢出未在渲染前用-inspect-扫) inspect finding 是否消费待确认 | **基础** |
| `catalog/blocks/whip-pan.md` | 21 | 自制 `theme.css .whip-streak` (Tip 11) + Tip 9 chapter 内用过 | [P4](./02-pitfalls.md#p4--全片无-chapter-间转场21-段直接相邻) chapter 间未用 | **入门** |
| `catalog/blocks/flash-through-white.md` | 22 | 脚手架带入 0 引用 | [P3](./02-pitfalls.md#p3--8-catalog-snippet-脚手架带入全片-0-引用dead-code) + [P4](./02-pitfalls.md#p4--全片无-chapter-间转场21-段直接相邻) | **入门** |
| `catalog/blocks/cinematic-zoom.md` | 23 | 脚手架带入 0 引用 | [P3](./02-pitfalls.md#p3--8-catalog-snippet-脚手架带入全片-0-引用dead-code) + [P4](./02-pitfalls.md#p4--全片无-chapter-间转场21-段直接相邻) | **入门** |

### ⭐⭐ 值得读（11 页）

| 官方页 | 索引行 | 项目关联组件 | 项目关联坑 | 项目档位 |
|---|---|---|---|---|
| `guides/gsap-animation.md` | 29 | window.__timelines 注册三件套 [§B.1](./01-components.md#b1-时间线注册三件套) · ease 4 件套 + stagger random · pad pattern [§B.1](./01-components.md#b1-时间线注册三件套) | [P10](./02-pitfalls.md#p10--css-transform-translate-50-50-居中遇到-gsap-操作-xyscale-时失效) transform 接管 · [P15](./02-pitfalls.md#p15--gsap-多元素同帧合成撞击三件套没文档) 同帧合成（项目自创） | **熟练** |
| `guides/common-mistakes.md` | 30 | — | [P9](./02-pitfalls.md#p9--tlfromto-0-秒处的预渲染会让元素第一帧就显示) immediateRender · [P7](./02-pitfalls.md#p7--文字溢出未在渲染前用-inspect-扫) 文字溢出 · [P13](./02-pitfalls.md#p13--chrome-text--字符-span-包装inline-block-创建-stacking-context-让-background-cliptext-失效) chrome-text inline-block | **基础**（事后撞墙学到） |
| `guides/performance.md` | 31 | 21/21 用 blur 14px 多次叠 | 项目内 backdrop-filter 上限规则未量化 | **基础** |
| `guides/timeline-editing.md` | 32 | 21/21 单 row（track-index="1"） | — | **基础** |
| `concepts/compositions.md` | 33 | index.html → 21 chapter 单层引用 | data-variable-values 0 用 · 0 嵌套 sub-comp | **入门** |
| `getting-started/quickstart.md` | 34 | 脚手架 commit 51e4ebf | [P3](./02-pitfalls.md#p3--8-catalog-snippet-脚手架带入全片-0-引用dead-code) `--example blank` 未用 | **基础** |
| `packages/producer.md` | 35 | — | [P6](./02-pitfalls.md#p6--媒体素材囤而未接入) WebM alpha / 外部资产 auto-copy 0 用 | **未触及** |
| `catalog/blocks/logo-outro.md` | 36 | 脚手架带入 0 引用 | [P5](./02-pitfalls.md#p5--20-outrohtml-placeholder-25-秒整片唯一-v1-都没做) outro placeholder 应替换 | **入门** |
| `catalog/blocks/ui-3d-reveal.md` | 37 | — | — | **未触及** |
| `catalog/components/grain-overlay.md` | 38 | 自制 `.global-grain` (theme.css:178-187) [§B.4](./01-components.md#b4-全程呼吸层vignette--crosshair) | — | **基础**（实质替代） |
| `catalog/components/shimmer-sweep.md` | 39 | 自制 `.chrome-text` 整字渐变（不同实现）[§B.3](./01-components.md#b3-chrome-text-sweephero-大字光泽扫) | — | **基础**（不替代——中文 hero 适配差异） |

---

## 五大动作清单（按"动手成本 / 价值"）

> 综合 4 个维度交叉看，下次开新项目（或本项目交付后）的优先动作

| 优先级 | 动作 | 来源 | 一句话理由 |
|---|---|---|---|
| 🔥 P0 | `npx hyperframes add logo-outro` 替换 outro placeholder | [P5](./02-pitfalls.md#p5--20-outrohtml-placeholder-25-秒整片唯一-v1-都没做) | 25s/453s = 5.5% 整片时长，1 行命令交付 |
| 🔥 P0 | `index.html` 改相对时序 `data-start="prev + 0"` × 21 段 | [P1](./02-pitfalls.md#p1--全项目-0-处相对时序改-srt-时长须手算下游-21-段) + [03-skills §4.1](./03-skills.md#41-一线杠杆-) | 任何 SRT 重切自动跟随，30 分钟改完 |
| 🔥 P0 | `index.html` 章节间插 `whip-pan` / `flash-through-white` clip | [P4](./02-pitfalls.md#p4--全片无-chapter-间转场21-段直接相邻) | 项目级视觉提质，catalog 现成 |
| 🟧 P1 | 删 `compositions/` 下 8 个 catalog snippet（除 logo-outro）+ theme.css 5 类 dead code | [P3](./02-pitfalls.md#p3--8-catalog-snippet-脚手架带入全片-0-引用dead-code) + [P17](./02-pitfalls.md#p17--themecss-5-个类定义但-0-文件引用dead-code-累积) | 减 ~2300 行 dead code，工程整洁 |
| 🟧 P1 | 跑 `npx hyperframes inspect` 看渲染前 finding 列表 | [P7](./02-pitfalls.md#p7--文字溢出未在渲染前用-inspect-扫) | npm run check 已含，看输出即可 |
| 🟧 P1 | `package.json` 加 `render:draft` 和 `render:final` script | [P12](./02-pitfalls.md#p12----quality-draft-与-standard-视觉差异未在工作流标准化) | 5 行 JSON，一次受益 |
| 🟨 P2 | cc-window 抽成 sub-comp + `data-variable-values` 传参 | [§C.4](./01-components.md#c4-claude-code-终端-uicc-window-体系) + [03-skills §4.2](./03-skills.md#42-二线杠杆-) | 12 个 chapter 复用骨架，未来改样式只改 1 处 |
| 🟨 P2 | 沉淀 cc-window 体系到 catalog（[P19](./02-pitfalls.md#p19--项目自创视觉范式不在任何官方文档cc-window-完整体系) 贡献候选 #3） | 同上 | 12 章 复用，外部也能用，可上 catalog |
| 🟨 P2 | 沉淀 P10 / P13 / P15 三个 🟢 教训到 `MOTION_PHILOSOPHY.md` | [P10](./02-pitfalls.md#p10--css-transform-translate-50-50-居中遇到-gsap-操作-xyscale-时失效) [P13](./02-pitfalls.md#p13--chrome-text--字符-span-包装inline-block-创建-stacking-context-让-background-cliptext-失效) [P15](./02-pitfalls.md#p15--gsap-多元素同帧合成撞击三件套没文档) | GSAP transform 接管 + chrome-text 互斥 + 撞击合成模板 |
| 🟦 P3 | 接 SFX：Tip 10 ESC 撞击接 stop-tap.wav，Tip 12 hooks 接 notification-ding.wav | [P6](./02-pitfalls.md#p6--媒体素材囤而未接入) | 素材现成，每章 2 行 `<audio>` 标签 |
| 🟦 P3 | 学 prompting 词汇表 + Caption Tone 表 | [03-skills §4.1](./03-skills.md#41-一线杠杆-) | 1 张表，未来 prompt 出稿质量阶跃 |
| 🟦 P3 | 学 `tts` + `transcribe` 实操（Kokoro-82M 中文质量验证） | [P6](./02-pitfalls.md#p6--媒体素材囤而未接入) + [03-skills §1.4](./03-skills.md#14-packages包层) | 下次新视频 SRT 节奏预演不靠口录 |

---

## 备注 / 待确认

| 项 | 待确认内容 | 应该去哪验证 |
|---|---|---|
| `npx hyperframes inspect` 实际 finding | 项目跑过 `npm run check`（package.json 第 6 行）含 inspect，但 finding 是否被消费 / 还是被忽略 → 没有 lint 输出快照在 git 中 | 去 `2026-05-04/claude-19-tips-hf/` 跑 `npm run check`，对比 finding |
| `9cf40e3` Revert `2c5a82b` 是否完整恢复 | Revert commit 在 commit body 里只写 "This reverts commit ..."，但实际 git diff 显示 41 + 36 行，与原 commit 36 + 41 不完全对称 → 待逐文件比 | 去 `git show 2c5a82b` vs `git show 9cf40e3` 完整 diff |
| `compositions/components/grain-overlay.html` `shimmer-sweep.html` 内容 | 02 章节体仅扫了主线 chapter，components/ 子目录两个 snippet 内容未读 | 直接读两个文件 |
| Tip 13 的 `compare-card` 是否复用 theme.css 类 还是自定义 | grep 显示 `compare-card` 仅 1 文件用，但 [§C.7](./01-components.md#c7-对比双卡compare-card) 说 theme.css 定义有 0 引用 | 读 13-screenshots.html 完整代码 |
| AGENTS.md 内容 | 脚手架默认带，未读 | 读文件 |
| `计划.md`（51 KB SRT 手稿）是否包含本档案未捕获的视觉决策史 | 工程外脑，未在本档案中扫读 | 直接读 |

---

> 五步完整工程档案至此结束。所有文档均按 `docs/OFFICIAL_DOCS_VALUE_INDEX.md` 为权威参照系生成，引用必带 commit hash + 文件路径 + 索引行号。
