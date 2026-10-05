// Transcribe assets/may_shorts_6.wav via OpenAI Whisper API and emit
// assets/may_shorts_6.json in the same shape as may-shorts-19/may_shorts_19.json
// so the existing captions engine drops in unchanged.
//
// Reads OPENAI_API_KEY from the workspace-root .env (../../.env relative to
// this project). No third-party dependencies — uses Node 18+ fetch + FormData.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const WORKSPACE_ROOT = resolve(PROJECT_ROOT, "..", "..");

async function loadEnv() {
  const envPath = resolve(WORKSPACE_ROOT, ".env");
  const text = await readFile(envPath, "utf8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[m[1]] = v;
  }
  return env;
}

async function main() {
  const env = await loadEnv();
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing from .env");

  const wavPath = resolve(PROJECT_ROOT, "assets", "may_shorts_6.wav");
  const wavBytes = await readFile(wavPath);

  const form = new FormData();
  form.append("file", new Blob([wavBytes], { type: "audio/wav" }), "may_shorts_6.wav");
  form.append("model", "whisper-1");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  form.append("timestamp_granularities[]", "segment");
  form.append("language", "en");

  console.log("Posting to OpenAI Whisper API...");
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Whisper API error ${res.status}: ${txt}`);
  }
  const data = await res.json();

  // Reshape to match may_shorts_19.json:
  //   { text, segments: [{ start, end, text, words: [{word, start, end}, ...] }] }
  // OpenAI returns top-level words[] AND segments[] in verbose_json. We need to
  // bucket the words under their parent segments by time-overlap.
  const segs = (data.segments || []).map((s) => ({
    start: Number(s.start.toFixed(3)),
    end: Number(s.end.toFixed(3)),
    text: s.text,
    words: [],
  }));
  const words = (data.words || []).map((w) => ({
    word: w.word.startsWith(" ") ? w.word : ` ${w.word}`,
    start: Number(w.start.toFixed(3)),
    end: Number(w.end.toFixed(3)),
  }));
  // Bucket words into segments by midpoint
  let segIdx = 0;
  for (const w of words) {
    const mid = (w.start + w.end) / 2;
    while (segIdx < segs.length - 1 && mid > segs[segIdx].end) segIdx++;
    segs[segIdx].words.push(w);
  }

  const out = { text: data.text, segments: segs };
  const outPath = resolve(PROJECT_ROOT, "assets", "may_shorts_6.json");
  await writeFile(outPath, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote ${outPath}`);
  console.log("\n===== TRANSCRIPT =====\n" + data.text + "\n");
  console.log(`Segments: ${segs.length}, Total words: ${words.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
