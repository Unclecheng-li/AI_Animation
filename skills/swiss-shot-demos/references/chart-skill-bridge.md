# 图表技能桥接（三技能融合选型 · 让 AI 按内容匹配选择）

三个可视化技能已与本体系融合。**分工**：lieflat 管"数据图表"（数字怎么画），diagram-design 管"概念示意图"（关系怎么画），archify 管"工程图"（系统怎么画）；都不适配时用 chart-vocabulary.md 的内建 CSS/SVG 兜底。

| 技能 | 定位 | 可用性 |
|---|---|---|
| **lieflat-charts** | 数据可视化法典：63 图型按**数据形状**选型（L 编辑部 20 / F 基础 17 / G 快读 20 / B 大图+地图），Mono 灰阶正本与瑞士风天然同族 | **未内置**（PolyForm NC 许可，不能随 MIT 仓库分发）。需安装：`npx skills add https://github.com/larashero3-dotcom/lieflat-charts`；未安装时用内建兜底 |
| **diagram-design** | 概念示意图 14 型 + 3 原语（流程/时序/状态/泳道/嵌套/分层/象限/金字塔/树/ER/维恩/时间线/组织/架构 + 标注引线），默认"编辑纸底"皮肤与瑞士风同族 | **已内置** `assets/chart-skills/diagram-design/`（MIT） |
| **archify** | 工程图 5 型（architecture/workflow/sequence/dataflow/lifecycle），JSON Schema 驱动 + 校验 + 流动粒子动画，接受 Mermaid 输入 | **已内置** `assets/chart-skills/archify/`（MIT） |

## 选型决策表（内容本质 → 首选 → 兜底）

| 内容本质 | 首选（技能·图型） | 内建兜底（chart-vocabulary） |
|---|---|---|
| star 数/规模计数 | lieflat **G18** Draw-in+Counter（短视频开场神器） | 大字计数+点阵 |
| 少类目排名（≤8） | lieflat **F1** Rung Bars / **F5** Tick Rows | 发丝轴柱 |
| 排名比较·可数单位 | lieflat **L2** Dot Cascade | 点阵翻倍 |
| 逐日/逐时序列 | lieflat **F2** Hairline Line / **F3** Hairline Area / **L3** Barcode | 发丝刻度线 |
| 100% 构成（≤6 段） | lieflat **F4** Tick Donut / **G4** Dot Waffle | 灰阶堆叠条 |
| 多选百分比（≤6 项） | lieflat **L15** Ballot Tally | 计票清单 |
| 单值进度 0-100% | lieflat **F11** Tick Gauge | 环形刻度 |
| 分组前后对比 | lieflat **F6** Paired Rungs / **F12** Dumbbell | slopegraph |
| 瀑布/增减分解 | lieflat **F9** Rung Waterfall | 分解条 |
| 二维热力（离散×离散） | lieflat **G20/L16** Matrix Heat | 热力矩阵 |
| 星期×小时×量 | lieflat **F10** Dot Heat / **G14** Single Axis | 点热力 |
| 双极量表/品牌光谱 | lieflat **L7** Brand Spectrum | 双极横轴 |
| 多对一归属（≤60 条） | lieflat **L5** Radial Convergence | 归属连线 |
| 流程/步骤/因果链 | diagram-design **flowchart**（+annotation 引线原语） | 流程链 |
| 状态迁移 | diagram-design **state** / archify **lifecycle** | 状态机弧线 |
| 三方角色互动 | diagram-design **swimlane** | 泳道 |
| 调用时序/API | archify **sequence** | 时序图 |
| 嵌套/隔离边界 | diagram-design **nested** | 嵌套框 |
| 分层堆叠 | diagram-design **layers** | 分层堆叠 |
| 象限定位 | diagram-design **quadrant** | 四象限 |
| 收敛/优先级 | diagram-design **pyramid** | 金字塔 |
| 系统架构/拓扑 | archify **architecture**（流线粒子加分） | 总线图 |
| 数据管道/ETL | archify **dataflow** | 管道流 |
| ER/数据模型 | diagram-design **er** | 表格关系 |
| 时间线（事件/演进） | diagram-design **timeline** | 横向时间线 |

**判别口诀**：有数字要画 → lieflat（按数据形状查表）；讲关系/概念 → diagram-design；讲系统/工程 → archify；都是轻量示意 → 内建兜底最快。

## 使用规则（已内置的两家）

- **按需读型文档，勿通读**：diagram-design 只读 `assets/chart-skills/diagram-design/references/type-<名>.md`（14 选 1）+ 对应 `assets/example-<名>.html` 需要时窗口抽查；archify 按 SKILL.md 流程（读一个 schema + 一个 example → 写候选 JSON → `node bin/archify.mjs` 校验渲染 → 修到通过）。
- archify 的 `quality_profile: "showcase"`、主路径一条、主节点 ≤12。

## Swiss 换肤规则（外部图并入 shot 页时必做）

三家默认皮肤都是"纸底编辑风"，与瑞士正本同族，但并入本体系时**统一覆盖为 v4 tokens**：

1. 底色 → `--paper #F0EFEB`；文字/主线 → `--ink #1C1C1A`；网格/刻度 → `--grid`/`--faint`；彩色预设全部收敛为**灰阶阶梯 + 唯一橙 `#F5572F`**（lieflat 的 WIRE 预设本就是"黑灰阶+荧光橙"，最接近，直接近似映射）；
2. 字体 → Inter/Noto Sans SC/IBM Plex Mono（覆盖其默认字体声明）；
3. **去交互**（hover 高亮/拖拽/tooltip）——录屏动画不需要；**去发光**；图表尺寸按 12 列网格嵌入主体图形区（≥55% 面积）；
4. 入场改 **cue+tws 驱动**：描线 draw / 条升起 pop / 计数滚动（原库的滚动动画时刻改为 cue 触发，保证可暂停可冻结）；
5. lieflat 图（若已安装）从其 gallery 模板抠对应卡片实现，按上述规则换肤后嵌入。

## 许可注记

- diagram-design、archify：MIT，已随包内置，保留其原 LICENSE/署名；
- lieflat-charts：PolyForm Noncommercial——仅限非商业项目使用，且**不随本仓库分发**，用前自行安装；未安装时一律走内建兜底，选型表里的 lieflat 图型同时是兜底实现的"目标形态"参考。
