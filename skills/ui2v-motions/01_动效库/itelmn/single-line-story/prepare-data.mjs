#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    if (inlineValue !== undefined) args[rawKey] = inlineValue;
    else if (argv[index + 1] && !argv[index + 1].startsWith("--")) args[rawKey] = argv[++index];
    else args[rawKey] = true;
  }
  return args;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else value += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(value.trim());
      value = "";
    } else if (character === "\n") {
      row.push(value.trim());
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      value = "";
    } else if (character !== "\r") value += character;
  }

  row.push(value.trim());
  if (quoted) throw new Error("CSV input contains an unterminated quoted field.");
  if (row.some((cell) => cell !== "")) rows.push(row);
  if (rows.length < 2) throw new Error("CSV input needs a header and at least one data row.");

  const headers = rows[0];
  if (headers.some((header) => !header)) throw new Error("CSV headers must be non-empty.");
  if (new Set(headers).size !== headers.length) throw new Error("CSV headers must be unique.");
  return rows.slice(1).map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
}

function readRows(inputPath) {
  const text = fs.readFileSync(inputPath, "utf8");
  if (path.extname(inputPath).toLowerCase() === ".json") {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.rows)) return parsed.rows;
    throw new Error("JSON input must be an array or an object with a rows array.");
  }
  return parseCsv(text);
}

function required(args, key) {
  if (!args[key]) throw new Error(`Missing required argument --${key}`);
  return args[key];
}

function dateValue(raw, rowNumber, column) {
  const date = String(raw ?? "").trim();
  if (!date) throw new Error(`Row ${rowNumber} is missing ${column}.`);
  const time = Date.parse(date);
  if (!Number.isFinite(time)) throw new Error(`Row ${rowNumber} has an invalid ${column}: ${date}`);
  return { date, time };
}

function assertNoDuplicateDates(points, label) {
  for (let index = 1; index < points.length; index += 1) {
    if (points[index - 1].time === points[index].time) {
      throw new Error(`${label} contains duplicate date ${points[index].date}. Resolve duplicates before compilation.`);
    }
  }
}

function compileSingleLine(rows, args) {
  const dateColumn = args.date ?? "date";
  const valueColumn = args.value ?? "value";
  const label = args.label ?? "Primary series";
  const points = rows.map((row, index) => {
    const value = Number(row[valueColumn]);
    const { date, time } = dateValue(row[dateColumn], index + 1, dateColumn);
    if (!Number.isFinite(value)) throw new Error(`Row ${index + 1} has an invalid ${valueColumn}: ${row[valueColumn]}`);
    return { date, time, value };
  });

  if (points.length < 2) throw new Error("single-line-story needs at least two rows.");
  points.sort((a, b) => a.time - b.time);
  assertNoDuplicateDates(points, label);

  return {
    template: "single-line-story",
    title: args.title ?? `What if ${label} kept compounding?`,
    accentText: args["accent-text"] ?? label,
    subtitle: args.subtitle ?? label,
    baselineLabel: args["baseline-label"] ?? "Current observed value",
    finaleKicker: args["finale-kicker"] ?? null,
    source: args.source ?? path.basename(args.input),
    unit: args.unit ?? "",
    series: [{ id: "primary", label, color: args.color ?? "#74d000", points: points.map(({ date, value }) => ({ date, value })) }],
  };
}

const DEFAULT_MULTI_COLORS = [
  "#a9e907", "#f1f3ec", "#f0b64b", "#4bb8a9", "#d45b9e", "#9a78d0",
  "#ff5d3a", "#f4d35e", "#2f80ed", "#e43f5a", "#8ac926", "#ff6f91",
  "#5dd39e", "#6c63ff", "#f77f00", "#4cc9f0", "#ef476f",
];

