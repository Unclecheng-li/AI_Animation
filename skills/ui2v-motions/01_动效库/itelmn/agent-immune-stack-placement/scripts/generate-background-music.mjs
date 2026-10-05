import fs from "node:fs";
import path from "node:path";

const sampleRate = 44100;
const duration = 88;
const channels = 2;
const bpm = 124;
const beat = 60 / bpm;
const totalSamples = Math.floor(sampleRate * duration);
const outPath = path.resolve("audio/background-upbeat.wav");

fs.mkdirSync(path.dirname(outPath), { recursive: true });

function midiToHz(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function mod(a, b) {
  return ((a % b) + b) % b;
}

function env(phase, decay) {
  return Math.exp(-phase * decay);
}

function noise(i) {
  const x = Math.sin((i + 1) * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function sine(freq, t) {
  return Math.sin(2 * Math.PI * freq * t);
}

function softSaw(freq, t) {
  return (
    sine(freq, t) * 0.6 +
    sine(freq * 2, t) * 0.24 +
    sine(freq * 3, t) * 0.12 +
    sine(freq * 4, t) * 0.06
  );
}

const progression = [
  [50, 57, 62, 65],
  [46, 53, 58, 62],
  [53, 60, 65, 69],
  [48, 55, 60, 64],
];

const pcm = Buffer.alloc(totalSamples * channels * 2);

for (let i = 0; i < totalSamples; i += 1) {
  const t = i / sampleRate;
  const bar = Math.floor(t / (beat * 4));
  const chord = progression[bar % progression.length];
  const beatInBar = mod(t, beat * 4) / beat;

  const kickPhase = mod(t, beat);
  const kickFreq = 54 + 48 * Math.exp(-kickPhase * 28);
  const kick = kickPhase < 0.18 ? sine(kickFreq, kickPhase) * env(kickPhase, 18) * 0.34 : 0;

  const snarePhase = mod(t - beat, beat * 2);
  const snare = snarePhase < 0.12 ? noise(i) * env(snarePhase, 26) * 0.14 : 0;

  const hatPhase = mod(t, beat / 2);
  const hat = hatPhase < 0.035 ? noise(i * 3) * env(hatPhase, 82) * 0.06 : 0;

  const bassStep = Math.floor(beatInBar * 2) % 8;
  const bassMidi = chord[0] - 12 + [0, 0, 7, 0, 10, 7, 0, 7][bassStep];
  const bassPhase = mod(t, beat / 2);
  const bass = softSaw(midiToHz(bassMidi), t) * env(bassPhase, 5.5) * 0.12;

  const arpStep = Math.floor(t / (beat / 2)) % 8;
  const arpMidi = chord[[0, 1, 2, 1, 3, 2, 1, 2][arpStep]] + 12;
  const arpPhase = mod(t, beat / 2);
  const arp = softSaw(midiToHz(arpMidi), t) * env(arpPhase, 9) * 0.075;

  const pad =
    sine(midiToHz(chord[0]), t) * 0.025 +
    sine(midiToHz(chord[1]), t) * 0.018 +
    sine(midiToHz(chord[2]), t) * 0.018;

  const riser = Math.sin(2 * Math.PI * 0.25 * t) * 0.015;
  const sample = (kick + snare + hat + bass + arp + pad + riser) * 0.82;
  const pan = Math.sin(2 * Math.PI * 0.11 * t) * 0.06;
  const left = Math.max(-1, Math.min(1, sample * (0.94 + pan)));
  const right = Math.max(-1, Math.min(1, sample * (0.94 - pan)));

  pcm.writeInt16LE(Math.round(left * 32767), i * 4);
  pcm.writeInt16LE(Math.round(right * 32767), i * 4 + 2);
}

const dataSize = pcm.length;
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + dataSize, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(channels, 22);
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(sampleRate * channels * 2, 28);
header.writeUInt16LE(channels * 2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(dataSize, 40);

fs.writeFileSync(outPath, Buffer.concat([header, pcm]));
console.log(outPath);
