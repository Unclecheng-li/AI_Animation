import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../runtime/plotbeat-data.js", import.meta.url), "utf8");
const context = vm.createContext({ window: {}, Intl, Date, Math, Number, String, Array, Object, Error });
vm.runInContext(source, context);
const { HFDataViz } = context.window;

const data = {
  series: [{
    id: "primary",
    label: "Test",
    points: [
      { date: "2024-01-01", value: 10 },
      { date: "2024-02-01", value: 20 },
      { date: "2024-03-01", value: 15 },
      { date: "2024-04-01", value: 30 },
    ],
  }],
};

test("single-line model is deterministic at arbitrary seek positions", () => {
  const model = HFDataViz.createSingleLineModel(data, { introHold: 0, finaleStart: 0.9 });
  const first = model.renderState(0.4375);
  const later = model.renderState(0.82);
  const second = model.renderState(0.4375);

  assert.equal(first.path, second.path);
  assert.deepEqual(first.endpoint, second.endpoint);
  assert.equal(first.currentValue, second.currentValue);
  assert.notEqual(first.path, later.path);
});

test("single-line model expands visible data and lands on the final value", () => {
  const model = HFDataViz.createSingleLineModel(data, { introHold: 0, finaleStart: 0.9 });
  const start = model.renderState(0);
  const end = model.renderState(0.9);

  assert.equal(start.currentValue, "10.0");
  assert.equal(end.currentValue, "30.0");
  assert.equal(end.dataProgress, 1);
  assert.ok(end.path.startsWith("M "));
  assert.ok(end.areaPath.endsWith(" Z"));
  assert.equal(end.domain.min, 0);
  assert.ok(end.endpoint.x > start.endpoint.x);
});

test("line endpoints grow across the full time domain without snapping right", () => {
  const single = HFDataViz.createSingleLineModel(data, { introHold: 0, finaleStart: 0.9 });
  const singleEarly = single.renderState(0.1);
  const singleWidth = single.config.plotRight - single.config.plotLeft;
  assert.ok(singleEarly.endpoint.x > single.config.plotLeft);
  assert.ok(singleEarly.endpoint.x < single.config.plotLeft + singleWidth * 0.25);

  const multi = HFDataViz.createMultiLineModel({
    series: [
      { id: "a", points: data.series[0].points },
      { id: "b", points: data.series[0].points.map((point) => ({ ...point, value: point.value + 5 })) },
    ],
  }, { introHold: 0, finaleStart: 0.9 });
  const multiEarly = multi.renderState(0.1);
  const multiWidth = multi.config.plotRight - multi.config.plotLeft;
  assert.ok(multiEarly.series[0].endpoint.x > multi.config.plotLeft);
  assert.ok(multiEarly.series[0].endpoint.x < multi.config.plotLeft + multiWidth * 0.25);
});

test("finale state is derived only from normalized progress", () => {
  const model = HFDataViz.createSingleLineModel(data, {
    introHold: 0,
    introEnd: 0.06,
    finaleStart: 0.8,
    finaleDuration: 0.08,
    outroStart: 0.95,
  });
  assert.equal(model.renderState(0.79).finale, 0);
  assert.equal(model.renderState(0.9).finale, 1);
  assert.equal(model.renderState(4).progress, 1);
});

test("opening and closing transitions are smooth, symmetric, and seek-safe", () => {
  const spec = {
    introHold: 0.04,
    introEnd: 0.08,
    finaleStart: 0.82,
    finaleDuration: 0.08,
    outroStart: 0.95,
  };
  const model = HFDataViz.createSingleLineModel(data, spec);
  const closedStart = model.renderState(0);
  const opening = model.renderState(0.04);
  const open = model.renderState(0.2);
  const closing = model.renderState(0.975);
  const closedEnd = model.renderState(1);
  const repeated = model.renderState(0.04);

  assert.equal(closedStart.panelOpen, 0);
  assert.ok(opening.panelOpen > 0 && opening.panelOpen < 1);
  assert.equal(open.panelOpen, 1);
  assert.ok(closing.panelOpen > 0 && closing.panelOpen < 1);
  assert.equal(closedEnd.panelOpen, 0);
  assert.equal(closedStart.seamEnergy, 0);
  assert.ok(opening.seamEnergy > 0);
  assert.deepEqual(opening, repeated);
});

test("multi-line ranks interpolate smoothly and remain deterministic", () => {
  const multi = {
    series: [
      { id: "a", label: "A", points: [{ date: "2024-01-01", value: 10 }, { date: "2024-02-01", value: 30 }, { date: "2024-03-01", value: 20 }] },
      { id: "b", label: "B", points: [{ date: "2024-01-01", value: 30 }, { date: "2024-02-01", value: 10 }, { date: "2024-03-01", value: 40 }] },
      { id: "c", label: "C", points: [{ date: "2024-01-01", value: 20 }, { date: "2024-02-01", value: 20 }, { date: "2024-03-01", value: 15 }] },
    ],
  };
  const model = HFDataViz.createMultiLineModel(multi, { introHold: 0, finaleStart: 0.9 });
  const first = model.renderState(0.25);
  model.renderState(0.8);
  const repeated = model.renderState(0.25);
  const rankA = first.series.find((entry) => entry.id === "a").rank;

  assert.equal(first.series[0].path, repeated.series[0].path);
  assert.equal(rankA, repeated.series.find((entry) => entry.id === "a").rank);
  assert.ok(rankA > 0 && rankA < 2);
  assert.equal(model.renderState(0.9).ranked[0].id, "b");
  assert.equal(model.renderState(0.9).ranked[0].multiplierLabel, "×1.3");
});
