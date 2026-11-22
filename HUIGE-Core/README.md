# HUIGE Core 1.0.1

This repository includes HUIGE Core and all 23 template packages under `templates/`. It runs the account-free MP4 → SRT/transcript → Planner → Registry → Renderer → QA pipeline. Published at `https://github.com/huige-opc/huige-video-style` under the MIT license.

## Prerequisites

Node 20+, Playwright/Chromium, Python 3.10-3.13 and libass-enabled FFmpeg. Run `npm ci` and install `requirements-core.txt`. The user configures their own ASR (local Whisper or Volcengine) and TTS (Fish or another engine); this skill does not install them. Provide speech timing as an SRT or imported transcript.

On Windows (Git Bash, Python 3.12 venv, fonts, Chromium, SRT mode) follow [docs/windows.md](docs/windows.md).

## Install and edit

```sh
python HUIGE-Core/tools/packages/install.py --root . list
# draft adapter only: never deliver its output (delivery = manual section workflow + hand-written scenes.js)
python HUIGE-Core/core/pipeline.py edit talk.mp4 jobs/t03 --templates T03 --aspect 9:16 --srt talk.srt --allow-draft
python HUIGE-Core/core/pipeline.py edit talk.mp4 jobs/mix --templates T01,T17,T23 --mode multi --aspect 16:9 --srt talk.srt --allow-draft
```

Outputs are `JOB/out/preview.mp4`, `JOB/out/final.mp4`, captions, logs and QA reports. No Studio account, billing or cloud service is used. See `docs/independent-core.md`.
