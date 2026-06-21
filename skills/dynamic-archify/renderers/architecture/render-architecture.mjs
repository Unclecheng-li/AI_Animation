import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, renderDefinitions, textUnits } from '../shared/utils.mjs';
import { loadDiagram, writeDiagram, svgRootAttrs } from '../shared/cli.mjs';
import {
  asArray,
  isFinitePoint,
  rectsOverlap,
  anchor,
  defaultFromSide,
  defaultToSide,
  chosenSide,
  polylinePath,
  roundedPath,
  labelPoint,
  componentFill,
  componentText,
  arrowClassMap,
  variantAccent,
} from '../shared/geometry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { diagram: arch, template, outPath } = loadDiagram({
  rendererDir: __dirname,
  diagramType: 'architecture',
  defaultExample: 'web-app.architecture.json',
});

const layout = {
  defaultW: 120,
  defaultH: 60,
  margin: 40,
  // Boundary padding — the 30/50 rule that was a hand-arithmetic footgun
  // (CHANGELOG v2.2.1): 30px on top/left/right, plus 20px extra at the bottom.
  boundaryPad: 30,
  boundaryExtraBottom: 20,
  legendH: 28,
};

// ---- Measure components from free coordinates --------------------------------
function measureComponent(c) {
  const [x, y] = Array.isArray(c.pos) ? c.pos : [NaN, NaN];
  const [w, h] = Array.isArray(c.size) ? c.size : [layout.defaultW, layout.defaultH];
  return { ...c, x, y, width: w, height: h, cx: x + w / 2, cy: y + h / 2 };
}

const components = new Map(asArray(arch.components).map((c) => [c.id, measureComponent(c)]));

// ---- Boundaries computed from the `wraps` id list ---------------------------
function boundaryRect(boundary) {
  const members = asArray(boundary.wraps).map((id) => components.get(id)).filter(Boolean);
  if (!members.length) return null;
  const minX = Math.min(...members.map((m) => m.x));
  const minY = Math.min(...members.map((m) => m.y));
  const maxX = Math.max(...members.map((m) => m.x + m.width));
  const maxY = Math.max(...members.map((m) => m.y + m.height));
  const pad = boundary.pad ?? layout.boundaryPad;
  return {
    ...boundary,
    x: minX - pad,
    y: minY - pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad + layout.boundaryExtraBottom,
  };
}

const boundaries = asArray(arch.boundaries).map(boundaryRect).filter(Boolean);

// ---- Auto viewBox: fit all geometry + a legend row --------------------------
function autoViewBox() {
  let maxX = 0;
  let maxY = 0;
  for (const c of components.values()) {
    maxX = Math.max(maxX, c.x + c.width);
    maxY = Math.max(maxY, c.y + c.height);
  }
  for (const b of boundaries) {
    maxX = Math.max(maxX, b.x + b.width);
    maxY = Math.max(maxY, b.y + b.height);
  }
  return [
    Math.ceil(maxX + layout.margin),
    Math.ceil(maxY + layout.margin + layout.legendH),
  ];
}

const viewBox = arch.meta?.viewBox || autoViewBox();
const legendY = () => viewBox[1] - 16;