const VISUAL_STYLES = Object.freeze({
  "signal-noir": Object.freeze({
    accent: "#a9e907",
    palette: DEFAULT_MULTI_COLORS,
  }),
  "paper-cut": Object.freeze({
    accent: "#2454d6",
    palette: ["#2454d6", "#ef6a4b", "#e7ad33", "#258b74", "#8a55cf", "#d83c79"],
  }),
  "studio-blueprint": Object.freeze({
    accent: "#53c6cf",
    palette: ["#53c6cf", "#f1a35d", "#a78bfa", "#58c995", "#e56b6f", "#d8d38c"],
  }),
  "velvet-ledger": Object.freeze({
    accent: "#c8a96b",
    palette: ["#c8a96b", "#93445b", "#6f8f7a", "#d8c8a6", "#8f7bb8", "#b66a45"],
  }),
  "ember-terminal": Object.freeze({
    accent: "#f2ad3d",
    palette: ["#f2ad3d", "#d75a38", "#78a98b", "#e8d7aa", "#a582c7", "#6f94b8"],
  }),
  "newsroom-ink": Object.freeze({
    accent: "#191817",
    palette: ["#191817", "#c52228", "#486987", "#bc8b36", "#4f7868", "#775f8f"],
  }),
  "swiss-signal": Object.freeze({
    accent: "#164ed8",
    palette: ["#164ed8", "#e83225", "#0a0a0a", "#e6a928", "#32785b", "#8d4d83"],
  }),
  "soft-organic": Object.freeze({
    accent: "#356b59",
    palette: ["#356b59", "#cf7651", "#b28a47", "#6d7f9a", "#8b6e86", "#78915f"],
  }),
});

const PACE_PRESETS = Object.freeze({
  quick: {
    duration: 18,
    introHold: 0.045,
    introEnd: 0.07,
    finaleStart: 0.82,
    finaleDuration: 0.075,
    outroStart: 0.955,
  },
  standard: {
    duration: 30,
    introHold: 0.035,
    introEnd: 0.055,
    finaleStart: 0.86,
    finaleDuration: 0.065,
    outroStart: 0.96,
  },
  deliberate: {
    duration: 45,
    introHold: 0.03,
    introEnd: 0.05,
    finaleStart: 0.88,
    finaleDuration: 0.06,
    outroStart: 0.97,
  },
});

function compileMultiLine(rows, args, template = "multi-line-rank") {
  const dateColumn = args.date ?? "date";
  const valueColumn = args.value ?? "value";
  const seriesColumn = args.series ?? "series";
  const colorColumn = args["color-column"];
  const seriesColumns = String(args["series-columns"] ?? "").split(",").map((column) => column.trim()).filter(Boolean);
  const colors = String(args.colors ?? "").split(",").map((color) => color.trim()).filter(Boolean);
  const groups = new Map();

  function addPoint(id, point, color, rowNumber) {
    if (!groups.has(id)) groups.set(id, { points: [], color: color || null });
    const group = groups.get(id);
    if (color && group.color && group.color !== color) {
      throw new Error(`Series ${id} uses inconsistent colors at row ${rowNumber}.`);
    }
    if (color) group.color = color;
    group.points.push(point);
  }

  if (seriesColumns.length) {
    if (new Set(seriesColumns).size !== seriesColumns.length) throw new Error("--series-columns must not contain duplicates.");
    rows.forEach((row, index) => {
      const { date, time } = dateValue(row[dateColumn], index + 1, dateColumn);
      seriesColumns.forEach((column, columnIndex) => {
        const value = Number(row[column]);
        if (!Number.isFinite(value)) throw new Error(`Row ${index + 1} has an invalid ${column}: ${row[column]}`);
        addPoint(column, { date, time, value }, colors[columnIndex] ?? null, index + 1);
      });
    });
  } else {
    rows.forEach((row, index) => {
      const id = String(row[seriesColumn] ?? "").trim();
      const { date, time } = dateValue(row[dateColumn], index + 1, dateColumn);
      const value = Number(row[valueColumn]);
      if (!id) throw new Error(`Row ${index + 1} is missing ${seriesColumn}.`);
      if (!Number.isFinite(value)) throw new Error(`Row ${index + 1} has an invalid ${valueColumn}: ${row[valueColumn]}`);
      const color = colorColumn ? String(row[colorColumn] ?? "").trim() : "";
      addPoint(id, { date, time, value }, color, index + 1);
    });
  }

  if (groups.size < 2) throw new Error("multi-line-rank needs at least two distinct series.");
  const usedIds = new Set();
  const series = [...groups.entries()].map(([id, group], index) => {
    const { points } = group;
    points.sort((a, b) => a.time - b.time);
    assertNoDuplicateDates(points, id);
    const baseId = id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `series-${index + 1}`;
    let normalizedId = baseId;
    let suffix = 2;
    while (usedIds.has(normalizedId)) normalizedId = `${baseId}-${suffix++}`;
    usedIds.add(normalizedId);
    return {
      id: normalizedId,
      label: id,
      color: group.color ?? colors[index] ?? DEFAULT_MULTI_COLORS[index % DEFAULT_MULTI_COLORS.length],
      points: points.map(({ date, time, value }) => ({ date, time, value })),
    };
  });
  const expectedDates = series[0].points.map((point) => point.time).join("|");
  series.forEach((entry) => {
    if (entry.points.map((point) => point.time).join("|") !== expectedDates) {
      throw new Error("Every series must use the same ordered dates in v0.1.");
    }
    entry.points = entry.points.map(({ date, value }) => ({ date, value }));
  });

  return {
    template,
    title: args.title ?? (template === "bar-race"
      ? "Every category, ranked over time"
      : template === "stacked-area-story"
        ? "How the total changed — and who moved it"
        : "What if every series started together?"),
    accentText: args["accent-text"] ?? (template === "stacked-area-story" ? "total" : "every series"),
    subtitle: args.subtitle ?? (template === "bar-race"
      ? "Continuous category ranking"
      : template === "stacked-area-story"
        ? "Contribution by category over time"
        : "Live multi-series ranking"),
    source: args.source ?? path.basename(args.input),
    unit: args.unit ?? "",
    series,
  };
}

