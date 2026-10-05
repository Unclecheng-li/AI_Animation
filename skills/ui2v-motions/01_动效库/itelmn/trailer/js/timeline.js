const FPS = 30;
const sec = (frames) => Math.round((frames / FPS) * 100) / 100;

const framesB = {
  B1: { from: 0, duration: 210 },
  B2: { from: 195, duration: 240 },
  B3: { from: 420, duration: 315 },
  B4: { from: 720, duration: 360 },
  B5: { from: 1065, duration: 240 },
  B6: { from: 1290, duration: 210 },
};

export const HF_TIMELINE = {
  B1: { from: sec(framesB.B1.from), duration: sec(framesB.B1.duration) },
  B2: { from: sec(framesB.B2.from), duration: sec(framesB.B2.duration) },
  B3: { from: sec(framesB.B3.from), duration: sec(framesB.B3.duration) },
  B4: { from: sec(framesB.B4.from), duration: sec(framesB.B4.duration) },
  B5: { from: sec(framesB.B5.from), duration: sec(framesB.B5.duration) },
  B6: { from: sec(framesB.B6.from), duration: sec(framesB.B6.duration) },
  TOTAL_SECONDS: sec(framesB.B6.from + framesB.B6.duration),
  REAL_STATS: {
    totalHours: 199,
    totalSessions: 97,
    streakDays: 45,
    subjects: 5,
  },
};

export const LIME = "#ccff00";
export const NEAR_BLACK = "#0a0a0a";
