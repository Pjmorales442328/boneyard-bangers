#!/usr/bin/env bash
# Trims, levels and converts the crowd reaction sounds in raw-assets/sfx into public/sfx/*.mp3. Needs ffmpeg.
# Sources (all CC0, freesound.org) are listed in README.md; each file is named after the verdict it plays for.
set -euo pipefail
cd "$(dirname "$0")/../raw-assets/sfx"
out=../../public/sfx
mkdir -p "$out"
for f in *.mp3; do
  n=${f%.mp3}
  chain="silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.01,atrim=0:4.5,afade=t=out:st=3.9:d=0.6"
  peak=$(ffmpeg -hide_banner -i "$f" -af "$chain,volumedetect" -ac 1 -f null - 2>&1 | sed -n 's/.*max_volume: \(-\?[0-9.]*\) dB/\1/p')
  gain=$(awk "BEGIN{print -3-($peak)}")
  ffmpeg -v error -y -i "$f" -af "$chain,volume=${gain}dB" -ac 1 -ar 44100 -b:a 96k "$out/$n.mp3"
done
ls "$out" | wc -l
