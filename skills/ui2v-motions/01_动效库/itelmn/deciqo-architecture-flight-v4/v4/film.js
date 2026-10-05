// Deciqo v4 — the architecture as one walkable 3D diagram. render(t) is a pure function of film time.
// World map (units): Docker host slab x −40…72, z −26…30. Containers: web (−30,−9), woo-demo (−30,13),
// api hall x −16…60. Seller pad off-host at (−60, 2). External islands: OpenAI (34,26,−30),
// Telegram (80,13,2), Apify/Lazada (−6,18,−34). Inside the api hall stations run along +x.
import * as THREE from "three";
import { createStage } from "./engine.js";
import { createQo } from "./qo.js";
import { PAL, E, ramp, keys, clamp, lerp, win, pop, rng, FONT, canvasTex, rrect } from "./kit.js";
import { mat, glow, box, label, reviewCard, arch, gearGeometry, wire, dust, halo, ring, laptop } from "./props.js";
import { tile, tag, iconPlane, logoPlane, drawIcon, drawLogo } from "./icons.js";

// ---------------------------------------------------------------- beats (seconds)
export const T = {
  storm: 0, hatch: 1.4, grab: 4.2, map: 6.5, build: 8.0, hold: 15.0,
  src: 20, woo: 20.8, laz: 23.6, csv: 26.4, door: 29.4, pii: 30.6, hash: 32.0, db: 32.8,
  triage: 35.0, fork: 42.0, key: 44.4,
  vault: 48.0, env: 50.0, weigh: 52.0, reserve: 54.2, check: 55.4, send: 57.8, cloud: 60.4, back: 62.0, settle: 64.4,
  member: 66.6, fails: 73.4, rules: 78.0, veto: 86.0, verbatim: 87.0, para: 90.8, judge: 93.8, metrics: 96.8,
  listing: 100.0, whip1: 104.0, type: 105.2, reject: 106.2, fact: 107.4, sendFact: 109.2, gate: 111.4, open: 112.4,
  whip2: 115.8, acted: 117.6, watch: 120.0, old: 122.4, late: 124.4, reopen: 126.0, outbox: 127.2, tg: 129.6, phone: 131.8,
  r7: 133.6, outro: 136.0, lock: 141.0, end: 150,
};

const HERO_RAW = "Laptop 14 inci saya tidak muat. WA 0812 3456 7890";
const HERO = "Laptop 14 inci saya tidak muat. WA [nomor telepon]";
const STORM_TEXT = [
  "mantap barang bagus", "Tas kekecilan untuk laptop saya", "packing rapi", "tidak jelas apa ukuran nya", "dikirimnya lama",
  "Bahannya bagus tetapi laptop tidak muat.", "belum dibuka", "sedikit kebesaran", "suara lumayan", "standar sesuai harga",
  "paket datang kardus penyok & robek", "bahan nya tipis", "recommend", "warna sesuai foto", "kurang rapi jahitannya",
];
const GOLD = 0xf5c451, TG = 0x2aabee, APIFY = 0xff9a3c;
const hexs = (n) => "#" + n.toString(16).padStart(6, "0");

