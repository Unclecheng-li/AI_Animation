import { spawnSync } from "node:child_process";
import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = resolve(projectDir, "assets");
const wavPath = resolve(assetsDir, ".bgm-mobility.tmp.wav");
const mp3Path = resolve(assetsDir, "bgm-mobility.mp3");
const sampleRate = 44_100;
const duration = 35;
const sampleCount = sampleRate * duration;
const left = new Float32Array(sampleCount);
const right = new Float32Array(sampleCount);

mkdirSync(assetsDir, { recursive: true });

let randomState = 0x71f4a2d3;
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
    const attack = Math.min(1, time / (shape === "pad" ? 0.24 : 0.01));
    const release = Math.min(1, (length - time) / (shape === "pad" ? 0.6 : 0.18));
    const decay = shape === "pad" ? 1 : Math.exp(-time * (shape === "bell" ? 3.4 : 5.8));
    phase += (Math.PI * 2 * frequency) / sampleRate;
    let tone = Math.sin(phase);
    if (shape === "pad") tone += Math.sin(phase * 2.001) * 0.12;
    if (shape === "pulse") tone += Math.sin(phase * 2.003) * 0.2;
    if (shape === "bell") tone += Math.sin(phase * 2.01) * 0.28 + Math.sin(phase * 4.02) * 0.08;
    mix(from + i, tone * attack * release * decay * amplitude, pan);
  }
}

function addKick(start, strength = 1) {
  const from = Math.floor(start * sampleRate);
  const frames = Math.min(Math.floor(0.2 * sampleRate), sampleCount - from);
  let phase = 0;
  for (let i = 0; i < frames; i += 1) {
    const time = i / sampleRate;
    const frequency = 50 + 55 * Math.exp(-time * 28);
    phase += (Math.PI * 2 * frequency) / sampleRate;
    mix(from + i, Math.sin(phase) * Math.exp(-time * 20) * 0.48 * strength, 0);
  }
}

function addNoise(start, length, amplitude, pan, damping = 0.84) {
  const from = Math.floor(start * sampleRate);
  const frames = Math.min(Math.floor(length * sampleRate), sampleCount - from);
  let previous = 0;
  for (let i = 0; i < frames; i += 1) {
    const time = i / sampleRate;
    const noise = random();
    const filtered = noise - previous * damping;
    previous = noise;
    mix(from + i, filtered * Math.exp(-time * 38) * amplitude, pan);
  }
}

function addStationCue(start, note) {
  addTone(start, 0.72, midi(note), 0.05, -0.18, "bell");
  addTone(start + 0.09, 0.62, midi(note + 7), 0.038, 0.18, "bell");
  addNoise(start, 0.08, 0.02, 0, 0.9);
}

const tempo = 112;
const beat = 60 / tempo;
const bar = beat * 4;
const chords = [
  { root: 48, notes: [60, 64, 67, 71, 74] },
  { root: 45, notes: [57, 60, 64, 67, 71] },
  { root: 41, notes: [57, 60, 64, 67, 69] },
  { root: 43, notes: [59, 62, 67, 69, 74] },
];
const motif = [72, 76, 79];

for (let barIndex = 0; barIndex < Math.ceil(duration / bar); barIndex += 1) {
  const chord = chords[barIndex % chords.length];
  const barStart = barIndex * bar;
  for (const [index, note] of chord.notes.entries()) {
    addTone(barStart, bar * 0.98, midi(note), 0.016, (index - 2) * 0.12, "pad");
  }
  addTone(barStart, beat * 1.7, midi(chord.root), 0.12, -0.03, "pulse");
  addTone(barStart + beat * 2, beat * 1.5, midi(chord.root + 7), 0.09, 0.04, "pulse");
  for (let beatIndex = 0; beatIndex < 4; beatIndex += 1) {
    const start = barStart + beatIndex * beat;
    if (start >= duration) break;
    const energy = Math.min(1, start / 2.8);
    if (beatIndex === 0 || beatIndex === 2) addKick(start, energy);
    if (beatIndex === 1 || beatIndex === 3) {
      addNoise(start, 0.12, 0.052 * energy, 0.08);
      addTone(start, 0.08, 760, 0.016 * energy, 0.08, "pulse");
    }
    addNoise(start + beat / 2, 0.045, 0.017 * energy, beatIndex % 2 === 0 ? -0.24 : 0.24);
    const note = chord.notes[(beatIndex + barIndex) % chord.notes.length] + 12;
    addTone(start + beat * 0.64, beat * 0.44, midi(note), 0.03, beatIndex % 2 === 0 ? -0.28 : 0.28, "pulse");
  }
  if (barIndex % 2 === 0) {
    motif.forEach((note, index) => addTone(barStart + 0.2 + index * 0.32, 0.6, midi(note), 0.032, -0.22 + index * 0.22, "bell"));
  }
}

[5, 10, 15, 20, 25, 30].forEach((time, index) => addStationCue(time, 72 + (index % 3) * 2));

let peak = 0;
for (let i = 0; i < sampleCount; i += 1) {
  const time = i / sampleRate;
  const fade = Math.max(0, Math.min(1, time / 1.2) * Math.min(1, (duration - time) / 2));
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
  "-af", "acompressor=threshold=0.12:ratio=2.1:attack=15:release=180,alimiter=limit=0.9",
  "-codec:a", "libmp3lame", "-b:a", "192k", mp3Path,
], { stdio: "inherit" });
unlinkSync(wavPath);
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Generated ${mp3Path}`);
