<div align="center">

# AI Animation Skills

**A collection of [Agent Skills](https://support.claude.com/en/articles/12512176-what-are-skills) for generating cool HTML animations with AI · 一套用 AI 生成炫酷 HTML 动画的 Skill 集合**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](./LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](#contributing)
[![Skills count](https://img.shields.io/badge/Skills-7-orange?style=flat-square)](#skills-gallery)
[![Spec](https://img.shields.io/badge/Spec-SKILL.md-black?style=flat-square)](https://agentskills.io)

🌐 **中文版**: [`README.md`](README.md)

</div>

---

### Overview

This repository is a collection of **animation Skills** for AI agents such as WorkBuddy / Claude Code / Cursor. Each skill is a self-contained folder containing `SKILL.md` (agent instructions), `README.md` (human docs), `references/` (prompt references) and `assets/` (template HTML). Once installed, the AI agent auto-activates the matching skill based on your description and generates a complete single-file HTML animation.

One sentence is all it takes:
- 📊 **PPT-style presentations** — explainers, tech walkthroughs, video companions
- 📈 **Flowcharts / principle demos** — flowcharts, concept maps, comparisons, sequence diagrams, AI model visualizations
- 🌐 **Network protocol visualization** — TCP/IP, IPv4, Ethernet frames, routing, DHCP, and more
- 🏗️ **Dynamic architecture diagrams** — system architecture, flowcharts, sequence diagrams, data flow, state machines, with flowing animations + multi-format export
- 📝 **Scholar notes** — beautiful handwritten-notebook-style HTML study notes, two template styles
- 🎴 **Card theater** — sidebar narrative + 3D card carousel for protocol flows / product features / step-by-step explainers
- 🎬 **Video shot demos** — cinematic "one HTML per shot" demo animations: 29 rotating styles, camera pushes, WebAudio SFX — fullscreen-record it and it's a finished film

<div align="center">

**👇 Click a preview image to jump to the skill**

</div>

<table>
<tr>
<td width="25%" valign="top" align="center">
<a href="#ppt-animation"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/a6576e08-210b-4fda-867c-c0bd1a847d13" /></a>
<br/><a href="#ppt-animation"><strong>ppt-animation</strong></a>
<br/><sub>PPT slides / flip animations</sub>
</td>
<td width="25%" valign="top" align="center">
<a href="#flowchart"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/90414d79-80a5-47bc-bc5b-ee567160d021" /></a>
<br/><a href="#flowchart"><strong>flowchart</strong></a>
<br/><sub>Flowcharts / concept maps</sub>
</td>
<td width="25%" valign="top" align="center">
<a href="#network-protocol-viz"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/39d12d3d-3c15-4e83-b2f4-0186fc9e5e2e" /></a>
<br/><a href="#network-protocol-viz"><strong>network-protocol-viz</strong></a>
<br/><sub>Network protocols / packets</sub>
</td>
<td width="25%" valign="top" align="center">
<a href="#dynamic-archify"><img width="2537" height="1440" alt="image" src="https://github.com/user-attachments/assets/61e42d50-1dfb-487a-9e5a-29e956a10e7f" /></a>
<br/><a href="#dynamic-archify"><strong>dynamic-archify</strong></a>
<br/><sub>Architecture / sequence / dataflow</sub>
</td>
</tr>
<tr>
<td colspan="2" width="50%" valign="top" align="center">
<a href="#scholar-notes"><img width="2534" height="1440" alt="image" src="https://github.com/user-attachments/assets/e7bd4d61-37d3-4c5c-b47a-94114f609aa3" /></a>
<br/><a href="#scholar-notes"><strong>scholar-notes</strong></a>
<br/><sub>Handwritten notebook style</sub>
</td>
<td colspan="2" valign="top" align="center">
<a href="#card-theater"><img width="2560" height="1440" alt="card-theater" src="https://github.com/user-attachments/assets/51ace25a-fde6-45db-97f5-3c30582fb85f" /></a>
<br/><a href="#card-theater"><strong>card-theater</strong></a>
<br/><sub>Card theater / 3D card carousel</sub>
</td>
</tr>
<tr>
<td colspan="4" valign="top" align="center">
<a href="#video-shot-demos"><img width="2560" height="1440" alt="video-shot-demos" src="https://github.com/user-attachments/assets/ee93829f-91c5-48df-925e-342cd2be4557" /></a>
<br/><a href="#video-shot-demos"><strong>video-shot-demos</strong></a>
<br/><sub>Cinematic per-shot demo animations</sub>
</td>
</tr>
</table>

---

### Skills Gallery

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `ppt-animation`

<a href="./skills/ppt-animation">
<img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/221ac125-02f7-4bac-b179-25085034ff67" />
</a>

**Category:** PPT slides / flip animations
**For:** video recording, tech explainers, teaching demos, live-stream courseware — anywhere you need "PPT page flips + elements easing in one by one".

`ppt-animation` generates PPT-style single-file HTML slide presentations. After each page flip, on-page elements ease in one after another. Ships with dark-tech, warm newspaper, clean white, cyberpunk red-orange, and gradient dark themes. Navigate with keyboard / scroll wheel / click; fits fullscreen playback and screen recording.

Highlights:
- 16:9 aspect ratio, fits fullscreen playback and recording
- Elements ease in sequentially after each flip (down to individual lines of text)
- 5 built-in themes: `dark-tech` / `warm-paper` / `clean-white` / `cyber-red` / `gradient-dark`
- Core concepts shown with graphical elements (charts, flow diagrams, sketches) — no external images needed
- Rebuild on top of an existing template (`演示以上内容 using assets/xxx.html as the template`)

<table>
<tr>
<td align="center" width="20%"><a href="./skills/ppt-animation/README.md#主题画廊"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/dbc2ddbc-3ec9-4d3e-892c-59e04f629124" /></a><br /><sub><code>dark-tech</code><br />Dark tech</sub></td>
<td align="center" width="20%"><a href="./skills/ppt-animation/README.md#主题画廊"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/939788e1-3a77-451f-84de-aa10fb2f4c4c" /></a><br /><sub><code>warm-paper</code><br />Warm newspaper</sub></td>
<td align="center" width="20%"><a href="./skills/ppt-animation/README.md#主题画廊"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/30601c48-32c4-42ab-86a3-2699a3e01a58" /></a><br /><sub><code>clean-white</code><br />Clean white</sub></td>
<td align="center" width="20%"><a href="./skills/ppt-animation/README.md#主题画廊"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/8829f50c-2162-4c7b-a8ea-aac458962112" /></a><br /><sub><code>cyber-red</code><br />Cyberpunk red-orange</sub></td>
<td align="center" width="20%"><a href="./skills/ppt-animation/README.md#主题画廊"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/e5cdadf4-b0fd-41d2-90d8-3f12e63e2ec8" /></a><br /><sub><code>gradient-dark</code><br />Gradient dark</sub></td>
</tr>
</table>

<sub>↑ The 5 themes — <a href="./skills/ppt-animation/README.md#主题画廊"><b>open the full gallery</b></a> for previews and use cases.</sub>

Links: [README](./skills/ppt-animation/README.md) · [SKILL.md](./skills/ppt-animation/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `flowchart`

<a href="./skills/flowchart">
<img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/0cefab32-b583-4342-b25d-39b5b8c4bf83" />
</a>

**Category:** Flowcharts / concept maps / principle demos
**For:** video explainers, tech walkthroughs, PPT illustrations — animated flowcharts, concept comparisons, and principle demos.

`flowchart` generates animated HTML for educational flowcharts and principle demos. Dark tech style with glowing nodes, flowing arrows, and data particles. Not just AI models — any concept, process, comparison, or interaction can be animated. Complements `dynamic-archify`: flowchart leans educational (beautiful + intuitive), dynamic-archify leans engineering (precise + exportable).

Highlights:
- 7 chart types: flowchart / concept map / principle demo / sequence diagram / comparison / timeline / system overview
- Full AI/ML model visualizations preserved (RNN / LSTM / GRU / MLP / Word2Vec / GPU)
- Dark tech style: deep background + blue/purple/orange gradient nodes + glow
- Flowing connection lines + data particles keep the page alive
- Three interaction modes: autoplay / manual stepping / hover highlight

<table>
<tr>
<td align="center" width="25%"><a href="./skills/flowchart/README.md#支持的图表类型"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/4c6fcc04-7b36-4a65-87a1-b6eb01949179" /></a><br /><sub><code>RNN</code><br />RNN flow</sub></td>
<td align="center" width="25%"><a href="./skills/flowchart/README.md#支持的图表类型"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/267231a2-2b93-4e55-bfb2-577c2a73927f" /></a><br /><sub><code>LSTM</code><br />LSTM flow</sub></td>
<td align="center" width="25%"><a href="./skills/flowchart/README.md#支持的图表类型"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/90645354-939c-444c-becd-2dd2a12b4f6d" /></a><br /><sub><code>GPU</code><br />Architecture</sub></td>
<td align="center" width="25%"><a href="./skills/flowchart/README.md#支持的图表类型"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/80bcb567-21a0-4e49-a51e-6723ace3eb1e" /></a><br /><sub><code>Flowchart</code><br />Attack chain / workflow</sub></td>
</tr>
</table>

<sub>↑ Selected previews — <a href="./skills/flowchart/README.md#支持的图表类型"><b>see the full chart type list</b></a>.</sub>

Links: [README](./skills/flowchart/README.md) · [SKILL.md](./skills/flowchart/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `network-protocol-viz`

<a href="./skills/network-protocol-viz">
<img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/c4ca2b15-08c4-4d2f-9277-cf53369f7884" />

</a>

**Category:** Network protocols / packet demos
**For:** networking courses, security education, tech talks — dynamically showing protocol interactions, packet structures, and routing.

`network-protocol-viz` generates dynamic HTML pages visualizing how network protocols work. The visualization mode is chosen automatically per protocol: packet/frame structures become layered rectangles with hover field notes; interactions become client/server sequence diagrams with flowing packets; routing becomes a topology with path animations. Play/pause/reset controls are always included.

Highlights:
- Supports TCP/IP / IPv4 / Ethernet frames / routing / switches / DHCP / HTTPS / PPP and more
- Three visualization modes: structure expansion / sequential interaction / topology forwarding
- Protocol layer color coding: physical (gray) / link (blue) / network (green) / transport (orange) / application (purple)
- Packets flow along paths with glowing trails
- Security-education mode: a disclaimer is added at the bottom automatically

<table>
<tr>
<td align="center" width="25%"><a href="./skills/network-protocol-viz/README.md#协议列表"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/d662e835-b5ef-4b10-8868-d5cb80e988ee" />
</a><br /><sub><code>TCP</code><br />PPP frame structure</sub></td>
<td align="center" width="25%"><a href="./skills/network-protocol-viz/README.md#协议列表"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/8df81e98-25d0-4260-b0b5-79de5ece3a15" /></a><br /><sub><code>IPv4</code><br />IPv4 datagram 3D</sub></td>
<td align="center" width="25%"><a href="./skills/network-protocol-viz/README.md#协议列表"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/467041cb-875f-44e1-b13c-6cab35b89f80" /></a><br /><sub><code>Routing</code><br />HTTPS app-layer crypto</sub></td>
<td align="center" width="25%"><a href="./skills/network-protocol-viz/README.md#协议列表"><img width="2531" height="1440" alt="image" src="https://github.com/user-attachments/assets/9f9c0069-30fc-479b-a40f-dc21c96659e6" /></a><br /><sub><code>HTTPS</code><br />DHCP ACK message</sub></td>
</tr>
</table>

<sub>↑ Selected protocols — <a href="./skills/network-protocol-viz/README.md#协议列表"><b>see the full protocol list</b></a>.</sub>

Links: [README](./skills/network-protocol-viz/README.md) · [SKILL.md](./skills/network-protocol-viz/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `dynamic-archify`

<a href="./skills/dynamic-archify">
<img width="2535" height="1440" alt="image" src="https://github.com/user-attachments/assets/a7d16dc3-a01b-4762-89e5-065ffb144be5" />
</a>

**Category:** Animated architecture / workflow / sequence / dataflow / state diagrams
**For:** technical docs, system design reviews, security analysis, CI/CD visualization — professional diagrams (with flowing animations + multi-format export).

`dynamic-archify` generates professional single-file HTML diagrams with inline SVG, dark/light theme switching, flowing connection lines, and glowing particles moving along paths. Accepts natural language descriptions or pasted Mermaid code and lays everything out from scratch. Five diagram types are supported: architecture, workflow, sequence, dataflow, and state machine. Ships with a Node.js renderer + JSON Schema validation, plus a manual SVG mode for environments without Node.

Highlights:
- 5 diagram types: `architecture` / `workflow` / `sequence` / `dataflow` / `lifecycle`
- Automatic flowing animations: CSS `stroke-dasharray` flow + SVG particles along paths, speed auto-tuned per connection type
- Dark/light theme toggle (persisted to `localStorage`, respects `prefers-color-scheme`)
- One-click export: PNG / JPEG / WebP / SVG / animated GIF / WebM video
- Accepts Mermaid input, auto-maps it to a diagram type and relayouts
- CSS variable color system with semantic component types (frontend/backend/database/cloud/security/queue/external)

<table>
<tr>
<td align="center" width="20%"><a href="./skills/dynamic-archify/README.md#支持的图表类型"><img width="2537" height="1440" alt="image" src="https://github.com/user-attachments/assets/e2ce7b4f-356a-4f99-93d1-bd391eafbea2" /></a><br /><sub><code>architecture</code><br />System architecture</sub></td>
<td align="center" width="20%"><a href="./skills/dynamic-archify/README.md#支持的图表类型"><img width="2533" height="1440" alt="image" src="https://github.com/user-attachments/assets/b2435e86-04b3-4825-83b8-122fd8c6490a" /></a><br /><sub><code>workflow</code><br />Workflow</sub></td>
<td align="center" width="20%"><a href="./skills/dynamic-archify/README.md#支持的图表类型"><img width="2535" height="1440" alt="image" src="https://github.com/user-attachments/assets/d8acd7f3-7a93-4c4d-a4b9-a42e6264b909" /></a><br /><sub><code>sequence</code><br />Sequence</sub></td>
<td align="center" width="20%"><a href="./skills/dynamic-archify/README.md#支持的图表类型"><img width="2537" height="1440" alt="image" src="https://github.com/user-attachments/assets/e400f2a4-2eb6-4be5-ac6b-18c49b353060" /></a><br /><sub><code>dataflow</code><br />Data flow</sub></td>
<td align="center" width="20%"><a href="./skills/dynamic-archify/README.md#支持的图表类型"><img width="2536" height="1440" alt="image" src="https://github.com/user-attachments/assets/26dcdd9e-0c93-40a8-a7fc-42032f0e68a7" /></a><br /><sub><code>lifecycle</code><br />State machine</sub></td>
</tr>
</table>

<sub>↑ The 5 diagram types — <a href="./skills/dynamic-archify/README.md#支持的图表类型"><b>see full details</b></a>.</sub>

Links: [README](./skills/dynamic-archify/README.md) · [SKILL.md](./skills/dynamic-archify/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `scholar-notes`

<a href="./skills/scholar-notes">
<img width="2538" height="1440" alt="image" src="https://github.com/user-attachments/assets/bcdacd28-6e36-4d72-b493-8aee513630b3" />
</a>

**Category:** Handwritten notebook-style HTML
**For:** tech notes, vulnerability analysis, security research, knowledge summaries, class notes — turning technical content into beautiful notebook-style pages.

`scholar-notes` generates handwritten-notebook-style single-file HTML study notes. Two template styles: Style A (cream lined paper + spiral binding + tape/coffee-stain decorations, for general tech notes) and Style B (leather cover + metal ring binding + page-flip interaction, for attack-chain analyses and vulnerability notes). Rich built-in components: flowcharts, comparison boxes, attack chains, code blocks, sticky notes, and more. All icons use flat UI libraries (Lucide / Remix Icon) — emoji are banned.

Highlights:
- Two template styles: `Style A` (scholar notebook / single-page scroll) / `Style B` (journal leather book / flip interaction)
- Handwriting-feel fonts: Kalam + Patrick Hand + Zeyada / Ma Shan Zheng
- Rich components: flowcharts / comparison boxes / attack chains / code blocks / sticky notes / warning boxes / concept cards
- Color coding: red = warning/emphasis, blue = info/terms, green = safe/positive, purple = tech/code
- Strict quality constraints: no emoji, content fits the cover, checklist self-review

<table>
<tr>
<td align="center" width="50%"><a href="./skills/scholar-notes/README.md#两种风格"><img width="2540" height="1440" alt="image" src="https://github.com/user-attachments/assets/5eff500a-3653-4a98-bdcf-1896a5721621" /></a><br /><sub><code>Style A</code><br />Scholar notebook</sub></td>
<td align="center" width="50%"><a href="./skills/scholar-notes/README.md#两种风格"><img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/45fd6706-4cf1-4206-9159-d921213da1ca" /></a><br /><sub><code>Style B</code><br />Journal leather book</sub></td>
</tr>
</table>

<sub>↑ The two styles — <a href="./skills/scholar-notes/README.md#两种风格"><b>see full details</b></a>.</sub>

Links: [README](./skills/scholar-notes/README.md) · [SKILL.md](./skills/scholar-notes/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `card-theater`

<a href="./skills/card-theater">
<img width="2560" height="1440" alt="card-theater preview" src="https://github.com/user-attachments/assets/834e8f89-abff-4a20-82cf-bdeb1f0c5756" />
</a>

**Category:** Sidebar narrative + 3D card carousel
**For:** protocol flow demos, product feature tours, step-by-step explainers — narrative-style presentations with "sidebar commentary + 3D card carousel + mode switching".

`card-theater` generates demo animation HTML with a sidebar narrative plus a 3D card carousel. The left narrative column explains step by step while the right glass-morphism cards arrange in Coverflow / track / scroll layouts. Supports mode switching (dynamically inserting/removing cards), highlighter effects, and watermark icons. Five built-in templates: scroll 3D tilt, Apple aurora track, classic Coverflow, watermark edition, and focus edition.

Highlights:
- 5 built-in templates: `scroll-3d-tilt` / `apple-aurora-track` / `coverflow-classic` / `coverflow-watermark` / `coverflow-focus`
- Sidebar narrative: title + commentary + key points, synced with card switching
- Mode switching: dynamically insert/remove cards (e.g. transport mode ↔ tunnel mode) with transitions
- Highlighter: key fields of the selected card play a stroke-marking animation
- 3D interaction: Coverflow rotation / track panning / scroll paging / mouse tilt
- Navigate with ← → keys, mouse wheel, or clicks

<table>
<tr>
<td align="center" width="20%"><img width="2526" height="1440" alt="scroll-3d-tilt" src="https://github.com/user-attachments/assets/4191ddf3-7b9d-4f35-9ed3-ad4162da5c12" /></td>
<td align="center" width="20%"><img width="2560" height="1440" alt="apple-aurora-track" src="https://github.com/user-attachments/assets/09b2d9bc-c3a1-4914-9fb5-e9315cd4986a" /></td>
<td align="center" width="20%"><img width="2560" height="1440" alt="coverflow-classic" src="https://github.com/user-attachments/assets/d7ac9061-43b1-4f81-8ba7-bf4892015abe" /></td>
<td align="center" width="20%"><img width="2560" height="1440" alt="coverflow-watermark" src="https://github.com/user-attachments/assets/da0c020b-889a-4453-ba86-9b722442bbfc" /></td>
<td align="center" width="20%"><img width="2560" height="1440" alt="coverflow-focus" src="https://github.com/user-attachments/assets/ac9722fd-74e2-4cc9-b379-3223afd4063b" /></td>
</tr>
<tr>
<td align="center"><sub><code>scroll-3d-tilt</code><br />Scroll 3D tilt</sub></td>
<td align="center"><sub><code>apple-aurora-track</code><br />Apple aurora track</sub></td>
<td align="center"><sub><code>coverflow-classic</code><br />Classic Coverflow</sub></td>
<td align="center"><sub><code>coverflow-watermark</code><br />Watermark edition</sub></td>
<td align="center"><sub><code>coverflow-focus</code><br />Focus edition</sub></td>
</tr>
</table>

<sub>↑ The 5 templates — <a href="./skills/card-theater/README.md#5-种模板"><b>see full details</b></a>.</sub>

Links: [README](./skills/card-theater/README.md) · [SKILL.md](./skills/card-theater/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

#### `video-shot-demos`

<a href="./skills/video-shot-demos">
<img width="2560" height="1440" alt="video-shot-demos preview" src="https://github.com/user-attachments/assets/ee93829f-91c5-48df-925e-342cd2be4557" />
</a>

**Category:** Cinematic per-shot demo animations
**For:** video companion demos, screen-recording as finished films, tech write-up reenactments, product launch visuals — anywhere needing "one HTML per shot, rotating styles, camera moves, synced SFX".

`video-shot-demos` turns a video's storyboard into web animations you can fullscreen-record as finished footage: one shot = one standalone HTML. The whole series shares a cinematic player chassis (black-screen start + virtual clock + hover-to-reveal HUD + pause/replay), while every shot is created in a completely different visual style. Ships with 29 production-grade sample pages (vintage newspaper / convenience-store POS / pixel platformer / kung-fu manual / airport security…), 15 character emotion sprites, a WebAudio synthesized SFX engine, a camera scheduling system (push/pull/pan/follow + letterbox slow-mo), and a headless screenshot QA tool.

Highlights:
- Cinematic player: black-screen "start playback" intro; the hijacked virtual clock keeps CSS animations and JS cues in perfect sync — clean, glitch-free screen recordings
- Camera language: opening pull-back / key-moment push-in / follow shots / Ken Burns slow push / impact slams; slow-mo segments auto-dress with letterbox bars + vignette + millisecond counter
- WebAudio SFX: zero audio files, 6 primitives (pop/whoosh/swipe/type/ding/thud); camera moves automatically get a whoosh
- 29-style library: every style ships with font pairings, suitable content types, and a production-grade reference page — no two consecutive shots share a style
- Character close-ups: 15 emotion sprites picked per narrative beat, 400px closeups + speech bubbles easing in
- Caption bars aligned sentence-by-sentence with the voiceover script, keywords highlighted; source footnotes for data, cross-page score continuity
- Headless screenshot QA: fast-forward the virtual clock to any millisecond and capture frames to hunt for overlaps, occlusions, and animation glitches

<table>
<tr>
<td align="center" width="20%"><img width="2560" height="1440" alt="vintage newspaper headline" src="https://github.com/user-attachments/assets/ee93829f-91c5-48df-925e-342cd2be4557" /></td>
<td align="center" width="20%"><img width="2560" height="1440" alt="carnival slot machine" src="https://github.com/user-attachments/assets/cce72cdc-b63b-4c2e-ac90-cd25defff624" /></td>
<td align="center" width="20%"><img width="2560" height="1437" alt="pixel platformer" src="https://github.com/user-attachments/assets/1724eb62-98a6-488c-9353-9229d8cfbe35" /></td>
<td align="center" width="20%"><img width="2560" height="1440" alt="interrogation corkboard" src="https://github.com/user-attachments/assets/c2bce877-db80-44a9-993a-897432c58ae1" /></td>
<td align="center" width="20%"><img width="2560" height="1440" alt="airport security" src="https://github.com/user-attachments/assets/6906eeeb-e202-46cb-a3a2-b51d6eb9137e" /></td>
</tr>
<tr>
<td align="center"><sub><code>Vintage newspaper</code><br />Shocking numbers</sub></td>
<td align="center"><sub><code>Carnival slots</code><br />★ Camera showcase</sub></td>
<td align="center"><sub><code>Pixel platformer</code><br />★ Camera showcase</sub></td>
<td align="center"><sub><code>Interrogation board</code><br />Evidence chains</sub></td>
<td align="center"><sub><code>Airport security</code><br />Blocking & compliance</sub></td>
</tr>
</table>

<sub>↑ 5 of 29 styles — <a href="./skills/video-shot-demos/README.md"><b>open the full style library</b></a> (29 runnable production samples).</sub>

Links: [README](./skills/video-shot-demos/README.md) · [SKILL.md](./skills/video-shot-demos/SKILL.md)

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

### Installation

| # | Method | Best for | Pin a version? |
|---|--------|----------|----------------|
| A | [`skills` CLI (`npx`)](#option-a--skills-cli-npx) | Any agent, one-liner install, pick skills on demand | ✅ via tag URL |
| B | Git Clone + manual copy | Local development / hacking | ✅ via commit |
| C | GitHub Releases `.zip` | CI / production, fixed versions | ✅ via release tag |

#### Option A · `skills` CLI (npx)

```bash
# Install all skills (recommended)
npx skills add https://github.com/Unclecheng-li/AI_Animation

# Install a single skill
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/ppt-animation
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/flowchart
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/network-protocol-viz
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/dynamic-archify
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/scholar-notes
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/card-theater
npx skills add https://github.com/Unclecheng-li/AI_Animation/tree/main/skills/video-shot-demos
```

> **Installs the latest `main` by default.** The CLI reads each skill's latest `SKILL.md` straight from the source tree.

#### Option B · Git Clone

```bash
git clone https://github.com/Unclecheng-li/AI_Animation.git
# Copy skills/<skill-name> into your agent's skills directory
```

#### Option C · GitHub Releases

Grab a `.zip` from the [Releases page](https://github.com/Unclecheng-li/AI_Animation/releases), unzip, and copy to your agent's skills directory.

### Compatibility

| Agent / Runtime | Skill directory | Status |
|---|---|---|
| **WorkBuddy** | `~/.workbuddy/skills/<name>/` | ✅ Tested |
| **Claude Code** | `.claude/skills/<name>/` | ✅ Compatible |
| **Cursor** | `.agents/skills/<name>/` | ✅ Compatible |
| **Codex CLI** | `.codex/skills/<name>/` | ✅ Compatible |
| **Gemini CLI** | extension manifest | ✅ Compatible |

> The `SKILL.md` format is agent-agnostic — if your agent supports the Skills spec, just copy the folder into the right directory.

### Quick Start

After installing, simply tell your AI agent:

```
Make a ppt-animation presentation about the "HTTP protocol", dark-tech theme, 5 pages
```

```
Use flowchart to demonstrate how LSTM works
```

```
Use network-protocol-viz to visualize the TCP three-way handshake
```

```
Use dynamic-archify to draw a microservice architecture diagram with flowing animations
```

```
Turn the above into scholar notes, Style A
```

```
Use card-theater to demonstrate IPsec data flow, with mode switching (transport mode / tunnel mode)
```

```
Use video-shot-demos to turn this video's voiceover script into per-shot demo animations, one HTML per shot, output to demo/
```

### Directory Structure

```text
ai-animation-skills/
├── skills/
│   ├── SKILL_TEMPLATE.md        ← Standard template for new skills
│   ├── ppt-animation/
│   │   ├── SKILL.md             ← Agent instructions (core)
│   │   ├── README.md            ← Human-readable docs
│   │   ├── references/          ← Prompt references
│   │   └── assets/              ← Template HTML files
│   ├── flowchart/
│   │   ├── SKILL.md
│   │   ├── README.md
│   │   ├── references/
│   │   └── assets/
│   ├── network-protocol-viz/
│   │   ├── SKILL.md
│   │   ├── README.md
│   │   ├── references/
│   │   └── assets/
│   ├── dynamic-archify/
│   │   ├── SKILL.md
│   │   ├── README.md
│   │   ├── renderers/           ← 5 diagram renderers
│   │   ├── schemas/             ← JSON Schema validation
│   │   ├── examples/            ← Example JSON
│   │   └── assets/              ← Templates + GIF export libs
│   ├── scholar-notes/
│       ├── SKILL.md
│       ├── README.md
│       ├── assets/              ← Style A + Style B templates
│       ├── references/          ← Layout lib + component handbook + checklist
│       └── examples/            ← Style A/B examples (8)
│   ├── card-theater/
│       ├── SKILL.md
│       ├── README.md
│       ├── assets/              ← 5 template HTMLs
│       └── references/          ← Prompt references
│   ├── video-shot-demos/
│       ├── SKILL.md             ← Workflow + delivery checklist
│       ├── README.md
│       ├── references/          ← Player/camera/SFX/style-library/character specs
│       ├── assets/              ← Starter skeleton template.html
│       │   └── examples/        ← 29 production samples + character sprites + icons
│       └── scripts/             ← Headless screenshot QA tool
├── web_animation/               ← Original example HTML (historical archive)
├── UI/                          ← UI design reference images
├── prompt.md                    ← Prompt template collection
├── package.json
├── CONTRIBUTING.md
└── README.md
```

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). New animation skills are welcome!

### License

MIT — for educational use only.
