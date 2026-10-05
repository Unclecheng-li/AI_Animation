#!/usr/bin/env bash
# Re-records the gameplay take and rebuilds every clip the frames consume.
#
#   assets/board-intact.png       frame 1  — the untouched grass strip
#   assets/play-break-zoom.mp4    frame 2  — launch → first break, push 1.00→1.15
#   assets/play-cascade-zoom.mp4  frame 3  — the cascade, compressed to 6.5s, pull 1.15→1.00
#   assets/board-empty.png        frame 4  — the strip with nothing left in it
#
# The harness is deterministic (virtual clock + seeded LCG), so re-running this
# reproduces the same take frame for frame.
set -euo pipefail
cd "$(dirname "$0")/.."

CROP="crop=1920:270:0:0"          # the grass strip only — no paddle, no ball
CASCADE_SECONDS=6.5               # frame 3's slot in the storyboard
X_CENTER="iw/2-(iw/zoom/2)"
Y_CENTER="ih/2-(ih/zoom/2)"

echo "==> bundling the game core"
# The harness runs the real engine, not a copy of it. dist/ ships bare
# extensionless imports that a browser cannot resolve, so bundle from source.
npx --yes esbuild@0.25.10 ../../packages/core/src/index.ts \
  --bundle --format=esm --outfile=tools/core-bundle.js --log-level=warning

echo "==> recording"
node tools/record.mjs record 36
node tools/record.mjs still 34.5 _empty-full.png

CLEARED=$(node -e "
const s = require('./assets/play-full.stats.json');
const f = s.frames.find((x) => x.aliveBricks === 0);
if (!f) { console.error('board never cleared'); process.exit(1); }
console.log(f.t);
")
echo "==> board cleared at ${CLEARED}s"

echo "==> stills"
ffmpeg -y -i assets/play-full.mp4 -ss 0 -frames:v 1 -vf "$CROP" assets/board-intact.png -loglevel error
ffmpeg -y -i assets/_empty-full.png -vf "$CROP" assets/board-empty.png -loglevel error
rm -f assets/_empty-full.png

echo "==> frame 2 clip"
# The push is baked in: HyperFrames hoists an approved <video> to the host root,
# so a transform applied inside the frame composition would not survive.
ffmpeg -y -i assets/play-full.mp4 -ss 0.25 -t 4.5 \
  -c:v libx264 -crf 14 -preset fast -pix_fmt yuv420p -an assets/_break-raw.mp4 -loglevel error
ffmpeg -y -i assets/_break-raw.mp4 \
  -vf "zoompan=z='if(lt(on,30),1,min(1+0.15*(on-30)/240,1.15))':x='${X_CENTER}':y='${Y_CENTER}':d=1:s=1920x720:fps=60" \
  -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -an assets/play-break-zoom.mp4 -loglevel error

echo "==> frame 3 clip"
CASCADE_RAW_SECONDS=$(node -e "console.log((${CLEARED} - 5.0).toFixed(3))")
ffmpeg -y -ss 5.0 -t "$CASCADE_RAW_SECONDS" -i assets/play-full.mp4 \
  -c:v libx264 -crf 14 -preset fast -pix_fmt yuv420p -an assets/_cascade-raw.mp4 -loglevel error
RAW=$(ffprobe -v error -show_entries format=duration -of csv=p=0 assets/_cascade-raw.mp4)
FACTOR=$(node -e "console.log((${RAW} / ${CASCADE_SECONDS}).toFixed(6))")
echo "    ${RAW}s → ${CASCADE_SECONDS}s (${FACTOR}x)"
# Order and fps here are both load-bearing. zoompan rebuilds timestamps, so it
# must run BEFORE setpts — after it, the speed-up is silently undone and the
# clip comes out at its source length. And zoompan defaults to 25fps output, so
# fps=60 must be explicit or the 60fps source is resampled and setpts then
# compresses the wrong frame count. Running on uncompressed frames means the
# pull-back is expressed in source frames: 4.2s of the finished 6.5s × FACTOR.
PULL_FRAMES=$(node -e "console.log(Math.round(4.2 * ${FACTOR} * 60))")
ffmpeg -y -i assets/_cascade-raw.mp4 \
  -filter:v "zoompan=z='max(1.15-0.15*on/${PULL_FRAMES},1.0)':x='${X_CENTER}':y='${Y_CENTER}':d=1:s=1920x720:fps=60,setpts=PTS/${FACTOR}" \
  -r 60 -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -an assets/play-cascade-zoom.mp4 -loglevel error
rm -f assets/_break-raw.mp4 assets/_cascade-raw.mp4

echo "==> done"
for f in assets/play-break-zoom.mp4 assets/play-cascade-zoom.mp4; do
  echo "    $f $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")s"
done
