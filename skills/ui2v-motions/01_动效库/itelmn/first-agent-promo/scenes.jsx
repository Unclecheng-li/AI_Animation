// scenes.jsx — Scene components for the "Your First AI Agent" promo
// All scenes assume Stage at 1920x1080. Composed in main video.jsx.

const MONO = "'Roboto Mono', ui-monospace, monospace";
const SANS = "'Montserrat', system-ui, sans-serif";

const COLOR = {
  blue: '#2CA9E1',
  teal: '#2D9BA8',
  orange: '#F39237',
  gold: '#F9C74F',
  white: '#FFFFFF',
  body: '#F0F2F5',
  greyL: '#C5C8CC',
  grey: '#8A8F98',
  dark: '#0A0C10',
  darker: '#060810',
  darkBlue: '#143C5A',
};

// ─────────────────────────────────────────────────────────────────────────────
// Atmospheric backdrop — radial blue glow + fine grid + subtle warm bottom
// ─────────────────────────────────────────────────────────────────────────────
function Atmosphere({ warm = false, intensity = 1 }) {
  const t = useTime();
  // Slow ambient pulse
  const pulse = 0.85 + 0.15 * Math.sin(t * 1.4);
  return (
    <div style={{ position: 'absolute', inset: 0, background: COLOR.darker, overflow: 'hidden' }}>
      {/* Top blue glow */}
      <div style={{
        position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
        width: '120%', height: '90%',
        background: `radial-gradient(ellipse at center, rgba(44,169,225,${0.18 * intensity * pulse}) 0%, rgba(45,155,168,0.05) 40%, transparent 70%)`,
      }}/>
      {/* Bottom warm glow */}
      {warm && (
        <div style={{
          position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '100%', height: '70%',
          background: 'radial-gradient(ellipse at center bottom, rgba(243,146,55,0.18) 0%, transparent 60%)',
        }}/>
      )}
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(44,169,225,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(44,169,225,.05) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse at center, black 5%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 5%, transparent 70%)',
      }}/>
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
      }}/>
    </div>
  );
}

