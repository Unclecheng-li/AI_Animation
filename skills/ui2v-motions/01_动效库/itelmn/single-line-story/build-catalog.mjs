#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sourcesPath = path.join(root, "catalog", "sources.json");
const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
const visualStyles = JSON.parse(fs.readFileSync(path.join(root, "catalog", "styles.json"), "utf8"));

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

const templates = sources.map((source) => {
  const manifestPath = path.join(root, source.manifest);
  if (!fs.existsSync(manifestPath)) fail(`Missing template manifest: ${source.manifest}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.engine !== "hyperframes") fail(`${manifest.id ?? source.manifest} must declare engine: hyperframes.`);
  if (!fs.existsSync(path.join(root, source.project, "index.html"))) fail(`${manifest.id} has no HyperFrames index.html.`);
  if (!fs.existsSync(path.join(root, source.sample))) fail(`${manifest.id} sample is missing: ${source.sample}`);
  return manifest;
});

const ids = templates.map((template) => template.id);
if (new Set(ids).size !== ids.length) fail("Template ids must be unique.");
templates.sort((a, b) => a.displayOrder - b.displayOrder || a.id.localeCompare(b.id));

const catalog = {
  version: JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version,
  engine: "hyperframes",
  visualStyles,
  templates,
};
const serialized = `${JSON.stringify(catalog, null, 2)}\n`;
const outputs = [
  path.join(root, "catalog", "templates.json"),
  path.join(root, "website", "app", "data", "templates.json"),
];

for (const output of outputs) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, serialized);
}

process.stdout.write(`Built a ${templates.length}-template HyperFrames catalog.\n`);
