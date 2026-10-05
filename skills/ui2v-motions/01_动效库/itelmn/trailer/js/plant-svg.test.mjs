import { test } from "node:test";
import assert from "node:assert/strict";
import { PLANT_STAGES, buildPlantSvg } from "./plant-svg.js";

test("all six stages are defined, matching the Remotion PlantStage union", () => {
  assert.deepEqual(PLANT_STAGES, ["seed", "sprout", "sapling", "young_tree", "mature_tree", "blooming"]);
});

test("buildPlantSvg applies the requested rotation and size", () => {
  const svg = buildPlantSvg("blooming", { size: 180, rotateDeg: 1.2 });
  assert.match(svg, /width="180" height="180"/);
  assert.match(svg, /rotate\(1\.2deg\)/);
});

test("each stage produces distinct markup", () => {
  const seed = buildPlantSvg("seed");
  const blooming = buildPlantSvg("blooming");
  assert.notEqual(seed, blooming);
});
