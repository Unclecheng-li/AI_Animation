#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const output = path.resolve(process.argv[2] ?? "data/sample-multi.csv");
const series = [
  { name: "Northstar", base: 42, growth: 2.7, wave: 4.8, phase: 0.1 },
  { name: "Atlas", base: 55, growth: 1.8, wave: 7.5, phase: 1.4 },
  { name: "Mosaic", base: 34, growth: 3.3, wave: 6.2, phase: 2.2 },
  { name: "Kite", base: 61, growth: 1.35, wave: 5.5, phase: 3.1 },
  { name: "Orbit", base: 46, growth: 2.25, wave: 8.1, phase: 4.0 },
  { name: "Cinder", base: 29, growth: 3.7, wave: 5.9, phase: 5.0 },
  { name: "Lumen", base: 51, growth: 1.65, wave: 7.0, phase: 5.8 },
  { name: "Delta", base: 38, growth: 2.9, wave: 6.8, phase: 0.8 },
];

const rows = ["date,series,value"];
for (let month = 0; month < 30; month += 1) {
  const date = new Date(Date.UTC(2022 + Math.floor(month / 12), month % 12, 1)).toISOString().slice(0, 10);
  series.forEach((entry, index) => {
    const crossover = Math.sin((month + entry.phase) * 0.58) * entry.wave;
    const pulse = Math.cos((month * 0.31) + index * 0.73) * 2.4;
    const value = entry.base + entry.growth * month + crossover + pulse;
    rows.push(`${date},${entry.name},${value.toFixed(1)}`);
  });
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${rows.join("\n")}\n`);
process.stdout.write(`Generated ${rows.length - 1} demo rows -> ${path.relative(process.cwd(), output)}\n`);
