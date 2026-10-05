/* Film engine.

   The whole film is ONE paused GSAP timeline (E.tl) in absolute seconds. HyperFrames seeks it to
   every frame, in any order, on several workers at once, so every pixel must be a pure function of
   time: no Math.random, no Date, no network, no state carried from the previous frame.

   Two kinds of moving things:
   - actors  (E.actor): a DOM element plus a plain state object {x, y, r, s, sx, sy, o, ry}. Scenes
               tween the state object on E.tl; the engine writes the transform once per frame.
               Before PLAN.smoothFrom actors move "on twos": their state is sampled on a 12 poses/s
               grid and gets a tiny hand-placed jitter, like tabletop stop motion. From smoothFrom on
               they move on ones, eased and jitter-free. Actors created with {twos: true} stay
               handmade for the whole film (a character, a hand-drawn prop).
   - cameras (E.camera): a full-frame wrapper whose {x, y, s, r} always moves on ones. A camera
               never jitters; that contrast is what makes the handmade half read as handmade.

   Everything else hangs off per-frame hooks (E.FRAME) and seek-safe switches (E.at, E.texts).

   Load order (see index.html): gsap, vo-data.js, plan.js, engine.js, ui.js, scene files, then the
   inline script that defines window.SCENES, runs the builders and calls E.mount(). */
