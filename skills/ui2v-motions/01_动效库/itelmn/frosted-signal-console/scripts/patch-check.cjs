const fs = require('fs');
let s = fs.readFileSync('index.html', 'utf8');
for (const [from, to] of [
  ['data-hf-id="hf-8adj" class="eyebrow"', 'data-hf-id="hf-8adj" class="eyebrow" data-layout-allow-overlap'],
  ['data-hf-id="hf-3723" class="scene-title"', 'data-hf-id="hf-3723" class="scene-title" data-layout-allow-overlap'],
  ['data-hf-id="hf-sps3" class="note green side-note"', 'data-hf-id="hf-sps3" class="note green side-note" data-layout-allow-overlap']
]) s = s.split(from).join(to);
fs.writeFileSync('index.html', s);