function compileScatter(rows, args) {
  const dateColumn = args.date ?? "date";
  const seriesColumn = args.series ?? "series";
  const xColumn = args.x ?? "x";
  const yColumn = args.y ?? "y";
  const sizeColumn = args.size ?? "size";
  const groups = new Map();
  rows.forEach((row, index) => {
    const id = String(row[seriesColumn] ?? "").trim();
    const { date, time } = dateValue(row[dateColumn], index + 1, dateColumn);
    const x = Number(row[xColumn]);
    const y = Number(row[yColumn]);
    const size = row[sizeColumn] === undefined || row[sizeColumn] === "" ? 6 : Number(row[sizeColumn]);
    if (!id) throw new Error(`Row ${index + 1} is missing ${seriesColumn}.`);
    if (![x, y, size].every(Number.isFinite)) throw new Error(`Row ${index + 1} has invalid scatter coordinates.`);
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push({ date, time, x, y, size });
  });
  if (groups.size < 1) throw new Error("scatter-journey needs at least one series.");
  return {
    template: "scatter-journey",
    title: args.title ?? "Every point has a direction",
    subtitle: args.subtitle ?? "Position and momentum over time",
    source: args.source ?? path.basename(args.input),
    unit: args.unit ?? "",
    xLabel: args["x-label"] ?? xColumn,
    yLabel: args["y-label"] ?? yColumn,
    series: [...groups.entries()].map(([label, points], index) => ({
      id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `series-${index + 1}`,
      label,
      color: DEFAULT_MULTI_COLORS[index % DEFAULT_MULTI_COLORS.length],
      points: points.sort((a, b) => a.time - b.time).map(({ time, ...point }) => point),
    })),
  };
}

function compileMap(rows, args) {
  const locationColumn = args.location ?? "location";
  const latitudeColumn = args.latitude ?? "latitude";
  const longitudeColumn = args.longitude ?? "longitude";
  const valueColumn = args.value ?? "value";
  const items = rows.map((row, index) => {
    const location = String(row[locationColumn] ?? "").trim();
    const latitude = Number(row[latitudeColumn]);
    const longitude = Number(row[longitudeColumn]);
    const value = Number(row[valueColumn]);
    if (!location) throw new Error(`Row ${index + 1} is missing ${locationColumn}.`);
    if (![latitude, longitude, value].every(Number.isFinite)) throw new Error(`Row ${index + 1} has invalid map coordinates or value.`);
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) throw new Error(`Row ${index + 1} has out-of-range map coordinates.`);
    return { location, latitude, longitude, value, color: DEFAULT_MULTI_COLORS[index % DEFAULT_MULTI_COLORS.length] };
  });
  if (items.length < 2) throw new Error("animated-map needs at least two locations.");
  return { template: "animated-map", title: args.title ?? "A global signal, moving", subtitle: args.subtitle ?? "Location intensity and connections", source: args.source ?? path.basename(args.input), unit: args.unit ?? "events", series: [], items };
}

