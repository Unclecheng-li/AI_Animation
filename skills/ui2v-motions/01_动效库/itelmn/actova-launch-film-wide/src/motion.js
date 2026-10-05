/*
 * Motion Director motion library. Loaded before film.js and the scene files; exposes window.MS.
 * Everything here is a pure function of time, so any frame can be rendered
 * directly (frame 812 without simulating frames 0-811).
 *
 * Two ways to use it:
 *  1. Spring eases for normal GSAP tweens:
 *       tl.to(".card", { y: 0, duration: 0.6, ease: MS.ease("snappy") }, t);
 *  2. A per-frame function for values GSAP tweens handle badly (a value that
 *     changes target many times, a stretching indicator, a log-space camera):
 *       MS.frame(tl, (t) => { el.style.transform = `translateX(${MS.track(t, keys)}px)`; });
 */
(function () {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;

  // ---- Presets -----------------------------------------------------------
  // z = damping ratio (lower = more overshoot). k/d = stiffness/damping for
  // time-based springs used by track().
  const PRESETS = {
    snappy:  { z: 0.75, k: 320, d: 30 }, // buttons, toggles, leading edges (~3% overshoot)
    default: { z: 0.85, k: 170, d: 26 }, // cards, containers, camera (~1% overshoot)
    heavy:   { z: 1.0,  k: 120, d: 24 }, // big type, logo lockups (no overshoot)
    playful: { z: 0.5,  k: 200, d: 14 }, // mascots, stickers (visible overshoot)
  };
  const preset = (p) => (typeof p === "object" ? p : PRESETS[p] || PRESETS.default);

  // ---- Closed-form damped spring, 0 -> 1, time in seconds ------------------
  function spring(t, k = 170, d = 26) {
    if (t <= 0) return 0;
    const w0 = Math.sqrt(k), z = d / (2 * w0);
    if (z < 1) {
      const wd = w0 * Math.sqrt(1 - z * z);
      return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t));
    }
    return 1 - Math.exp(-w0 * t) * (1 + w0 * t); // z >= 1 treated as critical
  }

  // ---- Spring as a GSAP ease: settles exactly at the end of the tween -------
  // Normalised so the curve ends at exactly 1 (no jump on the last frame).
  function unitSpring(p, z) {
    const w = 7 / Math.min(z, 1); // settle within the tween
    if (z < 1) {
      const wd = w * Math.sqrt(1 - z * z);
      return 1 - Math.exp(-z * w * p) * (Math.cos(wd * p) + ((z * w) / wd) * Math.sin(wd * p));
    }
    return 1 - Math.exp(-w * p) * (1 + w * p);
  }
  function ease(name = "default") {
    const { z } = preset(name);
    const end = unitSpring(1, z);
    return (p) => (p <= 0 ? 0 : p >= 1 ? 1 : unitSpring(p, z) / end);
  }

  // ---- A value with many targets: one spring per change, summed ------------
  // keys: [[time, value], ...] sorted by time. Continuous motion, no restarts.
  function track(t, keys, name = "default") {
    const { k, d } = preset(name);
    let v = keys[0][1];
    for (let i = 1; i < keys.length; i++) v += (keys[i][1] - keys[i - 1][1]) * spring(t - keys[i][0], k, d);
    return v;
  }

  // ---- Stretching indicator: leading edge stiffer than trailing edge -------
  // stops: [[time, x], ...]; width = indicator width in px.
  function indicator(t, stops, width) {
    const lead = track(t, stops, "snappy");
    const trail = track(t, stops, "heavy");
    return { left: Math.min(lead, trail), right: Math.max(lead, trail) + width };
  }

  // ---- Text inside a morphing container ------------------------------------
  // Enters shortly after the morph starts, leaves shortly before the next one.
  function swapAlpha(t, tIn, tOut) {
    return Math.min(clamp((t - tIn - 0.08) / 0.12), clamp((tOut - 0.1 - t) / 0.1));
  }

  // ---- Camera: zoom interpolated in log space ------------------------------
  // keys: [[time, scale], ...]. Going 1x->2x feels as fast as 2x->4x.
  function zoom(t, keys, name = "default") {
    const logKeys = keys.map(([tk, s]) => [tk, Math.log(s)]);
    return Math.exp(track(t, logKeys, name));
  }

  // ---- Beats ----------------------------------------------------------------
  // beat(n) = time in seconds of beat n on the film's clock.
  // Tempo comes from project.json ("bpm", "beatOffset"), written onto the root
  // element by shells.mjs. Falls back to 120 BPM (one beat = 0.5s).
  function beat(n) {
    const r = document.getElementById("root").dataset;
    const bpm = Number(r.msBpm) || 120, offset = Number(r.msOffset) || 0;
    return offset + (n * 60) / bpm;
  }

  // ---- Seeded randomness (never Math.random) --------------------------------
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---- Per-frame hook --------------------------------------------------------
  // Runs fn(t) for every frame the timeline is seeked to. fn must be pure:
  // derive everything from t, remember nothing between calls.
  function frame(tl, fn) {
    const clock = { t: 0 };
    const dur = Number(document.getElementById("root").dataset.duration);
    tl.fromTo(clock, { t: 0 }, { t: dur, duration: dur, ease: "none", onUpdate: () => fn(clock.t) }, 0);
    fn(0);
  }

  window.MS = Object.assign(window.MS || {}, { clamp, lerp, spring, ease, track, indicator, swapAlpha, zoom, beat, rng, frame, PRESETS });
})();
