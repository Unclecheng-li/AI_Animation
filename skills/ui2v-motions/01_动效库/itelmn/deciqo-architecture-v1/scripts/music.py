"""Synthesize the Deciqo showreel music bed: 120 BPM, D minor, 80 s.

Section map (seconds) mirrors STORYBOARD.md:
  0-8   cold open  : drone + ticking hats + noise riser
  8-16  title      : drop (kick, sub, pad, arp)
  16-32 lane 1     : full groove
  32-42 lane 2     : brighter arp, lighter drums
  42-58 lane 3     : full groove + claps
  58-70 proof      : half-time, filtered
  70-80 close      : big chord, ring out
Run: ../.venv/bin/python scripts/music.py  (writes assets/music.wav)
"""
import numpy as np
import wave, os

SR = 44100
BPM = 120
BEAT = 60 / BPM
DUR = 92.0
FINAL = 88.3
N = int(SR * DUR)
rng = np.random.default_rng(11)

L = np.zeros(N)
R = np.zeros(N)


def t_idx(t):
    return int(round(t * SR))


def add(sig, t, gain=1.0, pan=0.0):
    i = t_idx(t)
    if i >= N:
        return
    sig = sig[: N - i]
    lg = gain * np.sqrt(0.5 * (1 - pan))
    rg = gain * np.sqrt(0.5 * (1 + pan))
    L[i : i + len(sig)] += sig * lg
    R[i : i + len(sig)] += sig * rg


