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
  labelPoint,
  componentFill,
  componentText,
  arrowClassMap,
  variantAccent
} from '../shared/geometry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { diagram: workflow, template, outPath } = loadDiagram({
  rendererDir: __dirname,
  diagramType: 'workflow',
  defaultExample: 'agent-tool-call.workflow.json'
});

const layout = {
  laneX: 40,
  laneY: 52,
  laneW: 640,
  laneH: 104,
  laneGap: 20,
  laneTitleH: 30,
  colXs: [88, 220, 300, 430, 500, 625],
  nodeW: 92,
  nodeH: 52
};

// Content is 680px wide (laneX + laneW); auto height fits the lanes plus legend.
const autoHeight = layout.laneY
  + (workflow.lanes?.length || 1) * layout.laneH
  + ((workflow.lanes?.length || 1) - 1) * layout.laneGap
  + 124;
const viewBox = workflow.meta?.viewBox || [720, autoHeight];

const laneIndex = new Map(asArray(workflow.lanes).map((lane, index) => [lane.id, index]));

function laneTop(id) {
  return layout.laneY + laneIndex.get(id) * (layout.laneH + layout.laneGap);
}

function lastLaneBottom() {
  return layout.laneY + workflow.lanes.length * layout.laneH + (workflow.lanes.length - 1) * layout.laneGap;
}

function legendY() {
  return lastLaneBottom() + 44;
}

function measureNode(node) {
  const width = node.width || layout.nodeW;
  const height = node.height || (node.tag ? 68 : layout.nodeH);
  const cx = layout.colXs[node.col];
  const contentH = layout.laneH - layout.laneTitleH;
  const y = laneTop(node.lane) + layout.laneTitleH + (contentH - height) / 2 + (node.yOffset || 0);
  return {
    ...node,
    width,
    height,
    x: cx - width / 2,
    y,
    cx,
    cy: y + height / 2
  };
}

const nodes = new Map(asArray(workflow.nodes).map((node) => [node.id, measureNode(node)]));

