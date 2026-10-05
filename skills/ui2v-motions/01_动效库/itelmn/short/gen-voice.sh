#!/usr/bin/env bash
# Voz de Ghosty (em_santa), frase por frase; imprime en qué segundo arranca cada una.
set -euo pipefail
cd "$(dirname "$0")"
LINES=(
"Soy Gósti, y te hice un video sobre agentes durables."
"Este agente lleva un registro de cada paso que termina, en Póstgres."
"Le corto la luz en el paso tres."
"Cuando vuelve, lee el registro y sigue en el cuatro. No repite nada."
"En el video lo armamos con ib, el freimwork de Vércel. Con Póstgres y Dóquer, corriendo en una caja de Ísibits."
"Está completo en yutub. Sale hoy, no te lo pierdas. Fixterguic."
)
GAPS=(0.5 0.5 0.8 0.6 0.5 0.4); t=0; rm -f voice/list.txt; : > voice/marks.txt
for i in "${!LINES[@]}"; do
  n=$(printf "%02d" $i)
  [ -f voice/$n.wav ] || npx hyperframes@0.8.44 tts -v em_santa -l es -o voice/$n.wav "${LINES[$i]}" >/dev/null 2>&1
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 voice/$n.wav)
  echo "$n  start=$t  dur=$d  ${LINES[$i]}" | tee -a voice/marks.txt
  g=${GAPS[$i]}; ffmpeg -y -loglevel error -f lavfi -i anullsrc=r=24000:cl=mono -t $g voice/gap$n.wav
  echo "file '$n.wav'" >> voice/list.txt; echo "file 'gap$n.wav'" >> voice/list.txt
  t=$(python3 -c "print(round($t+$d+$g,2))")
done
ffmpeg -y -loglevel error -f concat -safe 0 -i voice/list.txt -ar 48000 -ac 2 voice/voice.wav
echo "TOTAL voz: $t s"
