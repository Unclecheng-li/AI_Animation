# card-theater

> 侧边栏叙事 + 3D 卡片轮播演示动画 Skill

## 简介

生成侧边栏叙事 + 3D 卡片轮播的演示动画 HTML 页面。左侧叙事栏逐步解说，右侧 3D 玻璃拟态卡片以 Coverflow / 轨道 / 滚动方式排列。支持模式切换（动态插入/移除卡片）、荧光笔高亮、水印图标等效果。适合协议流程演示、产品特性展示、分步讲解场景。

## 5 种模板

| 模板 | 交互方式 | 视觉特点 | 适合场景 |
|------|---------|---------|---------|
| `scroll-3d-tilt` | 垂直滚动 + 鼠标 3D 倾斜 | 动态网格背景 + 鼠标跟随 3D 透视 | 单页滚动型演示，沉浸感强 |
| `apple-aurora-track` | 键盘 ←→ + 点击 | Apple 极光背景 + 液态玻璃卡片轨道 | 产品特性展示，高级感 |
| `coverflow-classic` | Swiper Coverflow + 键盘 + 滚轮 | 经典 3D Coverflow + 侧边栏解说 | 协议流程分步讲解，最通用 |
| `coverflow-watermark` | Swiper Coverflow + 键盘 + 滚轮 | 巨型水印图标 + 卡片内大段文字 | 内容密度高的技术讲解 |
| `coverflow-focus` | Swiper Coverflow + 键盘 + 滚轮 | 选中卡片展开详情 + 总结卡片 | 由浅入深的渐进式讲解 |

## 使用方式

```
用 card-theater 制作一个关于"TLS 握手"的演示，5 张卡片，coverflow-classic 模板
```

```
用 card-theater 演示 OAuth 2.0 授权流程，需要模式切换（授权码模式 / 简化模式）
```

```
用 card-theater 展示 Docker 容器生命周期，apple-aurora-track 风格，6 张卡片
```

```
以 assets/coverflow-focus.html 为模板，演示 DNS 解析过程的 7 个步骤
```

## 模板预览

| 模板 | 预览 |
|------|------|
| `scroll-3d-tilt` | <!-- TODO: 补充预览图 --> |
| `apple-aurora-track` | <!-- TODO: 补充预览图 --> |
| `coverflow-classic` | <!-- TODO: 补充预览图 --> |
| `coverflow-watermark` | <!-- TODO: 补充预览图 --> |
| `coverflow-focus` | <!-- TODO: 补充预览图 --> |

## 核心特性

- **侧边栏叙事** — 标题 + 解说文字 + 关键要点，随卡片切换同步更新
- **3D 卡片轮播** — Coverflow 3D 旋转 / 轨道平移 / 滚动翻页三种交互模式
- **模式切换** — 动态插入/移除卡片（如传输模式 ↔ 隧道模式），带过渡动画
- **荧光笔高亮** — 选中卡片的关键字段播放划线动画
- **水印图标** — 巨型半透明图标作为卡片背景装饰
- **多端适配** — PC 键盘鼠标 + 移动端触摸滑动

## 技术栈

- Tailwind CSS (CDN)
- Font Awesome (CDN)
- Swiper.js (CDN, coverflow 模板用)
- Google Fonts: Inter + JetBrains Mono + Noto Sans SC

## Prompt 参考

详见 `references/prompts.md`
