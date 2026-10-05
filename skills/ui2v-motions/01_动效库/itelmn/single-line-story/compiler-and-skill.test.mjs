import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import vm from "node:vm";

const root = path.resolve(new URL("..", import.meta.url).pathname);

function runNode(args, cwd = root) {
  return spawnSync(process.execPath, args, { cwd, encoding: "utf8" });
}

function loadGenerated(file) {
  const context = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(file, "utf8"), context);
  return context.window;
}

test("compiler maps arbitrary single-line columns to frozen HyperFrames data", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "hf-data-compiler-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const input = path.join(temporary, "revenue.csv");
  const output = path.join(temporary, "generated", "data.js");
  fs.writeFileSync(input, "month,arr\n2025-02-01,24\n2025-01-01,12\n");

  const result = runNode([
    "scripts/prepare-data.mjs", "--template", "single-line-story",
    "--input", input, "--output", output, "--date", "month", "--value", "arr",
    "--title", "ARR compounds", "--unit", "USD",
  ]);
  assert.equal(result.status, 0, result.stderr);

  const generated = loadGenerated(output);
  assert.equal(generated.HF_DATA.template, "single-line-story");
  assert.equal(generated.HF_DATA.title, "ARR compounds");
  assert.equal(generated.HF_DATA.unit, "USD");
  assert.deepEqual(Array.from(generated.HF_DATA.series[0].points, (point) => point.date), ["2025-01-01", "2025-02-01"]);
});

test("compiler rejects unsynchronized multi-series dates", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "hf-data-invalid-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const input = path.join(temporary, "invalid.csv");
  fs.writeFileSync(input, "date,series,value\n2025-01-01,A,10\n2025-02-01,A,12\n2025-01-01,B,9\n");

  const result = runNode([
    "scripts/prepare-data.mjs", "--template", "multi-line-rank",
    "--input", input, "--output", path.join(temporary, "data.js"),
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /same ordered dates/);
});

test("compiler accepts JSON row envelopes and preserves generic column mappings", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "hf-data-json-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const input = path.join(temporary, "signal.json");
  const output = path.join(temporary, "data.js");
  fs.writeFileSync(input, JSON.stringify({ rows: [
    { period: "2025-01-01", score: 5.5 },
    { period: "2025-02-01", score: 8.25 },
  ] }));

  const result = runNode([
    "scripts/prepare-data.mjs", "--template", "single-line-story",
    "--input", input, "--output", output, "--date", "period", "--value", "score",
    "--duration", "30", "--decimals", "2",
  ]);
  assert.equal(result.status, 0, result.stderr);
  const generated = loadGenerated(output);
  assert.equal(generated.HF_DATA.series[0].points[1].value, 8.25);
  assert.equal(generated.HF_VIDEO_SPEC.duration, 30);
  assert.equal(generated.HF_VIDEO_SPEC.valueDecimals, 2);
});

test("compiler exposes pacing presets while exact duration remains configurable", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "hf-data-pacing-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const input = path.join(temporary, "signal.csv");
  const output = path.join(temporary, "data.js");
  fs.writeFileSync(input, "date,value\n2025-01-01,1\n2025-02-01,2\n");

  const quick = runNode([
    "scripts/prepare-data.mjs", "--input", input, "--output", output,
    "--pace", "quick", "--duration", "22",
  ]);
  assert.equal(quick.status, 0, quick.stderr);
  const generated = loadGenerated(output);
  assert.equal(generated.HF_VIDEO_SPEC.pace, "quick");
  assert.equal(generated.HF_VIDEO_SPEC.duration, 22);
  assert.equal(generated.HF_VIDEO_SPEC.introHold, 0.045);
  assert.equal(generated.HF_VIDEO_SPEC.introEnd, 0.07);
  assert.equal(generated.HF_VIDEO_SPEC.finaleStart, 0.82);
  assert.equal(generated.HF_VIDEO_SPEC.finaleDuration, 0.075);
  assert.equal(generated.HF_VIDEO_SPEC.outroStart, 0.955);

  const invalid = runNode([
    "scripts/prepare-data.mjs", "--input", input, "--output", output, "--pace", "rushed",
  ]);
  assert.match(invalid.stderr, /pace must be quick, standard, or deliberate/);
});

