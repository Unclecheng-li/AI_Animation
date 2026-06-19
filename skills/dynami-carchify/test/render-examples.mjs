// Re-render every checked-in example from its JSON IR. Run after changing a
// renderer or the template, then commit the refreshed HTML so the golden test
// stays green.

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(skillRoot, '..');

const TARGETS = [
  ['workflow', 'agent-tool-call.workflow.json', 'workflow-agent-tool-call-rendered.html'],
  ['sequence', 'cache-miss-request.sequence.json', 'sequence-cache-miss-request.html'],
  ['dataflow', 'product-analytics.dataflow.json', 'dataflow-product-analytics.html'],
  ['lifecycle', 'agent-run.lifecycle.json', 'lifecycle-agent-run.html'],
  ['architecture', 'web-app.architecture.json', 'web-app-rendered.html'],
];

for (const [mode, input, output] of TARGETS) {
  execFileSync('node', [
    path.join(skillRoot, `renderers/${mode}/render-${mode}.mjs`),
    path.join(skillRoot, 'examples', input),
    path.join(repoRoot, 'examples', output),
  ], { stdio: 'inherit' });
}