// ---- Validation: mechanical correctness, never layout taste -----------------
function validateArchitecture() {
  const problems = [];
  if (arch.schema_version !== 1) problems.push('Architecture files must set "schema_version": 1.');
  if (arch.diagram_type !== 'architecture') problems.push('Architecture files must set "diagram_type": "architecture".');
  if (!arch.meta?.title) problems.push('Architecture files must include meta.title.');
  if (!Array.isArray(arch.components) || arch.components.length < 1) {
    problems.push('Architecture diagrams need at least one component.');
  }
  if (arch.connections !== undefined && !Array.isArray(arch.connections)) problems.push('Architecture "connections" must be an array.');
  if (arch.boundaries !== undefined && !Array.isArray(arch.boundaries)) problems.push('Architecture "boundaries" must be an array.');
  if (arch.cards !== undefined && !Array.isArray(arch.cards)) problems.push('Architecture "cards" must be an array.');
  if (components.size !== asArray(arch.components).length) problems.push('Component ids must be unique.');
  if (problems.length) {
    throw new Error(`Architecture layout validation failed:\n- ${problems.join('\n- ')}`);
  }

  for (const c of components.values()) {
    if (!isFinitePoint(c.x, c.y, c.width, c.height)) {
      problems.push(`Component "${c.id}" has non-finite pos/size — pos and size must be [number, number].`);
      continue;
    }
    if (c.x < 0 || c.y < 0 || c.x + c.width > viewBox[0] || c.y + c.height > viewBox[1]) {
      problems.push(`Component "${c.id}" falls outside the viewBox ${viewBox[0]}x${viewBox[1]} — adjust pos/size or set a larger meta.viewBox.`);
    }
    const estLabelW = textUnits(c.label) * 6.6;
    if (estLabelW > c.width + 8) {
      problems.push(`Label "${c.label}" (~${Math.round(estLabelW)}px) is wider than component "${c.id}" (${c.width}px) — shorten the label, move detail to sublabel, or widen size.`);
    }
  }

  // Component overlap — the highest-traffic hand-placement failure mode.
  const list = [...components.values()];
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      if (rectsOverlap(list[i], list[j], 8)) {
        problems.push(`Components "${list[i].id}" and "${list[j].id}" are less than 8px apart — move one or shrink its size.`);
      }
    }
  }

  // Boundaries: every wrapped id must exist; the computed box must stay in view.
  for (const boundary of asArray(arch.boundaries)) {
    for (const id of asArray(boundary.wraps)) {
      if (!components.has(id)) problems.push(`Boundary "${boundary.label}" wraps unknown component "${id}".`);
    }
  }
  for (const b of boundaries) {
    if (b.x < 0 || b.y < 0 || b.x + b.width > viewBox[0] || b.y + b.height > viewBox[1]) {
      problems.push(`Boundary "${b.label}" extends outside the viewBox — its members sit too close to the canvas edge; add margin or enlarge meta.viewBox.`);
    }
  }

  for (const conn of asArray(arch.connections)) {
    if (!components.has(conn.from)) problems.push(`Connection "${conn.label || conn.from}" references unknown source "${conn.from}".`);
    if (!components.has(conn.to)) problems.push(`Connection "${conn.label || conn.to}" references unknown target "${conn.to}".`);
    if (components.has(conn.from) && components.has(conn.to)) {
      const routed = pathFor(conn);
      const [start, end] = [routed.points[0], routed.points[routed.points.length - 1]];
      const distance = Math.hypot(end[0] - start[0], end[1] - start[1]);
      if (distance < 24) problems.push(`Connection "${conn.label || `${conn.from}->${conn.to}`}" is too short (${Math.round(distance)}px; minimum 24px) — place its components farther apart.`);
    }
  }

  // Connection labels must not land on top of components.
  const labelRects = [];
  for (const conn of asArray(arch.connections)) {
    if (!conn.label || !components.has(conn.from) || !components.has(conn.to)) continue;
    const [lx, ly] = labelPoint(conn, pathFor(conn).points);
    const w = Math.max(30, textUnits(conn.label) * 4.8 + 10);
    labelRects.push({ label: conn.label, x: lx - w / 2, y: ly - 10, width: w, height: 14 });
  }
  for (const rect of labelRects) {
    for (const c of components.values()) {
      if (rectsOverlap(rect, c, -2)) {
        problems.push(`Label "${rect.label}" overlaps component "${c.id}" — adjust labelDx/labelDy/labelSegment or set labelAt.`);
      }
    }
  }

  if (problems.length) {
    throw new Error(`Architecture layout validation failed:\n- ${problems.join('\n- ')}`);
  }
}

// ---- Connection routing ------------------------------------------------------
function routeVia(conn, from, to, start, end) {
  if (conn.via) return conn.via;
  switch (conn.route || 'auto') {
    case 'straight':
      return [];
    case 'orthogonal-h': {
      const midX = (start[0] + end[0]) / 2;
      return [[midX, start[1]], [midX, end[1]]];
    }
    case 'orthogonal-v': {
      const midY = (start[1] + end[1]) / 2;
      return [[start[0], midY], [end[0], midY]];
    }
    case 'auto':
    default: {
      // Direct line unless the anchors are clearly orthogonal-friendly.
      if (Math.abs(start[0] - end[0]) < 4 || Math.abs(start[1] - end[1]) < 4) return [];
      const midX = (start[0] + end[0]) / 2;
      return [[midX, start[1]], [midX, end[1]]];
    }
  }
}

const pathCache = new Map();
function pathFor(conn) {
  if (pathCache.has(conn)) return pathCache.get(conn);
  const from = components.get(conn.from);
  const to = components.get(conn.to);
  const start = anchor(from, chosenSide(conn.fromSide, defaultFromSide(from, to)));
  const end = anchor(to, chosenSide(conn.toSide, defaultToSide(from, to)));
  const points = [start, ...routeVia(conn, from, to, start, end), end];
  const routed = { d: roundedPath(points, 8), points };
  pathCache.set(conn, routed);
  return routed;
}

// ---- Rendering ---------------------------------------------------------------
function renderBoundary(b) {
  const cls = b.kind === 'security-group' ? 'c-security-group' : 'c-region';
  const labelCls = b.kind === 'security-group' ? 't-security' : 't-cloud';
  const rx = b.kind === 'security-group' ? 8 : 12;
  return `        <rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" rx="${rx}" class="${cls}" stroke-width="1"/>
        <text x="${b.x + 8}" y="${b.y + 18}" class="${labelCls}" font-size="9" font-weight="600">${esc(b.label)}</text>`;
}

function renderConnectionPath(conn) {
  const [cls, marker] = arrowClassMap[conn.variant || 'default'] || arrowClassMap.default;
  const routed = pathFor(conn);
  const strokeWidth = conn.width || (conn.variant === 'emphasis' ? 1.8 : 1.5);
  return `        <path d="${routed.d}" class="${cls}" stroke-width="${strokeWidth}" marker-end="url(#${marker})"/>`;
}

