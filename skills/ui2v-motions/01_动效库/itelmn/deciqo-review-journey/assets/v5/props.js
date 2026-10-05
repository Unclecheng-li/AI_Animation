// Prop builders for the v5 world. Pure construction; animation happens in film.js.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { PAL, canvasTex, rrect, wrap, FONT, rng } from "./kit.js";

const hex = (n) => "#" + n.toString(16).padStart(6, "0");

export function mat(color, o = {}) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: o.rough ?? 0.45, metalness: o.metal ?? 0.05, clearcoat: o.coat ?? 0.6, clearcoatRoughness: 0.25, emissive: new THREE.Color(o.emissive ?? 0x000000), emissiveIntensity: o.ei ?? 1, transparent: o.opacity !== undefined, opacity: o.opacity ?? 1 });
}
// unlit colour that blooms when k > 1
export function glow(color, k = 2, o = {}) {
  const m = new THREE.MeshBasicMaterial({ color, transparent: o.opacity !== undefined || !!o.additive, opacity: o.opacity ?? 1, depthWrite: !o.additive, blending: o.additive ? THREE.AdditiveBlending : THREE.NormalBlending, side: o.side ?? THREE.FrontSide, toneMapped: o.toneMapped ?? true });
  m.color.multiplyScalar(k);
  return m;
}
export function box(w, h, d, material, r = 0.12) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)), material);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

// A text plane. lines: [{t, font, size, color, weight}], sized in world units by width.
export function label(lines, o = {}) {
  const W = o.px ?? 1024, H = o.pxH ?? 256;
  const tex = canvasTex(W, H, (ctx) => {
    if (o.bg) { ctx.fillStyle = o.bg; rrect(ctx, 0, 0, W, H, o.radius ?? 28); ctx.fill(); }
    if (o.border) { ctx.strokeStyle = o.border; ctx.lineWidth = 6; rrect(ctx, 3, 3, W - 6, H - 6, o.radius ?? 28); ctx.stroke(); }
    let y = o.padTop ?? 0;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = o.align ?? "left";
    const x = o.align === "center" ? W / 2 : (o.padX ?? 0);
    for (const L of lines) {
      let size = L.size;
      const maxW = W - 2 * (o.padX ?? 0);
      const setFont = () => { ctx.font = `${L.weight ?? (L.font === FONT.disp ? 800 : 400)} ${size}px ${L.font ?? FONT.mono}`; };
      setFont();
      ctx.letterSpacing = L.spacing ? L.spacing + "px" : "0px";
      if (L.fit !== false && !L.wrap) { while (ctx.measureText(L.t).width > maxW && size > 8) { size -= 2; setFont(); } }
      const rows = L.wrap ? wrap(ctx, L.t, maxW) : [L.t];
      rows.forEach((r, ri) => {
        y += size * (L.lh ?? 1.0);
        const hl = L.hl && (L.hl.rows ? L.hl.rows.includes(ri) : true);
        if (hl) {
          const tw = ctx.measureText(r).width;
          const x0 = o.align === "center" ? x - tw / 2 : x;
          ctx.fillStyle = L.hl.color; rrect(ctx, x0 - 12, y - size * 0.86, tw + 24, size * 1.12, 10); ctx.fill();
        }
        ctx.fillStyle = (hl && L.hl.ink) || L.color || "#e6edfb";
        ctx.fillText(r, x, y);
      });
      y += L.gap ?? 0;
    }
  });
  const w = o.w ?? 4, h = w * (H / W);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: o.depthWrite ?? false, side: o.side ?? THREE.FrontSide, toneMapped: false }));
  m.renderOrder = o.order ?? 2;
  return m;
}

// Station sign: big display name + mono sub, on a dark glass slab
export function sign(name, sub, accent = PAL.bone, w = 4.2) {
  const g = new THREE.Group();
  const lab = label([
    { t: name, font: FONT.disp, size: 130, color: hex(accent), lh: 1.0 },
    { t: sub, size: 38, color: "#9aa8c7", lh: 1.35, weight: 500 },
  ], { w, px: 1024, pxH: 300, padX: 40, padTop: 10 });
  g.add(lab);
  const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.06, w * 300 / 1024 * 0.8), glow(accent, 2.5));
  bar.position.set(-w / 2 - 0.08, 0.05, 0);
  g.add(bar);
  return g;
}

