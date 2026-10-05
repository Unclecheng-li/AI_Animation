// Generates index.html: scene slots, host transitions, music bed and SFX cues.
// Journey-local cue times mirror window.__s3T in compositions/s3-journey.html.
import { writeFileSync } from "node:fs";

const TOTAL = 92;
const SC = [
  { id: "s1-open", start: 0, dur: 8 },
  { id: "s2-title", start: 8, dur: 7.9 },
  { id: "s3-journey", start: 15.6, dur: 56.4 },
  { id: "s4-proof", start: 71.6, dur: 10.4 },
  { id: "s5-close", start: 81.7, dur: 10.3 },
];
const J = 15.6; // journey offset
const T = { A: 0, B: 4.4, C: 8.0, D: 11.6, E: 16.0, F: 20.6, G: 24.4, H: 27.4, I: 31.2, J: 34.4, Ig: 37.6, P1: 39.0, K: 43.6, P2: 47.8, OUT: 50.6 };

// [time, file, volume]
const cues = [
  [1.0, "whoosh-short", 0.35], [1.5, "whoosh-short", 0.35], [2.0, "whoosh-short", 0.45],
  [3.75, "whoosh", 0.4], [5.85, "whoosh-cinematic", 0.5],
  [8.0, "impact-bass-1", 0.9], [8.25, "sparkle", 0.35], [9.35, "whoosh-short", 0.35],
  [12.0, "whoosh", 0.45], [13.0, "whoosh", 0.45], [14.0, "pop", 0.4],
  [15.45, "whoosh-cinematic", 0.6],
  // journey legs
  ...[T.B - 1, T.C - 1, T.D - 1, T.F - 1, T.I - 1, T.J - 1, T.K - 0.9].map((t) => [J + t, "whoosh-short", 0.3]),
  [J + T.E - 1.3, "whoosh", 0.45], [J + T.H - 1.5, "whoosh", 0.45], [J + T.G - 0.8, "whoosh-short", 0.3],
  // station beats
  [J + T.B + 0.5, "click-soft", 0.4], [J + T.B + 1.5, "click-soft", 0.4], [J + T.B + 2.3, "pop", 0.3],
  [J + T.C + 0.65, "click-soft", 0.35], [J + T.C + 1.07, "click-soft", 0.35], [J + T.C + 1.49, "click-soft", 0.35], [J + T.C + 2.1, "pop", 0.3],
  [J + T.D + 2.6, "pop", 0.35],
  [J + T.E + 2.8, "sparkle", 0.35],
  [J + T.F + 0.8, "click-soft", 0.3], [J + T.F + 1.2, "click-soft", 0.3], [J + T.F + 1.6, "click-soft", 0.3],
  [J + T.G + 0.3, "click", 0.4],
  [J + T.H + 1.25, "typing", 0.25], [J + T.H + 2.1, "impact-bass-2", 0.45],
  [J + T.I + 0.9, "error", 0.35],
  [J + T.J + 0.1, "whoosh-short", 0.25], [J + T.J + 1.4, "pop", 0.35], [J + T.J + 2.3, "whoosh", 0.35],
  [J + T.Ig + 0.3, "click", 0.4], [J + T.Ig + 0.5, "chime", 0.45],
  [J + T.P1, "whoosh", 0.4], [J + T.P1 + 1.9, "ping", 0.35], [J + T.P1 + 3.5, "whoosh-short", 0.3],
  [J + T.K - 1.2, "pop", 0.3], [J + T.K + 0.6, "whoosh-short", 0.25], [J + T.K + 2.05, "notification", 0.4],
  [J + T.P2, "whoosh", 0.4], [J + T.P2 + 2.4, "whoosh-short", 0.3],
  [J + T.OUT, "whoosh-cinematic", 0.5], [J + T.OUT + 2.4, "sparkle", 0.35],
  [71.5, "whoosh-cinematic", 0.5], [81.6, "whoosh", 0.45],
  [81.9, "whoosh-short", 0.3], [82.4, "whoosh-short", 0.3], [85.2, "click-soft", 0.3], [85.7, "click-soft", 0.3], [86.2, "click-soft", 0.3],
  [88.3, "impact-bass-1", 0.8], [88.5, "sparkle", 0.3],
];

