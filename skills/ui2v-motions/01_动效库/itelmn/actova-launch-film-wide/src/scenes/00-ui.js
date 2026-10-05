// Shared Actova data and helpers for every scene. Loaded first (00-), registers no scene.
// DATA IS COPIED FROM THE ACTOVA APP (../actova/index.html): same people, lines and tasks.
// Fictional product, example data.
window.UI = (function () {
  const people = {
    maya: { name: "Maya Chen", ini: "MC" },
    omar: { name: "Omar Haddad", ini: "OH" },
    lena: { name: "Lena Brooks", ini: "LB" },
    sam:  { name: "Sam Ortiz", ini: "SO" },
  };

  // Transcript: [who, time, html]. <m> marks a promise (9 in total, as in the app).
  const transcript = [
    ["maya", "12:04", "Okay, launch is three weeks out. <m>I'll send the updated pitch deck by Friday.</m>"],
    ["omar", "12:06", "The checkout bug is still open. <m>I'll fix it by Wednesday</m>, and <m>I'll run a full mobile QA pass Friday.</m>"],
    ["lena", "12:11", "<m>Final homepage visuals will be ready Thursday.</m> I can also <m>do the onboarding icons by Friday.</m>"],
    ["sam",  "12:15", "<m>I'll draft the launch email Thursday</m> and <m>rewrite the pricing page copy Wednesday.</m>"],
    ["maya", "12:19", "Good. <m>I'll book the venue for launch day Monday</m> and <m>share the budget with finance Tuesday.</m>"],
    ["omar", "12:22", "Sounds like a plan. Same time next week?"],
  ];

  // Tasks in the order the app's "Promises found" panel lists them (= drop order).
  const tasks = [
    ["maya", "Send updated pitch deck", "Fri"],
    ["omar", "Fix checkout bug", "Wed"],
    ["omar", "Mobile QA pass", "Fri"],
    ["lena", "Final homepage visuals", "Thu"],
    ["lena", "Onboarding icon set", "Fri"],
    ["sam",  "Draft launch email", "Thu"],
    ["sam",  "Pricing page copy", "Wed"],
    ["maya", "Book launch-day venue", "Mon"],
    ["maya", "Share budget with finance", "Tue"],
  ];

  const av = (p) => `<span class="av ${p}">${people[p].ini}</span>`;
  const check = `<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const cursor = `<svg class="cursor" viewBox="0 0 24 24"><path d="M4 2l15 11.5-6.6 1 3.9 7.3-3 1.5-3.8-7.4L4 20z" fill="#15171C" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

  // Per-format sizes. fs = base font of product UI (everything else is in em).
  function sizes(L) {
    const v = !L.wide;
    return {
      fs: v ? 30 : 27,
      dot: L.u * 3.2,
      cardW: v ? L.W * 0.88 : L.W * 0.64,
      cx: L.W / 2, cy: L.H / 2,
    };
  }

  // Morph a box: every property is a keyframe track [[time, value], ...] driven by
  // springs, applied as left/top/width/height/radius around a centre point.
  function box(el, t, spec, preset = "default") {
    const v = (k) => MS.track(t, spec[k], spec.presets?.[k] || preset);
    const w = v("w"), h = v("h"), cx = v("cx"), cy = v("cy");
    el.style.width = w + "px"; el.style.height = h + "px";
    el.style.left = cx - w / 2 + "px"; el.style.top = cy - h / 2 + "px";
    if (spec.r) el.style.borderRadius = v("r") + "px";
    return { w, h, cx, cy };
  }

  // Content inside a morphing shape shows only while the shape is (nearly) fully open:
  // the container lands first, then its content. No half-clipped text ever exists, which
  // keeps HyperFrames' contrast check honest (it counts clipped text as visible).
  function contentWhenOpen(inner, b, fullW, fullH) {
    inner.style.visibility = b.w >= fullW * 0.97 && b.h >= fullH * 0.97 ? "" : "hidden";
  }

  // Wrap each word (keeping <em> accent words intact) so it can rise from a mask line.
  // The rise is a translate + a matching clip-path, so the word looks like it slides up
  // from behind a line, while its box never overlaps anything else.
  function maskWords(el) {
    const parts = [];
    el.childNodes.forEach((n) => {
      if (n.nodeType === 3) n.textContent.split(/\s+/).filter(Boolean).forEach((w) => parts.push(w));
      else parts.push(n.outerHTML);
    });
    el.innerHTML = parts.map((p) => `<span class="word">${p}</span>`).join(" ");
    return el.querySelectorAll(".word");
  }

  // Rise words in on beats, and optionally out.
  function rise(s, el, inBeat, step = 1, outBeat = null, preset = "heavy") {
    const words = maskWords(el);
    words.forEach((word, i) => {
      const inT = s.at(inBeat + i * step), dur = s.B(1.25);
      s.tl.fromTo(word, { yPercent: 100, clipPath: "inset(0% 0% 100% 0%)" },
        { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: MS.ease(preset) }, inT);
      if (outBeat !== null) s.tl.to(word, { yPercent: -100, clipPath: "inset(100% 0% 0% 0%)", duration: s.B(0.9), ease: MS.ease(preset) }, s.at(outBeat + i * 0.12));
    });
    return words;
  }

  // Headline element with real italic accent words: "The work *didn't* start."
  function headline(text) {
    const el = document.createElement("h2");
    el.className = "hl";
    // *...* marks the accent, which may span several words: each accent word gets its own
    // <em> so words still rise one by one.
    let inAccent = false;
    el.innerHTML = text.split(" ").map((w) => {
      const opens = w.startsWith("*"), closes = w.endsWith("*") && (w.length > 1 || !opens);
      if (opens) inAccent = true;
      const clean = w.replaceAll("*", "");
      const out = inAccent ? `<em>${clean}</em>` : clean;
      if (closes) inAccent = false;
      return out;
    }).join(" ");
    return el;
  }

  // "Fictional product · Example data": in every scene, same place, so it never jumps.
  function footnote(s) {
    const f = document.createElement("div");
    f.className = "footnote";
    f.textContent = "Fictional product · Example data";
    Object.assign(f.style, { bottom: s.L.H * 0.035 + "px", fontSize: (s.L.wide ? 18 : 24) + "px" });
    s.el.appendChild(f);
  }

  return { people, transcript, tasks, av, check, cursor, sizes, box, rise, headline, maskWords, footnote, contentWhenOpen };
})();
