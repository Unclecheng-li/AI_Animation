# flowchart

> 教育/科普类流程图、概念图、原理演示动画 Skill

## 简介

生成教育/科普类流程图与原理演示的动画 HTML 页面。暗色科技风格，节点发光、箭头流动、数据粒子效果。适合视频科普、技术讲解、PPT 配图。

不只是 AI 模型——任何概念、流程、对比、交互都能用动画流程图呈现。

## 支持的图表类型

| 类型 | 说明 | 适合场景 |
|------|------|---------|
| 流程图 | 步骤流程、决策分支、循环 | 攻击链、渗透流程、API 调用链 |
| 概念图 | 概念关系、知识结构、层级 | AI 模型对比、协议分层 |
| 原理演示 | 模型/算法/协议的动态工作过程 | RNN、LSTM、TCP 握手 |
| 时序图 | 消息交互、请求响应 | 客户端-服务端交互 |
| 对比图 | 两种/多种方案并排对比 | RNN vs LSTM、HTTP vs HTTPS |
| 时间线 | 事件发展、版本演进 | 技术发展史 |
| 系统概览 | 简化的系统架构、模块关系 | 微服务拓扑、网络拓扑 |

## 已有示例（AI/ML 模型）

| 模型 | 演示内容 | 示例文件 |
|------|---------|---------|
| MLP | 前向传播、层间权重流动 | `assets/MLP.html` |
| RNN | 时间步展开、隐藏状态传递 | `assets/RNN.html` |
| LSTM | 三门机制动画、cell state 流动 | `assets/LSTM-Introduce.html` |
| GRU | 简化门控机制、与 LSTM 对比 | `assets/GRU-Introduce.html` |
| Word2Vec | 词向量生成过程 | `assets/word2vec.html` |
| One-Hot | 编码缺陷演示 | `assets/onehot.html` |
| GPU | 并行架构可视化 | `assets/GPU.html` |

## 使用方式

```
用 flowchart 演示 LSTM 的工作原理，重点展示遗忘门和输入门
```

```
用 flowchart 画一个渗透测试攻击链的流程图，暗色风格
```

```
用 flowchart 对比 HTTP 和 HTTPS 的工作流程
```

```
用 flowchart 可视化 TCP 三次握手的交互过程
```

```
以 assets/LSTM-Introduce.html 为参考风格，生成 Transformer 注意力机制演示
```

## 与 dynamic-archify 的区别

| | flowchart | dynamic-archify |
|---|---|---|
| **定位** | 教育/科普，面向视频演示 | 工程/架构，面向技术文档 |
| **风格** | 轻量化、好看、直观 | 专业级、精确、可导出 |
| **输出** | 单文件 HTML 动画 | 单文件 HTML + 多格式导出 |
| **输入** | 自然语言描述 | 自然语言 / JSON / Mermaid |

## Prompt 参考

详见 `references/prompts.md`
