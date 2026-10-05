/*
 * Motion Director film runner. Builds the film from the scenes listed in project.json.
 *
 * Each scene lives in its own file (src/scenes/NN-id.js) and registers itself:
 *
 *   MS.scene("hook", (s) => {
 *     s.el.innerHTML = `<h1 class="title">You did the work.</h1>`;
 *     s.tl.fromTo(s.$(".title"), { yPercent: 110 }, { yPercent: 0, duration: s.B(1.5), ease: MS.ease("heavy") }, s.at(0.5));
 *   });
 *
 * project.json lists the order and length in beats:
 *   "scenes": [{ "id": "hook", "beats": 12 }, { "id": "demo", "beats": 20 }]
 *
 * Solo mode (scripts/clip.sh <id>) builds one scene alone, starting at 0, so each
 * scene can be rendered and judged as its own clip before the film is joined.
 *
 * The scene API (s):
 *   s.el          the scene's <section> (full frame, already timed)
 *   s.$(sel)      querySelector inside the scene; s.$$(sel) for all
 *   s.tl          the film's single GSAP timeline
 *   s.at(beat)    ABSOLUTE time of a beat counted from this scene's start (for tl positions)
 *   s.B(beats)    a LENGTH of beats in seconds (for durations)
 *   s.start, s.end, s.beats   the scene's window on the film clock
 *   s.L, s.u(n), s.w(n)       layout and size helpers (see scenes rules below)
 *   s.frame(fn)   per-frame function fn(t, local) where local = seconds into this scene
 *   s.maskWords(el)           split text into words that rise from behind a mask
 *
 * Rules:
 *  - No timers, Date.now(), Math.random() or network. Everything is a function of time.
 *  - Size text with s.w(), shapes and spacing with s.u(): every format reframes, never crops.
 *  - A scene's LAST frame must equal the next scene's FIRST frame (shape handoff: a dot,
 *    a pill, a card or a number grows into the next scene). Never a cut, never a fade.
 */
(function () {
  const registry = {};
  window.MS = window.MS || {};
  window.MS.scene = (id, build) => { registry[id] = build; };

  function buildFilm() {
    const root = document.getElementById("root");
    const d = root.dataset;
    const L = { name: d.msFormat, W: Number(d.width), H: Number(d.height) };
    L.u = Math.min(L.W, L.H) / 100;
    L.portrait = L.H > L.W;
    L.wide = L.W > L.H;
    L.pad = { x: L.W * 0.08, y: L.H * 0.08 };
    const u = (n) => n * L.u + "px";
    const w = (n) => (n / 100) * L.W + "px";

    const bpm = Number(d.msBpm) || 120;
    const beatLen = 60 / bpm;
    const list = JSON.parse(d.msScenes || "[]");
    const solo = d.msSolo || "";

    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });

    function maskWords(el) {
      el.innerHTML = el.textContent.trim().split(/\s+/)
        .map((word) => `<span class="mask"><span class="word">${word}</span></span>`).join(" ");
      return el.querySelectorAll(".word");
    }

    // Film clock starts at beatOffset for the first scene (usually 0).
    let cursor = Number(d.msOffset) || 0;
    for (const sc of list) {
      const start = solo ? 0 : cursor;
      const len = sc.beats * beatLen;
      cursor += len;
      if (solo && sc.id !== solo) continue;

      const build = registry[sc.id];
      if (!build) throw new Error(`Scene "${sc.id}" is listed in project.json but no file registers it with MS.scene("${sc.id}", ...)`);

      // The timed <section> is written into index.html by shells.mjs, so HyperFrames'
      // runtime shows and hides it on the clock. Never create timed clips from JS: the
      // runtime doesn't see them, and every scene stays visible the whole film.
      const el = document.getElementById("scene-" + sc.id);
      if (!el) throw new Error(`No <section id="scene-${sc.id}"> in index.html: re-run shells.mjs`);

      build({
        id: sc.id, el, tl, L, u, w, maskWords,
        start, end: start + len, beats: sc.beats,
        $: (sel) => el.querySelector(sel),
        $$: (sel) => el.querySelectorAll(sel),
        at: (beat) => start + beat * beatLen,
        B: (beats) => beats * beatLen,
        frame: (fn) => MS.frame(tl, (t) => fn(t, t - start)),
      });
    }

    window.__timelines["main"] = tl;
    tl.seek(0);
  }

  // Called by index.html after every scene file has loaded. HyperFrames may run
  // scripts before <body> is parsed, so wait for the DOM when needed.
  window.MS.build = () => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildFilm);
    else buildFilm();
  };
})();
