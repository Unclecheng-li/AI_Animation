# Claude 19 Tips 真动效版 V2 Implementation Plan

> **For Claude / Codex:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** 把 `2026-05-03/claude-19-tips-remotion/` 从静态 PPT 感版本返工成真正 motion graphics 视频：内容居中铺满、持续动效、带参考人声音频和低音量动作音效。

**Architecture:** 继续使用 Remotion 编排完整 10:17.833 主时间线，不使用参考视频画面。基于 fixed SRT 生成 19 个技巧节点和更细的 cue-level 动效触发点；所有终端、Claude Code UI、状态栏、Todo、Hooks、Worktree、API/MCP、Agent Teams、Skill Creator 都用代码生成真实动效界面。只有语义上确实依赖真实外部环境的片段才列入录屏替换清单。

**Tech Stack:** Remotion 4, React 19, TypeScript, `@remotion/captions`, FFmpeg/ffprobe, fixed SRT, reference MP4 audio.

## Non-Negotiables

- 不再预留右侧人物/录屏空白；所有核心内容进入 1920x1080 中央主舞台。
- 不渲染参考视频画面，不烧录字幕，不引用旧 SRT。
- 终端和 Claude Code UI 效果必须代码生成，不允许占位。
- 最终输出 `out/claude-19-tips-motion-only-v2.mp4`，不要覆盖旧 `v1`。
- 最终 MP4 必须包含参考人声 + 动作音效。
- 音效只做动作反馈，低音量，不盖住人声。

## Task 1: Add Audio Asset Pipeline

**Files:**
- Modify: `2026-05-03/claude-19-tips-remotion/package.json`
- Create: `2026-05-03/claude-19-tips-remotion/scripts/extract-audio.sh`
- Create: `2026-05-03/claude-19-tips-remotion/public/audio/.gitkeep`
- Test: `2026-05-03/claude-19-tips-remotion/src/data/timeline.test.ts`

**Steps:**
1. Add script `extract:audio` that runs `bash scripts/extract-audio.sh`.
2. `extract-audio.sh` must read the existing symlink target `assets/reference/codex-ref.mp4` and write `public/audio/reference-voice.m4a`.
3. Use FFmpeg command:
   ```bash
   ffmpeg -y -i assets/reference/codex-ref.mp4 -vn -c:a aac -b:a 192k public/audio/reference-voice.m4a
   ```
4. Add a test or script check that `public/audio/reference-voice.m4a` is the expected configured audio filename, without importing reference video into JSX.
5. Run:
   ```bash
   npm run extract:audio
   ffprobe -v error -select_streams a:0 -show_entries stream=codec_type,duration -of json public/audio/reference-voice.m4a
   npm test
   npm run lint
   ```
6. Commit:
   ```bash
   git add 2026-05-03/claude-19-tips-remotion
   git commit -m "feat: add reference voice audio pipeline"
   ```

## Task 2: Generate Cue-Level Motion Timeline

**Files:**
- Modify: `2026-05-03/claude-19-tips-remotion/src/data/timeline.ts`
- Modify: `2026-05-03/claude-19-tips-remotion/scripts/export-timeline.ts`
- Modify generated: `2026-05-03/claude-19-tips-remotion/src/data/timeline.generated.ts`
- Test: `2026-05-03/claude-19-tips-remotion/src/data/timeline.test.ts`

**Steps:**
1. Add `MotionCue` type with `id`, `tipSlug`, `startMs`, `endMs`, `kind`, `text`, and `emphasis`.
2. Generate 3-7 cues per tip from captions inside each tip window.
3. Cue kinds must include: `command`, `terminal-output`, `panel-enter`, `metric-change`, `check-item`, `compare`, `branch`, `notification`, `transition`.
4. Tests must verify:
   - all 19 tips have cues;
   - cues are sorted by `startMs`;
   - every cue duration is positive;
   - no cue references old SRT;
   - key tips have required cue kinds: statusline command, commit command, plan panel, self-check todos, hooks notification, API/MCP compare, Skill Creator structure.
5. Run:
   ```bash
   npm run generate:data
   npm test
   npm run lint
   ```
6. Commit:
   ```bash
   git add 2026-05-03/claude-19-tips-remotion/src/data 2026-05-03/claude-19-tips-remotion/scripts
   git commit -m "feat: generate cue-level motion timeline"
   ```

## Task 3: Replace Left-Safe Layout With Center MotionStage

**Files:**
- Create: `2026-05-03/claude-19-tips-remotion/src/visual/MotionStage.tsx`
- Modify: `2026-05-03/claude-19-tips-remotion/src/Composition.tsx`
- Modify: `2026-05-03/claude-19-tips-remotion/src/visual/visualSystem.ts`
- Test: `2026-05-03/claude-19-tips-remotion/src/visual/visualSystem.test.ts`

