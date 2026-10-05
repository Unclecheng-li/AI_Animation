#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const [key, inline] = token.slice(2).split("=", 2);
    if (inline !== undefined) args[key] = inline;
    else if (argv[index + 1] && !argv[index + 1].startsWith("--")) args[key] = argv[++index];
    else args[key] = true;
  }
  return args;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

const args = parseArgs(process.argv.slice(2));
const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(skillDir, "assets", "catalog", "templates.json"), "utf8"));
if (args.list) {
  for (const entry of catalog.templates) {
    process.stdout.write(`${entry.id}\t${entry.dataShape}\t${entry.name}\t${entry.description}\n`);
  }
  process.exit(0);
}
if (args["list-styles"]) {
  for (const entry of catalog.visualStyles ?? []) {
    process.stdout.write(`${entry.id}\t${entry.name}\t${entry.tagline}\n`);
  }
  process.exit(0);
}

const template = args.template ?? catalog.templates[0]?.id;
const manifest = catalog.templates.find((entry) => entry.id === template);
if (!manifest) fail(`Unknown template: ${template}. Choose ${catalog.templates.map((entry) => entry.id).join(" or ")}.`);
if (!args.output) fail("Missing required --output directory. Use --list to inspect templates.");

const sourceDir = path.join(skillDir, "assets", "templates", template);
const outputDir = path.resolve(args.output);
const dangerousTargets = new Set([path.parse(outputDir).root, os.homedir(), process.cwd()]);
if (dangerousTargets.has(outputDir)) fail(`Refusing broad output directory: ${outputDir}`);

if (fs.existsSync(outputDir) && fs.readdirSync(outputDir).length > 0) {
  fail(`Output directory is not empty: ${outputDir}`);
}

fs.mkdirSync(outputDir, { recursive: true });
fs.cpSync(sourceDir, outputDir, { recursive: true });
fs.mkdirSync(path.join(outputDir, "runtime"), { recursive: true });
fs.mkdirSync(path.join(outputDir, "scripts"), { recursive: true });
fs.mkdirSync(path.join(outputDir, "generated"), { recursive: true });
fs.mkdirSync(path.join(outputDir, "data"), { recursive: true });
fs.mkdirSync(path.join(outputDir, "schemas"), { recursive: true });
fs.copyFileSync(path.join(skillDir, "assets", "runtime", "plotbeat-data.js"), path.join(outputDir, "runtime", "plotbeat-data.js"));
fs.copyFileSync(path.join(skillDir, "assets", "runtime", "plotbeat-styles.js"), path.join(outputDir, "runtime", "plotbeat-styles.js"));
const plotbeatRuntime = path.join(skillDir, "assets", "runtime", "plotbeat-template-scenes.js");
if (fs.existsSync(plotbeatRuntime) && !fs.existsSync(path.join(outputDir, "runtime", "plotbeat-template-scenes.js"))) {
  fs.copyFileSync(plotbeatRuntime, path.join(outputDir, "runtime", "plotbeat-template-scenes.js"));
}
fs.copyFileSync(path.join(skillDir, "scripts", "prepare-data.mjs"), path.join(outputDir, "scripts", "prepare-data.mjs"));
fs.copyFileSync(path.join(skillDir, "assets", "schemas", "template.schema.json"), path.join(outputDir, "schemas", "template.schema.json"));

const requestedInput = args.input ? path.resolve(args.input) : null;
if (requestedInput && !fs.existsSync(requestedInput)) fail(`Input file does not exist: ${requestedInput}`);
const inputSource = requestedInput ?? path.join(skillDir, "assets", "samples", manifest.sampleData);
const inputExtension = path.extname(inputSource).toLowerCase() || ".csv";
const localInput = path.join(outputDir, "data", `input${inputExtension}`);
fs.copyFileSync(inputSource, localInput);

const forwarded = [
  "date", "value", "series", "label", "title", "subtitle", "source", "unit", "color",
  "accent-text", "baseline-label", "finale-kicker", "path-style",
  "bar-mode", "stack-mode",
  "scatter-mode", "map-mode", "kpi-mode", "timeline-mode",
  "pace", "style",
  "series-columns", "color-column", "colors",
  "x", "y", "size", "x-label", "y-label", "location", "latitude", "longitude",
  "metric", "target", "change", "unit-column", "suffix-column", "event-title", "description", "category-column",
  "duration", "intro-hold", "finale-start", "decimals", "date-format", "max-ranked",
];
const compilerArgs = [
  path.join(outputDir, "scripts", "prepare-data.mjs"),
  "--template", template,
  "--input", localInput,
  "--output", path.join(outputDir, "generated", "data.js"),
  "--composition", path.join(outputDir, "index.html"),
];
for (const key of forwarded) {
  if (args[key] !== undefined) compilerArgs.push(`--${key}`, String(args[key]));
}

execFileSync(process.execPath, compilerArgs, { stdio: "inherit" });
process.stdout.write(`\nCreated HyperFrames template: ${outputDir}\n`);
process.stdout.write(`Next: cd ${JSON.stringify(outputDir)} && npm test && npx hyperframes check --snapshots --samples 12\n`);
process.stdout.write("Open HyperFrames Studio for preview approval before rendering.\n");