function compileKpi(rows, args) {
  const metricColumn = args.metric ?? "metric";
  const valueColumn = args.value ?? "value";
  const targetColumn = args.target ?? "target";
  const changeColumn = args.change ?? "change";
  const unitColumn = args["unit-column"] ?? "unit";
  const suffixColumn = args["suffix-column"] ?? "suffix";
  const items = rows.map((row, index) => {
    const metric = String(row[metricColumn] ?? "").trim();
    const value = Number(row[valueColumn]);
    const target = Number(row[targetColumn]);
    const change = Number(row[changeColumn] ?? 0);
    if (!metric) throw new Error(`Row ${index + 1} is missing ${metricColumn}.`);
    if (![value, target, change].every(Number.isFinite)) throw new Error(`Row ${index + 1} has invalid KPI values.`);
    return { metric, value, target, change, unit: String(row[unitColumn] ?? args.unit ?? ""), suffix: String(row[suffixColumn] ?? ""), color: DEFAULT_MULTI_COLORS[index % DEFAULT_MULTI_COLORS.length], decimals: Number.isInteger(value) ? 0 : 1 };
  });
  if (items.length < 2) throw new Error("kpi-dashboard needs at least two metrics.");
  return { template: "kpi-dashboard", title: args.title ?? "The whole business, in motion", subtitle: args.subtitle ?? "Live targets and movement", source: args.source ?? path.basename(args.input), unit: args.unit ?? "", series: [], items };
}

