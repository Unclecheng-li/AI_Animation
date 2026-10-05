# Third-party content

Everything in this repository is MIT-licensed (see [`LICENSE`](LICENSE)) except where
noted below. Each entry names what was taken, from where, and under which licence.

## diagram-design

- **License:** MIT — Copyright (c) 2025 Cathryn Lavery
- **Upstream:** https://github.com/cathrynlavery/diagram-design
- **Used in:** `skills/prettier-svg-docs/reference/diagrams.md`,
  `diagram-grammar.md`, `diagram-patterns.md`, `annotation.md`, `types/<slug>.md`,
  the `diagram` check class in `scripts/svg_check.py`, and the type budgets in
  `scripts/diagrams.json`.

What was taken is the **structural** layer: the 27-type taxonomy and its selection
rule, the seven semantic patterns, the connector grammar, the layout grid, the
complexity budgets, and the label-geometry check in `scripts/verify-geometry.py`.

What was **not** taken, and why: upstream emits self-contained HTML and states that an
SVG must never be hand-authored, while this skill's committed `.svg` is both the
artifact and its own source — so the HTML packaging, template variants, export dials
and summary cards are absent. Upstream's motion model is static-first with a
byte-pinned JavaScript controller; this skill requires a seamless CSS loop and forbids
`<script>` in a committed SVG, so `references/animation.md` contributes exactly one
rule (never animate layout coordinates, connector routes, `viewBox`, node dimensions,
or semantic text). Upstream's Google Fonts link and fixed skin are replaced by system
font stacks and this repo's per-project derived palette.

The ported geometry check is **stricter** than its source rather than a copy: upstream
identifies a node by guessing that a `<rect>` is at least 60×40 and a label mask by
guessing 20–120 × 8–14, and its own ADR-0005 concedes those thresholds are shape-based.
Here the same defect is found exactly, from `data-node` and `data-label`.

## Icon set

The icons under `skills/prettier-svg-docs/assets/icons/` are redistributed from
diagram-design, which sourced them as follows.

| Source | License | Upstream |
| --- | --- | --- |
| Tabler Icons | MIT | https://github.com/tabler/tabler-icons |
| Simple Icons | CC0 1.0 Universal | https://github.com/simple-icons/simple-icons |
| log-z/logos | MIT | https://github.com/log-z/logos |
| Devicon | MIT | https://github.com/devicons/devicon |

Brand logos remain the trademarks of their respective owners. Their inclusion is for
documentation and illustrative use only, and does not imply endorsement, sponsorship,
or affiliation.
