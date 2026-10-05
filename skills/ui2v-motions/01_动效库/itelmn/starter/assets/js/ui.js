/* Shared UI pieces: plain HTML builders, no animation (scenes animate them). Styled by assets/css/ui.css.

   The product is fictional: Acme, an invoicing tool. The one object the film is about is an invoice
   card, and the one line on it that matters is its "Send" rule.

   Owned by the lead, like engine.js and plan.js. The geometry constants below are the CONTRACT for
   the matched cut between s1 and s2: both scenes build the same invoice at the same world rectangle,
   so a camera state computed with E.frameOn() means the same pixels on both sides of the cut.
   Change them here, never inside a scene file (and keep ui.css in step: it only styles, it never
   places anything these constants place). */
(function () {
	const { h } = E;

	// World-space rectangles (px, 1920x1080 world, camera scale 1).
	// The app window stays above the caption band (PLAN.captions.top), so a caption never covers product UI.
	const APP = { x: 160, y: 56, w: 1600, h: 860 };
	const CHROME_H = 48; // window title bar
	const SIDE_W = 280; // sidebar
	const BAR_H = 80; // page header with the breadcrumb and the CTA
	// The invoice floats in the app canvas: centred horizontally, 48 px below the header.
	const CARD = { x: 620, y: APP.y + CHROME_H + BAR_H + 48, w: 960, h: 600 };
	const ROW_TOP = [272, 352, 432]; // rows inside the card (each row is 64 px tall)
	const ROW_H = 64;
	// The status badge, relative to the card. s1 flies its kinetic phrase into this exact box.
	const BADGE = { x: 48, y: 44, w: 168, h: 40, font: 22 };
	// The line that matters: the send rule (row 3). Its centre is where both cameras aim at the cut.
	const KEY = { x: CARD.x + 400, y: CARD.y + ROW_TOP[2] + ROW_H / 2 };
	// Camera scale at the s1 -> s2 cut: s1 pushes in to it, s2 starts from it and keeps going.
	const MATCH_S = 1.5;
	// The only primary button in the film, vertically centred in the page header.
	const CTA = { x: APP.x + APP.w - 32 - 150, y: APP.y + CHROME_H + (BAR_H - 52) / 2, w: 150, h: 52 };

	function invoice(parent) {
		const b = `left:${BADGE.x}px;top:${BADGE.y}px;width:${BADGE.w}px;height:${BADGE.h}px;font-size:${BADGE.font}px`;
		const row = (i) => `top:${ROW_TOP[i]}px;height:${ROW_H}px`;
		return h(
			`<article class="invoice" data-layout-ignore style="left:${CARD.x}px;top:${CARD.y}px;width:${CARD.w}px;height:${CARD.h}px">
			<span class="badge late" style="${b}">late again</span>
			<span class="badge sent" style="${b}">sent</span>
			<h1>Invoice #1042</h1>
			<p class="meta">Brightline Studio · due 14 days ago</p>
			<div class="row" style="${row(0)}"><span class="k">Item</span><span class="txt">Brand workshop</span><span class="amt">$2,400</span></div>
			<div class="row" style="${row(1)}"><span class="k">Item</span><span class="txt">Homepage design</span><span class="amt">$4,800</span></div>
			<div class="row key" style="${row(2)}"><span class="k">Send</span><span class="txt"><span class="old"><b>Manually</b>, when you remember.<s class="strike"></s></span><span class="new"></span><em class="caret"></em></span></div>
			<p class="total" style="top:${ROW_TOP[2] + ROW_H + 36}px"><span>Total due</span><b>$7,200</b></p>
			</article>`,
			parent
		);
	}

	function appWindow(parent) {
		const nav = ['Invoices', 'Clients', 'Projects', 'Settings'];
		return h(
			`<div class="app" data-layout-ignore style="left:${APP.x}px;top:${APP.y}px;width:${APP.w}px;height:${APP.h}px">
			<div class="chrome" style="height:${CHROME_H}px"><i></i><i></i><i></i><span class="url">app.acme.com/invoices/1042</span></div>
			<aside class="side" style="top:${CHROME_H}px;width:${SIDE_W}px"><div class="logo"><span class="mk"></span>Acme</div>
				${nav.map((n, i) => `<div class="nav${i === 0 ? ' on' : ''}">${n}</div>`).join('')}</aside>
			<div class="bar" style="top:${CHROME_H}px;left:${SIDE_W}px;height:${BAR_H}px"><span class="crumb">Invoices <em>/</em> <b>#1042</b></span></div>
			<div class="canvas" style="top:${CHROME_H + BAR_H}px;left:${SIDE_W}px"></div>
			</div>`,
			parent
		);
	}

	// The call to action. One per frame, ever.
	function ctaButton(parent, label) {
		return h(
			`<span class="btn primary cta" data-layout-ignore style="left:${CTA.x}px;top:${CTA.y}px;width:${CTA.w}px;height:${CTA.h}px">${label}</span>`,
			parent
		);
	}

	const CURSOR = '<svg viewBox="0 0 28 36" width="40" height="52"><path d="M2 2v28l7.5-7 5 11 5-2.2-5-10.8H25z" fill="#1B1A18" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/></svg>';
	function cursor(parent) {
		return h(`<div class="cursor" data-layout-ignore>${CURSOR}</div>`, parent);
	}

	window.UI = { APP, CARD, BADGE, KEY, MATCH_S, CTA, invoice, appWindow, ctaButton, cursor };
})();
