/* global window, document, gsap */
/* =================================================================
   short-pipe marketing video timeline.

   Frame 0 is the OUTRO (the pipe mark + wordmark + install command) so
   the X thumbnail doubles as a seamless loop point. Then the story of
   one real cut, from the very beginning:

     drag a long-form file onto the library dropzone -> the project opens
     in the editor on an hour-long "The Focus Hour" -> ask the agent to
     find shorts -> it transcribes locally and scans the transcript
     (nothing leaves the machine) -> three ranked shorts drop into the
     filmstrip -> the top one plays as a captioned 9:16 short -> swap the
     caption style live -> open the transcript editor and drag the handle
     to extend the clip word by word -> nudge the precise out point on the
     waveform -> Save -> Export 1080x1920 -> the pill flips to rendered ->
     wipe back to the outro.

   One camera (#stage) holds the whole app at identity and pushes in on
   each beat. The cursor lives outside the stage and only ever clicks
   while the camera is static, so its targets map exactly through the
   current transform.
   ================================================================= */

window.__timelines = window.__timelines || {}
const tl = gsap.timeline({ paused: true })

const $ = (id) => document.getElementById(id)
const PERIOD = 2.9 // one full two-group caption loop (2 * BEAT)

/* ----------------------------------------------------------------
   1. Measure the real layout (identity transform) across the views.
   ---------------------------------------------------------------- */
const rectC = (el) => {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, left: r.left, top: r.top, right: r.right, bottom: r.bottom }
}

// pass H - library (default load state)
const dropzoneR = rectC($('dropzone'))

// switch to the editor
$('home-view').style.display = 'none'
$('work-view').style.display = 'flex'

// pass W - agent empty-state + inspector placeholder
const findBtnR = rectC($('find-btn'))
const filmPaneR = rectC(document.querySelector('.pane.filmstrip'))
const stagePaneR = rectC($('stage-pane'))
const inspPaneR = rectC($('inspector-pane'))

// pass W2 - phone preview + filled inspector
$('agent-empty').style.display = 'none'
$('phone-wrap').style.display = 'flex'
$('insp-empty').style.display = 'none'
$('insp-full').style.display = 'flex'
const phoneR = rectC(document.querySelector('.phone'))
const capPopR = rectC($('cap-pop'))
const editBtnR = rectC($('edit-btn'))
const exportR = rectC($('export-cta'))

// pass W3 - transcript trim
$('phone-wrap').style.display = 'none'
$('stage-scroll').style.display = 'none'
$('trim-wrap').style.display = 'flex'
$('insp-full').style.display = 'none'
$('insp-trimming').style.display = 'block'
$('grip-b').style.display = 'inline-block'
const gripAR = rectC($('grip-a'))
const gripBR = rectC($('grip-b'))
const saveRangeR = rectC($('save-range'))

// Build the waveform peak bars deterministically (no Math.random in the draw, so
// every render is identical). The base layer is muted; an identical vermillion
// layer sits in a clip window that grows with the selection. A quiet gap around
// 89-94% is the detected pause after "boredom" - where the out point lands.
;(function buildWaveformBars() {
  const base = $('wf-bars-base')
  const sel = $('wf-bars-sel')
  if (!base || !sel || base.childElementCount) return
  const N = 96
  let seed = 1337
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  for (let i = 0; i < N; i++) {
    const t = i / N
    let amp = 0.42 + 0.42 * Math.abs(Math.sin(i * 0.7)) * (0.6 + 0.4 * Math.sin(i * 0.21))
    amp *= 0.7 + 0.55 * rnd()
    if (t < 0.1) amp *= 0.22 + t * 2.2 // quiet lead-in
    if (t > 0.892 && t < 0.945) amp *= 0.12 // the pause after "boredom"
    if (t > 0.955) amp *= 0.32 // trailing quiet
    amp = Math.max(0.06, Math.min(1, amp))
    const h = Math.round(amp * 78)
    const b1 = document.createElement('i')
    b1.style.height = h + 'px'
    base.appendChild(b1)
    const b2 = document.createElement('i')
    b2.style.height = h + 'px'
    sel.appendChild(b2)
  }
  // Size the selection bars to the full content width and offset them left by the
  // 14.6% in-point, so they line up with the base bars through the clip window.
  const w = $('wf-content').clientWidth
  sel.style.width = w + 'px'
  sel.style.left = -0.146 * w + 'px'
})()
const wfContentR = rectC($('wf-content'))

