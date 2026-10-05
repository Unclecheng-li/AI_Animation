"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Maximize2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { trackAnalyticsEvent } from "../analytics";
import { CopyButton } from "./CopyButton";
import { Checkbox } from "./ui/checkbox";
import { ColorPicker } from "./ui/color-picker";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";

type ChartType = "line" | "area" | "bars" | "scatter";
type CurveType = "linear" | "smooth";
type HeadlineStyle = "plain" | "rule" | "boxed" | "block";
type PatternType = "none" | "grid" | "hatch";
type StatStyle = "open" | "rule" | "panel";
type ControlGroupId = "chart" | "palette" | "typography" | "composition";

type BuilderConfig = {
  accent: string;
  accentSoft: string;
  areaOpacity: number;
  background: string;
  chartType: ChartType;
  curve: CurveType;
  dataFont: string;
  displayFont: string;
  foreground: string;
  grid: string;
  headlineStyle: HeadlineStyle;
  labelSize: number;
  lineWidth: number;
  metricSize: number;
  muted: string;
  onAccent: string;
  pattern: PatternType;
  radius: number;
  shadowOffset: number;
  showGrid: boolean;
  showValue: boolean;
  source: string;
  statStyle: StatStyle;
  surface: string;
  title: string;
  titleSize: number;
  titleWeight: number;
  unit: string;
  uppercase: boolean;
};