const LEN = { "whoosh-short": 0.58, whoosh: 0.58, "whoosh-cinematic": 5.5, "impact-bass-1": 2.1, "impact-bass-2": 2.6, sparkle: 1.8, pop: 0.72, "click-soft": 0.37, click: 0.4, typing: 1.5, error: 1.6, chime: 2.5, ping: 1.3, notification: 2.45, riser: 10 };

const slots = SC.map((s, i) => `      <div class="wrap" id="w${i + 1}" style="z-index:${i + 1}">
        <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${s.start}" data-duration="${s.dur}" data-track-index="${i + 1}" data-width="1920" data-height="1080"></div>
      </div>`).join("\n");

const audio = cues
  .map(([t, f, v], i) => `      <audio id="sfx${i}" src="assets/sfx/${f}.mp3" data-start="${t.toFixed(2)}" data-duration="${Math.min(LEN[f], TOTAL - t).toFixed(2)}" data-track-index="${20 + (i % 6)}" data-volume="${v}"></audio>`)
  .join("\n");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Deciqo — architecture showreel</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <link rel="stylesheet" href="assets/deciqo.css" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #060a14; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #060a14; }
      .wrap { position: absolute; inset: 0; }
      .wrap > div { position: absolute; inset: 0; }
      #grain { position: absolute; inset: 0; z-index: 50; pointer-events: none; overflow: hidden; }
      #vig { position: absolute; inset: 0; z-index: 51; pointer-events: none; background: radial-gradient(ellipse 80% 75% at 50% 50%, rgba(6,10,20,0) 55%, rgba(3,5,12,0.55) 100%); }
      #fadeout { position: absolute; inset: 0; z-index: 60; background: #060a14; opacity: 0; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="1920" data-height="1080">
${slots}
      <div id="grain"><div class="dq-grain" id="grainL"></div></div>
      <div id="vig"></div>
      <div id="fadeout"></div>
      <audio id="music" src="assets/music.mp3" data-start="0" data-duration="${TOTAL}" data-track-index="10" data-volume="0.85"></audio>
${audio}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      // s2 → s3: zoom through the thesis into the world
      tl.fromTo("#w2", { scale: 1, opacity: 1, filter: "blur(0px)" }, { scale: 3.4, opacity: 0, filter: "blur(18px)", duration: 0.55, ease: "power3.in" }, 15.55);
      // s3 → s4: map recedes while the laptop tilts in
      tl.fromTo("#w3", { scale: 1, opacity: 1, filter: "blur(0px)" }, { scale: 0.82, opacity: 0, filter: "blur(14px)", duration: 0.6, ease: "power2.in" }, 71.6);
      // s4 → s5: blur crossfade
      tl.fromTo("#w4", { opacity: 1, filter: "blur(0px)" }, { opacity: 0, filter: "blur(16px)", duration: 0.55, ease: "power2.inOut" }, 81.7);
      tl.fromTo("#w5", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 81.7);
      // living grain (finite, deterministic)
      tl.fromTo("#grainL", { x: 0, y: 0 }, { x: 3, y: 2, duration: 1 / 15, ease: "steps(1)", repeat: ${Math.floor(TOTAL * 15) - 1}, yoyo: true }, 0);
      tl.to("#fadeout", { opacity: 1, duration: 0.8, ease: "power1.in" }, ${TOTAL - 0.8});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
writeFileSync(new URL("../index.html", import.meta.url), html);
console.log("index.html written:", cues.length, "sfx cues,", TOTAL, "s");
