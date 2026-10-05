// Scene 3 · tasks (14 beats): the payoff. The "9 promises" pill opens into the real task
// board; on the drop (beat 4) the 9 tasks land in their owners' columns, one per half beat;
// the pill turns into the green "9 tasks created" banner; then the board folds into a card.
MS.scene("tasks", (s) => {
  const { L } = s;
  const Z = UI.sizes(L);
  const fs = Z.fs;
  const pillH = fs * 1.9, pillW = fs * 7.4, doneW = fs * 10.6;
  const pad = fs * 1.0;
  const boardW = L.wide ? L.W * 0.64 : Z.cardW;
  const boardH = L.wide ? 560 : 1000;
  const boardCy = Z.cy + (L.wide ? L.u * 7 : L.u * 6);
  const boardTop = boardCy - boardH / 2;
  const pillCyIn = boardTop + pad + pillH / 2;
  const cardSmall = { w: fs * 8, h: fs * 5.5 };

  // --- DOM -------------------------------------------------------------------
  const board = document.createElement("div");
  board.className = "shape ui";
  board.style.setProperty("--fs", fs + "px");
  const inner = document.createElement("div");
  inner.className = "inner board";
  Object.assign(inner.style, {
    width: boardW - 2 * pad + "px", top: pad + pillH + fs * 0.8 + "px",
    gridTemplateColumns: L.wide ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
  });
  const owners = ["maya", "omar", "lena", "sam"];
  const first = { maya: "Maya", omar: "Omar", lena: "Lena", sam: "Sam" };
  inner.innerHTML = owners.map((o) =>
    `<div class="col" data-o="${o}"><div class="h">${UI.av(o)}${first[o]}<span class="n">0</span></div></div>`).join("");
  const taskEls = UI.tasks.map(([o, title, due]) => {
    const el = document.createElement("div");
    el.className = "task";
    el.innerHTML = `<div class="tt">${title}</div><div class="meta"><span class="check"></span>${due}</div>`;
    inner.querySelector(`[data-o="${o}"]`).appendChild(el);
    return { el, o };
  });
  board.appendChild(inner);

  const pill = document.createElement("div");
  pill.className = "pill ui";
  pill.style.fontSize = fs * 0.9 + "px";
  pill.innerHTML = `<div class="flood"></div><span class="lab a">9 promises</span><span class="lab b">✓ 9 tasks created</span>`;
  const flood = pill.querySelector(".flood");

  const head = UI.headline("9 tasks in *12 seconds.*");
  Object.assign(head.style, { fontSize: L.wide ? s.w(3.8) : s.w(7.4), top: L.wide ? L.H * 0.06 + "px" : L.H * 0.07 + "px" });
  s.el.append(board, pill, head);
  UI.footnote(s);

  // --- Timeline ----------------------------------------------------------------
  const at = s.at;
  const dropAt = (i) => 4 + 0.5 * i;   // the drop is beat 4; one task per half beat
  // Build-up before the drop: the four owner columns grow in one by one (beats 1-2.2),
  // so the board is never just waiting.
  inner.querySelectorAll(".col").forEach((col, i) => {
    s.tl.fromTo(col, { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: s.B(0.9), ease: MS.ease("snappy") }, at(1 + 0.4 * i));
  });
  taskEls.forEach(({ el }, i) => {
    s.tl.fromTo(el, { scale: 0 }, { scale: 1, duration: s.B(0.9), ease: MS.ease("snappy") }, at(dropAt(i)));
  });

  const [labA, labB] = [pill.querySelector(".a"), pill.querySelector(".b")];
  s.tl.set(labB, { yPercent: 120, clipPath: "inset(0% 0% 100% 0%)" }, 0);
  s.tl.to(labA, { yPercent: -120, clipPath: "inset(100% 0% 0% 0%)", duration: s.B(0.7), ease: MS.ease("heavy") }, at(9));
  s.tl.to(labB, { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: s.B(0.9), ease: MS.ease("heavy") }, at(9.2));
  s.tl.set(labB, { color: "#fff" }, 0);

  UI.rise(s, head, 8.6, 0.25, 12.4);

  const boardSpec = {
    w:  [[0, pillW], [at(0.3), boardW], [at(12.6), boardW], [at(13.2), cardSmall.w]],
    h:  [[0, pillH], [at(0.3), boardH], [at(12.6), boardH], [at(13.2), cardSmall.h]],
    cx: [[0, Z.cx]],
    cy: [[0, Z.cy], [at(0.3), boardCy], [at(12.6), boardCy], [at(13.2), Z.cy]],
    r:  [[0, pillH / 2], [at(0.3), fs * 0.8]],
  };
  const pillSpec = {
    w:  [[0, pillW], [at(9), doneW], [at(12.3), doneW], [at(12.7), pillH * 0.3]],
    h:  [[0, pillH], [at(12.3), pillH], [at(12.7), pillH * 0.3]],
    cx: [[0, Z.cx]],
    cy: [[0, Z.cy], [at(0.3), pillCyIn], [at(12.6), pillCyIn], [at(13.2), Z.cy]],
    r:  [[0, pillH / 2], [at(12.7), pillH * 0.15]],
  };
  const counts = owners.map((o) => ({ o, n: inner.querySelector(`[data-o="${o}"] .n`), idx: taskEls.map((x, i) => (x.o === o ? i : -1)).filter((i) => i >= 0) }));

  s.frame((t) => {
    UI.contentWhenOpen(inner, UI.box(board, t, boardSpec, "snappy"), boardW, boardH);
    const pb = UI.box(pill, t, pillSpec, "snappy");
    pill.style.visibility = t > at(12.9) ? "hidden" : "";   // folded into the board. Never "visible": it overrides the scene being hidden
    // Green floods the pill from its centre: a colour change as a shape change.
    const fr = Math.max(0, MS.track(t, [[0, 0], [at(9), doneW * 0.6]], "default"));
    Object.assign(flood.style, { width: fr * 2 + "px", height: fr * 2 + "px", left: pb.w / 2 - fr + "px", top: pb.h / 2 - fr + "px" });
    // Column counts follow the tasks that have landed (never ahead of the picture).
    counts.forEach(({ n, idx }) => { n.textContent = String(idx.filter((i) => t >= at(dropAt(i))).length); });
  });
});