// restore the default load state (library shown, editor hidden)
$('grip-b').style.display = 'none'
$('trim-wrap').style.display = 'none'
$('stage-scroll').style.display = ''
$('insp-trimming').style.display = 'none'
$('agent-empty').style.display = ''
$('phone-wrap').style.display = 'none'
$('insp-empty').style.display = ''
$('insp-full').style.display = 'none'
$('work-view').style.display = 'none'
$('home-view').style.display = ''

const unionBox = (a, b) => {
  const left = Math.min(a.left, b.left)
  const top = Math.min(a.top, b.top)
  const right = Math.max(a.right, b.right)
  const bottom = Math.max(a.bottom, b.bottom)
  return { x: (left + right) / 2, y: (top + bottom) / 2, w: right - left, h: bottom - top }
}
const fitScale = (box, fill) => Math.min((1080 * fill) / box.w, (1080 * fill) / box.h)
const editPair = unionBox(phoneR, capPopR)
const editScale = fitScale(editPair, 0.82)

/* ----------------------------------------------------------------
   2. Camera + cursor helpers.
   ---------------------------------------------------------------- */
let curCam = { x: 0, y: 0, s: 1 }
function setCam(cx, cy, s, t, dur, ease) {
  const x = 540 - s * cx
  const y = 540 - s * cy
  tl.to('#stage', { x, y, scale: s, duration: dur, ease: ease || 'power2.inOut', force3D: false }, t)
  curCam = { x, y, s }
}
function resetCam(t, dur) {
  tl.to('#stage', { x: 0, y: 0, scale: 1, duration: dur, ease: 'power2.inOut', force3D: false }, t)
  curCam = { x: 0, y: 0, s: 1 }
}
const mapPt = (px, py) => [curCam.x + curCam.s * px, curCam.y + curCam.s * py]

const CURX = 5
const CURY = 4
function moveCursor(px, py, t, dur) {
  const [sx, sy] = mapPt(px, py)
  tl.to('#cursor', { x: sx - CURX, y: sy - CURY, duration: dur, ease: 'power2.inOut' }, t)
}
function clickAt(px, py, t) {
  const [sx, sy] = mapPt(px, py)
  tl.set('#click-ring', { x: sx, y: sy, scale: 0, opacity: 1 }, t)
  tl.to('#click-ring', { scale: 2, opacity: 0, duration: 0.5, ease: 'power2.out' }, t)
  tl.to('#cursor', { scale: 0.9, duration: 0.08, ease: 'power2.out' }, t)
  tl.to('#cursor', { scale: 1, duration: 0.15, ease: 'power2.out' }, t + 0.08)
}
const cursorIn = (t) => tl.to('#cursor', { opacity: 1, duration: 0.25, ease: 'power1.out' }, t)
const cursorOut = (t) => tl.to('#cursor', { opacity: 0, duration: 0.25, ease: 'power2.in' }, t)
function crossfade(aSel, bSel, t) {
  tl.to(aSel, { opacity: 0, duration: 0.25, ease: 'power2.in' }, t)
  tl.to(bSel, { opacity: 1, duration: 0.3, ease: 'power2.out' }, t + 0.05)
}
// sequential swap for stacked numerals - the old value clears before the new
// one appears, so digits never superimpose mid-transition.
function snapCross(aSel, bSel, t) {
  tl.to(aSel, { opacity: 0, duration: 0.12, ease: 'power2.in' }, t)
  tl.to(bSel, { opacity: 1, duration: 0.14, ease: 'power2.out' }, t + 0.13)
}