def onepole_lp(x, fc):
    fc = np.broadcast_to(np.asarray(fc, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    s = 0.0
    for i in range(len(x)):
        s = (1 - a[i]) * x[i] + a[i] * s
        y[i] = s
    return y


def lp_fast(x, fc):
    # FFT brick-ish lowpass for static cutoffs (fast)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / fc) ** 4)
    return np.fft.irfft(X, len(x))


def hp_fast(x, fc):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (fc / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x))


def saw(freq, n, detune=0.0, phase=0.0):
    t = np.arange(n) / SR
    return 2 * ((t * freq * (1 + detune) + phase) % 1.0) - 1


def note(name):
    names = {"C": 0, "C#": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}
    n, o = name[:-1], int(name[-1])
    midi = 12 * (o + 1) + names[n]
    return 440 * 2 ** ((midi - 69) / 12)


# chord progression, 2 bars (4 s) each: Dm Bb F C
CHORDS = [
    ["D3", "F3", "A3", "D4"],
    ["Bb2", "D3", "F3", "Bb3"],
    ["F2", "A3", "C4", "F3"],
    ["C3", "E3", "G3", "C4"],
]
ROOTS = ["D2", "Bb1", "F1", "C2"]


def chord_at(t):
    return int((t // 4) % 4)


# ---------- sections: energy envelopes ----------
def sec(t):
    if t < 8:
        return "open"
    if t < 15.6:
        return "title"
    if t < 31.6:
        return "lane1"
    if t < 43.0:
        return "lane2"
    if t < 71.6:
        return "lane3"
    if t < 81.7:
        return "proof"
    return "close"


# ---------- drums ----------
def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 7.5)
    s[:120] += np.linspace(0.6, 0, 120) * rng.standard_normal(120) * 0.4
    return np.tanh(s * 1.6)


def hat(open_=False):
    n = int((0.22 if open_ else 0.05) * SR)
    t = np.arange(n) / SR
    s = hp_fast(rng.standard_normal(n), 7000) * np.exp(-t * (14 if open_ else 70))
    return s


def clap():
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    s = rng.standard_normal(n)
    X = np.fft.rfft(s)
    f = np.fft.rfftfreq(n, 1 / SR)
    X *= np.exp(-((f - 1500) / 900) ** 2)
    s = np.fft.irfft(X, n)
    env = np.exp(-t * 18)
    for d in (0.0, 0.011, 0.022):
        env += (t >= d) * np.exp(-(t - d).clip(0) * 90) * 0.6
    return s * env / np.max(np.abs(s))


K, HC, HO, CL = kick(), hat(), hat(True), clap()
side = np.ones(N)  # sidechain gain applied to pads/bass

bars = int(DUR / (4 * BEAT))
for b in range(int(DUR / BEAT)):
    t = b * BEAT
    s = sec(t)
    beat_in_bar = b % 4
    if s in ("title", "lane1", "lane3") or (s == "lane2" and beat_in_bar in (0, 2)) or (s == "close" and t < FINAL):
        if not (s == "title" and t < 8.01 and False):
            add(K, t, 0.95)
            i = t_idx(t)
            m = min(N, i + int(0.35 * SR))
            side[i:m] = np.minimum(side[i:m], 0.35 + 0.65 * np.linspace(0, 1, m - i) ** 0.6)
    if s == "proof" and beat_in_bar == 0:
        add(K, t, 0.8)
        i = t_idx(t)
        m = min(N, i + int(0.5 * SR))
        side[i:m] = np.minimum(side[i:m], 0.4 + 0.6 * np.linspace(0, 1, m - i) ** 0.6)
    # claps on 2 & 4
    if s in ("lane1", "lane3") and beat_in_bar in (1, 3):
        add(CL, t, 0.32, 0.1)
    if s == "proof" and beat_in_bar == 2:
        add(CL, t, 0.28)
    # hats
    for k in range(4):
        th = t + k * BEAT / 4
        if s == "open":
            g = 0.05 + 0.12 * (th / 8)
            add(HC, th, g * (1.0 if k % 2 == 0 else 0.6), 0.3)
        elif s in ("title", "lane1", "lane2", "lane3"):
            add(HC, th, 0.12 if k % 2 == 0 else 0.07, -0.25 if k % 2 else 0.25)
            if k == 2:
                add(HO, th, 0.08, 0.2)
        elif s == "proof" and k % 2 == 0:
            add(HC, th, 0.07, 0.2)

# ---------- sub bass ----------
bass = np.zeros(N)
for b in range(int(DUR / (BEAT / 2))):
    t = b * BEAT / 2
    s = sec(t)
    if s in ("open",) or (s == "close" and t >= FINAL):
        continue
    if s == "proof" and b % 2:
        continue
    f = note(ROOTS[chord_at(t)])
    n = int(BEAT / 2 * SR * 0.95)
    tt = np.arange(n) / SR
    v = (np.sin(2 * np.pi * f * tt) + 0.35 * saw(f, n)) * np.exp(-tt * 3) * np.minimum(1, tt * 200)
    i = t_idx(t)
    m = min(N, i + n)
    bass[i:m] += v[: m - i]
bass = lp_fast(bass, 320) * side
# open drone on D
tt = np.arange(t_idx(8.4)) / SR
drone = (np.sin(2 * np.pi * note("D2") * tt) + 0.5 * np.sin(2 * np.pi * note("A2") * tt)) * (tt / 8.4) ** 1.5 * 0.5
bass[: len(drone)] += drone
# final ring
tt = np.arange(N - t_idx(FINAL)) / SR
bass[t_idx(FINAL) :] += np.sin(2 * np.pi * note("D2") * tt) * np.exp(-tt * 0.45) * 0.6
L += bass * 0.55
R += bass * 0.55

# ---------- pad ----------
padL = np.zeros(N)
padR = np.zeros(N)
pad_events = [(c * 4.0, CHORDS[c % 4], 4.2) for c in range(int(FINAL // 4))]
pad_events.append((FINAL, ["D3", "F3", "A3", "D4", "A4"], DUR - FINAL))
for t0, notes, length in pad_events:
    s = sec(t0)
    if t0 < FINAL and t0 + length > FINAL:
        length = FINAL - t0 + 0.1
    n = int(length * SR)
    tt = np.arange(n) / SR
    env = np.minimum(1, tt / 0.6) * np.minimum(1, (length - tt) / 0.5).clip(0)
    if t0 >= FINAL:
        env = np.minimum(1, tt / 0.05) * np.exp(-tt * 0.35)
    vl = np.zeros(n)
    vr = np.zeros(n)
    for j, nm in enumerate(notes):
        f = note(nm)
        vl += saw(f, n, -0.004, 0.13 * j) + saw(f, n, 0.003, 0.5)
        vr += saw(f, n, 0.004, 0.31 * j) + saw(f, n, -0.002, 0.7)
    gain = {"open": 0.18, "title": 0.5, "lane1": 0.42, "lane2": 0.5, "lane3": 0.42, "proof": 0.48, "close": 0.7}[s]
    if s == "open":
        env *= (tt + t0) / 8
    i = t_idx(t0)
    m = min(N, i + n)
    padL[i:m] += (vl * env * gain)[: m - i]
    padR[i:m] += (vr * env * gain)[: m - i]
padL = lp_fast(padL, 1400)
padR = lp_fast(padR, 1400)
pside = 0.55 + 0.45 * side
L += padL * 0.09 * pside
R += padR * 0.09 * pside

# ---------- arp (pluck 16ths) ----------
arp = np.zeros(N)
pattern = [0, 2, 1, 3, 2, 1, 3, 2]
for k in range(int(DUR / (BEAT / 4))):
    t = k * BEAT / 4
    s = sec(t)
    if s == "open" or t >= FINAL:
        continue
    if s == "proof" and k % 2:
        continue
    ch = CHORDS[chord_at(t)]
    nm = ch[pattern[k % 8]]
    f = note(nm) * (4 if s == "lane2" else 2)
    n = int(0.22 * SR)
    tt = np.arange(n) / SR
    v = (np.sign(np.sin(2 * np.pi * f * tt)) * 0.5 + np.sin(2 * np.pi * f * tt)) * np.exp(-tt * 22)
    g = {"title": 0.18, "lane1": 0.22, "lane2": 0.26, "lane3": 0.24, "proof": 0.16, "close": 0.2}[s]
    if k % 4 == 0:
        g *= 1.3
    i = t_idx(t)
    m = min(N, i + n)
    arp[i:m] += (v * g)[: m - i]
arp = lp_fast(arp, 3200)
# ping-pong delay (3/16)
d = int(BEAT * 0.75 * SR)
aL = arp.copy()
aR = arp.copy()
aR[d:] += arp[:-d] * 0.45
aL[2 * d :] += arp[: -2 * d] * 0.3
L += aL * 0.2
R += aR * 0.2

# ---------- noise riser into 8 s and into 16 s ----------
for (a, b, g) in ((4.0, 8.0, 0.22), (13.6, 15.6, 0.14), (64.6, 66.2, 0.1), (79.7, 81.7, 0.12), (86.3, 88.3, 0.16)):
    n = t_idx(b) - t_idx(a)
    tt = np.arange(n) / SR
    x = rng.standard_normal(n)
    y = hp_fast(x, 1500) * (tt / (b - a)) ** 2.2
    add(y, a, g, -0.2)
    add(hp_fast(rng.standard_normal(n), 2500) * (tt / (b - a)) ** 2.2, a, g, 0.2)

# ---------- reverb (convolution with decaying noise IR) ----------
irn = int(2.4 * SR)
tt = np.arange(irn) / SR
ir = rng.standard_normal(irn) * np.exp(-tt * 2.6)
ir = lp_fast(ir, 5000)
ir /= np.sqrt(np.sum(ir ** 2))


def conv(x, h):
    n = len(x) + len(h) - 1
    nf = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nf) * np.fft.rfft(h, nf), nf)[: len(x)]
    return y


wetL = conv(L, ir)
wetR = conv(R, np.roll(ir, 311))
L = L + wetL * 0.22
R = R + wetR * 0.22

# master: gentle fade in/out, soft clip, normalize
tt = np.arange(N) / SR
fade = np.minimum(1, tt / 0.3) * np.clip((DUR - tt) / 2.5, 0, 1)
L *= fade
R *= fade
peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
L = np.tanh(L / peak * 1.3) / np.tanh(1.3) * 0.89
R = np.tanh(R / peak * 1.3) / np.tanh(1.3) * 0.89

out = os.path.join(os.path.dirname(__file__), "..", "assets", "music.wav")
pcm = (np.stack([L, R], 1) * 32767).astype(np.int16)
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", out)
