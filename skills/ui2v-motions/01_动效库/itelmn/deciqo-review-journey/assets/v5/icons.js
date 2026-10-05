// Icons and brand logos for the v5 world.
// Lucide icons are parsed once and drawn as vector strokes onto canvases (any colour, any size);
// brand logos are preloaded images. Everything here is built before the first seek.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { canvasTex, rrect, FONT } from "./kit.js";

const SHAPES = {};
const LOGO = {};

export async function loadAssets(icons, logos) {
  await Promise.all(icons.map(async (n) => {
    const txt = await (await fetch(`assets/icons/${n}.svg`)).text();
    const doc = new DOMParser().parseFromString(txt, "image/svg+xml");
    SHAPES[n] = [...doc.querySelectorAll("path,circle,rect,line,polyline,polygon,ellipse")].map((el) => {
      const a = (k) => parseFloat(el.getAttribute(k) || "0");
      const p = new Path2D();
      switch (el.tagName) {
        case "path": p.addPath(new Path2D(el.getAttribute("d"))); break;
        case "circle": p.arc(a("cx"), a("cy"), a("r"), 0, Math.PI * 2); break;
        case "ellipse": p.ellipse(a("cx"), a("cy"), a("rx"), a("ry"), 0, 0, Math.PI * 2); break;
        case "rect": p.roundRect(a("x"), a("y"), a("width"), a("height"), a("rx")); break;
        case "line": p.moveTo(a("x1"), a("y1")); p.lineTo(a("x2"), a("y2")); break;
        default: {
          const pts = el.getAttribute("points").trim().split(/[\s,]+/).map(Number);
          for (let i = 0; i < pts.length; i += 2) (i ? p.lineTo : p.moveTo).call(p, pts[i], pts[i + 1]);
          if (el.tagName === "polygon") p.closePath();
        }
      }
      const f = el.getAttribute("fill");
      return { p, fill: f && f !== "none" };
    });
  }));
  await Promise.all(Object.entries(logos).map(([n, file]) => new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => { LOGO[n] = im; res(); };
    im.onerror = () => rej(new Error(`logo ${file}`));
    im.src = `assets/logos/${file}`;
  })));
}

export function drawIcon(ctx, name, x, y, size, color, lw = 2, glowPx = 0) {
  const shapes = SHAPES[name];
  if (!shapes) throw new Error(`icon ${name} not loaded`);
  ctx.save();
  ctx.translate(x, y); ctx.scale(size / 24, size / 24);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  if (glowPx) { ctx.shadowColor = color; ctx.shadowBlur = glowPx; }
  for (const s of shapes) { ctx.stroke(s.p); if (s.fill) ctx.fill(s.p); }
  ctx.restore();
}
export function drawLogo(ctx, name, x, y, w, h) {
  const im = LOGO[name];
  const r = Math.min(w / (im.naturalWidth || w), h / (im.naturalHeight || h));
  const dw = (im.naturalWidth || w) * r, dh = (im.naturalHeight || h) * r;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(im, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

const hexs = (n) => (typeof n === "string" ? n : "#" + n.toString(16).padStart(6, "0"));

// flat plane (faces +z) carrying one icon; bright enough to bloom
export function iconPlane(name, color, size = 1, o = {}) {
  const tex = canvasTex(256, 256, (ctx) => {
    if (o.disc) { ctx.fillStyle = o.disc; ctx.beginPath(); ctx.arc(128, 128, 124, 0, Math.PI * 2); ctx.fill(); }
    drawIcon(ctx, name, 128 - 80 * (o.inset ?? 1), 128 - 80 * (o.inset ?? 1), 160 * (o.inset ?? 1), hexs(color), o.lw ?? 2, o.glow ?? 10);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
  m.renderOrder = 3;
  return m;
}
export function logoPlane(name, size = 1, o = {}) {
  const W = 512, H = Math.round(512 * (o.aspect ?? 1));
  const tex = canvasTex(W, H, (ctx) => {
    if (o.bg) { ctx.fillStyle = o.bg; rrect(ctx, 0, 0, W, H, o.radius ?? 90); ctx.fill(); }
    const pad = o.pad ?? 60;
    drawLogo(ctx, name, pad, pad * (H / W), W - pad * 2, H - pad * 2 * (H / W));
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size * (H / W)), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
  m.renderOrder = 3;
  return m;
}

// a chunky app-icon style tile: rounded glass slab with a glowing icon or brand logo on its face
const tileGeo = {};
export function tile(kind, name, o = {}) {
  const s = o.size ?? 1.4, d = o.depth ?? 0.34;
  const key = s + ":" + d;
  tileGeo[key] = tileGeo[key] || new RoundedBoxGeometry(s, s, d, 5, Math.min(0.28, s * 0.22));
  const g = new THREE.Group();
  const slab = new THREE.Mesh(tileGeo[key], new THREE.MeshPhysicalMaterial({ color: o.slab ?? 0x0c1a3d, roughness: 0.25, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.12, emissive: new THREE.Color(o.rim ?? 0x000000), emissiveIntensity: 0.25 }));
  slab.castShadow = true;
  g.add(slab);
  const face = kind === "logo" ? logoPlane(name, s * 0.86, { bg: o.bg, pad: o.pad ?? 70, radius: 110 }) : iconPlane(name, o.color ?? 0xe6edfb, s * 0.8, { lw: o.lw ?? 2 });
  face.position.z = d / 2 + 0.012;
  g.add(face);
  g.userData = { slab, face };
  return g;
}

// pill tag: [icon] TEXT — billboarded in film.js
export function tag(icon, text, color = "#e6edfb", o = {}) {
  const H = 150, fs = o.fs ?? 74;
  const meas = document.createElement("canvas").getContext("2d");
  meas.font = `700 ${fs}px ${o.font ?? FONT.mono}`;
  meas.letterSpacing = "2px";
  const tw = text ? Math.ceil(meas.measureText(text).width) : 0;
  const iw = icon || o.logo ? 116 : 0;
  const W = Math.ceil(56 + iw + tw + (text ? 56 : 0));
  const tex = canvasTex(W, H, (ctx) => {
    ctx.fillStyle = o.bg ?? "rgba(6,18,48,0.86)"; rrect(ctx, 4, 4, W - 8, H - 8, 70); ctx.fill();
    ctx.strokeStyle = o.border ?? color; ctx.lineWidth = 5; rrect(ctx, 4, 4, W - 8, H - 8, 70); ctx.stroke();
    if (icon) drawIcon(ctx, icon, 44, 27, 96, color, 2.3, 8);
    if (o.logo) drawLogo(ctx, o.logo, 40, 23, 104, 104);
    if (text) {
      ctx.font = `700 ${fs}px ${o.font ?? FONT.mono}`; ctx.letterSpacing = "2px";
      ctx.fillStyle = o.ink ?? color; ctx.textBaseline = "middle";
      ctx.fillText(text, 44 + iw + (icon || o.logo ? 12 : 0), H / 2 + 4);
    }
  });
  const h = o.h ?? 0.62, w = h * (W / H);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: o.depthTest ?? true, toneMapped: false }));
  m.renderOrder = 6;
  m.userData.bb = true;
  return m;
}
