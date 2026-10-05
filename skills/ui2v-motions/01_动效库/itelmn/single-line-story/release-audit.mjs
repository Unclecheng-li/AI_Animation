#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const readBuffer = (relative) => fs.readFileSync(path.join(root, relative));
const exists = (relative) => fs.existsSync(path.join(root, relative));
const catalog = JSON.parse(read("catalog/templates.json"));
const sources = JSON.parse(read("catalog/sources.json"));

assert.equal(catalog.engine, "hyperframes", "Catalog must remain HyperFrames-native.");
assert.equal(catalog.templates.length, sources.length, "Every source must appear in the generated catalog.");
assert.equal(new Set(catalog.templates.map((entry) => entry.id)).size, catalog.templates.length, "Template ids must be unique.");
assert.equal(catalog.visualStyles.length, 8, "The launch catalog must publish eight visual styles.");
assert.equal(catalog.visualStyles.filter((style) => style.theme === "dark").length, 4, "The style catalog must include four dark presets.");
assert.equal(catalog.visualStyles.filter((style) => style.theme === "light").length, 4, "The style catalog must include four light presets.");
for (const style of catalog.visualStyles) {
  assert.equal(exists(`website/public${style.preview}`), true, `${style.id} website style preview is missing.`);
}

const forbiddenClocks = /requestAnimationFrame|setInterval|Date\.now|Math\.random|fetch\s*\(/;
for (const source of sources) {
  const manifest = JSON.parse(read(source.manifest));
  const project = source.project === "." ? "" : `${source.project}/`;
  const htmlPath = `${project}index.html`;
  const html = read(htmlPath);
  const packageJson = JSON.parse(read(`${project}package.json`));
  const requiredManifestFields = ["id", "name", "description", "bestFor", "engine", "resolution", "fps", "duration", "dataShape", "requiredColumns", "displayOrder", "sampleData", "preview", "previewVideo", "variants", "license"];

  for (const field of requiredManifestFields) assert.notEqual(manifest[field], undefined, `${manifest.id ?? source.manifest} is missing ${field}.`);
  assert.equal(manifest.engine, "hyperframes", `${manifest.id} must declare the HyperFrames engine.`);
  assert.equal(catalog.templates.some((entry) => entry.id === manifest.id), true, `${manifest.id} is missing from catalog.`);
  assert.match(html, /window\.__timelines/, `${manifest.id} must register a HyperFrames timeline.`);
  assert.match(html, /gsap\.timeline\(\{\s*paused:\s*true\s*\}\)/, `${manifest.id} timeline must be paused and seek-safe.`);
  assert.match(html, /class="clip"/, `${manifest.id} needs a timed HyperFrames clip.`);
  assert.match(html, /<audio[^>]+id="background-music"[^>]+data-duration="18"[^>]+data-volume="0\.56"/, `${manifest.id} needs the HyperFrames-owned soundtrack bed.`);
  assert.match(html, /tl\.fromTo\(backgroundMusic,[\s\S]+tl\.to\(backgroundMusic,/, `${manifest.id} must animate soundtrack fades on its registered timeline.`);
  assert.match(html, new RegExp(`data-duration="${manifest.duration}"`), `${manifest.id} needs declarative HyperFrames duration synchronized to its manifest.`);
  assert.doesNotMatch(html, forbiddenClocks, `${manifest.id} contains a forbidden playback clock or fetch.`);
  assert.match(Object.values(packageJson.scripts ?? {}).join("\n"), /hyperframes@0\.7\.107/, `${manifest.id} must pin HyperFrames 0.7.107.`);
  assert.equal(exists(source.sample), true, `${manifest.id} sample data is missing.`);
  assert.equal(exists(`${project}assets/audio/upbeat-data-loop.mp3`), true, `${manifest.id} soundtrack asset is missing.`);
  assert.equal(exists(`${project}assets/audio/SOUNDTRACK.md`), true, `${manifest.id} soundtrack provenance is missing.`);
  assert.equal(exists(`website/public${manifest.preview}`), true, `${manifest.id} website preview is missing.`);
  assert.equal(exists(`website/public${manifest.previewVideo}`), true, `${manifest.id} website video preview is missing.`);

  const packagedHtml = `skills/plotbeat/assets/templates/${manifest.id}/index.html`;
  assert.equal(read(packagedHtml), html, `${manifest.id} packaged skill HTML is stale.`);
  const sourceCompositions = `${project}compositions`;
  if (exists(sourceCompositions)) {
    for (const name of fs.readdirSync(path.join(root, sourceCompositions))) {
      const sourceComposition = `${sourceCompositions}/${name}`;
      if (!fs.statSync(path.join(root, sourceComposition)).isFile()) continue;
      assert.equal(
        read(`skills/plotbeat/assets/templates/${manifest.id}/compositions/${name}`),
        read(sourceComposition),
        `${manifest.id}/${name} packaged registry composition is stale.`,
      );
    }
  }
  assert.equal(exists(`skills/plotbeat/assets/templates/${manifest.id}/assets/audio/upbeat-data-loop.mp3`), true, `${manifest.id} packaged soundtrack is missing.`);
  assert.equal(readBuffer(`skills/plotbeat/assets/templates/${manifest.id}/assets/audio/upbeat-data-loop.mp3`).equals(readBuffer(`${project}assets/audio/upbeat-data-loop.mp3`)), true, `${manifest.id} packaged soundtrack binary is stale.`);
  assert.equal(read(`skills/plotbeat/assets/templates/${manifest.id}/assets/audio/SOUNDTRACK.md`), read(`${project}assets/audio/SOUNDTRACK.md`), `${manifest.id} packaged soundtrack provenance is stale.`);
  const packagedPackage = JSON.parse(read(`skills/plotbeat/assets/templates/${manifest.id}/package.json`));
  assert.equal(packagedPackage.devDependencies.hyperframes, "0.7.107", `${manifest.id} scaffold package must pin HyperFrames.`);
}

assert.doesNotMatch(read("runtime/plotbeat-data.js"), forbiddenClocks, "Shared runtime contains a forbidden clock or fetch.");
assert.equal(read("skills/plotbeat/assets/runtime/plotbeat-data.js"), read("runtime/plotbeat-data.js"), "Packaged runtime is stale.");
assert.equal(read("skills/plotbeat/assets/runtime/plotbeat-template-scenes.js"), read("runtime/plotbeat-template-scenes.js"), "Packaged Plotbeat scene runtime is stale.");
assert.equal(read("skills/plotbeat/assets/runtime/plotbeat-styles.js"), read("runtime/plotbeat-styles.js"), "Packaged Plotbeat style runtime is stale.");
assert.equal(read("skills/plotbeat/scripts/prepare-data.mjs"), read("scripts/prepare-data.mjs"), "Packaged compiler is stale.");
assert.equal(read("skills/plotbeat/assets/catalog/templates.json"), read("catalog/templates.json"), "Skill catalog is stale.");
assert.equal(read("website/app/data/templates.json"), read("catalog/templates.json"), "Website catalog is stale.");
assert.match(read("skills/plotbeat/SKILL.md"), /not a standalone video generator or renderer/i);
assert.match(read("skills/plotbeat/SKILL.md"), /Requires the HyperFrames AI skill/i);
assert.match(read("skills/plotbeat/SKILL.md"), /npx skills add heygen-com\/hyperframes --all/i);
assert.match(read("skills/plotbeat/SKILL.md"), /named source, URL, public API, or authorized connector/i);
assert.match(read("skills/plotbeat/SKILL.md"), /dark or light/i);
assert.doesNotMatch(read("website/app/page.tsx"), /Templates, not a renderer/);
assert.match(read("website/app/i18n.ts"), /attach a file or name the data source/i);
assert.match(read("LICENSE"), /MIT License/);
assert.equal(exists("README.md"), true);
const localizedReadmes = ["README.md", "README.zh-CN.md", "README.ja.md", "README.ko.md", "README.es.md", "README.de.md", "README.fr.md", "README.pt-BR.md"];
for (const readme of localizedReadmes) {
  assert.equal(exists(readme), true, `${readme} is missing.`);
  const content = read(readme);
  for (const target of localizedReadmes) {
    assert.match(content, new RegExp(`href="${target.replace(".", "\\.")}"`), `${readme} must link to ${target}.`);
  }
}
assert.equal(exists("CONTRIBUTING.md"), true);

process.stdout.write(`Release audit passed: ${catalog.templates.length} HyperFrames templates, synchronized skill assets, gallery catalog, and engine-boundary checks.\n`);
