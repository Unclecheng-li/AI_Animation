# ai-model-viz

> AI/ML 模型原理可视化动画 Skill

## 简介

专门生成 AI/ML 模型工作原理的动态 HTML 可视化页面。暗色科技风格，图形化展示模型结构和数据流动过程。

## 已支持的模型

| 模型/概念 | 演示内容 | 示例文件 |
|-----------|---------|---------|
| MLP | 前向传播、层间权重流动 | `assets/MLP.html` |
| RNN | 时间步展开、隐藏状态传递 | `assets/RNN.html` |
| LSTM | 三门机制动画、cell state 流动 | `assets/LSTM-Introduce.html` |
| GRU | 简化门控机制、与 LSTM 对比 | `assets/GRU-Introduce.html` |
| Word2Vec | 词向量生成过程 | `assets/word2vec.html` |
| One-Hot | 编码缺陷演示 | `assets/onehot.html` |
| GPU | 并行架构可视化 | `assets/GPU.html` |

## 使用方式

```
用 ai-model-viz 演示 LSTM 的工作原理，重点展示遗忘门和输入门
```

```
用 ai-model-viz 生成一个 RNN 与 LSTM 的对比动画
```

```
以 assets/LSTM-Introduce.html 为参考风格，生成 Transformer 注意力机制演示
```

## Prompt 参考

详见 `references/prompts.md`
