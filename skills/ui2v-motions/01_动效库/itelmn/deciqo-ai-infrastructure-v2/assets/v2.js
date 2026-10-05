// Shared text effects for the v2 scenes. No callbacks: every effect is built from property
// tweens (clip-path steps, opacity sets on pre-rendered frames), so seeking forwards or
// backwards always reproduces the same frame.
(function () {
  const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&*+=<>/{}[]";
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function node(x) { return typeof x === "string" ? document.querySelector(x) : x; }
  // Stack frames in one grid cell; show frame k at times[k].
  function frames(tl, target, list, times) {
    const n = node(target);
    n.innerHTML = `<span style="display:inline-grid">${list.map((s) => `<span style="grid-area:1/1;white-space:pre">${esc(s) || "&#8203;"}</span>`).join("")}</span>`;
    const kids = n.firstChild.children;
    gsap.set(kids, { opacity: 0 });
    list.forEach((_, k) => {
      if (times[k] <= 0) { gsap.set(kids[k], { opacity: 1 }); return; }
      tl.set(kids[k], { opacity: 1 }, times[k]);
      if (k > 0) tl.set(kids[k - 1], { opacity: 0 }, times[k]);
    });
  }
  window.V2 = {
    // typewriter: a clip-path wipe in character-sized steps
    type(tl, target, text, t, dur) {
      const n = node(target);
      n.innerHTML = `<span style="display:inline-block;white-space:inherit">${esc(text)}</span>`;
      const inner = n.firstChild;
      gsap.set(inner, { clipPath: "inset(0 100% 0 0)" });
      tl.to(inner, { clipPath: "inset(0 0% 0 0)", duration: dur, ease: `steps(${Math.max(1, text.length)})` }, t);
    },
    // scramble-decode: pre-rendered frames, resolving left→right
    scramble(tl, target, text, t, dur, steps = 12) {
      const list = [], times = [];
      for (let k = 0; k <= steps; k++) {
        const p = k / steps, done = Math.floor(p * text.length);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          if (i < done || c === " ") s += c;
          else if (i < done + 6) s += GLYPHS[(i * 7 + k * 13) % GLYPHS.length];
        }
        list.push(k === steps ? text : s);
        times.push(t + (1 - Math.pow(1 - p, 2)) * dur);
      }
      frames(tl, target, list, times);
    },
    // number roll-up: pre-rendered frames with an ease-out spacing
    count(tl, target, from, to, t, dur, fmt = (v) => Math.round(v).toString(), steps = 16) {
      const list = [], times = [];
      for (let k = 0; k <= steps; k++) {
        const p = k / steps, e = 1 - Math.pow(1 - p, 2);
        list.push(fmt(from + (to - from) * e));
        times.push(t + p * dur);
      }
      // frame 0 is visible from the start of the scene
      times[0] = 0;
      frames(tl, target, list, times);
    },
  };
})();
