#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
FFMPEG="$PROJECT_DIR/../../node_modules/ffmpeg-static/ffmpeg"
VOICE="$PROJECT_DIR/assets/elevenlabs/cutsteward-voice-ben-v3.mp3"
MUSIC="$PROJECT_DIR/.media/audio/bgm/bgm_001.mp3"
OUTPUT_DIR="$PROJECT_DIR/assets/audio"
OUTPUT_BASENAME=${CUTSTEWARD_MIX_BASENAME:-cutsteward-30s-mix.wav}

case "$OUTPUT_BASENAME" in
  *[!A-Za-z0-9._-]* | "")
    echo "Invalid output basename: $OUTPUT_BASENAME" >&2
    exit 1
    ;;
esac

OUTPUT="$OUTPUT_DIR/$OUTPUT_BASENAME"

if [ ! -x "$FFMPEG" ]; then
  echo "Bundled FFmpeg not found: $FFMPEG" >&2
  exit 1
fi

for input in "$VOICE" "$MUSIC"; do
  if [ ! -f "$input" ]; then
    echo "Required input not found: $input" >&2
    exit 1
  fi
done

mkdir -p "$OUTPUT_DIR"

if [ -e "$OUTPUT" ]; then
  echo "Refusing to overwrite existing mix: $OUTPUT" >&2
  exit 1
fi

# Direct-to-master graph: no large intermediates. The measured loudnorm values
# are from a first pass over this exact graph and make the build reproducible.
FILTER_COMPLEX='[0:a]aresample=48000,pan=stereo|c0=0.7071*c0|c1=0.7071*c0,highpass=f=70,lowpass=f=17000,acompressor=threshold=0.08:ratio=3:attack=8:release=140:makeup=2.0:knee=2.8,adelay=550:all=1,apad=whole_len=1440000,atrim=end_sample=1440000,asetpts=N/SR/TB,asplit=2[voice_mix][voice_sc];
[1:a]aresample=48000,atrim=start=0:end=30,asetpts=N/SR/TB,highpass=f=35,lowpass=f=15000,volume=0.20,afade=t=in:st=0:d=0.8,afade=t=out:st=27.8:d=2.2[music_base];
[music_base][voice_sc]sidechaincompress=threshold=0.015:ratio=5:attack=20:release=450:makeup=1[music_duck];
[voice_mix][music_duck]amix=inputs=2:weights=1 1:normalize=0,atrim=0:30,asetpts=N/SR/TB,loudnorm=I=-16:TP=-1:LRA=7:measured_I=-19.26:measured_TP=-2.39:measured_LRA=11.30:measured_thresh=-30.30:offset=0.91:linear=false,aresample=48000,apad=whole_len=1440000,atrim=end_sample=1440000,asetpts=N/SR/TB[out]'

"$FFMPEG" \
  -hide_banner \
  -nostdin \
  -n \
  -i "$VOICE" \
  -i "$MUSIC" \
  -filter_complex "$FILTER_COMPLEX" \
  -map '[out]' \
  -map_metadata -1 \
  -ar 48000 \
  -ac 2 \
  -c:a pcm_s16le \
  "$OUTPUT"

echo "$OUTPUT"
