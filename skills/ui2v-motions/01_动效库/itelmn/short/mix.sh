#!/usr/bin/env bash
# Mezcla del short: voz (ya en su lugar, arranca en 0) −15 LUFS, cama −26 con sidechain, SFX 0.7. Sin loudnorm al final.
set -euo pipefail
cd "$(dirname "$0")"
T=28.8; BGM=/tmp/bgm-eve/06.mp3; BGSS=${1:-0}
S=../../shorts-taller/sfx
R=$(ls -t renders/*.mp4 | head -1); TMP=$(mktemp -d)
ffmpeg -y -loglevel error -i voice/voice.wav -af "loudnorm=I=-15:TP=-1.5:LRA=11" -ar 48000 -ac 2 $TMP/voice.wav
ffmpeg -y -loglevel error -ss "$BGSS" -t 40 -i "$BGM" -af "loudnorm=I=-26:TP=-3:LRA=11,afade=t=in:d=0.3,afade=t=out:st=26.3:d=2.5" -ar 48000 -ac 2 $TMP/bgm.wav
# SFX (tiempo, archivo): del sfx.json de la composición
python3 - > $TMP/sfx.txt <<'PY'
import json
m={"boing":"pop","tick":"tick","cable-yank":"whoosh-short","power-down":"hit-low","frost":"card","power-up":"coin","melt":"whoosh-fly","pop":"pop","stamp":"stamp","tada":"ding","paper":"paper","riser":"riser","hit":"hit-sub"}
for k,ts in json.load(open("sfx.json")).items():
    for t in ts: print(f"{t:.3f} {m[k]}.wav")
PY
INPUTS=(-i $TMP/voice.wav -i $TMP/bgm.wav); F=""; MIXIN="[vb][bd]"; N=2; i=2
while read t f; do INPUTS+=(-i "$S/$f"); F="$F[$i:a]volume=0.7,adelay=$(python3 -c "print(int($t*1000))"):all=1,apad=whole_dur=${T}[s$i];"; MIXIN="$MIXIN[s$i]"; N=$((N+1)); i=$((i+1)); done < $TMP/sfx.txt
ffmpeg -y -loglevel error "${INPUTS[@]}" -filter_complex \
 "[0:a]apad=whole_dur=${T},asplit=2[va][vb];[1:a]atrim=0:${T},apad=whole_dur=${T}[bg];${F}[bg][va]sidechaincompress=threshold=0.02:ratio=8:attack=8:release=500[bd];${MIXIN}amix=inputs=${N}:normalize=0:duration=first[m];[m]atrim=0:${T}[out]" \
 -map "[out]" -ar 48000 $TMP/premix.wav
L=$(ffmpeg -i $TMP/premix.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
G=$(python3 -c "print(round(-14.5-($L),2))")
ffmpeg -y -loglevel error -i $TMP/premix.wav -af "volume=${G}dB,alimiter=limit=0.84" $TMP/mix.wav
ffmpeg -y -loglevel error -i "$R" -i $TMP/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -t $T short-ghosty-eve.mp4
echo "LUFS: $(ffmpeg -i short-ghosty-eve.mp4 -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')"
ffprobe -v error -show_entries stream=start_time -of csv=p=0 short-ghosty-eve.mp4 | head -2
