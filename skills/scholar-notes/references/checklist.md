# 学霸笔记 · 质量检查清单

生成笔记后，逐项检查以下内容。

---

## P0 · 必须通过（两条模板通用）

- [ ] `<title>` 标签已替换为笔记标题（不含占位符）
- [ ] HTML 文件可在浏览器中正常打开
- [ ] 所有中文内容使用 `lang="zh-CN"`
- [ ] **没有使用 emoji 作为任何图标**（Style A 用 Lucide，Style B 用 Remix Icon）
- [ ] **内容页纸的高度没有超过皮革封面的高度**（Style B 专项）

---

## Style A 专项检查

- [ ] 字体加载正常（Kalam, Patrick Hand, Zeyada）
- [ ] Lucide CSS 引入正确（`https://unpkg.com/lucide-static@latest/font/lucide.min.css`）
- [ ] 螺旋装订孔正常显示
- [ ] 纸质背景（横线 + 红色装订线）正常显示
- [ ] 所有 `.write-in` 元素的 `animation-delay` 按顺序递增
- [ ] 便签 `.side-note` 位置合理，不遮挡正文
- [ ] Lucide 装饰图标不超过 3 个，且 opacity ≤ 0.15

---

## Style B 专项检查

- [ ] 字体加载正常（Kalam, Ma Shan Zheng, Zeyada）
- [ ] Remix Icon CSS 引入正确（`https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css`）
- [ ] 皮革封面正常显示（棕色背景 + 金属环）
- [ ] 翻页交互正常（键盘←→ / 点击封面）
- [ ] 封面 `.page.cover` 有 `active` 类
- [ ] 内容页数量与 `totalPages` 变量一致
- [ ] 每个内容页都有 `data-page` 属性和 `.page-number`
- [ ] `.pages-container` 的 `min-height` 与 `.page` 的 `min-height` 一致

---

## P1 · 强烈建议

- [ ] 流程图 `.flow-box` / `.attack-chain` 箭头方向正确
- [ ] 对比框 `.compare-box` 新旧/正反标签颜色正确
- [ ] 代码术语使用 `.code-term` / `.key-term` 而非普通引号
- [ ] 便签颜色与内容语义匹配
- [ ] 咖啡渍不超过 2 个（Style A）

---

## P2 · 建议

- [ ] 整体内容节奏合理
- [ ] 段落之间有适当的间距
- [ ] 颜色使用一致（不要随意新增 CSS 变量）
- [ ] 响应式布局在移动端正常

---

## 常见问题

### Q: Style B 翻页不生效？
A: 检查是否引入了翻页 JavaScript，以及 `totalPages` 是否与实际页面数一致。

### Q: Style A 动画不生效？
A: 检查是否引入了底部的 JavaScript（IntersectionObserver + setTimeout）。

### Q: 字体不显示？
A: 检查 Google Fonts 链接是否正确，网络是否可达。

### Q: 内容超出封面高度？
A: 压缩精简内容，或拆分为多个页面。
