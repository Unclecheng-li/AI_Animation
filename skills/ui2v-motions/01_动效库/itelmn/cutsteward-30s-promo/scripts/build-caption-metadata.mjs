import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "..");
const voiceDelaySeconds = 0.55;

// Audio boundaries follow the source waveform's detected pauses. Caption
// boundaries add only a few milliseconds of reading headroom.
const phrases = [
  {
    text: "Start in Cut Steward,",
    audioStart: 0.633,
    audioEnd: 1.704,
    captionStart: 0.620,
    captionEnd: 1.720,
  },
  {
    text: "the governed AI video studio.",
    audioStart: 1.906,
    audioEnd: 3.466,
    captionStart: 1.890,
    captionEnd: 3.480,
  },
  {
    text: "Describe the outcome,",
    audioStart: 4.247,
    audioEnd: 5.118,
    captionStart: 4.230,
    captionEnd: 5.135,
  },
  {
    text: "then choose how closely you want to guide it.",
    audioStart: 5.285,
    audioEnd: 6.774,
    captionStart: 5.270,
    captionEnd: 6.795,
  },
  {
    text: "Review rights before anything runs.",
    audioStart: 7.618,
    audioEnd: 9.176,
    captionStart: 7.600,
    captionEnd: 9.190,
  },
  {
    text: "Inspect every planned shot.",
    audioStart: 9.311,
    audioEnd: 10.555,
    captionStart: 9.295,
    captionEnd: 10.575,
  },
  {
    text: "Then open a separate verified delivery",
    audioStart: 11.311,
    audioEnd: 14.335,
    captionStart: 11.295,
    captionEnd: 14.350,
  },
  {
    text: "to review the exact master,",
    audioStart: 14.478,
    audioEnd: 15.488,
    captionStart: 14.460,
    captionEnd: 15.505,
  },
  {
    text: "its full-decode check,",
    audioStart: 16.014,
    audioEnd: 16.853,
    captionStart: 15.995,
    captionEnd: 16.870,
  },
  {
    text: "SHA-256 hash,",
    audioStart: 16.963,
    audioEnd: 17.908,
    captionStart: 16.945,
    captionEnd: 17.925,
  },
  {
    text: "and approval evidence.",
    audioStart: 18.025,
    audioEnd: 18.707,
    captionStart: 18.005,
    captionEnd: 18.725,
  },
  {
    text: "One clear, local production record—",
    audioStart: 19.432,
    audioEnd: 21.079,
    captionStart: 19.410,
    captionEnd: 21.095,
  },
  {
    text: "from first plan to final release truth.",
    audioStart: 21.506,
    audioEnd: 23.173,
    captionStart: 21.490,
    captionEnd: 23.195,
  },
];

const timingWeightOverrides = new Map([
  ["AI", 2],
  ["full-decode", 3],
  ["SHA-256", 5],
]);

function timingWeight(token) {
  const bare = token.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9-]+$/g, "");
  if (timingWeightOverrides.has(bare)) return timingWeightOverrides.get(bare);
  const vowelGroups = bare.toLowerCase().match(/[aeiouy]+/g)?.length ?? 1;
  return Math.max(1, vowelGroups);
}

function buildSourceWords() {
  const words = [];
  let wordIndex = 0;

  for (const phrase of phrases) {
    const tokens = phrase.text.split(/\s+/).filter(Boolean);
    const sourceStart = phrase.audioStart - voiceDelaySeconds;
    const sourceEnd = phrase.audioEnd - voiceDelaySeconds;
    const gap = tokens.length > 1 ? 0.018 : 0;
    const usableDuration = sourceEnd - sourceStart - gap * (tokens.length - 1);
    const weights = tokens.map(timingWeight);
    const totalWeight = weights.reduce((sum, value) => sum + value, 0);
    let cursor = sourceStart;

    tokens.forEach((token, tokenIndex) => {
      const duration = usableDuration * (weights[tokenIndex] / totalWeight);
      const end = tokenIndex === tokens.length - 1 ? sourceEnd : cursor + duration;
      words.push({
        id: `w${wordIndex}`,
        text: token,
        start: Number(cursor.toFixed(3)),
        end: Number(end.toFixed(3)),
      });
      wordIndex += 1;
      cursor = end + gap;
    });
  }

  return words;
}

function timestamp(seconds, separator) {
  const totalMilliseconds = Math.round(seconds * 1000);
  const hours = Math.floor(totalMilliseconds / 3_600_000);
  const minutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const wholeSeconds = Math.floor((totalMilliseconds % 60_000) / 1000);
  const milliseconds = totalMilliseconds % 1000;
  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    `${String(wholeSeconds).padStart(2, "0")}${separator}${String(milliseconds).padStart(3, "0")}`,
  ].join(":");
}

