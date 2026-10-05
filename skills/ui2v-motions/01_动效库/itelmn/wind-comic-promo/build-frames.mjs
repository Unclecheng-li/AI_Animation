#!/usr/bin/env node
/**
 * build-frames.mjs — 生成 8 个合成帧(深色 · 成片驱动)。v2 视觉层。
 *
 * ── 为什么重做 ────────────────────────────────────────────────────
 * 第一版用了浅色美术馆图录预设,且**一帧产品成片都没放** —— 给一个「一句话出短剧」
 * 的产品做了份会议幻灯。旧版 promo 的做法才是对的:近黑底 + 金,真实成片满屏铺,
 * 大字中文压在上面。这一版回到那个路子,但把新增的两项能力(导演台、片段重拍)
 * 作为压在成片上的插入层,而不是整帧示意图。
 *
 * ── 成片为什么要 z-index ──────────────────────────────────────────
 * 被 assemble-index 吊起的 <video> 挂在帧内容**之后**(即上层),而我们要文字压在
 * 成片上。两者都是绝对定位,所以用 z-index 反转层序 —— 与 DOM 顺序无关。
 *
 * ── 字体 ──────────────────────────────────────────────────────────
 * 三个字族全部随项目落地:Plus Jakarta Sans / JetBrains Mono 取自产品自托管的
 * next/font 产物;Noto Sans SC 从 10MB 全量按片中实际用字子集化到 17KB。
 * 渲染机是干净的无字体 headless Chrome,少一个就静默回退。
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(import.meta.dirname, 'compositions', 'frames');
fs.mkdirSync(OUT, { recursive: true });

const HEAD = (title) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      /* 字体随项目落地 —— 渲染机没有任何系统字体,名字对不上文件就静默回退。
         路径不带 ../:渲染按子合成目录重写,预览按项目根解析,两处各放一份。 */
      @font-face { font-family: "Plus Jakarta Sans"; src: url("assets/fonts/plus-jakarta-sans.woff2") format("woff2");
                   font-weight: 200 800; font-style: normal; font-display: block; }
      @font-face { font-family: "JetBrains Mono"; src: url("assets/fonts/jetbrains-mono.woff2") format("woff2");
                   font-weight: 100 800; font-style: normal; font-display: block; }
      @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/noto-sans-sc.woff2") format("woff2");
                   font-weight: 400; font-style: normal; font-display: block; }
      @font-face { font-family: "Noto Sans SC"; src: url("assets/fonts/noto-sans-sc-700.woff2") format("woff2");
                   font-weight: 700; font-style: normal; font-display: block; }

      /* 深色底 —— 与产品实际观感一致(站点最大面积背景是纯黑、文字是米白) */
      .fr { position: absolute; inset: 0; background: #0A0A0B; color: #F5F1EA; overflow: hidden;
            z-index: 2; font-family: "Plus Jakarta Sans", system-ui, sans-serif; }
      .cn { font-family: "Noto Sans SC", "Plus Jakarta Sans", sans-serif; }
      .mono { font-family: "JetBrains Mono", ui-monospace, monospace; }
      /* 成片压到底层:被吊起的 video 在 DOM 上排在帧之后,靠 z-index 反转 */
      .plate { z-index: 0 !important; }
      /* 有成片的帧**底色必须透明** —— 否则不透明的深色底会把下层成片整个盖死
         (第一次就是这么翻的:四帧成片全黑)。压暗交给 .scrim。 */
      .fr.has-plate { background: transparent; }
      .scrim { position: absolute; inset: 0; }
      .pad { position: absolute; inset: 0; padding: 72px 96px; display: flex; flex-direction: column; }
      .rail { font: 600 13px/1 "Plus Jakarta Sans", sans-serif; letter-spacing: .32em;
              text-transform: uppercase; color: #E8C547; }
      .gold { color: #E8C547; }
      .pagenum { position: absolute; right: 96px; bottom: 46px; font: 400 13px/1 "JetBrains Mono", monospace;
                 letter-spacing: .08em; opacity: .6; }
      .kicker { font: 600 15px/1 "Noto Sans SC", sans-serif; letter-spacing: .26em; color: #E8C547; }
      h1.big { margin: 0; font: 700 104px/1.12 "Noto Sans SC", sans-serif; letter-spacing: -.01em; }
      h2.mid { margin: 0; font: 700 66px/1.16 "Noto Sans SC", sans-serif; letter-spacing: -.008em; }
      .en { margin-top: 20px; font: 400 30px/1.35 "Plus Jakarta Sans", sans-serif; opacity: .84; }
      .hl { background: #E8C547; color: #0A0A0B; padding: 0 .12em; }
`;

const TAIL = (id, dur, body, tl) => `    </style>
  </head>
  <body>
    <div id="root" data-composition-id="${id}" data-start="0" data-width="1920" data-height="1080" data-duration="${dur}">
${body}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
${tl}
      window.__timelines["${id}"] = tl;
    </script>
  </body>
</html>
`;

/** 满屏成片。data-media-start 选取素材里画面最好的一段。 */
const plate = (vid, src, dur, mediaStart) =>
  `      <video id="${vid}" class="plate" data-frame-video="approved" src="assets/${src}" muted
        data-start="0" data-duration="${dur}" data-track-index="1"
        data-media-start="${mediaStart}"
        data-frame-video-x="0" data-frame-video-y="0" data-frame-video-width="1920" data-frame-video-height="1080"
        data-frame-video-fit="cover"></video>`;

const F = [];

// ── 01 · 痛点 ────────────────────────────────────────────────────────
F.push({
  file: '01-five-takes.html', id: '01-five-takes', dur: 4.6, title: '01 — 五条了,还是不对',
  css: `
      .f01 .scrim { background: linear-gradient(100deg, rgba(10,10,11,.95) 0%, rgba(10,10,11,.86) 46%, rgba(10,10,11,.42) 100%); }
      .f01 .log { margin-top: 30px; max-width: 760px; }
      .f01 .row { display: grid; grid-template-columns: 96px 1fr 84px; gap: 20px; align-items: baseline;
             padding: 11px 0; border-bottom: 1px solid rgba(245,241,234,.14); }
      .f01 .row .n { font: 400 14px/1 "JetBrains Mono", monospace; color: rgba(245,241,234,.66); }
      .f01 .row .t { font: 400 22px/1.3 "Noto Sans SC", sans-serif; }
      .f01 .row .v { font: 400 13px/1 "JetBrains Mono", monospace; text-align: right; color: #D4A830; }
      .f01 h1.big { margin-top: auto; }`,
  body: `${plate('vid-f01', 'footage-zaun.mp4', 4.6, 1.2)}
      <section id="sec-f01" class="clip fr has-plate f01" data-start="0" data-duration="4.6" data-track-index="1">
        <div class="scrim"></div>
        <div class="pad">
          <div class="rail" id="f01-rail">Shot 03 · take log</div>
          <div class="log">
            <div class="row f01-row"><span class="n">TAKE 01</span><span class="t cn">她站得太靠左</span><span class="v">RE-ROLL</span></div>
            <div class="row f01-row"><span class="n">TAKE 02</span><span class="t cn">他又把她挡住了</span><span class="v">RE-ROLL</span></div>
            <div class="row f01-row"><span class="n">TAKE 03</span><span class="t cn">机位飘到人后面去了</span><span class="v">RE-ROLL</span></div>
            <div class="row f01-row"><span class="n">TAKE 04</span><span class="t cn">她整个出画了</span><span class="v">RE-ROLL</span></div>
          </div>
          <h1 class="big cn" id="f01-head">五条了,<br />还是<span class="hl">不对</span>。</h1>
          <div class="en" id="f01-en">Five takes. The blocking is still wrong.</div>
        </div>
        <div class="pagenum">01</div>
      </section>`,
  tl: `      tl.from("#f01-rail", { opacity: 0, y: -10, duration: .4, ease: "power2.out" }, 0);
      tl.from(".f01-row", { opacity: 0, x: -20, duration: .38, stagger: .3, ease: "power3.out" }, .28);
      tl.from("#f01-head", { opacity: 0, y: 28, duration: .58, ease: "power3.out" }, 2.2);
      tl.from("#f01-en", { opacity: 0, duration: .45 }, 2.9);`,
});

// ── 02 · 主张 ────────────────────────────────────────────────────────
F.push({
  file: '02-direct-it.html', id: '02-direct-it', dur: 5.0, title: '02 — 那就导',
  css: `
      .f02 .scrim { background: radial-gradient(ellipse at 50% 52%, rgba(10,10,11,.58) 0%, rgba(10,10,11,.88) 62%, rgba(10,10,11,.97) 100%); }
      .f02 .pad { align-items: center; justify-content: center; text-align: center; }
      .f02 .wm { font: 700 128px/1 "Noto Sans SC", sans-serif; letter-spacing: .06em; }
      .f02 .wm small { display: block; margin-top: 14px; font: 600 20px/1 "Plus Jakarta Sans", sans-serif;
             letter-spacing: .52em; opacity: .62; }
      .f02 .rule { width: 190px; height: 1px; background: rgba(232,197,71,.5); margin: 40px 0 34px; }
      .f02 .claim { font: 700 62px/1.2 "Noto Sans SC", sans-serif; }`,
  body: `${plate('vid-f02', 'footage-jinx.mp4', 5.0, 3.0)}
      <section id="sec-f02" class="clip fr has-plate f02" data-start="0" data-duration="5" data-track-index="1">
        <div class="scrim"></div>
        <div class="pad">
          <div class="wm cn" id="f02-wm">青枫漫剧<small>WIND COMIC</small></div>
          <div class="rule" id="f02-rule"></div>
          <div class="claim cn" id="f02-claim">还有另一条路 —— <span class="hl">导</span>它。</div>
          <div class="en" id="f02-en">There is another option. Direct it.</div>
        </div>
        <div class="pagenum">02</div>
      </section>`,
  tl: `      tl.from("#f02-wm", { opacity: 0, y: 22, duration: .7, ease: "power3.out" }, 0);
      tl.from("#f02-rule", { scaleX: 0, duration: .5, ease: "power2.inOut" }, .5);
      tl.from("#f02-claim", { opacity: 0, y: 20, duration: .6, ease: "power3.out" }, .8);
      tl.from("#f02-en", { opacity: 0, duration: .5 }, 2.2);
      tl.to("#vid-f02", { scale: 1.05, duration: 4.4, ease: "none" }, 0);`,
});

// ── 03 · 摆位 ────────────────────────────────────────────────────────
F.push({
  file: '03-stage-it.html', id: '03-stage-it', dur: 8.3, title: '03 — 把位摆出来',
  css: `
      .f03 .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 30px; align-items: start; }
      .f03 .cap { font: 600 12px/1 "Plus Jakarta Sans", sans-serif; letter-spacing: .2em;
             text-transform: uppercase; color: rgba(245,241,234,.66); margin-bottom: 12px; }
      .f03 .plan { position: relative; height: 356px; border: 1px solid rgba(245,241,234,.2); background: rgba(245,241,234,.03); }
      .f03 .plan .grid { position: absolute; inset: 0;
             background-image: linear-gradient(rgba(245,241,234,.07) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(245,241,234,.07) 1px, transparent 1px);
             background-size: 54px 54px; }
      .f03 .cone { position: absolute; left: 50%; bottom: 24px; width: 0; height: 0; transform: translateX(-50%);
             border-left: 160px solid transparent; border-right: 160px solid transparent;
             border-bottom: 288px solid rgba(232,197,71,.22); transform-origin: bottom center; }
      .f03 .cam { position: absolute; left: 50%; bottom: 13px; width: 24px; height: 24px;
             transform: translateX(-50%); background: #E8C547; }
      .f03 .caml { position: absolute; left: 50%; bottom: -13px; transform: translateX(-50%);
             font: 400 12px/1 "JetBrains Mono", monospace; color: rgba(245,241,234,.6); white-space: nowrap; }
      .f03 .actor { position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #F5F1EA; }
      .f03 .actor b { position: absolute; left: 26px; top: -3px; font: 500 15px/1 "Noto Sans SC", sans-serif; white-space: nowrap; }
      .f03 .sketch { width: 100%; display: block; border: 1px solid rgba(245,241,234,.2); filter: invert(1) hue-rotate(180deg) contrast(.92); }
      .f03 .dir { margin-top: 22px; border-left: 3px solid #E8C547; padding: 10px 0 10px 16px;
             font: 400 17px/1.5 "JetBrains Mono", monospace; color: rgba(245,241,234,.9); }
      .f03 .dir span { color: rgba(245,241,234,.66); }`,
  body: `      <section id="sec-f03" class="clip fr f03" data-start="0" data-duration="8.3" data-track-index="1">
        <div class="pad">
          <div class="rail" id="f03-rail">Director's console · 导演台</div>
          <h2 class="mid cn" id="f03-h" style="margin-top:16px">把人放好,把机位放好。</h2>
          <div class="cols">
            <div>
              <div class="cap f03-cap">舞台 · 俯视</div>
              <div class="plan">
                <div class="grid"></div>
                <div class="cone" id="f03-cone"></div>
                <div class="cam" id="f03-cam"></div>
                <div class="caml" id="f03-caml">35mm · h 1.15m</div>
                <div class="actor f03-a" style="left:31%;top:34%"><b class="cn">林晚</b></div>
                <div class="actor f03-a" style="left:62%;top:13%"><b class="cn">陆沉</b></div>
              </div>
            </div>
            <div>
              <div class="cap f03-cap">布局草图 · 真正喂给引擎的东西</div>
              <img class="sketch" id="f03-sketch" src="assets/stage-sketch.png" alt="layout sketch" />
              <div class="dir" id="f03-dir"><span>prompt +=</span> " . Staging: Lin&nbsp;Wan at frame left in full shot; Lu&nbsp;Chen right of center in wide shot"</div>
            </div>
          </div>
        </div>
        <div class="pagenum">03</div>
      </section>`,
  tl: `      tl.from("#f03-rail", { opacity: 0, y: -10, duration: .4, ease: "power2.out" }, 0);
      tl.from("#f03-h", { opacity: 0, y: 20, duration: .55, ease: "power3.out" }, .15);
      tl.from(".f03-cap", { opacity: 0, duration: .35, stagger: .1 }, .7);
      tl.from(".f03-a", { opacity: 0, scale: 0, duration: .42, stagger: .28, ease: "back.out(2)" }, 1.05);
      tl.from("#f03-cam", { opacity: 0, scale: 0, duration: .32, ease: "back.out(2)" }, 1.95);
      tl.from("#f03-cone", { opacity: 0, scaleX: .12, duration: .68, ease: "power2.out" }, 2.15);
      tl.from("#f03-caml", { opacity: 0, duration: .38 }, 2.6);
      tl.from("#f03-sketch", { opacity: 0, y: 18, duration: .66, ease: "power2.out" }, 3.5);
      tl.from("#f03-dir", { opacity: 0, x: -16, duration: .58, ease: "power2.out" }, 5.0);`,
});

// ── 04 · 生成前体检 ──────────────────────────────────────────────────
F.push({
  file: '04-before-you-spend.html', id: '04-before-you-spend', dur: 7.2, title: '04 — 花钱之前',
  css: `
      .f04 .body { display: grid; grid-template-columns: 640px 1fr; gap: 56px; margin-top: 34px; align-items: start; }
      .f04 .shot { position: relative; border: 1px solid rgba(245,241,234,.2); }
      .f04 .shot img { width: 100%; display: block; filter: invert(1) hue-rotate(180deg) contrast(.92); }
      .f04 .badge { position: absolute; top: -1px; left: -1px; background: #E8C547; color: #0A0A0B;
             font: 500 12px/1 "JetBrains Mono", monospace; letter-spacing: .1em; padding: 7px 11px; }
      .f04 .chk { display: grid; grid-template-columns: 28px 1fr; gap: 14px; align-items: start;
             padding: 18px 0; border-bottom: 1px solid rgba(245,241,234,.14); }
      .f04 .chk .m { font: 400 20px/1 "JetBrains Mono", monospace; color: #E8C547; }
      .f04 .chk .t { font: 400 23px/1.35 "Noto Sans SC", sans-serif; }
      .f04 .cost { margin-top: 30px; display: flex; align-items: baseline; gap: 16px; }
      .f04 .cost .k { font: 600 12px/1 "Noto Sans SC", sans-serif; letter-spacing: .2em; color: rgba(245,241,234,.66); }
      .f04 .cost .v { font: 400 72px/1 "Plus Jakarta Sans", sans-serif; letter-spacing: -.02em; color: #E8C547; }
      .f04 .cost .u { font: 400 17px/1 "JetBrains Mono", monospace; color: rgba(245,241,234,.66); }`,
  body: `      <section id="sec-f04" class="clip fr f04" data-start="0" data-duration="7.2" data-track-index="1">
        <div class="pad">
          <div class="rail" id="f04-rail">Composition audit · 确定性</div>
          <h2 class="mid cn" id="f04-h" style="margin-top:16px">问题在花钱之前就说。</h2>
          <div class="body">
            <div class="shot" id="f04-shot">
              <div class="badge">SAME STAGE</div>
              <img src="assets/stage-sketch.png" alt="layout sketch" />
            </div>
            <div>
              <div class="chk f04-chk"><span class="m">!</span><span class="t cn">陆沉<span class="gold">出画了</span> —— 转机位,或换更广的镜头</span></div>
              <div class="chk f04-chk"><span class="m">!</span><span class="t cn">林晚被陆沉<span class="gold">挡住</span> —— 错开站位</span></div>
              <div class="chk f04-chk"><span class="m">!</span><span class="t cn">机位<span class="gold">穿到人身上</span> —— 后撤</span></div>
              <div class="cost">
                <span class="k cn">已花费</span><span class="v">¥0.00</span><span class="u">0 engine calls</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pagenum">04</div>
      </section>`,
  tl: `      tl.from("#f04-rail", { opacity: 0, y: -10, duration: .4, ease: "power2.out" }, 0);
      tl.from("#f04-h", { opacity: 0, y: 20, duration: .55, ease: "power3.out" }, .15);
      tl.from("#f04-shot", { opacity: 0, x: -20, duration: .58, ease: "power2.out" }, .6);
      tl.from(".f04-chk", { opacity: 0, x: 24, duration: .42, stagger: .8, ease: "power3.out" }, 1.35);
      tl.from(".f04 .cost", { opacity: 0, y: 16, duration: .52, ease: "power2.out" }, 4.6);`,
});

// ── 05 · 只重拍两秒 ──────────────────────────────────────────────────
F.push({
  file: '05-retake-two-seconds.html', id: '05-retake-two-seconds', dur: 8.7, title: '05 — 只重拍两秒',
  css: `
      .f05 .scrim { background: linear-gradient(to bottom, rgba(10,10,11,.55) 0%, rgba(10,10,11,.86) 46%, #0A0A0B 68%); }
      .f05 .track { margin-top: 300px; }
      .f05 .ruler { display: grid; grid-template-columns: repeat(8, 1fr); border-bottom: 1px solid rgba(245,241,234,.28); }
      .f05 .ruler span { font: 400 13px/1 "JetBrains Mono", monospace; color: rgba(245,241,234,.66); padding-bottom: 8px; }
      .f05 .bar { display: grid; grid-template-columns: repeat(8, 1fr); height: 104px; }
      .f05 .seg { border-right: 1px solid #0A0A0B; background: rgba(245,241,234,.16); }
      .f05 .seg:last-child { border-right: 0; }
      .f05 .seg.hot { background: #E8C547; }
      .f05 .labels { display: grid; grid-template-columns: 3fr 2fr 3fr; margin-top: 16px; }
      .f05 .labels div { font: 400 16px/1.4 "JetBrains Mono", monospace; color: rgba(245,241,234,.6); }
      .f05 .labels .mid2 { text-align: center; color: #E8C547; }
      .f05 .labels .rt { text-align: right; }
      .f05 .cells { margin-top: 44px; display: grid; grid-template-columns: repeat(3, 1fr);
             border-top: 1px solid rgba(245,241,234,.24); }
      .f05 .cell { padding: 20px 0 0; }
      .f05 .cell .k { font: 600 12px/1 "Noto Sans SC", sans-serif; letter-spacing: .2em; color: rgba(245,241,234,.66); }
      .f05 .cell .v { margin-top: 10px; font: 400 30px/1.15 "Noto Sans SC", sans-serif; }`,
  body: `${plate('vid-f05', 'footage-vi.mp4', 8.7, 2.5)}
      <section id="sec-f05" class="clip fr has-plate f05" data-start="0" data-duration="8.7" data-track-index="1">
        <div class="scrim"></div>
        <div class="pad">
          <div class="rail" id="f05-rail">Segment retake · 片段重拍</div>
          <h2 class="mid cn" id="f05-h" style="margin-top:16px">只重拍两秒,另外六秒原样留着。</h2>
          <div class="track">
            <div class="ruler" id="f05-ruler"><span>0s</span><span>1s</span><span>2s</span><span>3s</span><span>4s</span><span>5s</span><span>6s</span><span>7s</span></div>
            <div class="bar">
              <div class="seg f05-seg"></div><div class="seg f05-seg"></div><div class="seg f05-seg"></div>
              <div class="seg f05-seg hot" id="f05-h1"></div><div class="seg f05-seg hot" id="f05-h2"></div>
              <div class="seg f05-seg"></div><div class="seg f05-seg"></div><div class="seg f05-seg"></div>
            </div>
            <div class="labels" id="f05-labels">
              <div>byte-copied · -c copy</div><div class="mid2">regenerated · 2.000s</div><div class="rt">byte-copied · -c copy</div>
            </div>
          </div>
          <div class="cells">
            <div class="cell f05-cell"><div class="k cn">重拍后镜头时长</div><div class="v cn"><span class="hl">8.000s</span> 不变</div></div>
            <div class="cell f05-cell"><div class="k cn">保留的六秒</div><div class="v cn">未重编码</div></div>
            <div class="cell f05-cell"><div class="k cn">时间轴 · 字幕 · EDL</div><div class="v cn">不用重算</div></div>
          </div>
        </div>
        <div class="pagenum">05</div>
      </section>`,
  tl: `      tl.from("#f05-rail", { opacity: 0, y: -10, duration: .4, ease: "power2.out" }, 0);
      tl.from("#f05-h", { opacity: 0, y: 20, duration: .55, ease: "power3.out" }, .15);
      tl.from("#f05-ruler", { opacity: 0, duration: .4 }, 1.6);
      tl.from(".f05-seg", { scaleY: 0, transformOrigin: "bottom center", duration: .38, stagger: .05, ease: "power2.out" }, 1.8);
      tl.fromTo("#f05-h1, #f05-h2", { opacity: .22 }, { opacity: 1, duration: .32, repeat: 3, yoyo: true, ease: "sine.inOut" }, 3.0);
      tl.from("#f05-labels", { opacity: 0, y: 12, duration: .48, ease: "power2.out" }, 4.6);
      tl.from(".f05-cell", { opacity: 0, y: 18, duration: .48, stagger: .4, ease: "power3.out" }, 5.6);`,
});

// ── 06 · 全链路 ──────────────────────────────────────────────────────
F.push({
  file: '06-a-studio.html', id: '06-a-studio', dur: 8.5, title: '06 — 外面是一整个制片台',
  css: `
      .f06 .chain { display: grid; grid-template-columns: repeat(6, 1fr); margin-top: 36px;
             border-top: 1px solid rgba(245,241,234,.24); }
      .f06 .st { padding: 20px 20px 24px 0; border-right: 1px solid rgba(245,241,234,.12); }
      .f06 .st:last-child { border-right: 0; }
      .f06 .st .n { font: 400 13px/1 "JetBrains Mono", monospace; color: rgba(245,241,234,.66); }
      .f06 .st .t { margin-top: 10px; font: 500 25px/1.15 "Noto Sans SC", sans-serif; }
      .f06 .st .r { margin-top: 12px; display: inline-block; font: 400 12px/1 "JetBrains Mono", monospace;
             letter-spacing: .08em; border: 1px solid rgba(245,241,234,.3); padding: 5px 8px; color: rgba(245,241,234,.7); }
      .f06 .st.live .r { background: #E8C547; border-color: #E8C547; color: #0A0A0B; }
      .f06 .shot { margin-top: 34px; position: relative; height: 340px; overflow: hidden;
             border: 1px solid rgba(245,241,234,.2); }
      .f06 .shot img { position: absolute; width: 152%; left: -4%; top: 0; display: block; will-change: transform; }
      .f06 .veil { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10,10,11,0) 74%, #0A0A0B 100%); }`,
  body: `      <section id="sec-f06" class="clip fr f06" data-start="0" data-duration="8.5" data-track-index="1">
        <div class="pad">
          <div class="rail" id="f06-rail">Full-chain control · 全链路控片</div>
          <h2 class="mid cn" id="f06-h" style="margin-top:16px">任何一环都能单独重跑。</h2>
          <div class="chain">
            <div class="st f06-st"><div class="n">01</div><div class="t cn">剧本</div><div class="r">rerun</div></div>
            <div class="st f06-st"><div class="n">02</div><div class="t cn">角色</div><div class="r">rerun</div></div>
            <div class="st f06-st"><div class="n">03</div><div class="t cn">分镜</div><div class="r">rerun</div></div>
            <div class="st f06-st live"><div class="n">04</div><div class="t cn">配音</div><div class="r">rerun</div></div>
            <div class="st f06-st"><div class="n">05</div><div class="t cn">口型</div><div class="r">rerun</div></div>
            <div class="st f06-st"><div class="n">06</div><div class="t cn">成片</div><div class="r">rerun</div></div>
          </div>
          <div class="shot" id="f06-shot">
            <img src="assets/full-chain-control.png" alt="full-chain control board" />
            <div class="veil"></div>
          </div>
        </div>
        <div class="pagenum">06</div>
      </section>`,
  tl: `      tl.from("#f06-rail", { opacity: 0, y: -10, duration: .4, ease: "power2.out" }, 0);
      tl.from("#f06-h", { opacity: 0, y: 20, duration: .55, ease: "power3.out" }, .15);
      tl.from(".f06-st", { opacity: 0, y: 16, duration: .38, stagger: .5, ease: "power3.out" }, .85);
      tl.from("#f06-shot", { opacity: 0, y: 24, duration: .75, ease: "power2.out" }, 4.4);
      tl.fromTo("#f06-shot img", { y: -742 }, { y: -868, duration: 3.2, ease: "none" }, 4.9);`,
});

// ── 07 · 点名弱镜 ────────────────────────────────────────────────────
F.push({
  file: '07-names-the-shots.html', id: '07-names-the-shots', dur: 5.7, title: '07 — 点名哪几镜要修',
  css: `
      .f07 .grid2 { display: grid; grid-template-columns: 1fr 720px; gap: 54px; margin-top: 32px; align-items: start; }
      .f07 .rows { border-top: 1px solid rgba(245,241,234,.24); }
      .f07 .r { display: grid; grid-template-columns: 112px 1fr 84px; align-items: center; gap: 16px;
             padding: 13px 0; border-bottom: 1px solid rgba(245,241,234,.12); }
      .f07 .r .s { font: 400 16px/1 "JetBrains Mono", monospace; color: rgba(245,241,234,.6); }
      .f07 .r .m { height: 7px; background: rgba(245,241,234,.12); position: relative; }
      .f07 .r .m i { position: absolute; inset: 0 auto 0 0; background: rgba(245,241,234,.66); transform-origin: left center; display: block; }
      .f07 .r .v { font: 400 22px/1 "JetBrains Mono", monospace; text-align: right; }
      .f07 .r.weak .m i { background: #E8C547; }
      .f07 .r.weak .v { color: #E8C547; }
      .f07 .plan { border: 1px solid rgba(232,197,71,.42); padding: 24px 28px 28px; }
      .f07 .plan .k { font: 600 12px/1 "Noto Sans SC", sans-serif; letter-spacing: .2em; color: #E8C547; }
      .f07 .plan .h { margin-top: 12px; font: 700 32px/1.24 "Noto Sans SC", sans-serif; }
      .f07 .plan .it { margin-top: 17px; display: grid; grid-template-columns: 34px 1fr; gap: 13px; align-items: baseline; }
      .f07 .plan .it .num { font: 400 14px/1 "JetBrains Mono", monospace; background: #E8C547; color: #0A0A0B; padding: 5px 0; text-align: center; }
      .f07 .plan .it .tx { font: 400 19px/1.45 "Noto Sans SC", sans-serif; }`,
  body: `      <section id="sec-f07" class="clip fr f07" data-start="0" data-duration="5.7" data-track-index="1">
        <div class="pad">
          <div class="rail" id="f07-rail">Publish-readiness gate · 发布门禁</div>
          <h2 class="mid cn" id="f07-h" style="margin-top:16px">它直接点名哪几镜要修。</h2>
          <div class="grid2">
            <div class="rows">
              <div class="r f07-r"><span class="s">镜 1</span><span class="m"><i style="width:85%"></i></span><span class="v">85</span></div>
              <div class="r f07-r"><span class="s">镜 2</span><span class="m"><i style="width:78%"></i></span><span class="v">78</span></div>
              <div class="r f07-r weak"><span class="s">镜 3</span><span class="m"><i style="width:52%"></i></span><span class="v">52</span></div>
              <div class="r f07-r"><span class="s">镜 4</span><span class="m"><i style="width:90%"></i></span><span class="v">90</span></div>
              <div class="r f07-r"><span class="s">镜 5</span><span class="m"><i style="width:80%"></i></span><span class="v">80</span></div>
              <div class="r f07-r weak"><span class="s">镜 6</span><span class="m"><i style="width:60%"></i></span><span class="v">60</span></div>
            </div>
            <div class="plan" id="f07-plan">
              <div class="k cn">重生计划 · 2 个弱镜</div>
              <div class="h cn">不是一个分数,是一张工单。</div>
              <div class="it f07-it"><span class="num">1</span><span class="tx cn"><span class="gold">镜 3 · 52</span> —— 重点修「动作 / 姿态」,构图偏弱、主体不够突出</span></div>
              <div class="it f07-it"><span class="num">2</span><span class="tx cn"><span class="gold">镜 6 · 60</span> —— 重点修「动作 / 姿态」(55 分)</span></div>
            </div>
          </div>
        </div>
        <div class="pagenum">07</div>
      </section>`,
  tl: `      tl.from("#f07-rail", { opacity: 0, y: -10, duration: .35, ease: "power2.out" }, 0);
      tl.from("#f07-h", { opacity: 0, y: 18, duration: .5, ease: "power3.out" }, .12);
      tl.from(".f07-r", { opacity: 0, x: -14, duration: .3, stagger: .1, ease: "power2.out" }, .5);
      tl.from(".f07-r .m i", { scaleX: 0, duration: .42, stagger: .1, ease: "power2.out" }, .6);
      tl.to(".f07-r.weak", { backgroundColor: "rgba(232,197,71,.13)", duration: .4, ease: "power1.inOut" }, 2.1);
      tl.from("#f07-plan", { opacity: 0, x: 20, duration: .52, ease: "power2.out" }, 2.35);
      tl.from(".f07-it", { opacity: 0, y: 10, duration: .38, stagger: .34, ease: "power2.out" }, 2.95);`,
});

// ── 08 · CTA ─────────────────────────────────────────────────────────
F.push({
  file: '08-your-keys.html', id: '08-your-keys', dur: 9.2, title: '08 — 你的 key,你的剪辑线',
  css: `
      .f08 .scrim { background: linear-gradient(75deg, rgba(10,10,11,.96) 0%, rgba(10,10,11,.88) 52%, rgba(10,10,11,.5) 100%); }
      .f08 .exports { margin-top: 34px; display: grid; grid-template-columns: repeat(3, max-content); gap: 0 48px;
             border-top: 1px solid rgba(245,241,234,.24); padding-top: 20px; }
      .f08 .exports div { font: 400 40px/1.1 "Plus Jakarta Sans", sans-serif; letter-spacing: -.012em; }
      .f08 .note { margin-top: 14px; font: 400 21px/1.5 "Noto Sans SC", sans-serif; color: rgba(245,241,234,.72); max-width: 34ch; }
      .f08 .facts { margin-top: 52px; display: grid; grid-template-columns: repeat(3, 1fr);
             border-top: 1px solid rgba(245,241,234,.24); padding-top: 20px; max-width: 1150px; }
      .f08 .facts .k { font: 600 12px/1 "Noto Sans SC", sans-serif; letter-spacing: .2em; color: rgba(245,241,234,.66); }
      .f08 .facts .v { margin-top: 10px; font: 400 36px/1 "Plus Jakarta Sans", sans-serif; letter-spacing: -.015em; }
      .f08 .repo { margin-top: 36px; align-self: flex-start; font: 400 23px/1 "JetBrains Mono", monospace;
             background: #E8C547; color: #0A0A0B; padding: 14px 20px; }`,
  body: `${plate('vid-f08', 'footage-jinx.mp4', 9.2, 9.5)}
      <section id="sec-f08" class="clip fr has-plate f08" data-start="0" data-duration="9.2" data-track-index="1">
        <div class="scrim"></div>
        <div class="pad">
          <div class="rail" id="f08-rail">你的 key · 你的引擎 · 你的剪辑线</div>
          <h2 class="mid cn" id="f08-h" style="margin-top:16px">成片直接交到剪辑师手上。</h2>
          <div class="exports">
            <div class="f08-x">EDL</div><div class="f08-x">FCPXML</div><div class="f08-x">AAF</div>
          </div>
          <div class="note cn" id="f08-note">与成片同源导出 —— 不是照着重敲一遍的近似值。</div>
          <div class="facts">
            <div><div class="k cn">许可</div><div class="v">MIT</div></div>
            <div><div class="k cn">测试通过</div><div class="v">4131</div></div>
            <div><div class="k cn">视频引擎</div><div class="v cn" style="font-size:30px">自带 key</div></div>
          </div>
          <div class="repo" id="f08-repo">github.com/ChrisChen667788/wind-comic</div>
        </div>
        <div class="pagenum">08</div>
      </section>`,
  tl: `      tl.from("#f08-rail", { opacity: 0, y: -10, duration: .42, ease: "power2.out" }, 0);
      tl.from("#f08-h", { opacity: 0, y: 22, duration: .6, ease: "power3.out" }, .18);
      tl.from(".f08-x", { opacity: 0, y: 18, duration: .42, stagger: .4, ease: "power3.out" }, 1.9);
      tl.from("#f08-note", { opacity: 0, duration: .48 }, 3.3);
      tl.from(".f08 .facts > div", { opacity: 0, y: 14, duration: .42, stagger: .28, ease: "power2.out" }, 4.6);
      tl.from("#f08-repo", { opacity: 0, y: 16, duration: .52, ease: "power3.out" }, 6.3);
      tl.to("#vid-f08", { scale: 1.06, duration: 8.6, ease: "none" }, 0);`,
});

for (const f of F) {
  fs.writeFileSync(path.join(OUT, f.file), HEAD(f.title) + f.css + '\n' + TAIL(f.id, f.dur, f.body, f.tl));
  console.log('写出', f.file);
}