(function () {
	const PLAN = window.PLAN;
	const W = PLAN.width || 1920;
	const H = PLAN.height || 1080;
	const FPS = PLAN.fps || 30;
	const POSE_FPS = PLAN.poseFps || 12; // "on twos" at 24 fps is 12 poses/s; 12 stays the pose rate at 30 fps too

	// ---- small utilities --------------------------------------------------------------------------
	// Deterministic pseudo-random in [0, 1). Same input, same output, on every worker.
	const hash = (n) => {
		const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
		return x - Math.floor(x);
	};
	const clamp01 = (v) => Math.max(0, Math.min(1, v));
	const $ = (s, r = document) => r.querySelector(s);
	const $$ = (s, r = document) => [...r.querySelectorAll(s)];
	// Create an element from an HTML string and (optionally) append it.
	function h(html, parent) {
		const t = document.createElement('template');
		t.innerHTML = html.trim();
		const n = t.content.firstElementChild;
		if (parent) parent.appendChild(n);
		return n;
	}
	// Plain easing functions for FRAME hooks (GSAP eases are only available inside tweens).
	const ease = {
		out3: (p) => 1 - Math.pow(1 - p, 3), // power3.out
		in2: (p) => p * p, // power2.in
		inOut3: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2), // power3.inOut
		outExpo: (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)) // expo.out
	};

	const tl = gsap.timeline({ paused: true });
	const ACTORS = [];
	const CAMS = [];
	const FRAME = [];
	const SFX = [];
	const WARN = []; // timing problems found while building (render.ts prints these)
	const warn = (msg) => {
		WARN.push(msg);
		console.warn(msg);
	};

	// ---- the scene table ----------------------------------------------------------------------------
	// window.SCENES = [[id, start], ...] is defined in index.html. Scenes derive their own windows from
	// it; nothing else in the film hard-codes a cut time.
	const scenes = () => window.SCENES || [];
	function sceneAt(id) {
		const s = scenes().find((x) => x[0] === id);
		if (!s) throw new Error('sceneAt: unknown scene ' + id);
		return s[1];
	}
	function sceneEnd(id) {
		const i = scenes().findIndex((x) => x[0] === id);
		if (i < 0) throw new Error('sceneEnd: unknown scene ' + id);
		return i + 1 < scenes().length ? scenes()[i + 1][1] : PLAN.duration;
	}
	// PLAN.smoothFrom may be a number of seconds or a scene id ("from the reveal on").
	let smoothCache = null;
	function smoothFrom() {
		if (smoothCache !== null) return smoothCache;
		const v = PLAN.smoothFrom;
		if (typeof v === 'string') smoothCache = sceneAt(v);
		else smoothCache = typeof v === 'number' ? v : 0;
		return smoothCache;
	}
	// The clock a FRAME hook should animate on: stepped time in the handmade half, real time after.
	const clock = (t, ts) => (t < smoothFrom() ? ts : t);

	// ---- sound cue sheet -----------------------------------------------------------------------------
	// E.sfx(t, name, db, extra) records a cue; nothing plays in the browser. render.ts reads the sheet
	// (the #film-data JSON written by mount) and mix.py lays assets/sfx/<name>.wav under the picture. In the handmade half cues snap to
	// the pose grid (a sound must land on the pose where the thing lands); later, to the frame grid.
	// extra: { exact: true } skips snapping; { pitch: semitones, pan: -1..1 } are passed to the mixer.
	function sfx(t, name, db = -12, extra = {}) {
		const grid = t < smoothFrom() ? POSE_FPS : FPS;
		const at = extra.exact ? t : Math.ceil(t * grid - 1e-6) / grid;
		SFX.push({ t: +at.toFixed(3), sfx: name, db, ...extra });
	}

	// ---- actors ----------------------------------------------------------------------------------
	// jitter: 0 for anything that crosses a matched cut or must sit pixel-still (UI chrome, captions).
	function actor(el, init = {}, { jitter = 1, origin = '50% 50%', twos = false } = {}) {
		const st = { x: 0, y: 0, r: 0, s: 1, sx: 1, sy: 1, o: 1, ry: 0, ...init };
		el.style.transformOrigin = origin;
		ACTORS.push({ el, st, jitter, twos, id: ACTORS.length, onRender: null });
		return st;
	}
	const actorOf = (st) => ACTORS.find((a) => a.st === st);
	function applyActor(a, s, step, handmade) {
		if (s.o <= 0.001) {
			a.el.style.visibility = 'hidden';
			return;
		}
		a.el.style.visibility = 'inherit';
		a.el.style.opacity = s.o >= 0.999 ? '1' : String(+s.o.toFixed(3));
		const j = handmade ? a.jitter : 0;
		// the hand: a sub-2px nudge and a fraction of a degree, different on every pose
		const jx = j ? (hash(step * 3.1 + a.id * 17.3) - 0.5) * 2.2 * j : 0;
		const jy = j ? (hash(step * 5.7 + a.id * 9.1) - 0.5) * 2.2 * j : 0;
		const jr = j ? (hash(step * 2.3 + a.id * 4.7) - 0.5) * 0.7 * j : 0;
		const flip = s.ry ? `perspective(2400px) rotateY(${s.ry.toFixed(2)}deg) ` : '';
		a.el.style.transform =
			`translate(${(s.x + jx).toFixed(2)}px, ${(s.y + jy).toFixed(2)}px) ${flip}` +
			`rotate(${(s.r + jr).toFixed(3)}deg) scale(${(s.s * s.sx).toFixed(4)}, ${(s.s * s.sy).toFixed(4)})`;
		if (a.onRender) a.onRender(s, step);
	}

	// ---- cameras -----------------------------------------------------------------------------------
	// A camera is a 1920x1080 wrapper (class "cam") holding a scene's world. It moves on ones.
	function camera(el, init = {}) {
		const st = { x: 0, y: 0, s: 1, r: 0, ...init };
		el.style.transformOrigin = '50% 50%';
		CAMS.push({ el, st });
		return st;
	}
	// Camera state that puts world point (px, py) at screen point (qx, qy) at scale s.
	// Two scenes that share world coordinates can hand a camera state across a cut with this.
	function frameOn(px, py, s, qx = W / 2, qy = H / 2) {
		return { x: qx - W / 2 - s * (px - W / 2), y: qy - H / 2 - s * (py - H / 2), s };
	}

	// ---- voiceover timing ----------------------------------------------------------------------------
	// window.VO[voice][id] = { file, on, off, dur, text, words: [[word, start, end], ...] } with times
	// relative to the take (see vo-data.js). voAt places a take so its speech starts at `start` and
	// returns absolute times. word() is tolerant: case and punctuation are ignored, digits and number
	// words match each other, and a phrase ("late again") matches consecutive words. If the wording
	// changed, it warns (render.ts prints the warning) and falls back to the middle of the line so the
	// scene still builds instead of crashing.
	const NUMS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
	const norm = (x) => String(x).toLowerCase().replace(/[^a-z0-9]/g, '');
	const numAlt = (k) => {
		if (/^\d+$/.test(k)) return NUMS[+k] || k;
		const i = NUMS.indexOf(k);
		return i >= 0 ? String(i) : k;
	};
	const same = (a, b) => a === b || numAlt(a) === b;
	function voAt(voice, id, start = PLAN.at(id)) {
		const v = window.VO && window.VO[voice] && window.VO[voice][id];
		if (!v) throw new Error(`voAt: no take for ${voice}/${id} in vo-data.js`);
		const t0 = start - v.on; // where the audio file itself starts
		const W_ = v.words.map(([w, a, b]) => [norm(w), a, b]);
		const find = (phrase, n) => {
			const keys = String(phrase).split(/\s+/).map(norm).filter(Boolean);
			let hit = 0;
			for (let i = 0; i + keys.length <= W_.length; i++) {
				if (!keys.every((k, j) => same(k, W_[i + j][0]))) continue;
				if (hit === n) return t0 + W_[i][1];
				hit++;
			}
			warn(`voAt: no "${phrase}"${n ? ` (#${n + 1})` : ''} in ${id}: "${v.words.map((x) => x[0]).join(' ')}"`);
			return t0 + (v.on + v.off) / 2;
		};
		const endOf = (phrase) => {
			const s = find(phrase, 0) - t0;
			const w = W_.find((x) => Math.abs(x[1] - s) < 1e-6);
			return t0 + (w ? w[2] : s);
		};
		return {
			id,
			file: v.file,
			at: t0,
			on: start,
			off: t0 + v.off,
			words: v.words.map(([w, a, b]) => [w, t0 + a, t0 + b]),
			word: (k) => find(k, 0), // onset of the first match
			nth: (k, n) => find(k, n), // onset of the n-th match (0-based)
			end: endOf // end of the first match
		};
	}

	// ---- captions ----------------------------------------------------------------------------------
	// Word by word, locked to the voiceover, on a solid strip in a reserved band at the bottom of the
	// frame (PLAN.captions.top). No text-shadow, no outline: the strip is the contrast.
	// Lines whose words are already on screen as kinetic type get cap: false in plan.js.
	function captions(stage, voice, lines) {
		const cfg = PLAN.captions || {};
		const fixes = cfg.fixes || {};
		const layer = h('<div id="captions" data-layout-ignore></div>', stage);
		const built = lines.map(([id, start, opts = {}]) => {
			const v = voAt(voice, id, start);
			const words = v.words.map(([w, a]) => [fixes[w] || w, Math.max(a, v.on)]);
			return { id, opts, words, first: words[0][1], end: v.off + (cfg.hold ?? 0.45) };
		});
		built.forEach((L, i) => {
			const cap = h(`<div class="cap ${L.opts.tone || ''}" style="top:${cfg.top ?? 948}px"><span class="strip"></span></div>`, layer);
			const strip = cap.firstChild;
			const next = built[i + 1];
			const end = next ? Math.min(L.end, next.first - 0.02) : L.end;
			const spans = L.words.map(([w, t]) => [h(`<span class="w">${w}</span>`, strip), t]);
			// captions run on ones even in the handmade half: sync with the voice beats style
			FRAME.push((t) => {
				const live = t >= L.first - 0.01 && t < end;
				cap.style.visibility = live ? 'inherit' : 'hidden';
				if (!live) return;
				for (const [el, at] of spans) el.style.opacity = t >= at - 0.01 ? '1' : '0';
			});
		});
	}

	// ---- kinetic type ------------------------------------------------------------------------------
	// Wrap each word of `text` in a span (so words can be revealed on their VO word).
	function words(parent, text, cls = 'kw') {
		return text.split(/\s+/).filter(Boolean).map((w) => h(`<span class="${cls}">${w}</span>`, parent));
	}
	// Blur to sharp with a small rise; optional soft blur-out. Seek-safe (pure function of time).
	// This helper owns the element's opacity, filter and CSS `translate` property, so never make the
	// same element an actor: wrap it, and move the wrapper.
	function blurText(el, { at, out = Infinity, d = 0.6, dOut = 0.35, blur = 14, y = 24, yOut = -18 }) {
		FRAME.push((t, ts) => {
			const c = clock(t, ts);
			const e = ease.out3(clamp01((c - at) / d));
			const q = out === Infinity ? 0 : ease.in2(clamp01((c - out) / dOut));
			const o = e * (1 - q);
			if (o <= 0.001) {
				el.style.visibility = 'hidden';
				return;
			}
			el.style.visibility = 'inherit';
			el.style.opacity = o >= 0.999 ? '1' : o.toFixed(3);
			const b = blur * (1 - e) + blur * 0.8 * q;
			el.style.filter = b > 0.05 ? `blur(${b.toFixed(2)}px)` : '';
			el.style.translate = `0 ${(y * (1 - e) + yOut * q).toFixed(2)}px`;
		});
	}

	// ---- seek-safe switches ------------------------------------------------------------------------
	// at(t, apply): apply(on) whenever "time >= t" flips (compared on the scene's clock).
	function at(t, apply) {
		let last = null;
		FRAME.push((tt, ts) => {
			const on = clock(tt, ts) >= t - 1e-6;
			if (on !== last) {
				last = on;
				apply(on);
			}
		});
	}
	// texts(el, [[t, text], ...]): an element whose text changes at given times (typing, counters).
	function texts(el, steps) {
		let last = null;
		FRAME.push((tt, ts) => {
			const c = clock(tt, ts);
			let v = steps[0][1];
			for (const [t, x] of steps) if (c >= t - 1e-6) v = x;
			if (v !== last) {
				last = v;
				el.textContent = v;
			}
		});
	}

	// ---- scene visibility ------------------------------------------------------------------------------
	// Exactly one scene is visible per frame: the last one whose start <= t. Cuts are frame-exact.
	function mountScenes() {
		const list = scenes().map(([id, t0], i, arr) => ({
			el: document.getElementById(id),
			t0,
			t1: i + 1 < arr.length ? arr[i + 1][1] : Infinity
		}));
		list.forEach((s) => {
			if (!s.el) throw new Error('SCENES lists a scene with no element: check index.html');
		});
		FRAME.push((t) => {
			for (const s of list) s.el.style.visibility = t >= s.t0 - 1e-4 && t < s.t1 - 1e-4 ? 'visible' : 'hidden';
		});
	}

	// ---- grain ---------------------------------------------------------------------------------------
	// Light film grain so flat colour never looks like a slide. ranges: [[t0, t1, opacity, onOnes]].
	// onOnes: a new tile every frame (lively); otherwise the grain boils on the pose grid (calmer), which
	// matches actors on twos. A handful of tiles would visibly loop, so each frame also shifts the tile by
	// a hashed offset: the grain never repeats, and it is still a pure function of time.
	function noiseTile(k, size) {
		const c = document.createElement('canvas');
		c.width = c.height = size;
		const g = c.getContext('2d');
		const im = g.createImageData(size, size);
		for (let i = 0; i < size * size; i++) {
			const v = Math.floor(hash(i * 0.71 + k * 911.3) * 255);
			im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v;
			im.data[i * 4 + 3] = 255;
		}
		g.putImageData(im, 0, 0);
		return c.toDataURL();
	}
	function grain(stage, ranges) {
		const layers = ranges.map(([t0, t1, op, ones]) => {
			const n = ones ? 6 : 4;
			const tiles = Array.from({ length: n }, (_, k) =>
				h(`<div class="grain" data-layout-ignore style="opacity:${op};background-image:url(${noiseTile(k + 1, 256)})"></div>`, stage)
			);
			return { t0, t1, tiles, ones };
		});
		FRAME.push((t, ts, step) => {
			const f = Math.floor(t * FPS + 1e-4);
			for (const L of layers) {
				const live = t >= L.t0 && t < L.t1;
				const n = L.ones ? f : step;
				const k = n % L.tiles.length;
				L.tiles.forEach((el, i) => {
					el.style.visibility = live && i === k ? 'visible' : 'hidden';
					if (live && i === k) el.style.backgroundPosition = `${Math.floor(hash(n * 1.37) * 256)}px ${Math.floor(hash(n * 2.91 + 7) * 256)}px`;
				});
			}
		});
	}

	// ---- per-frame render ----------------------------------------------------------------------------
	function render() {
		const t = tl.time();
		const step = Math.floor(t * POSE_FPS + 1e-4);
		const ts = step / POSE_FPS;
		const handmadeNow = t < smoothFrom();
		// Sample every actor's state at the stepped time (the pose), then put the timeline back.
		let poses = null;
		if (handmadeNow || ACTORS.some((a) => a.twos)) {
			tl.totalTime(ts, true);
			poses = ACTORS.map((a) => ({ ...a.st }));
			tl.totalTime(t, true);
		}
		ACTORS.forEach((a, i) => {
			if (handmadeNow || a.twos) applyActor(a, poses[i], step, true);
			else applyActor(a, { ...a.st }, step, false);
		});
		CAMS.forEach(({ el, st }) => {
			el.style.transform = `translate(${st.x.toFixed(2)}px, ${st.y.toFixed(2)}px) rotate(${st.r.toFixed(3)}deg) scale(${st.s.toFixed(4)})`;
		});
		FRAME.forEach((f) => f(t, ts, step));
	}

	// ---- mount: call once, after every builder has run ------------------------------------------------
	// It does not register the timeline: index.html does that itself, right after, because HyperFrames
	// checks for a literal window.__timelines[...] assignment in the composition file.
	function mount(root) {
		const attr = parseFloat(root.getAttribute('data-duration'));
		if (Math.abs(attr - PLAN.duration) > 1e-3) warn(`data-duration (${attr}) differs from PLAN.duration (${PLAN.duration})`);
		mountScenes();
		tl.set({}, {}, PLAN.duration); // the timeline is exactly as long as the film
		tl.eventCallback('onUpdate', render);
		window.__sfx = SFX;
		window.__film = filmData();
		exportFilmData(window.__film);
		render();
	}

	// ---- export for the mixer -------------------------------------------------------------------------
	// scripts/render/render.ts needs the timing table, the VO takes that are actually placed, and the SFX
	// cue sheet. It loads this page in a bare headless Chrome with --dump-dom (no Playwright, no Puppeteer)
	// and reads this JSON back out of the serialised DOM. The tag is inert: nothing renders it.
	function filmData() {
		const voice = PLAN.voice;
		const takes = (window.VO && window.VO[voice]) || {};
		return {
			title: PLAN.title,
			width: W,
			height: H,
			fps: FPS,
			duration: PLAN.duration,
			voice,
			scenes: scenes(),
			music: PLAN.music || {},
			vo: PLAN.vo.map(([id, onset]) => {
				const v = takes[id] || {};
				return { id, onset, file: v.file, on: v.on, off: v.off, dur: v.dur };
			}),
			sfx: SFX,
			warnings: WARN
		};
	}
	function exportFilmData(data) {
		let tag = document.getElementById('film-data');
		if (!tag) {
			tag = document.createElement('script');
			tag.type = 'application/json';
			tag.id = 'film-data';
			document.body.appendChild(tag);
		}
		// escape "<" so a caption or file name can never close the script tag early
		tag.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
	}

	window.E = {
		W, H, FPS, POSE_FPS, tl, h, $, $$, hash, clamp01, ease,
		actor, actorOf, camera, frameOn, sceneAt, sceneEnd, smoothFrom, clock, warn,
		voAt, captions, words, blurText, at, texts, grain, sfx, render, mount,
		ACTORS, CAMS, FRAME, SFX, WARN
	};
})();
