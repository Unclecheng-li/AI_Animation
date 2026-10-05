// Scene 1 · hook (10 beats): the pain, in words, for a muted feed.
// First frame: the orange dot alone (= the film's last frame, so it loops).
MS.scene("hook", (s) => {
  const { L } = s;
  const Z = UI.sizes(L);
  const size = L.wide ? s.w(5.2) : s.w(8.4);
  const gap = L.u * 7;

  const dot = document.createElement("div");
  dot.className = "dot";
  const l1 = UI.headline("The meeting ended.");
  const l2 = UI.headline("The work *didn't* start.");
  Object.assign(l1.style, { fontSize: size, bottom: L.H - (Z.cy - gap) + "px" });
  Object.assign(l2.style, { fontSize: size, top: Z.cy + gap + "px" });
  s.el.append(l1, l2, dot);
  UI.footnote(s);

  UI.rise(s, l1, 0.5, 0.9, 8);
  UI.rise(s, l2, 4, 0.8, 8.2);

  // The record light: breathes once before handing over. Ends at exactly its start size.
  const d = Z.dot;
  const sizeKeys = [[0, d], [s.at(8.4), d * 1.6], [s.at(9.0), d]];
  s.frame((t) => {
    const k = MS.track(t, sizeKeys, "snappy");
    Object.assign(dot.style, { width: k + "px", height: k + "px", left: Z.cx - k / 2 + "px", top: Z.cy - k / 2 + "px" });
  });
});
