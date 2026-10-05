import { spawnSync } from "node:child_process";
import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = resolve(projectDir, "assets");
const wavPath = resolve(assetsDir, ".bgm-product-intro.tmp.wav");
const mp3Path = resolve(assetsDir, "bgm-product-intro.mp3");
const sampleRate = 44_100;
const duration = 30;
const sampleCount = sampleRate * duration;
const left = new Float32Array(sampleCount);
const right = new Float32Array(sampleCount);

mkdirSync(assetsDir, { recursive: true });

let randomState = 0x6d2b79f5;
function random() {
  randomState ^= randomState << 13;
  randomState ^= randomState >>> 17;
  randomState ^= randomState << 5;
  return ((randomState >>> 0) / 0xffffffff) * 2 - 1;
}

function midi(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function mix(index, sample, pan = 0) {
  if (index < 0 || index >= sampleCount) return;
  const leftGain = Math.sqrt((1 - pan) / 2);
  const rightGain = Math.sqrt((1 + pan) / 2);
  left[index] += sample * leftGain;
  right[index] += sample * rightGain;
}

function addTone(start, length, frequency, amplitude, pan, shape = "pulse") {
  const from = Math.max(0, Math.floor(start * sampleRate));
  const frames = Math.min(Math.floor(length * sampleRate), sampleCount - from);
  let phase = 0;
  for (let i = 0; i < frames; i += 1) {
    const time = i / sampleRate;
    const release = Math.min(1, (length - time) / (shape === "pad" ? 0.55 : 0.18));
    const attack = Math.min(1, time / (shape === "pad" ? 0.22 : 0.012));
    const decay = shape === "pad" ? 1 : Math.exp(-time * (shape === "bell" ? 3.8 : 6.2));
    const envelope = Math.max(0, attack * release * decay);
    phase += (Math.PI * 2 * frequency) / sampleRate;
    let tone = Math.sin(phase);
    if (shape === "pad") tone += Math.sin(phase * 2.002) * 0.13;
    if (shape === "pulse") tone += Math.sin(phase * 2.005) * 0.18;
    if (shape === "bell") tone += Math.sin(phase * 2.01) * 0.28 + Math.sin(phase * 3.99) * 0.1;
    mix(from + i, tone * envelope * amplitude, pan);
  }
}

function addKick(start, strength = 1) {
  const from = Math.floor(start * sampleRate);
  const frames = Math.min(Math.floor(0.2 * sampleRate), sampleCount - from);
  let phase = 0;
  for (let i = 0; i < frames; i += 1) {
    const time = i / sampleRate;
    const frequency = 52 + 48 * Math.exp(-time * 26);
    phase += (Math.PI * 2 * frequency) / sampleRate;
    mix(from + i, Math.sin(phase) * Math.exp(-time * 20) * 0.46 * strength, 0);
  }
}

function addNoiseHit(start, length, amplitude, pan, softness = 0.82) {
  const from = Math.floor(start * sampleRate);
  const frames = Math.min(Math.floor(length * sampleRate), sampleCount - from);
  let previous = 0;
  for (let i = 0; i < frames; i += 1) {
    const time = i / sampleRate;
    const noise = random();
    const highPassed = noise - previous * softness;
    previous = noise;
    mix(from + i, highPassed * Math.exp(-time * 34) * amplitude, pan);
  }
}

function addSceneCue(start, note) {
  addTone(start, 0.72, midi(note), 0.055, -0.16, "bell");
  addTone(start + 0.08, 0.66, midi(note + 7), 0.042, 0.2, "bell");
  addNoiseHit(start, 0.09, 0.025, 0, 0.9);
}

const tempo = 108;
const beat = 60 / tempo;
const bar = beat * 4;
const chords = [
  { root: 48, notes: [60, 64, 67, 71, 74] },
  { root: 43, notes: [59, 62, 67, 69, 74] },
  { root: 45, notes: [57, 60, 64, 67, 71] },
  { root: 41, notes: [57, 60, 64, 67, 69] },
];
const motif = [72, 76, 79];

for (let barIndex = 0; barIndex < Math.ceil(duration / bar); barIndex += 1) {
  const chord = chords[barIndex % chords.length];
  const barStart = barIndex * bar;

  for (const [index, note] of chord.notes.entries()) {
    addTone(barStart, bar * 0.98, midi(note), 0.017, (index - 2) * 0.12, "pad");
  }

  addTone(barStart, beat * 1.6, midi(chord.root), 0.125, -0.04, "pulse");
  addTone(barStart + beat * 2, beat * 1.45, midi(chord.root + 7), 0.095, 0.03, "pulse");

  for (let beatIndex = 0; beatIndex < 4; beatIndex += 1) {
    const start = barStart + beatIndex * beat;
    if (start >= duration) break;
    const energy = Math.min(1, start / 2.5);
    if (beatIndex === 0 || beatIndex === 2) addKick(start, energy);
    if (beatIndex === 1 || beatIndex === 3) {
      addNoiseHit(start, 0.12, 0.055 * energy, 0.08);
      addTone(start, 0.09, 720, 0.018 * energy, 0.08, "pulse");
    }
    addNoiseHit(start + beat / 2, 0.045, 0.018 * energy, beatIndex % 2 === 0 ? -0.22 : 0.22);
    const pulseNote = chord.notes[(beatIndex + 1) % chord.notes.length] + 12;
    addTone(start + beat * 0.62, beat * 0.46, midi(pulseNote), 0.032, beatIndex % 2 === 0 ? -0.26 : 0.26, "pulse");
  }

  if (barIndex % 2 === 0) {
    motif.forEach((note, index) => {
      addTone(barStart + 0.22 + index * 0.34, 0.62, midi(note), 0.034, -0.22 + index * 0.22, "bell");
    });
  }
}

[5, 10, 15, 20, 25].forEach((time, index) => addSceneCue(time, 72 + (index % 2) * 2));

let peak = 0;
for (let i = 0; i < sampleCount; i += 1) {
  const time = i / sampleRate;
  const fadeIn = Math.min(1, time / 1.2);
  const fadeOut = Math.min(1, (duration - time) / 2);
  const fade = Math.max(0, fadeIn * fadeOut);
  left[i] *= fade;
  right[i] *= fade;
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}

const gain = peak > 0 ? 0.88 / peak : 1;
const wav = Buffer.alloc(44 + sampleCount * 4);
wav.write("RIFF", 0);
wav.writeUInt32LE(wav.length - 8, 4);
wav.write("WAVE", 8);
wav.write("fmt ", 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 4, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(sampleCount * 4, 40);

for (let i = 0; i < sampleCount; i += 1) {
  wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[i] * gain)) * 32767), 44 + i * 4);
  wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[i] * gain)) * 32767), 46 + i * 4);
}

writeFileSync(wavPath, wav);
const result = spawnSync("ffmpeg", [
  "-y", "-hide_banner", "-loglevel", "error", "-i", wavPath,
  "-af", "acompressor=threshold=0.12:ratio=2.2:attack=15:release=180,alimiter=limit=0.9",
  "-codec:a", "libmp3lame", "-b:a", "192k", mp3Path,
], { stdio: "inherit" });
unlinkSync(wavPath);

if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Generated ${mp3Path}`);
