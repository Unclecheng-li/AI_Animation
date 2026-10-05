#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const skill = path.join(root, "skills", "plotbeat");
const sources = JSON.parse(fs.readFileSync(path.join(root, "catalog", "sources.json"), "utf8"));
const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog", "templates.json"), "utf8"));

function copy(source, destination) {
  const destinationPath = path.join(skill, destination);
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(path.join(root, source), destinationPath);
}

const shared = [
  ["runtime/plotbeat-data.js", "assets/runtime/plotbeat-data.js"],
  ["runtime/plotbeat-template-scenes.js", "assets/runtime/plotbeat-template-scenes.js"],
  ["runtime/plotbeat-styles.js", "assets/runtime/plotbeat-styles.js"],
  ["scripts/prepare-data.mjs", "scripts/prepare-data.mjs"],
  ["data/sample-single.csv", "assets/samples/sample-single.csv"],
  ["data/sample-multi.csv", "assets/samples/sample-multi.csv"],
  ["data/sample-scatter.csv", "assets/samples/sample-scatter.csv"],
  ["data/sample-map.csv", "assets/samples/sample-map.csv"],
  ["data/sample-kpi.csv", "assets/samples/sample-kpi.csv"],
  ["data/sample-milestones.csv", "assets/samples/sample-milestones.csv"],
  ["schemas/template.schema.json", "assets/schemas/template.schema.json"],
  ["catalog/templates.json", "assets/catalog/templates.json"],
];

const templateFiles = [
  "index.html",
  "index.motion.json",
  "hyperframes.json",
  "frame.md",
  "BRIEF.md",
  "template.json",
  "generated/data.js",
  "assets/audio/upbeat-data-loop.mp3",
  "assets/audio/SOUNDTRACK.md",
];

const optionalTemplateFiles = [
  "runtime/plotbeat-template-scenes.js",
];

function copyDirectoryIfPresent(source, destination) {
  const sourcePath = path.join(root, source);
  if (!fs.existsSync(sourcePath)) return;
  const destinationPath = path.join(skill, destination);
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.cpSync(sourcePath, destinationPath, { recursive: true });
}
const activeTemplateIds = new Set(catalog.templates.map((entry) => entry.id));
const packagedTemplatesRoot = path.join(skill, "assets", "templates");

if (fs.existsSync(packagedTemplatesRoot)) {
  for (const entry of fs.readdirSync(packagedTemplatesRoot, { withFileTypes: true })) {
    if (entry.isDirectory() && !activeTemplateIds.has(entry.name)) {
      fs.rmSync(path.join(packagedTemplatesRoot, entry.name), { recursive: true, force: true });
    }
  }
}

shared.forEach(([source, destination]) => copy(source, destination));
for (const source of sources) {
  const sourceManifest = JSON.parse(fs.readFileSync(path.join(root, source.manifest), "utf8"));
  const template = catalog.templates.find((entry) => entry.id === sourceManifest.id);
  if (!template) throw new Error(`Catalog is missing ${sourceManifest.id}. Run npm run catalog.`);
  for (const file of templateFiles) {
    copy(path.join(source.project, file), path.join("assets", "templates", template.id, file));
  }
  for (const file of optionalTemplateFiles) {
    const sourceFile = path.join(root, source.project, file);
    if (fs.existsSync(sourceFile)) copy(path.join(source.project, file), path.join("assets", "templates", template.id, file));
  }
  copyDirectoryIfPresent(
    path.join(source.project, "compositions"),
    path.join("assets", "templates", template.id, "compositions"),
  );
  copy(source.sample, path.join("assets", "samples", template.sampleData));
  const manifestPath = path.join(skill, "assets", "templates", template.id, "template.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.$schema = "schemas/template.schema.json";
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const packageJson = {
    name: `hyperframes-${template.id}`,
    version: catalog.version,
    private: true,
    type: "module",
    license: template.license,
    scripts: {
      test: "node --check scripts/prepare-data.mjs && node --check runtime/plotbeat-data.js && node --check runtime/plotbeat-styles.js",
      preview: "npx --yes hyperframes@0.7.107 preview",
      check: "npx --yes hyperframes@0.7.107 check",
      render: "npx --yes hyperframes@0.7.107 render",
    },
    devDependencies: { hyperframes: "0.7.107" },
  };
  fs.writeFileSync(path.join(skill, "assets", "templates", template.id, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
}

process.stdout.write("Packaged HyperFrames template assets into the portable skill.\n");
