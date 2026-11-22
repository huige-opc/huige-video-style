# HUIGE Core on Windows

The Registry, Planner, Renderer and QA run on Windows 10/11. Two POSIX-only spots were made portable:
`core/pipeline.py` no longer imports `resource` unconditionally, and the shell scripts are invoked through
Git Bash with Windows paths converted to `/c/...` form. `scripts/assemble.sh` writes mixed (`C:/...`) paths
into the ffmpeg concat list and escapes drive colons in filter paths.

## Prerequisites

- **Node.js 20+** and **Git for Windows** (supplies `bash.exe` and `cygpath.exe`).
- **Python 3.10–3.13** for the Core environment. Python 3.14 is too new for the pinned `numpy==2.0.2`.
  A uv-managed CPython 3.12 works well.
- **FFmpeg with libass and libx264** on `PATH` (verify: `ffmpeg -filters | findstr ass`).
- **Chromium for Playwright**, or a local **Google Chrome** (`--browser` / `CHROME`).
- Fonts: the bundled Anton / Archivo Black / Playfair Display / Space Mono are used via `@font-face`.
  Install **Smiley Sans Oblique (得意黑)** for burned captions, **Inter** (the Google Fonts variable build,
  family `Inter` / `Inter Black`) and **Noto Sans CJK SC** (Regular + Bold for on-screen Chinese) and
  **Noto Sans CJK SC Black** (weight 900 headings) system-wide. `engine/engine.css` puts
  `'Noto Sans CJK SC Black'` first for `.cn`/`.chip`, so the display text keeps its Black weight.
  Emoji: Chrome/K.emoji uses the Windows **Segoe UI Emoji** face; installing Noto Color Emoji is optional.
  Windows has no `/usr/share/fonts`; libass falls back to DirectWrite, so the fonts must be installed,
  not only present in a folder.

## Install

Run these from `HUIGE-Core`:

```bat
:: 1. Core Python environment (use a 3.10-3.13 interpreter)
py -3.12 -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements-core.txt

:: 2. Node dependencies + the exact Chromium build pinned by package-lock.json
npm ci
npx playwright install chromium

:: 3. Templates (repeat for each TNN-1.0.0.zip)
.venv\Scripts\python.exe tools\packages\install.py --root .. install-template ..\T01-1.0.0.zip --id T01 --version 1.0.0
.venv\Scripts\python.exe tools\packages\install.py --root .. list
```

## Edit a video

This pipeline is the **automatic adapter: a rough draft generator only**. It refuses to run without
`--allow-draft`, and its output must never be delivered. Deliveries use the manual section workflow
(`template/section/` + hand-written `scenes.js` with the template helpers) from the parent `SKILL.md`.

```bat
.venv\Scripts\python.exe core\pipeline.py edit raw\talk.mp4 jobs\t01 ^
  --install-root .. --templates T01 --aspect 16:9 --srt raw\talk.srt --allow-draft
```

- ASR is not bundled. Supply `--srt`, or pass `--transcript-json` with an existing word-timed result:
  local Whisper (openai-whisper / faster-whisper), the Volcengine (火山) helper JSON from
  `tools/video/video-use-pro/helpers/volc_transcribe.py`, a Fish/talkcraft `timestamps.json`, or a generic
  segments/words JSON. `scripts/import_transcript.py` converts any of them to the planner transcript:
  ```bat
  :: local Whisper JSON
  whisper raw\talk.mp4 --model small --language zh --output_format json --output_dir asr
  .venv\Scripts\python.exe core\pipeline.py edit raw\talk.mp4 jobs\v1 ^
    --install-root .. --templates T01 --aspect 16:9 --transcript-json asr\talk.json

  :: 火山 ASR (existing helper, needs its .env and `requests`)
  python ..\..\tools\video\video-use-pro\helpers\volc_transcribe.py raw\talk.mp4 --edit-dir asr --gain 19
  .venv\Scripts\python.exe core\pipeline.py edit raw\talk.mp4 jobs\v1 ^
    --install-root .. --templates T01 --aspect 16:9 ^
    --transcript-json asr\transcripts\talk_volc.json
  ```
- Use `--browser "C:\Program Files\Google\Chrome\Application\chrome.exe"` to render with system Chrome
  instead of Playwright's Chromium. The pipeline also reads the `CHROME` environment variable.
- Multi-template: `--templates T01,T17 --mode multi` (both must be installed and support the aspect).
  For a whole talking-head video, prefer **3–5 compatible templates** in `multi` mode, e.g.
  `--templates T01,T13,T17,T23,T05 --mode multi`: each section switches visual system (lime kinetic → tech blue →
  science glow → creative pop → red finale). A single template repeats one system for the entire clip and looks
  like the template demo, not an edit.
- T26 is 9:16 only. T19/T24/T26 use `scripts/matte.py`; its GPL-3.0 ONNX model is downloaded on first use.

Outputs land in `jobs\<name>\out`: `preview.mp4`, `final.mp4`, `captions.srt`, `report_*.json`, with QA under
`jobs\<name>\qa\`. A job that failed once records `out\failure.json`; a later successful resume removes it.

## Verified on this machine (2026-11-22)

- Windows 11, Node 24.15, Python 3.12.13 venv, FFmpeg 9.0.2 (libass), Git Bash + cygpath.
- Playwright: skill 1.65.1 / Chromium 1255, HUIGE-Core 1.65.0 / Chromium 1254; system Chrome also works.
- Fonts installed: Inter variable (`Inter` / `Inter Black`), Noto Sans CJK SC Regular + Bold, Noto Sans CJK SC Black,
  Noto Color Emoji; `.cn` / `.chip` prefer the Black family. Windows Segoe UI Emoji remains as fallback.
- Matte: RVM `rvm_mobilenetv3_fp32.onnx` cached with the locked SHA-256; `scripts/matte.py` tested on real frames.
- Full renders at 1920×1080 / 1080×1920, 30 fps: T01 16:9 and 9:16, T24 16:9 (cut-out), T26 9:16 (cut-out),
  T19 16:9, T27 16:9, and multi-template T01+T17 16:9 — all final files produced, QA 0 FAIL
  (the only warnings are expected: a still-image test source, or a tone test track).
- Imported 11.4 s Volcengine transcript (`--transcript-json`, real word timings) covered the whole pipeline;
  no ASR installation was needed.
- Real 40 s talking-head clip (1920×1080, imported Volcengine transcript, T01 16:9): final render + QA PASS (36/36).
  Chinese card titles now split at punctuation / particles / demonstratives instead of an 8-character slice
  (`core/planner.py` `cjk_chunks`), e.g. “给你三个方法” rather than “我今天啊给你三个”.
- All 23 installed templates pass their Stage-A page/asset QA (`qa pre`) on Windows.
- The manual section workflow in the parent `SKILL.md` is unchanged and also renders on Windows.
