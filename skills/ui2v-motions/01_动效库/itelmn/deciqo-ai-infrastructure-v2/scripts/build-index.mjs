// Generates index.html for the v2 (AI-on) showreel. Silent: no audio elements.
import { writeFileSync, existsSync } from "node:fs";

const SC = [
  ["a1-ignition", 7], ["a2-title", 6.4], ["a3-map", 14], ["a4-budget", 8.6], ["a5-discovery", 11.5],
  ["a6-membership", 7.5], ["a7-veto", 10.5], ["a8-gate", 9], ["a9-failsafe", 9], ["a10-close", 8.5],
];
let t = 0;
const slots = [];
for (const [id, dur] of SC) {
  if (existsSync(new URL(`../compositions/${id}.html`, import.meta.url))) {
    slots.push(`      <div id="${id}" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${t.toFixed(2)}" data-duration="${dur}" data-track-index="1" data-width="1920" data-height="1080"></div>`);
  }
  t += dur;
}
const TOTAL = +t.toFixed(2);
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Deciqo — AI-on infrastructure showreel</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script src="assets/v2.js"></script>
    <link rel="stylesheet" href="assets/v2.css" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #08080a; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #08080a; }
      #root > div[data-composition-src] { position: absolute; inset: 0; }
      .fontprime { font-family: "League Gothic"; } .fontprime2 { font-family: "JetBrains Mono"; } .fontprime3 { font-family: "Montserrat"; }
      #vig { position: absolute; inset: 0; z-index: 50; pointer-events: none; background: radial-gradient(ellipse 85% 80% at 50% 50%, rgba(8,8,10,0) 60%, rgba(0,0,0,0.5) 100%); }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="1920" data-height="1080">
${slots.join("\n")}
      <div id="vig"></div>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
writeFileSync(new URL("../index.html", import.meta.url), html);
console.log("index.html:", slots.length, "scenes,", TOTAL, "s");
