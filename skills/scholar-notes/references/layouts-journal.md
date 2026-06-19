# 学霸笔记 · Style B 布局库（手账皮革本）

每种布局都是一个可复用的页面骨架。Style B 使用翻页交互，每个 `.page` 是一页。

---

## L01 · 封面

封面是第一页，点击可翻页。

```html
<div class="page cover active" data-page="0">
    <div class="cover-decoration"><i class="ri-shield-flash-line"></i></div>
    <div class="cover-title">[笔记标题]</div>
    <div class="cover-subtitle">[副标题]</div>
    <svg class="cover-doodle" viewBox="0 0 200 150">
        <!-- 手绘装饰图 -->
        <path d="M30,75 Q60,30 100,75 T170,75" fill="none" stroke="#c53030" stroke-width="2" stroke-dasharray="5,5" opacity="0.5"/>
    </svg>
    <div style="font-size: 1rem; color: var(--ink-light); margin-top: 20px;">
        <span style="display: block; margin: 5px 0;"><i class="ri-check-line"></i> 要点1</span>
        <span style="display: block; margin: 5px 0;"><i class="ri-check-line"></i> 要点2</span>
        <span style="display: block; margin: 5px 0;"><i class="ri-check-line"></i> 要点3</span>
    </div>
    <div class="cover-hint">点击翻页开始阅读 ↓</div>
</div>
```

---

## L02 · 标准内容页

页面标题 + 正文内容。

```html
<div class="page" data-page="1">
    <div class="content-wrapper">
        <div class="page-header"><i class="ri-xxx-line"></i> [页面标题]</div>
        <p class="handwriting">[正文内容]</p>
    </div>
    <div class="page-number">1</div>
</div>
```

---

## L03 · 重点框页

带重点框的内容页。

```html
<div class="page" data-page="2">
    <div class="content-wrapper">
        <div class="page-header">[页面标题]</div>
        <p class="handwriting">[正文内容]</p>
        <div class="key-point-box">
            <div class="box-title"><i class="ri-xxx-line"></i> [重点标题]</div>
            <div class="box-content">[重点内容]</div>
        </div>
    </div>
    <div class="page-number">2</div>
</div>
```

---

## L04 · 概念卡片页

多个并列概念卡片。

```html
<div class="page" data-page="3">
    <div class="content-wrapper">
        <div class="page-header">[页面标题]</div>
        <div class="concept-cards">
            <div class="concept-card">
                <div class="card-icon"><i class="ri-xxx-line"></i></div>
                <div class="card-title">[概念1]</div>
                <div class="card-desc">[描述]</div>
            </div>
            <div class="concept-card">
                <div class="card-icon"><i class="ri-xxx-line"></i></div>
                <div class="card-title">[概念2]</div>
                <div class="card-desc">[描述]</div>
            </div>
        </div>
    </div>
    <div class="page-number">3</div>
</div>
```

---

## L05 · 攻击链/流程页

圆形节点 + 箭头连接。

```html
<div class="page" data-page="4">
    <div class="content-wrapper">
        <div class="page-header">[页面标题]</div>
        <div class="attack-chain">
            <div class="chain-node">
                <div class="node-icon"><i class="ri-bomb-line"></i></div>
                <div class="node-label">[节点1]</div>
            </div>
            <div class="chain-arrow">→</div>
            <div class="chain-node">
                <div class="node-icon"><i class="ri-lock-line"></i></div>
                <div class="node-label">[节点2]</div>
            </div>
            <div class="chain-arrow">→</div>
            <div class="chain-result">
                <i class="ri-skull-line"></i> [结果]
            </div>
        </div>
    </div>
    <div class="page-number">4</div>
</div>
```

---

## L06 · 表格页

展示对比数据或列表。

```html
<div class="page" data-page="5">
    <div class="content-wrapper">
        <div class="page-header">[页面标题]</div>
        <div class="diagram-container">
            <div class="diagram-title">[表格标题]</div>
            <table class="bypass-table">
                <thead>
                    <tr>
                        <th>[列1]</th>
                        <th>[列2]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>[数据]</td>
                        <td>[数据]</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="page-number">5</div>
</div>
```

---

## L07 · 数据统计页

网格卡片展示数据。

```html
<div class="page" data-page="6">
    <div class="content-wrapper">
        <div class="page-header">[页面标题]</div>
        <div class="impact-grid">
            <div class="impact-card">
                <div class="impact-label">[标签]</div>
                <div class="impact-num">[数字]</div>
                <div class="impact-label">[来源]</div>
            </div>
            <div class="impact-card">
                <div class="impact-label">[标签]</div>
                <div class="impact-num">[数字]</div>
                <div class="impact-label">[来源]</div>
            </div>
        </div>
    </div>
    <div class="page-number">6</div>
</div>
```

---

## L08 · 代码块页

展示代码或命令。

```html
<div class="page" data-page="7">
    <div class="content-wrapper">
        <div class="page-header">[页面标题]</div>
        <div class="diagram-container">
            <div class="diagram-title">[代码标题]</div>
            <div class="code-block">
                <span class="cmd">python3</span> <span class="arg">exploit.py</span>
            </div>
        </div>
        <div class="key-point-box" style="border-color: var(--accent-red);">
            <div class="box-title" style="color: var(--accent-red);"><i class="ri-alert-line"></i> [警告标题]</div>
            <div class="box-content">[警告内容]</div>
        </div>
    </div>
    <div class="page-number">7</div>
</div>
```

---

## L09 · 流程步骤页

步骤 + 箭头连接。

```html
<div class="page" data-page="8">
    <div class="content-wrapper">
        <div class="page-header">[页面标题]</div>
        <div class="flow-steps">
            <div class="flow-step">
                <span class="step-num">1</span> [步骤1]
            </div>
            <span class="flow-arrow">→</span>
            <div class="flow-step">
                <span class="step-num">2</span> [步骤2]
            </div>
            <span class="flow-arrow">→</span>
            <div class="flow-step">
                <span class="step-num">3</span> [步骤3]
            </div>
        </div>
    </div>
    <div class="page-number">8</div>
</div>
```

---

## L10 · 便签页

带浮动便签的内容页。

```html
<div class="page" data-page="9">
    <div class="content-wrapper">
        <div class="page-header">[页面标题]</div>
        <div class="sticky-note top-right">
            [便签内容]
        </div>
        <p class="handwriting">[正文内容]</p>
    </div>
    <div class="page-number">9</div>
</div>
```

---

## 翻页控制

Style B 使用 JavaScript 控制翻页：

```javascript
let currentPage = 0;
const totalPages = [总页数]; // 包括封面
const pages = document.querySelectorAll('.page');

function showPage(pageNum) {
    pages.forEach((page, index) => {
        page.classList.remove('active', 'flipped');
        if (index < pageNum) {
            page.classList.add('flipped');
        } else if (index === pageNum) {
            page.classList.add('active');
        }
    });
    currentPage = pageNum;
}

function nextPage() {
    if (currentPage < totalPages - 1) showPage(currentPage + 1);
}

function prevPage() {
    if (currentPage > 0) showPage(currentPage - 1);
}

// 封面点击翻页
document.querySelector('.page.cover').addEventListener('click', nextPage);

// 键盘翻页
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') nextPage();
    else if (e.key === 'ArrowLeft') prevPage();
});
```
