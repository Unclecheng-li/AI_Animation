#!/usr/bin/env node
// Write index.html for one format (and optionally one scene) from project.json.
// Usage (from the project root):
//   node <skill>/scripts/shells.mjs                  -> primary format, whole film
//   node <skill>/scripts/shells.mjs wide             -> a specific format
//   node <skill>/scripts/shells.mjs vertical --solo hook   -> one scene alone, from 0
//
// project.json:
//   { "fps": 30, "bpm": 120, "beatOffset": 0,
//     "formats": ["vertical", "square", "wide"],
//     "scenes": [{ "id": "hook", "beats": 12 }, { "id": "demo", "beats": 20 }] }
// With scenes, the film's duration is computed from them and written back to
// project.json ("duration") so every other tool reads the same length.
// Only one index.html exists at a time: HyperFrames expects a single root composition.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FORMATS = {
  vertical: { W: 1080, H: 1920, RES: "portrait" },
  square:   { W: 1080, H: 1080, RES: "square" },
  wide:     { W: 1920, H: 1080, RES: "landscape" },
};

const here = dirname(fileURLToPath(import.meta.url));
const shell = readFileSync(join(here, "..", "templates", "shell.html"), "utf8");
const cfg = JSON.parse(readFileSync("project.json", "utf8"));

const args = process.argv.slice(2);
let solo = "";
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--solo") { solo = args[++i] || ""; continue; }
  positional.push(args[i]);
}
if (args.includes("--solo") && !solo) throw new Error("--solo needs a scene id");
const name = positional[0] || (cfg.formats && cfg.formats[0]);

if (!Array.isArray(cfg.formats) || cfg.formats.length === 0) throw new Error("project.json needs a non-empty formats array");
const f = FORMATS[name];
if (!f) throw new Error(`Unknown format "${name}". Use: ${Object.keys(FORMATS).join(", ")}`);

const bpm = cfg.bpm ?? 120;
const offset = cfg.beatOffset ?? 0;
const scenes = cfg.scenes || [];
const beatLen = 60 / bpm;
const round = (x) => Math.round(x * 1000) / 1000;

let duration = cfg.duration;
if (scenes.length) {
  const total = round(offset + scenes.reduce((a, s) => a + s.beats, 0) * beatLen);
  if (cfg.duration !== total) { cfg.duration = total; writeFileSync("project.json", JSON.stringify(cfg, null, 2) + "\n"); }
  duration = total;
}
if (solo) {
  const sc = scenes.find((s) => s.id === solo);
  if (!sc) throw new Error(`No scene "${solo}" in project.json. Scenes: ${scenes.map((s) => s.id).join(", ")}`);
  duration = round(sc.beats * beatLen);
}
if (!duration) throw new Error("project.json needs either scenes or a duration");

// Scene sections are written into the HTML (not created by JS) so HyperFrames' runtime
// sees them at load and shows/hides each one on its own window of the clock.
let t0 = solo ? 0 : offset;
const sections = scenes
  .map((sc) => {
    const len = round(sc.beats * beatLen);
    if (solo && sc.id !== solo) return null;
    const html = `      <section id="scene-${sc.id}" class="clip scene" data-start="${round(t0)}" data-duration="${len}" data-track-index="0"></section>`;
    t0 += len;
    return html;
  })
  .filter(Boolean).join("\n");

const fontsLink = existsSync("fonts.css") ? '    <link rel="stylesheet" href="fonts.css" />' : "";
const sceneFiles = existsSync("src/scenes") ? readdirSync("src/scenes").filter((x) => x.endsWith(".js")).sort() : [];
const tags = sceneFiles.map((x) => `    <script src="src/scenes/${x}"></script>`).join("\n");
const scenesAttr = JSON.stringify(scenes.map(({ id, beats }) => ({ id, beats }))).replaceAll("'", "&#39;");

const html = shell
  .replaceAll("{{W}}", f.W).replaceAll("{{H}}", f.H).replaceAll("{{RES}}", f.RES)
  .replaceAll("{{NAME}}", name).replaceAll("{{DUR}}", duration).replaceAll("{{FPS}}", cfg.fps ?? 30)
  .replaceAll("{{BPM}}", bpm).replaceAll("{{OFFSET}}", solo ? 0 : offset)
  .replaceAll("{{SOLO}}", solo).replaceAll("{{SCENES}}", scenesAttr).replaceAll("{{SCENE_SCRIPTS}}", tags).replaceAll("{{FONTS}}", fontsLink).replaceAll("{{SECTIONS}}", sections);
writeFileSync("index.html", html);
console.log(`index.html -> ${name} ${f.W}x${f.H}, ${duration}s @ ${cfg.fps ?? 30}fps${solo ? `, solo scene "${solo}"` : ""}`);
