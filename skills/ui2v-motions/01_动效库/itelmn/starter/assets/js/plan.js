/* THE TIMING TABLE. The single source of truth for when things are heard.

   - vo:    where each voice line's SPEECH starts (seconds, absolute), not where its audio file starts.
            vo-data.js knows each take's leading silence and word timings; E.voAt() combines the two.
            Retime a line here and every visual beat anchored to its words moves with it.
   - music: named marks in the score (hits, drops, the quiet before the end). Cut on them. `file` is
            optional: without it the mix is voice and SFX only.
   - The cut list (window.SCENES) lives in index.html; scenes derive their windows from it.

   Rules: never type a raw second into a scene file. Get it from PLAN.at(), E.voAt(...).word('x'),
   E.sceneAt(id) or PLAN.music. E.mount() exports this object (as #film-data) for the mixer. */
window.PLAN = {
	title: 'Acme launch film',
	width: 1920,
	height: 1080,
	fps: 30,
	poseFps: 12, // handmade half: 12 poses per second ("on twos")
	duration: 9.6, // keep in sync with data-duration on #root (E.mount warns if they differ)
	smoothFrom: 's2', // a scene id or seconds: actors switch from handmade to smooth motion here
	voice: 'narrator', // key into window.VO
	// [id, speech onset (s), options]. cap: false when the words are already on screen as kinetic type.
	vo: [
		['h01', 0.4, { cap: false }], // "Your invoices are late again."
		['p01', 4.7, { cap: true }] //   "Acme sends them the moment work is done."
	],
	music: {
		file: null, // e.g. 'assets/audio/music/score.wav' (relative to the project root)
		gainDb: -3, // bed level before ducking
		downbeat: 0.0,
		hit: 4.4, // s1 -> s2 cut
		settle: 8.2,
		end: 9.6
	},
	captions: {
		top: 948, // the reserved band: nothing important is drawn below ~920 px
		hold: 0.45, // how long a caption stays after the last word
		fixes: { acme: 'Acme' } // transcript word -> display word (brand names TTS or ASR mangle)
	}
};

// Speech onset of a voice line.
window.PLAN.at = (id) => {
	const l = window.PLAN.vo.find((x) => x[0] === id);
	if (!l) throw new Error('PLAN.at: unknown voice line ' + id);
	return l[1];
};
