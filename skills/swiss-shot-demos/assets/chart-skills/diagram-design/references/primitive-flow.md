# Flow Animation Template

**Purpose:** Add animated flow effects to connection lines for video presentations and dynamic demos.

## When to Use

- Video presentations requiring visual flow demonstration
- Architecture diagrams showing data/request flow
- Interactive demos where static lines feel lifeless

**Don't use for:**
- Static documentation or print-ready diagrams
- Diagrams with 12+ connections (visual noise)

---

## CORE CONSTRAINTS (MANDATORY)

### 1. Flow Direction

**RULE: Flow always moves FROM the non-arrow end TO the arrow end.**

| Arrow Direction | Path Example | Flow Class |
|---|---|---|
| → Right | `x1="100" x2="300"` | `flow-right` |
| ← Left | `x1="300" x2="100"` | `flow-left` |
| ↑ Up | `y1="300" y2="100"` | `flow-up` |
| ↓ Down | `y1="100" y2="300"` | `flow-down` |
| ↗ Right-up | diagonal | `flow-right-up` |
| ↘ Right-down | diagonal | `flow-right-down` |

### 2. Particle Limit

**RULE: Maximum 3 particles per diagram.**

Particles ONLY on these connections:
- **Entry point** — user/request enters system
- **Core processing** — key transformation/routing
- **Primary exit** — main API/service call

NO particles on:
- Authentication flows
- Secondary API calls
- Async/background operations
- Return/response paths

### 3. Animation Count

**RULE: Maximum 8 animated lines per diagram.**

---

## CSS TEMPLATE (Copy-paste ready)

Add this block inside `<style>` tag, after Diagram Design's existing styles:

```css
/* Flow animation - constraint: from non-arrow to arrow end */
@keyframes flow-right {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}

@keyframes flow-left {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 24; }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Direction classes */
.flow-right { stroke-dasharray: 8 4; animation: flow-right 1s linear infinite; }
.flow-left { stroke-dasharray: 8 4; animation: flow-left 1s linear infinite; }
.flow-up { stroke-dasharray: 8 4; animation: flow-right 1s linear infinite; }
.flow-down { stroke-dasharray: 4 3; animation: flow-right 1.5s linear infinite; }
.flow-right-down { stroke-dasharray: 8 4; animation: flow-right 1.2s linear infinite; }
.flow-right-up { stroke-dasharray: 8 4; animation: flow-right 1.2s linear infinite; }

/* Semantic classes */
.flow-link { stroke-dasharray: 10 5; animation: flow-right 1.2s linear infinite; }
.flow-accent { stroke-dasharray: 8 4; animation: flow-right 0.8s linear infinite; }

/* Particle effect */
.flow-particle { animation: pulse 2s ease-in-out infinite; }
```

---

## SVG TEMPLATE (Copy-paste ready)

### Diagram Design Style Example