const BEAT = 1.45 // one caption group's dwell
function captionCycle(pre, start, cycles, pop, groups) {
  const gs = groups || ['a', 'b']
  for (let k = 0; k < cycles; k++) {
    const base = start + k * gs.length * BEAT
    gs.forEach((g, i) => {
      const sel = '#' + pre + '-' + g
      const t0 = base + i * BEAT
      if (pop) {
        tl.fromTo(sel, { opacity: 0, scale: 0.72 }, { opacity: 1, scale: 1, duration: 0.24, ease: 'back.out(1.7)', immediateRender: false }, t0 + 0.05)
      } else {
        tl.fromTo(sel, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.26, ease: 'power3.out', immediateRender: false }, t0 + 0.05)
      }
      tl.to(sel, { opacity: 0, duration: 0.18, ease: 'power2.in' }, t0 + 1.25)
    })
  }
}
function scrubberCycle(start, cycles, period) {
  const p = period || PERIOD
  for (let k = 0; k < cycles; k++) {
    tl.fromTo('#scrub-fill', { width: '0%' }, { width: '100%', duration: p - 0.15, ease: 'none', immediateRender: false }, start + k * p)
  }
}

/* ----------------------------------------------------------------
   3. Frame 0 = the settled outro poster (thumbnail + loop point).
   ---------------------------------------------------------------- */
;(function buildOutroPoster() {
  const clone = document.getElementById('outro').cloneNode(true)
  clone.id = 'outro-poster'
  clone.style.opacity = '1'
  clone.style.display = 'flex'
  document.getElementById('root').appendChild(clone)
})()

/* ----------------------------------------------------------------
   4. t = 0 initial state.
   ---------------------------------------------------------------- */
const CHIP_X = 678
const CHIP_Y = 250

tl.set('#stage', { x: 0, y: 0, scale: 1, transformOrigin: '0 0', force3D: false }, 0)
tl.set('#outro', { display: 'none', opacity: 0 }, 0)
tl.set('#home-view', { opacity: 1 }, 0)
tl.set('#ae-idle', { opacity: 1 }, 0)
tl.set('#ae-running', { opacity: 0 }, 0)
tl.set('#run-spinner', { rotation: 0 }, 0)
tl.set(['#clip-1', '#clip-2', '#clip-3'], { opacity: 0, y: 14 }, 0)
tl.set(['#sc-1', '#sc-2', '#sc-3'], { opacity: 0 }, 0)
tl.set('#sc-0', { opacity: 1 }, 0)
tl.set(['#insp-pill-p', '#insp-pill-r', '#clip1-pill-r'], { opacity: 0 }, 0)
tl.set(['#cc-a', '#cc-b', '#cc-c', '#cp-a', '#cp-b', '#cp-c'], { opacity: 0 }, 0)
tl.set('#scrub-fill', { width: '0%' }, 0)
tl.set('#play-ind', { opacity: 1 }, 0)
tl.set('#rendered-note', { opacity: 0 }, 0)
tl.set(['#twc-b', '#twr-b', '#twd-b', '#im-b', '#id-b', '#c1m-b', '#sd-b', '#pa-b'], { opacity: 0 }, 0)
tl.set('#grip-b', { opacity: 0 }, 0)
// waveform starts on the original (3.7s) selection: in-point 14.6%, out 64.6%
tl.set(['#wf-out-b', '#wf-dur-b', '#twd-c'], { opacity: 0 }, 0)
tl.set('#wf-h-start', { left: '14.6%' }, 0)
tl.set('#wf-h-end', { left: '64.6%' }, 0)
tl.set(['#wf-sel', '#wf-tint'], { width: '50%' }, 0)
// extension words start with a 0-alpha caution-wash so the highlight fades in
// in-hue (animating from plain `transparent` would blend through grey)
tl.set(['#ext-1', '#ext-2', '#ext-3', '#ext-4', '#ext-5', '#ext-6'], { backgroundColor: 'rgba(251,231,188,0)' }, 0)
tl.set('#file-chip', { x: CHIP_X - 14, y: CHIP_Y - 10, opacity: 0, scale: 1 }, 0)
tl.set('#cursor', { opacity: 0, x: CHIP_X - CURX, y: CHIP_Y - CURY, scale: 1 }, 0)
tl.set('#click-ring', { opacity: 0 }, 0)
tl.set('#wipe', { y: '100%' }, 0)

