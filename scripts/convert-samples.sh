#!/usr/bin/env bash
# Trims, levels and converts raw VCSL wavs in raw-assets/samples into public/samples/*.mp3. Needs ffmpeg.
set -euo pipefail
cd "$(dirname "$0")/../raw-assets/samples"
out=../../public/samples
dur() { case $1 in kick*) echo 0.35;; snare*|tamb*) echo 0.5;; hat*|shake*) echo 0.3;; clap*) echo 0.4;; organ*) echo 2.2;; glock*) echo 2.0;; xylo*) echo 1.0;; *) echo 1.6;; esac; }
for f in *.wav; do
  n=${f%.wav}; d=$(dur "$n"); fade=$(awk "BEGIN{print $d-0.15}")
  # cut leading silence so every sample starts on its attack; timing depends on it
  chain="silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.004,atrim=0:$d,afade=t=out:st=$fade:d=0.15"
  peak=$(ffmpeg -hide_banner -i "$f" -af "$chain,volumedetect" -ac 1 -f null - 2>&1 | sed -n 's/.*max_volume: \(-\?[0-9.]*\) dB/\1/p')
  gain=$(awk "BEGIN{print -3-($peak)}")
  ffmpeg -v error -y -i "$f" -af "$chain,volume=${gain}dB" -ac 1 -ar 44100 -b:a 96k "$out/$n.mp3"
done
ls "$out" | wc -l
