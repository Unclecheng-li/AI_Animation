# 00 · 工程概览

> 19 招 Claude Code Tips · HyperFrames 视频项目工程档案
> 生成于 2026-05-05 · 仅事实，无评价
> 权威参照系：`docs/OFFICIAL_DOCS_VALUE_INDEX.md`（仓库根）

---

## 1. 项目身份

| 字段 | 值 |
|---|---|
| 项目根 | `2026-05-04/claude-19-tips-hf/` |
| 工程名（meta.json） | `my-video` |
| createdAt | 2026-05-04T06:19:41.560Z |
| 标题（index.html） | "Claude Code 19 招" |
| 视口 | 1920 × 1080 |
| 整片时长（index.html `data-duration`） | 453 秒（≈ 7:33） |
| 章节数 | 19 招 + Hook + Outro = 21 段主线 clip |
| 脚手架 commit | `51e4ebf` (2026-05-04 16:11:29 +0800) — `feat: bootstrap HF rebuild for 19-tips video` |
| 最后 commit | `96a0ecd` (2026-05-05 19:52:36 +0800) — `feat(hook): V10 实现 5 秒片头` |
| HF CLI 版本（package.json） | `hyperframes@0.4.43` |
| 字体栈 | `Inter` + `JetBrains Mono` + `Noto Sans SC`（Google Fonts CDN） |
| 主题 token | `assets/theme.css` (7,588 行) |

---

## 2. 仓库结构（2 层深度）

```
2026-05-04/claude-19-tips-hf/
├── CLAUDE.md                     # HF 工程 skill 索引（脚手架自带）
├── AGENTS.md                     # （脚手架自带）
├── 计划.md                        # 51 KB — SRT、节奏脚本、视觉计划手稿
├── README.md（无）                # 工程没有 README，retrospective/ 为本档案根
├── meta.json                     # {id, name, createdAt}
├── package.json                  # npm scripts 包装 npx hyperframes
├── hyperframes.json              # paths 映射 (blocks/components/assets)
├── index.html                    # 主时间线，21 个 sub-comp 串联
├── assets/
│   ├── theme.css                 # 全局 design token + 共享类
│   ├── claude-code-logo.png      # Claude 像素 logo（替代 emoji 🤖）
│   ├── codex-logo.png / codex.png / Claude code.png
│   ├── 白色背景.jpg / 黑色背景.png
│   ├── skill 视频封面.png
│   ├── audio/                    # 8 个 .wav/.m4a SFX
│   │   ├── keyboard-tick / notification-ding / pulse / reference-voice
│   │   ├── rewind-tick / soft-whoosh / stop-tap / ui-click
│   └── video/
│       └── statusbar.mp4
├── compositions/
│   ├── 00-hook.html              # 21 个主线 sub-comp（按章节编号）
│   ├── 01..19-*.html
│   ├── 20-outro.html
│   ├── whip-pan.html             # 6 个 catalog snippet（脚手架带入）
│   ├── flash-through-white.html
│   ├── cinematic-zoom.html
│   ├── flowchart.html
│   ├── logo-outro.html
│   ├── macos-notification.html
│   └── components/               # catalog component snippet
│       ├── grain-overlay.html
│       └── shimmer-sweep.html
├── renders/                      # 渲染产物（mp4 在 .gitignore 内）
│   └── work-dca39223-...-d9ff/   # HF 工作目录
├── .thumbnails/                  # studio preview 缓存（126 项）
└── retrospective/                # 本档案目录
```

**说明**：
- `compositions/` 下的 21 个 `NN-*.html` 是主线章节；6 个无前缀文件（`whip-pan` / `flash-through-white` / `cinematic-zoom` / `flowchart` / `logo-outro` / `macos-notification`）是脚手架时随 catalog 一起带进来的备用 snippet，**整个项目从未被 `index.html` 引用**（待确认引用状态见下方第 3 节）。
- `compositions/components/grain-overlay.html` 与 `shimmer-sweep.html` 同上：脚手架带入未使用。
- `计划.md` 是工程外脑（SRT 全文 + 视觉规划），不在 git 中跟踪过的 commit 序列里直接体现。

