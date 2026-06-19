# dynami-carchify

> 动态架构图 / 流程图 / 时序图 / 数据流图 / 状态机生成 Skill

## 简介

生成专业级技术图表的单文件 HTML，包含内联 SVG、暗/亮主题切换、流动动画效果、一键导出（PNG / JPEG / WebP / SVG / GIF / WebM）。接受自然语言描述或粘贴的 Mermaid 代码，从零开始布局。

源自 [archify](https://github.com/Cocoon-AI/architecture-diagram-generator)（MIT），在 AI-Animation 集合中命名为 `dynami-carchify`，强调其动态动画特性。

## 支持的图表类型

| 类型 | 用途 | 渲染器 |
|------|------|--------|
| `architecture` | 系统组件、云资源、服务、安全边界、基础设施 | `renderers/architecture/render-architecture.mjs` |
| `workflow` | 技术流程、审批门、工具调用、Runbook、CI/CD | `renderers/workflow/render-workflow.mjs` |
| `sequence` | API 调用链、请求生命周期、缓存回退、异步追踪 | `renderers/sequence/render-sequence.mjs` |
| `dataflow` | 数据管道、ETL/ELT、PII 隔离、血缘、仓库同步 | `renderers/dataflow/render-dataflow.mjs` |
| `lifecycle` | 状态机、状态转换、等待态、重试、终态 | `renderers/lifecycle/render-lifecycle.mjs` |

## 使用方式

```
用 dynami-carchify 画一个微服务架构图，包含 API Gateway、3 个微服务、Redis 和 PostgreSQL
```

```
用 dynami-carchify 生成一个 CI/CD 发布流程的 workflow 图
```

```
用 dynami-carchify 把这段 Mermaid 转成专业图表：
sequenceDiagram
    Client->>Gateway: GET /api/data
    Gateway->>Service: forward
    Service-->>Gateway: 200 OK
    Gateway-->>Client: response
```

## 动画效果

所有图表自动包含流动动画：
- **CSS 流动动画** — `stroke-dasharray` 沿路径流动，带发光效果
- **SVG 粒子动画** — 沿连接路径移动的发光圆点
- 按连接类型自动调整速度：`emphasis`（快流+脉冲）/ `default`（中速）/ `dashed`（异步）/ `security`（安全路径）

## 导出格式

| 格式 | 说明 |
|------|------|
| PNG | 高分辨率栅格图（最高 4x） |
| JPEG | 带背景的压缩栅格图 |
| WebP | 现代压缩格式，支持透明 |
| SVG | 矢量格式，自动适配明暗主题 |
| GIF | 动画 GIF，捕获流动动画（可配置分辨率/帧率/时长） |
| WebM | 高质量视频格式（可配置） |

## 技术栈

- 纯 HTML + 内联 SVG + CSS（无外部运行时依赖）
- Node.js 渲染器（`renderers/`）+ JSON Schema 验证（`schemas/`）
- Google Fonts 异步加载，离线降级到系统等宽字体
- 主题切换持久化到 `localStorage`，尊重 `prefers-color-scheme`

## Setup（仅渲染器需要）

```bash
cd skills/dynami-carchify
npm install
```

## 目录结构

```
dynami-carchify/
├── SKILL.md              ← Agent 执行指令
├── README.md             ← 本文档
├── LICENSE
├── package.json
├── assets/
│   ├── template.html     ← 手动 SVG 模板（无 Node 环境时使用）
│   ├── gif.js            ← GIF 导出库
│   └── gif.worker.js     ← GIF worker
├── renderers/            ← 5 种图表类型的渲染器
│   ├── architecture/     ← render-architecture.mjs
│   ├── workflow/         ← render-workflow.mjs + README.md
│   ├── sequence/         ← render-sequence.mjs + README.md
│   ├── dataflow/         ← render-dataflow.mjs + README.md
│   ├── lifecycle/        ← render-lifecycle.mjs + README.md
│   └── shared/           ← 共享工具（geometry、validator、cli、utils）
├── schemas/              ← JSON Schema 验证文件（每种类型一个 .schema.json）
├── examples/             ← 每种类型的完整示例 JSON
│   ├── web-app.architecture.json
│   ├── agent-tool-call.workflow.json
│   ├── cache-miss-request.sequence.json
│   ├── product-analytics.dataflow.json
│   ├── agent-run.lifecycle.json
│   ├── qclaw-architecture.json
│   └── ai-api-relay.json
├── output/               ← 生成产物示例（HTML 输出）
│   ├── qclaw-architecture-animated-v12.html
│   ├── ai-api-relay.html
│   └── ...
└── test/                 ← 测试（单元测试 + golden 文件）
```

## License

MIT — based on [Cocoon-AI/architecture-diagram-generator](https://github.com/Cocoon-AI/architecture-diagram-generator)