const FONT_OPTIONS = [
  { label: "Plotbeat Sans", value: '"Plotbeat Sans", Arial, sans-serif' },
  { label: "Editorial Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Heavy Display", value: "'Arial Black', Arial, sans-serif" },
  { label: "Grotesk", value: "Arial, Helvetica, sans-serif" },
  { label: "Monospace", value: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" },
  { label: "Typewriter", value: "'Courier New', Courier, monospace" },
] as const;

const BASE: BuilderConfig = {
  accent: "#164ed8",
  accentSoft: "#e83225",
  areaOpacity: 18,
  background: "#f4f2e9",
  chartType: "area",
  curve: "linear",
  dataFont: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  displayFont: "'Arial Black', Arial, sans-serif",
  foreground: "#0a0a0a",
  grid: "#c7c3b8",
  headlineStyle: "block",
  labelSize: 15,
  lineWidth: 6,
  metricSize: 52,
  muted: "#4b4b49",
  onAccent: "#fffdf8",
  pattern: "grid",
  radius: 0,
  shadowOffset: 0,
  showGrid: true,
  showValue: true,
  source: "Plotbeat style builder",
  statStyle: "rule",
  surface: "#fffefa",
  title: "Momentum, measured",
  titleSize: 42,
  titleWeight: 900,
  unit: "index",
  uppercase: true,
};

const PRESETS: Record<string, BuilderConfig> = {
  "swiss-signal": BASE,
  "paper-cut": {
    ...BASE,
    accent: "#2454d6",
    accentSoft: "#ef6a4b",
    background: "#f6e6b7",
    dataFont: "Arial, Helvetica, sans-serif",
    displayFont: "'Arial Black', Arial, sans-serif",
    foreground: "#18243a",
    grid: "#d8c38d",
    headlineStyle: "boxed",
    muted: "#665f51",
    onAccent: "#fff8e5",
    pattern: "hatch",
    radius: 4,
    shadowOffset: 8,
    statStyle: "panel",
    surface: "#fff5d6",
    title: "Momentum, measured",
    uppercase: false,
  },
  "newsroom-ink": {
    ...BASE,
    accent: "#191817",
    accentSoft: "#c52228",
    areaOpacity: 13,
    background: "#f7f4ea",
    dataFont: "'Courier New', Courier, monospace",
    displayFont: "Georgia, 'Times New Roman', serif",
    foreground: "#161514",
    grid: "#d6d0c4",
    headlineStyle: "rule",
    lineWidth: 4,
    muted: "#69645d",
    onAccent: "#fffdf7",
    pattern: "none",
    statStyle: "rule",
    surface: "#fffdf7",
    titleSize: 48,
    titleWeight: 700,
    uppercase: false,
  },
  "signal-noir": {
    ...BASE,
    accent: "#a9e907",
    accentSoft: "#f0b64b",
    areaOpacity: 20,
    background: "#090d0b",
    chartType: "line",
    dataFont: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    displayFont: '"Plotbeat Sans", Arial, sans-serif',
    foreground: "#f1f3ec",
    grid: "#29312b",
    headlineStyle: "plain",
    muted: "#99a097",
    onAccent: "#071006",
    pattern: "none",
    radius: 2,
    showValue: true,
    statStyle: "open",
    surface: "#121815",
    uppercase: false,
  },
  "studio-blueprint": {
    ...BASE,
    accent: "#53c6cf",
    accentSoft: "#f1a35d",
    background: "#0d2032",
    dataFont: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    displayFont: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    foreground: "#edf2f2",
    grid: "#355064",
    headlineStyle: "boxed",
    muted: "#9aafb9",
    onAccent: "#041725",
    pattern: "grid",
    statStyle: "panel",
    surface: "#142a3e",
  },
  "velvet-ledger": {
    ...BASE,
    accent: "#c8a96b",
    accentSoft: "#93445b",
    areaOpacity: 12,
    background: "#12100d",
    dataFont: "Arial, Helvetica, sans-serif",
    displayFont: "Georgia, 'Times New Roman', serif",
    foreground: "#eee5d4",
    grid: "#393126",
    headlineStyle: "rule",
    lineWidth: 4,
    metricSize: 46,
    muted: "#a19785",
    onAccent: "#17120b",
    pattern: "none",
    statStyle: "open",
    surface: "#1c1813",
    titleWeight: 400,
    uppercase: false,
  },
  "ember-terminal": {
    ...BASE,
    accent: "#f2ad3d",
    accentSoft: "#d75a38",
    background: "#15130f",
    chartType: "bars",
    dataFont: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    displayFont: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    foreground: "#f0e8d2",
    grid: "#3d382b",
    headlineStyle: "plain",
    lineWidth: 5,
    muted: "#aaa187",
    onAccent: "#181208",
    pattern: "hatch",
    statStyle: "open",
    surface: "#201d16",
  },
  "soft-organic": {
    ...BASE,
    accent: "#356b59",
    accentSoft: "#cf7651",
    areaOpacity: 16,
    background: "#eee8dc",
    curve: "smooth",
    dataFont: "Arial, Helvetica, sans-serif",
    displayFont: "Georgia, 'Times New Roman', serif",
    foreground: "#24372d",
    grid: "#c9c4b7",
    headlineStyle: "plain",
    lineWidth: 8,
    muted: "#5f6962",
    onAccent: "#f8f3e9",
    pattern: "none",
    radius: 24,
    shadowOffset: 5,
    statStyle: "panel",
    surface: "#f8f3e9",
    titleWeight: 400,
    uppercase: false,
  },
};

const PRESET_LABELS: Record<string, string> = {
  "signal-noir": "Signal Noir",
  "paper-cut": "Paper Cut",
  "studio-blueprint": "Studio Blueprint",
  "velvet-ledger": "Velvet Ledger",
  "ember-terminal": "Ember Terminal",
  "newsroom-ink": "Newsroom Ink",
  "swiss-signal": "Swiss Signal",
  "soft-organic": "Soft Organic",
};

const TRACKED_CONTROLS: Partial<Record<keyof BuilderConfig, ControlGroupId>> = {
  chartType: "chart",
  curve: "chart",
  pattern: "chart",
  showGrid: "chart",
  showValue: "chart",
  displayFont: "typography",
  dataFont: "typography",
  titleWeight: "typography",
  uppercase: "typography",
  headlineStyle: "composition",
  statStyle: "composition",
};

const values = [18, 23, 21, 30, 36, 34, 43, 49, 46, 59, 65, 62, 76, 72, 88, 96];
const plot = { left: 78, right: 898, top: 188, bottom: 456 };
const chartPoints = values.map((value, index) => ({
  x: plot.left + (index / (values.length - 1)) * (plot.right - plot.left),
  y: plot.bottom - (value / 110) * (plot.bottom - plot.top),
  value,
}));

function linePath(points: typeof chartPoints, curve: CurveType) {
  if (curve === "linear") return points.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
  return points.reduce((path, point, index) => {
    if (index === 0) return `M${point.x},${point.y}`;
    const previous = points[index - 1];
    const before = points[index - 2] ?? previous;
    const after = points[index + 1] ?? point;
    const controlOneX = previous.x + (point.x - before.x) / 6;
    const controlOneY = previous.y + (point.y - before.y) / 6;
    const controlTwoX = point.x - (after.x - previous.x) / 6;
    const controlTwoY = point.y - (after.y - previous.y) / 6;
    return `${path} C${controlOneX},${controlOneY} ${controlTwoX},${controlTwoY} ${point.x},${point.y}`;
  }, "");
}

function SelectControl({
  className = "",
  label,
  onChange,
  options,
  value,
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <div className={`builder-field ${className}`.trim()}>
      <span>{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label}>
          <SelectValue>{options.find((option) => option.value === value)?.label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function RangeControl({ label, min, max, step = 1, suffix = "", value, onChange }: { label: string; min: number; max: number; step?: number; suffix?: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="builder-range-control">
      <span>{label}<output>{value}{suffix}</output></span>
      <Slider aria-label={label} min={min} max={max} step={step} value={[value]} onValueChange={([nextValue]) => onChange(nextValue)} />
    </div>
  );
}

function CheckboxControl({ checked, id, label, onChange, className = "" }: { checked: boolean; id: string; label: string; onChange: (checked: boolean) => void; className?: string }) {
  return (
    <div className={`builder-check-field ${className}`.trim()}>
      <Checkbox id={id} checked={checked} onCheckedChange={(nextChecked) => onChange(nextChecked === true)} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

function ControlGroup({
  children,
  id,
  label,
  onToggle,
  open,
  summary,
}: {
  children: ReactNode;
  id: ControlGroupId;
  label: string;
  onToggle: (id: ControlGroupId) => void;
  open: boolean;
  summary: string;
}) {
  const contentId = `builder-group-${id}`;

  return (
    <fieldset className="builder-control-group" data-open={open} id={`builder-control-${id}`}>
      <legend>
        <button
          type="button"
          className="builder-group-toggle"
          aria-controls={contentId}
          aria-expanded={open}
          onClick={() => onToggle(id)}
        >
          <span className="builder-group-label"><span>{label}</span><small>{summary}</small></span>
          <ChevronDown aria-hidden="true" />
        </button>
      </legend>
      <motion.div
        className="builder-control-group-body"
        id={contentId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.32 }}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="builder-control-group-inner">{children}</div>
      </motion.div>
    </fieldset>
  );
}

function ChartArtwork({ config }: { config: BuilderConfig }) {
  const path = linePath(chartPoints, config.curve);
  const areaPath = `${path} L${chartPoints.at(-1)?.x},${plot.bottom} L${chartPoints[0].x},${plot.bottom} Z`;
  const titleText = config.uppercase ? config.title.toUpperCase() : config.title;
  const latest = chartPoints.at(-1)!;

  return (
    <svg viewBox="0 0 960 540" role="img" aria-label={`Live ${config.chartType} chart preview in the custom Plotbeat style`}>
      {config.headlineStyle === "boxed" && config.shadowOffset ? <rect x={40 + config.shadowOffset} y={24 + config.shadowOffset} width="610" height="76" rx={config.radius} fill="var(--builder-accent-soft)" className="builder-title-shadow" /> : null}
      {config.headlineStyle === "boxed" ? <rect x="40" y="24" width="610" height="76" rx={config.radius} fill="var(--builder-surface)" stroke="var(--builder-fg)" strokeWidth="3" /> : null}
      {config.headlineStyle === "block" ? <rect x="40" y="24" width="610" height="76" rx={config.radius} fill="var(--builder-accent-soft)" /> : null}
      <text
        x="58"
        y="77"
        fill={config.headlineStyle === "block" ? "var(--builder-on-accent)" : "var(--builder-fg)"}
        fontFamily={config.displayFont}
        fontSize={config.titleSize}
        fontWeight={config.titleWeight}
        letterSpacing="-1.8"
      >{titleText}</text>
      {config.headlineStyle === "rule" ? <line x1="48" y1="104" x2="640" y2="104" stroke="var(--builder-accent-soft)" strokeWidth="5" /> : null}

      {config.statStyle === "panel" && config.shadowOffset ? <rect x={706 + config.shadowOffset} y={26 + config.shadowOffset} width="212" height="118" rx={config.radius} fill="var(--builder-accent-soft)" /> : null}
      {config.statStyle === "panel" ? <rect x="706" y="26" width="212" height="118" rx={config.radius} fill="var(--builder-surface)" stroke="var(--builder-fg)" strokeWidth="3" /> : null}
      {config.statStyle === "rule" ? <line x1="708" y1="30" x2="918" y2="30" stroke="var(--builder-accent-soft)" strokeWidth="7" /> : null}
      <text x="906" y="60" textAnchor="end" fill="var(--builder-muted)" fontFamily={config.dataFont} fontSize={config.labelSize} fontWeight="700">CURRENT VALUE</text>
      <text x="906" y="112" textAnchor="end" fill="var(--builder-accent)" fontFamily={config.dataFont} fontSize={config.metricSize} fontWeight="900">96.0</text>
      <text x="906" y="137" textAnchor="end" fill="var(--builder-muted)" fontFamily={config.dataFont} fontSize={config.labelSize}>{config.unit}</text>

      {config.showGrid ? [0, 25, 50, 75, 100].map((value) => {
        const y = plot.bottom - (value / 110) * (plot.bottom - plot.top);
        return <g key={value}><line x1={plot.left} y1={y} x2={plot.right} y2={y} stroke="var(--builder-grid)" strokeWidth="1.5" /><text x="60" y={y + 5} textAnchor="end" fill="var(--builder-muted)" fontSize={config.labelSize} fontFamily={config.dataFont}>{value}</text></g>;
      }) : null}

      <motion.g key={config.chartType} initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .24, ease: [0.16, 1, 0.3, 1] }} style={{ transformOrigin: "center" }}>
        {config.chartType === "area" ? <path d={areaPath} fill="var(--builder-accent)" opacity={config.areaOpacity / 100} /> : null}
        {config.chartType === "line" || config.chartType === "area" ? <path d={path} fill="none" stroke="var(--builder-accent)" strokeWidth={config.lineWidth} strokeLinecap={config.curve === "smooth" ? "round" : "square"} strokeLinejoin="round" /> : null}
        {config.chartType === "bars" ? chartPoints.map((point, index) => {
          const barWidth = 31;
          return <rect x={point.x - barWidth / 2} y={point.y} width={barWidth} height={plot.bottom - point.y} rx={Math.min(config.radius, 12)} fill={index === chartPoints.length - 1 ? "var(--builder-accent-soft)" : "var(--builder-accent)"} opacity={index === chartPoints.length - 1 ? 1 : .78} key={point.x} />;
        }) : null}
        {config.chartType === "scatter" ? chartPoints.map((point, index) => <circle cx={point.x} cy={point.y} r={6 + (index % 4) * 2.4} fill={index % 3 === 0 ? "var(--builder-accent-soft)" : "var(--builder-accent)"} stroke="var(--builder-bg)" strokeWidth="3" key={point.x} />) : null}
      </motion.g>

      {config.showValue ? <g><circle cx={latest.x} cy={latest.y} r={config.lineWidth + 4} fill="var(--builder-accent-soft)" stroke="var(--builder-bg)" strokeWidth="3" /><text x={latest.x - 8} y={latest.y - 18} textAnchor="end" fill="var(--builder-fg)" fontFamily={config.dataFont} fontSize={config.labelSize + 4} fontWeight="900">96.0 {config.unit}</text></g> : null}
      <text x={plot.left} y="490" fill="var(--builder-muted)" fontFamily={config.dataFont} fontSize={config.labelSize}>JAN 2021</text>
      <rect x={plot.right - 98} y="467" width="98" height="34" rx={Math.min(config.radius, 10)} fill="var(--builder-accent)" className="builder-date-chip" />
      <text x={plot.right - 10} y="490" textAnchor="end" fill="var(--builder-on-accent)" fontFamily={config.dataFont} fontSize={config.labelSize} fontWeight="700">AUG 2023</text>
      <text x="46" y="520" fill="var(--builder-muted)" fontFamily={config.dataFont} fontSize={Math.max(config.labelSize - 2, 10)}>DATA: {config.source}</text>
      <text x="914" y="520" textAnchor="end" fill="var(--builder-accent-soft)" fontFamily={config.dataFont} fontSize={Math.max(config.labelSize - 2, 10)} fontWeight="700">PLOTBEAT · HYPERFRAMES</text>
    </svg>
  );
}

export function StyleBuilder() {
  const [config, setConfig] = useState<BuilderConfig>(PRESETS["swiss-signal"]);
  const [presetId, setPresetId] = useState("swiss-signal");
  const [openGroups, setOpenGroups] = useState<Set<ControlGroupId>>(() => new Set<ControlGroupId>(["chart"]));
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!previewOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [previewOpen]);

  function update<K extends keyof BuilderConfig>(key: K, value: BuilderConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
    const controlGroup = TRACKED_CONTROLS[key];
    if (controlGroup) {
      trackAnalyticsEvent("style_control_change", {
        control_group: controlGroup,
        control_name: key,
        control_value: String(value),
      });
    }
  }

  function selectPreset(nextPreset: string) {
    const preset = PRESETS[nextPreset];
    if (!preset) return;
    setPresetId(nextPreset);
    setConfig({ ...preset });
    trackAnalyticsEvent("select_content", {
      content_type: "builder_preset",
      content_id: nextPreset,
      ui_location: "style_builder",
    });
  }

  function resetStyle() {
    const preset = PRESETS[presetId];
    if (!preset) return;
    setConfig({ ...preset });
    trackAnalyticsEvent("style_builder_reset", {
      content_id: presetId,
      ui_location: "style_builder",
    });
  }

  function toggleGroup(id: ControlGroupId) {
    trackAnalyticsEvent("builder_section_toggle", {
      control_group: id,
      control_state: openGroups.has(id) ? "closed" : "open",
    });
    setOpenGroups((current) => {
      return current.has(id) ? new Set<ControlGroupId>() : new Set<ControlGroupId>([id]);
    });
  }

  function focusGroup(id: ControlGroupId) {
    const alreadyOpen = openGroups.has(id);
    setOpenGroups(new Set<ControlGroupId>([id]));
    trackAnalyticsEvent("builder_section_open", {
      control_group: id,
      ui_location: "mobile_quick_controls",
    });
    window.setTimeout(() => {
      const target = document.getElementById(`builder-control-${id}`);
      const scroller = target?.closest<HTMLElement>(".builder-controls-scroll");
      if (!target || !scroller || target.dataset.open !== "true") return;
      scroller.scrollTo({ behavior: "smooth", top: target.offsetTop - scroller.offsetTop });
    }, alreadyOpen ? 0 : 360);
  }

  const pattern = config.pattern === "grid"
    ? `linear-gradient(color-mix(in srgb, ${config.grid} 36%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, ${config.grid} 36%, transparent) 1px, transparent 1px)`
    : config.pattern === "hatch"
      ? `repeating-linear-gradient(135deg, color-mix(in srgb, ${config.grid} 42%, transparent) 0 2px, transparent 2px 18px)`
      : "none";
  const previewStyle = {
    "--builder-bg": config.background,
    "--builder-surface": config.surface,
    "--builder-fg": config.foreground,
    "--builder-muted": config.muted,
    "--builder-grid": config.grid,
    "--builder-accent": config.accent,
    "--builder-accent-soft": config.accentSoft,
    "--builder-on-accent": config.onAccent,
    backgroundColor: config.background,
    backgroundImage: pattern,
    backgroundSize: config.pattern === "grid" ? "42px 42px" : undefined,
    borderRadius: config.radius,
    color: config.foreground,
    fontFamily: config.dataFont,
  } as CSSProperties;
  const exportValue = useMemo(() => JSON.stringify({
    name: "Custom Plotbeat style",
    chartType: config.chartType,
    tokens: {
      background: config.background,
      surface: config.surface,
      foreground: config.foreground,
      muted: config.muted,
      grid: config.grid,
      accent: config.accent,
      accentSoft: config.accentSoft,
      onAccent: config.onAccent,
    },
    typography: {
      displayFont: config.displayFont,
      dataFont: config.dataFont,
      titleSize: config.titleSize,
      metricSize: config.metricSize,
      labelSize: config.labelSize,
      titleWeight: config.titleWeight,
      uppercase: config.uppercase,
    },
    chart: {
      curve: config.curve,
      lineWidth: config.lineWidth,
      areaOpacity: config.areaOpacity / 100,
      showGrid: config.showGrid,
      showValue: config.showValue,
    },
    composition: {
      headlineStyle: config.headlineStyle,
      statStyle: config.statStyle,
      pattern: config.pattern,
      radius: config.radius,
      shadowOffset: config.shadowOffset,
    },
  }, null, 2), [config]);

  const displayFontLabel = FONT_OPTIONS.find((option) => option.value === config.displayFont)?.label ?? "Custom";

  return (
    <section className="builder-workspace" aria-label="Plotbeat live style builder">
      <aside className="builder-controls">
        <div className="builder-controls-head">
          <div><span>Starting point</span><strong>Style controls</strong></div>
          <button type="button" onClick={resetStyle}>Reset</button>
        </div>

        <div className="builder-controls-scroll">
        <div className="builder-mobile-control-strip" aria-label="Quick style controls">
          <Select value={presetId} onValueChange={selectPreset}>
            <SelectTrigger className="builder-mobile-control-tile builder-mobile-preset-tile" aria-label="Preset">
              <span>Preset</span><strong>{PRESET_LABELS[presetId]}</strong>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRESET_LABELS).map(([value, label]) => <SelectItem value={value} key={value}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
          <motion.button type="button" className="builder-mobile-control-tile" whileTap={{ scale: .97 }} onClick={() => focusGroup("chart")}>
            <span>Chart</span><strong>{config.chartType}</strong><small>{config.curve}</small>
          </motion.button>
          <motion.button type="button" className="builder-mobile-control-tile" whileTap={{ scale: .97 }} onClick={() => focusGroup("palette")}>
            <span>Palette</span><strong>Custom</strong><small className="builder-mobile-swatches" aria-hidden="true"><i style={{ background: config.accent }} /><i style={{ background: config.accentSoft }} /><i style={{ background: config.background }} /></small>
          </motion.button>
          <motion.button type="button" className="builder-mobile-control-tile" whileTap={{ scale: .97 }} onClick={() => focusGroup("typography")}>
            <span>Typography</span><strong>{displayFontLabel}</strong><small>Aa</small>
          </motion.button>
          <motion.button type="button" className="builder-mobile-control-tile" whileTap={{ scale: .97 }} onClick={() => focusGroup("composition")}>
            <span>Layout</span><strong>{config.headlineStyle}</strong><small>{config.statStyle} stat</small>
          </motion.button>
        </div>

        <SelectControl
          className="builder-preset-field"
          label="Preset"
          value={presetId}
          onChange={selectPreset}
          options={Object.entries(PRESET_LABELS).map(([value, label]) => ({ label, value }))}
        />

        <ControlGroup id="chart" label="Chart" summary={`${config.chartType} · ${config.curve}`} open={openGroups.has("chart")} onToggle={toggleGroup}>
          <div className="builder-segment" aria-label="Chart type">
            {(["line", "area", "bars", "scatter"] as const).map((type) => (
              <button type="button" aria-pressed={config.chartType === type} onClick={() => update("chartType", type)} key={type}>{type}</button>
            ))}
          </div>
          <div className="builder-two-up">
            <SelectControl label="Curve" value={config.curve} onChange={(value) => update("curve", value as CurveType)} options={[{ label: "Linear", value: "linear" }, { label: "Smooth", value: "smooth" }]} />
            <SelectControl label="Pattern" value={config.pattern} onChange={(value) => update("pattern", value as PatternType)} options={[{ label: "None", value: "none" }, { label: "Grid", value: "grid" }, { label: "Hatch", value: "hatch" }]} />
          </div>
          <RangeControl label="Line weight" min={2} max={12} suffix="px" value={config.lineWidth} onChange={(value) => update("lineWidth", value)} />
          <RangeControl label="Area fill" min={0} max={45} suffix="%" value={config.areaOpacity} onChange={(value) => update("areaOpacity", value)} />
          <div className="builder-toggles">
            <CheckboxControl id="show-grid" label="Grid lines" checked={config.showGrid} onChange={(checked) => update("showGrid", checked)} />
            <CheckboxControl id="show-value" label="Value label" checked={config.showValue} onChange={(checked) => update("showValue", checked)} />
          </div>
        </ControlGroup>

        <ControlGroup id="palette" label="Palette" summary="8 color tokens" open={openGroups.has("palette")} onToggle={toggleGroup}>
          <div className="builder-color-grid">
            <ColorPicker label="Background" value={config.background} onChange={(value) => update("background", value)} />
            <ColorPicker label="Surface" value={config.surface} onChange={(value) => update("surface", value)} />
            <ColorPicker label="Foreground" value={config.foreground} onChange={(value) => update("foreground", value)} />
            <ColorPicker label="Muted" value={config.muted} onChange={(value) => update("muted", value)} />
            <ColorPicker label="Grid" value={config.grid} onChange={(value) => update("grid", value)} />
            <ColorPicker label="Data" value={config.accent} onChange={(value) => update("accent", value)} />
            <ColorPicker label="Secondary" value={config.accentSoft} onChange={(value) => update("accentSoft", value)} />
            <ColorPicker label="On accent" value={config.onAccent} onChange={(value) => update("onAccent", value)} />
          </div>
        </ControlGroup>

        <ControlGroup id="typography" label="Typography" summary={FONT_OPTIONS.find((option) => option.value === config.displayFont)?.label ?? "Custom"} open={openGroups.has("typography")} onToggle={toggleGroup}>
          <SelectControl label="Display font" value={config.displayFont} onChange={(value) => update("displayFont", value)} options={FONT_OPTIONS} />
          <SelectControl label="Data font" value={config.dataFont} onChange={(value) => update("dataFont", value)} options={FONT_OPTIONS} />
          <RangeControl label="Title size" min={30} max={68} suffix="px" value={config.titleSize} onChange={(value) => update("titleSize", value)} />
          <RangeControl label="Metric size" min={32} max={72} suffix="px" value={config.metricSize} onChange={(value) => update("metricSize", value)} />
          <RangeControl label="Label size" min={11} max={22} suffix="px" value={config.labelSize} onChange={(value) => update("labelSize", value)} />
          <div className="builder-two-up">
            <SelectControl label="Title weight" value={String(config.titleWeight)} onChange={(value) => update("titleWeight", Number(value))} options={[{ label: "Regular", value: "400" }, { label: "Bold", value: "700" }, { label: "Heavy", value: "900" }]} />
            <CheckboxControl className="builder-check-field-spaced" id="uppercase-title" label="Uppercase title" checked={config.uppercase} onChange={(checked) => update("uppercase", checked)} />
          </div>
        </ControlGroup>

        <ControlGroup id="composition" label="Composition" summary={`${config.headlineStyle} · ${config.statStyle}`} open={openGroups.has("composition")} onToggle={toggleGroup}>
          <div className="builder-two-up">
            <SelectControl label="Headline" value={config.headlineStyle} onChange={(value) => update("headlineStyle", value as HeadlineStyle)} options={[{ label: "Plain", value: "plain" }, { label: "Rule", value: "rule" }, { label: "Boxed", value: "boxed" }, { label: "Color block", value: "block" }]} />
            <SelectControl label="Stat treatment" value={config.statStyle} onChange={(value) => update("statStyle", value as StatStyle)} options={[{ label: "Open", value: "open" }, { label: "Rule", value: "rule" }, { label: "Panel", value: "panel" }]} />
          </div>
          <RangeControl label="Corner radius" min={0} max={28} suffix="px" value={config.radius} onChange={(value) => update("radius", value)} />
          <RangeControl label="Shadow offset" min={0} max={14} suffix="px" value={config.shadowOffset} onChange={(value) => update("shadowOffset", value)} />
          <label className="builder-field" htmlFor="builder-title"><span>Title</span><Input id="builder-title" type="text" maxLength={34} value={config.title} onChange={(event) => update("title", event.target.value)} /></label>
          <div className="builder-two-up">
            <label className="builder-field" htmlFor="builder-unit"><span>Unit</span><Input id="builder-unit" type="text" maxLength={12} value={config.unit} onChange={(event) => update("unit", event.target.value)} /></label>
            <label className="builder-field" htmlFor="builder-source"><span>Source</span><Input id="builder-source" type="text" maxLength={38} value={config.source} onChange={(event) => update("source", event.target.value)} /></label>
          </div>
        </ControlGroup>
        </div>

        <div className="builder-mobile-actions" aria-label="Builder quick actions">
          <button type="button" onClick={resetStyle}><span>Reset style</span><b aria-hidden="true">↺</b></button>
          <CopyButton analytics={{ contentId: presetId, contentType: "style_json", location: "style_builder_mobile" }} value={exportValue} label="Copy style JSON" compact />
        </div>

        <div className="builder-export">
          <span>Ready for your agent</span>
          <p>Copy these tokens into a Plotbeat prompt or style preset.</p>
          <CopyButton analytics={{ contentId: presetId, contentType: "style_json", location: "style_builder_desktop" }} value={exportValue} label="Copy style JSON" />
        </div>
      </aside>

      <div className="builder-stage-column" id="builder-preview">
        <div className="builder-stage-topline"><span>Live chart preview</span><b>16:9 · editable tokens</b></div>
        <button className="builder-chart-frame builder-chart-trigger" style={previewStyle} type="button" aria-haspopup="dialog" onClick={() => { setPreviewOpen(true); trackAnalyticsEvent("builder_preview_open", { content_id: presetId, content_type: config.chartType, ui_location: "style_builder" }); }}>
          <ChartArtwork config={config} />
          <span className="builder-preview-expand-hint"><Maximize2 aria-hidden="true" /> Enlarge</span>
        </button>
        <div className="builder-stage-meta" aria-hidden="true">
          <span>{PRESET_LABELS[presetId]}</span>
          <span>{config.chartType}</span>
          <b><i />Live</b>
        </div>
      </div>

      <AnimatePresence>
        {previewOpen ? (
          <motion.div
            className="builder-preview-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .18 }}
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) setPreviewOpen(false);
            }}
          >
            <motion.section
              className="builder-preview-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Expanded live chart preview"
              initial={{ opacity: 0, y: 24, scale: .97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: .98 }}
              transition={{ type: "spring", bounce: 0, duration: .34 }}
            >
              <header><div><span>Live chart preview</span><b>{PRESET_LABELS[presetId]} · {config.chartType}</b></div><button type="button" aria-label="Close expanded preview" onClick={() => setPreviewOpen(false)}><X aria-hidden="true" /></button></header>
              <div className="builder-preview-modal-viewport">
                <div className="builder-preview-modal-frame" style={previewStyle}><ChartArtwork config={config} /></div>
              </div>
              <p>Swipe to inspect the full frame · changes stay live</p>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