---

## 3. 19 招 Composition 清单

| # | 文件 | 主题（commit message 直引） | data-start | data-duration | 文件行数 | 文件大小 | 最后一次 commit | 该文件 commit 数 |
|---|---|---|---|---|---|---|---|---|
| 0 | `00-hook.html` | 5 秒片头 — 黑洞引力 + scatter sneak peek | 0 | 5.266s | 418 | 19 KB | `96a0ecd` 2026-05-05 19:52 | 2 |
| 1 | `01-statusline.html` | statusline ⭐ 样片 | 5.266 | 32.267s | 550 | 23 KB | `f2f0de1` 2026-05-05 16:21 | 6 |
| 2 | `02-commit.html` | commit | 37.533 | 16.866s | 495 | 21 KB | `4b57ab9` 2026-05-04 18:45 | 2 |
| 3 | `03-clear.html` | /clear | 54.399 | 13.667s | 403 | 18 KB | `4bade5b` 2026-05-04 19:08 | 2 |
| 4 | `04-plan-mode.html` | plan mode | 68.066 | 24s | 439 | 18 KB | `8475dc5` 2026-05-05 15:02 | 3 |
| 5 | `05-specific-requests.html` | specific requests | 92.066 | 24.233s | 374 | 15 KB | `6f6e106` 2026-05-04 20:12 | 2 |
| 6 | `06-ask-questions.html` | ask questions | 116.299 | 12.667s | 333 | 14 KB | `b5ed96b` 2026-05-04 20:30 | 2 |
| 7 | `07-plan-reviewer.html` | plan-reviewer | 128.966 | 13.7s | 432 | 19 KB | `17eaa67` 2026-05-04 21:34 | 2 |
| 8 | `08-self-check.html` | self-check | 142.666 | 16.267s | 427 | 18 KB | `bdae6b9` 2026-05-04 21:52 | 2 |
| 9 | `09-claude-md.html` | claude-md | 158.933 | 44.367s | 649 | 28 KB | `8f0c59c` 2026-05-04 22:31 | 2 |
| 10 | `10-esc-stop.html` | esc-stop ⭐ 样片 | 203.300 | 18.033s | 429 | 18 KB | `cc599ad` 2026-05-04 22:53 | 2 |
| 11 | `11-double-esc.html` | double-esc | 221.334 | 21.166s | 559 | 23 KB | `a021199` 2026-05-05 10:15 | 2 |
| 12 | `12-hooks.html` | hooks | 242.500 | 19.933s | 444 | 19 KB | `fb4174b` 2026-05-05 10:53 | 2 |
| 13 | `13-screenshots.html` | screenshots | 262.433 | 22.6s | 415 | 17 KB | `178cce9` 2026-05-05 11:01 | 2 |
| 14 | `14-worktree.html` | worktree | 285.033 | 43.133s | 658 | 28 KB | `2c5a82b` 2026-05-05 15:40 | 5 |
| 15 | `15-api-vs-mcp.html` | api-vs-mcp | 328.166 | 18s | 543 | 22 KB | `9e49070` 2026-05-05 12:25 | 2 |
| 16 | `16-remote-control.html` | remote-control | 346.166 | 10.834s | 506 | 21 KB | `e870d49` 2026-05-05 12:41 | 3 |
| 17 | `17-thinking-budget.html` | thinking-budget | 357.000 | 20.8s | 571 | 23 KB | `fd7cbef` 2026-05-05 12:49 | 2 |
| 18 | `18-agent-teams.html` | agent-teams | 377.800 | 35.7s | 826 | 35 KB | `6f81556` 2026-05-05 13:27 | 3 |
| 19 | `19-skill-creator.html` | skill-creator | 413.500 | 14.5s | 422 | 17 KB | `3e5f844` 2026-05-05 14:05 | 2 |
| 20 | `20-outro.html` | outro | 428.000 | 25s | 48 | 1.6 KB | `51e4ebf` 2026-05-04 16:11 | 1 |