test("compiler exposes named visual styles and style-specific chart palettes", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "plotbeat-style-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const input = path.join(temporary, "signal.csv");
  const output = path.join(temporary, "data.js");
  fs.writeFileSync(input, "date,value\n2025-01-01,1\n2025-02-01,2\n");

  const paper = runNode([
    "scripts/prepare-data.mjs", "--input", input, "--output", output,
    "--style", "paper-cut",
  ]);
  assert.equal(paper.status, 0, paper.stderr);
  const generated = loadGenerated(output);
  assert.equal(generated.HF_VIDEO_SPEC.style, "paper-cut");
  assert.equal(generated.HF_DATA.series[0].color, "#2454d6");

  const editorial = runNode([
    "scripts/prepare-data.mjs", "--input", input, "--output", output,
    "--style", "newsroom-ink",
  ]);
  assert.equal(editorial.status, 0, editorial.stderr);
  const editorialGenerated = loadGenerated(output);
  assert.equal(editorialGenerated.HF_VIDEO_SPEC.style, "newsroom-ink");
  assert.equal(editorialGenerated.HF_DATA.series[0].color, "#191817");

  const swiss = runNode([
    "scripts/prepare-data.mjs", "--input", input, "--output", output,
    "--style", "swiss-signal",
  ]);
  assert.equal(swiss.status, 0, swiss.stderr);
  const swissGenerated = loadGenerated(output);
  assert.equal(swissGenerated.HF_VIDEO_SPEC.style, "swiss-signal");
  assert.equal(swissGenerated.HF_DATA.series[0].color, "#164ed8");

  const invalid = runNode([
    "scripts/prepare-data.mjs", "--input", input, "--output", output,
    "--style", "dashboard-purple",
  ]);
  assert.match(invalid.stderr, /style must be signal-noir, paper-cut, studio-blueprint, velvet-ledger, ember-terminal, newsroom-ink, swiss-signal, soft-organic/);
});

test("multi-line compiler accepts wide CSV input and an explicit palette", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "hf-data-wide-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const input = path.join(temporary, "regions.csv");
  const output = path.join(temporary, "data.js");
  fs.writeFileSync(input, "period,North,South,West\n2025-01-01,10,20,15\n2025-02-01,14,18,22\n");

  const result = runNode([
    "scripts/prepare-data.mjs", "--template", "multi-line-rank",
    "--input", input, "--output", output, "--date", "period",
    "--series-columns", "North,South,West", "--colors", "#111111,#222222,#333333",
  ]);
  assert.equal(result.status, 0, result.stderr);
  const generated = loadGenerated(output);
  assert.deepEqual(Array.from(generated.HF_DATA.series, (series) => series.label), ["North", "South", "West"]);
  assert.deepEqual(Array.from(generated.HF_DATA.series, (series) => series.color), ["#111111", "#222222", "#333333"]);
});

test("multi-series templates share one compiler and expose template-specific variants", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "hf-data-variants-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const input = path.join(temporary, "categories.csv");
  fs.writeFileSync(input, "date,series,value\n2025-01-01,A,10\n2025-02-01,A,14\n2025-01-01,B,8\n2025-02-01,B,15\n");

  const barOutput = path.join(temporary, "bar.js");
  const bar = runNode([
    "scripts/prepare-data.mjs", "--template", "bar-race", "--input", input,
    "--output", barOutput, "--bar-mode", "leader-index",
  ]);
  assert.equal(bar.status, 0, bar.stderr);
  const barGenerated = loadGenerated(barOutput);
  assert.equal(barGenerated.HF_DATA.template, "bar-race");
  assert.equal(barGenerated.HF_VIDEO_SPEC.barMode, "leader-index");

  const stackOutput = path.join(temporary, "stack.js");
  const stacked = runNode([
    "scripts/prepare-data.mjs", "--template", "stacked-area-story", "--input", input,
    "--output", stackOutput, "--stack-mode", "percent",
  ]);
  assert.equal(stacked.status, 0, stacked.stderr);
  const stackGenerated = loadGenerated(stackOutput);
  assert.equal(stackGenerated.HF_DATA.template, "stacked-area-story");
  assert.equal(stackGenerated.HF_VIDEO_SPEC.stackMode, "percent");
});

