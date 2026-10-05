// Loads tegaki + every bundle the promo needs, then attaches each bundle
// to its <tegaki-renderer data-bundle="..."> element.
//
// We use dynamic `import()` (not static `import`) because HyperFrames'
// `bundleToSingleHtml` step inlines every external `<script src>` it sees,
// dropping the `type="module"` attribute in the process. Static imports
// would then throw "Cannot use import statement outside a module" at
// validate / inspect / render time. Dynamic `import()` is just a function
// call and runs fine in classic scripts.
//
// HyperFrames waits ~3s after `domcontentloaded` before sampling frames,
// which gives Promise.all below time to fetch every esm.sh module.

(async () => {
  const V = '0.17.1';
  const E = (p) => `https://esm.sh/tegaki@${V}${p}`;

  const [wcMod, shaperMod, caveat, italianno, tangerine, parisienne, suezOne, amiri, kleeOne] = await Promise.all([
    import(E('/wc')),
    // `?external=harfbuzzjs` keeps esm.sh from bundling the package (whose
    // node-polyfill aborts the wasm load). The shaper then emits bare
    // `import('harfbuzzjs/hb.js')` / `harfbuzzjs/hbjs.js` calls that the
    // document's <script type="importmap"> redirects to data-URL shims
    // re-exporting the harfbuzzjs classic-script globals.
    import(`${E('/shaper-harfbuzz')}?external=harfbuzzjs`).then((m) => m.default ?? m),
    import(E('/fonts/caveat')).then((m) => m.default),
    import(E('/fonts/italianno')).then((m) => m.default),
    import(E('/fonts/tangerine')).then((m) => m.default),
    import(E('/fonts/parisienne')).then((m) => m.default),
    import(E('/fonts/suez-one')).then((m) => m.default),
    import(E('/fonts/amiri')).then((m) => m.default),
    import(E('/fonts/klee-one')).then((m) => m.default),
  ]);

  const bundles = { caveat, italianno, tangerine, parisienne, suezOne, amiri, kleeOne };
  for (const b of Object.values(bundles)) wcMod.TegakiEngine.registerBundle(b);
  // Arabic + Hebrew need complex shaping (calt, RTL, joining); without a
  // shaper Tegaki falls back to the per-grapheme path which doesn't connect
  // strokes correctly.
  wcMod.TegakiEngine.registerShaper(shaperMod);
  wcMod.registerTegakiElement();
  window.__tegakiBundles = bundles;

  const wire = () => {
    for (const el of document.querySelectorAll('tegaki-renderer[data-bundle]')) {
      const bundle = bundles[el.dataset.bundle];
      if (bundle && el.font !== bundle) el.font = bundle;
      const fx = el.dataset.effects;
      if (fx) {
        try {
          el.effects = JSON.parse(fx);
        } catch {}
      }
    }
  };
  wire();
  new MutationObserver(wire).observe(document.body, { childList: true, subtree: true });
})();
