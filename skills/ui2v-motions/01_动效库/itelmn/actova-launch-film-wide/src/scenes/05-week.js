// Scene 5 · week (10 beats): the card opens into the real weekly stats card and "5h 20m"
// counts up in whole minutes; then the card folds into the Actova mark with the tagline,
// and everything folds back into the orange dot: the film's first frame, so it loops.
MS.scene("week", (s) => {
  const { L } = s;
  const Z = UI.sizes(L);
  const fs = Z.fs, d = Z.dot;
  const pad = fs * 1.3;
  const weekW = L.wide ? 1180 : Z.cardW;
  const weekH = L.wide ? 640 : 760;
  const weekCy = Z.cy + L.u * 2;
  const cardSmall = { w: fs * 8, h: fs * 5.5 };
  const M = L.wide ? L.u * 11 : L.u * 13;            // logo mark size
  const wmSize = M * 0.92;                            // wordmark font size
  const gap = M * 0.32, wmW = wmSize * 3.3;           // "Actova" in Inter 800 ≈ 3.3em wide
  const rowW = M + gap + wmW;
  const markCx = Z.cx - rowW / 2 + M / 2, markCy = Z.cy - L.u * 8;

  // --- DOM -------------------------------------------------------------------
  const card = document.createElement("div");
  card.className = "shape ui";
  card.style.setProperty("--fs", fs + "px");
  const fill = document.createElement("div");
  fill.className = "flood";
  fill.style.background = "var(--accent)";
  const inner = document.createElement("div");
  inner.className = "inner week";
  Object.assign(inner.style, { width: weekW - 2 * pad + "px", top: pad + "px" });
  inner.innerHTML = `
    <div class="n" style="font-size:${L.wide ? 5.2 : 6}em"><span class="h">0h</span> <span class="acc m" style="font-size:1em">00m</span></div>
    <div class="lbl" style="margin-top:.4em">back this week, with no notes, no follow-up emails, no chasing</div>
    <div class="bars" style="height:${L.wide ? 5.5 : 8}em;margin-top:1.4em">
      <div style="height:40%"><span>Mon</span></div><div style="height:55%"><span>Tue</span></div><div style="height:35%"><span>Wed</span></div>
      <div class="on" style="height:100%"><span>Thu</span></div><div style="height:60%"><span>Fri</span></div></div>
    <div class="lbl" style="margin-top:2.2em;display:flex;gap:1.6em"><span><b style="color:var(--fg)">21</b> promises caught</span><span><b style="color:var(--fg)">0</b> forgotten</span></div>`;
  card.append(inner, fill);

  const check = document.createElement("div");
  check.innerHTML = UI.check;
  Object.assign(check.style, { position: "absolute", width: M * 0.55 + "px", height: M * 0.55 + "px", left: markCx - M * 0.275 + "px", top: markCy - M * 0.275 + "px" });
  const wm = document.createElement("div");
  wm.className = "wordmark";
  wm.textContent = "Actova";
  Object.assign(wm.style, { fontSize: wmSize + "px", left: markCx + M / 2 + gap + "px", top: markCy - wmSize * 0.62 + "px" });
  const tag = UI.headline("Meetings that *finish* themselves.");
  Object.assign(tag.style, { fontSize: L.wide ? s.w(4.2) : s.w(7.2), top: Z.cy + L.u * 4 + "px" });
  s.el.append(card, check, wm, tag);
  UI.footnote(s);

  // --- Timeline ----------------------------------------------------------------
  const at = s.at;
  const bars = [...inner.querySelectorAll(".bars div")];
  bars.forEach((b, i) => s.tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: s.B(1), ease: MS.ease("snappy") }, at(1.4 + i * 0.3)));
  s.tl.fromTo(check, { scale: 0 }, { scale: 1, duration: s.B(0.8), ease: MS.ease("snappy") }, at(4.9));
  s.tl.to(check, { scale: 0, duration: s.B(0.5), ease: MS.ease("snappy") }, at(8.5));
  UI.rise(s, wm, 5.0, 0.3, 8.3);
  UI.rise(s, tag, 5.4, 0.25, 8.3);

  const cardSpec = {
    // Keyframe times are when each move STARTS (springs settle ~0.6 s later).
    w:  [[0, cardSmall.w], [at(0.2), weekW], [at(4), M], [at(8.7), d]],
    h:  [[0, cardSmall.h], [at(0.2), weekH], [at(4), M], [at(8.7), d]],
    cx: [[0, Z.cx], [at(4), markCx], [at(8.6), Z.cx]],
    cy: [[0, Z.cy], [at(0.2), weekCy], [at(4), markCy], [at(8.6), Z.cy]],
    r:  [[0, fs * 0.8], [at(4), M * 0.28], [at(8.7), d / 2]],
  };
  const hEl = inner.querySelector(".h"), mEl = inner.querySelector(".m");

  s.frame((t) => {
    const b = UI.box(card, t, cardSpec, "snappy");
    UI.contentWhenOpen(inner, b, weekW, weekH);
    // Orange fills the card from its centre as it folds into the mark; at the end it
    // IS the orange dot, with no border or shadow, identical to the film's first frame.
    const r = Math.max(0, MS.track(t, [[0, 0], [at(4.1), Math.hypot(weekW, weekH)]], "default"));
    Object.assign(fill.style, { width: 2 * r + "px", height: 2 * r + "px", left: b.w / 2 - r + "px", top: b.h / 2 - r + "px" });
    const folded = t >= at(4.7);
    card.style.borderColor = folded ? "transparent" : "";
    card.style.boxShadow = folded ? "none" : "";
    card.style.background = folded ? "var(--accent)" : "";
    // Whole minutes only, never past 5h 20m: every value shown is on the way.
    const mins = Math.max(0, Math.min(320, Math.round(MS.track(t, [[0, 0], [at(0.9), 320]], "heavy"))));
    hEl.textContent = Math.floor(mins / 60) + "h";
    mEl.textContent = String(mins % 60).padStart(2, "0") + "m";
  });
});