**衍生统计**：
- 21 段主线 clip 总时长 = 453.000s（与 index.html `data-duration="453"` 一致，无 gap）。
- 文件体量分布：最大 `18-agent-teams.html` (826 行 / 35 KB)、最小 `20-outro.html` (48 行 / 1.6 KB，未实质开工)。
- 19 招主体（剔除 hook + outro）平均 ≈ 488 行 / 20.5 KB。

**Catalog snippet（脚手架带入但未在 index.html 引用，待确认是否真未用）**：

| 文件 | 类型 | 行数 | commit 数 |
|---|---|---|---|
| `whip-pan.html` | block | 367 | 1（仅脚手架） |
| `flash-through-white.html` | block | 367 | 1 |
| `cinematic-zoom.html` | block | 367 | 1 |
| `flowchart.html` | block | 472 | 1 |
| `logo-outro.html` | block | 227 | 1 |
| `macos-notification.html` | block | 202 | 1 |
| `components/grain-overlay.html` | component | （未读） | 1 |
| `components/shimmer-sweep.html` | component | （未读） | 1 |

> **待确认**：上述 8 个 snippet 是否被 `index.html` 或某个 sub-composition 通过 `data-composition-src` / `<link>` / class 复用过。`index.html` 主时间线只引用 `00..20-*.html`，但 sub-composition 内部是否引用未在本步逐文件验证（留给 Step 2 组件扫描）。

---

## 4. Commit 节奏

**整体统计**：

| 指标 | 值 |
|---|---|
| 工程目录范围内 commit 总数 | 30 |
| 时间跨度 | 2026-05-04 16:11 → 2026-05-05 19:52，共 ≈ 27.7 小时（跨 2 个工作日） |
| 触发期：Day 1（2026-05-04） | 11 个 commit（17:02 – 22:53） |
| 触发期：Day 2（2026-05-05） | 19 个 commit（10:15 – 19:52） |
| 平均每章 commit 数 | 30 / 21 ≈ 1.43；剔除一次性脚手架 commit 后 = 29 / 21 ≈ 1.38 |
| 单章 commit 数最高 | Tip 1 statusline = **6**（V4 → V5 → fix flexbox → wavy 推全 → revert → 单点 sample → polaroid 修复也牵连） |
| 第二高 | Tip 14 worktree = **5**（V1 + wavy filter prototype + 撤销 + 推全/撤销系列） |

**Day 1（启动期，2026-05-04）—— 11 commits**：

```
51e4ebf 16:11  feat: bootstrap HF rebuild for 19-tips video      ← 脚手架
a4c5843 17:02  feat(tip-01): rewrite statusline V4 — semantic-synced to narration
9757bb8 17:09  feat(tip-01): V5 — real Claude Code window UI + char-by-char typing
f36f96e 17:12  fix(tip-01): center stage elements with flexbox
4b57ab9 18:45  feat(tip-02): V2 — polaroid stack at midline + #3 cross-fade to terminal
4bade5b 19:08  feat(tip-03): /clear V1 — terminal + token cloud explode + ctx meter reset
049ac0a 19:55  feat(tip-04): plan mode V2 — dual-card layout + 2x mode-toggle hero transition
6f6e106 20:12  feat(tip-05): specific requests V1 — BAD vs GOOD comparison
b5ed96b 20:30  feat(tip-06): ask questions V1 — plan-mode dual cards + 95% hero hold
17eaa67 21:34  feat(tip-07): plan-reviewer V1 — role badge swap + sweep audit
bdae6b9 21:52  feat(tip-08): self-check V1 — todo 列表 + 用户插入 QA 项
8f0c59c 22:31  feat(tip-09): claude-md V1 — 双幕 IDE→CLAUDE.md 切换
cc599ad 22:53  feat(tip-10): esc-stop V1 重写 — ESC 暴力撞击三件套
```