export async function buildFilm(canvas, footage) {
  const S = createStage(canvas);
  const { scene, camera } = S;
  const R = rng(20260926);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const add = (o, x, y, z) => { o.position.set(x, y, z); scene.add(o); return o; };

  // ------------------------------------------------------------ appear system
  // POP: scale pop in at a, shrink out at b.  FADE: opacity window.  BB: billboards.
  const POP = [], FADE = [], BB = [];
  const popIn = (o, a, b = 999, fi = 0.5, fo = 0.35) => { POP.push({ o, a, b, s0: o.scale.x, fi, fo }); return o; };
  const fadeIn = (m, a, b = 999, fi = 0.4, fo = 0.4, k = 1) => { FADE.push({ m, a, b, fi, fo, k }); m.material.transparent = true; return m; };
  // floating tag: [icon] text, billboarded, popped over [a, b]
  const tg = (icon, text, color, p, a, b, o = {}) => { const m = tag(icon, text, typeof color === "number" ? hexs(color) : color, o); add(m, ...p); BB.push(m); return popIn(m, a, b, 0.45, 0.3); };
  const tl = (kind, name, p, a, b = 999, o = {}) => { const g = tile(kind, name, o); g.rotation.y = o.ry ?? 0; add(g, ...p); if (o.bb) BB.push(g); return popIn(g, a, b, 0.55, 0.35); };

  // ------------------------------------------------------------ ground: docker host slab
  const gridTex = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const x = c.getContext("2d");
    x.fillStyle = "#0d0d13"; x.fillRect(0, 0, 256, 256);
    x.strokeStyle = "rgba(190,182,255,0.10)"; x.lineWidth = 2; x.strokeRect(0, 0, 256, 256);
    x.fillStyle = "rgba(190,182,255,0.22)"; x.fillRect(0, 0, 5, 5);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
    return t;
  })();
  const hostTex = gridTex.clone(); hostTex.repeat.set(56, 28); hostTex.needsUpdate = true;
  const host = box(112, 1.2, 56, new THREE.MeshStandardMaterial({ map: hostTex, roughness: 0.9, metalness: 0.1 }), 0.5);
  host.castShadow = false; add(host, 16, -0.6, 2);
  const hostRim = add(new THREE.Mesh(new THREE.BoxGeometry(112.3, 0.06, 56.3), glow(0x2496ed, 1.6, { opacity: 0.0 })), 16, -0.2, 2);
  scene.add(dust(1800, [320, 120, 260, 10, 16, -10], 7, 0xb9a8ff, 0.14));
  scene.add(dust(700, [220, 80, 160, 10, 24, 0], 9, 0xffffff, 0.06));

  // glass container: faint faces + glowing edges; grows up from the floor
  const containers = [];
  function container(cx, cz, w, h, d, color) {
    const g = new THREE.Group();
    const geo = new THREE.BoxGeometry(w, h, d); geo.translate(0, h / 2, 0);
    const faces = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.035, depthWrite: false, side: THREE.DoubleSide }));
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: new THREE.Color(color).multiplyScalar(2.2), transparent: true, opacity: 0.9 }));
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.06, depthWrite: false }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = 0.02;
    g.add(faces, edges, floor);
    g.userData = { faces, edges, floor, h };
    add(g, cx, 0, cz);
    containers.push(g);
    return g;
  }
  const webBox = container(-30, -9, 12, 6, 10, 0x46f0a4);
  const wooBox = container(-30, 13, 12, 6, 10, 0x9b5c8f);
  const apiBox = container(22, 0, 76, 8, 24, 0x8b6cff);

  // ------------------------------------------------------------ seller pad (outside the host)
  const padTop = box(15, 1, 15, mat(0x16151d, { rough: 0.95, coat: 0 }), 0.5); add(padTop, -60, -0.5, 2);
  const padRing = add(ring(7.3, 7.6, PAL.seller, 2, 0.0), -60, 0.03, 2);
  const desk = box(5.6, 0.2, 2.6, mat(0x24222c, { rough: 0.9, coat: 0 }), 0.06); add(desk, -60, 1.0, 1.4);
  [[-62.5, 0.2], [-57.5, 0.2], [-62.5, 2.5], [-57.5, 2.5]].forEach(([x, z]) => add(box(0.14, 1.0, 0.14, mat(0x24222c, { rough: 0.9, coat: 0 }), 0.03), x, 0.5, z));
  const lap = laptop(footage); lap.scale.setScalar(0.72); add(lap, -60.3, 1.1, 1.5);
  lap.traverse((o) => { if (o.isMesh && o.material.metalness !== undefined) { o.material.roughness = 0.75; o.material.metalness = 0.2; o.material.clearcoat = 0; } });
  const [sR1, sR4, sR5, sR6, sR7] = lap.userData.screens;
  // phone with a Telegram notification
  const phone = new THREE.Group();
  const phoneBody = box(0.62, 1.2, 0.07, mat(0x111116, { rough: 0.3, metal: 0.5 }), 0.07); phone.add(phoneBody);
  const phoneOff = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 1.1), new THREE.MeshBasicMaterial({ color: 0x050507 })); phoneOff.position.z = 0.04; phone.add(phoneOff);
  const phoneNote = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 1.1), new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, map: canvasTex(540, 1100, (ctx) => {
    ctx.fillStyle = "#0b0b10"; ctx.fillRect(0, 0, 540, 1100);
    ctx.fillStyle = "#1c1c26"; rrect(ctx, 22, 250, 496, 470, 40); ctx.fill();
    drawLogo(ctx, "telegram", 50, 280, 92, 92);
    ctx.fillStyle = "#ece9df"; ctx.font = `700 40px ${FONT.mono}`; ctx.fillText("Deciqo", 162, 320);
    ctx.fillStyle = "#8a8a86"; ctx.font = `500 30px ${FONT.mono}`; ctx.fillText("now", 162, 360);
    ctx.fillStyle = "#ff5145"; ctx.font = `700 50px ${FONT.mono}`; ctx.fillText("came back", 50, 460);
    drawIcon(ctx, "rotate-ccw", 400, 412, 64, "#ff5145", 2.4);
    ctx.fillStyle = "#ece9df"; ctx.font = `600 38px ${FONT.mono}`; ctx.fillText("Tas laptop · size", 50, 540);
    drawIcon(ctx, "eye-off", 50, 600, 64, "#46f0a4", 2.4);
    ctx.fillStyle = "#46f0a4"; ctx.font = `600 32px ${FONT.mono}`; ctx.fillText("no review text", 132, 646);
  }) }));
  phoneNote.position.z = 0.042; phone.add(phoneNote);
  phone.rotation.set(-0.35, -0.3, 0);
  add(phone, -57.4, 1.62, 2.1);
  // seller
  const seller = new THREE.Group();
  const ped = box(1.2, 1.0, 1.2, mat(0x17171d, { rough: 0.4, metal: 0.3 }), 0.2); ped.position.y = 0.5; seller.add(ped);
  const sellerMat = mat(PAL.seller, { rough: 0.35, coat: 1, emissive: PAL.seller, ei: 0.12 });
  const sCube = box(0.8, 0.8, 0.8, sellerMat, 0.22); sCube.position.y = 1.55; seller.add(sCube);
  add(seller, -64.2, 0, 3.4);
  tl("icon", "user-round", [-64.2, 3.4, 3.4], T.build + 0.4, 999, { size: 0.9, color: PAL.seller, bb: true });
  const mkt = [["logo", "shopee"], ["logo", "tokopedia"], ["icon", "file-text"], ["icon", "clipboard-paste"]].map(([k, n], i) =>
    tl(k, n, [-65 + i * 1.8, 5.6 + (i % 2) * 0.5, -3.4], T.build + 4.8 + i * 0.12, T.triage, { size: 1.2, ry: 0.25, color: 0xece9df }));

  // ------------------------------------------------------------ container dressing (logos + ports)
  tl("logo", "nginx", [-32.8, 7.8, -4.6], T.build + 1.4, 999, { size: 2.8 });
  tl("logo", "react", [-29.6, 7.8, -4.6], T.build + 1.55, 999, { size: 2.8 });
  tl("logo", "woocommerce", [-30, 7.8, 17.4], T.build + 2.1, 999, { size: 3.2, bg: "#d6d2c8", pad: 40 });
  tl("logo", "fastapi", [-12.2, 10.2, 11.6], T.build + 2.8, 999, { size: 3.2 });
  tl("logo", "python", [-8.4, 10.2, 11.6], T.build + 2.95, 999, { size: 3.2 });
  tl("logo", "docker", [-35, 1.7, 29.4], T.build + 3.2, 999, { size: 3.0 });
  const shop = tl("icon", "store", [-30, 2.2, 13], T.build + 2.3, 999, { size: 1.8, color: 0xd9a6cf });
  // map labels (only during the overview holds)
  const MAPT = [T.build + 3.6, T.src - 0.2];
  tg("layout-grid", "web :3000", PAL.ok, [-30, 10.4, -9], ...MAPT, { h: 4.0 });
  tg("store", "woo-demo :8080", 0xd9a6cf, [-30, 11.0, 13], ...MAPT, { h: 4.0 });
  tg("server", "api :8000", PAL.ai2, [22, 13.2, 0], ...MAPT, { h: 4.4 });
  tg("user-round", "seller", PAL.seller, [-60, 10.0, 2], ...MAPT, { h: 4.0 });
  tg("container", "docker compose", 0x2496ed, [-20, 3.0, 29.4], ...MAPT, { h: 3.2 });

  // ------------------------------------------------------------ external islands
  function island(cx, cy, cz, color, n, spread, seed) {
    const g = new THREE.Group(); const r2 = rng(seed);
    for (let i = 0; i < n; i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.8 + r2() * 1.2, 24, 16), new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.28), roughness: 1, transparent: true, opacity: 0.6, emissive: color, emissiveIntensity: 0.1 }));
      s.position.set((r2() - 0.5) * spread, (r2() - 0.6) * 1.4, (r2() - 0.5) * spread * 0.6); g.add(s);
    }
    const rr = [0, 1].map((i) => { const r = new THREE.Mesh(new THREE.TorusGeometry(spread * 0.46 + i * 0.6, 0.04, 8, 120), glow(color, 2.4)); r.rotation.x = Math.PI / 2 + 0.2 * (i ? -1 : 1); g.add(r); return r; });
    g.userData.rings = rr;
    return add(g, cx, cy, cz);
  }
  const oaIsland = popIn(island(34, 25, -30, PAL.ai, 18, 12, 11), T.build + 3.6, 999, 0.8);
  const oaLogo = tl("logo", "openai", [34, 27.8, -27.4], T.build + 3.9, 999, { size: 5.2, slab: 0x0f0c1d, rim: PAL.ai });
  const tgIsland = popIn(island(80, 12.5, 2, TG, 10, 7, 12), T.build + 4.0, 999, 0.8);
  tl("logo", "telegram", [80, 15.2, 3.2], T.build + 4.2, 999, { size: 3.8, ry: -0.5 });
  const apIsland = popIn(island(-6, 18, -34, APIFY, 10, 7, 13), T.build + 4.4, 999, 0.8);
  tl("logo", "lazada", [-7.8, 20.4, -32.6], T.build + 4.6, 999, { size: 3.0, ry: 0.2 });
  tl("icon", "globe", [-4.4, 20.4, -32.8], T.build + 4.7, 999, { size: 2.6, color: APIFY, ry: 0.2 });
  tg("sparkles", "OpenAI", PAL.ai2, [34, 34.2, -28], ...MAPT, { h: 4.4 });
  tg("send", "Telegram", TG, [80, 20.4, 2], ...MAPT, { h: 4.0 });
  tg("globe", "Lazada · Apify", APIFY, [-6, 24.6, -33], ...MAPT, { h: 4.0 });

  // ------------------------------------------------------------ wires + packet flows
  const WIRES = [];
  const cable = (pts, color, k, a, b, r = 0.1) => { const w = wire(pts, r, color, k, { seg: 260 }); scene.add(w); WIRES.push({ w, a, b }); return w; };
  const wSeller = cable([[-58, 1.4, 1.2], [-48, 1.6, -4], [-40, 1.6, -8.4], [-36.2, 1.6, -9]], PAL.seller, 2.0, 12.6, 14.0);
  const wWebApi = cable([[-23.8, 1.4, -9], [-20, 1.4, -8], [-17.6, 1.4, -2], [-16, 1.4, -0.6]], PAL.ok, 2.0, 12.9, 14.0);
  const wWoo = cable([[-23.8, 1.4, 13], [-20, 1.4, 11], [-17.6, 1.4, 3], [-16, 1.4, 0.6]], 0xd9a6cf, 2.0, 13.1, 14.2);
  const wApify = cable([[-13, 8, -11.9], [-12, 12, -18], [-9, 16, -28], [-6.4, 17.6, -32]], APIFY, 2.0, 13.3, 14.5);
  const wBeam = cable([[27, 0.3, -8], [27.4, 4, -8.6], [28, 8.2, -10], [31, 16, -18], [34, 23.4, -27.6]], PAL.ai, 2.6, 13.5, 14.8, 0.16);
  const wTg = cable([[60, 3, -4], [66, 7, -2], [72, 10.4, 0.4], [78.2, 12.2, 1.8]], TG, 2.2, 13.7, 14.8);
  const wPhone = cable([[79, 14.6, 3], [60, 30, 26], [0, 36, 34], [-40, 26, 22], [-57.4, 2.4, 2.3]], TG, 1.6, 13.9, 15.2, 0.07);
  const FLOWS = [];
  const flow = (w, color, n, speed, a, b, size = 0.26, rev = false) => {
    const m = glow(color, 3.2); const parts = [];
    for (let i = 0; i < n; i++) { const c = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), m); c.visible = false; scene.add(c); parts.push(c); }
    FLOWS.push({ w, parts, speed, a, b, rev, size }); return parts;
  };
  const AMB = [T.build + 6.6, T.src + 0.4];
  flow(wSeller, PAL.seller, 5, 0.5, ...AMB); flow(wWebApi, PAL.ok, 4, 0.6, ...AMB); flow(wWoo, 0xd9a6cf, 4, 0.55, ...AMB);
  flow(wApify, APIFY, 4, 0.45, ...AMB, 0.26, true); flow(wBeam, PAL.ai2, 6, 0.5, ...AMB, 0.3); flow(wTg, TG, 4, 0.5, ...AMB); flow(wPhone, TG, 6, 0.28, ...AMB, 0.22);
  // outro: everything flows again
  const OUT = [T.outro + 1.6, 999];
  flow(wSeller, PAL.seller, 5, 0.5, ...OUT); flow(wWebApi, PAL.ok, 4, 0.6, ...OUT); flow(wWoo, 0xd9a6cf, 4, 0.55, ...OUT);
  flow(wApify, APIFY, 4, 0.45, ...OUT, 0.26, true); flow(wBeam, PAL.ai2, 6, 0.5, ...OUT, 0.3); flow(wTg, TG, 4, 0.5, ...OUT); flow(wPhone, TG, 6, 0.28, ...OUT, 0.22);
  // sources: dedicated bursts
  flow(wWoo, 0xd9a6cf, 7, 0.7, T.woo + 0.4, T.laz + 0.2, 0.34);
  flow(wApify, APIFY, 3, 0.9, T.laz + 0.2, T.laz + 1.4, 0.3);
  flow(wApify, APIFY, 7, 0.7, T.laz + 1.2, T.csv + 0.2, 0.34, true);
  flow(wSeller, PAL.seller, 7, 0.7, T.csv + 1.2, T.door + 0.6, 0.34);
  flow(wWebApi, PAL.ok, 7, 0.8, T.csv + 1.8, T.door + 1.0, 0.34);

  // ------------------------------------------------------------ api hall: floor road + rails
  const road = (pts, color, k, r = 0.07) => { const w = wire(pts, r, color, k, { seg: 240 }); scene.add(w); return w; };
  const roadIn = road([[-16, 0.07, 0], [-8, 0.07, 0], [2, 0.07, 0], [10, 0.07, 0]], PAL.bone, 1.3);
  const railAI = road([[10, 0.08, 0], [12.5, 0.08, -2.6], [16, 0.08, -4.2], [20, 0.08, -5], [24, 0.08, -5.4], [27, 0.08, -7.6]], PAL.ai, 2.0, 0.09);
  const railRU = road([[10, 0.08, 0], [13, 0.08, 4.6], [17, 0.08, 7.2], [21.5, 0.08, 7.6]], PAL.bone, 1.6, 0.09);
  const backAI = road([[27, 0.08, -7.6], [30.6, 0.08, -4], [34, 0.08, 0]], PAL.ai, 2.0, 0.09);
  const backRU = road([[21.5, 0.08, 7.6], [27, 0.08, 6.4], [31, 0.08, 3], [34, 0.08, 0]], PAL.bone, 1.6, 0.09);
  const roadOut = road([[34, 0.07, 0], [42, 0.07, 0], [50, 0.07, 0], [60, 0.07, 0]], PAL.bone, 1.3);

  // ------------------------------------------------------------ storm (above the seller)
  const C0 = V(-60, 14, 2);
  const storm = [];
  for (let i = 0; i < 46; i++) {
    const c = reviewCard(STORM_TEXT[i % STORM_TEXT.length], 1 + Math.floor(R() * 5), { w: 2, h: 1 });
    c.userData.seed = { x: (R() - 0.5) * 22, z: (R() - 0.5) * 16 - 2, y0: R() * 30, sp: 2.2 + R() * 2.6, rx: R() * 6, ry: R() * 6, rs: (R() - 0.5) * 2 };
    scene.add(c); storm.push(c);
  }
  const hero = reviewCard(HERO_RAW, 2, { w: 2.1, h: 1.08, size: 64 });
  const heroClean = label([{ t: "★★☆☆☆", size: 64, color: "#e6a126", lh: 1.1 }, { t: HERO, size: 64, color: "#16161b", weight: 700, lh: 1.18, wrap: true }],
    { w: 2.1 * 0.9, px: 1024, pxH: Math.round(1024 * (1.08 / 2.1)), padX: 10, padTop: 16 });
  heroClean.position.z = 0.031; heroClean.visible = false; hero.add(heroClean);
  const heroGlow = halo(PAL.ok, 3.4, 0); heroGlow.position.z = -0.05; hero.add(heroGlow);
  scene.add(hero);
  // mini cards for source streams (ride along wires)
  const CARDS = [];
  const cardRide = (w, n, a, b, rev = false) => { for (let i = 0; i < n; i++) { const c = reviewCard(STORM_TEXT[(i * 3 + n) % STORM_TEXT.length], 1 + (i % 5), { w: 1.1, h: 0.55 }); scene.add(c); CARDS.push({ c, w, i, n, a, b, rev }); } };
  cardRide(wWoo, 5, T.woo + 0.2, T.laz + 0.4);
  cardRide(wApify, 5, T.laz + 1.2, T.csv + 0.4, true);
  cardRide(wSeller, 5, T.csv + 1.2, T.door + 0.4);
  cardRide(wWebApi, 5, T.csv + 1.8, T.door + 1.2);
  tg("plug-zap", "REST · read-only", 0xd9a6cf, [-20, 4.2, 9], T.woo + 0.2, T.laz + 0.1, { h: 0.9 });
  tg("shield-check", "anti-SSRF", PAL.ok, [-20, 3.1, 9], T.woo + 0.5, T.laz + 0.1, { h: 0.8 });
  tg("wallet", "fetch budget", APIFY, [-11, 13.6, -21], T.laz + 0.4, T.csv, { h: 0.9 });
  tg("file-text", "CSV · paste", PAL.seller, [-60, 8.2, -1], T.csv + 0.4, T.door, { h: 0.9 });

  // ------------------------------------------------------------ 1 door, PII, hash, SQLite
  const door = arch(3.2, 3.6, mat(0x17171d, { rough: 0.4, metal: 0.3 }), mat(0xc9c6bc, { rough: 0.4, coat: 0.7 }));
  door.rotation.y = Math.PI / 2; add(door, -16, 0, 0);
  const doorGlow = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.4), glow(PAL.ai, 1.4, { opacity: 0, additive: true, side: THREE.DoubleSide }));
  doorGlow.rotation.y = Math.PI / 2; add(doorGlow, -16, 1.8, 0);
  const code = mat(0xc9c6bc, { rough: 0.4, coat: 0.7 });
  const dark = mat(0x17171d, { rough: 0.4, metal: 0.3 });
  const pii = arch(3.2, 3.4, code, code); pii.rotation.y = Math.PI / 2; add(pii, -11, 0, 0);
  const laser = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 3.3), glow(PAL.ok, 1.6, { opacity: 0, additive: true, side: THREE.DoubleSide }));
  laser.rotation.y = Math.PI / 2; add(laser, -11, 1.7, 0);
  const laserBar = add(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 3.1), glow(PAL.ok, 4)), -11, 1.7, 0);
  tl("icon", "eye-off", [-11, 4.6, 0], T.pii - 0.4, T.triage, { size: 1.1, color: PAL.ok, bb: true });
  tg(null, "PII → [redacted]", PAL.ok, [-11, 5.7, 0], T.pii + 0.8, T.hash + 0.4, { h: 0.6 });
  // hash press
  const press = new THREE.Group(); press.add(arch(1.8, 3, dark, code));
  const ram = box(1.3, 0.5, 1.0, glow(PAL.bone, 1.2), 0.1); ram.position.y = 2.4; press.add(ram);
  const hashFace = iconPlane("hash", PAL.ai2, 0.8); hashFace.position.set(0, 2.4, 0.52); press.add(hashFace);
  press.rotation.y = Math.PI / 2; add(press, -6.6, 0, 0);
  tg("hash", "version hash · no double count", PAL.ai2, [-6.6, 4.0, -0.4], T.hash - 0.2, T.triage - 0.4, { h: 0.38 });
  // SQLite drum with its tables
  const db = new THREE.Group();
  const discs = [0, 1, 2].map((i) => {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.7, 48), dark); d.position.y = 0.45 + i * 0.86; d.castShadow = true; db.add(d);
    const band = new THREE.Mesh(new THREE.TorusGeometry(1.61, 0.04, 8, 64), glow(PAL.bone, 1.8)); band.rotation.x = Math.PI / 2; band.position.y = d.position.y + 0.2; db.add(band);
    return band;
  });
  add(db, -1.5, 0, -6.4);
  tl("logo", "sqlite", [-1.5, 3.9, -6.2], T.build + 2.6, 999, { size: 1.8, bg: "#c9d3db", pad: 30, bb: true });
  const TABLES = [["package", "products"], ["message-square-text", "reviews"], ["sparkles", "findings"], ["ruler", "facts"], ["check", "decisions"], ["receipt", "ledger"], ["bell", "alerts"], ["timer", "jobs"]];
  const tableTiles = TABLES.map(([ic], i) => {
    const a = -Math.PI * 0.95 + (i / (TABLES.length - 1)) * Math.PI * 0.9;
    return tl("icon", ic, [-1.5 + Math.cos(a) * 3.3, 3.2 + Math.sin(i * 1.3) * 0.25, -6.4 - Math.sin(a) * 1.6 + 1.2], T.db + 0.2 + i * 0.1, 999, { size: 0.72, color: [PAL.bone, PAL.bone, PAL.ai2, PAL.seller, PAL.ok, GOLD, TG, PAL.bone][i], bb: true });
  });
  tg(null, "one private workspace per account", PAL.bone, [-1.5, 5.4, -6.2], T.db + 0.6, T.triage + 0.4, { h: 0.5 });

  // ------------------------------------------------------------ 2 triage
  const sieve = new THREE.Group();
  const sieveRing = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.16, 16, 80), code); sieveRing.castShadow = true; sieve.add(sieveRing);
  const sieveMesh = new THREE.Mesh(new THREE.CircleGeometry(1.85, 64), new THREE.MeshBasicMaterial({ color: PAL.ai, wireframe: true, transparent: true, opacity: 0.35 }));
  sieve.add(sieveMesh);
  sieve.rotation.x = -Math.PI / 2 + 0.25;
  add(sieve, 4.5, 3.2, -0.6);
  tl("icon", "cpu", [2.2, 5.6, -2.4], T.triage + 0.2, T.fork + 1, { size: 1.0, color: PAL.ai2, bb: true });
  tl("icon", "list-checks", [6.8, 5.6, -2.4], T.triage + 0.35, T.fork + 1, { size: 1.0, color: PAL.bone, bb: true });
  tg(null, "IndoBERT", PAL.ai2, [2.2, 6.6, -2.4], T.triage + 0.4, T.fork + 0.6, { h: 0.5 });
  tg(null, "lexicon", PAL.bone, [6.8, 6.6, -2.4], T.triage + 0.5, T.fork + 0.6, { h: 0.5 });
  tg("filter", "≤ 45 candidates · any ★", PAL.ai2, [8.2, 2.8, 2.6], T.triage + 3.2, T.fork + 0.6, { h: 0.55 });
  const TRI = [["Laptop 14 inci saya tidak muat.", 1, 2], ["mantap barang bagus", 0, 5], ["Bagus tapi agak sempit", 1, 5], ["packing rapi", 0, 5],
    ["tidak jelas apa ukuran nya", 1, 3], ["recommend", 0, 5], ["Bahannya bagus tetapi laptop tidak muat.", 1, 3], ["belum dibuka", 0, 4], ["dikirimnya lama", 1, 4], ["suara lumayan", 0, 4]];
  const triCards = TRI.map(([s, cand, st], i) => { const c = reviewCard(s, st, { w: 1.3, h: 0.66 }); c.userData = { ...c.userData, cand, i }; scene.add(c); return c; });
  const candTag = label([{ t: "CANDIDATE", size: 60, weight: 700, color: "#0b0820" }], { w: 0.9, px: 512, pxH: 96, bg: "#8b6cff", padX: 24, padTop: 12 });
  const triTags = triCards.map((c) => { if (!c.userData.cand) return null; const t2 = candTag.clone(); t2.position.set(0.1, 0.42, 0.04); c.add(t2); return t2; });

  // ------------------------------------------------------------ 3 fork: key lock + fail-safe switches
  const lock = new THREE.Group();
  const lockBody = box(1.6, 1.3, 1.0, dark, 0.2); lockBody.position.y = 0.9; lock.add(lockBody);
  const slot = box(0.7, 0.14, 0.2, glow(PAL.ai, 0.3), 0.05); slot.position.set(0, 1.25, 0.5); lock.add(slot);
  const lockLbl = label([{ t: "OPENAI_API_KEY", size: 56, weight: 700, color: "#ece9df" }], { w: 1.5, px: 512, pxH: 80, align: "center" });
  lockLbl.position.set(0, 0.62, 0.52); lock.add(lockLbl);
  const aiMat = mat(PAL.ai, { rough: 0.3, coat: 1, emissive: PAL.ai, ei: 0.15 });
  const keyObj = new THREE.Group();
  const keyHead = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.08, 12, 32), aiMat); keyHead.position.y = 0.35; keyObj.add(keyHead);
  keyObj.add(box(0.1, 0.5, 0.06, aiMat, 0.03));
  const keyTooth = box(0.16, 0.08, 0.06, aiMat, 0.02); keyTooth.position.set(0.08, -0.12, 0); keyObj.add(keyTooth);
  lock.add(keyObj);
  const lockLight = halo(PAL.ai, 3.2, 0); lockLight.position.set(0, 1.2, 0.6); lock.add(lockLight);
  lock.rotation.y = -0.35; add(lock, 11, 0, 2.6);
  const forkPad = add(ring(1.6, 1.9, PAL.bone, 1.6, 0), 10, 0.03, 0);
  const FAILS = [["key-round", "no key"], ["octagon-x", "401 rejected"], ["wallet", "budget out"]];
  const switches = FAILS.map(([ic, n], i) => {
    const g = new THREE.Group();
    const post = box(0.2, 1.3, 0.2, code, 0.06); post.position.y = 0.65; g.add(post);
    const armPivot = new THREE.Group(); armPivot.position.y = 1.3; g.add(armPivot);
    const arm = box(0.14, 0.9, 0.14, glow(PAL.bone, 1.4), 0.05); arm.position.y = 0.45; armPivot.add(arm);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), glow(PAL.bad, 2.2)); tip.position.y = 0.95; armPivot.add(tip);
    g.userData = { armPivot, tip };
    add(g, 7.8 + i * 2.8, 0, 6.6);
    tl("icon", ic, [7.8 + i * 2.8, 3.3, 6.6], T.fails + 0.3 + i * 0.8, T.rules + 0.8, { size: 0.95, color: PAL.bad, bb: true });
    tg(null, n, PAL.bad, [7.8 + i * 2.8, 4.3, 6.6], T.fails + 0.45 + i * 0.8, T.rules + 0.6, { h: 0.5 });
    return g;
  });

  // ------------------------------------------------------------ 4 AI bay: budget → estimate → reserve → call → settle
  const vx = 14.2, vz = -7.2;
  const plinth = box(2.8, 0.5, 2.8, dark, 0.15); add(plinth, vx, 0.25, vz);
  const coinGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.1, 32);
  const coinMat = mat(GOLD, { rough: 0.25, metal: 0.85, coat: 1, emissive: GOLD, ei: 0.18 });
  const COIN_N = 40;
  const vaultCoins = new THREE.InstancedMesh(coinGeo, coinMat, COIN_N);
  const CM = new THREE.Matrix4();
  const coinSlot = (i) => { const st = i % 4, lvl = Math.floor(i / 4); return [vx - 0.45 + (st % 2) * 0.9, 0.56 + lvl * 0.11, vz - 0.45 + Math.floor(st / 2) * 0.9]; };
  for (let i = 0; i < COIN_N; i++) { const p = coinSlot(i); CM.makeTranslation(p[0], p[1], p[2]); vaultCoins.setMatrixAt(i, CM); }
  vaultCoins.castShadow = true; scene.add(vaultCoins);
  const dome = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.9, 48, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xb9a8ff, transparent: true, opacity: 0.12, roughness: 0.05, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false }));
  add(dome, vx, 1.45, vz);
  const domeRing = add(new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.04, 8, 64), glow(GOLD, 2)), vx, 2.4, vz); domeRing.rotation.x = Math.PI / 2;
  const movers = [0, 1, 2].map(() => { const m = new THREE.Mesh(coinGeo, coinMat); m.castShadow = true; m.visible = false; scene.add(m); return m; });
  const tray = box(1.5, 0.12, 1.1, mat(0x201a10, { rough: 0.4, emissive: GOLD, ei: 0.08 }), 0.05); add(tray, 17.0, 1.05, -8.6);
  add(box(0.16, 1.0, 0.16, dark, 0.04), 17.0, 0.5, -8.6);
  // counters (discrete states)
  const cnt0 = tg("wallet", "$5.000", GOLD, [vx, 3.5, vz], T.vault + 0.4, T.reserve + 0.35, { h: 0.7 });
  const cnt1 = tg("wallet", "$4.971", GOLD, [vx, 3.5, vz], T.reserve + 0.4, T.settle + 0.85, { h: 0.7 });
  const cnt2 = tg("wallet", "$4.993", PAL.ok, [vx, 3.5, vz], T.settle + 0.9, T.fails - 0.2, { h: 0.7 });
  tg(null, "DECIQO_AI_BUDGET_USD", GOLD, [vx, 4.35, vz], T.vault + 0.6, T.env, { h: 0.45 });
  tg("lock", "reserve worst case", GOLD, [17.0, 2.2, -8.6], T.reserve + 0.3, T.send, { h: 0.5 });
  // envelope contents: system prompt (untrusted), candidate reviews, JSON schema
  const EA = V(18.8, 2.7, -3.6);
  const envParts = [["shield-alert", PAL.bad, "untrusted data"], ["message-square-text", PAL.bone, "≤45 reviews"], ["braces", PAL.ai2, "strict schema"]].map(([ic, c, n], i) => {
    const p = iconPlane(ic, c, 0.95); scene.add(p); BB.push(p);
    const lab = tg(null, n, c, [EA.x - 1.9 + i * 1.9, EA.y + 1.2 + (i % 2) * 0.55, EA.z], T.env + 0.3 + i * 0.25, T.env + 1.9, { h: 0.42 });
    return { p, i, lab };
  });
  const envelope = new THREE.Group();
  const envBox = box(0.95, 0.66, 0.46, mat(0x2a1f6b, { rough: 0.2, coat: 1, emissive: PAL.ai, ei: 0.55 }), 0.12); envelope.add(envBox);
  const envIcon = iconPlane("braces", 0xffffff, 0.46); envIcon.position.z = 0.24; envelope.add(envIcon);
  const envHalo = halo(PAL.ai, 2.6, 0.5); envHalo.position.z = -0.3; envelope.add(envHalo);
  scene.add(envelope);
  // balance scale
  const scaleG = new THREE.Group();
  const sPost = box(0.18, 2.2, 0.18, code, 0.05); sPost.position.y = 1.1; scaleG.add(sPost);
  const beamPivot = new THREE.Group(); beamPivot.position.y = 2.25; scaleG.add(beamPivot);
  beamPivot.add(box(2.5, 0.1, 0.12, code, 0.04));
  const pans = [-1, 1].map((s) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.42, 0.1, 32), code); p.castShadow = true; scaleG.add(p); return { p, s }; });
  add(scaleG, 20.4, 0, -5.2);
  tg("scale", "≈ chars ÷ 2 = tokens", PAL.bone, [20.4, 3.4, -5.2], T.weigh + 0.3, T.check, { h: 0.5 });
  tg(null, "in $0.25 / M", PAL.ai2, [22.6, 2.5, -4.6], T.weigh + 0.9, T.check, { h: 0.45 });
  tg(null, "out $2.00 / M × max", PAL.ai2, [22.6, 1.85, -4.6], T.weigh + 1.1, T.check, { h: 0.45 });
  // check gate: reserve ≤ remaining
  const cgate = arch(1.8, 2.4, dark, code); cgate.rotation.y = Math.PI / 2 - 0.4; add(cgate, 24.2, 0, -5.8);
  const cgateLight = add(new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16), glow(PAL.bad, 2.4)), 24.2, 2.75, -5.8);
  tl("icon", "shield-check", [24.2, 3.8, -5.8], T.check + 0.5, T.send + 0.6, { size: 0.9, color: PAL.ok, bb: true });
  // launch pad
  const lpad = add(ring(0.8, 1.2, PAL.ai, 2.2, 0.8), 27, 0.05, -8);
  add(new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, 0.16, 40), dark), 27, 0.08, -8);
  // cloud-side labels
  tg("braces", "Responses API · strict JSON", PAL.ai2, [34, 31.0, -28.6], T.cloud - 0.8, T.back + 0.2, { h: 1.2 });
  tg("sparkles", "gpt-5-mini · effort low", PAL.ai2, [34, 22.4, -26.2], T.cloud - 0.4, T.back + 0.2, { h: 1.0 });
  // response: JSON block + finding crystals
  const jsonTile = tile("icon", "braces", { size: 1.0, color: PAL.ai2 }); scene.add(jsonTile); BB.push(jsonTile);
  const crystals = [0, 1, 2].map((i) => {
    const g = new THREE.Group();
    const c = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), new THREE.MeshPhysicalMaterial({ color: PAL.ai, emissive: PAL.ai, emissiveIntensity: 0.9, roughness: 0.1, clearcoat: 1, flatShading: true }));
    g.add(c); g.userData = { c }; scene.add(g); return g;
  });
  tg("sparkles", "proposals · max 8", PAL.ai2, [26.2, 3.9, -7.6], T.back + 2.0, T.member, { h: 0.5 });
  // usage bars
  const USAGE = [["in", 1.9, PAL.ai], ["cached", 0.18, 0x6a6a74], ["out", 0.75, PAL.ai2]];
  const usage = USAGE.map(([n, h, c], i) => {
    const b = box(0.46, 1, 0.46, glow(c, 1.8), 0.06); b.geometry.translate(0, 0.5, 0); add(b, 24.0 + i * 0.8, 0.02, -10.8);
    const t2 = tg(null, n, c === 0x6a6a74 ? 0xaaaaa5 : c, [24.0 + i * 0.8, h + 0.55, -10.8], T.settle + 0.3, T.member + 0.4, { h: 0.36 });
    return { b, h, t2 };
  });
  tg("receipt", "usage → real cost", PAL.ok, [24.8, 3.3, -10.8], T.settle + 0.5, T.member + 0.4, { h: 0.45 });
  // ledger board on the back wall
  const LX = 19.4, LZ = -11.7;
  const ledgerBg = add(new THREE.Mesh(new THREE.PlaneGeometry(6.4, 3.8), new THREE.MeshBasicMaterial({ color: 0x0c0c12, transparent: true, opacity: 0.0 })), LX, 5.1, LZ);
  const ledHead = tg("receipt", "ledger", GOLD, [LX - 2.0, 6.6, LZ + 0.05], T.reserve + 0.2, T.fails, { h: 0.5 });
  ledHead.userData.bb = false; BB.splice(BB.indexOf(ledHead), 1);
  const row = (t, c, y) => { const l = label([{ t, size: 64, weight: 700, color: c }], { w: 5.8, px: 1150, pxH: 84, padX: 16 }); add(l, LX, y, LZ + 0.05); return l; };
  const L1a = row("discovery · reserved · $0.029", "#ffc34d", 5.9), L1b = row("discovery · ok · $0.007", "#46f0a4", 5.9);
  const L2 = [0, 1, 2].map((i) => row(`membership · ok · $0.00${[2, 2, 3][i]}`, "#46f0a4", 5.35 - i * 0.55));
  const L5 = row("401 · unknown · $0.029 held", "#ff5145", 3.7);
  // membership board: 150 reviews, batches of 50
  const tileGeo2 = new THREE.BoxGeometry(0.28, 0.28, 0.06);
  const tiles = new THREE.InstancedMesh(tileGeo2, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }), 150);
  const tileKind = [];
  const tileBase = new THREE.Color(0x24242c), cSup = new THREE.Color(PAL.ai).multiplyScalar(1.6), cCon = new THREE.Color(PAL.ok).multiplyScalar(1.3), cSkip = new THREE.Color(0x3a3a44);
  for (let i = 0; i < 150; i++) {
    const col = i % 15, rw = Math.floor(i / 15);
    CM.makeTranslation(29.4 + col * 0.34, 2.9 + rw * 0.34, -11.7); tiles.setMatrixAt(i, CM);
    const r = R(); tileKind.push(r < 0.24 ? 1 : r < 0.33 ? 2 : 0); tiles.setColorAt(i, tileBase);
  }
  scene.add(tiles);
  const batchFrame = new THREE.Group();
  { const fw = 5 * 0.34 + 0.12, fh = 10 * 0.34 + 0.12, m = glow(PAL.ai2, 3);
    [[0, fh / 2, fw, 0.05], [0, -fh / 2, fw, 0.05], [-fw / 2, 0, 0.05, fh], [fw / 2, 0, 0.05, fh]].forEach(([x, y, w, h]) => { const b = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); b.position.set(x, y, 0); batchFrame.add(b); }); }
  batchFrame.position.set(0, 2.9 + 4.5 * 0.34, -11.6); scene.add(batchFrame);
  tg("layers", "all 150 · 3 × 50", PAL.ai2, [31.8, 7.1, -11.3], T.member + 0.4, T.fails - 0.2, { h: 0.55 });
  tg(null, "supports", PAL.ai2, [30.3, 2.3, -11.2], T.member + 1.4, T.fails - 0.2, { h: 0.42 });
  tg(null, "contradicts", PAL.ok, [33.4, 2.3, -11.2], T.member + 1.6, T.fails - 0.2, { h: 0.42 });

  // ------------------------------------------------------------ 5 rule workshop (front)
  const shopPad = box(8.5, 0.3, 4.6, mat(0x15151b, { rough: 0.8 }), 0.2); add(shopPad, 21.5, 0.15, 9.4);
  const gears = [[18.6, 2.0, 8.6, 1.1, 14, 1], [21.0, 2.8, 8.6, 0.75, 10, -1.5], [22.9, 1.9, 8.6, 0.95, 12, 1.2]].map(([x, y, z, r, n, sp]) => {
    const g = new THREE.Mesh(gearGeometry(r, n, 0.3), code); g.castShadow = true; g.userData.sp = sp; return add(g, x, y, z);
  });
  const press2 = new THREE.Group(); press2.add(arch(1.6, 2.8, dark, code));
  const ram2 = box(1.2, 0.46, 0.9, glow(PAL.bone, 1.2), 0.1); ram2.position.y = 2.2; press2.add(ram2);
  add(press2, 25, 0.3, 10);
  tl("icon", "cog", [21.5, 5.2, 8.6], T.rules + 0.2, T.veto + 0.4, { size: 1.1, color: PAL.bone, bb: true });
  tg(null, "rule engine · no model", PAL.bone, [21.5, 6.3, 8.6], T.rules + 0.4, T.veto, { h: 0.55 });
  tg(null, "same output shape", PAL.bone, [21.5, 4.25, 12.2], T.rules + 3.6, T.veto, { h: 0.5 });
  const TOPICS = [["ruler", "size"], ["truck", "delivery"], ["package", "packaging"], ["gem", "quality"]];
  const ruleCrystals = TOPICS.map(([ic]) => {
    const g = new THREE.Group();
    const c = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), new THREE.MeshPhysicalMaterial({ color: PAL.bone, emissive: PAL.bone, emissiveIntensity: 0.35, roughness: 0.15, clearcoat: 1, flatShading: true }));
    g.add(c);
    const ip = iconPlane(ic, PAL.bone, 0.6); ip.position.y = 0.62; g.add(ip);
    g.userData = { c, ip }; scene.add(g); return g;
  });

  // ------------------------------------------------------------ 6 code veto (both routes)
  const veto = arch(5, 4.2, code, code); veto.rotation.y = Math.PI / 2 - 0.2; add(veto, 37, 0, 0);
  const vetoCurtain = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4), glow(PAL.bone, 1.2, { opacity: 0, additive: true, side: THREE.DoubleSide }));
  vetoCurtain.rotation.y = Math.PI / 2 - 0.2; add(vetoCurtain, 37, 2, 0);
  const PX = 39.4, PY = 3.2, PZ = 5.6;
  const panel = (lines, o = {}) => add(label(lines, { w: 5.0, px: 1280, pxH: o.pxH ?? 300, padX: 48, padTop: 30, bg: o.bg ?? "#101016", border: o.border ?? "rgba(236,233,223,0.35)" }), PX, o.y ?? PY, PZ);
  const QLINE = { t: HERO, size: 64, weight: 700, color: "#ece9df", wrap: true, lh: 1.25 };
  const quoteSrc = panel([QLINE]);
  const quoteHiP = panel([{ ...QLINE, hl: { rows: [0], color: "#46f0a4", ink: "#07170f" } }], { border: "#46f0a4" });
  const para = panel([{ t: "“the bag is too small for most laptops”", size: 64, weight: 700, color: "#ffd9d6", wrap: true, lh: 1.25 }], { bg: "#2c0c0c", border: "#ff5145" });
  const judgeLines = (j) => [{ t: "Bahannya bagus", size: 72, weight: 700, color: j ? "#5c5c59" : "#ece9df", lh: 1.2 },
    { t: "tetapi laptop tidak muat.", size: 72, weight: 700, color: "#ece9df", lh: 1.25, hl: j ? { color: "#46f0a4", ink: "#07170f" } : null }];
  const judge0 = panel(judgeLines(false)), judge1 = panel(judgeLines(true), { border: "#46f0a4" });
  const metric = panel([{ t: "3 / 3", size: 250, font: FONT.disp, color: "#ece9df", lh: 1.0 }], { pxH: 340, y: PY + 0.2 });
  const wilsonTrack = add(new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.13), new THREE.MeshBasicMaterial({ color: 0x2a2a31, transparent: true })), PX, PY - 1.25, PZ + 0.01);
  const wilsonBar = add(new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.13), glow(PAL.ok, 1.8, { opacity: 1 })), PX, PY - 1.25, PZ + 0.02);
  const TT = (ic, n, c, a, b) => tg(ic, n, c, [PX, PY + 1.75, PZ + 0.1], a, b, { h: 0.6 });
  TT("quote", "verbatim ✓", PAL.ok, T.verbatim + 1.3, T.para);
  TT("x", "not in any review → dropped", PAL.bad, T.para + 0.9, T.judge);
  TT("scale", "per clause", PAL.ok, T.judge + 1.2, T.metrics);
  TT("chart-column", "counted by code", PAL.bone, T.metrics + 0.3, T.listing);
  tg(null, "N of M stored · Wilson · severity", PAL.dim, [PX, PY - 1.8, PZ + 0.1], T.metrics + 0.9, T.listing, { h: 0.42 });

  // ------------------------------------------------------------ 7 listing check + fact gate
  const listDoc = label([{ t: "Tas Laptop Kanvas 14 Inci", size: 70, weight: 700, color: "#16161b", gap: 24 },
    ...["Bahan kanvas tebal, tahan air ringan.", "Muat laptop sampai 14 inci.", "Warna: hitam, abu, navy.", "Resleting YKK, tali bahu empuk."].map((t) => ({ t, size: 50, weight: 500, color: "#55534c", lh: 1.5 }))],
    { w: 5.0, px: 1200, pxH: 700, padX: 60, padTop: 50, bg: "#e9e5da" });
  listDoc.rotation.y = 0.2; add(listDoc, 52.4, 4.4, -2.8);
  const lens = iconPlane("search", PAL.seller, 1.1, { glow: 14 }); lens.rotation.y = 0.2; scene.add(lens);
  tg("search", "not in the checked listing", PAL.seller, [52.4, 6.6, -2.6], T.listing + 2.6, T.whip1 + 0.2, { h: 0.55 });
  const GX = 45.6;
  const GA = -0.55;
  const gate = arch(4.4, 4.2, code, code); gate.rotation.y = GA; add(gate, GX, 0, 1.6);
  const doorMat = mat(PAL.bad, { rough: 0.3, emissive: PAL.bad, ei: 0.35, coat: 1 });
  const doors = [-1, 1].map((s) => { const d = box(2.0, 3.9, 0.2, doorMat, 0.08); d.userData.s = s; scene.add(d); return d; });
  const draft = label([{ t: "Ukuran bagian dalam kompartemen:", size: 60, weight: 700, color: "#16161b", lh: 1.25 }],
    { w: 4.2, px: 1280, pxH: 380, padX: 44, padTop: 40, bg: "#d9d4c7" });
  add(draft, 52.0, 2.9, 3.8);
  const blank = label([{ t: "[ ? ] cm", size: 110, weight: 700, color: "#e0392e" }], { w: 2.2, px: 640, pxH: 140, align: "center" });
  const filled = label([{ t: "32 × 24 cm", size: 110, weight: 700, color: "#137045" }], { w: 2.2, px: 640, pxH: 140, align: "center" });
  add(blank, 51.3, 2.5, 3.82); add(filled, 51.3, 2.5, 3.82);
  tg("hourglass", "needs your fact", PAL.bad, [52.0, 4.6, 3.9], T.listing + 3.2, T.open, { h: 0.55 });
  tg("circle-check", "ready for your review", PAL.ok, [52.0, 4.6, 3.9], T.open + 0.4, T.whip2 + 0.2, { h: 0.55 });
  const gatePool = halo(PAL.bad, 9, 0); gatePool.rotation.x = -Math.PI / 2; add(gatePool, GX + 0.2, 0.03, 2);
  // seller-side input: "oke" rejected, measured value accepted
  const inBox = (txt, c, border) => label([{ t: txt, size: 88, weight: 700, color: c }], { w: 2.6, px: 900, pxH: 170, padX: 44, padTop: 30, bg: "#101016", border });
  const inOke = inBox("oke", "#ece9df", "#ece9df"), inOkeBad = inBox("oke", "#ff8a80", "#ff5145"), inVal = inBox("32 × 24 cm", "#ffcf7a", "#ffb43d"), inValOk = inBox("32 × 24 cm", "#46f0a4", "#46f0a4");
  [inOke, inOkeBad, inVal, inValOk].forEach((m) => { m.rotation.y = -0.2; add(m, -57.2, 3.7, 3.6); m.material.opacity = 0; });
  tg("octagon-x", "not a fact", PAL.bad, [-57.2, 4.7, 3.6], T.reject + 0.1, T.fact - 0.1, { h: 0.5 });
  tg("ruler", "value + unit", PAL.ok, [-57.2, 4.7, 3.6], T.fact + 1.2, T.sendFact + 1.2, { h: 0.5 });
  const factPkt = tile("icon", "ruler", { size: 0.8, color: PAL.seller, slab: 0x2a1c05, rim: PAL.seller }); scene.add(factPkt); BB.push(factPkt);
  const factCard = label([{ t: "32 × 24 cm", size: 130, font: FONT.disp, color: "#1d1200", lh: 1.0 }], { w: 1.8, px: 640, pxH: 180, padX: 36, padTop: 22, bg: "#ffb43d", align: "center" });
  scene.add(factCard); BB.push(factCard);
  const actedStamp = tl("icon", "check", [-61.8, 4.0, 2.8], T.acted, T.watch, { size: 1.3, color: PAL.ok, bb: true });
  tg(null, "applied · monitoring", PAL.ok, [-61.8, 5.1, 2.8], T.acted + 0.3, T.watch, { h: 0.5 });

  // ------------------------------------------------------------ 8 watch: timeline, radar, outbox
  const tower = new THREE.Group();
  const mast = box(0.5, 5, 0.5, code, 0.1); mast.position.y = 2.5; tower.add(mast);
  const dishPivot = new THREE.Group(); dishPivot.position.y = 5.2; tower.add(dishPivot);
  const dish = new THREE.Mesh(new THREE.SphereGeometry(1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.6), code); dish.rotation.x = Math.PI / 2 - 0.6; dishPivot.add(dish);
  add(tower, 58.8, 0, -7.6);
  const pings = [0, 1, 2].map(() => add(ring(0.9, 1.0, PAL.ok, 2, 0), 58.8, 0.05, -7.6));
  const tlBar = add(new THREE.Mesh(new THREE.BoxGeometry(8, 0.08, 0.08), glow(PAL.bone, 1.5)), 54.6, 4.6, 0.4);
  const pin = add(new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 0.08), glow(PAL.ok, 2.4)), 54.6, 4.6, 0.4);
  tl("icon", "clock", [54.6, 5.8, 0.5], T.watch + 0.4, T.outro, { size: 0.8, color: PAL.ok, bb: true });
  tg(null, "acted_at", PAL.ok, [54.6, 6.75, 0.5], T.watch + 0.6, T.outro, { h: 0.45 });
  const oldCard = reviewCard("Tas kekecilan untuk laptop saya", 2, { w: 1.9, h: 0.95, size: 66 }); scene.add(oldCard);
  const lateCard = reviewCard("Masih tidak muat laptop 14 inch saya.", 2, { w: 1.9, h: 0.95, size: 62 }); scene.add(lateCard);
  tg(null, "written before → ignored", PAL.dim, [52.0, 2.2, 0.6], T.old + 1.3, T.outro, { h: 0.42 });
  tg(null, "written after", PAL.bad, [57.2, 2.2, 0.6], T.late + 1.3, T.outro, { h: 0.42 });
  const monCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), new THREE.MeshPhysicalMaterial({ color: PAL.ok, emissive: PAL.ok, emissiveIntensity: 0.8, roughness: 0.1, clearcoat: 1, flatShading: true }));
  add(monCrystal, 54.6, 7.8, 0.4); popIn(monCrystal, T.watch + 0.3, T.outro);
  tg("rotate-ccw", "came back", PAL.bad, [54.6, 8.9, 0.5], T.reopen + 0.1, T.outro, { h: 0.7 });
  const bellTile = tl("icon", "bell", [59.4, 2.2, -3.4], T.outbox, T.outro, { size: 1.0, color: TG, bb: true });
  tg(null, "outbox · dedupe · 8/h", TG, [59.4, 3.3, -3.4], T.outbox + 0.3, T.tg, { h: 0.45 });
  const note = tile("icon", "bell", { size: 0.7, color: TG, slab: 0x0a1c26, rim: TG }); scene.add(note); BB.push(note);

  // ------------------------------------------------------------ pools of light
  const POOLS = [];
  const pool = (x, z, color, size, a) => { const h = halo(color, size, 0); h.rotation.x = -Math.PI / 2; h.position.set(x, 0.03, z); scene.add(h); POOLS.push({ h, a }); return h; };
  pool(-60, 2, PAL.seller, 16, T.build); pool(-11, 0, PAL.ok, 8, T.pii - 0.6); pool(-1.5, -6.4, PAL.bone, 8, T.db - 0.6); pool(4.5, -0.4, PAL.ai, 8, T.triage);
  pool(14.2, -7.2, GOLD, 8, T.vault); pool(27, -8, PAL.ai, 7, T.send - 1); pool(21.5, 9.4, PAL.bone, 12, T.rules); pool(37, 0.4, PAL.bone, 9, T.veto);
  pool(54.6, 0.4, PAL.ok, 10, T.watch); pool(GX, 2, PAL.bone, 8, T.listing);

  // ------------------------------------------------------------ Qo + bursts
  const qo = createQo(scene);
  const BURSTS = [[T.hatch + 2.4, [-60, 14, 2.4], PAL.ai2], [T.key + 1.25, [10.8, 1.6, 3.4], PAL.ai2], [T.send + 0.1, [27, 1.2, -8], PAL.ai2],
    [T.para + 0.9, [PX, PY, PZ + 0.3], PAL.bad], [T.reject, [-57.2, 3.7, 3.8], PAL.bad], [T.open, [45.8, 3.0, 2.4], PAL.ok],
    [T.reopen, [54.6, 7.8, 0.6], PAL.bad], [T.phone, [-57.4, 1.8, 2.5], TG], [T.fails + 0.9, [7.8, 2.3, 6.6], PAL.bone]];
  const bursts = BURSTS.map(([bt, p, c], bi) => {
    const r2 = rng(100 + bi), parts = []; const m = glow(c, 3);
    for (let i = 0; i < 28; i++) { const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.05 + r2() * 0.07), m); mesh.userData.d = V(r2() - 0.5, r2() * 0.9 - 0.2, r2() - 0.5).normalize().multiplyScalar(1.6 + r2() * 2.6); mesh.visible = false; scene.add(mesh); parts.push(mesh); }
    return { bt, p, parts };
  });

  // ============================================================ camera script [t, pos, target, fov]
  const CAM = [
    [0.0, [-63.5, 15.6, 11], [-60, 14, 2], 42],
    [1.4, [-62.8, 15.4, 13.4], [-60, 14, 2], 40],
    [3.4, [-61.6, 14.9, 10.6], [-60, 14, 2], 37],
    [4.2, [-60.8, 14.5, 7.8], [-60, 14, 2], 36],
    [6.5, [-60.4, 14.8, 7.8], [-60, 13.6, 2], 38],
    [9.6, [-78, 26, 44], [-40, 3, 0], 44],
    [13.4, [2, 42, 90], [6, 5, -3], 54],
    [19.6, [7, 39, 86], [9, 6, -3], 54],
    // sources
    [22.0, [-34, 16, 30], [-20, 2, 5], 44],
    [23.0, [-33, 16, 29], [-19, 2, 4], 44],
    [24.8, [-26, 16, 8], [-8, 12, -26], 46],
    [26.0, [-25, 16, 9], [-8, 11, -24], 46],
    [27.4, [-67, 8.4, 20], [-60, 3, 1], 40],
    [28.6, [-66, 8.6, 19], [-58, 3, 0], 40],
    [30.0, [-25, 5.2, 13], [-14, 1.8, 0], 42],
    [31.4, [-16, 4.2, 9.5], [-10, 1.8, 0], 40],
    [33.2, [-8.5, 5.6, 9.5], [-3, 2.2, -3.6], 42],
    [35.4, [-0.6, 5.4, 12], [4, 2.6, -1], 40],
    [41.6, [0.4, 5.4, 12.4], [5.4, 2.6, -0.6], 40],
    // fork + key
    [43.2, [3, 10, 17], [13, 1.2, 0.4], 44],
    [44.6, [7.4, 4.0, 9.6], [11, 1.4, 2.4], 36],
    [47.2, [7.8, 4.0, 9.4], [11, 1.4, 2.4], 36],
    // credit flow
    [48.8, [10.8, 5.0, 3.6], [15.2, 2.2, -7.2], 40],
    [50.2, [12.4, 4.8, 5.2], [17.8, 2.4, -5.2], 42],
    [52.6, [15.2, 5.0, 4.6], [20.2, 2.2, -5.6], 40],
    [54.4, [15.6, 4.8, 1.6], [18.0, 3.4, -9.6], 44],
    [55.8, [18.4, 5.0, 4.4], [23.2, 2.2, -6.0], 40],
    [57.6, [21.2, 3.4, 2.4], [27, 3.8, -8.6], 44],
    [59.2, [26.4, 15.0, -2.0], [32, 20, -24], 46],
    [60.8, [29.6, 29.6, -12.6], [34, 26.4, -29], 42],
    [61.9, [30.0, 29.2, -12.2], [34, 26.2, -29], 42],
    [63.2, [23.0, 13.0, 0.0], [27, 4.2, -9.4], 46],
    [64.6, [17.8, 4.6, -0.6], [20.0, 4.0, -11.2], 46],
    [66.2, [18.2, 4.6, -0.8], [20.2, 4.0, -11.2], 46],
    [67.4, [28.8, 5.0, 1.0], [31.8, 4.6, -11], 40],
    [72.8, [29.2, 5.0, 0.8], [31.8, 4.6, -11], 40],
    // failure modes
    [74.0, [10.4, 4.6, 15.4], [10.6, 2.6, 5.6], 42],
    [77.6, [11.0, 4.6, 15.0], [10.8, 2.6, 5.6], 42],
    // rule engine
    [79.6, [15.0, 5.6, 19.6], [21.2, 2.6, 8.4], 40],
    [84.6, [16.4, 5.6, 19.0], [22.2, 2.6, 8.0], 40],
    [86.4, [27.0, 5.4, 14.0], [34, 1.8, 1.4], 44],
    // veto
    [87.6, [33.2, 4.4, 13.0], [38.6, 2.8, 3.8], 40],
    [99.6, [33.6, 4.4, 12.6], [38.8, 2.8, 3.8], 40],
    // listing + gate
    [101.0, [42.0, 5.8, 13.4], [51.0, 3.2, 0.2], 44],
    [103.8, [42.6, 5.8, 13.0], [51.2, 3.2, 0.4], 44],
    [104.4, [-10, 44, 64], [-30, 4, 0], 44],
    [105.2, [-54.6, 4.4, 10.4], [-59.4, 2.4, 2.2], 38],
    [109.2, [-54.8, 4.4, 10.0], [-59.4, 2.4, 2.2], 38],
    [110.3, [-30, 12, 18], [-18, 2, -2], 46],
    [111.5, [42.0, 5.6, 13.4], [51.0, 3.0, 0.6], 44],
    [115.6, [42.6, 5.6, 13.0], [51.2, 3.0, 0.6], 44],
    [116.2, [-10, 44, 64], [-30, 4, 0], 44],
    [117.0, [-54.6, 4.4, 10.4], [-59.4, 2.4, 2.2], 38],
    [119.4, [-54.8, 4.6, 10.2], [-59.4, 2.6, 2.2], 38],
    // watch
    [120.6, [49.6, 6.4, 11.8], [55.8, 4.2, -1.0], 42],
    [127.0, [50.2, 6.4, 11.2], [56.0, 4.2, -1.0], 42],
    [128.8, [60, 12, 20], [72, 9, 0], 46],
    [130.8, [20, 44, 78], [0, 12, 4], 46],
    [132.2, [-55.4, 2.8, 5.4], [-57.4, 1.65, 2.1], 30],
    [133.4, [-55.5, 2.85, 5.3], [-57.4, 1.65, 2.1], 30],
    [135.8, [-54.6, 4.2, 10.0], [-59.6, 2.2, 2.0], 38],
    // outro
    [141.4, [2, 42, 90], [6, 5, -3], 54],
    [150.0, [4, 46, 98], [7, 6, -3], 54],
  ];
  const kp = CAM.map((r) => [r[0], r[1]]), kl = CAM.map((r) => [r[0], r[2]]), kf = CAM.map((r) => [r[0], r[3]]);
  const camAt = (t) => ({ p: keys(t, kp), l: keys(t, kl), f: keys(t, kf) });

  // ============================================================ Qo script
  const QO = [
    [0, [-60, 14, 2]], [6.5, [-60, 14.2, 2]], [11.6, [-19.2, 1.5, 1.6]], [22, [-19.4, 1.5, 1.8]], [29.4, [-18.6, 1.4, 1.8]],
    [30.6, [-13.2, 1.4, 1.6]], [31.8, [-9.4, 1.4, 1.6]], [33.0, [-5.4, 1.4, 1.8]], [34.2, [-2.2, 1.4, 2.2]], [35.4, [1.2, 1.4, 2.6]],
    [41.6, [2.2, 1.4, 2.6]], [43.0, [7.2, 1.4, 1.0]], [47.6, [7.4, 1.4, 1.2]], [49.0, [12.2, 1.4, -3.2]], [52.0, [15.4, 1.4, -2.2]],
    [55.6, [20.8, 1.4, -2.0]], [57.4, [24.6, 1.4, -4.2]], [63.2, [24.8, 1.4, -4.2]], [64.6, [16.8, 1.4, -2.8]], [66.4, [17.2, 1.4, -2.8]],
    [67.6, [28.2, 1.4, -5.6]], [72.8, [28.4, 1.4, -5.6]], [74.0, [15.2, 1.4, 5.0]], [77.6, [15.4, 1.4, 5.0]], [79.4, [18.6, 1.4, 11.8]],
    [85.0, [19.6, 1.4, 11.8]], [86.8, [34.4, 1.4, 4.8]], [99.6, [34.6, 1.4, 5.2]], [101.0, [41.6, 1.4, 4.6]], [116.0, [41.8, 1.4, 4.8]],
    [120.4, [51.4, 1.4, 3.8]], [135.0, [51.6, 1.4, 4.0]], [141.0, [22, 11, 12]], [150, [22, 11.4, 12]],
  ];
  const qoPos = (t) => keys(t, QO);
  const BLINKS = [5.2, 9.9, 14.6, 20.4, 26.3, 32.1, 39.6, 44.2, 53.4, 58.2, 64.0, 69.5, 75.0, 79.1, 84.6, 91.5, 97.2, 103, 112.6, 118.4, 124, 129, 138, 145];

  // ============================================================ render
  const tmpQ = new THREE.Quaternion();
  const aiRoute = (t) => t >= T.key && t < T.fails + 0.6;
  function render(t) {
    // ---------- camera
    const cam = camAt(t);
    const dx = Math.sin(t * 0.37) * 0.1, dy = Math.sin(t * 0.29 + 1) * 0.07;
    S.aim([cam.p[0] + dx, cam.p[1] + dy, cam.p[2]], cam.l, cam.f);
    S.shadowFollow(cam.l[0], cam.l[2]);
    const camDist = Math.hypot(cam.p[0] - cam.l[0], cam.p[1] - cam.l[1], cam.p[2] - cam.l[2]);
    scene.fog.density = clamp(0.3 / camDist, 0.0018, 0.03);
    camera.updateMatrixWorld();
    const wide = clamp((camDist - 30) / 60);  // 0 inside the hall, 1 in the overview

    // ---------- appear systems
    for (const p of POP) {
      const k = t < p.a ? 0 : t < p.a + p.fi ? E.backBig(clamp((t - p.a) / p.fi)) : 1;
      const s = k * (1 - ramp(t, p.b - p.fo, p.b, E.in));
      p.o.visible = s > 0.002;
      p.o.scale.setScalar(Math.max(0.0001, p.s0 * s));
    }
    for (const f of FADE) f.m.material.opacity = f.k * win(t, f.a, f.b, f.fi, f.fo);
    tmpQ.copy(camera.quaternion);
    for (const b of BB) if (b.visible && b.userData.bb !== false) b.quaternion.copy(tmpQ);

    // ---------- host + containers rise
    hostRim.material.opacity = 0.5 * ramp(t, T.build, T.build + 1) + 0.3 * ramp(t, T.outro, T.outro + 2);
    padRing.material.opacity = 0.8 * ramp(t, T.build + 0.2, T.build + 1);
    [[webBox, 0.9], [wooBox, 1.5], [apiBox, 2.0]].forEach(([g, d]) => {
      const k = ramp(t, T.build + d, T.build + d + 0.9, E.back);
      g.visible = k > 0.001; g.scale.set(1, Math.max(0.001, k), 1);
      const inside = g === apiBox ? 1 - wide : 0;
      g.userData.edges.material.opacity = 0.9 - inside * 0.62;
      g.userData.faces.material.opacity = 0.035 * (1 - inside * 0.6);
    });
    shop.rotation.y = t * 0.4;

    // ---------- wires
    WIRES.forEach(({ w, a, b }) => w.userData.reveal(ramp(t, a, b, E.inOut)));
    wBeam.material.color.setHex(PAL.ai).multiplyScalar(2.6 * (1 + 0.8 * win(t, T.send, T.back + 1.6, 0.3, 0.6)));
    FLOWS.forEach(({ w, parts, speed, a, b, rev, size }) => {
      const on = win(t, a, b, 0.5, 0.5);
      parts.forEach((c, i) => {
        c.visible = on > 0.01; if (!c.visible) return;
        let u = ((t - a) * speed + i / parts.length) % 1; if (rev) u = 1 - u;
        const p = w.userData.curve.getPointAt(u);
        c.position.copy(p); c.scale.setScalar(on * (0.6 + 0.4 * Math.sin(u * Math.PI)) * (1 + 1.2 * wide));
        c.rotation.set(t * 2 + i, t * 3, 0);
      });
    });
    CARDS.forEach(({ c, w, i, n, a, b, rev }) => {
      const span = b - a, t0 = a + (i / n) * span * 0.55;
      const u0 = clamp((t - t0) / (span * 0.45));
      c.visible = t > t0 && u0 < 1;
      if (!c.visible) return;
      const u = rev ? 1 - E.inOut(u0) : E.inOut(u0);
      const p = w.userData.curve.getPointAt(u);
      c.position.set(p.x, p.y + 0.55, p.z); c.quaternion.copy(tmpQ);
      c.scale.setScalar(Math.max(0.001, Math.sin(u0 * Math.PI) * 1.2));
    });
    roadIn.userData.reveal(ramp(t, T.door, T.triage, E.inOut));
    const forkDraw = ramp(t, T.fork + 0.4, T.fork + 2.2, E.inOut);
    railAI.userData.reveal(forkDraw); railRU.userData.reveal(forkDraw);
    backAI.userData.reveal(ramp(t, T.back + 1.6, T.settle, E.inOut)); backRU.userData.reveal(ramp(t, T.rules + 1, T.rules + 2.4, E.inOut));
    roadOut.userData.reveal(ramp(t, T.veto - 0.4, T.listing + 0.6, E.inOut) + (t > T.outro ? 1 : 0));
    const aiHot = aiRoute(t) ? 1 : t < T.key ? 0.5 : 0.22 + 0.78 * ramp(t, T.outro, T.outro + 2);
    railAI.material.color.setHex(PAL.ai).multiplyScalar(2.0 * aiHot);
    const ruHot = t > T.fails + 0.8 ? 1 : 0.35;
    railRU.material.color.setHex(PAL.bone).multiplyScalar(1.6 * ruHot);
    forkPad.material.opacity = 0.8 * win(t, T.fork, T.rules + 2, 0.5, 0.8);
    doorGlow.material.opacity = 0.3 * win(t, T.door - 0.4, T.pii + 0.6, 0.4, 0.6);

    // ---------- storm
    const stormFade = 1 - ramp(t, 6.6, 8.6, E.in);
    storm.forEach((c, i) => {
      const s = c.userData.seed;
      const y = C0.y + 14 - ((s.y0 + t * s.sp) % 30);
      const orbit = ramp(t, T.hatch, T.hatch + 1.5) * (1 - ramp(t, T.map, T.map + 1));
      const ang = t * 0.5 + i;
      const ox = lerp(s.x, Math.cos(ang) * (3.4 + (i % 5) * 0.6), orbit * 0.6);
      const oz = lerp(s.z, Math.sin(ang) * (3.4 + (i % 5) * 0.6) - 1, orbit * 0.6);
      c.position.set(C0.x + ox, y, C0.z + oz);
      c.rotation.set(s.rx + t * s.rs, s.ry + t * s.rs * 0.7, 0.2 * Math.sin(t + i));
      c.visible = stormFade > 0.01;
      c.scale.setScalar(Math.max(0.001, stormFade));
    });

    // ---------- Qo
    const qp = qoPos(t);
    const hatchScale = keys(t, [[0, 2.7], [T.hatch + 1.4, 2.7], [T.hatch + 2.4, 1, E.backBig]]);
    const parts = pop(t, T.hatch + 2.5, 0.35);
    let mode = "ai", mode2 = "ai", mix = 0;
    if (t >= T.fails) { mode = "ai"; mode2 = "rules"; mix = ramp(t, T.fails + 0.9, T.fails + 1.6); }
    if (t >= T.veto) { mode = "rules"; mode2 = "rules"; }
    if (t >= T.gate) { mode = "rules"; mode2 = "ok"; mix = ramp(t, T.open, T.open + 0.6); }
    if (t >= T.watch) { mode = "ok"; mode2 = "bad"; mix = ramp(t, T.reopen, T.reopen + 0.4) * (1 - ramp(t, T.phone, T.phone + 1)); }
    if (t >= T.outro) { mode = "ok"; mode2 = "ai"; mix = ramp(t, T.outro, T.outro + 1.4); }
    let mood = "idle";
    if (t > T.grab && t < T.grab + 1.4) mood = "happy";
    if (t > T.key + 1.2 && t < T.key + 2.6) mood = "happy";
    if (t > T.send && t < T.send + 1.6) mood = "wow";
    if (t > T.cloud && t < T.back + 1.8) mood = "squint";
    if (t > T.settle + 0.8 && t < T.settle + 2) mood = "happy";
    if (t > T.fails + 0.9 && t < T.fails + 2.2) mood = "wow";
    if (t > T.para + 0.9 && t < T.para + 2) mood = "wow";
    if (t > T.open && t < T.open + 2.4) mood = "happy";
    if (t > T.reopen && t < T.reopen + 1.6) mood = "wow";
    if (t > T.outro + 1) mood = "happy";
    const vel = (() => { const a = qoPos(t - 0.05), b = qoPos(t + 0.05); return [(b[0] - a[0]) * 10, (b[1] - a[1]) * 10, (b[2] - a[2]) * 10]; })();
    const speed = Math.hypot(vel[0], vel[2]);
    const hopping = speed > 0.6 && qp[1] < 2.2;
    const hop = hopping ? Math.abs(Math.sin(t * 7.5)) * 0.35 : 0;
    const wave = t > T.lock ? Math.sin(t * 9) : 0;
    const lookUp = (t > T.send && t < T.back + 1.6) ? 0.8 : (t > T.member && t < T.fails) ? 0.5 : 0;
    qo.pose(t, {
      pos: [qp[0], qp[1] + hop, qp[2]],
      yaw: t > T.outro ? Math.atan2(camera.position.x - qp[0], camera.position.z - qp[2]) * ramp(t, T.outro + 2, T.outro + 4) : clamp(vel[0] * 0.05, -0.5, 0.5) - clamp(vel[2] * 0.04, -0.4, 0.4),
      lean: -clamp(vel[0] * 0.02, -0.35, 0.35), pitch: clamp(speed * 0.012, 0, 0.2),
      squash: hopping ? Math.cos(t * 15) * 0.08 : (t > T.hatch + 2.3 && t < T.hatch + 3.2 ? Math.sin((t - T.hatch - 2.3) * 14) * 0.18 * (1 - ramp(t, T.hatch + 2.3, T.hatch + 3.2)) : 0),
      scale: hatchScale * (1 + 1.6 * clamp((camDist - 60) / 60) * (t > T.outro ? 1 : 0)),
      eyesOpen: t < T.hatch + 2.2 ? 0.08 : ramp(t, T.hatch + 2.2, T.hatch + 2.6, E.out),
      parts: t < T.hatch + 2.5 ? 0 : parts, mode, mode2, modeMix: mix, mood,
      lookX: keys(t, [[4.4, 0], [4.8, -0.8], [5.2, 0.8], [5.6, 0]]), lookY: lookUp,
      blinkAt: BLINKS, ground: qp[1] > 6 ? -99 : 0,
      hands: t > T.lock ? [[-0.78, -0.1, 0.12], [0.9, 0.35 + wave * 0.12, 0.2]] : null,
    });

    // ---------- hero card
    {
      const heroFly = ramp(t, T.grab - 0.4, T.grab + 0.4, E.out);
      if (t < T.grab + 0.4) {
        const s = [C0.x + 2.6, C0.y + 2.2, C0.z + 0.6];
        hero.position.set(lerp(s[0], qp[0], heroFly), lerp(s[1], qp[1] - 0.2, heroFly), lerp(s[2], qp[2] + 0.75, heroFly));
        hero.rotation.set(lerp(0.6, 0, heroFly), lerp(-0.8, 0, heroFly), lerp(0.4, 0, heroFly));
        hero.visible = t > T.hatch + 1; hero.scale.setScalar(0.7);
      } else if (t < T.triage + 1.2) {
        hero.position.set(qp[0] + 0.1, qp[1] - 0.25 + hop + Math.sin(t * 2.6) * 0.07, qp[2] + 0.72);
        hero.rotation.set(-0.08, 0, 0.04); hero.scale.setScalar(0.7); hero.visible = true;
      } else if (t < T.fork + 1) {
        const p = ramp(t, T.triage + 1.2, T.triage + 2.6, E.inOut);
        hero.position.set(lerp(1.3, 5.2, p), lerp(1.2, 3.6, Math.sin(p * Math.PI)) + p * 0.2 - ramp(t, T.triage + 2.6, T.triage + 3.6) * 1.8, lerp(3.3, 1.4, p));
        hero.rotation.set(-0.3 * p, 0.2 * p, 0); hero.visible = true;
      } else hero.visible = false;
      const scanned = t > T.pii + 0.8;
      hero.userData.face.visible = !scanned; heroClean.visible = scanned;
      heroGlow.material.opacity = win(t, T.pii + 0.6, T.pii + 1.8, 0.2, 0.6) * 0.9;
    }

    // ---------- PII + hash + db
    const scanP = ramp(t, T.pii, T.pii + 1.4, E.inOut);
    laserBar.position.y = 0.2 + Math.abs(Math.sin(scanP * Math.PI * 2)) * 3.1; laserBar.visible = scanP > 0 && scanP < 1;
    laser.material.opacity = win(t, T.pii, T.pii + 1.4, 0.2, 0.4) * 0.22;
    const stampK = t > T.hash + 0.2 && t < T.hash + 1.1 ? Math.pow(Math.sin(((t - T.hash - 0.2) / 0.9) * Math.PI), 4) : 0;
    ram.position.y = 2.4 - stampK * 1.3; hashFace.position.y = ram.position.y;
    discs.forEach((b, i) => { const on = win(t, T.db + 0.2 + i * 0.2, T.triage + 0.6, 0.15, 0.8); b.material.color.setHex(PAL.bone).multiplyScalar(1 + on * 1.8); });

    // ---------- triage
    sieve.rotation.z = t * 0.4;
    sieveMesh.material.opacity = 0.25 + 0.3 * win(t, T.triage, T.fork, 0.3, 0.8);
    triCards.forEach((c, i) => {
      const t0 = T.triage + 0.4 + i * 0.3;
      const drop = ramp(t, t0, t0 + 0.9, E.in), out = ramp(t, t0 + 0.9, t0 + 2.2, E.out);
      const x = 3.6 + (i % 5) * 0.46 - 0.6, z = -0.8 + Math.floor(i / 5) * 0.9;
      const cand = c.userData.cand;
      let y = lerp(8.5, 3.3, drop), px = x, pz = z;
      if (cand) { y -= out * 1.6; px += out * (3.2 + (i % 3) * 0.5); pz += out * 2.4; } else { y -= out * 3.2; px -= out * 1.8; pz += out * 3.0; }
      c.position.set(px, Math.max(0.35, y), pz);
      c.rotation.set(-0.9 + out * 0.4, 0.3, cand ? 0 : out * 1.5);
      const vis = t > t0 && t < T.fork + 1.6;
      c.visible = vis;
      c.userData.slab.material.color.setHex(cand || out < 0.5 ? 0xf1ede3 : 0x55554f);
      if (triTags[i]) triTags[i].visible = out > 0.15;
      c.scale.setScalar(vis ? (cand ? 1 : 1 - out * 0.5) : 0.001);
    });

    // ---------- key + switches
    const ins = t < T.fails ? ramp(t, T.key + 0.2, T.key + 1.3, E.inOut) : 1 - ramp(t, T.fails + 0.1, T.fails + 0.8, E.inOut);
    keyObj.position.set(0, lerp(2.6, 1.55, ins), lerp(1.6, 0.5, ins)); keyObj.rotation.set(0, 0, lerp(0.8, 0, ins));
    keyObj.visible = t > T.key - 0.2;
    const lit = ramp(t, T.key + 1.2, T.key + 1.5) * (1 - ramp(t, T.fails, T.fails + 0.3));
    slot.material.color.setHex(PAL.ai).multiplyScalar(0.3 + lit * 2.4); lockLight.material.opacity = lit * 0.7;
    switches.forEach((s, i) => {
      const t0 = T.fails + 0.6 + i * 0.8;
      const on = ramp(t, t0, t0 + 0.4, E.backBig);
      s.userData.armPivot.rotation.z = lerp(0.5, -0.7, on);
      s.userData.tip.material.color.setHex(on > 0.5 ? PAL.bone : PAL.bad).multiplyScalar(2.2);
      const sc = pop(t, T.fails + i * 0.18, 0.4) * (1 - ramp(t, T.veto, T.veto + 1));
      s.visible = sc > 0.002; s.scale.setScalar(Math.max(0.0001, sc));
    });

    // ---------- vault + coins
    const resK = [0, 1, 2].map((i) => ramp(t, T.reserve + i * 0.16, T.reserve + 0.9 + i * 0.16, E.inOut));
    const backK = [0, 1, 2].map((i) => ramp(t, T.settle + 0.2 + i * 0.16, T.settle + 1.1 + i * 0.16, E.inOut));
    const inVault = COIN_N - (t > T.reserve ? 3 : 0) + (t > T.settle + 1.1 ? 2 : 0) + (t > T.settle + 1.3 ? 0 : 0);
    vaultCoins.count = inVault;
    movers.forEach((m, i) => {
      const from = coinSlot(COIN_N - 1 - i), trayP = [16.6 + i * 0.42, 1.2 + 0.0, -8.6];
      if (t < T.reserve || (i < 2 && backK[i] >= 1)) { m.visible = false; return; }
      m.visible = true;
      let p = [lerp(from[0], trayP[0], resK[i]), lerp(from[1], trayP[1], resK[i]) + Math.sin(resK[i] * Math.PI) * 1.4, lerp(from[2], trayP[2], resK[i])];
      if (t > T.settle) {
        if (i < 2) { const k = backK[i]; p = [lerp(trayP[0], from[0], k), lerp(trayP[1], from[1], k) + Math.sin(k * Math.PI) * 1.4, lerp(trayP[2], from[2], k)]; }
        else { const k = backK[2]; p = [lerp(trayP[0], LX + 2.4, k), lerp(trayP[1], 5.9, k) + Math.sin(k * Math.PI) * 0.8, lerp(trayP[2], LZ + 0.2, k)]; m.scale.setScalar(Math.max(0.001, 1 - ramp(t, T.settle + 0.9, T.settle + 1.4))); }
      }
      m.position.set(...p); m.rotation.set(Math.PI / 2 * Math.sin(resK[i] * Math.PI) * 0.6, t * 3, 0);
    });
    domeRing.material.color.setHex(GOLD).multiplyScalar(2 + 2 * win(t, T.reserve, T.reserve + 1.2, 0.2, 0.6) + 2 * win(t, T.settle, T.settle + 1.4, 0.2, 0.6));

    // ---------- envelope assembly → scale → check → pad → up the beam
    envParts.forEach(({ p, i }) => {
      const a = T.env + 0.2 + i * 0.25, k = ramp(t, a, a + 0.6, E.back), merge = ramp(t, T.env + 1.6, T.env + 2.1, E.in);
      const home = [EA.x - 1.9 + i * 1.9, EA.y + 0.35, EA.z];
      p.visible = t > a && merge < 1;
      p.position.set(lerp(home[0], EA.x, merge), lerp(home[1], EA.y, merge), EA.z);
      p.scale.setScalar(Math.max(0.001, k * (1 - merge * 0.8)));
    });
    const weigh = ramp(t, T.weigh + 0.3, T.weigh + 1.0, E.back) * (1 - ramp(t, T.check - 0.2, T.check + 0.4));
    beamPivot.rotation.z = 0.2 * weigh;
    pans.forEach(({ p, s }) => { p.position.set(s * 1.15 * Math.cos(beamPivot.rotation.z), 2.25 + s * 1.15 * Math.sin(beamPivot.rotation.z) - 0.75, 0); });
    {
      const panL = V(20.4 - 1.15 * Math.cos(beamPivot.rotation.z), 2.25 - 1.15 * Math.sin(beamPivot.rotation.z) - 0.75 + 0.42, -5.2);
      let p = V(EA.x, EA.y, EA.z), s = 0, rot = t * 0.6;
      const born = pop(t, T.env + 1.9, 0.35);
      s = born;
      const k1 = ramp(t, T.weigh, T.weigh + 0.5, E.inOut); p.lerp(panL, k1);
      if (t > T.weigh + 0.5) p.copy(panL);
      const k2 = ramp(t, T.check - 0.1, T.check + 0.8, E.inOut); p.lerp(V(24.2, 1.4, -5.8), k2);
      const k3 = ramp(t, T.check + 1.2, T.send - 0.2, E.inOut); p.lerp(V(27, 0.9, -8), k3);
      const up = ramp(t, T.send, T.cloud, E.inOut);
      if (up > 0) { const c = wBeam.userData.curve.getPointAt(up); p.set(c.x, c.y + 0.5, c.z); s *= 1 + up * 0.6; }
      if (t > T.cloud) s = 0;
      envelope.visible = s > 0.002; envelope.scale.setScalar(Math.max(0.0001, s));
      envelope.position.copy(p); envelope.quaternion.copy(tmpQ); envBox.rotation.y = Math.sin(rot) * 0.2;
      envHalo.material.opacity = 0.5 + 0.4 * win(t, T.send, T.cloud, 0.2, 0.3);
    }
    cgateLight.material.color.setHex(t > T.check + 0.5 ? PAL.ok : PAL.bad).multiplyScalar(2.4);
    lpad.material.opacity = 0.5 + 0.5 * win(t, T.send - 0.6, T.send + 1.0, 0.2, 0.6) + 0.5 * win(t, T.back + 1.0, T.back + 2.2, 0.2, 0.6);

    // ---------- OpenAI cloud
    const proc = win(t, T.cloud - 0.2, T.back + 0.3, 0.3, 0.3);
    [oaIsland, tgIsland, apIsland].forEach((g, gi) => g.userData.rings.forEach((r, i) => { r.rotation.z = t * (0.3 + i * 0.2) * (gi === 0 ? 1 + proc * 6 : 1); }));
    oaLogo.userData.slab.material.emissiveIntensity = 0.25 + proc * (1.2 + 0.6 * Math.sin(t * 18));
    // response back down
    {
      const d = ramp(t, T.back, T.back + 1.8, E.inOut);
      const c = wBeam.userData.curve.getPointAt(1 - d);
      jsonTile.visible = t > T.back && t < T.settle + 0.6;
      jsonTile.position.set(c.x, c.y + 0.9, c.z);
      jsonTile.scale.setScalar(Math.max(0.0001, pop(t, T.back, 0.3) * (1 - ramp(t, T.settle, T.settle + 0.6))));
      crystals.forEach((g, i) => {
        const fan = ramp(t, T.back + 1.8, T.back + 2.5, E.backBig);
        let p = [c.x + (i - 1) * 0.7 * (1 - fan), c.y + 0.3 - i * 0.2, c.z];
        const home = [26 + i * 1.1, 2.4 + (i % 2) * 0.3, -6.2];
        p = [lerp(p[0], home[0], fan), lerp(p[1], home[1], fan), lerp(p[2], home[2], fan)];
        const toB = ramp(t, T.member, T.member + 1.0, E.inOut);
        p = [lerp(p[0], 29.8 + i * 1.8, toB), lerp(p[1], 7.8, toB), lerp(p[2], -10.8, toB)];
        const toV = ramp(t, T.fails - 0.6, T.fails + 0.2, E.inOut);
        p = [lerp(p[0], 31.5 + i * 0.7, toV), lerp(p[1], 1.4, toV), lerp(p[2], -2.6 + i * 0.6, toV)];
        const go = ramp(t, T.veto - 1.4 + i * 0.2, T.veto + 0.4 + i * 0.2, E.inOut);
        p = [lerp(p[0], 37, go), lerp(p[1], 1.4, go), lerp(p[2], 0, go)];
        g.visible = t > T.back + 0.2 && go < 1;
        g.position.set(p[0], p[1] + Math.sin(t * 2 + i) * 0.08, p[2]);
        g.userData.c.rotation.y = t * 1.4 + i;
        g.scale.setScalar(Math.max(0.001, pop(t, T.back + 0.2 + i * 0.1, 0.3)));
      });
    }
    usage.forEach(({ b, h }, i) => { const k = ramp(t, T.settle + 0.1 + i * 0.12, T.settle + 0.8 + i * 0.12, E.out) * (1 - ramp(t, T.member, T.member + 0.5)); b.visible = k > 0.001; b.scale.set(1, Math.max(0.001, h * k), 1); });
    // ledger
    ledgerBg.material.opacity = 0.85 * win(t, T.reserve, T.fails, 0.4, 0.5);
    const lr = (m, a, b) => { m.material.opacity = win(t, a, b, 0.25, 0.3); m.visible = m.material.opacity > 0.001; };
    lr(L1a, T.reserve + 0.5, T.settle + 0.5); lr(L1b, T.settle + 0.5, T.fails);
    L2.forEach((m, i) => lr(m, T.member + 1.9 + i * 1.1, T.fails));
    lr(L5, T.member + 5.0, T.fails);
    // membership tiles
    {
      const col = new THREE.Color();
      for (let i = 0; i < 150; i++) {
        const c = i % 15, batch = Math.floor(c / 5);
        const t0 = T.member + 1.0 + batch * 1.1 + (Math.floor(i / 15) + (c % 5)) * 0.03;
        const on = ramp(t, t0, t0 + 0.25);
        const k = tileKind[i];
        col.copy(tileBase).lerp(k === 1 ? cSup : k === 2 ? cCon : cSkip, on);
        tiles.setColorAt(i, col);
      }
      tiles.instanceColor.needsUpdate = true;
      const bIdx = clamp(Math.floor((t - T.member - 0.9) / 1.1), 0, 2);
      batchFrame.position.x = 29.4 + (bIdx * 5 + 2) * 0.34;
      batchFrame.visible = t > T.member + 0.8 && t < T.member + 4.4;
    }

    // ---------- rule workshop
    const shopOn = ramp(t, T.rules - 0.6, T.rules + 0.4);
    gears.forEach((g) => { g.rotation.z = Math.max(0, t - T.rules + 0.6) * g.userData.sp * (0.2 + shopOn * 0.8); });
    const st2 = t - T.rules - 0.6;
    ram2.position.y = 2.2 - (st2 > 0 && st2 < 3.4 ? Math.pow(Math.abs(Math.sin(st2 * Math.PI / 0.85)), 6) : 0) * 1.3;
    ruleCrystals.forEach((g, i) => {
      const born = T.rules + 1.0 + i * 0.85;
      const b = ramp(t, born, born + 0.5, E.backBig);
      let x = lerp(25, 18.6 + i * 1.6, ramp(t, born, born + 0.9, E.out)), y = lerp(0.6, 2.2, b), z = lerp(10, 11.6, b);
      const r = ramp(t, T.veto - 1.8 + i * 0.25, T.veto + 0.4 + i * 0.25, E.inOut);
      if (r > 0) { const c = backRU.userData.curve.getPointAt(Math.min(1, r)); x = lerp(x, c.x, Math.min(1, r * 3)); y = lerp(y, 0.8, Math.min(1, r * 3)); z = lerp(z, c.z, Math.min(1, r * 3)); }
      g.visible = b > 0.01 && r < 1;
      g.position.set(x, y + Math.sin(t * 2.4 + i) * 0.06, z);
      g.userData.c.rotation.y = t * 1.2 + i; g.userData.ip.quaternion.copy(tmpQ);
      g.scale.setScalar(Math.max(0.001, b));
    });

    // ---------- veto panels
    vetoCurtain.material.opacity = win(t, T.veto, T.listing, 0.4, 0.6) * (0.1 + 0.08 * Math.sin(t * 8));
    const vA = win(t, T.verbatim + 0.2, T.para, 0.4, 0.3), hiK = ramp(t, T.verbatim + 0.9, T.verbatim + 1.2);
    quoteSrc.material.opacity = vA * (1 - hiK); quoteHiP.material.opacity = vA * hiK;
    const pv = win(t, T.para, T.judge, 0.3, 0.3);
    const shake = t > T.para + 0.8 && t < T.para + 1.2 ? Math.sin((t - T.para) * 60) * 0.06 : 0;
    para.material.opacity = pv; para.position.x = PX + shake;
    const jA = win(t, T.judge, T.metrics, 0.3, 0.3), jK = ramp(t, T.judge + 1.0, T.judge + 1.3);
    judge0.material.opacity = jA * (1 - jK); judge1.material.opacity = jA * jK;
    const mA = win(t, T.metrics, T.listing, 0.3, 0.4);
    metric.material.opacity = mA; wilsonTrack.material.opacity = mA; wilsonBar.material.opacity = mA;
    wilsonBar.scale.x = Math.max(0.001, 0.44 * ramp(t, T.metrics + 0.9, T.metrics + 1.8, E.out)); wilsonBar.position.x = PX - 2.1 + 2.1 * wilsonBar.scale.x;

    // ---------- listing + fact gate
    listDoc.material.opacity = win(t, T.listing - 0.6, T.watch - 2, 0.5, 0.5);
    {
      const s = ramp(t, T.listing + 0.6, T.listing + 2.6, E.inOut);
      lens.visible = t > T.listing + 0.4 && t < T.listing + 3.0;
      lens.position.set(52.4 + Math.sin(s * Math.PI * 3) * 1.6, 5.2 - s * 1.8, -2.2 - Math.sin(s * Math.PI * 3) * 0.3);
    }
    const open = ramp(t, T.open, T.open + 0.8, E.inOut);
    const gateCol = open > 0.02 ? PAL.ok : PAL.bad;
    gatePool.material.color.setHex(gateCol); gatePool.material.opacity = 0.3 * win(t, T.listing, T.watch - 1, 0.6, 0.8);
    doorMat.color.setHex(gateCol); doorMat.emissive.setHex(gateCol);
    doors.forEach((d) => { const a = GA, off = d.userData.s * (1.0 + open * 1.9); d.position.set(GX + Math.cos(a) * off, 2.0, 1.6 - Math.sin(a) * off); d.rotation.y = a;
      const dk = pop(t, T.listing - 0.8, 0.4); d.visible = dk > 0.002; d.scale.setScalar(Math.max(0.0001, dk)); });
    const dA = win(t, T.listing + 1.6, T.watch - 2, 0.4, 0.4);
    draft.material.opacity = dA;
    blank.material.opacity = dA * (1 - ramp(t, T.gate + 0.4, T.gate + 0.6)); filled.material.opacity = dA * ramp(t, T.gate + 0.5, T.gate + 0.7);
    // seller input
    const typed = (a, b, full) => full.slice(0, Math.round(full.length * ramp(t, a, b, E.lin)));
    void typed;
    inOke.material.opacity = win(t, T.type, T.reject + 0.05, 0.25, 0.05); inOke.scale.x = Math.max(0.001, ramp(t, T.type, T.type + 0.5));
    const rs = t > T.reject && t < T.reject + 0.4 ? Math.sin((t - T.reject) * 60) * 0.05 : 0;
    inOkeBad.material.opacity = win(t, T.reject, T.fact, 0.05, 0.3); inOkeBad.position.x = -57.2 + rs;
    inVal.material.opacity = win(t, T.fact, T.fact + 1.1, 0.25, 0.05); inVal.scale.x = Math.max(0.001, ramp(t, T.fact, T.fact + 0.9));
    inValOk.material.opacity = win(t, T.fact + 1.1, T.sendFact + 0.4, 0.05, 0.3);
    {
      // fact packet: laptop → web → api road → gate, camera chases it
      const u = ramp(t, T.sendFact, T.gate, E.inOut);
      let p;
      if (u < 0.34) { const c = wSeller.userData.curve.getPointAt(u / 0.34); p = [c.x, c.y + 0.4, c.z]; }
      else if (u < 0.56) { const c = wWebApi.userData.curve.getPointAt((u - 0.34) / 0.22); p = [c.x, c.y + 0.4, c.z]; }
      else { const k = (u - 0.56) / 0.44; p = [lerp(-16, GX - 0.8, k), 1.8 + Math.sin(k * Math.PI) * 1.4, lerp(-0.6, 1.8, k)]; }
      factPkt.visible = t > T.sendFact && t < T.gate + 0.2;
      factPkt.position.set(...p); factPkt.scale.setScalar(Math.max(0.0001, pop(t, T.sendFact, 0.3) * (1 + 0.6 * Math.sin(u * Math.PI))));
      const fc = ramp(t, T.gate - 0.1, T.gate + 0.5, E.inOut);
      factCard.visible = t > T.gate - 0.1 && t < T.gate + 0.55;
      factCard.position.set(lerp(GX - 0.8, 51.3, fc), lerp(1.8, 2.5, fc) + Math.sin(fc * Math.PI) * 0.8, lerp(1.8, 3.9, fc)); factCard.scale.setScalar(lerp(1, 0.7, fc));
    }
    sCube.rotation.y = t * 0.6; sCube.position.y = 1.55 + Math.sin(t * 2) * 0.06 + Math.abs(Math.sin((t - T.acted) * 9)) * 0.3 * win(t, T.acted, T.acted + 1.2, 0.05, 0.3);
    sellerMat.emissiveIntensity = 0.12 + win(t, T.type - 0.2, T.sendFact + 0.5, 0.2, 0.4) * 0.5;
    // laptop screens: sources → needs fact → typed fact → ready → came back
    const lid = ramp(t, T.build + 0.6, T.build + 1.6, E.out);
    lap.userData.hinge.rotation.x = lerp(Math.PI / 2 - 0.05, -0.22, lid);
    const scr = (a, b) => win(t, a, b, 0.25, 0.25);
    sR1.material.opacity = scr(T.build + 0.8, T.whip1 + 0.6);
    sR4.material.opacity = scr(T.whip1 + 0.6, T.fact + 0.4);
    sR5.material.opacity = scr(T.fact + 0.4, T.whip2 + 0.6);
    sR6.material.opacity = scr(T.whip2 + 0.6, T.r7);
    sR7.material.opacity = t > T.r7 ? ramp(t, T.r7, T.r7 + 0.3) : 0;
    // phone
    phoneNote.material.opacity = ramp(t, T.phone, T.phone + 0.2);
    phone.position.x = -57.4 + (t > T.phone && t < T.phone + 0.9 ? Math.sin((t - T.phone) * 70) * 0.03 : 0);

    // ---------- watch
    dishPivot.rotation.y = t * 0.8;
    pings.forEach((p, i) => {
      const ph = ((t - T.watch) * 0.7 + i / 3) % 1, on = t > T.watch && t < T.outro;
      p.scale.setScalar(1 + ph * 5); p.material.opacity = on ? (1 - ph) * 0.6 : 0;
      p.material.color.setHex(t > T.reopen ? PAL.bad : PAL.ok).multiplyScalar(2);
    });
    tlBar.scale.x = Math.max(0.001, ramp(t, T.watch, T.watch + 0.8, E.out)); pin.scale.y = Math.max(0.001, pop(t, T.watch + 0.3, 0.3));
    const dropCard = (c, a, x, dim) => {
      const k = ramp(t, a, a + 1.0, E.out);
      c.visible = t > a && t < T.outro; c.position.set(x, lerp(9.5, 3.4, k), 0.5); c.rotation.set(-0.1, 0, lerp(0.5, 0, k)); c.scale.setScalar(1.0);
      c.userData.slab.material.color.setHex(dim && t > a + 1.2 ? 0x55554f : 0xcdc8bb);
    };
    dropCard(oldCard, T.old, 52.0, true); dropCard(lateCard, T.late, 57.2, false);
    monCrystal.material.color.setHex(t > T.reopen ? PAL.bad : PAL.ok); monCrystal.material.emissive.setHex(t > T.reopen ? PAL.bad : PAL.ok);
    monCrystal.rotation.y = t * 1.3;
    {
      const k1 = ramp(t, T.outbox + 0.6, T.tg, E.inOut), k2 = ramp(t, T.tg + 0.2, T.phone, E.inOut);
      let p;
      if (t < T.outbox + 0.6) p = V(59.4, 2.2, -3.4);
      else if (k1 < 1) { const c = wTg.userData.curve.getPointAt(k1); p = V(c.x, c.y + 0.5, c.z); }
      else { const c = wPhone.userData.curve.getPointAt(k2); p = V(c.x, c.y + 0.5, c.z); }
      note.visible = t > T.outbox + 0.4 && t < T.phone;
      note.position.copy(p); note.scale.setScalar(Math.max(0.0001, pop(t, T.outbox + 0.4, 0.3) * (1 + 1.6 * Math.sin(k2 * Math.PI))));
    }

    // ---------- pools, bursts
    const outroGlow = ramp(t, T.outro + 0.5, T.outro + 3);
    POOLS.forEach(({ h, a }) => { h.material.opacity = 0.22 * ramp(t, a, a + 1.2) + 0.12 * outroGlow; });
    bursts.forEach(({ bt, p, parts: ps }) => {
      const d = t - bt;
      ps.forEach((m, i) => {
        m.visible = d > 0 && d < 1.1; if (!m.visible) return;
        const k = 1 - Math.pow(1 - Math.min(1, d / 1.1), 3);
        m.position.set(p[0] + m.userData.d.x * k, p[1] + m.userData.d.y * k - 0.8 * d * d, p[2] + m.userData.d.z * k);
        m.scale.setScalar(Math.max(0.001, 1 - d / 1.1)); m.rotation.set(d * 8 + i, d * 6, 0);
      });
    });

    S.render();
  }

  return { render, T };
}
