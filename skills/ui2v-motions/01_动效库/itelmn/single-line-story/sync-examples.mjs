#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const runtimeSource = path.join(root, "runtime", "plotbeat-data.js");
const runtimeDestinations = [
  path.join(root, "examples", "multi-line-rank", "runtime", "plotbeat-data.js"),
];
const styleSource = path.join(root, "runtime", "plotbeat-styles.js");
const styleDestinations = [
  "examples/multi-line-rank",
  "examples/bar-race",
  "examples/stacked-area-story",
  "examples/scatter-journey",
  "examples/animated-map",
  "examples/kpi-dashboard",
  "examples/milestone-timeline",
].map((project) => path.join(root, project, "runtime", "plotbeat-styles.js"));

runtimeDestinations.forEach((destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(runtimeSource, destination);
  process.stdout.write(`Synced ${path.relative(root, destination)}\n`);
});

styleDestinations.forEach((destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(styleSource, destination);
  process.stdout.write(`Synced ${path.relative(root, destination)}\n`);
});