**Day 2（推进+全片打磨，2026-05-05）—— 19 commits**：

```
a021199 10:15  feat(tip-11): double-esc V1 — 双 ESC 节奏
fb4174b 10:53  feat(tip-12): hooks V1 — /hooks 菜单 + Stop 配置
178cce9 11:01  feat(tip-13): screenshots V1 — error/inspo 截图卡 → 终端附件
b034b42 11:53  feat(tip-14): worktree V1 — 全屏 6 场景 + 垂直 camera pan
9e49070 12:25  feat(tip-15): api-vs-mcp V1 — 双卡 MCP/API 对比 + 双 ctx-meter
9f80b01 12:36  feat(tip-16): remote-control V1 — 终端+QR 二维码 → 走开 → 三端环绕
e870d49 12:41  fix(tip-16): 中央 bubble 把 🤖 emoji 换成 claude-code-logo.png 像素 logo
fd7cbef 12:49  feat(tip-17): thinking-budget V1 — 双痛点 → ultrathink 触发 → budget ramp
0977142 13:04  feat(tip-18): agent-teams V1 — 6 场景 camera pan · 顾问 → 派 worker
6f81556 13:27  fix(tip-18): 去掉 Codex (Agent Teams 是 Claude 内部) + 加 worker↔worker 横向沟通
3e5f844 14:05  feat(tip-19): skill-creator V1 — SKILL.md 文件 + 三栏流程
8475dc5 15:02  fix: 减淡 vignette 黑场感 + Tip 14 wavy filter prototype
9cf40e3 15:36  feat: wavy 透视网格推全 19 招 + 清理 Tip 14 prototype     ← 全片视觉重构
2c5a82b 15:40  Revert "feat: wavy 透视网格推全 19 招 + 清理 Tip 14 prototype"  ← 4 分钟后撤销
2d69585 15:45  feat(tip-01): wavy 透视网格 — Tip 1 sample（推全 18 招前的模板）
f2f0de1 16:21  fix(tip-01,02): Tip 1 视觉重做对齐口播 + Tip 2 polaroid 溢出修复
96a0ecd 19:52  feat(hook): V10 实现 5 秒片头 — 黑洞引力 + scatter sneak peek
```

**节奏特征**（仅事实陈述，分析见 Step 3）：
- Day 1 = 一气呵成做 Tip 1–10，平均 ≈ 35 分钟一个 tip。
- Day 2 上午 = Tip 11–19 收尾，平均 ≈ 25 分钟一个 tip。
- Day 2 下午 = 全片打磨（vignette / wavy 网格推全 → 撤销 → 单点回退）。
- Day 2 晚 = 最后一棒做开场 hook（V10 命名暗示存在 V1–V9 的迭代，但单 commit 内）。
- Tip 1 的 6 个 commit 跨越 Day 1 + Day 2，体现"开篇磨样 + 视觉风格回头改"。
- Tip 14 的 5 个 commit 都集中在 Day 2，wavy filter 实验和撤销链。
- 唯一的 `Revert` commit `2c5a82b`：全片 wavy 推全 4 分钟后被撤销。

---

## 5. 知识基线（来自 `OFFICIAL_DOCS_VALUE_INDEX.md`）

> 摘自权威索引中评级 ⭐⭐⭐（必读，本项目映射 5★）和 ⭐⭐（值得读，映射 4★）的官方文档页。本项目所有"官方怎么说"的判断以下表为准。

### 5★ 必读（10 页）