function validateWorkflow() {
  const problems = [];
  if (workflow.schema_version !== 1) {
    problems.push('Workflow files must set "schema_version": 1.');
  }
  if (workflow.diagram_type !== 'workflow') {
    problems.push(`Unsupported diagram_type "${workflow.diagram_type}". Expected "workflow".`);
  }
  if (!workflow.meta || !workflow.meta.title) {
    problems.push('Workflow files must include meta.title.');
  }
  if (!Array.isArray(workflow.lanes) || !workflow.lanes.length) {
    problems.push('Workflow files must include at least one lane.');
  }
  if (!Array.isArray(workflow.nodes)) {
    problems.push('Workflow files must include a nodes array.');
  }
  if (!Array.isArray(workflow.edges)) {
    problems.push('Workflow files must include an edges array.');
  }
  if (workflow.cards !== undefined && !Array.isArray(workflow.cards)) {
    problems.push('Workflow "cards" must be an array.');
  }
  if (problems.length) {
    throw new Error(`Workflow layout validation failed:\n- ${problems.join('\n- ')}`);
  }

  const laneIds = new Set(workflow.lanes.map((lane) => lane.id));
  if (laneIds.size !== workflow.lanes.length) {
    problems.push('Lane ids must be unique.');
  }
  if (nodes.size !== workflow.nodes.length) {
    problems.push('Node ids must be unique.');
  }

  for (const node of nodes.values()) {
    if (!laneIds.has(node.lane)) {
      problems.push(`Node "${node.id}" uses unknown lane "${node.lane}".`);
      continue;
    }
    if (!Number.isInteger(node.col) || node.col < 0 || node.col >= layout.colXs.length) {
      problems.push(`Node "${node.id}" uses column ${node.col}, but valid columns are integers 0..${layout.colXs.length - 1}.`);
      continue;
    }
    if (!isFinitePoint(node.x, node.y, node.cx, node.cy)) {
      problems.push(`Node "${node.id}" produced non-finite coordinates — check col, width, height, and yOffset are numbers.`);
      continue;
    }
    const estLabelW = textUnits(node.label) * 6.8;
    if (estLabelW > node.width + 6) {
      problems.push(`Label "${node.label}" (~${Math.round(estLabelW)}px) is wider than node "${node.id}" (${node.width}px) — shorten the label, move detail to sublabel, or increase node.width.`);
    }

    const top = laneTop(node.lane);
    const contentTop = top + layout.laneTitleH;
    const laneRight = layout.laneX + layout.laneW;
    if (node.x < layout.laneX || node.x + node.width > laneRight) {
      problems.push(`Node "${node.id}" exceeds the horizontal bounds of lane "${node.lane}".`);
    }
    if (node.y < contentTop || node.y + node.height > top + layout.laneH) {
      problems.push(`Node "${node.id}" collides with the title or boundary of lane "${node.lane}".`);
    }
  }

  const byLane = new Map();
  for (const node of nodes.values()) {
    byLane.set(node.lane, [...(byLane.get(node.lane) || []), node]);
  }
  for (const [lane, laneNodes] of byLane) {
    for (let i = 0; i < laneNodes.length; i += 1) {
      for (let j = i + 1; j < laneNodes.length; j += 1) {
        if (rectsOverlap(laneNodes[i], laneNodes[j], 8)) {
          problems.push(`Nodes "${laneNodes[i].id}" and "${laneNodes[j].id}" are less than 8px apart in lane "${lane}" — move one to another col, adjust yOffset, or reduce width/height.`);
        }
      }
    }
  }

  for (const edge of workflow.edges) {
    if (!nodes.has(edge.from)) problems.push(`Edge "${edge.label || edge.from}" references unknown source "${edge.from}".`);
    if (!nodes.has(edge.to)) problems.push(`Edge "${edge.label || edge.to}" references unknown target "${edge.to}".`);
    if (nodes.has(edge.from) && nodes.has(edge.to)) {
      const routed = pathFor(edge);
      if (routed.points.length === 2) {
        const [start, end] = routed.points;
        const segmentLength = Math.hypot(end[0] - start[0], end[1] - start[1]);
        if (segmentLength < 28) {
          problems.push(`Edge "${edge.from}" -> "${edge.to}" is too short (${Math.round(segmentLength)}px; minimum 28px) — drop its label or route it through a channel.`);
        }
      }
    }
  }

  const labelRects = [];
  for (const edge of workflow.edges) {
    if (!edge.label || !nodes.has(edge.from) || !nodes.has(edge.to)) continue;
    const [lx, ly] = labelPoint(edge, pathFor(edge).points);
    const width = Math.max(30, textUnits(edge.label) * 4.8 + 10);
    labelRects.push({ label: edge.label, x: lx - width / 2, y: ly - 10, width, height: 14 });
  }
  for (const rect of labelRects) {
    for (const node of nodes.values()) {
      if (rectsOverlap(rect, node, -2)) {
        problems.push(`Label "${rect.label}" overlaps node "${node.id}" — adjust labelDx/labelDy/labelSegment or set labelAt.`);
      }
    }
  }
  for (let i = 0; i < labelRects.length; i += 1) {
    for (let j = i + 1; j < labelRects.length; j += 1) {
      if (rectsOverlap(labelRects[i], labelRects[j], -2)) {
        problems.push(`Labels "${labelRects[i].label}" and "${labelRects[j].label}" overlap — adjust labelDx/labelDy or remove one label.`);
      }
    }
  }

  if (viewBox[0] < layout.laneX + layout.laneW + 16) {
    problems.push(`viewBox width ${viewBox[0]} clips the ${layout.laneW}px lanes — set meta.viewBox[0] to at least ${layout.laneX + layout.laneW + 16}.`);
  }
  if (legendY() + 18 > viewBox[1]) {
    problems.push(`Legend exceeds viewBox height ${viewBox[1]} — set meta.viewBox[1] to at least ${legendY() + 18}.`);
  }

  if (problems.length) {
    throw new Error(`Workflow layout validation failed:\n- ${problems.join('\n- ')}`);
  }
}

function gapYBetween(fromLane, toLane, bias = 0.5) {
  const a = laneTop(fromLane) + layout.laneH;
  const b = laneTop(toLane);
  return a + (b - a) * bias;
}

function routeVia(edge, from, to, start, end) {
  if (edge.via) return edge.via;
  switch (edge.route || 'auto') {
    case 'straight':
      return [];
    case 'drop': {
      const y = gapYBetween(from.lane, to.lane, edge.bias ?? 0.5);
      return [[start[0], y], [end[0], y]];
    }
    case 'outside-right': {
      const x = edge.channelX ?? layout.laneX + layout.laneW + 12;
      return [[x, start[1]], [x, end[1]]];
    }
    case 'return-left': {
      const x = edge.channelX ?? Math.min(from.x, to.x) - 28;
      return [[x, start[1]], [x, end[1]]];
    }
    case 'bottom-channel': {
      const y = edge.channelY ?? Math.max(from.y + from.height, to.y + to.height) + 32;
      return [[start[0], y], [end[0], y]];
    }
    case 'up-channel': {
      const y = edge.channelY ?? Math.min(from.y, to.y) - 28;
      return [[start[0], y], [end[0], y]];
    }
    case 'auto':
    default: {
      if (from.lane === to.lane) return [];
      const y = gapYBetween(from.lane, to.lane, edge.bias ?? 0.5);
      return [[start[0], y], [end[0], y]];
    }
  }
}

const pathCache = new Map();

function pathFor(edge) {
  if (pathCache.has(edge)) return pathCache.get(edge);
  const from = nodes.get(edge.from);
  const to = nodes.get(edge.to);
  const start = anchor(from, chosenSide(edge.fromSide, defaultFromSide(from, to)));
  const end = anchor(to, chosenSide(edge.toSide, defaultToSide(from, to)));
  const points = [start, ...routeVia(edge, from, to, start, end), end];
  const routed = { d: polylinePath(points), points };
  pathCache.set(edge, routed);
  return routed;
}

