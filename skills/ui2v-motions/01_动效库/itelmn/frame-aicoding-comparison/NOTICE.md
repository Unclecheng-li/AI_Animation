# Attribution — frame-aicoding-comparison

**Original template** authored for this repo (AI Coding). Not vendored from
nexu-io/html-video.

## Design

A dark "head to head" comparison:

- Near-black canvas (#070d12) with a teal radial glow (top-left), a cool blue
  counter-glow and a masked grid — layered CSS `radial-gradient`s (no images).
- A pill badge, then a "X vs Y" headline whose two sides each use their own
  caller-chosen gradient (left + right), with "vs" muted in the middle.
- Two framed cards (translucent, rounded): a big gradient label, an optional
  emoji icon, and bullet lines. The winning side gets a teal-glow border + a
  gradient **WIN** badge.
- An optional stat row: one stat (gradient number + muted label) per side.

Caller controls per side: `from`/`to` gradient hex, `icon`, `label`, `bullets[]`,
`stat`, `stat_label`, `win`. Pure CSS `@keyframes`. Be Vietnam Pro (Vietnamese).
16:9 = `index.html`, 9:16 = `compositions/portrait.html`.