function buildSrt() {
  return `${phrases
    .map(
      (phrase, index) =>
        `${index + 1}\n${timestamp(phrase.captionStart, ",")} --> ${timestamp(phrase.captionEnd, ",")}\n${phrase.text}`,
    )
    .join("\n\n")}\n`;
}

function buildVtt() {
  return `WEBVTT\n\n${phrases
    .map(
      (phrase, index) =>
        `${index + 1}\n${timestamp(phrase.captionStart, ".")} --> ${timestamp(phrase.captionEnd, ".")}\n${phrase.text}`,
    )
    .join("\n\n")}\n`;
}

const sourceWords = buildSourceWords();
const sourcePhrases = phrases.map((phrase, index) => ({
  id: `p${index}`,
  text: phrase.text,
  start: Number((phrase.audioStart - voiceDelaySeconds).toFixed(3)),
  end: Number((phrase.audioEnd - voiceDelaySeconds).toFixed(3)),
}));
const timelinePhrases = phrases.map((phrase, index) => ({
  id: `p${index}`,
  text: phrase.text,
  start: phrase.audioStart,
  end: phrase.audioEnd,
  caption_start: phrase.captionStart,
  caption_end: phrase.captionEnd,
}));

const metadata = {
  schema_version: "1.0",
  tts_provider: "elevenlabs_web",
  voice_id: "Ben - Deep, Warm, Conversational",
  bgm: {
    path: ".media/audio/bgm/bgm_001.mp3",
    title: "Close Up",
    source_duration_s: 95.137959,
    source_start_s: 0,
    timeline_start_s: 0,
    timeline_end_s: 30,
    fade_in_s: 0.8,
    fade_out_start_s: 27.8,
    fade_out_end_s: 30,
    sidechain: {
      threshold: 0.015,
      ratio: 5,
      attack_ms: 20,
      release_ms: 450,
      measured_under_voice_lufs_before_master: -40.72,
      measured_cta_tail_lufs_before_master: -28.56,
      measured_ducking_difference_lu: 12.16,
    },
    sha256: "a7f05a29d07a84d38072ccd2b35204bca812db86e75b2a837e71cc144d3e739b",
  },
  bgm_pending: false,
  voices: [
    {
      id: "narration",
      path: "assets/elevenlabs/cutsteward-voice-ben-v3.mp3",
      duration_s: 22.831,
      timeline_start_s: 0.55,
      timeline_end_s: 23.381,
      speech_onset_s: 0.083,
      speech_end_s: 22.623,
      timeline_speech_onset_s: 0.633,
      timeline_speech_end_s: 23.173,
      phrase_timing_method: "script-constrained waveform pause boundaries",
      word_timing_method: "syllable-weighted interpolation inside waveform-aligned phrases",
      phrases: sourcePhrases,
      words: sourceWords,
      sha256: "bfd7b5939e9f059d0262535065f45f35bf83ea285ece155995723e0daa05432f",
    },
  ],
  sfx: [],
  captions: {
    srt: "captions/cutsteward-30s.srt",
    vtt: "captions/cutsteward-30s.vtt",
    cue_count: phrases.length,
    timeline_phrases: timelinePhrases,
  },
  mix: {
    path: "assets/audio/cutsteward-30s-mix.wav",
    codec: "pcm_s16le",
    sample_rate_hz: 48000,
    channels: 2,
    duration_s: 30,
    duration_samples: 1440000,
    size_bytes: 5760078,
    integrated_lufs: -16.26,
    true_peak_dbtp: -1,
    loudness_range_lu: 5.9,
    full_decode: "passed",
    speech_free_cta_tail_s: 6.827,
    voice_asset_free_cta_tail_s: 6.619,
    sha256: "ab57a8a237e3c2432da93cd321050c3dc24dd08dc2410066695cda3d49aacdc2",
    public_composition_path: "assets/audio/cutsteward-30s-mix.m4a",
    public_composition_codec: "aac",
    public_composition_duration_s: 30,
    public_composition_size_bytes: 757204,
    public_composition_sha256: "490e727dad51eef63209db8aa67072d60e33793ba111bb8ad310ff2ff3c5a7c2",
  },
  total_duration_s: 30,
};

await mkdir(path.join(projectDir, "captions"), { recursive: true });
await writeFile(path.join(projectDir, "captions", "cutsteward-30s.srt"), buildSrt(), "utf8");
await writeFile(path.join(projectDir, "captions", "cutsteward-30s.vtt"), buildVtt(), "utf8");
await writeFile(
  path.join(projectDir, "audio_meta.json"),
  `${JSON.stringify(metadata, null, 2)}\n`,
  "utf8",
);