function renderLane(lane, index) {
  const y = layout.laneY + index * (layout.laneH + layout.laneGap);
  return `        <rect x="${layout.laneX}" y="${y}" width="${layout.laneW}" height="${layout.laneH}" rx="10" class="c-lane" stroke-width="1"/>
        <text x="${layout.laneX + 14}" y="${y + 22}" class="t-dim" font-size="10" font-weight="600">${String(index + 1).padStart(2, '0')} / ${esc(lane.label)}</text>`;
}

function renderNode(node) {
  const fill = componentFill[node.type] || 'c-external';
  const accent = componentText[node.type] || 't-muted';
  const tag = node.tag
    ? `\n        <text x="${node.cx}" y="${node.y + node.height - 12}" class="${accent}" font-size="7" text-anchor="middle">${esc(node.tag)}</text>`
    : '';
  return `        <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="6" class="c-mask"/>
        <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="6" class="${fill}" stroke-width="1.5"/>
        <text x="${node.cx}" y="${node.y + 21}" class="t-primary" font-size="11" font-weight="600" text-anchor="middle">${esc(node.label)}</text>
        <text x="${node.cx}" y="${node.y + 38}" class="t-muted" font-size="8" text-anchor="middle">${esc(node.sublabel || '')}</text>${tag}`;
}

function renderEdgePath(edge) {
  const [cls, marker] = arrowClassMap[edge.variant || 'default'] || arrowClassMap.default;
  const routed = pathFor(edge);
  const strokeWidth = edge.width || (edge.variant === 'emphasis' ? 1.8 : 1.4);
  return `        <path d="${routed.d}" class="${cls}" stroke-width="${strokeWidth}" marker-end="url(#${marker})"/>`;
}

function renderEdgeLabel(edge) {
  if (!edge.label) return '';
  const routed = pathFor(edge);
  const [lx, ly] = labelPoint(edge, routed.points);
  const labelW = Math.max(30, textUnits(edge.label) * 4.8 + 10);
  return `        <rect x="${lx - labelW / 2}" y="${ly - 10}" width="${labelW}" height="14" rx="3" class="c-mask"/>
        <text x="${lx}" y="${ly}" class="${variantAccent(edge.variant, { dashed: 't-database' })}" font-size="8" text-anchor="middle">${esc(edge.label)}</text>`;
}

function renderLegend() {
  const y = legendY();
  return `        <text x="175" y="${y - 20}" class="t-primary" font-size="10" font-weight="600">Legend</text>
        <rect x="175" y="${y - 8}" width="14" height="9" rx="2" class="c-frontend" stroke-width="1"/>
        <text x="195" y="${y}" class="t-muted" font-size="7">User UI</text>
        <rect x="260" y="${y - 8}" width="14" height="9" rx="2" class="c-backend" stroke-width="1"/>
        <text x="280" y="${y}" class="t-muted" font-size="7">Agent logic</text>
        <rect x="370" y="${y - 8}" width="14" height="9" rx="2" class="c-security" stroke-width="1"/>
        <text x="390" y="${y}" class="t-muted" font-size="7">Policy</text>
        <rect x="455" y="${y - 8}" width="14" height="9" rx="2" class="c-messagebus" stroke-width="1"/>
        <text x="475" y="${y}" class="t-muted" font-size="7">Tool action</text>
        <rect x="565" y="${y - 8}" width="14" height="9" rx="2" class="c-database" stroke-width="1"/>
        <text x="585" y="${y}" class="t-muted" font-size="7">Context / trace</text>`;
}

function renderAnimatedDot(edge, index) {
  const routed = pathFor(edge);
  const variant = edge.variant || 'default';
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
  const edges = workflow.edges;
  return `      <svg viewBox="0 0 ${viewBox[0]} ${viewBox[1]}" ${svgRootAttrs(workflow.meta, 'workflow diagram')}>
${renderDefinitions()}

        <!-- Background Grid -->
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- Swimlanes -->
${workflow.lanes.map(renderLane).join('\n\n')}

        <!-- Edge paths -->
${edges.map(renderEdgePath).join('\n')}

        <!-- Animated flowing dots -->
${edges.map((edge, i) => renderAnimatedDot(edge, i)).join('\n')}

        <!-- Nodes -->
${[...nodes.values()].map(renderNode).join('\n\n')}

        <!-- Edge labels -->
${edges.map(renderEdgeLabel).join('\n')}

        <!-- Legend -->
${renderLegend()}
      </svg>`;
}

validateWorkflow();
writeDiagram({
  outPath,
  template,
  meta: workflow.meta,
  footerLabel: 'Workflow diagram',
  svg: renderSvg(),
  cards: workflow.cards,
});
