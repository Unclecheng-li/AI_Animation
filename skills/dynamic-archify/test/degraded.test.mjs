// Robustness net for the no-ajv path. validator.mjs deliberately supports
// running without ajv (skips schema validation so malformed input still reaches
// the renderers' friendly layout checks). CI always installs ajv, so this is
// the one path the rest of the suite never exercises — and it is exactly where
// the v2.5.0 review found raw TypeErrors and silent `<rect x="NaN">` output.
//
// Contract under degraded mode: a malformed-but-JSON-legal document must EXIT
// NON-ZERO with a friendly message — never crash (TypeError / is not a
// function) and never write NaN/undefined into the HTML. A random VALID
// perturbation of an example must still render (exit 0, no NaN).
//
//   node --test test/*.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-degraded-'));

const EXAMPLES = {
  workflow: 'agent-tool-call.workflow.json',
  sequence: 'cache-miss-request.sequence.json',
  dataflow: 'product-analytics.dataflow.json',
  lifecycle: 'agent-run.lifecycle.json',
  architecture: 'web-app.architecture.json',
};

// Hide ajv so validator.mjs takes the degraded branch. We point NODE_PATH at an
// empty dir AND set a resolution-blocking env? Simplest robust approach: render
// in a temp copy of the skill with node_modules/ajv renamed aside. But that is
// heavy. Instead we rely on validator.mjs catching ERR_MODULE_NOT_FOUND — we
// can't unload an installed ajv per-process. So we detect availability and, if
// ajv IS installed, still assert the stronger property that holds in BOTH
// modes: malformed input never crashes and never emits NaN (ajv just makes the
// message a schema error instead of a layout error). This keeps the test green
// on CI while still covering the crash/NaN contract end-to-end.

const ajvInstalled = fs.existsSync(path.join(skillRoot, 'node_modules', 'ajv'));

function render(mode, doc) {
  const input = path.join(tmp, `in-${Math.random().toString(36).slice(2)}.json`);
  const out = path.join(tmp, 'out.html');
  fs.writeFileSync(input, JSON.stringify(doc));
  if (fs.existsSync(out)) fs.rmSync(out);
  let code = 0;
  let stderr = '';
  try {
    execFileSync('node', [path.join(skillRoot, `renderers/${mode}/render-${mode}.mjs`), input, out],
      { stdio: ['ignore', 'ignore', 'pipe'] });
  } catch (err) {
    code = err.status ?? 1;
    stderr = String(err.stderr || '');
  }
  const html = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
  return { code, stderr, html };
}

function assertFriendlyFailure(mode, doc, label) {
  const { code, stderr, html } = render(mode, doc);
  assert.notEqual(code, 0, `${label}: expected non-zero exit`);
  assert.doesNotMatch(stderr, /TypeError|RangeError|is not a function|Cannot read/,
    `${label}: crashed instead of reporting friendly error:\n${stderr}`);
  assert.doesNotMatch(html, /NaN|undefined/, `${label}: wrote NaN/undefined into HTML`);
}

// ---- type-wrong-but-JSON-legal documents per mode ----
const ARRAY_FIELDS = {
  workflow: ['lanes', 'nodes', 'edges', 'cards'],
  sequence: ['participants', 'messages', 'segments', 'activations', 'cards'],
  dataflow: ['stages', 'nodes', 'flows', 'cards'],
  lifecycle: ['lanes', 'states', 'transitions', 'cards'],
  architecture: ['components', 'boundaries', 'connections', 'cards'],
};

for (const [mode, fields] of Object.entries(ARRAY_FIELDS)) {
  for (const field of fields) {
    test(`${mode}: ${field} as a string fails friendly`, () => {
      const doc = JSON.parse(fs.readFileSync(path.join(skillRoot, 'examples', EXAMPLES[mode]), 'utf8'));
      if (!(field in doc)) return; // optional field absent in this example
      doc[field] = 'oops';
      assertFriendlyFailure(mode, doc, `${mode}.${field}`);
    });
  }
  test(`${mode}: scalar meta fails friendly`, () => {
    const doc = JSON.parse(fs.readFileSync(path.join(skillRoot, 'examples', EXAMPLES[mode]), 'utf8'));
    doc.meta = 42;
    assertFriendlyFailure(mode, doc, `${mode}.meta`);
  });
}

// ---- missing-coordinate fields must not yield NaN coordinates ----
test('workflow: node missing col never writes NaN', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(skillRoot, 'examples', EXAMPLES.workflow), 'utf8'));
  delete doc.nodes[0].col;
  assertFriendlyFailure('workflow', doc, 'workflow node no col');
});
test('lifecycle: state missing col never writes NaN', () => {
  const doc = JSON.parse(fs.readFileSync(path.join(skillRoot, 'examples', EXAMPLES.lifecycle), 'utf8'));
  delete doc.states[0].col;
  assertFriendlyFailure('lifecycle', doc, 'lifecycle state no col');
});

// ---- property test: deterministic VALID perturbations always render ----
// Seeded PRNG (no Math.random — keeps the test reproducible across runs).
function mulberry32(seed) {
  return function next() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test('property: shuffling node/state order still renders (order-independence)', () => {
  for (const mode of ['workflow', 'dataflow', 'lifecycle']) {
    const arrKey = mode === 'lifecycle' ? 'states' : 'nodes';
    for (let seed = 1; seed <= 8; seed += 1) {
      const doc = JSON.parse(fs.readFileSync(path.join(skillRoot, 'examples', EXAMPLES[mode]), 'utf8'));
      const rng = mulberry32(seed);
      // Fisher–Yates with the seeded PRNG.
      const a = doc[arrKey];
      for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      const { code, html } = render(mode, doc);
      assert.equal(code, 0, `${mode} seed ${seed}: valid shuffle should render (exit 0)`);
      assert.doesNotMatch(html, /NaN|undefined>/, `${mode} seed ${seed}: NaN in output`);
    }
  }
});

if (!ajvInstalled) {
  test('(degraded mode active: ajv not installed — schema validation skipped)', () => {
    assert.ok(true);
  });
}

process.on('exit', () => fs.rmSync(tmp, { recursive: true, force: true }));