/* intro wipe: cover, drop the poster, reveal the library */
tl.to('#wipe', { y: '0%', duration: 0.3, ease: 'power3.in' }, 0.05)
tl.to('#outro-poster', { opacity: 0, duration: 0.03, ease: 'none', immediateRender: false }, 0.36)
tl.set('#outro-poster', { display: 'none' }, 0.39)
tl.to('#wipe', { y: '-100%', duration: 0.34, ease: 'power3.out' }, 0.42)

/* ----------------------------------------------------------------
   SCENE A - drag a long-form file onto the dropzone -> open the project.
   ---------------------------------------------------------------- */
cursorIn(1.5)
tl.to('#file-chip', { opacity: 1, duration: 0.3, ease: 'power2.out' }, 1.5)
// drag down into the dropzone
tl.to('#cursor', { x: dropzoneR.x - CURX, y: dropzoneR.y - CURY, duration: 1.3, ease: 'power2.inOut' }, 1.8)
tl.to('#file-chip', { x: dropzoneR.x - 14, y: dropzoneR.y - 10, duration: 1.3, ease: 'power2.inOut' }, 1.8)
// the dropzone lights up as the file arrives
tl.to('#dropzone', { backgroundColor: '#fbe4dd', borderColor: '#e8b8ae', duration: 0.3, ease: 'power2.out' }, 2.7)
// drop
tl.to('#file-chip', { scale: 0.5, opacity: 0, duration: 0.35, ease: 'power2.in' }, 3.2)
clickAt(dropzoneR.x, dropzoneR.y, 3.2)
tl.to('#dropzone', { backgroundColor: '#f3f3f0', borderColor: '#cfcdc4', duration: 0.3, ease: 'power2.inOut' }, 3.5)
cursorOut(3.45)
// create the project: library -> editor
tl.to('#home-view', { opacity: 0, duration: 0.35, ease: 'power2.in' }, 3.6)
tl.set('#home-view', { display: 'none' }, 3.96)
tl.set('#work-view', { display: 'flex', opacity: 0 }, 3.96)
tl.to('#work-view', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 4.0)

/* ----------------------------------------------------------------
   SCENE B - ask the agent to find shorts.
   ---------------------------------------------------------------- */