function compileMilestones(rows, args) {
  const dateColumn = args.date ?? "date";
  const titleColumn = args["event-title"] ?? "title";
  const descriptionColumn = args.description ?? "description";
  const categoryColumn = args["category-column"] ?? "category";
  const items = rows.map((row, index) => {
    const { date, time } = dateValue(row[dateColumn], index + 1, dateColumn);
    const title = String(row[titleColumn] ?? "").trim();
    if (!title) throw new Error(`Row ${index + 1} is missing ${titleColumn}.`);
    return { date, time, title, description: String(row[descriptionColumn] ?? ""), category: String(row[categoryColumn] ?? ""), color: DEFAULT_MULTI_COLORS[index % DEFAULT_MULTI_COLORS.length] };
  }).sort((a, b) => a.time - b.time).map(({ time, ...item }) => item);
  if (items.length < 2) throw new Error("milestone-timeline needs at least two events.");
  return { template: "milestone-timeline", title: args.title ?? "Every milestone moved the story", subtitle: args.subtitle ?? "A launch timeline", source: args.source ?? path.basename(args.input), unit: "", series: [], items };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  args.input = required(args, "input");
  const output = required(args, "output");
  const template = args.template ?? "single-line-story";
  const visualStyle = String(args.style ?? "signal-noir").toLowerCase();
  if (!Object.hasOwn(VISUAL_STYLES, visualStyle)) {
    throw new Error(`--style must be ${Object.keys(VISUAL_STYLES).join(", ")}.`);
  }
  const rows = readRows(path.resolve(args.input));

  const data = template === "single-line-story"
    ? compileSingleLine(rows, args)
    : ["multi-line-rank", "bar-race", "stacked-area-story"].includes(template)
      ? compileMultiLine(rows, args, template)
      : template === "scatter-journey"
        ? compileScatter(rows, args)
        : template === "animated-map"
          ? compileMap(rows, args)
          : template === "kpi-dashboard"
            ? compileKpi(rows, args)
            : template === "milestone-timeline"
              ? compileMilestones(rows, args)
      : (() => { throw new Error(`Unsupported template in this vertical slice: ${template}`); })();
  const stylePreset = VISUAL_STYLES[visualStyle];
  if (!args.color && !args.colors && !args["color-column"]) {
    data.series?.forEach((entry, index) => {
      entry.color = template === "single-line-story"
        ? stylePreset.accent
        : stylePreset.palette[index % stylePreset.palette.length];
    });
    data.items?.forEach((entry, index) => {
      entry.color = stylePreset.palette[index % stylePreset.palette.length];
    });
  }
  const pace = String(args.pace ?? "standard").toLowerCase();
  if (!Object.hasOwn(PACE_PRESETS, pace)) {
    throw new Error("--pace must be quick, standard, or deliberate.");
  }
  const pacePreset = PACE_PRESETS[pace];
  const duration = Number(args.duration ?? pacePreset.duration);
  const introHold = Number(args["intro-hold"] ?? pacePreset.introHold);
  const introEnd = Number(args["intro-end"] ?? pacePreset.introEnd);
  const finaleStart = Number(args["finale-start"] ?? pacePreset.finaleStart);
  const finaleDuration = Number(args["finale-transition"] ?? pacePreset.finaleDuration);
  const outroStart = Number(args["outro-start"] ?? pacePreset.outroStart);
  const valueDecimals = Number(args.decimals ?? 1);
  const maxRanked = Number(args["max-ranked"] ?? 17);
  const pathStyle = args["path-style"] ?? "linear";
  const barMode = args["bar-mode"] ?? "absolute";
  const stackMode = args["stack-mode"] ?? "absolute";
  const scatterMode = args["scatter-mode"] ?? "trail";
  const mapMode = args["map-mode"] ?? "pulse";
  const kpiMode = args["kpi-mode"] ?? "cards";
  const timelineMode = args["timeline-mode"] ?? "continuous";
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("--duration must be a positive number.");
  if (!Number.isFinite(introHold) || introHold < 0 || introHold >= 1) throw new Error("--intro-hold must be between 0 and 1 (exclusive of 1).");
  if (!Number.isFinite(introEnd) || introEnd <= introHold || introEnd >= 1) throw new Error("--intro-end must be greater than intro hold and less than 1.");
  if (!Number.isFinite(finaleStart) || finaleStart <= introHold || finaleStart > 1) throw new Error("--finale-start must be greater than intro hold and no more than 1.");
  if (!Number.isFinite(finaleDuration) || finaleDuration <= 0 || finaleStart + finaleDuration >= 1) throw new Error("--finale-transition must be positive and end before 1.");
  if (!Number.isFinite(outroStart) || outroStart <= finaleStart + finaleDuration || outroStart >= 1) throw new Error("--outro-start must follow the finale transition and be less than 1.");
  if (!Number.isInteger(valueDecimals) || valueDecimals < 0 || valueDecimals > 6) throw new Error("--decimals must be an integer from 0 to 6.");
  if (!Number.isInteger(maxRanked) || maxRanked < 1) throw new Error("--max-ranked must be a positive integer.");
  if (!["linear", "smooth"].includes(pathStyle)) throw new Error("--path-style must be linear or smooth.");
  if (!["absolute", "leader-index"].includes(barMode)) throw new Error("--bar-mode must be absolute or leader-index.");
  if (!["absolute", "percent"].includes(stackMode)) throw new Error("--stack-mode must be absolute or percent.");
  if (!["trail", "bubble"].includes(scatterMode)) throw new Error("--scatter-mode must be trail or bubble.");
  if (!["pulse", "flow"].includes(mapMode)) throw new Error("--map-mode must be pulse or flow.");
  if (!["cards", "radial"].includes(kpiMode)) throw new Error("--kpi-mode must be cards or radial.");
  if (!["continuous", "chapters"].includes(timelineMode)) throw new Error("--timeline-mode must be continuous or chapters.");

  const spec = {
    style: visualStyle,
    pace,
    duration,
    introHold,
    introEnd,
    finaleStart,
    finaleDuration,
    outroStart,
    valueDecimals,
    dateFormat: args["date-format"] ?? "month-year",
    dynamicYDomain: true,
    maxRanked,
    pathStyle,
    barMode,
    stackMode,
    scatterMode,
    mapMode,
    kpiMode,
    timelineMode,
  };

  const outputPath = path.resolve(output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const javascript = [
    `window.HF_DATA = ${JSON.stringify(data, null, 2)};`,
    "",
    `window.HF_VIDEO_SPEC = ${JSON.stringify(spec, null, 2)};`,
    "",
  ].join("\n");
  fs.writeFileSync(outputPath, javascript);
  if (args.composition) {
    const compositionPath = path.resolve(args.composition);
    const html = fs.readFileSync(compositionPath, "utf8");
    if (!/data-duration="[0-9.]+"/.test(html)) throw new Error(`No data-duration attributes found in ${compositionPath}.`);
    const updated = html.replace(/data-duration="[0-9.]+"/g, `data-duration="${duration}"`);
    fs.writeFileSync(compositionPath, updated);
    const compositionsDir = path.join(path.dirname(compositionPath), "compositions");
    if (fs.existsSync(compositionsDir)) {
      for (const file of fs.readdirSync(compositionsDir)) {
        if (!file.endsWith(".html")) continue;
        const nestedPath = path.join(compositionsDir, file);
        const nestedHtml = fs.readFileSync(nestedPath, "utf8");
        fs.writeFileSync(nestedPath, nestedHtml.replace(/data-duration="[0-9.]+"/g, `data-duration="${duration}"`));
      }
    }
  }
  const pointCount = data.series.reduce((sum, entry) => sum + entry.points.length, 0) + (data.items?.length ?? 0);
  process.stdout.write(`Prepared ${pointCount} records for ${template} -> ${output}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
