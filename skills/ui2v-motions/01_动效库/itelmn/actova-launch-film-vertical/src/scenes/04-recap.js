// Scene 4 · recap (10 beats): the card opens into Actova's real recap email; a cursor
// clicks "Send recap"; green floods the button from the click point; the email folds
// back into a card (the handoff to the week).
MS.scene("recap", (s) => {
  const { L } = s;
  const Z = UI.sizes(L);
  const fs = Z.fs;
  const pad = fs * 1.0;
  const mailW = L.wide ? 1150 : Z.cardW;
  const mailH = L.wide ? 580 : 650;
  const mailCy = Z.cy + L.u * 2;
  const cardSmall = { w: fs * 8, h: fs * 5.5 };
  const ftH = fs * 2.7, btnH = fs * 1.75;
  const sendW = fs * 7.6, sentW = fs * 10.6;

  // --- DOM -------------------------------------------------------------------
  const card = document.createElement("div");
  card.className = "shape ui";
  card.style.setProperty("--fs", fs + "px");
  const inner = document.createElement("div");
  inner.className = "inner mail";
  Object.assign(inner.style, { width: mailW + "px", height: mailH + "px", top: 0 });
  inner.innerHTML = `
    <div class="hd"><div><b>To</b>Maya, Omar, Lena, Sam</div><div><b>Subject</b>Q4 launch sync: 9 next steps</div></div>
    <div class="bd">
      <p style="margin-bottom:.6em">Hi all, here's who's doing what before launch:</p>
      <div class="it">${UI.av("maya")}Maya: pitch deck (Fri), venue (Mon), budget (Tue)</div>
      <div class="it">${UI.av("omar")}Omar: checkout bug (Wed), mobile QA (Fri)</div>
      <div class="it">${UI.av("lena")}Lena: homepage visuals (Thu), icons (Fri)</div>
      <div class="it">${UI.av("sam")}Sam: pricing copy (Wed), launch email (Thu)</div>
      <p style="margin-top:.6em;color:var(--muted);font-size:.86em">Next sync: same time next week.</p>
    </div>
    <div class="ft" style="position:absolute;left:0;right:0;bottom:0;height:${ftH}px">
      <span class="btn edit" style="position:absolute;top:${(ftH - btnH) / 2}px;height:${btnH}px;right:${pad + sendW + fs * 0.5}px;display:grid;place-items:center">Edit</span>
      <span class="btn send" style="position:absolute;top:${(ftH - btnH) / 2}px;height:${btnH}px;right:${pad}px">
        <div class="flood"></div><span class="lab a">Send recap</span><span class="lab b">✓ Sent to 4 people</span></span>
    </div>`;
  card.appendChild(inner);
  const send = inner.querySelector(".send");
  const edit = inner.querySelector(".edit");
  const flood = send.querySelector(".flood");

  const cur = document.createElement("div");
  cur.innerHTML = UI.cursor;
  Object.assign(cur.style, { position: "absolute", fontSize: fs * 1.6 + "px", left: 0, top: 0 });
  s.el.append(card, cur);
  UI.footnote(s);

  // --- Timeline ----------------------------------------------------------------
  const at = s.at;
  const [labA, labB] = [send.querySelector(".a"), send.querySelector(".b")];
  s.tl.set(labB, { yPercent: 120, clipPath: "inset(0% 0% 100% 0%)" }, 0);
  s.tl.to(labA, { yPercent: -120, clipPath: "inset(100% 0% 0% 0%)", duration: s.B(0.6), ease: MS.ease("heavy") }, at(5.2));
  s.tl.to(labB, { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: s.B(0.8), ease: MS.ease("heavy") }, at(5.4));

  const cardSpec = {
    w:  [[0, cardSmall.w], [at(0.2), mailW], [at(7.6), mailW], [at(8.4), cardSmall.w]],
    h:  [[0, cardSmall.h], [at(0.2), mailH], [at(7.6), mailH], [at(8.4), cardSmall.h]],
    cx: [[0, Z.cx]],
    cy: [[0, Z.cy], [at(0.2), mailCy], [at(7.6), mailCy], [at(8.4), Z.cy]],
    r:  [[0, fs * 0.8]],
  };
  // The Send button's centre on screen (for the cursor), from the card's final box.
  const btnCx = Z.cx + mailW / 2 - pad - sendW / 2;
  const btnCy = mailCy + mailH / 2 - ftH / 2;
  const off = { x: L.W + fs * 2, y: L.H + fs * 2 };
  const curX = [[0, off.x], [at(2), off.x], [at(4.6), btnCx], [at(5.6), off.x]];
  const curY = [[0, off.y], [at(2), off.y], [at(4.6), btnCy], [at(5.6), off.y]];

  s.frame((t) => {
    UI.contentWhenOpen(inner, UI.box(card, t, cardSpec, "snappy"), mailW, mailH);
    // Button widens to fit "Sent to 4 people", anchored at its right edge.
    const bw = MS.track(t, [[0, sendW], [at(5.3), sentW]], "snappy");
    send.style.width = bw + "px";
    edit.style.right = pad + bw + fs * 0.5 + "px";   // Edit steps aside as Send widens: never overlap
    // Green floods out from the click point (the button's right-hand part under the cursor).
    const r = Math.max(0, MS.track(t, [[0, 0], [at(5), sentW]], "default"));
    const fx = bw - sendW / 2, fy = btnH / 2;
    Object.assign(flood.style, { width: 2 * r + "px", height: 2 * r + "px", left: fx - r + "px", top: fy - r + "px" });
    // Cursor: glides in, presses on beat 5, leaves.
    const press = 1 - 0.18 * Math.max(0, Math.min(1, MS.track(t, [[0, 0], [at(4.9), 1], [at(5.15), 0]], "snappy")));
    cur.style.transform = `translate(${MS.track(t, curX, "default")}px, ${MS.track(t, curY, "default")}px) scale(${press})`;
  });
});
