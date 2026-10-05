// Qo — the Deciqo mascot. A rounded diamond with a glass face, floating hands and a hover jet.
// The rig is stateless: pose() writes every transform from the values passed in.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { PAL, canvasTex, clamp } from "./kit.js";

const MODE = { ai: PAL.ai, rules: PAL.bone, seller: PAL.seller, ok: PAL.ok, bad: PAL.bad };

function diamondShape(r, round) {
  // rounded square rotated 45°: a diamond with soft corners
  const s = new THREE.Shape();
  const pts = [[0, r], [r, 0], [0, -r], [-r, 0]];
  for (let i = 0; i < 4; i++) {
    const p = pts[i], n = pts[(i + 1) % 4], pr = pts[(i + 3) % 4];
    const a = [p[0] + (pr[0] - p[0]) * round, p[1] + (pr[1] - p[1]) * round];
    const b = [p[0] + (n[0] - p[0]) * round, p[1] + (n[1] - p[1]) * round];
    if (i === 0) s.moveTo(a[0], a[1]); else s.lineTo(a[0], a[1]);
    s.quadraticCurveTo(p[0], p[1], b[0], b[1]);
  }
  s.closePath();
  return s;
}

export function createQo(scene) {
  const root = new THREE.Group();
  const hover = new THREE.Group();
  const body = new THREE.Group();
  root.add(hover); hover.add(body);

  const bodyMat = new THREE.MeshPhysicalMaterial({ color: PAL.ai, roughness: 0.35, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.18, emissive: new THREE.Color(PAL.ai), emissiveIntensity: 0.12 });
  const shell = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 0.66, 8, 0.26), bodyMat);
  shell.rotation.z = Math.PI / 4;
  shell.castShadow = true;
  body.add(shell);

  // glass visor
  const visorMat = new THREE.MeshPhysicalMaterial({ color: 0x061845, roughness: 0.08, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.03 });
  const visor = new THREE.Mesh(new THREE.ExtrudeGeometry(diamondShape(0.5, 0.3), { depth: 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 10 }), visorMat);
  visor.position.z = 0.3;
  body.add(visor);

  // eyes: emissive pills + happy arcs
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xeafff4 });
  eyeMat.color.multiplyScalar(2.2); // bloom
  const eyes = [], happy = [];
  for (const sx of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.CapsuleGeometry(0.052, 0.09, 6, 12), eyeMat);
    e.position.set(sx * 0.15, 0.04, 0.37);
    body.add(e); eyes.push(e);
    const h = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.026, 8, 20, Math.PI), eyeMat);
    h.position.set(sx * 0.15, 0.02, 0.37);
    h.visible = false;
    body.add(h); happy.push(h);
  }
  // cheeks
  const cheeks = [];
  const cheekMat = new THREE.MeshBasicMaterial({ color: 0xff7aa8, transparent: true, opacity: 0.55 });
  for (const sx of [-1, 1]) {
    const c = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), cheekMat);
    c.position.set(sx * 0.27, -0.09, 0.365);
    body.add(c); cheeks.push(c);
  }
  // antenna
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.24, 8), new THREE.MeshStandardMaterial({ color: 0x1b2a52, roughness: 0.4 }));
  stalk.position.y = 0.7;
  body.add(stalk);
  const bulbMat = new THREE.MeshBasicMaterial({ color: PAL.ai });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 16), bulbMat);
  bulb.position.y = 0.86;
  body.add(bulb);
  const bulbLight = new THREE.PointLight(PAL.ai, 0.5, 2.2, 2);
  bulb.add(bulbLight);

  // hands
  const handMat = bodyMat.clone();
  const hands = [-1, 1].map((sx) => {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 18), handMat);
    m.castShadow = true;
    g.add(m);
    g.userData.sx = sx;
    hover.add(g);
    return g;
  });

  // jet
  const jetTex = canvasTex(128, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.25, "rgba(190,215,255,0.8)"); g.addColorStop(1, "rgba(47,123,246,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(w * 0.2, 0); ctx.lineTo(w * 0.8, 0); ctx.lineTo(w * 0.5, h); ctx.closePath(); ctx.fill();
  });
  const jetMat = new THREE.MeshBasicMaterial({ map: jetTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: new THREE.Color(PAL.ai) });
  const jet = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.5), jetMat);
  jet.position.y = -0.98;
  body.add(jet);

  // ground shadow
  const shTex = canvasTex(128, 128, (ctx, w) => {
    const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, "rgba(0,0,0,0.75)"); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, w);
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  scene.add(root);
  const cA = new THREE.Color(), cB = new THREE.Color();

  // pose: every field optional
  function pose(t, o = {}) {
    const p = o.pos || [0, 1.4, 0];
    const bobAmp = o.bob ?? 0.07;
    const bob = Math.sin(t * 2.6) * bobAmp;
    root.position.set(p[0], p[1], p[2]);
    root.rotation.y = o.yaw ?? 0;
    root.scale.setScalar(o.scale ?? 1);
    root.visible = o.visible ?? true;
    hover.position.y = bob;
    hover.rotation.z = (o.lean ?? 0) + Math.sin(t * 1.3) * 0.03;
    hover.rotation.x = (o.pitch ?? 0);
    const sq = o.squash ?? 0; // + = squashed, - = stretched
    body.scale.set(1 + sq * 0.5, 1 - sq, 1 + sq * 0.5);
    body.rotation.y = o.turn ?? 0;
    body.rotation.z = o.spin ?? 0;

    // colour mode: blend between two modes
    const from = MODE[o.mode || "ai"], to = MODE[o.mode2 || o.mode || "ai"];
    cA.setHex(from); cB.setHex(to);
    const m = cA.clone().lerp(cB, clamp(o.modeMix ?? 0));
    bodyMat.color.copy(m); bodyMat.emissive.copy(m); handMat.color.copy(m); handMat.emissive.copy(m);
    bulbMat.color.copy(m).multiplyScalar(2.2); bulbLight.color.copy(m);
    jetMat.color.copy(m);

    // eyes
    const blinkT = o.blinkAt || [];
    let blink = 0;
    for (const b of blinkT) { const d = Math.abs(t - b); if (d < 0.09) blink = Math.max(blink, 1 - d / 0.09); }
    const lookX = o.lookX ?? 0, lookY = o.lookY ?? 0;
    const mood = o.mood || "idle";
    eyes.forEach((e, i) => {
      e.visible = mood !== "happy";
      const wide = mood === "wow" ? 1.35 : mood === "squint" ? 0.45 : 1;
      e.scale.set(wide, Math.max(0.06, (1 - blink) * wide * (o.eyesOpen ?? 1)), 1);
      e.position.x = (i ? 0.15 : -0.15) + lookX * 0.07;
      e.position.y = 0.04 + lookY * 0.06;
    });
    happy.forEach((h, i) => { h.visible = mood === "happy"; h.position.x = (i ? 0.15 : -0.15) + lookX * 0.07; });

    // hands: default float at the sides; o.hands = [[x,y,z],[x,y,z]] overrides (local space)
    hands.forEach((h, i) => {
      const def = [h.userData.sx * 0.78, -0.12 + Math.sin(t * 2.6 + i * 1.7) * 0.05, 0.12];
      const v = (o.hands && o.hands[i]) || def;
      h.position.set(v[0], v[1] + bob * 0.4, v[2]);
    });

    // parts pop in (hatching): hands, antenna, cheeks, jet
    const parts = o.parts ?? 1;
    const ps = Math.max(0.0001, parts);
    hands.forEach((h) => h.scale.setScalar(ps));
    stalk.scale.set(1, ps, 1); bulb.scale.setScalar(ps);
    cheeks.forEach((c) => c.scale.setScalar(ps));
    // jet
    const jetOn = (o.jet ?? 1) * parts;
    jet.scale.set(1, (0.75 + 0.25 * Math.sin(t * 37) * Math.sin(t * 23)) * jetOn, 1);
    jet.visible = jetOn > 0.01;
    bulbLight.intensity = 0.5 * (o.glow ?? 1) * parts;

    // shadow on ground
    const gy = o.ground ?? 0;
    const hgt = Math.max(0, p[1] + bob - gy);
    shadow.position.set(p[0], gy + 0.005, p[2]);
    const s = (o.scale ?? 1) * (1.1 - Math.min(0.5, hgt * 0.12));
    shadow.scale.setScalar(s);
    shadow.material.opacity = (o.visible ?? true) ? clamp(0.9 - hgt * 0.18, 0.15, 0.9) : 0;
  }

  return { root, hands, pose, body, shadow };
}