test("launch templates compile their documented data shapes and variants", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "plotbeat-launch-templates-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));

  const cases = [
    {
      template: "scatter-journey",
      csv: "date,series,x,y,size\n2025-01-01,A,10,20,5\n2025-02-01,A,20,30,8\n2025-01-01,B,18,12,4\n2025-02-01,B,27,22,7\n",
      flags: ["--scatter-mode", "bubble"],
      assert: (generated) => {
        assert.equal(generated.HF_DATA.series.length, 2);
        assert.equal(generated.HF_VIDEO_SPEC.scatterMode, "bubble");
      },
    },
    {
      template: "animated-map",
      csv: "location,latitude,longitude,value\nTokyo,35.7,139.7,42\nLondon,51.5,-0.1,31\n",
      flags: ["--map-mode", "flow"],
      assert: (generated) => {
        assert.equal(generated.HF_DATA.items[0].location, "Tokyo");
        assert.equal(generated.HF_VIDEO_SPEC.mapMode, "flow");
      },
    },
    {
      template: "kpi-dashboard",
      csv: "metric,value,target,change,unit\nARR,82,100,12,USD\nRetention,94,92,2,%\n",
      flags: ["--kpi-mode", "radial"],
      assert: (generated) => {
        assert.equal(generated.HF_DATA.items.length, 2);
        assert.equal(generated.HF_VIDEO_SPEC.kpiMode, "radial");
      },
    },
    {
      template: "milestone-timeline",
      csv: "date,title,description\n2025-02-01,Launch,Public release\n2025-01-01,Prototype,First build\n",
      flags: ["--timeline-mode", "chapters"],
      assert: (generated) => {
        assert.equal(generated.HF_DATA.items[0].title, "Prototype");
        assert.equal(generated.HF_VIDEO_SPEC.timelineMode, "chapters");
      },
    },
  ];

  for (const current of cases) {
    const input = path.join(temporary, `${current.template}.csv`);
    const output = path.join(temporary, `${current.template}.js`);
    fs.writeFileSync(input, current.csv);
    const result = runNode(["scripts/prepare-data.mjs", "--template", current.template, "--input", input, "--output", output, ...current.flags]);
    assert.equal(result.status, 0, result.stderr);
    const generated = loadGenerated(output);
    assert.equal(generated.HF_DATA.template, current.template);
    current.assert(generated);
  }
});

test("compiler rejects invalid and duplicate dates plus invalid timing options", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "hf-data-date-validation-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const invalidDate = path.join(temporary, "invalid-date.csv");
  const duplicateDate = path.join(temporary, "duplicate-date.csv");
  const validDate = path.join(temporary, "valid-date.csv");
  fs.writeFileSync(invalidDate, "date,value\nnot-a-date,1\n2025-02-01,2\n");
  fs.writeFileSync(duplicateDate, "date,value\n2025-01-01,1\n2025-01-01,2\n");
  fs.writeFileSync(validDate, "date,value\n2025-01-01,1\n2025-02-01,2\n");

  const invalid = runNode(["scripts/prepare-data.mjs", "--input", invalidDate, "--output", path.join(temporary, "a.js")]);
  const duplicate = runNode(["scripts/prepare-data.mjs", "--input", duplicateDate, "--output", path.join(temporary, "b.js")]);
  const timing = runNode(["scripts/prepare-data.mjs", "--input", validDate, "--output", path.join(temporary, "c.js"), "--duration", "0"]);
  const transitionTiming = runNode([
    "scripts/prepare-data.mjs", "--input", validDate, "--output", path.join(temporary, "d.js"),
    "--pace", "quick", "--outro-start", "0.85",
  ]);
  assert.match(invalid.stderr, /invalid date/);
  assert.match(duplicate.stderr, /duplicate date/);
  assert.match(timing.stderr, /duration must be a positive number/);
  assert.match(transitionTiming.stderr, /outro-start must follow the finale transition/);
});