// Scanning beam for that techy launch feel
function ScanBeam({ start = 0, end = 999 }) {
  return (
    <Sprite start={start} end={end}>
      {({ progress }) => {
        const y = -200 + progress * 1500;
        return (
          <div style={{
            position: 'absolute', left: 0, right: 0, top: y,
            height: 200,
            background: 'linear-gradient(180deg, transparent 0%, rgba(44,169,225,0.08) 50%, transparent 100%)',
            pointerEvents: 'none',
          }}/>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 1 (0 - 2.4s) — Cold open: AIS logo + bolt charge
// ─────────────────────────────────────────────────────────────────────────────
function Scene1Logo({ start = 0, end = 2.4 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration, progress }) => {
        // Logo scales in big, then settles
        const t = Easing.easeOutBack(clamp(localTime / 0.7, 0, 1));
        const scale = 0.4 + 0.6 * t;
        const exitT = localTime > duration - 0.4 ? Easing.easeInQuad((localTime - (duration - 0.4)) / 0.4) : 0;
        const opacity = (localTime < 0.3 ? localTime / 0.3 : 1) * (1 - exitT);
        const settledScale = scale * (1 - exitT * 0.15);

        // Bolt charge — bolt fills with color over time
        const charge = clamp((localTime - 0.5) / 0.9, 0, 1);
        const flash = localTime > 1.3 && localTime < 1.45 ? 1 : 0;

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 32,
          }}>
            {/* Flash */}
            <div style={{
              position: 'absolute', inset: 0,
              background: '#fff', opacity: flash * 0.6, pointerEvents: 'none',
            }}/>

            {/* Logo */}
            <div style={{
              transform: `scale(${settledScale})`,
              opacity,
              filter: `drop-shadow(0 0 ${40 + charge * 80}px rgba(84,103,159,${0.7 + charge * 0.3}))`,
            }}>
              <img src="assets/AIS Logo.png" style={{ width: 220, height: 220, display: 'block' }}/>
            </div>

            {/* Wordmark */}
            <div style={{
              opacity: opacity * Easing.easeOutQuad(clamp((localTime - 0.4) / 0.5, 0, 1)),
              fontFamily: MONO, fontSize: 28, fontWeight: 700,
              letterSpacing: '0.32em', color: COLOR.white,
              textTransform: 'uppercase',
            }}>
              AI&nbsp;&nbsp;AUTOMATION&nbsp;&nbsp;SOCIETY
            </div>
            <div style={{
              opacity: opacity * Easing.easeOutQuad(clamp((localTime - 0.7) / 0.5, 0, 1)),
              fontFamily: MONO, fontSize: 13, fontWeight: 600,
              letterSpacing: '0.4em', color: COLOR.blue,
              textTransform: 'uppercase',
              marginTop: -16,
            }}>
              PRESENTS
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 2 (2.4 - 5.4s) — "WHAT IF YOU COULD BUILD..." build-up
// ─────────────────────────────────────────────────────────────────────────────
function Scene2Question({ start = 2.4, end = 5.4 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const exit = localTime > duration - 0.35 ? (localTime - (duration - 0.35)) / 0.35 : 0;
        const baseOp = 1 - Easing.easeInQuad(clamp(exit, 0, 1));

        const lines = [
          { text: 'WHAT IF YOU COULD', start: 0.0, color: COLOR.greyL },
          { text: 'BUILD AN', start: 0.4, color: COLOR.white },
          { text: 'AI AGENT', start: 0.85, color: 'gradient' },
          { text: 'THIS WEEKEND?', start: 1.45, color: COLOR.white },
        ];

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 18,
          }}>
            {lines.map((l, i) => {
              const t = clamp((localTime - l.start) / 0.45, 0, 1);
              const e = Easing.easeOutCubic(t);
              const opacity = e * baseOp;
              const ty = (1 - e) * 30;
              const blur = (1 - e) * 8;
              const gradient = l.color === 'gradient';
              return (
                <div key={i} style={{
                  opacity,
                  transform: `translateY(${ty}px)`,
                  filter: `blur(${blur}px)`,
                  fontFamily: MONO, fontWeight: 700,
                  fontSize: 96, letterSpacing: '-0.04em',
                  textTransform: 'uppercase',
                  lineHeight: 0.95,
                  ...(gradient ? {
                    background: `linear-gradient(135deg, ${COLOR.blue} 0%, ${COLOR.teal} 100%)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  } : { color: l.color }),
                }}>{l.text}</div>
              );
            })}
          </div>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 3 (5.4 - 9.0s) — Title card SLAM "YOUR FIRST AI AGENT"
// ─────────────────────────────────────────────────────────────────────────────
function Scene3Title({ start = 5.4, end = 9.0 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const exit = localTime > duration - 0.35 ? (localTime - (duration - 0.35)) / 0.35 : 0;
        const exitOp = 1 - Easing.easeInQuad(clamp(exit, 0, 1));

        // Top badge slides in
        const badgeT = Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1));

        // Title slam: scale from huge → 1 with overshoot, blur to clear
        const slam1 = clamp(localTime / 0.55, 0, 1);
        const e1 = Easing.easeOutQuart(slam1);
        const scale1 = 1.4 - 0.4 * e1;
        const blur1 = (1 - e1) * 16;

        const slam2T = clamp((localTime - 0.5) / 0.55, 0, 1);
        const e2 = Easing.easeOutQuart(slam2T);
        const scale2 = 1.4 - 0.4 * e2;
        const blur2 = (1 - e2) * 16;

        // Subtitle fades in
        const subT = Easing.easeOutCubic(clamp((localTime - 1.1) / 0.5, 0, 1));

        // Underline draw
        const underT = Easing.easeOutCubic(clamp((localTime - 1.4) / 0.6, 0, 1));

        // Slow drift after entrance
        const settled = clamp((localTime - 1.5) / 1.5, 0, 1);
        const drift = settled * -10;

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity: exitOp,
            transform: `translateY(${drift}px)`,
          }}>
            {/* Badge */}
            <div style={{
              opacity: badgeT * exitOp,
              transform: `translateY(${(1-badgeT) * -20}px)`,
              display: 'inline-flex', alignItems: 'center', gap: 14,
              padding: '14px 28px',
              background: 'rgba(16,20,32,0.85)',
              border: '1px solid rgba(44,169,225,0.3)',
              borderRadius: 9999,
              marginBottom: 56,
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: 5,
                background: COLOR.orange,
                boxShadow: `0 0 14px ${COLOR.orange}`,
                opacity: 0.5 + 0.5 * Math.abs(Math.sin(localTime * 4)),
              }}/>
              <span style={{
                fontFamily: MONO, fontSize: 16, fontWeight: 600,
                color: COLOR.white, letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}>3-DAY LIVE WORKSHOP · MAY 4–6</span>
            </div>

            {/* Title rows */}
            <div style={{
              opacity: e1, transform: `scale(${scale1})`, filter: `blur(${blur1}px)`,
              fontFamily: MONO, fontWeight: 700,
              fontSize: 220, letterSpacing: '-0.05em',
              color: COLOR.white, textTransform: 'uppercase',
              lineHeight: 0.9,
            }}>YOUR FIRST</div>
            <div style={{
              opacity: e2, transform: `scale(${scale2})`, filter: `blur(${blur2}px)`,
              fontFamily: MONO, fontWeight: 700,
              fontSize: 220, letterSpacing: '-0.05em',
              background: `linear-gradient(135deg, ${COLOR.blue} 0%, ${COLOR.teal} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textTransform: 'uppercase',
              lineHeight: 0.9, marginTop: 12,
            }}>AI AGENT</div>

            {/* Underline */}
            <div style={{
              marginTop: 40,
              width: `${underT * 480}px`,
              height: 4, borderRadius: 2,
              background: `linear-gradient(90deg, ${COLOR.blue}, ${COLOR.teal})`,
              boxShadow: `0 0 24px rgba(44,169,225,0.6)`,
            }}/>

            {/* Subtitle */}
            <div style={{
              opacity: subT, transform: `translateY(${(1-subT)*16}px)`,
              marginTop: 36,
              fontFamily: SANS, fontSize: 28, fontWeight: 400,
              color: COLOR.greyL, letterSpacing: '-0.005em',
              textAlign: 'center', maxWidth: 900, lineHeight: 1.5,
            }}>
              Go from zero to a working agent in three mornings.
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 4 (9.0 - 14.0s) — Three days agenda
// ─────────────────────────────────────────────────────────────────────────────
const DAYS = [
  {
    num: '01',
    date: 'MAY 4',
    title: 'FOUNDATIONS',
    desc: 'Set up Claude Code. Understand how agents think, plan and act.',
    glyph: 'foundation',
  },
  {
    num: '02',
    date: 'MAY 5',
    title: 'BUILD',
    desc: 'Wire up tools, memory and a real workflow your agent can run.',
    glyph: 'build',
  },
  {
    num: '03',
    date: 'MAY 6',
    title: 'SHIP',
    desc: 'Deploy, share with the community, and iterate live with Nate.',
    glyph: 'ship',
  },
];

function DayGlyph({ kind, size = 56, color = COLOR.blue }) {
  if (kind === 'foundation') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="13" width="18" height="8" rx="1"/>
        <path d="M5 13V9h4M19 13V9h-4M9 9V5h6v4"/>
      </svg>
    );
  }
  if (kind === 'build') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-1-1-2.5 2.5-2.5z"/>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 16l7-13 7 13M5 16l7 5 7-5M5 16l7 3 7-3"/>
    </svg>
  );
}

function Scene4Agenda({ start = 9.0, end = 14.0 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const dur = end - start;
        const exit = localTime > dur - 0.45 ? (localTime - (dur - 0.45)) / 0.45 : 0;
        const baseOp = 1 - Easing.easeInQuad(clamp(exit, 0, 1));

        // Header in
        const hT = Easing.easeOutCubic(clamp(localTime / 0.45, 0, 1));

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity: baseOp,
            padding: '0 100px',
          }}>
            <div style={{
              opacity: hT, transform: `translateY(${(1-hT)*16}px)`,
              fontFamily: MONO, fontSize: 18, fontWeight: 600,
              color: COLOR.blue, letterSpacing: '0.25em',
              textTransform: 'uppercase', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ width: 48, height: 2, background: COLOR.blue, borderRadius: 2 }}/>
              THREE MORNINGS
              <div style={{ width: 48, height: 2, background: COLOR.blue, borderRadius: 2 }}/>
            </div>

            <div style={{
              opacity: hT,
              fontFamily: MONO, fontWeight: 700,
              fontSize: 88, letterSpacing: '-0.04em',
              color: COLOR.white, textTransform: 'uppercase',
              marginBottom: 64, textAlign: 'center',
            }}>HERE'S THE PLAN</div>

            {/* Day cards */}
            <div style={{ display: 'flex', gap: 32, width: '100%', maxWidth: 1700 }}>
              {DAYS.map((d, i) => {
                const cardStart = 0.7 + i * 0.45;
                const cT = clamp((localTime - cardStart) / 0.6, 0, 1);
                const e = Easing.easeOutBack(cT);
                const op = clamp(cT * 1.5, 0, 1);
                return (
                  <div key={d.num} style={{
                    opacity: op,
                    transform: `translateY(${(1-e) * 60}px) scale(${0.92 + 0.08 * e})`,
                    flex: 1,
                    background: 'rgba(16,20,32,0.85)',
                    border: `1px solid rgba(44,169,225,${0.15 + 0.15 * e})`,
                    borderRadius: 24,
                    padding: '40px 36px',
                    minHeight: 380,
                    display: 'flex', flexDirection: 'column', gap: 18,
                    boxShadow: e > 0.8 ? `0 0 60px rgba(44,169,225,0.12)` : 'none',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Top accent bar */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0,
                      width: `${cT * 100}%`, height: 3,
                      background: `linear-gradient(90deg, ${COLOR.blue}, ${COLOR.teal})`,
                    }}/>
                    {/* Day number */}
                    <div style={{
                      fontFamily: MONO, fontWeight: 700,
                      fontSize: 140, letterSpacing: '-0.06em',
                      lineHeight: 0.85,
                      background: `linear-gradient(135deg, ${COLOR.blue} 0%, ${COLOR.teal} 100%)`,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>{d.num}</div>

                    {/* Glyph + meta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 64, height: 64, borderRadius: 12,
                        background: 'rgba(44,169,225,0.1)',
                        border: '1px solid rgba(44,169,225,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <DayGlyph kind={d.glyph} size={36}/>
                      </div>
                      <div>
                        <div style={{
                          fontFamily: MONO, fontSize: 14, fontWeight: 600,
                          color: COLOR.blue, letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                        }}>{d.date}</div>
                      </div>
                    </div>

                    <div style={{
                      fontFamily: MONO, fontWeight: 700, fontSize: 38,
                      letterSpacing: '-0.02em', color: COLOR.white,
                      textTransform: 'uppercase',
                    }}>{d.title}</div>

                    <div style={{
                      fontFamily: SANS, fontSize: 19, fontWeight: 400,
                      color: COLOR.greyL, lineHeight: 1.55,
                      marginTop: 'auto',
                    }}>{d.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 5 (14.0 - 19.0s) — Mock Claude Code terminal building agent
// ─────────────────────────────────────────────────────────────────────────────
function Scene5Terminal({ start = 14.0, end = 19.0 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const dur = end - start;
        const exit = localTime > dur - 0.4 ? (localTime - (dur - 0.4)) / 0.4 : 0;
        const baseOp = 1 - Easing.easeInQuad(clamp(exit, 0, 1));

        // Terminal slides up
        const enterT = Easing.easeOutCubic(clamp(localTime / 0.55, 0, 1));

        // Type effect
        const typed = (text, t0, dur = 0.8) => {
          const t = clamp((localTime - t0) / dur, 0, 1);
          return text.slice(0, Math.floor(t * text.length));
        };

        const lines = [
          { kind: 'prompt', t: 0.7, text: '> claude code init', color: COLOR.white, prefix: '$' },
          { kind: 'sys', t: 1.1, text: '✓ Claude Code session started', color: COLOR.blue, dur: 0.4 },
          { kind: 'prompt', t: 1.5, text: 'build me a research agent that scans n8n forums', color: COLOR.white, prefix: '>' },
          { kind: 'thinking', t: 2.6, text: '◆ thinking · planning tools · wiring memory', color: COLOR.greyL, dur: 1.0 },
          { kind: 'tool', t: 3.6, text: '⚡ created agent.ts · 124 lines', color: COLOR.orange, dur: 0.4 },
        ];

        // Cursor blink position - last line
        const cursorTime = localTime;
        const blink = Math.floor(cursorTime * 2) % 2 === 0;

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: baseOp,
            padding: '0 80px',
          }}>
            <div style={{
              opacity: enterT,
              transform: `translateY(${(1-enterT) * 60}px)`,
              width: 1400, maxWidth: '100%',
              background: 'rgba(8,10,16,0.96)',
              border: '1px solid rgba(44,169,225,0.3)',
              borderRadius: 16,
              boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(44,169,225,0.15)`,
              overflow: 'hidden',
            }}>
              {/* Title bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 20px',
                borderBottom: '1px solid rgba(44,169,225,0.1)',
                background: 'rgba(44,169,225,0.04)',
              }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: '#FF5F57' }}/>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: '#FEBC2E' }}/>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: '#28C840' }}/>
                </div>
                <div style={{
                  flex: 1, textAlign: 'center',
                  fontFamily: MONO, fontSize: 13, fontWeight: 500,
                  color: COLOR.grey, letterSpacing: '0.06em',
                }}>~/your-first-agent — claude code</div>
                <div style={{
                  fontFamily: MONO, fontSize: 11, fontWeight: 600,
                  color: COLOR.blue, letterSpacing: '0.14em',
                  display: 'flex', alignItems: 'center', gap: 6,
                  textTransform: 'uppercase',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: COLOR.blue, boxShadow: `0 0 8px ${COLOR.blue}` }}/>
                  LIVE
                </div>
              </div>

              {/* Terminal body */}
              <div style={{
                padding: '32px 36px',
                fontFamily: MONO, fontSize: 22, lineHeight: 1.7,
                minHeight: 380,
              }}>
                {lines.map((l, i) => {
                  if (localTime < l.t) return <div key={i} style={{ height: 38 }}/>;
                  const isTyping = l.kind === 'prompt';
                  const text = isTyping ? typed(l.text, l.t) : l.text;
                  const op = isTyping ? 1 : Easing.easeOutCubic(clamp((localTime - l.t) / (l.dur || 0.4), 0, 1));
                  return (
                    <div key={i} style={{
                      display: 'flex', gap: 14,
                      opacity: op,
                      color: l.color,
                      fontWeight: l.kind === 'tool' ? 600 : 500,
                      marginBottom: 6,
                    }}>
                      {l.prefix && <span style={{ color: COLOR.blue, fontWeight: 700 }}>{l.prefix}</span>}
                      <span>{text}{isTyping && text.length < l.text.length && blink ? '▊' : ''}</span>
                    </div>
                  );
                })}

                {/* Mini agent graph build-up */}
                {localTime > 3.0 && (
                  <div style={{
                    marginTop: 18,
                    opacity: Easing.easeOutCubic(clamp((localTime - 3.0) / 0.6, 0, 1)),
                    display: 'flex', gap: 12, alignItems: 'center',
                    flexWrap: 'wrap',
                  }}>
                    {['CLAUDE', '→', 'PLAN', '→', 'TOOLS', '→', 'MEMORY', '→', 'ACTION'].map((node, i) => {
                      const nT = clamp((localTime - 3.0 - i * 0.08) / 0.4, 0, 1);
                      const isArrow = node === '→';
                      return (
                        <span key={i} style={{
                          opacity: nT,
                          transform: `scale(${0.7 + 0.3 * Easing.easeOutBack(nT)})`,
                          padding: isArrow ? '6px 4px' : '8px 16px',
                          background: isArrow ? 'transparent' : 'rgba(44,169,225,0.1)',
                          border: isArrow ? 'none' : '1px solid rgba(44,169,225,0.3)',
                          borderRadius: 8,
                          fontFamily: MONO, fontSize: isArrow ? 22 : 16, fontWeight: 600,
                          color: isArrow ? COLOR.blue : COLOR.white,
                          letterSpacing: '0.1em',
                          display: 'inline-block',
                        }}>{node}</span>
                      );
                    })}
                  </div>
                )}

                {/* Final summary tag */}
                {localTime > 4.0 && (
                  <div style={{
                    marginTop: 22, paddingTop: 18,
                    borderTop: '1px dashed rgba(44,169,225,0.2)',
                    display: 'flex', gap: 20, alignItems: 'center',
                    opacity: Easing.easeOutCubic(clamp((localTime - 4.0) / 0.5, 0, 1)),
                  }}>
                    <div style={{
                      padding: '12px 22px',
                      background: `linear-gradient(135deg, ${COLOR.blue}, ${COLOR.teal})`,
                      borderRadius: 9999,
                      fontFamily: MONO, fontSize: 18, fontWeight: 700,
                      color: COLOR.white, letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      boxShadow: `0 0 30px rgba(44,169,225,0.4)`,
                    }}>✓ AGENT READY</div>
                    <div style={{
                      fontFamily: MONO, fontSize: 20, fontWeight: 500,
                      color: COLOR.greyL,
                    }}>and that's just <span style={{ color: COLOR.orange, fontWeight: 700 }}>DAY 1.</span></div>
                  </div>
                )}
              </div>
            </div>

            {/* Floating annotation */}
            {localTime > 0.6 && localTime < 4.5 && (
              <div style={{
                position: 'absolute', top: 120, right: 100,
                opacity: Easing.easeOutCubic(clamp((localTime - 0.6) / 0.4, 0, 1)) *
                         (1 - Easing.easeInCubic(clamp((localTime - 4.0) / 0.5, 0, 1))),
                fontFamily: MONO, fontSize: 22, fontWeight: 700,
                color: COLOR.orange, letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transform: 'rotate(-4deg)',
                textAlign: 'right',
              }}>
                LIVE WITH NATE<br/>
                <span style={{ fontSize: 14, color: COLOR.greyL, letterSpacing: '0.18em', fontWeight: 600 }}>NO COPY-PASTE</span>
              </div>
            )}
          </div>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 6 (19.0 - 23.5s) — Stat counters slam in
// ─────────────────────────────────────────────────────────────────────────────
function Counter({ to, suffix = '', duration = 0.9, decimals = 0, format }) {
  const { localTime } = useSprite();
  const t = Easing.easeOutQuart(clamp(localTime / duration, 0, 1));
  const val = to * t;
  const display = format ? format(val) :
    decimals ? val.toFixed(decimals) :
    Math.floor(val).toLocaleString();
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{display}{suffix}</span>;
}

function Scene6Stats({ start = 19.0, end = 23.5 }) {
  const stats = [
    { num: 300000, suffix: '+', label: 'COMMUNITY MEMBERS', sub: "World's largest" },
    { num: 4, suffix: 'x', label: 'SKOOL GAMES WINNER', sub: 'Top community' },
    { num: 3, suffix: '', label: 'MORNINGS · 2 HRS / DAY', sub: 'Live with Nate' },
  ];
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const dur = end - start;
        const exit = localTime > dur - 0.4 ? (localTime - (dur - 0.4)) / 0.4 : 0;
        const baseOp = 1 - Easing.easeInQuad(clamp(exit, 0, 1));
        const hT = Easing.easeOutCubic(clamp(localTime / 0.45, 0, 1));

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity: baseOp,
          }}>
            <div style={{
              opacity: hT, transform: `translateY(${(1-hT)*20}px)`,
              fontFamily: MONO, fontSize: 18, fontWeight: 600,
              color: COLOR.orange, letterSpacing: '0.25em',
              textTransform: 'uppercase', marginBottom: 24,
            }}>🏆 PROVEN TRACK RECORD</div>

            <div style={{
              opacity: hT,
              fontFamily: MONO, fontWeight: 700, fontSize: 80,
              letterSpacing: '-0.04em', color: COLOR.white,
              textTransform: 'uppercase', textAlign: 'center',
              marginBottom: 80,
              lineHeight: 1.0,
            }}>JOIN THE BIGGEST <span style={{
              background: `linear-gradient(135deg, ${COLOR.blue}, ${COLOR.teal})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>AI MOVEMENT</span></div>

            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', justifyContent: 'center' }}>
              {stats.map((s, i) => {
                const t0 = 0.5 + i * 0.3;
                const cT = clamp((localTime - t0) / 0.5, 0, 1);
                const e = Easing.easeOutBack(cT);
                if (cT <= 0) return <div key={i} style={{ width: 540 }}/>;
                const fontSize = i === 0 ? 110 : 160; // smaller for "300,000+", bigger for short
                return (
                  <div key={i} style={{
                    opacity: clamp(cT * 1.4, 0, 1),
                    transform: `scale(${0.6 + 0.4 * e})`,
                    width: 540, textAlign: 'center',
                  }}>
                    <Sprite start={start + t0} end={end}>
                      <div style={{
                        fontFamily: MONO, fontWeight: 700,
                        fontSize, letterSpacing: '-0.06em',
                        background: i === 1 ? `linear-gradient(135deg, ${COLOR.orange}, ${COLOR.gold})` : `linear-gradient(135deg, ${COLOR.blue}, ${COLOR.teal})`,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1, marginBottom: 16,
                        whiteSpace: 'nowrap',
                      }}>
                        <Counter to={s.num} suffix={s.suffix} duration={0.9}/>
                      </div>
                    </Sprite>
                    <div style={{
                      fontFamily: MONO, fontSize: 17, fontWeight: 700,
                      color: COLOR.white, letterSpacing: '0.12em',
                      textTransform: 'uppercase', marginBottom: 8,
                    }}>{s.label}</div>
                    <div style={{
                      fontFamily: MONO, fontSize: 13, fontWeight: 500,
                      color: COLOR.grey, letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}>{s.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 7 (23.5 - 27.0s) — Date + Price slam
// ─────────────────────────────────────────────────────────────────────────────
function Scene7DatePrice({ start = 23.5, end = 27.0 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const dur = end - start;
        const exit = localTime > dur - 0.35 ? (localTime - (dur - 0.35)) / 0.35 : 0;
        const baseOp = 1 - Easing.easeInQuad(clamp(exit, 0, 1));

        const monthT = Easing.easeOutBack(clamp(localTime / 0.5, 0, 1));
        const datesT = Easing.easeOutBack(clamp((localTime - 0.4) / 0.5, 0, 1));
        const priceT = Easing.easeOutBack(clamp((localTime - 1.4) / 0.6, 0, 1));
        const seatsT = Easing.easeOutCubic(clamp((localTime - 2.0) / 0.5, 0, 1));

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity: baseOp, gap: 0,
          }}>
            {/* Eyebrow */}
            <div style={{
              opacity: clamp(localTime / 0.3, 0, 1),
              fontFamily: MONO, fontSize: 18, fontWeight: 600,
              color: COLOR.blue, letterSpacing: '0.3em',
              textTransform: 'uppercase', marginBottom: 32,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ width: 48, height: 2, background: COLOR.blue }}/>
              MARK YOUR CALENDAR
              <div style={{ width: 48, height: 2, background: COLOR.blue }}/>
            </div>

            {/* MAY */}
            <div style={{
              opacity: monthT,
              transform: `scale(${0.85 + 0.15 * monthT})`,
              fontFamily: MONO, fontWeight: 700,
              fontSize: 140, letterSpacing: '-0.05em',
              color: COLOR.white, textTransform: 'uppercase',
              lineHeight: 0.9,
            }}>MAY</div>

            {/* 4 — 6 dates */}
            <div style={{
              opacity: datesT,
              transform: `scale(${0.85 + 0.15 * datesT})`,
              fontFamily: MONO, fontWeight: 700,
              fontSize: 280, letterSpacing: '-0.05em',
              background: `linear-gradient(135deg, ${COLOR.blue} 0%, ${COLOR.teal} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 0.9, display: 'flex', alignItems: 'center', gap: 24,
            }}>
              <span>4</span>
              <span style={{
                fontSize: 200, color: COLOR.grey,
                WebkitTextFillColor: COLOR.grey,
                background: 'none',
              }}>—</span>
              <span>6</span>
            </div>

            {/* Price + seats row */}
            <div style={{
              marginTop: 56,
              display: 'flex', gap: 24, alignItems: 'center',
            }}>
              {/* Price */}
              <div style={{
                opacity: priceT,
                transform: `scale(${0.7 + 0.3 * priceT}) rotate(${-2 + 2 * priceT}deg)`,
                padding: '24px 48px',
                background: `linear-gradient(135deg, ${COLOR.orange}, ${COLOR.gold})`,
                borderRadius: 24,
                boxShadow: `0 20px 60px rgba(243,146,55,0.4), 0 0 60px rgba(243,146,55,0.3)`,
                display: 'flex', alignItems: 'baseline', gap: 6,
              }}>
                <span style={{
                  fontFamily: MONO, fontWeight: 700, fontSize: 56,
                  color: COLOR.darker, letterSpacing: '-0.02em',
                }}>JUST</span>
                <span style={{
                  fontFamily: MONO, fontWeight: 700, fontSize: 120,
                  color: COLOR.darker, letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}>$20</span>
              </div>

              <div style={{
                opacity: seatsT,
                transform: `translateX(${(1-seatsT)*-20}px)`,
                padding: '24px 32px',
                background: 'rgba(16,20,32,0.85)',
                border: '1px solid rgba(44,169,225,0.3)',
                borderRadius: 16,
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{
                  fontFamily: MONO, fontSize: 14, fontWeight: 600,
                  color: COLOR.blue, letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}>SEATS LIMITED</div>
                <div style={{
                  fontFamily: MONO, fontWeight: 700, fontSize: 48,
                  color: COLOR.white, letterSpacing: '-0.02em',
                }}>500</div>
                <div style={{
                  fontFamily: MONO, fontSize: 12, fontWeight: 500,
                  color: COLOR.grey, letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}>FILLING FAST</div>
              </div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 8 (27.0 - 32.0s) — Final CTA slam
// ─────────────────────────────────────────────────────────────────────────────
function Scene8CTA({ start = 27.0, end = 32.0 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const dur = end - start;

        const titleT = Easing.easeOutCubic(clamp(localTime / 0.55, 0, 1));
        const subT = Easing.easeOutCubic(clamp((localTime - 0.5) / 0.5, 0, 1));
        const btnT = Easing.easeOutBack(clamp((localTime - 1.0) / 0.55, 0, 1));
        const urlT = Easing.easeOutCubic(clamp((localTime - 1.5) / 0.5, 0, 1));
        const lockT = Easing.easeOutCubic(clamp((localTime - 2.5) / 0.5, 0, 1));

        // Slow zoom for the whole frame
        const zoom = 1 + clamp(localTime / dur, 0, 1) * 0.06;

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            transform: `scale(${zoom})`,
          }}>
            {/* Small logo top */}
            <div style={{
              opacity: titleT,
              marginBottom: 32,
              filter: `drop-shadow(0 0 30px rgba(84,103,159,0.7))`,
            }}>
              <img src="assets/AIS Logo.png" style={{ width: 84, height: 84 }}/>
            </div>

            {/* Title */}
            <div style={{
              opacity: titleT,
              transform: `translateY(${(1-titleT) * 30}px)`,
              fontFamily: MONO, fontWeight: 700,
              fontSize: 140, letterSpacing: '-0.04em',
              color: COLOR.white, textTransform: 'uppercase',
              textAlign: 'center', lineHeight: 0.95,
            }}>
              CLAIM YOUR <span style={{
                background: `linear-gradient(135deg, ${COLOR.orange}, ${COLOR.gold})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>SEAT</span>
            </div>

            <div style={{
              opacity: subT,
              transform: `translateY(${(1-subT) * 16}px)`,
              fontFamily: SANS, fontSize: 28, fontWeight: 400,
              color: COLOR.greyL, marginTop: 28,
              textAlign: 'center', maxWidth: 880, lineHeight: 1.5,
            }}>Your first AI agent. Live, with Nate Herk. Three mornings.</div>

            {/* Button */}
            <button style={{
              opacity: btnT,
              transform: `scale(${0.7 + 0.3 * btnT})`,
              marginTop: 56,
              padding: '32px 64px',
              background: `linear-gradient(135deg, ${COLOR.blue} 0%, ${COLOR.teal} 100%)`,
              border: 'none', borderRadius: 9999,
              fontFamily: MONO, fontSize: 28, fontWeight: 700,
              color: COLOR.white, letterSpacing: '0.1em',
              textTransform: 'uppercase',
              boxShadow: `0 16px 60px rgba(44,169,225,0.45), 0 0 80px rgba(44,169,225,0.25)`,
              display: 'inline-flex', alignItems: 'center', gap: 18,
              cursor: 'pointer',
            }}>
              JOIN FOR $20
              <span style={{
                display: 'inline-flex', width: 32, height: 32,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </span>
            </button>

            {/* URL */}
            <div style={{
              opacity: urlT,
              marginTop: 32,
              fontFamily: MONO, fontSize: 18, fontWeight: 600,
              color: COLOR.blue, letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>aiautomationsociety.com/agent</div>

            {/* Bottom lockup */}
            <div style={{
              opacity: lockT,
              position: 'absolute', bottom: 60, left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', gap: 20,
              fontFamily: MONO, fontSize: 14, fontWeight: 600,
              color: COLOR.grey, letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>
              <span>MAY 4–6</span>
              <span style={{ width: 4, height: 4, borderRadius: 2, background: COLOR.grey }}/>
              <span>2 HRS / MORNING</span>
              <span style={{ width: 4, height: 4, borderRadius: 2, background: COLOR.grey }}/>
              <span style={{ color: COLOR.orange }}>500 SEATS</span>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Persistent ticker overlay across all scenes after intro
// ─────────────────────────────────────────────────────────────────────────────
function TickerOverlay({ start = 5.4, end = 32 }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const enterT = Easing.easeOutCubic(clamp(localTime / 0.5, 0, 1));
        const exitT = localTime > duration - 0.5 ? Easing.easeInCubic((localTime - (duration - 0.5)) / 0.5) : 0;
        const op = enterT * (1 - exitT);
        // Marquee
        const text = ' · YOUR FIRST AI AGENT · 3-DAY LIVE WORKSHOP · MAY 4–6 · WITH NATE HERK · BUILD WITH CLAUDE CODE · JUST $20 · 500 SEATS · YOUR FIRST AI AGENT · 3-DAY LIVE WORKSHOP · MAY 4–6 · WITH NATE HERK · BUILD WITH CLAUDE CODE · JUST $20 · 500 SEATS · ';
        const offset = (localTime * 60) % 1000;
        return (
          <>
            {/* Top corner badge */}
            <div style={{
              position: 'absolute', top: 32, left: 32,
              opacity: op,
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 18px',
              background: 'rgba(10,12,16,0.85)',
              border: '1px solid rgba(44,169,225,0.25)',
              borderRadius: 9999,
              backdropFilter: 'blur(12px)',
            }}>
              <img src="assets/AIS Logo.png" style={{ width: 24, height: 24 }}/>
              <span style={{
                fontFamily: MONO, fontSize: 12, fontWeight: 700,
                color: COLOR.white, letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}>AIS · YOUR FIRST AGENT</span>
            </div>

            {/* Top right LIVE pill */}
            <div style={{
              position: 'absolute', top: 32, right: 32,
              opacity: op,
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 18px',
              background: 'rgba(243,146,55,0.12)',
              border: '1px solid rgba(243,146,55,0.4)',
              borderRadius: 9999,
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: 4,
                background: COLOR.orange,
                boxShadow: `0 0 12px ${COLOR.orange}`,
                opacity: 0.5 + 0.5 * Math.abs(Math.sin(localTime * 4)),
              }}/>
              <span style={{
                fontFamily: MONO, fontSize: 12, fontWeight: 700,
                color: COLOR.orange, letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}>LIVE · MAY 4</span>
            </div>

            {/* Bottom marquee */}
            <div style={{
              position: 'absolute', bottom: 32, left: 0, right: 0,
              opacity: op * 0.6,
              fontFamily: MONO, fontSize: 14, fontWeight: 500,
              color: COLOR.grey, letterSpacing: '0.18em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap', overflow: 'hidden',
              maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
            }}>
              <div style={{ transform: `translateX(${-offset}px)` }}>{text}</div>
            </div>
          </>
        );
      }}
    </Sprite>
  );
}

Object.assign(window, {
  Atmosphere, ScanBeam, TickerOverlay,
  Scene1Logo, Scene2Question, Scene3Title, Scene4Agenda,
  Scene5Terminal, Scene6Stats, Scene7DatePrice, Scene8CTA,
});