| 页面 | 一句话价值 | 索引中"已体现"列 |
|---|---|---|
| `guides/prompting.md` | 词汇表 + 提示模板（smooth/snappy/bouncy → ease，fast/medium/slow → 时长，Caption Tone → 字体+尺寸） | 否 |
| `guides/rendering.md` | 透明 MOV ProRes 4444 + draft/standard/high quality + Docker 模式 | 部分 |
| `guides/video-editor-cheatsheet.md` | 手动 DOM 微调 → Agent 清理 diff 循环；`tl.set({}, {}, 5)` 最小时间线 | 否 |
| `guides/hyperframes-vs-remotion.md` | HTML+GSAP 比 React 更适合 AI 写视频的底层选型论 | 否 |
| `concepts/data-attributes.md` | 相对时序 `data-start="intro + 2"` / `data-start="intro - 0.5"` | 否 |
| `reference/html-schema.md` | 7 条 Timeline Contract + 全属性表 + `data-variable-values` 传参 | 部分 |
| `packages/cli.md` | `tts` / `capture` / `inspect` / `snapshot` 4 个未用过的生产力命令 | 部分 |
| `catalog/blocks/whip-pan.md` | beat 间隔默认转场 shader | 部分 |
| `catalog/blocks/flash-through-white.md` | 幕间大转场首选 shader | 是 |
| `catalog/blocks/cinematic-zoom.md` | 文字穿越进入 3D 的转场 shader | 否 |

### 4★ 值得读（11 页）

| 页面 | 一句话价值 | 索引中"已体现"列 |
|---|---|---|
| `guides/gsap-animation.md` | 时间线长度 = 视频长度 + `<video>` 须 `<div>` 包裹 | 部分 |
| `guides/common-mistakes.md` | 8 条 lint 查不出的真实 bug + Debugging Checklist | 否 |
| `guides/performance.md` | backdrop-filter blur 上限 2-3 层 / 单帧 200ms 警戒线 | 否 |
| `guides/timeline-editing.md` | move/trim/stack 操作的 `data-*` 映射 + row 排列规则 | 部分 |
| `concepts/compositions.md` | composition 嵌套 + `data-variable-values` 传参 | 部分 |
| `getting-started/quickstart.md` | `npx skills add heygen-com/hyperframes` 一次性安装 8 个子 skill | 部分 |
| `packages/producer.md` | WebM VP9 alpha 透明 + 外部资产 auto-copy + `hdr: true` | 否 |
| `catalog/blocks/logo-outro.md` | 6s 片尾：piece-by-piece + glow bloom + URL pill | 部分 |
| `catalog/blocks/ui-3d-reveal.md` | 13s 透视 3D UI 入场 | 否 |
| `catalog/components/grain-overlay.md` | 纹理三件套官方安装入口 | 是 |
| `catalog/components/shimmer-sweep.md` | logo hold 阶段的铬光扫 | 部分 |

### 状态映射（仅事实，不评价）

- "是"：项目内已使用，且做法与官方一致。
- "部分"：用了但只用了一部分，或写法非官方推荐。
- "否"：官方该页面对应的能力，本项目从未触及。
- 详细映射在 Step 3（坑与解法）+ Step 4（能力地图）展开。

---

## 6. 工程外脑

| 文件 | 角色 |
|---|---|
| `计划.md`（51 KB） | SRT 全文（"最新1.srt"）、视觉构思手稿、口播逐字 → 视觉时间码对齐表。**未被 git 跟踪 commit**。 |
| `CLAUDE.md`（脚手架默认） | 11 个子 skill 表 + 6 条 Key Rules + lint 规约。 |
| `AGENTS.md`（脚手架默认） | （未读） |
| `OFFICIAL_DOCS_VALUE_INDEX.md`（仓库根 `docs/`） | 本档案唯一权威参照系 |

---

> 第 1 步完成。下一步：扫描所有 composition 提取数据属性 / 动画 / 视觉布局三类模式 → `01-components.md`。
