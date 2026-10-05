/* s2 · Product. VO p01: "Acme sends them the moment work is done."

   Opens on the matched cut from s1: the same invoice at the same world rectangle, the camera at the
   same state, still pushing in (velocity carried through the cut) until the send rule fills the
   frame. Progressive disclosure, one idea at a time:
     1. "sends": "Manually, when you remember." is struck through and retyped as the new rule.
        Nothing else moves.
     2. a breath, then "done": the camera pulls back and reveals where the invoice lives, the real product
        (window chrome, sidebar, breadcrumb). The one primary button, Mark done, rises in.
     3. a cursor presses Mark done; the badge flips to "sent" and the meta line updates. A long,
        slowly drifting hold to the end.

   From here on PLAN.smoothFrom is reached: actors move on ones, eased, no jitter. */
window.buildProduct = function (E, VOICE) {
	const { h, tl, actor, camera, sfx, frameOn, clamp01, ease, FRAME } = E;
	const T0 = E.sceneAt('s2');
	const T1 = E.sceneEnd('s2');
	const v = E.voAt(VOICE, 'p01');
	const sc = document.getElementById('s2');
	const camEl = h('<div class="cam" data-layout-allow-overflow></div>', sc);

	// The product window is built now but stays invisible until the pull-back, so at the cut the frame
	// holds exactly what s1 showed: the invoice on paper. It fades in around the invoice as the camera pulls out.
	const app = UI.appWindow(camEl);
	const apps = actor(app, { o: 0 }, { jitter: 0 });
	const card = UI.invoice(camEl);
	const q = (s) => card.querySelector(s);

	// ---- 0. the matched cut: start exactly where s1 ended, keep pushing ------------------------------
	const cam = camera(camEl, frameOn(UI.KEY.x, UI.KEY.y, UI.MATCH_S));
	// power2.in ended s1 at about 1.7 scale/s; 0.4 of scale over 0.7 s with power3.out starts at the same speed
	tl.to(cam, { ...frameOn(UI.KEY.x, UI.KEY.y, UI.MATCH_S + 0.4), duration: 0.7, ease: 'power3.out' }, T0);

	// ---- 1. "sends": strike, then retype -----------------------------------------------------------------
	const tSends = v.word('sends');
	const strike = q('.strike');
	const oldTxt = q('.key .old');
	const newTxt = q('.key .new');
	const caret = q('.key .caret');
	const NEW = 'Automatically, when work is done.';
	const tStrike = tSends + 0.02;
	const tType = tSends + 0.45;
	const CPS = 0.022; // seconds per character: fast, but each letter is still readable as typing
	const tTyped = tType + NEW.length * CPS;
	FRAME.push((t) => {
		const p = ease.out3(clamp01((t - tStrike) / 0.24));
		strike.style.transform = `scaleX(${p.toFixed(3)})`;
		const gone = clamp01((t - (tType - 0.12)) / 0.12);
		oldTxt.style.opacity = (1 - gone).toFixed(3);
		oldTxt.style.visibility = gone >= 1 ? 'hidden' : 'inherit';
		caret.style.visibility = t >= tType && t < tTyped + 0.5 ? 'inherit' : 'hidden';
	});
	E.texts(newTxt, [[0, ''], ...NEW.split('').map((_, k) => [tType + k * CPS, NEW.slice(0, k + 1)])]);
	sfx(tStrike, 'click', -20);

	// ---- 2. "done": pull back to the product, the one CTA rises ------------------------------------------
	const tDone = v.word('done');
	const tBack = Math.max(tDone - 0.05, tTyped + 0.4); // never cut the breath after the typing short
	const BACK = 0.9;
	tl.to(cam, { x: 0, y: 0, s: 1, duration: BACK, ease: 'power2.inOut' }, tBack);
	tl.to(cam, { s: 1.015, duration: T1 - (tBack + BACK), ease: 'none' }, tBack + BACK); // the hold still drifts
	tl.to(apps, { o: 1, duration: BACK * 0.7, ease: 'power2.out' }, tBack + 0.1);

	const cta = UI.ctaButton(camEl, 'Mark done');
	const cs0 = actor(cta, { o: 0, y: 14 }, { jitter: 0 });
	const tCta = tBack + BACK * 0.55;
	tl.to(cs0, { o: 1, duration: 0.3, ease: 'power2.out' }, tCta).to(cs0, { y: 0, duration: 0.6, ease: 'expo.out' }, tCta);

	// ---- 3. the press ----------------------------------------------------------------------------------
	const cur = UI.cursor(camEl);
	const target = { x: UI.CTA.x + UI.CTA.w * 0.55, y: UI.CTA.y + UI.CTA.h * 0.6 };
	const cs = actor(cur, { o: 0, x: 1380, y: 700 }, { jitter: 0, origin: '0 0' });
	const tCur = tBack + BACK + 0.1;
	const tPress = tCur + 0.6;
	tl.to(cs, { o: 1, duration: 0.15 }, tCur).to(cs, { x: target.x, y: target.y, duration: 0.5, ease: 'power3.out' }, tCur);
	tl.to(cs, { s: 0.88, duration: 0.07, ease: 'power2.out' }, tPress).to(cs, { s: 1, duration: 0.25, ease: 'expo.out' }, tPress + 0.08);
	tl.to(cs, { o: 0, duration: 0.3 }, tPress + 0.7);
	FRAME.push((t) => cta.classList.toggle('pressed', t >= tPress && t < tPress + 0.12)); // a 3 px press, then release
	E.texts(cta, [[0, 'Mark done'], [tPress + 0.1, 'Done']]);
	sfx(tPress, 'click', -10, { exact: true });

	// the invoice resolves: badge crossfade, meta line updates
	const late = actor(q('.badge.late'), { o: 1 }, { jitter: 0 });
	const sent = actor(q('.badge.sent'), { o: 0, s: 1.08 }, { jitter: 0 });
	const tSent = tPress + 0.12;
	tl.to(late, { o: 0, duration: 0.18, ease: 'power2.in' }, tSent).to(sent, { o: 1, s: 1, duration: 0.4, ease: 'expo.out' }, tSent + 0.06);
	E.texts(q('.meta'), [[0, 'Brightline Studio · due 14 days ago'], [tSent, 'Brightline Studio · sent just now']]);
	sfx(tSent, 'thud', -16);

	if (T1 - tSent < 0.8) E.warn('s2: the final beat needs at least 0.8 s of hold before the film ends');
};