**Steps:**
1. Remove usage of `SafeStage` from the main composition.
2. Create `MotionStage` that centers content with a max width around 1320-1500px and uses full-height vertical centering.
3. Add always-on subtle camera motion using `useCurrentFrame()`:
   - scale `1.0 -> 1.018 -> 1.0` over 30-40s;
   - background glow drift stays warm gray/orange;
   - no CSS animations.
4. Add a reusable `LightStreakTransition` overlay for scene transitions.
5. Tests must assert that host/right safe-area values are no longer used for main composition.
6. Render quick stills:
   ```bash
   npx remotion still Claude19Tips --frame=0 --output=out/v2-layout-0000.png
   npx remotion still Claude19Tips --frame=1181 --output=out/v2-layout-0039.png
   ```
7. Commit:
   ```bash
   git add 2026-05-03/claude-19-tips-remotion/src
   git commit -m "feat: center the motion stage"
   ```

## Task 4: Rebuild Terminal and Claude Code UI as Real Motion

**Files:**
- Modify: `2026-05-03/claude-19-tips-remotion/src/components/TerminalComponents.tsx`
- Modify: `2026-05-03/claude-19-tips-remotion/src/scenes/TipScene.tsx`
- Modify: `2026-05-03/claude-19-tips-remotion/src/scenes/sceneRegistry.ts`
- Test: `2026-05-03/claude-19-tips-remotion/src/scenes/sceneRegistry.test.ts`

**Steps:**
1. `TerminalWindow` must support:
   - window slide/scale/blur entrance;
   - titlebar and macOS traffic lights;
   - command typing based on cue timing;
   - output lines appearing with vertical scroll;
   - statusline at bottom changing model/context/cost/tokens.
2. Implement generated UI for all CLI-related tips:
   - `/statusline`: command typing + bottom statusline + context gauge.
   - `git commit`: staged files, commit hash, snapshot stack, rollback marker.
   - `/clear`: context gauge drains from high to low + new session card.
   - `/plan`: plan steps slide in and then execute state appears.
   - `/hooks`: command plus settings panel plus notification toast.
   - `git worktree`: branch/worktree graph with Claude/Codex lanes.
3. Do not create placeholders for terminal/CLI scenes.
4. Tests must check required scene specs have `placeholder: false` or equivalent.
5. Run:
   ```bash
   npm test
   npm run lint
   ```
6. Commit:
   ```bash
   git add 2026-05-03/claude-19-tips-remotion/src
   git commit -m "feat: rebuild generated terminal motion scenes"
   ```

## Task 5: Animate Non-Terminal Panels Internally

**Files:**
- Modify: `2026-05-03/claude-19-tips-remotion/src/components/TerminalComponents.tsx`
- Modify: `2026-05-03/claude-19-tips-remotion/src/scenes/TipScene.tsx`

**Steps:**
1. `ContextGauge` and `ContextBreakdown`: animate fills, labels, and percentage changes.
2. `PlanModePanel`: each row enters on cue, active row highlights, approval/execution transition appears.
3. `SelfCheckTodo`: todos enter and tick one by one, with a final QA stamp.
4. `EscStopCard`: ESC key press compresses, stop flash appears; double ESC rewinds a small timeline stack.
5. `ApiVsMcpCompare`: two cards split from center, API side stays light, MCP side shows context load warning.
6. `AgentTeamsPanel`: advisor assigns to worker/reviewer lanes, lines pulse.
7. `SkillCreatorCard`: `SKILL.md`, `workflow`, `scripts/`, `examples/` assemble into a folder-like structure.
8. Each scene must have visible motion every 0.3-0.8s during the first 4s of the segment.
9. Run still checks at:
   ```bash
   npx remotion still Claude19Tips --frame=2417 --output=out/v2-plan-0120.png
   npx remotion still Claude19Tips --frame=5554 --output=out/v2-selfcheck-0307.png
   npx remotion still Claude19Tips --frame=12829 --output=out/v2-api-mcp-0707.png
   npx remotion still Claude19Tips --frame=16525 --output=out/v2-skill-0910.png
   ```
10. Commit:
   ```bash
   git add 2026-05-03/claude-19-tips-remotion/src
   git commit -m "feat: animate generated panel scenes"
   ```

## Task 6: Add Motion SFX Layer

**Files:**
- Create: `2026-05-03/claude-19-tips-remotion/src/audio/SfxLayer.tsx`
- Create: `2026-05-03/claude-19-tips-remotion/src/audio/sfxManifest.ts`
- Modify: `2026-05-03/claude-19-tips-remotion/src/Composition.tsx`
- Test: `2026-05-03/claude-19-tips-remotion/src/audio/sfxManifest.test.ts`