test("portable skill scaffolds complete native HyperFrames projects", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "hf-data-skill-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const output = path.join(temporary, "composition");
  const result = runNode([
    "skills/plotbeat/scripts/scaffold.mjs",
    "--template", "multi-line-rank", "--output", output,
    "--duration", "42", "--accent-text", "series",
  ]);
  assert.equal(result.status, 0, result.stderr);

  for (const relative of [
    "index.html", "hyperframes.json", "template.json", "package.json",
    "generated/data.js", "runtime/plotbeat-data.js", "runtime/plotbeat-styles.js", "scripts/prepare-data.mjs",
    "schemas/template.schema.json", "assets/audio/upbeat-data-loop.mp3",
    "assets/audio/SOUNDTRACK.md",
  ]) assert.ok(fs.existsSync(path.join(output, relative)), `Missing ${relative}`);

  const manifest = JSON.parse(fs.readFileSync(path.join(output, "template.json"), "utf8"));
  assert.equal(manifest.engine, "hyperframes");
  assert.equal(manifest.id, "multi-line-rank");
  const html = fs.readFileSync(path.join(output, "index.html"), "utf8");
  const generated = loadGenerated(path.join(output, "generated", "data.js"));
  assert.match(html, /data-duration="42"/);
  assert.match(html, /<audio[^>]+id="background-music"[^>]+data-duration="42"/);
  assert.equal(generated.HF_VIDEO_SPEC.duration, 42);
  assert.equal(generated.HF_VIDEO_SPEC.style, "signal-noir");
  assert.equal(generated.HF_DATA.accentText, "series");
});

test("portable skill discovers templates from its packaged catalog", () => {
  const result = runNode(["skills/plotbeat/scripts/scaffold.mjs", "--list"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^single-line-story\s+wide\s+Single-line Story/m);
  assert.match(result.stdout, /^multi-line-rank\s+long\s+Multi-line Rank/m);
  assert.match(result.stdout, /^bar-race\s+long\s+Bar Race/m);
  assert.match(result.stdout, /^stacked-area-story\s+long\s+Stacked-area Story/m);
  assert.match(result.stdout, /^scatter-journey\s+long\s+Scatter Journey/m);
  assert.match(result.stdout, /^animated-map\s+location rows\s+Animated Map/m);
  assert.match(result.stdout, /^kpi-dashboard\s+metric rows\s+KPI Dashboard/m);
  assert.match(result.stdout, /^milestone-timeline\s+event rows\s+Milestone Timeline/m);
});

test("portable skill lists the launch visual styles", () => {
  const result = runNode(["skills/plotbeat/scripts/scaffold.mjs", "--list-styles"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^signal-noir\s+Signal Noir/m);
  assert.match(result.stdout, /^paper-cut\s+Paper Cut/m);
  assert.match(result.stdout, /^studio-blueprint\s+Studio Blueprint/m);
});

test("every published template declares the HyperFrames engine", () => {
  const sources = JSON.parse(fs.readFileSync(path.join(root, "catalog", "sources.json"), "utf8"));
  const manifests = sources.map((source) => path.join(root, source.manifest));
  for (const manifestPath of manifests) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    assert.equal(manifest.engine, "hyperframes");
    assert.ok(manifest.requiredColumns.length >= 2);
    assert.ok(manifest.bestFor.length >= 1);
    assert.ok(manifest.sampleData.endsWith(".csv"));
    assert.ok(manifest.preview.startsWith("/previews/"));
    assert.ok(manifest.previewVideo.startsWith("/previews/"));
    assert.ok(manifest.variants.length >= 2);
  }
});

test("catalog publishes complete visual-style previews", () => {
  const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog", "templates.json"), "utf8"));
  assert.deepEqual(Array.from(catalog.visualStyles, (style) => style.id), [
    "signal-noir", "studio-blueprint", "velvet-ledger", "ember-terminal",
    "paper-cut", "newsroom-ink", "swiss-signal", "soft-organic",
  ]);
  assert.equal(catalog.visualStyles.filter((style) => style.theme === "dark").length, 4);
  assert.equal(catalog.visualStyles.filter((style) => style.theme === "light").length, 4);
  for (const style of catalog.visualStyles) {
    assert.ok(style.preview.startsWith("/previews/style-"));
    assert.ok(style.palette.length >= 4);
  }
});