function renderConnectionLabel(conn) {
  if (!conn.label) return '';
  const [lx, ly] = labelPoint(conn, pathFor(conn).points);
  const w = Math.max(30, textUnits(conn.label) * 4.8 + 10);
  return `        <rect x="${lx - w / 2}" y="${ly - 10}" width="${w}" height="14" rx="3" class="c-mask"/>
        <text x="${lx}" y="${ly}" class="${variantAccent(conn.variant)}" font-size="8" text-anchor="middle">${esc(conn.label)}</text>`;
}

function renderComponent(c) {
  const fill = componentFill[c.type] || 'c-external';
  const accent = componentText[c.type] || 't-muted';
  const cx = c.cx;
  const hasSub = c.sublabel != null && c.sublabel !== '';
  const labelY = hasSub ? c.y + c.height / 2 - 2 : c.y + c.height / 2 + 4;
  const sub = hasSub
    ? `\n        <text x="${cx}" y="${c.y + c.height / 2 + 14}" class="t-muted" font-size="9" text-anchor="middle">${esc(c.sublabel)}</text>`
    : '';
  const tag = c.tag
    ? `\n        <text x="${cx}" y="${c.y + c.height - 8}" class="${accent}" font-size="7" text-anchor="middle">${esc(c.tag)}</text>`
    : '';
  return `        <rect x="${c.x}" y="${c.y}" width="${c.width}" height="${c.height}" rx="6" class="c-mask"/>
        <rect x="${c.x}" y="${c.y}" width="${c.width}" height="${c.height}" rx="6" class="${fill}" stroke-width="1.5"/>
        <text x="${cx}" y="${labelY}" class="t-primary" font-size="11" font-weight="600" text-anchor="middle">${esc(c.label)}</text>${sub}${tag}`;
}

// Auto legend: one swatch per component type actually used, left to right.
const TYPE_LABELS = {
  frontend: 'Frontend', backend: 'Backend', database: 'Database', cloud: 'Cloud',
  security: 'Security', messagebus: 'Message bus', external: 'External',
};
function renderLegend() {
  const used = [];
  const seen = new Set();
  for (const c of components.values()) {
    if (!seen.has(c.type)) { seen.add(c.type); used.push(c.type); }
  }
  const y = legendY();
  let x = layout.margin;
  const parts = [`        <text x="${x}" y="${y - 13}" class="t-primary" font-size="9" font-weight="600">Legend</text>`];
  for (const type of used) {
    parts.push(`        <rect x="${x}" y="${y - 8}" width="14" height="9" rx="2" class="${componentFill[type] || 'c-external'}" stroke-width="1"/>`);
    parts.push(`        <text x="${x + 20}" y="${y}" class="t-muted" font-size="8">${TYPE_LABELS[type] || type}</text>`);
    x += 30 + (textUnits(TYPE_LABELS[type] || type) * 5 + 28);
  }
  return parts.join('\n');
}

function renderAnimatedDot(conn, index) {
  const routed = pathFor(conn);
  const variant = conn.variant || 'default';
  let dotRadius, dotColor, dotOpacity, duration;

  switch (variant) {
    case 'emphasis':
      dotRadius = 3;
      dotColor = 'var(--arrow-emphasis)';
      dotOpacity = 0.9;
      duration = 2 + (index % 3) * 0.5;
      break;
    case 'security':
      dotRadius = 2;
      dotColor = 'var(--security-stroke)';
      dotOpacity = 0.7;
      duration = 2.5 + (index % 2) * 0.5;
      break;
    case 'dashed':
      dotRadius = 2;
      dotColor = 'var(--database-stroke)';
      dotOpacity = 0.7;
      duration = 2.2 + (index % 3) * 0.4;
      break;
    default: // default
      dotRadius = 2.5;
      dotColor = 'var(--arrow)';
      dotOpacity = 0.8;
      duration = 2.5 + (index % 4) * 0.3;
      break;
  }

  return `        <circle r="${dotRadius}" fill="${dotColor}" opacity="${dotOpacity}">
          <animateMotion dur="${duration}s" repeatCount="indefinite" path="${routed.d}"/>
        </circle>`;
}

function renderSvg() {
  const connections = asArray(arch.connections);
  return `      <svg viewBox="0 0 ${viewBox[0]} ${viewBox[1]}" ${svgRootAttrs(arch.meta, 'architecture diagram')}>
${renderDefinitions()}

        <!-- Background Grid -->
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- Boundaries (behind everything) -->
${boundaries.map(renderBoundary).join('\n\n')}

        <!-- Connection paths (before components for correct z-order) -->
${connections.map(renderConnectionPath).join('\n')}

        <!-- Animated flowing dots -->
${connections.map((conn, i) => renderAnimatedDot(conn, i)).join('\n')}

        <!-- Components -->
${[...components.values()].map(renderComponent).join('\n\n')}

        <!-- Connection labels -->
${connections.map(renderConnectionLabel).join('\n')}

        <!-- Legend -->
${renderLegend()}
      </svg>`;
}

validateArchitecture();
writeDiagram({
  outPath,
  template,
  meta: arch.meta,
  footerLabel: 'Architecture diagram',
  svg: renderSvg(),
  cards: arch.cards,
});
