#!/usr/bin/env bash
# Rebuilds the clips compositions/e1-screen.html reads (assets/ext/e-*.mp4 and
# cursor-path.json) from the region clips that
#   node tools/record-ext.mjs record --seed 38
# records, and fetches the fonts the composition declares.
set -euo pipefail
cd "$(dirname "$0")/.."

BASE="https://github.com/google/fonts/raw/main/ofl"
mkdir -p assets/fonts
for f in dotgothic16/DotGothic16-Regular ibmplexsansjp/IBMPlexSansJP-Regular ibmplexsansjp/IBMPlexSansJP-SemiBold; do
  out="assets/fonts/$(basename "$f").ttf"
  [ -s "$out" ] || curl -sfL -o "$out" "$BASE/$f.ttf"
done

A=assets/ext
R=(-an -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p -r 60)

echo "==> e-hook (the 3s with the most balls, real speed)"
ffmpeg -y -loglevel error -i "$A/ext-peak.mp4" -ss 1.0 -t 3.0 "${R[@]}" "$A/e-hook.mp4"

echo "==> e-early (hold the ready frame 0.15s, 1x through the launch at 0.5s, then 2x)"
ffmpeg -y -loglevel error -i "$A/ext-early.mp4" -filter_complex \
  "[0:v]split=3[s0][s1][s2];[s0]trim=end_frame=1,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop=8[a];[s1]trim=start=0:end=0.5,setpts=PTS-STARTPTS[b];[s2]trim=start=0.5:end=7.0,setpts=(PTS-STARTPTS)/2[c];[a][b][c]concat=n=3:v=1,fps=60[o]" \
  -map "[o]" "${R[@]}" "$A/e-early.mp4"

echo "==> e-end (1.5x up to the clear, 1x while the result banner appears, then hold)"
ffmpeg -y -loglevel error -i "$A/ext-end.mp4" -filter_complex \
  "[0:v]split=2[s0][s1];[s0]trim=start=4.5:end=8.0,setpts=(PTS-STARTPTS)/1.5[a];[s1]trim=start=8.0,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=0.9[b];[a][b]concat=n=2:v=1,fps=60[o]" \
  -map "[o]" "${R[@]}" "$A/e-end.mp4"

echo "==> cursor path"
node tools/cursor-path.mjs

for f in e-hook e-early e-end; do
  echo "    $A/$f.mp4 $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$A/$f.mp4")s"
done