cursorIn(5.0)
moveCursor(findBtnR.x, findBtnR.y, 5.05, 0.8)
clickAt(findBtnR.x, findBtnR.y, 5.9)
tl.to('#find-btn', { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center', ease: 'power2.out' }, 5.9)
cursorOut(6.05)

/* ----------------------------------------------------------------
   SCENE C - the agent runs on-device: spinner + one rotating status.
   ---------------------------------------------------------------- */
tl.to('#ae-idle', { opacity: 0, duration: 0.25, ease: 'power2.in' }, 6.05)
tl.set('#ae-idle', { display: 'none' }, 6.3)
tl.to('#ae-running', { opacity: 1, duration: 0.3, ease: 'power2.out' }, 6.25)
tl.to('#run-spinner', { rotation: 360, duration: 0.7, ease: 'none', repeat: 6 }, 6.2)
setCam(stagePaneR.x, stagePaneR.y, 1.5, 6.2, 0.7)

tl.to('#rs-0', { opacity: 0, duration: 0.2 }, 7.3)
tl.to('#rs-1', { opacity: 1, duration: 0.25 }, 7.45)
tl.to('#rs-1', { opacity: 0, duration: 0.2 }, 8.4)
tl.to('#rs-2', { opacity: 1, duration: 0.25 }, 8.55)
tl.to('#rs-2', { opacity: 0, duration: 0.2 }, 9.5)
tl.to('#rs-3', { opacity: 1, duration: 0.25 }, 9.65)
tl.to('#rs-3', { opacity: 0, duration: 0.2 }, 10.95)

/* ----------------------------------------------------------------
   SCENE D - three ranked shorts drop into the filmstrip.
   ---------------------------------------------------------------- */
setCam(filmPaneR.x, filmPaneR.y, 1.62, 10.2, 0.8)
tl.to('#clip-1', { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 10.7)
tl.to('#sc-0', { opacity: 0, duration: 0.2 }, 10.7)
tl.to('#sc-1', { opacity: 1, duration: 0.2 }, 10.8)
tl.to('#clip-2', { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 11.25)
tl.to('#sc-1', { opacity: 0, duration: 0.2 }, 11.25)
tl.to('#sc-2', { opacity: 1, duration: 0.2 }, 11.35)
tl.to('#clip-3', { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 11.8)
tl.to('#sc-2', { opacity: 0, duration: 0.2 }, 11.8)
tl.to('#sc-3', { opacity: 1, duration: 0.2 }, 11.9)
tl.to('#clip-1', { backgroundColor: '#ffffff', borderColor: '#cfcdc4', boxShadow: '0 1px 2px rgba(15,14,12,0.05)', duration: 0.3, ease: 'power2.out' }, 12.4)

/* ----------------------------------------------------------------
   SCENE E - the top short plays as a captioned 9:16 preview.
   ---------------------------------------------------------------- */
tl.to('#ae-running', { opacity: 0, duration: 0.2 }, 12.2)
tl.set('#agent-empty', { display: 'none' }, 12.45)
tl.set('#phone-wrap', { display: 'flex', opacity: 0 }, 12.45)
tl.set('#insp-empty', { display: 'none' }, 12.45)
tl.set('#insp-full', { display: 'flex' }, 12.45)
tl.to('#insp-pill-p', { opacity: 1, duration: 0.3, ease: 'power2.out' }, 12.6)
setCam(phoneR.x, phoneR.y, 1.7, 12.5, 0.95)
tl.to('#phone-wrap', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 12.7)
tl.to('#play-ind', { opacity: 0, duration: 0.3, ease: 'power2.in' }, 13.6)
captionCycle('cc', 13.9, 2, false)
scrubberCycle(13.9, 2)

/* ----------------------------------------------------------------
   SCENE F - swap the caption style live (clean -> bold-pop).
   ---------------------------------------------------------------- */
setCam(editPair.x, editPair.y, editScale, 17.9, 0.8)
cursorIn(18.9)
moveCursor(capPopR.x, capPopR.y, 18.95, 0.7)
clickAt(capPopR.x, capPopR.y, 19.7)
tl.to('#cap-clean', { backgroundColor: 'rgba(255,255,255,0)', color: '#5a5750', duration: 0.2 }, 19.7)
tl.set('#cap-clean', { boxShadow: 'none' }, 19.7)
tl.to('#cap-pop', { backgroundColor: '#ffffff', color: '#16161a', duration: 0.2 }, 19.7)
tl.set('#cap-pop', { boxShadow: '0 1px 2px rgba(15,14,12,0.05)' }, 19.7)
cursorOut(19.9)
tl.set(['#cc-a', '#cc-b'], { opacity: 0 }, 19.85)
captionCycle('cp', 20.0, 1, true)
scrubberCycle(20.0, 1)

/* ----------------------------------------------------------------
   SCENE G - open the transcript editor; drag the handle to extend.
   ---------------------------------------------------------------- */
resetCam(21.5, 0.7)
cursorIn(22.3)
moveCursor(editBtnR.x, editBtnR.y, 22.35, 0.8)
clickAt(editBtnR.x, editBtnR.y, 23.2)
tl.to('#edit-btn', { scale: 0.98, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center', ease: 'power2.out' }, 23.2)
cursorOut(23.35)
// swap the center pane to the trim view, inspector to "Trimming..."
tl.set('#stage-scroll', { display: 'none' }, 23.5)
tl.set('#trim-wrap', { display: 'flex', opacity: 0 }, 23.5)
tl.set('#insp-full', { display: 'none' }, 23.5)
tl.set('#insp-trimming', { display: 'block' }, 23.5)
tl.to('#trim-wrap', { opacity: 1, duration: 0.35, ease: 'power2.out' }, 23.55)
setCam(stagePaneR.x, (gripAR.y + gripBR.y) / 2, 1.4, 23.7, 0.9)

// grab the transcript end handle and drag it right, growing by words
cursorIn(24.7)
moveCursor(gripAR.x, gripAR.y, 24.75, 0.7)
tl.to('#cursor', { scale: 0.9, duration: 0.12, ease: 'power2.out' }, 25.45)
moveCursor(gripBR.x, gripBR.y, 25.7, 1.1)
const exts = ['#ext-1', '#ext-2', '#ext-3', '#ext-4', '#ext-5', '#ext-6']
exts.forEach((sel, i) => {
  tl.to(sel, { backgroundColor: '#fbe7bc', duration: 0.22, ease: 'power1.out' }, 25.85 + i * 0.13)
})
// the end handle moves from after "ideas" to after "boredom"
tl.to('#grip-a', { opacity: 0, duration: 0.2 }, 26.45)
tl.set('#grip-b', { display: 'inline-block' }, 26.45)
tl.to('#grip-b', { opacity: 1, duration: 0.2 }, 26.5)
// the word readouts tick up: 8 -> 14 words, 0:06-0:09 -> 0:06-0:11, 3.7s -> 5.5s
snapCross('#twc-a', '#twc-b', 26.45)
snapCross('#twr-a', '#twr-b', 26.45)
snapCross('#twd-a', '#twd-b', 26.45)
// the waveform selection follows the words: handle, tint and selected bars grow
// from the "ideas" edge to the "boredom" word edge (out 64.6% -> 89.5%)
tl.to('#wf-h-end', { left: '89.5%', duration: 0.5, ease: 'power2.inOut' }, 26.1)
tl.to(['#wf-sel', '#wf-tint'], { width: '74.9%', duration: 0.5, ease: 'power2.inOut' }, 26.1)
tl.to('#cursor', { scale: 1, duration: 0.15, ease: 'power2.out' }, 26.85)
cursorOut(27.0)

// push down to the waveform and frame the out handle, so the nudge onto the
// pause after "boredom" is the hero shot (the selection sits left of centre, the
// silence band and the muted tail sit right of it)
const wfPreX = wfContentR.left + 0.895 * wfContentR.w
const wfEndX = wfContentR.left + 0.919 * wfContentR.w
setCam(wfContentR.left + 0.87 * wfContentR.w, wfContentR.y, 1.75, 27.0, 0.85)
cursorIn(27.9)
moveCursor(wfPreX, wfContentR.y, 27.95, 0.6)
tl.to('#cursor', { scale: 0.9, duration: 0.12, ease: 'power2.out' }, 28.5)
// the slight drag right: the out point settles in the silence after "boredom"
moveCursor(wfEndX, wfContentR.y, 28.65, 0.6)
tl.to('#wf-h-end', { left: '91.9%', duration: 0.6, ease: 'power2.inOut' }, 28.65)
tl.to(['#wf-sel', '#wf-tint'], { width: '77.3%', duration: 0.6, ease: 'power2.inOut' }, 28.65)
// the precise readouts tick 5.5s -> 5.7s in both the waveform and the summary
snapCross('#wf-out-a', '#wf-out-b', 28.95)
snapCross('#wf-dur-a', '#wf-dur-b', 28.95)
snapCross('#twd-b', '#twd-c', 28.95)
tl.to('#cursor', { scale: 1, duration: 0.15, ease: 'power2.out' }, 29.1)
cursorOut(29.25)

// pull back so the Save range button is in frame, then save
resetCam(29.4, 0.6)
cursorIn(30.05)
moveCursor(saveRangeR.x, saveRangeR.y, 30.1, 0.7)
clickAt(saveRangeR.x, saveRangeR.y, 30.85)
tl.to('#save-range', { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center', ease: 'power2.out' }, 30.85)
cursorOut(31.0)

// back to the preview, with the extended range reflected everywhere
tl.set('#trim-wrap', { display: 'none' }, 31.1)
tl.set('#stage-scroll', { display: 'flex' }, 31.1)
tl.set('#insp-trimming', { display: 'none' }, 31.1)
tl.set('#insp-full', { display: 'flex' }, 31.1)
snapCross('#im-a', '#im-b', 31.15)
snapCross('#id-a', '#id-b', 31.15)
crossfade('#pa-a', '#pa-b', 31.15)
snapCross('#c1m-a', '#c1m-b', 31.15)
snapCross('#sd-a', '#sd-b', 31.15)
setCam(phoneR.x, phoneR.y, 1.7, 31.25, 0.8)
// the extended clip plays one full A -> B -> C pass: the third caption beat is
// the payoff the longer clip now captures, and the 5.7s scrubber gets a quick
// emphasis - so the new range is unmistakable in the live preview.
tl.fromTo('#sd-b', { scale: 1.35, color: '#c7361f' }, { scale: 1, color: '#5a5750', duration: 0.6, ease: 'back.out(2)', transformOrigin: 'right center', immediateRender: false }, 31.35)
captionCycle('cp', 31.85, 1, true, ['a', 'b', 'c'])
scrubberCycle(31.85, 1, 3 * BEAT)

/* ----------------------------------------------------------------
   SCENE H - export to 1080x1920; the pills flip to rendered.
   ---------------------------------------------------------------- */
resetCam(35.65, 0.7)
cursorIn(36.25)
moveCursor(exportR.x, exportR.y, 36.3, 0.8)
clickAt(exportR.x, exportR.y, 37.15)
tl.to('#export-cta', { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1, transformOrigin: 'center', ease: 'power2.out' }, 37.15)
tl.to('#export-cta', { opacity: 0.75, duration: 0.2 }, 37.25)
cursorOut(37.35)

tl.to('#export-cta', { opacity: 0, duration: 0.3, ease: 'power2.in' }, 38.25)
tl.set('#export-cta', { display: 'none' }, 38.57)
tl.set('#rendered-note', { display: 'flex' }, 38.25)
tl.to('#rendered-note', { opacity: 1, duration: 0.35, ease: 'power2.out' }, 38.35)
tl.to(['#insp-pill-p', '#clip1-pill-p'], { opacity: 0, duration: 0.25, ease: 'power2.in' }, 38.25)
tl.to(['#insp-pill-r', '#clip1-pill-r'], { opacity: 1, duration: 0.3, ease: 'power2.out' }, 38.4)
setCam(exportR.x, inspPaneR.y + 120, 1.5, 38.55, 0.7)

/* ----------------------------------------------------------------
   SCENE I - a last glance at the finished project, then wipe out.
   ---------------------------------------------------------------- */
resetCam(39.85, 0.75)

tl.to('#wipe', { y: '0%', duration: 0.32, ease: 'power3.in' }, 41.25)
tl.set('#outro', { display: 'flex' }, 41.58)
tl.to('#outro', { opacity: 1, duration: 0.12, ease: 'none', immediateRender: false }, 41.59)
tl.to('#wipe', { y: '-100%', duration: 0.34, ease: 'power3.out' }, 41.67)

/* SCENE J - OUTRO. Identical to frame 0, so the loop is seamless. The
   three pipe bars settle once - long-form funneling to a single short. */
tl.fromTo('#o-mark', { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'power3.out', immediateRender: false }, 42.1)
tl.fromTo('#o-b2', { width: 86 }, { width: 58, duration: 0.6, ease: 'power3.out', immediateRender: false }, 42.25)
tl.fromTo('#o-b3', { width: 86 }, { width: 32, duration: 0.7, ease: 'power3.out', immediateRender: false }, 42.35)

window.__timelines['main'] = tl