```svg
<svg viewBox="0 0 960 520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#4f5d75"/>
    </marker>
    <marker id="arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#eb6c36"/>
    </marker>
    <marker id="arrow-link" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#2e5aa8"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="#f5f5f5"/>

  <!-- Connection lines with flow animation -->
  <!-- Constraint: flow FROM non-arrow TO arrow end -->
  <!-- Particles only on 3 key connections -->

  <!-- Entry: Developer → Gateway (向右 →) 【有粒子】 -->
  <line x1="140" y1="200" x2="252" y2="200" stroke="#2e5aa8" stroke-width="1.2" marker-end="url(#arrow-link)" class="flow-link"/>
  <rect x="156" y="188" width="68" height="14" rx="2" fill="#f5f5f5"/>
  <text x="190" y="199" fill="#2e5aa8" font-size="8" font-family="'Geist Mono', monospace" text-anchor="middle">HTTPS</text>
  <circle r="4" fill="#2e5aa8" class="flow-particle">
    <animateMotion dur="2s" repeatCount="indefinite" path="M140,200 L252,200"/>
  </circle>

  <!-- Gateway → Auth (向上 ↑) 【无粒子】 -->
  <line x1="310" y1="172" x2="310" y2="132" stroke="#4f5d75" stroke-width="1" marker-end="url(#arrow)" class="flow-up"/>
  <rect x="288" y="145" width="48" height="14" rx="2" fill="#f5f5f5"/>
  <text x="312" y="156" fill="#7a8399" font-size="8" font-family="'Geist Mono', monospace" text-anchor="middle">校验</text>

  <!-- Gateway → Transformer (向右 →) 【无粒子】 -->
  <line x1="380" y1="200" x2="440" y2="200" stroke="#4f5d75" stroke-width="1" marker-end="url(#arrow)" class="flow-right"/>

  <!-- Core: Transformer → Router (向上 ↑) 【有粒子】 -->
  <line x1="560" y1="172" x2="560" y2="148" stroke="#eb6c36" stroke-width="1.2" marker-end="url(#arrow-accent)" class="flow-accent"/>
  <rect x="536" y="153" width="52" height="14" rx="2" fill="#f5f5f5"/>
  <text x="562" y="164" fill="#eb6c36" font-size="8" font-family="'Geist Mono', monospace" text-anchor="middle">路由</text>
  <circle r="4" fill="#eb6c36" class="flow-particle">
    <animateMotion dur="1.2s" repeatCount="indefinite" path="M560,172 L560,148"/>
  </circle>

  <!-- Transformer → Pool (向下 ↓) 【无粒子】 -->
  <line x1="500" y1="232" x2="500" y2="280" stroke="rgba(45,49,66,0.30)" stroke-width="1" class="flow-down" marker-end="url(#arrow)"/>
  <rect x="476" y="248" width="52" height="14" rx="2" fill="#f5f5f5"/>
  <text x="502" y="259" fill="#7a8399" font-size="8" font-family="'Geist Mono', monospace" text-anchor="middle">密钥</text>

  <!-- Exit: Router → OpenAI (向右上 ↗) 【有粒子】 -->
  <line x1="640" y1="120" x2="760" y2="100" stroke="#eb6c36" stroke-width="1.2" marker-end="url(#arrow-accent)" class="flow-right-up"/>
  <circle r="4" fill="#eb6c36" class="flow-particle">
    <animateMotion dur="1.8s" repeatCount="indefinite" path="M640,120 L760,100"/>
  </circle>

  <!-- Router → Claude (向右 →) 【无粒子】 -->
  <line x1="640" y1="120" x2="760" y2="200" stroke="#4f5d75" stroke-width="1" marker-end="url(#arrow)" class="flow-right"/>

  <!-- Router → Gemini (向右下 ↘) 【无粒子】 -->
  <line x1="640" y1="120" x2="760" y2="300" stroke="#4f5d75" stroke-width="1" marker-end="url(#arrow)" class="flow-right-down"/>

  <!-- Gateway → Meter (向下 ↓) 【无粒子】 -->
  <line x1="310" y1="240" x2="310" y2="320" stroke="rgba(45,49,66,0.30)" stroke-width="1" class="flow-down" marker-end="url(#arrow)"/>
  <rect x="286" y="272" width="52" height="14" rx="2" fill="#f5f5f5"/>
  <text x="312" y="283" fill="#7a8399" font-size="8" font-family="'Geist Mono', monospace" text-anchor="middle">计费</text>

  <!-- Web → Meter (向右下 ↘) 【无粒子】 -->
  <line x1="140" y1="380" x2="252" y2="350" stroke="rgba(45,49,66,0.30)" stroke-width="1" class="flow-right-down" marker-end="url(#arrow)"/>
  <rect x="160" y="356" width="68" height="14" rx="2" fill="#f5f5f5"/>
  <text x="194" y="367" fill="#7a8399" font-size="8" font-family="'Geist Mono', monospace" text-anchor="middle">查询用量</text>
</svg>
```

---

## Speed Guidelines

| Connection Type | CSS Class | Animation Speed |
|---|---|---|
| Entry point (HTTPS) | `flow-link` | 1.2s |
| Core processing | `flow-accent` | 0.8s |
| API calls | `flow-right` | 1.0s |
| External services | `flow-right-up` / `flow-right-down` | 1.2s |
| Async operations | `flow-down` | 1.5s |
| Authentication | `flow-up` | 1.0s |

---

## Particle Color Rules

Use Diagram Design's color tokens:

| Component Type | Particle Fill | Token |
|---|---|---|
| Entry/External | `#2e5aa8` | link blue |
| Core/Backend | `#eb6c36` | accent coral |
| Cloud/API | `#eb6c36` | accent coral |
| Security | `rgba(235,108,54,0.8)` | accent variant |
| Async | `#4f5d75` | muted |

---

## Self-Review Checklist

Before delivering a diagram with flow animation:

- [ ] Flow direction matches arrow direction on ALL lines?
- [ ] Particles only on 1-3 key connections (entry, core, primary exit)?
- [ ] Total animated lines ≤ 8?
- [ ] Total particles ≤ 3?
- [ ] Particle `r` = 4 (not larger)?
- [ ] Arrow labels have opaque mask rects behind them?
- [ ] Using CSS classes, not inline styles for animation?

---

## Anti-patterns

| Anti-pattern | Why it fails |
|---|---|
| Particles on every line | Visual chaos, nothing stands out |
| Particles > r=5 | Too dominant, obscures labels |
| Flow opposite to arrow | Confusing, breaks mental model |
| More than 8 animated lines | Visual noise, poor performance |
| Animation on static docs | Distracting, can't screenshot |
| No mask rect on arrow labels | Text bleeds through lines |
