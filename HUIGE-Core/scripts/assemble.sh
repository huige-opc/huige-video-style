#!/usr/bin/env bash
# Huige Video Style · final assembly.
#   1. concat the silent section renders (in order)
#   2. mix Huige's original voice + the SFX stem, loudness-normalized to -16 LUFS (no music by default;
#      MUSIC_STEM=music_stem.wav adds the ducked bed made by scripts/music.py, only when background_music is auto/manual)
#   3. write a Clean master and a burned bilingual CN-EN master
#   4. automatic post-render QA (qa/, Stage B) on both masters -> OUT_BASENAME_qa/qa-report.json + qa-summary.md
# usage: assemble.sh SOURCE_VIDEO SFX.wav CAPTIONS.ass OUT_BASENAME section1.mp4 section2.mp4 ...
# QA:   HUIGE_QA=block (default) exit 3 when QA finds a confirmed defect (FAIL) | report (never fail) | off (skip)
#       HUIGE_QA_ARGS="--template T17 --plan plan.json --aspect 9:16"  extra arguments for python3 -m qa post
set -euo pipefail
src="$1"; sfx="$2"; ass="$3"; base="$4"; shift 4
[ -e "${base}_CN-EN.mp4" ] && { echo "Refusing to overwrite ${base}_CN-EN.mp4" >&2; exit 1; }
work="$(mktemp -d)"; trap 'rm -rf "$work"' EXIT
# ffmpeg is a native binary: the concat list must hold Windows paths (Git Bash realpath gives /c/...)
for s in "$@"; do
  p="$(realpath "$s" 2>/dev/null || printf '%s' "$s")"
  if command -v cygpath >/dev/null 2>&1; then p="$(cygpath -m "$p")"; fi
  printf "file '%s'\n" "${p//\\//}"
done > "$work/list.txt"
ffmpeg -loglevel error -y -i "$src" -vn -ac 2 -ar 48000 "$work/voice.wav"
if [ -n "${MUSIC_STEM:-}" ]; then
  [ -f "$MUSIC_STEM" ] || { echo "MUSIC_STEM not found: $MUSIC_STEM" >&2; exit 1; }
  ffmpeg -loglevel error -y -i "$work/voice.wav" -i "$sfx" -i "$MUSIC_STEM" -filter_complex "[1]aformat=channel_layouts=stereo[s];[2]aformat=sample_rates=48000:channel_layouts=stereo[m];[0][s][m]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-16:TP=-1.5:LRA=7" -ar 48000 "$work/mix.wav"
else
ffmpeg -loglevel error -y -i "$work/voice.wav" -i "$sfx" -filter_complex "[1]aformat=channel_layouts=stereo[s];[0][s]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=7" -ar 48000 "$work/mix.wav"
fi
ffmpeg -loglevel error -y -f concat -safe 0 -i "$work/list.txt" -i "$work/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "${base}_Clean.mp4"
# ffmpeg filter paths: forward slashes and an escaped drive colon are required on Windows
filter_path() {
  p="$1"
  if command -v cygpath >/dev/null 2>&1; then p="$(cygpath -m "$p")"; fi
  p="${p//\\//}"
  printf '%s' "${p//:/\\:}"
}
fontsdir="${FONTSDIR:-/usr/share/fonts}"
ass_f="$(filter_path "$ass")"; fonts=""
[ -n "$fontsdir" ] && [ -d "$fontsdir" ] && fonts=":fontsdir='$(filter_path "$fontsdir")'"
ffmpeg -loglevel error -y -i "${base}_Clean.mp4" -vf "scale=in_range=full:out_range=tv,format=yuv420p,ass='${ass_f}'${fonts}" \
  -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -color_range tv -c:a copy -movflags +faststart "${base}_CN-EN.mp4"
echo "frames: $(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "${base}_CN-EN.mp4")  (source: $(ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$src"))"
ffmpeg -nostats -i "${base}_CN-EN.mp4" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
echo "wrote ${base}_Clean.mp4 and ${base}_CN-EN.mp4"
qa_mode="${HUIGE_QA:-block}"
if [ "$qa_mode" != "off" ]; then
  root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
  if python3 -c "import numpy, cv2" 2>/dev/null; then
    srt="${ass%.ass}.srt"; qa_srt=(); [ -f "$srt" ] && qa_srt=(--srt "$srt")
    # sections are rendered at 30 fps from frames extracted at 30 fps, so the master must hold duration x 30 frames
    nsrc="$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$src" | awk '{printf "%d", $1 * 30 + 0.5}')"
    qa_rc=0
    # shellcheck disable=SC2086
    PYTHONPATH="$root${PYTHONPATH:+:$PYTHONPATH}" python3 -m qa post "${base}_CN-EN.mp4" --clean "${base}_Clean.mp4" --source "$src" --ass "$ass" \
      ${qa_srt[@]+"${qa_srt[@]}"} --expected-frames "$nsrc" --out "${base}_qa" ${HUIGE_QA_ARGS:-} || qa_rc=$?
    if [ "$qa_rc" = 1 ] && [ "$qa_mode" = "block" ]; then
      echo "QA FAIL: see ${base}_qa/qa-summary.md (HUIGE_QA=report to deliver anyway)" >&2; exit 3
    fi
    if [ "$qa_rc" -gt 1 ]; then echo "QA could not run (exit $qa_rc); see the message above" >&2; fi
  else
    echo "QA skipped: python3 with numpy + opencv is not available (pip install numpy opencv-python-headless)" >&2
  fi
fi
