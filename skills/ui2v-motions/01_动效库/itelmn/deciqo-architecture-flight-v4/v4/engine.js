// Renderer, post-processing and the hf-seek wiring shared by the v3 film.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { PAL } from "./kit.js";

export function createStage(canvas, W = 1920, H = 1080) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAL.bg);
  scene.fog = new THREE.FogExp2(PAL.bg, 0.028);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.4;

  const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 400);
  camera.position.set(0, 4, 12);

  const hemi = new THREE.HemisphereLight(0xc9c2ff, 0x14121f, 0.5);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff4ea, 2.0);
  key.position.set(6, 12, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -14; key.shadow.camera.right = 14; key.shadow.camera.top = 14; key.shadow.camera.bottom = -14;
  key.shadow.camera.near = 1; key.shadow.camera.far = 60;
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  key.shadow.radius = 6;
  scene.add(key); scene.add(key.target);
  const rim = new THREE.DirectionalLight(0x8b6cff, 1.4);
  rim.position.set(-8, 5, -10);
  scene.add(rim);

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(1);
  composer.setSize(W, H);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.55, 0.5, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const look = new THREE.Vector3();
  function aim(pos, target, fov) {
    camera.position.set(pos[0], pos[1], pos[2]);
    look.set(target[0], target[1], target[2]);
    camera.lookAt(look);
    if (fov && camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
  }
  // keep the shadow frustum centred on what the camera looks at
  function shadowFollow(x, z) {
    key.position.set(x + 6, 12, z + 8);
    key.target.position.set(x, 0, z);
  }

  return { renderer, scene, camera, composer, bloom, key, rim, hemi, aim, shadowFollow, render: () => composer.render() };
}

// Wire a pure render(t) to HyperFrames seeking.
export function drive(render) {
  let last = -1;
  const go = (t) => { if (t === last) return; last = t; render(t); };
  window.addEventListener("hf-seek", (e) => go(e.detail.time));
  go(window.__hfThreeTime || 0);
}
