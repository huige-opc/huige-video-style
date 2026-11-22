# Independent HUIGE Core and template packages

This release-candidate workflow is local and account-free. It does not use HUIGE Video Studio, Modal, Vercel, R2, Stripe, or a private API.

## What gets installed

- `HUIGE-Core.zip`: Skill, transcript importer, Content Planner, Template Registry, Engine, Renderer, captions and QA.
- 23 source-backed `TNN-1.0.0.zip` archives: T01–T07, T09–T17, T19–T21, T23–T24 and T26–T27. Each contains only that template's original scene, automatic-edit registration/configuration, metadata and dependency documentation.
- Model weights are not inside any ZIP; the presenter-cutout model downloads on first use.

The template Registry refuses an absent template, multiple installed versions of the same ID, an incompatible Core/Engine/plan schema, a non-renderable template, or an unsupported aspect ratio. The 23 v1.0 release records are publicly downloadable; excluded, planned and retired IDs remain closed.

## 1. Install Core

```sh
mkdir huige-video-style
unzip HUIGE-Core.zip -d huige-video-style
cd huige-video-style/HUIGE-Core

python3 -m venv .venv
.venv/bin/pip install -r requirements-core.txt
npm ci
```

Install a Chromium-compatible browser. You may use Playwright's Chromium or an existing Chrome executable. FFmpeg must include the `ass` or `subtitles` filter; a minimal FFmpeg build cannot burn or verify captions. The user configures ASR (local Whisper or Volcengine) and TTS (Fish or another engine) separately; this skill does not install them.

```sh
ffmpeg -hide_banner -filters | grep -E ' ass | subtitles '
```

On macOS, Homebrew's keg-only `ffmpeg-full` supplies libass. Either put its `bin` directory on `PATH` or pass `--ffmpeg-dir /opt/homebrew/opt/ffmpeg-full/bin` to the pipeline.

## 2. Install or remove templates

```sh
python tools/packages/install.py --root .. install-template ../../T01-1.0.0.zip --id T01 --version 1.0.0
python tools/packages/install.py --root .. list
python tools/packages/install.py --root .. uninstall --id T01 --version 1.0.0
```

Install any v1.0 template in the same way. The installer verifies the archive's internal checksum manifest and safe paths. Compare the archive SHA-256 with `SHA256SUMS`. T08/T25/T28 have no v1.0 ZIP; T18/T22 are retired. T26 installs and renders as Vintage Story / 复古拼贴故事 in 9:16 only. The Registry correctly rejects a T26 request with `--aspect 16:9`.

## 3. Edit a raw MP4 (draft adapter only)

**Delivery rule:** this adapter is a rough draft generator. It refuses to run without `--allow-draft`, and its
output must never be delivered; masters come from the manual section workflow (`template/section/` +
hand-written `scenes.js` with the template helpers). The command below is for drafts only.

Run from `HUIGE-Core`. This command performs word-timed planning from a supplied SRT, a watermarked preview, the full-resolution final render and QA:

```sh
.venv/bin/python core/pipeline.py edit raw/talk.mp4 jobs/t01 \
  --install-root .. \
  --templates T01 \
  --aspect 9:16 \
  --srt raw/talk.srt \
  --browser "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --ffmpeg-dir /opt/homebrew/opt/ffmpeg-full/bin
```

For landscape T17, use `--templates T17 --aspect 16:9`. To mix compatible installed templates, use:

```sh
.venv/bin/python core/pipeline.py edit raw/talk.mp4 jobs/mixed \
  --install-root .. --templates T01,T17 --mode multi --aspect 9:16 \
  --srt raw/talk.srt
```

`--mode multi` uses the requested order and cuts at a real pause near each section boundary. `--mode auto` chooses how many of the explicitly supplied installed templates fit the clip. It never reaches into an uninstalled or Studio-private catalog.

T26 requires the Core environment from `requirements-core.txt`. On first use, `scripts/matte.py` downloads the RVM MobileNetV3 ONNX model into the user's cache, verifies the SHA-256 pinned in `core.lock.json`, and creates a private alpha-frame sequence from the user's MP4. The GPL-3.0 model, matte frames and user media are never put in a template ZIP:

