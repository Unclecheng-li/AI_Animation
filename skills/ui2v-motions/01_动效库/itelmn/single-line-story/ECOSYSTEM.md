# Ecosystem research and reuse decisions

The project should reuse mature visualization math where it strengthens templates, but it must not import a second video engine or animation clock. The decision boundary is deterministic HyperFrames seeking.

## Front-end visualization libraries

| Candidate | Useful capability | Decision for Plotbeat |
| --- | --- | --- |
| [D3 shape](https://d3js.org/d3-shape) and scale modules | Pure, composable SVG path, scale, tick, stack, and interpolation primitives | Best candidate for selective adoption. Use pure functions only; keep D3 transitions out of playback. The current runtime implements the small v0.1 subset directly to stay dependency-free. |
| [Observable Plot](https://observablehq.github.io/plot/) | Concise layered grammar for tabular exploratory charts | Good authoring reference and possible static-SVG adapter. Do not let its responsive redraw lifecycle own video timing. |
| [Apache ECharts](https://echarts.apache.org/handbook/en/how-to/animation/transition/) | Broad chart catalog, automatic data diffing, morphs, and update animation | Not a default runtime dependency. Its normal transition model derives animation from prior `setOption` state and often uses timed updates, which conflicts with arbitrary HyperFrames seeks. A future adapter could set `animation: false` and use ECharts only for static layout. |
| [Vega](https://github.com/vega/vega) | Declarative JSON visualization grammar with SVG/Canvas output and a reactive dataflow | Promising as an optional specification compiler, especially for AI-authored chart descriptions. Its view/dataflow runtime must be frozen and explicitly driven before it can satisfy frame determinism. |
| [visx](https://github.com/airbnb/visx) | Low-level React visualization components built around D3 primitives | Useful design/reference source, but React-specific and unnecessary for the native HTML HyperFrames composition contract. |
| [Nivo](https://github.com/plouc/nivo) | High-level React chart components with common chart families | Useful for web dashboards, but too opinionated and React-centric for frame-addressable HyperFrames templates. |

## Programmatic video systems

| Candidate | What overlaps | Boundary decision |
| --- | --- | --- |
| [Remotion](https://github.com/remotion-dev/remotion) | Code-authored video compositions, reusable templates, and programmatic rendering | A relevant comparison and possible source-port target, but not a dependency. Its React renderer would compete with HyperFrames. |
| [Revideo](https://docs.re.video/) | TypeScript video templates, player preview, and MP4 rendering | A close product analogue, but explicitly a separate video framework. Reusing it would contradict the HyperFrames-native requirement. |

## Product and implementation conclusions

1. Keep HyperFrames as the sole timeline, preview, validation, and rendering engine.
2. Prefer SVG DOM output because sampled frames remain inspectable and layout/contrast checks can see the content.
3. Reuse library modules only when they are pure data-to-geometry functions.
4. Disable any library-owned animation before integrating a chart renderer.
5. Treat a direct seek, forward seek, and backward seek to the same progress as the adapter acceptance test.
6. Keep input compilation separate from playback so CSV/JSON parsing and missing-data policy never vary between rendered frames.

The closest existing open-source systems solve either chart authoring or programmatic video. The differentiator here is the bridge: generic data contracts and reusable chart-story templates that remain ordinary HyperFrames compositions.
