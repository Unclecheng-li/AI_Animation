// Agrupa las palabras del transcript en líneas de karaoke (una a la vez en pantalla).
import fs from "node:fs";
const OFFSET = 0.0; // medido en este clip: whisper clava el ataque (mediana −0.02 s); no sumar nada
const raw = JSON.parse(fs.readFileSync(new URL("./assets/transcript.json", import.meta.url)));
const words = Array.isArray(raw) ? raw : raw.words;

// whisper pega la "y" a la palabra siguiente: se parte en dos con el tiempo repartido
const SPLIT = { Yahí: ["Y", "ahí"] };
// errores de oído: whisper oye "una gente" / "la gente" donde se dijo "un agente" / "el agente"
// (la primera "a la gente" de 1.89 sí es "la gente": se lo pones a la gente)
// "la gente" → "el agente" (error de oído); "shampoo" → champú; whisper repite "intervenir"
const FIX = { "trilogía.": "trinchera.", "trinidad.": "trinchera." };
const FIX_AT = {};

const merged = [];
for (const w of words) {
  const parts = SPLIT[w.text];
  if (parts) {
    const mid = w.start + (w.end - w.start) * 0.42;
    merged.push({ text: parts[0], start: w.start, end: mid }, { text: parts[1], start: mid, end: w.end });
    continue;
  }
  merged.push({ ...w, text: FIX_AT[w.start] ?? FIX[w.text] ?? w.text });
}
const fixed = merged.filter((w) => w.text !== "").map((w) => ({ ...w, start: w.start + OFFSET, end: w.end + OFFSET }));

const MAX = 22;
const lines = [];
let cur = null, prevEnd = 0;
for (const w of fixed) {
  const gap = w.start - prevEnd;
  const overflow = cur && (cur.text + " " + w.text).length > MAX;
  const endsSentence = cur && /[.?!]$/.test(cur.text);
  if (!cur || overflow || endsSentence || gap > 0.6) { cur = { start: w.start, end: w.end, text: w.text, words: [w] }; lines.push(cur); }
  else { cur.text += " " + w.text; cur.end = w.end; cur.words.push(w); }
  prevEnd = w.end;
}
lines.forEach((l, i) => { l.hold = i + 1 < lines.length ? lines[i + 1].start - 0.05 : l.end + 0.6; });
export default lines;