```sh
.venv/bin/python core/pipeline.py edit raw/talk.mp4 jobs/t26 \
  --install-root .. --templates T26 --aspect 9:16 \
  --srt raw/talk.srt
```

## 4. Supply speech timing

Pass `--srt raw/talk.srt`. The original SRT is copied, never edited. Word times are interpolated inside each cue for planning. ASR is not bundled.

To keep real word timestamps from an ASR you already run, pass `--transcript-json FILE` instead. Accepted inputs are auto-detected by `scripts/import_transcript.py`: local Whisper (openai-whisper / faster-whisper `segments[]` with optional `words[]`), the Volcengine (火山) helper JSON (`utterances[]` with `words[]`, seconds), a Fish/talkcraft `timestamps.json` (`sentences[]` with `words[]`), or a generic segments/words JSON. The importer writes `talk.asr.json`, `talk.transcript.js` and an editable source-language SRT under `JOB/srt/`.

```sh
whisper raw/talk.mp4 --model small --language zh --output_format json --output_dir asr
.venv/bin/python core/pipeline.py edit raw/talk.mp4 jobs/t01 \
  --install-root .. --templates T01 --aspect 9:16 --transcript-json asr/talk.json
```

For best results, use sentence-sized cues rather than one cue covering the entire clip. The QA report flags cues that are too short, too long or extend past the video.

## Outputs and failure handling

- `JOB/out/preview.mp4`: 720×1280 or 1280×720, watermarked, limited to the requested preview duration.
- `JOB/out/final.mp4`: 1080×1920 or 1920×1080, the complete input length, H.264/AAC, captions burned, original voice plus procedural SFX.
- `JOB/out/captions.srt`: editable delivered captions.
- `JOB/out/report_preview.json` and `report_final.json`: dimensions, duration, template versions and QA verdict.
- `JOB/qa/pre` and `JOB/qa/post*`: machine-readable report, summary and evidence.
- `JOB/logs`: every local command and exit code.
- `JOB/out/failure.json`: failed stage, command and log location.

QA FAIL blocks output acceptance. WARN does not silently disappear: inspect its evidence and record the decision. Rerunning the identical command resumes completed stages; changing input, install root or options requires a new job directory.

HUIGE Core has no fixed duration or file-size cap: the final render always covers the complete input (minimum 3 seconds), split into 10-second render chunks with global timestamps, one continuous audio track and one caption file. `--preview-seconds` only sets the length of the quick watermarked preview. A host application may impose its own policy with `--max-seconds` / `--max-bytes` (or the `max_seconds` / `max_bytes` options); both default to no limit, and an over-limit input is rejected before any work, never cut. Practical limits are your machine's render time, disk space and memory. Inter and Noto Sans CJK SC are host font dependencies. The ZIP includes Anton, Archivo Black, Playfair Display and Space Mono plus their OFL texts.

## Current package boundary

All 23 v1.0 templates pass automatic SRT editing in every declared aspect: 22 pass 16:9 and 9:16, while T26 passes 9:16 and rejects unsupported 16:9. T01 and T26 also pass the raw-MP4 + supplied-SRT path, and T03+T17 plus T17+T26 pass compatible multi-template jobs. T01/T02/T09/T17/T20/T21/T23 use automatic skins extracted from the existing runtime; T26 loads its own nine-layout runtime library; the remaining templates use the shared Core adapter plus template-owned visual configuration. Original manual scenes are packaged byte-for-byte, but automatic adapter visuals still require product-owner regression approval.

T18/T22 remain retired. T08/T25/T28 are excluded; the historical `template/industry/t26/` directory is identified as T28 Real Estate provenance and is never packaged as T26. T26 and the other 22 release templates are rights-cleared as public downloads. That clearance covers the source-only packages, not generated demos, user footage, separately downloaded model weights, private Studio assets or future templates. The local candidate remains unpublished until the owner separately approves the remote publication action.
