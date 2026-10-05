/* s1 · Hook. VO h01: "Your invoices are late again."

   One shot, one idea. The sentence builds word by word, each word landing on its spoken word (blur to
   sharp, slight rise). A breath. Then the phrase that matters BECOMES the object: "late again" flies
   down and shrinks into the status badge of the invoice it describes, while the first line blurs away.
   A held breath on the late invoice, then the camera pushes into its send rule. The cut into s2 is a
   matched cut: same invoice, same world rectangle (UI.CARD), same camera state (UI.KEY at
   UI.MATCH_S). s2 keeps pushing, so the move carries straight through the cut: no flash, no dip.

   This scene is before PLAN.smoothFrom, so its actors move on twos with a hand jitter (the handmade
   half). The camera moves on ones. Everything that crosses the cut has jitter 0.

   Every time below comes from the scene table or from VO words. The only numbers are durations and
   offsets of motion (how long a move takes), never a moment in the film. */
window.buildHook = function (E, VOICE) {
	const { h, tl, actor, camera, sfx, frameOn, blurText } = E;
	const T1 = E.sceneEnd('s1');
	const v = E.voAt(VOICE, 'h01');
	const sc = document.getElementById('s1');
	const camEl = h('<div class="cam" data-layout-allow-overflow></div>', sc);

	// the camera opens framed on the invoice's centre, so type and invoice share the middle of the frame
	const CX = UI.CARD.x + UI.CARD.w / 2;
	const CY = UI.CARD.y + UI.CARD.h / 2;
	const cam = camera(camEl, frameOn(CX, CY, 1));

	// ---- the invoice (hidden until the phrase needs somewhere to land) ------------------------------
	const card = UI.invoice(camEl);
	const cards = actor(card, { o: 0, y: 48 }, { jitter: 0 });
	const badge = card.querySelector('.badge.late');
	card.querySelector('.badge.sent').style.visibility = 'hidden';

	// ---- kinetic type: two lines, words on their VO words ------------------------------------------
	// Sizes must match .hook-line in s1-hook.css: the flight to the badge scales by their ratio.
	const HOOK_PX = 132;
	const LINE_H = 140;
	const line1 = h(`<div class="hook-line" data-layout-allow-overlap style="left:${CX - 900}px;top:${CY - LINE_H - 6}px"></div>`, camEl);
	const phraseBox = h(`<div class="hook-line accent" data-layout-allow-overlap style="left:${CX - 900}px;top:${CY + 6}px"></div>`, camEl);
	const w1 = E.words(line1, 'Your invoices are');
	const w2 = E.words(phraseBox, 'late again');

	const tSaid = v.end('again');
	// Line one clears first, so for a beat the phrase that matters is alone on the page. Only then does
	// the invoice rise and the phrase fly: two things never compete for the same moment.
	const tClear = tSaid + 0.15;
	const tFly = tSaid + 0.6; // line one is fully gone (0.35 s blur-out plus stagger) just before this
	const FLY = 0.5;
	const tLand = tFly + FLY;

	// each word resolves 60 ms before it is spoken (the eye should just win the race with the ear)
	w1.forEach((el, i) => blurText(el, { at: v.word(el.textContent) - 0.06, out: tClear + i * 0.035, d: 0.55 }));
	w2.forEach((el) => blurText(el, { at: v.word(el.textContent) - 0.06, d: 0.55 }));

	// ---- the phrase becomes the badge ------------------------------------------------------------------
	// The phrase box is 1800 px wide and centred on CX, so its centre is known without measuring text.
	// Its landing spot is the badge's centre; the scale is the ratio of the two font sizes.
	const BADGE = { x: UI.CARD.x + UI.BADGE.x + UI.BADGE.w / 2, y: UI.CARD.y + UI.BADGE.y + UI.BADGE.h / 2 };
	const from = { x: CX, y: CY + 6 + LINE_H / 2 };
	const ph = actor(phraseBox, {}, { jitter: 0.6 });
	tl.to(ph, { x: BADGE.x - from.x, y: BADGE.y - from.y, s: UI.BADGE.font / HOOK_PX, duration: FLY, ease: 'power3.inOut' }, tFly);
	// the invoice rises in underneath and has settled before the phrase arrives
	tl.to(cards, { o: 1, duration: 0.25, ease: 'power2.out' }, tFly - 0.05).to(cards, { y: 0, duration: 0.45, ease: 'expo.out' }, tFly - 0.05);
	// on landing, the text hands over to the real badge (same words, same size, same place)
	const bs = actor(badge, { o: 0 }, { jitter: 0 });
	tl.set(ph, { o: 0 }, tLand).set(bs, { o: 1, s: 1.08 }, tLand).to(bs, { s: 1, duration: 0.25, ease: 'power3.out' }, tLand);
	sfx(tFly, 'whoosh', -26);
	sfx(tLand, 'click', -18);

	// ---- camera: a slow drift, a held breath on the late invoice, then the push through the cut -------
	const tPush = T1 - 0.6;
	tl.to(cam, { ...frameOn(CX, CY, 1.03), duration: tFly, ease: 'power1.inOut' }, 0);
	tl.to(cam, { ...frameOn(UI.KEY.x, UI.KEY.y, UI.MATCH_S), duration: T1 - tPush, ease: 'power2.in' }, tPush);
	sfx(tPush + 0.2, 'whoosh', -20);

	if (tPush - tLand < 0.4) E.warn('s1: less than 0.4 s of breathing room between the badge landing and the push');
};
