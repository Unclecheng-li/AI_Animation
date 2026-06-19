# network-protocol-viz

> 网络协议工作原理可视化动画 Skill

## 简介

专门生成网络协议动态可视化 HTML 页面。暗色科技风格，用动画直观展示协议工作流程。

## 已支持的协议演示

| 协议 | 演示内容 | 示例文件 |
|------|---------|---------|
| TCP/IP | 三次握手、四次挥手 | `assets/tcp-visualization.html` |
| IPv4 | 数据报结构 + 3D 展示 | `assets/ipv4_datagram-3d.html` |
| 以太网 | 帧结构字段动画 | `assets/ethernet-frame.html` |
| 路由 | 路由表查询、转发动画 | `assets/router-routing-table.html` |
| 交换机 | MAC 表学习过程 | `assets/switch-mac-table.html` |
| DHCP | 四步地址分配流程 | `assets/DHCP/` |
| HTTPS | TLS 握手流程 | `assets/HTTPS.html` |
| PPP | 链路层帧结构 | `assets/ppp_frame.html` |

## 使用方式

```
用 network-protocol-viz 可视化 TCP 三次握手过程
```

```
用 network-protocol-viz 演示 DHCP 地址分配流程，暗色风格
```

```
基于 assets/tcp-visualization.html 的风格，演示 TLS 1.3 握手流程
```

## Prompt 参考

详见 `references/prompts.md`