// review card, drawn like the deck's floating review cards: avatar, name, stars, quote.
// o.mark = words drawn on a highlight chip (e.g. the redacted "[phone]").
const AV = ["#2f7bf6", "#ff6b1a", "#3ddc97", "#6d98e0", "#113478", "#f5a524"];
export function cardFaceTex(text, stars, o = {}) {
  const W = 1024, H = Math.round(1024 * ((o.h ?? 1.1) / (o.w ?? 2.2)));
  return canvasTex(W, H, (ctx) => {
    ctx.fillStyle = o.paper ?? "#f3f6fc"; rrect(ctx, 0, 0, W, H, 56); ctx.fill();
    const name = o.name ?? "Buyer";
    const ini = o.initials ?? name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const ac = o.avatar ?? AV[(name.length + stars) % AV.length];
    ctx.fillStyle = ac; ctx.beginPath(); ctx.arc(96, 92, 50, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = `800 44px ${FONT.body}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(ini, 96, 94);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#0a1e45"; ctx.font = `800 48px ${FONT.body}`; ctx.fillText(name, 170, 84);
    ctx.font = `400 46px ${FONT.body}`;
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i < stars ? "#f5a524" : "#c9d3e6"; ctx.fillText("★", 170 + i * 48, 136); }
    if (o.badge) {
      ctx.font = `700 34px ${FONT.mono}`; const bw = ctx.measureText(o.badge).width + 44;
      ctx.fillStyle = o.badgeBg ?? "#e8f0ff"; rrect(ctx, W - bw - 40, 46, bw, 60, 30); ctx.fill();
      ctx.fillStyle = o.badgeInk ?? "#0862fa"; ctx.fillText(o.badge, W - bw - 18, 88);
    }
    // quote, wrapped word by word so marked words can sit on a chip
    const size = o.size ?? 60, lh = size * 1.24, x0 = 56, maxW = W - 112;
    ctx.font = `600 ${size}px ${FONT.body}`;
    const words = text.split(" "); let x = x0, y = 190 + size * 0.9;
    const mark = o.mark || [];
    for (const w of words) {
      const ww = ctx.measureText(w).width, sp = ctx.measureText(" ").width;
      if (x > x0 && x + ww > x0 + maxW) { x = x0; y += lh; }
      if (mark.includes(w)) { ctx.fillStyle = o.markBg ?? "#d1f4e2"; rrect(ctx, x - 8, y - size * 0.86, ww + 16, size * 1.14, 12); ctx.fill(); ctx.fillStyle = o.markInk ?? "#0b6b45"; }
      else ctx.fillStyle = o.ink ?? "#0a1e45";
      ctx.fillText(w, x, y); x += ww + sp;
    }
  });
}
export function reviewCard(text, stars = 2, o = {}) {
  const g = new THREE.Group();
  const w = o.w ?? 2.2, h = o.h ?? 1.1;
  const slab = box(w, h, 0.05, mat(o.slab ?? 0xdfe7f7, { rough: 0.6, coat: 0.3 }), 0.1);
  g.add(slab);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.95, h * 0.95), new THREE.MeshBasicMaterial({ map: cardFaceTex(text, stars, { ...o, w, h }), transparent: true, toneMapped: false, depthWrite: false }));
  face.material.color.setScalar(0.8); // keep white paper under the bloom threshold
  face.position.z = 0.03; face.renderOrder = 2;
  g.add(face);
  g.userData.face = face; g.userData.slab = slab;
  return g;
}

export function arch(w, h, material, beamMat) {
  const g = new THREE.Group();
  const p = 0.5;
  const l = box(p, h, p, material, 0.12); l.position.set(-w / 2, h / 2, 0);
  const r = box(p, h, p, material, 0.12); r.position.set(w / 2, h / 2, 0);
  const t = box(w + p, p, p, beamMat || material, 0.12); t.position.set(0, h, 0);
  g.add(l, r, t);
  return g;
}

export function gearGeometry(r, teeth, depth, hole = 0.3) {
  const s = new THREE.Shape();
  const N = teeth * 4;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    const k = i % 4;
    const rr = k === 0 || k === 1 ? r * 1.16 : r;
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  const hp = new THREE.Path(); hp.absarc(0, 0, r * hole, 0, Math.PI * 2, true);
  s.holes.push(hp);
  const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 4 });
  geo.center();
  return geo;
}

// glowing tube along points; returns mesh + curve; call reveal(p) to draw on
export function wire(points, radius, color, k = 2.2, o = {}) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, "catmullrom", o.tension ?? 0.2);
  const seg = o.seg ?? 200;
  const geo = new THREE.TubeGeometry(curve, seg, radius, 10, false);
  const m = new THREE.Mesh(geo, glow(color, k, { opacity: o.opacity }));
  const total = geo.index.count;
  m.userData.reveal = (p) => geo.setDrawRange(0, Math.floor(total * Math.max(0, Math.min(1, p)) / 60) * 60);
  m.userData.curve = curve;
  return m;
}

// starfield / dust points
export function dust(n, spread, seed, color = 0x9cc0ff, size = 0.06) {
  const r = rng(seed);
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (r() - 0.5) * spread[0] + (spread[3] || 0);
    pos[i * 3 + 1] = (r() - 0.5) * spread[1] + (spread[4] || 0);
    pos[i * 3 + 2] = (r() - 0.5) * spread[2] + (spread[5] || 0);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dot = canvasTex(64, 64, (ctx) => {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.4, "rgba(255,255,255,0.35)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  });
  const m = new THREE.PointsMaterial({ color, size, map: dot, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  return new THREE.Points(geo, m);
}

// soft radial glow sprite-like plane (faces +z)
export function halo(color, size, opacity = 0.6) {
  const t = canvasTex(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.3, "rgba(255,255,255,0.4)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: t, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
  return m;
}

// a flat ring on the ground that can pulse
export function ring(r0, r1, color, k = 2, opacity = 0.8) {
  const m = new THREE.Mesh(new THREE.RingGeometry(r0, r1, 64), glow(color, k, { opacity, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

export function laptop(texs) {
  const g = new THREE.Group();
  const shell = mat(0x1b2a52, { rough: 0.35, metal: 0.6 });
  const base = box(4.4, 0.16, 3, shell, 0.08);
  base.position.y = 0.08;
  g.add(base);
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.16, -1.45);
  g.add(hinge);
  const lid = box(4.4, 3.05, 0.1, shell, 0.08);
  lid.position.set(0, 1.52, 0);
  hinge.add(lid);
  const screens = texs.map((t) => {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(4.1, 2.8), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, transparent: true, color: 0x8c8c8c }));
    s.position.set(0, 1.52, 0.056);
    hinge.add(s);
    return s;
  });
  g.userData = { hinge, screens };
  return g;
}