**Steps:**
1. Generate deterministic lightweight SFX files into `public/sfx/` using FFmpeg sine/noise filters, or commit tiny generated WAV/MP3 files only if they are small.
2. Required SFX types:
   - `soft-whoosh`: panel slide/scene transition.
   - `keyboard-tick`: grouped terminal typing.
   - `ui-click`: todo/check/status changes.
   - `notification-ding`: Hooks completion.
   - `stop-tap`: ESC stop.
   - `rewind-tick`: double ESC rollback.
   - `pulse`: graph/branch/API-MCP line activation.
3. Add `SfxLayer` that maps motion cues to `<Audio>` elements.
4. Keep SFX volumes low:
   - whoosh/pulse: `0.08-0.14`
   - click/tick: `0.035-0.08`
   - notification: `0.12-0.18`
   - no SFX above `0.2`
5. Add the reference voice `<Audio>` in the composition at volume `1.0`.
6. Ensure SFX never replace or obscure reference voice.
7. Run:
   ```bash
   npm test
   npm run lint
   npx remotion render Claude19Tips out/claude-19-tips-motion-only-v2-draft.mp4 --frames=0-300
   ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 out/claude-19-tips-motion-only-v2-draft.mp4
   ```
8. Commit:
   ```bash
   git add 2026-05-03/claude-19-tips-remotion
   git commit -m "feat: add voice and motion sfx layers"
   ```

## Task 7: Add Screen Recording Replacement List

**Files:**
- Create: `2026-05-03/claude-19-tips-remotion/SCREEN_RECORDING_TODO.md`

**Rules:**
- Do not list terminal/CLI effects as placeholders.
- Only list segments that semantically benefit from true external footage:
  - phone remote control QR / mobile browser control;
  - real screenshot error or inspiration webpage;
  - real project folder/file tree if needed;
  - real system notification if Remotion fake is not enough.

**Content format:**
```markdown
| Time | Segment | Why real recording may help | Suggested recording | Current generated fallback |
```

**Commit:**
```bash
git add 2026-05-03/claude-19-tips-remotion/SCREEN_RECORDING_TODO.md
git commit -m "docs: add optional screen recording replacement list"
```

## Task 8: Browser Preview and QA

**Files:**
- Modify only if QA finds issues.

**Steps:**
1. Start Remotion Studio:
   ```bash
   npm run dev
   ```
2. Open the local Studio URL in a browser.
3. Scrub these times:
   - 00:00 intro centered and moving.
   - 00:39 commit terminal typing + snapshot motion.
   - 01:20 plan mode progressive rows.
   - 03:07 self-check tick motion.
   - 05:04 hooks notification.
   - 07:07 API vs MCP split/compare motion.
   - 09:10 Skill Creator assembly.
   - 10:13 outro convergence.
4. If a scene reads like a static slide for more than 1s, fix it before final render.
5. Run:
   ```bash
   npm test
   npm run lint
   ```
6. Commit any fixes:
   ```bash
   git add 2026-05-03/claude-19-tips-remotion/src
   git commit -m "fix: address v2 motion qa findings"
   ```

## Task 9: Final Render and Verification

**Files:**
- Modify: `2026-05-03/claude-19-tips-remotion/RENDER_REPORT.md`

**Steps:**
1. Render final:
   ```bash
   npx remotion render Claude19Tips out/claude-19-tips-motion-only-v2.mp4
   ```
2. Verify:
   ```bash
   ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,avg_frame_rate,nb_frames,duration -show_entries format=duration,size -of json out/claude-19-tips-motion-only-v2.mp4
   ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 out/claude-19-tips-motion-only-v2.mp4
   rg -n "Subtitle 1\\.srt|<Video|assets/reference|/Users/chenhuajin/Movies" src scripts package.json remotion.config.ts
   ```
3. Expected:
   - 1920x1080.
   - 30fps.
   - around 617.8s.
   - audio stream exists.
   - no reference video rendered.
   - no old SRT reference.
4. Update render report with V2 output path and verification result.
5. Commit:
   ```bash
   git add 2026-05-03/claude-19-tips-remotion/RENDER_REPORT.md
   git commit -m "chore: render final v2 motion video"
   ```

## Handoff Prompt For New Chat

```text
请在 /Users/chenhuajin/项目/视频制作台/hyperframes 执行 docs/plans/2026-05-04-claude-19-tips-motion-v2.md。
必须先使用 superpowers:executing-plans。
目标是生成 2026-05-03/claude-19-tips-remotion/out/claude-19-tips-motion-only-v2.mp4。
关键要求：全画面居中、真实终端/Claude Code UI 动效、参考人声 + 低音量动作音效、不渲染参考视频画面、不引用旧 SRT。
```
