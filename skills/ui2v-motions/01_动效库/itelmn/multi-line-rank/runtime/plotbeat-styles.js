(function installPlotbeatStyles(global) {
  "use strict";

  const PRESETS = Object.freeze({
    "signal-noir": Object.freeze({
      id: "signal-noir",
      name: "Signal Noir",
      theme: "dark",
      background: "#090d0b",
      surface: "#121815",
      foreground: "#f1f3ec",
      muted: "#99a097",
      grid: "#29312b",
      accent: "#a9e907",
      accentSoft: "#f0b64b",
      accentText: "#a9e907",
      accentInk: "#071006",
      border: "#445047",
      overlay: "rgba(9, 13, 11, 0.82)",
      display: "Inter, Arial, sans-serif",
      body: "Inter, Arial, sans-serif",
      radius: "2px",
      panelShadow: "none",
      atmosphere: "radial-gradient(circle at 78% 18%, rgba(169, 233, 7, 0.16) 0%, rgba(169, 233, 7, 0.04) 34%, transparent 62%)",
    }),
    "paper-cut": Object.freeze({
      id: "paper-cut",
      name: "Paper Cut",
      theme: "light",
      background: "#f6e6b7",
      surface: "#fff5d6",
      foreground: "#18243a",
      muted: "#665f51",
      grid: "#d8c38d",
      accent: "#2454d6",
      accentSoft: "#ef6a4b",
      accentText: "#2454d6",
      accentInk: "#fff8e5",
      border: "#18243a",
      overlay: "rgba(246, 230, 183, 0.88)",
      display: "'Archivo Black', Montserrat, sans-serif",
      body: "Montserrat, Arial, sans-serif",
      radius: "4px",
      panelShadow: "8px 8px 0 #18243a",
      atmosphere: "repeating-linear-gradient(135deg, rgba(36, 84, 214, 0.12) 0 3px, transparent 3px 26px)",
    }),
    "studio-blueprint": Object.freeze({
      id: "studio-blueprint",
      name: "Studio Blueprint",
      theme: "dark",
      background: "#0d2032",
      surface: "#142a3e",
      foreground: "#edf2f2",
      muted: "#9aafb9",
      grid: "#355064",
      accent: "#53c6cf",
      accentSoft: "#f1a35d",
      accentText: "#53c6cf",
      accentInk: "#041725",
      border: "#6fb8bf",
      overlay: "rgba(13, 32, 50, 0.86)",
      display: "'JetBrains Mono', Consolas, monospace",
      body: "'JetBrains Mono', Consolas, monospace",
      radius: "0px",
      panelShadow: "inset 0 0 0 1px rgba(83, 198, 207, 0.16)",
      atmosphere: "linear-gradient(rgba(83, 198, 207, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(83, 198, 207, 0.08) 1px, transparent 1px)",
    }),
    "velvet-ledger": Object.freeze({
      id: "velvet-ledger",
      name: "Velvet Ledger",
      theme: "dark",
      background: "#12100d",
      surface: "#1c1813",
      foreground: "#eee5d4",
      muted: "#a19785",
      grid: "#393126",
      accent: "#c8a96b",
      accentSoft: "#93445b",
      accentText: "#ddc28b",
      accentInk: "#17120b",
      border: "#5a4b36",
      overlay: "rgba(18, 16, 13, 0.88)",
      display: "Georgia, 'Times New Roman', serif",
      body: "Arial, sans-serif",
      radius: "0px",
      panelShadow: "none",
      atmosphere: "repeating-linear-gradient(90deg, transparent 0 119px, rgba(200, 169, 107, 0.055) 119px 120px)",
    }),
    "ember-terminal": Object.freeze({
      id: "ember-terminal",
      name: "Ember Terminal",
      theme: "dark",
      background: "#15130f",
      surface: "#201d16",
      foreground: "#f0e8d2",
      muted: "#aaa187",
      grid: "#3d382b",
      accent: "#f2ad3d",
      accentSoft: "#d75a38",
      accentText: "#f2ad3d",
      accentInk: "#181208",
      border: "#6f6248",
      overlay: "rgba(21, 19, 15, 0.88)",
      display: "'JetBrains Mono', Consolas, monospace",
      body: "'JetBrains Mono', Consolas, monospace",
      radius: "0px",
      panelShadow: "none",
      atmosphere: "repeating-linear-gradient(0deg, rgba(242, 173, 61, 0.045) 0 1px, transparent 1px 7px)",
    }),
    "newsroom-ink": Object.freeze({
      id: "newsroom-ink",
      name: "Newsroom Ink",
      theme: "light",
      background: "#f7f4ea",
      surface: "#fffdf7",
      foreground: "#161514",
      muted: "#69645d",
      grid: "#d6d0c4",
      accent: "#191817",
      accentSoft: "#c52228",
      accentText: "#b32126",
      accentInk: "#fffdf7",
      border: "#292724",
      overlay: "rgba(247, 244, 234, 0.92)",
      display: "Georgia, 'Times New Roman', serif",
      body: "'IBM Plex Mono', monospace",
      radius: "0px",
      panelShadow: "none",
      atmosphere: "repeating-linear-gradient(0deg, transparent 0 39px, rgba(22, 21, 20, 0.075) 39px 40px)",
    }),
    "swiss-signal": Object.freeze({
      id: "swiss-signal",
      name: "Swiss Signal",
      theme: "light",
      background: "#f4f2e9",
      surface: "#fffefa",
      foreground: "#0a0a0a",
      muted: "#4b4b49",
      grid: "#c7c3b8",
      accent: "#164ed8",
      accentSoft: "#e83225",
      accentText: "#c9211a",
      accentInk: "#fffdf8",
      border: "#0a0a0a",
      overlay: "rgba(244, 242, 233, 0.92)",
      display: "Montserrat, Helvetica, Arial, sans-serif",
      body: "'IBM Plex Mono', monospace",
      radius: "0px",
      panelShadow: "none",
      atmosphere: "linear-gradient(rgba(10, 10, 10, 0.075) 1px, transparent 1px), linear-gradient(90deg, rgba(10, 10, 10, 0.075) 1px, transparent 1px)",
    }),
    "soft-organic": Object.freeze({
      id: "soft-organic",
      name: "Soft Organic",
      theme: "light",
      background: "#eee8dc",
      surface: "#f8f3e9",
      foreground: "#24372d",
      muted: "#5f6962",
      grid: "#c9c4b7",
      accent: "#356b59",
      accentSoft: "#cf7651",
      accentText: "#2f604f",
      accentInk: "#f8f3e9",
      border: "#87978b",
      overlay: "rgba(238, 232, 220, 0.88)",
      display: "Georgia, 'Times New Roman', serif",
      body: "Arial, sans-serif",
      radius: "24px",
      panelShadow: "0 14px 34px rgba(36, 55, 45, 0.11)",
      atmosphere: "repeating-radial-gradient(circle at 84% 18%, transparent 0 42px, rgba(53, 107, 89, 0.08) 43px 44px)",
    }),
  });

  const SHARED_CSS = `
    html[data-plotbeat-style] body {
      background: var(--pb-bg) !important;
      color: var(--pb-fg) !important;
      font-family: var(--pb-font-body) !important;
    }
    html[data-plotbeat-style] #root,
    html[data-plotbeat-style] #bcr-root,
    html[data-plotbeat-style] #plotbeat-scene {
      color: var(--pb-fg) !important;
      font-family: var(--pb-font-body) !important;
    }
    html[data-plotbeat-style] .scene-fill,
    html[data-plotbeat-style] #bcr-bg,
    html[data-plotbeat-style] .transition-panel,
    html[data-plotbeat-style] #cover-panel,
    html[data-plotbeat-style] #transition-top,
    html[data-plotbeat-style] #transition-bottom {
      background: var(--pb-bg) !important;
    }
    html[data-plotbeat-style] #chart-title,
    html[data-plotbeat-style] #multi-chart-title,
    html[data-plotbeat-style] #stack-title,
    html[data-plotbeat-style] #bcr-title,
    html[data-plotbeat-style] .pb-header h1,
    html[data-plotbeat-style] #finale-value,
    html[data-plotbeat-style] #multi-finale-heading {
      font-family: var(--pb-font-display) !important;
    }
    html[data-plotbeat-style] #transition-seam {
      background: linear-gradient(90deg, transparent, var(--pb-accent) 24%, var(--pb-accent-soft) 50%, var(--pb-accent) 76%, transparent) !important;
      box-shadow: 0 0 22px color-mix(in srgb, var(--pb-accent) 48%, transparent) !important;
    }
    html[data-plotbeat-style] #ambient-glow,
    html[data-plotbeat-style] #multi-ambient-glow,
    html[data-plotbeat-style] .ambient,
    html[data-plotbeat-style] .pb-ambient {
      background: var(--pb-atmosphere) !important;
      background-size: 44px 44px !important;
    }
    html[data-plotbeat-style] #finale-lockup,
    html[data-plotbeat-style] #multi-finale {
      background: var(--pb-overlay) !important;
    }
    html[data-plotbeat-style] #chart-source,
    html[data-plotbeat-style] #multi-chart-source,
    html[data-plotbeat-style] #source-label,
    html[data-plotbeat-style] #bcr-source,
    html[data-plotbeat-style] .pb-footer,
    html[data-plotbeat-style] #bcr-subtitle,
    html[data-plotbeat-style] #bcr-period-caption,
    html[data-plotbeat-style] .bcr-tick-label,
    html[data-plotbeat-style] .ranking-heading,
    html[data-plotbeat-style] .panel-kicker,
    html[data-plotbeat-style] .mix-number small,
    html[data-plotbeat-style] .pb-milestone p,
    html[data-plotbeat-style] .pb-kpi-card small,
    html[data-plotbeat-style] .pb-kpi-card p,
    html[data-plotbeat-style] .pb-kpi-card > div:first-child {
      color: var(--pb-muted) !important;
    }
    html[data-plotbeat-style] .grid-row line,
    html[data-plotbeat-style] .multi-grid-row line,
    html[data-plotbeat-style] .grid-line,
    html[data-plotbeat-style] .pb-grid {
      stroke: var(--pb-grid) !important;
    }
    html[data-plotbeat-style] .grid-row text,
    html[data-plotbeat-style] .multi-grid-row text,
    html[data-plotbeat-style] .grid-label,
    html[data-plotbeat-style] .date-label,
    html[data-plotbeat-style] .x-label,
    html[data-plotbeat-style] .pb-axis-caption {
      fill: var(--pb-muted) !important;
    }
    html[data-plotbeat-style] #mix-panel,
    html[data-plotbeat-style] .pb-plot-shell,
    html[data-plotbeat-style] .pb-side-rail,
    html[data-plotbeat-style] .pb-map-shell,
    html[data-plotbeat-style] .pb-kpi-card,
    html[data-plotbeat-style] .pb-timeline-shell,
    html[data-plotbeat-style] .pb-timeline-chapters .pb-milestone,
    html[data-plotbeat-style] .pb-map-caption,
    html[data-plotbeat-style] .pb-timeline-live {
      border-color: var(--pb-border) !important;
      border-radius: var(--pb-radius) !important;
      background: var(--pb-surface) !important;
      box-shadow: var(--pb-panel-shadow) !important;
    }
    html[data-plotbeat-style] .bcr-name,
    html[data-plotbeat-style] .bcr-value {
      background: var(--pb-bg) !important;
      color: var(--pb-fg) !important;
    }
    html[data-plotbeat-style] .bcr-tick-line,
    html[data-plotbeat-style] .pb-rail-row,
    html[data-plotbeat-style] .mix-track,
    html[data-plotbeat-style] .pb-kpi-track,
    html[data-plotbeat-style] .pb-timeline-line {
      border-color: var(--pb-grid) !important;
      background: var(--pb-grid) !important;
    }
    html[data-plotbeat-style] .pb-land path {
      fill: color-mix(in srgb, var(--pb-surface) 82%, var(--pb-accent) 18%) !important;
      stroke: var(--pb-border) !important;
    }
    html[data-plotbeat-style] .pb-map-label { fill: var(--pb-fg) !important; }
    html[data-plotbeat-style] .pb-point,
    html[data-plotbeat-style] .pb-map-point,
    html[data-plotbeat-style] .pb-milestone > i,
    html[data-plotbeat-style] .pb-timeline-line > span {
      stroke: var(--pb-bg) !important;
      border-color: var(--pb-bg) !important;
    }
    html[data-plotbeat-style] .pb-mode {
      border-color: var(--pb-border) !important;
      border-radius: var(--pb-radius) !important;
      color: var(--pb-fg) !important;
    }
    html[data-plotbeat-style] .pb-header p,
    html[data-plotbeat-style] .pb-rail-row span,
    html[data-plotbeat-style] .pb-footer b,
    html[data-plotbeat-style] .pb-map-caption b,
    html[data-plotbeat-style] .pb-kpi-card > b,
    html[data-plotbeat-style] .pb-milestone time,
    html[data-plotbeat-style] .pb-timeline-live time,
    html[data-plotbeat-style] .footer-mark,
    html[data-plotbeat-style] #mix-total,
    html[data-plotbeat-style] #finish-chip {
      color: var(--pb-accent-text) !important;
    }
    html[data-plotbeat-style="paper-cut"] .pb-rail-row span {
      color: #261f1a !important;
    }
    html[data-plotbeat-style] .pb-live-chip,
    html[data-plotbeat-style] .pb-kpi-summary,
    html[data-plotbeat-style] #date-chip,
    html[data-plotbeat-style] .date-chip {
      background: var(--pb-accent) !important;
      fill: var(--pb-accent) !important;
      color: var(--pb-accent-ink) !important;
    }
    html[data-plotbeat-style] #x-date-end,
    html[data-plotbeat-style] #multi-x-end {
      fill: var(--pb-accent-ink) !important;
    }
    html[data-plotbeat-style] #series-area + path,
    html[data-plotbeat-style] #series-line,
    html[data-plotbeat-style] #series-glow,
    html[data-plotbeat-style] #top-line,
    html[data-plotbeat-style] #live-line,
    html[data-plotbeat-style] .pb-map-link {
      stroke: var(--pb-accent) !important;
    }
    html[data-plotbeat-style] #area-gradient stop:first-child { stop-color: var(--pb-accent) !important; }
    html[data-plotbeat-style] #area-gradient stop:nth-child(2) { stop-color: var(--pb-accent-soft) !important; }
    html[data-plotbeat-style] #series-endpoint,
    html[data-plotbeat-style] #series-endpoint-halo,
    html[data-plotbeat-style] #stack-endpoint,
    html[data-plotbeat-style] #stack-endpoint-halo {
      fill: var(--pb-accent) !important;
    }
    html[data-plotbeat-style="paper-cut"] #chart-title,
    html[data-plotbeat-style="paper-cut"] #multi-chart-title,
    html[data-plotbeat-style="paper-cut"] .ranking-row {
      font-style: normal !important;
    }
    html[data-plotbeat-style="signal-noir"] #chart-title,
    html[data-plotbeat-style="studio-blueprint"] #chart-title,
    html[data-plotbeat-style="ember-terminal"] #chart-title,
    html[data-plotbeat-style="newsroom-ink"] #chart-title,
    html[data-plotbeat-style="swiss-signal"] #chart-title,
    html[data-plotbeat-style="soft-organic"] #chart-title {
      font-style: normal !important;
    }
    html[data-plotbeat-style="paper-cut"] #series-line,
    html[data-plotbeat-style="paper-cut"] .multi-line-path,
    html[data-plotbeat-style="paper-cut"] #top-line,
    html[data-plotbeat-style="paper-cut"] .pb-scatter-path {
      stroke-width: 7px !important;
    }
    html[data-plotbeat-style="paper-cut"] #chart-title {
      top: 38px !important;
      left: 360px !important;
      width: 1200px !important;
      padding: 14px 24px 18px !important;
      border: 4px solid var(--pb-border) !important;
      background: var(--pb-surface) !important;
      box-shadow: 9px 9px 0 var(--pb-accent-soft) !important;
      font-size: 48px !important;
      line-height: 1 !important;
      text-align: center !important;
    }
    html[data-plotbeat-style="paper-cut"] #live-readout {
      top: 146px !important;
      right: 64px !important;
      padding: 16px 18px !important;
      border: 4px solid var(--pb-border) !important;
      background: var(--pb-surface) !important;
      box-shadow: 7px 7px 0 var(--pb-accent-soft) !important;
    }
    html[data-plotbeat-style="paper-cut"] .grid-row line {
      stroke-dasharray: 12 10 !important;
    }
    html[data-plotbeat-style="paper-cut"] .pb-kpi-card,
    html[data-plotbeat-style="paper-cut"] .pb-timeline-chapters .pb-milestone {
      transform-origin: 50% 50%;
    }
    html[data-plotbeat-style="studio-blueprint"] #chart-title,
    html[data-plotbeat-style="studio-blueprint"] #multi-chart-title,
    html[data-plotbeat-style="studio-blueprint"] #stack-title,
    html[data-plotbeat-style="studio-blueprint"] #bcr-title,
    html[data-plotbeat-style="studio-blueprint"] .pb-header h1 {
      text-transform: uppercase;
      letter-spacing: -0.035em !important;
    }
    html[data-plotbeat-style="studio-blueprint"] #mix-panel,
    html[data-plotbeat-style="studio-blueprint"] .pb-plot-shell,
    html[data-plotbeat-style="studio-blueprint"] .pb-side-rail,
    html[data-plotbeat-style="studio-blueprint"] .pb-map-shell,
    html[data-plotbeat-style="studio-blueprint"] .pb-kpi-card,
    html[data-plotbeat-style="studio-blueprint"] .pb-timeline-shell {
      border-style: dashed !important;
    }
    html[data-plotbeat-style="studio-blueprint"] #chart-title,
    html[data-plotbeat-style="ember-terminal"] #chart-title,
    html[data-plotbeat-style="newsroom-ink"] #chart-title,
    html[data-plotbeat-style="swiss-signal"] #chart-title {
      left: 72px !important;
      width: 1240px !important;
      text-align: left !important;
      font-size: 54px !important;
    }
    html[data-plotbeat-style="velvet-ledger"] #chart-title,
    html[data-plotbeat-style="velvet-ledger"] #multi-chart-title,
    html[data-plotbeat-style="velvet-ledger"] #stack-title,
    html[data-plotbeat-style="velvet-ledger"] #bcr-title,
    html[data-plotbeat-style="velvet-ledger"] .pb-header h1 {
      font-weight: 400 !important;
      letter-spacing: -0.035em !important;
    }
    html[data-plotbeat-style="velvet-ledger"] #series-line,
    html[data-plotbeat-style="velvet-ledger"] .multi-line-path,
    html[data-plotbeat-style="velvet-ledger"] #top-line,
    html[data-plotbeat-style="velvet-ledger"] .pb-scatter-path {
      stroke-width: 4px !important;
      filter: none !important;
    }
    html[data-plotbeat-style="velvet-ledger"] #mix-panel,
    html[data-plotbeat-style="velvet-ledger"] .pb-plot-shell,
    html[data-plotbeat-style="velvet-ledger"] .pb-side-rail,
    html[data-plotbeat-style="velvet-ledger"] .pb-map-shell,
    html[data-plotbeat-style="velvet-ledger"] .pb-kpi-card,
    html[data-plotbeat-style="velvet-ledger"] .pb-timeline-shell {
      background: transparent !important;
      border-width: 1px !important;
    }
    html[data-plotbeat-style="ember-terminal"] #chart-title,
    html[data-plotbeat-style="ember-terminal"] #multi-chart-title,
    html[data-plotbeat-style="ember-terminal"] #stack-title,
    html[data-plotbeat-style="ember-terminal"] #bcr-title,
    html[data-plotbeat-style="ember-terminal"] .pb-header h1 {
      text-transform: uppercase;
      letter-spacing: -0.055em !important;
      font-weight: 800 !important;
    }
    html[data-plotbeat-style="ember-terminal"] #series-line,
    html[data-plotbeat-style="ember-terminal"] .multi-line-path,
    html[data-plotbeat-style="ember-terminal"] #top-line,
    html[data-plotbeat-style="ember-terminal"] .pb-scatter-path {
      stroke-width: 4px !important;
      filter: none !important;
    }
    html[data-plotbeat-style="newsroom-ink"] #chart-title,
    html[data-plotbeat-style="newsroom-ink"] #multi-chart-title,
    html[data-plotbeat-style="newsroom-ink"] #stack-title,
    html[data-plotbeat-style="newsroom-ink"] #bcr-title,
    html[data-plotbeat-style="newsroom-ink"] .pb-header h1 {
      font-weight: 700 !important;
      letter-spacing: -0.04em !important;
    }
    html[data-plotbeat-style="newsroom-ink"] #series-line,
    html[data-plotbeat-style="newsroom-ink"] .multi-line-path,
    html[data-plotbeat-style="newsroom-ink"] #top-line,
    html[data-plotbeat-style="newsroom-ink"] .pb-scatter-path {
      stroke-width: 5px !important;
      filter: none !important;
    }
    html[data-plotbeat-style="newsroom-ink"] #mix-panel,
    html[data-plotbeat-style="newsroom-ink"] .pb-plot-shell,
    html[data-plotbeat-style="newsroom-ink"] .pb-side-rail,
    html[data-plotbeat-style="newsroom-ink"] .pb-map-shell,
    html[data-plotbeat-style="newsroom-ink"] .pb-kpi-card,
    html[data-plotbeat-style="newsroom-ink"] .pb-timeline-shell {
      box-shadow: none !important;
      border-left: 0 !important;
      border-right: 0 !important;
    }
    html[data-plotbeat-style="newsroom-ink"] #chart-title {
      top: 34px !important;
      padding-bottom: 16px !important;
      border-bottom: 5px solid var(--pb-accent-soft) !important;
      font-size: 62px !important;
    }
    html[data-plotbeat-style="newsroom-ink"] #live-readout {
      top: 134px !important;
      padding-top: 14px !important;
      border-top: 8px solid var(--pb-accent-soft) !important;
    }
    html[data-plotbeat-style="newsroom-ink"] #live-change {
      color: var(--pb-accent-soft) !important;
    }
    html[data-plotbeat-style="newsroom-ink"] .grid-row line {
      stroke-dasharray: 3 9 !important;
    }
    html[data-plotbeat-style="swiss-signal"] #chart-title,
    html[data-plotbeat-style="swiss-signal"] #multi-chart-title,
    html[data-plotbeat-style="swiss-signal"] #stack-title,
    html[data-plotbeat-style="swiss-signal"] #bcr-title,
    html[data-plotbeat-style="swiss-signal"] .pb-header h1 {
      text-transform: uppercase;
      font-weight: 800 !important;
      letter-spacing: -0.075em !important;
    }
    html[data-plotbeat-style="swiss-signal"] #series-line,
    html[data-plotbeat-style="swiss-signal"] .multi-line-path,
    html[data-plotbeat-style="swiss-signal"] #top-line,
    html[data-plotbeat-style="swiss-signal"] .pb-scatter-path {
      stroke-width: 7px !important;
      filter: none !important;
    }
    html[data-plotbeat-style="swiss-signal"] #mix-panel,
    html[data-plotbeat-style="swiss-signal"] .pb-plot-shell,
    html[data-plotbeat-style="swiss-signal"] .pb-side-rail,
    html[data-plotbeat-style="swiss-signal"] .pb-map-shell,
    html[data-plotbeat-style="swiss-signal"] .pb-kpi-card,
    html[data-plotbeat-style="swiss-signal"] .pb-timeline-shell {
      border-width: 2px !important;
    }
    html[data-plotbeat-style="swiss-signal"] #chart-title {
      top: 28px !important;
      width: 1120px !important;
      padding: 15px 22px 17px !important;
      background: var(--pb-accent-soft) !important;
      color: var(--pb-accent-ink) !important;
      font-size: 47px !important;
      line-height: 1 !important;
    }
    html[data-plotbeat-style="swiss-signal"] #chart-title-accent {
      color: var(--pb-accent-ink) !important;
    }
    html[data-plotbeat-style="swiss-signal"] #live-readout {
      top: 140px !important;
      padding-left: 22px !important;
      border-left: 14px solid var(--pb-accent-soft) !important;
    }
    html[data-plotbeat-style="soft-organic"] #chart-title,
    html[data-plotbeat-style="soft-organic"] #multi-chart-title,
    html[data-plotbeat-style="soft-organic"] #stack-title,
    html[data-plotbeat-style="soft-organic"] #bcr-title,
    html[data-plotbeat-style="soft-organic"] .pb-header h1 {
      font-weight: 400 !important;
      letter-spacing: -0.035em !important;
    }
    html[data-plotbeat-style="soft-organic"] #series-line,
    html[data-plotbeat-style="soft-organic"] .multi-line-path,
    html[data-plotbeat-style="soft-organic"] #top-line,
    html[data-plotbeat-style="soft-organic"] .pb-scatter-path {
      stroke-width: 8px !important;
      stroke-linecap: round !important;
      filter: none !important;
    }
    html[data-plotbeat-style="soft-organic"] #mix-panel,
    html[data-plotbeat-style="soft-organic"] .pb-plot-shell,
    html[data-plotbeat-style="soft-organic"] .pb-side-rail,
    html[data-plotbeat-style="soft-organic"] .pb-map-shell,
    html[data-plotbeat-style="soft-organic"] .pb-kpi-card,
    html[data-plotbeat-style="soft-organic"] .pb-timeline-shell {
      border-width: 1px !important;
    }
    html[data-plotbeat-style="velvet-ledger"] #series-glow,
    html[data-plotbeat-style="ember-terminal"] #series-glow,
    html[data-plotbeat-style="paper-cut"] #series-glow,
    html[data-plotbeat-style="newsroom-ink"] #series-glow,
    html[data-plotbeat-style="swiss-signal"] #series-glow,
    html[data-plotbeat-style="soft-organic"] #series-glow {
      opacity: 0 !important;
      filter: none !important;
    }
    html[data-plotbeat-style="velvet-ledger"] .live-value-row,
    html[data-plotbeat-style="ember-terminal"] .live-value-row,
    html[data-plotbeat-style="paper-cut"] .live-value-row,
    html[data-plotbeat-style="newsroom-ink"] .live-value-row,
    html[data-plotbeat-style="swiss-signal"] .live-value-row,
    html[data-plotbeat-style="soft-organic"] .live-value-row {
      filter: none !important;
    }
    html[data-plotbeat-style="velvet-ledger"] #series-area,
    html[data-plotbeat-style="ember-terminal"] #series-area,
    html[data-plotbeat-style="paper-cut"] #series-area,
    html[data-plotbeat-style="newsroom-ink"] #series-area,
    html[data-plotbeat-style="swiss-signal"] #series-area,
    html[data-plotbeat-style="soft-organic"] #series-area {
      fill: color-mix(in srgb, var(--pb-accent) 13%, transparent) !important;
    }
    html[data-plotbeat-theme="light"] #transition-seam,
    html[data-plotbeat-style="velvet-ledger"] #transition-seam,
    html[data-plotbeat-style="ember-terminal"] #transition-seam {
      background: var(--pb-accent) !important;
      box-shadow: none !important;
    }
  `;

  function getPreset(styleId) {
    const normalized = String(styleId || "signal-noir").toLowerCase();
    const preset = PRESETS[normalized];
    if (!preset) throw new Error(`Unknown Plotbeat style: ${styleId}`);
    return preset;
  }

  function installStyleSheet(documentRef) {
    if (documentRef.getElementById("plotbeat-style-system")) return;
    const style = documentRef.createElement("style");
    style.id = "plotbeat-style-system";
    style.textContent = SHARED_CSS;
    documentRef.head.appendChild(style);
  }

  function apply(styleId, documentRef = global.document) {
    const preset = getPreset(styleId);
    installStyleSheet(documentRef);
    const target = documentRef.documentElement;
    target.dataset.plotbeatStyle = preset.id;
    target.dataset.plotbeatTheme = preset.theme;
    const variables = {
      "--pb-bg": preset.background,
      "--pb-surface": preset.surface,
      "--pb-fg": preset.foreground,
      "--pb-muted": preset.muted,
      "--pb-grid": preset.grid,
      "--pb-accent": preset.accent,
      "--pb-accent-soft": preset.accentSoft,
      "--pb-accent-text": preset.accentText,
      "--pb-accent-ink": preset.accentInk,
      "--pb-border": preset.border,
      "--pb-overlay": preset.overlay,
      "--pb-font-display": preset.display,
      "--pb-font-body": preset.body,
      "--pb-radius": preset.radius,
      "--pb-panel-shadow": preset.panelShadow,
      "--pb-atmosphere": preset.atmosphere,
      "--bg": preset.background,
      "--panel": preset.surface,
      "--fg": preset.foreground,
      "--muted": preset.muted,
      "--grid": preset.grid,
      "--accent": preset.accent,
      "--accent-soft": preset.accentSoft,
    };
    Object.entries(variables).forEach(([name, value]) => target.style.setProperty(name, value));
    return preset;
  }

  global.PlotbeatStyles = Object.freeze({
    presets: PRESETS,
    apply,
    getPreset,
  });
})(window);
