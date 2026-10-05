<div align="center">
  <img src="website/public/brand/plotbeat-mark.svg" width="96" alt="Plotbeat 标志" />
  <h1>Plotbeat</h1>
  <p><strong>把数据变成可编辑视频，为 AI 智能体而生，由 HyperFrames 驱动。</strong></p>
  <p>
    <a href="README.md">English</a> ·
    <a href="README.zh-CN.md">简体中文</a> ·
    <a href="README.ja.md">日本語</a> ·
    <a href="README.ko.md">한국어</a> ·
    <a href="README.es.md">Español</a> ·
    <a href="README.de.md">Deutsch</a> ·
    <a href="README.fr.md">Français</a> ·
    <a href="README.pt-BR.md">Português</a>
  </p>
</div>

Plotbeat 是一个开源 AI 技能与可复用模板系统，可将 CSV、JSON、URL、API 和公开数据源转换为确定性、可编辑的 [HyperFrames](https://github.com/heygen-com/hyperframes) 图表视频。

Plotbeat 不是独立渲染器。HyperFrames 仍然负责时间线、Studio 预览、检查和渲染；Plotbeat 提供数据编译器、动效语法、视觉系统、示例合成和智能体工作流。

## 动效预览

以下均为 Plotbeat 的真实渲染结果，而非界面模型。点击任一预览可打开带声音的完整 MP4，也可以访问[在线模板库](https://plotbeat.app/zh/#templates)。

<table>
  <tr>
    <td width="50%"><a href="website/public/previews/single-line.mp4"><img src="docs/assets/previews/single-line.gif" width="100%" alt="单折线故事动效预览" /></a><br /><sub><strong>Single-line Story</strong> · 趋势与 KPI 历史</sub></td>
    <td width="50%"><a href="website/public/previews/multi-line.mp4"><img src="docs/assets/previews/multi-line.gif" width="100%" alt="多折线排名动效预览" /></a><br /><sub><strong>Multi-line Rank</strong> · 群组与类别比较</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/bar-race.mp4"><img src="docs/assets/previews/bar-race.gif" width="100%" alt="动态条形图预览" /></a><br /><sub><strong>Bar Race</strong> · 排名与排行榜</sub></td>
    <td><a href="website/public/previews/stacked-area.mp4"><img src="docs/assets/previews/stacked-area.gif" width="100%" alt="堆叠面积故事动效预览" /></a><br /><sub><strong>Stacked-area Story</strong> · 构成与占比</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/scatter-journey.mp4"><img src="docs/assets/previews/scatter-journey.gif" width="100%" alt="散点轨迹动效预览" /></a><br /><sub><strong>Scatter Journey</strong> · 双因素变化</sub></td>
    <td><a href="website/public/previews/animated-map.mp4"><img src="docs/assets/previews/animated-map.gif" width="100%" alt="动态地图预览" /></a><br /><sub><strong>Animated Map</strong> · 地理活动与流向</sub></td>
  </tr>
  <tr>
    <td><a href="website/public/previews/kpi-dashboard.mp4"><img src="docs/assets/previews/kpi-dashboard.gif" width="100%" alt="KPI 仪表盘动效预览" /></a><br /><sub><strong>KPI Dashboard</strong> · 业务与组合复盘</sub></td>
    <td><a href="website/public/previews/milestone-timeline.mp4"><img src="docs/assets/previews/milestone-timeline.gif" width="100%" alt="里程碑时间线动效预览" /></a><br /><sub><strong>Milestone Timeline</strong> · 发布与产品历程</sub></td>
  </tr>
</table>

## 安装

```bash
npx skills add heygen-com/hyperframes --all
npx skills add DbgKinggg/plotbeat --skill plotbeat
```

然后向智能体发送提示词：

> 使用 `$plotbeat` 从 FRED 获取过去 10 年的美国月度失业率数据，注明来源和获取日期，并制作一段节奏明快、可编辑的 HyperFrames 趋势视频。渲染前让我确认视觉风格。

## v0.1 内容

| 模板 | 适用场景 | 输入结构 |
| --- | --- | --- |
| `single-line-story` | 趋势与 KPI 历史 | `date, value` |
| `multi-line-rank` | 群组与类别比较 | `date, series, value` |
| `bar-race` | 排名与排行榜 | `date, series, value` |
| `stacked-area-story` | 构成与占比 | `date, series, value` |
| `scatter-journey` | 双因素变化 | `date, series, x, y` |
| `animated-map` | 地理活动与流向 | `location, latitude, longitude, value` |
| `kpi-dashboard` | 业务与组合复盘 | `metric, value, target, change` |
| `milestone-timeline` | 发布与产品历程 | `date, title` |

每个模板都带有通用示例数据、可安全跳转的动效、开场与结尾、本地配乐来源记录，以及 8 套可选的明暗视觉系统。

## 本地开发

需要 Node.js 22.13 或更高版本。

```bash
git clone https://github.com/DbgKinggg/plotbeat.git
cd plotbeat
npm run prepare:single
npm run dev
```

网站：

```bash
cd website
npm install
npm run dev
```

## 发布验证

```bash
npm run package:skill
npm test
npm run release:audit
npm run check:all
npm --prefix website test
```

提交新模板前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。项目采用 MIT 许可证。
