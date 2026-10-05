// Scene 2 · listen (16 beats): the dot becomes Actova's "Listening" pill, the real
// transcript card grows out of it, every promise gets highlighted on the beat, then the
// card folds into a "9 promises" pill (the handoff to the task board).
MS.scene("listen", (s) => {
  const { L } = s;
  const Z = UI.sizes(L);
  const fs = Z.fs, d = Z.dot;
  const pillH = fs * 1.9, pillW = fs * 7.4;
  const pad = fs * 1.1;
  const cardW = Z.cardW;
  const cardH = L.wide ? 800 : 960;
  const cardCy = Z.cy + (L.wide ? L.u * 3.5 : L.u * 5);
  const cardTop = cardCy - cardH / 2;
  const pillCyIn = cardTop + pad + pillH / 2;

  // --- DOM -------------------------------------------------------------------
  const stage = document.createElement("div");
  Object.assign(stage.style, { position: "absolute", inset: 0, transformOrigin: `${Z.cx}px ${cardCy}px` });
  const card = document.createElement("div");
  card.className = "shape ui";
  card.style.setProperty("--fs", fs + "px");
  const inner = document.createElement("div");
  inner.className = "inner";
  Object.assign(inner.style, { width: cardW - 2 * pad + "px", top: pad + pillH + fs * 0.7 + "px" });
  inner.innerHTML = UI.transcript.map(([who, time, html]) =>
    `<div class="tline">${UI.av(who)}<div><div class="who">${UI.people[who].name}<span>${time}</span></div>` +
    `<div class="tx">${html.replaceAll("<m>", '<span class="mk">').replaceAll("</m>", "</span>")}</div></div></div>`).join("");
  card.appendChild(inner);

  const pill = document.createElement("div");
  pill.className = "pill ui";
  pill.style.setProperty("--fs", fs + "px");
  pill.innerHTML = `<span class="lab a"><i></i>Listening</span><span class="lab b">9 promises</span>`;
  pill.style.fontSize = fs * 0.9 + "px";
  stage.append(card, pill);

  const caption = UI.headline("It catches every *promise.*");
  Object.assign(caption.style, { fontSize: L.wide ? s.w(3.6) : s.w(7), top: L.wide ? L.H * 0.06 + "px" : L.H * 0.075 + "px" });
  s.el.append(stage, caption);
  UI.footnote(s);

  // --- Timeline ----------------------------------------------------------------
  // Pill labels: "Listening" in from the start, swapped for "9 promises" on the fold.
  const [labA, labB] = [pill.querySelector(".a"), pill.querySelector(".b")];
  s.tl.set(labB, { yPercent: 120, clipPath: "inset(0% 0% 100% 0%)" }, 0);
  s.tl.to(labA, { yPercent: -120, clipPath: "inset(100% 0% 0% 0%)", duration: s.B(0.8), ease: MS.ease("heavy") }, s.at(14.3));
  s.tl.to(labB, { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: s.B(0.9), ease: MS.ease("heavy") }, s.at(14.6));

  UI.rise(s, caption, 12, 0.35, 14.2);

  const marks = [...inner.querySelectorAll(".mk")];   // 9 promises, one per beat from beat 4
  const at = s.at;
  const shapeSpec = {
    w:  [[0, d], [at(0.2), pillW], [at(1.2), cardW], [at(14), cardW], [at(14.6), pillW]],
    h:  [[0, d], [at(0.2), pillH], [at(1.2), cardH], [at(14), cardH], [at(14.6), pillH]],
    cx: [[0, Z.cx]],
    cy: [[0, Z.cy], [at(1.2), cardCy], [at(14), cardCy], [at(14.6), Z.cy]],
    r:  [[0, d / 2], [at(0.2), pillH / 2], [at(1.2), fs * 0.8], [at(14), fs * 0.8], [at(14.6), pillH / 2]],
  };
  const pillSpec = {
    w:  [[0, d], [at(0.2), pillW]],
    h:  [[0, d], [at(0.2), pillH]],
    cx: [[0, Z.cx]],
    cy: [[0, Z.cy], [at(1.2), pillCyIn], [at(14), pillCyIn], [at(14.6), Z.cy]],
    r:  [[0, d / 2], [at(0.2), pillH / 2]],
  };
  // Push in on the transcript only as far as the safe area allows.
  const maxZoom = Math.min(1.12, (L.W - L.pad.x) / cardW);

  s.frame((t) => {
    UI.contentWhenOpen(inner, UI.box(card, t, shapeSpec, "snappy"), cardW, cardH);
    UI.box(pill, t, pillSpec, "snappy");
    stage.style.transform = `scale(${MS.zoom(t, [[0, 1], [at(2), maxZoom], [at(12.5), 1]])})`;
    marks.forEach((m, i) => {
      const p = Math.max(0, Math.min(100, MS.track(t, [[0, 0], [at(4 + i), 100]], "heavy")));
      m.style.backgroundSize = `${p}% 0.12em, ${p}% 100%`;
    });
  });
});
