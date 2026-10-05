#!/usr/bin/env python3
"""Detect tempo, beats, downbeats, onsets, and energy sections."""
import json
import sys
import numpy as np
import librosa

PATH = sys.argv[1]
y, sr = librosa.load(PATH, sr=22050, mono=True)
duration = float(len(y) / sr)

tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units="time")
beats = beats.tolist()

onset_env = librosa.onset.onset_strength(y=y, sr=sr, aggregate=np.median)
onsets = librosa.onset.onset_detect(
    onset_envelope=onset_env, sr=sr, units="time", backtrack=False
)
onsets = onsets.tolist()

hop = 512
rms = librosa.feature.rms(y=y, hop_length=hop)[0]
rms_times = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)

bounds = librosa.segment.agglomerative(
    librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop), k=8
)
seg_times = librosa.frames_to_time(bounds, sr=sr, hop_length=hop).tolist()

window = max(1, int(sr / hop * 1.0))
smooth = np.convolve(rms, np.ones(window) / window, mode="same")
threshold = np.percentile(smooth, 75)
hits_idx = []
for i in range(1, len(smooth) - 1):
    if smooth[i] > threshold and smooth[i] > smooth[i - 1] and smooth[i] > smooth[i + 1]:
        hits_idx.append(i)
hits = [float(rms_times[i]) for i in hits_idx[:40]]

energy_at = lambda t: float(
    np.interp(t, rms_times, smooth) / (smooth.max() + 1e-9)
)

beat_energy = [{"t": round(b, 3), "e": round(energy_at(b), 3)} for b in beats]

out = {
    "duration": round(duration, 3),
    "tempo_bpm": round(float(np.asarray(tempo).item()), 2),
    "num_beats": len(beats),
    "beats": [round(b, 3) for b in beats],
    "beat_energy": beat_energy,
    "onsets": [round(o, 3) for o in onsets],
    "segment_boundaries": [round(s, 3) for s in seg_times],
    "energy_curve_summary": {
        "max_rms_time": round(float(rms_times[smooth.argmax()]), 3),
        "max_rms": round(float(smooth.max()), 5),
        "p25": round(float(np.percentile(smooth, 25)), 5),
        "p50": round(float(np.percentile(smooth, 50)), 5),
        "p75": round(float(np.percentile(smooth, 75)), 5),
    },
}
print(json.dumps(out))
