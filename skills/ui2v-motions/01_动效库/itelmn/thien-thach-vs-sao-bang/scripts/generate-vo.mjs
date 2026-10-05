// One-off TTS generation for the thien-thach-vs-sao-bang video narration.
// Supports three providers via TTS_PROVIDER in repo-root .env:
//   "vieneu" (local)  — VieNeu TTS API (CIT Voice Studio), fast & high quality local inference
//   "edge"           — Microsoft Edge TTS (free, no API key), via edge-tts-universal npm package
//   "vbee"           — Vbee TTS API, requires VBEE_APP_ID + VBEE_ACCESS_TOKEN
// Generates one mp3 per caption line, downloads to assets/vo/, and writes
// assets/vo/durations.json (via ffprobe) so index.html timing can be retimed
// to real audio length.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..", "..");

function loadEnv() {
  const raw = fs.readFileSync(path.join(REPO_ROOT, ".env"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const m = line.trim().match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

const ENV = loadEnv();
const TTS_PROVIDER = (ENV.TTS_PROVIDER || "vieneu").toLowerCase();

// --- VieNeu TTS config (only required when TTS_PROVIDER=vieneu) ---
const VIENEU_API_URL = (ENV.VIENEU_API_URL || "http://127.0.0.1:8001").replace(/\/+$/, "");
const VIENEU_VOICE = ENV.VIENEU_VOICE || "Minh Đức";
const VIENEU_SPEED = parseFloat(ENV.VIENEU_SPEED) || 1.0;

// --- Vbee config (only required when TTS_PROVIDER=vbee) ---
const VBEE_APP_ID = ENV.VBEE_APP_ID;
const VBEE_ACCESS_TOKEN = ENV.VBEE_ACCESS_TOKEN;
const VOICE_CODE = ENV.VBEE_VOICE_CODE || "n_hanoi_male_protrainer_education_vc";

// --- Edge TTS config (only required when TTS_PROVIDER=edge) ---
const EDGE_VOICE = ENV.EDGE_VOICE || "vi-VN-NamMinhNeural";

const SPEED_RATE = 1.1;

if (TTS_PROVIDER === "vbee") {
  if (!VBEE_APP_ID || !VBEE_ACCESS_TOKEN) {
    throw new Error(
      "TTS_PROVIDER=vbee nhưng thiếu VBEE_APP_ID / VBEE_ACCESS_TOKEN trong .env.\n" +
        "Điền credentials Vbee, hoặc đổi TTS_PROVIDER=vieneu / edge.",
    );
  }
}

console.log(`TTS provider: ${TTS_PROVIDER}`);

const LINES = [
  { id: "line-1", text: "Đây là thiên thạch." },
  { id: "line-2", text: "Đây là sao băng." },
  { id: "line-3", text: "Sự khác nhau là gì?" },
  { id: "line-4", text: "Thiên thạch là đá hoặc kim loại từ vũ trụ." },
  { id: "line-5", text: "Nó thực sự rơi xuống và chạm đất." },
  { id: "line-6", text: "Còn sao băng chỉ là ánh sáng thôi." },
  { id: "line-7", text: "Đó là bụi vũ trụ đang cháy trong khí quyển." },
  { id: "line-8", text: "Một cái chạm đất, một cái thì không!" },
];

// ============================================================
// Edge TTS — Node.js API via edge-tts-universal (no Python needed)
// ============================================================

function speedRateToEdgeRate(rate) {
  const pct = Math.round((rate - 1) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}

async function generateEdgeSpeech(text, outPath) {
  const { EdgeTTS } = await import("edge-tts-universal");
  const rate = speedRateToEdgeRate(SPEED_RATE);
  const tts = new EdgeTTS(text, EDGE_VOICE, { rate });
  const result = await tts.synthesize();
  const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
  fs.writeFileSync(outPath, audioBuffer);
}

// ============================================================
// VieNeu TTS — REST API (CIT Voice Studio / VieNeu-TTS)
// ============================================================

async function generateVieNeuSpeech(text, outPath) {
  const url = `${VIENEU_API_URL}/api/tts/generate`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voice_id: VIENEU_VOICE || undefined,
      speed: VIENEU_SPEED,
      format: "mp3",
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`VieNeu TTS HTTP ${res.status}: ${res.statusText} ${errText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
}

// ============================================================
// Vbee TTS — REST API (giữ nguyên logic cũ)
// ============================================================

async function generateVbeeSpeech(text) {
  const res = await fetch("https://vbee.vn/api/v1/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VBEE_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      app_id: VBEE_APP_ID,
      input_text: text,
      voice_code: VOICE_CODE,
      audio_type: "mp3",
      speed_rate: SPEED_RATE,
      callback_url: "https://example.com/callback",
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const data = await res.json();
  if (data.status !== 1) {
    throw new Error(`Vbee error: ${data.error_message || data.error_code}`);
  }
  if (data.result?.audio_link) return data.result.audio_link;
  const requestId = data.result?.request_id;
  if (!requestId) throw new Error("No request_id returned");
  return pollForAudio(requestId);
}

async function pollForAudio(requestId) {
  const url = `https://vbee.vn/api/v1/tts/${requestId}`;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VBEE_ACCESS_TOKEN}`,
      },
    });
    if (!res.ok) continue;
    const data = await res.json();
    if (data.status === 1) {
      if (data.result?.status === "SUCCESS" && data.result?.audio_link) {
        return data.result.audio_link;
      }
      if (data.result?.status === "FAILURE") {
        throw new Error("Vbee processing failed");
      }
    }
  }
  throw new Error("Timeout waiting for Vbee audio");
}

async function downloadAudio(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
}

// ============================================================
// Shared
// ============================================================

async function getDuration(filePath) {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ]);
  return parseFloat(stdout.trim());
}

async function main() {
  const outDir = path.join(ROOT, "assets", "vo");
  fs.mkdirSync(outDir, { recursive: true });
  const durations = {};

  if (TTS_PROVIDER === "vieneu") {
    try {
      const health = await fetch(`${VIENEU_API_URL}/health`, { signal: AbortSignal.timeout(3000) });
      if (!health.ok) {
        console.warn(`[VieNeu] Cảnh báo: Server trả về HTTP ${health.status}`);
      }
    } catch (err) {
      throw new Error(
        `TTS_PROVIDER=vieneu nhưng không kết nối được tới ${VIENEU_API_URL}.\n` +
          "Hãy đảm bảo server VieNeu TTS (CIT Voice Studio) đang chạy tại địa chỉ này.",
      );
    }
  }

  for (const line of LINES) {
    const outPath = path.join(outDir, `${line.id}.mp3`);
    process.stdout.write(`Generating ${line.id}: "${line.text}" ... `);

    if (TTS_PROVIDER === "edge") {
      await generateEdgeSpeech(line.text, outPath);
    } else if (TTS_PROVIDER === "vieneu") {
      await generateVieNeuSpeech(line.text, outPath);
    } else {
      const audioUrl = await generateVbeeSpeech(line.text);
      await downloadAudio(audioUrl, outPath);
    }

    const dur = await getDuration(outPath);
    durations[line.id] = dur;
    console.log(`${dur.toFixed(2)}s`);
  }

  fs.writeFileSync(
    path.join(outDir, "durations.json"),
    JSON.stringify(durations, null, 2),
  );
  console.log("Done. Durations written to assets/vo/durations.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
