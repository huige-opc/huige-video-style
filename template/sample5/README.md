# 5-second template samples

New templates (T24 onward) are demoed on one short clip: a 5-second AI-presenter take (`templatechoose_demo.mp4`). Short samples are quicker to render and review than the 15-second intro used by `template/demo/`.

`sample.js` holds the shared settings (`S5.END`, the presenter source, `S5.cut(t)` for the AI cut-out frame at time `t`).

| Folder | What it shows |
|---|---|
| `t24/` | T24 Luxury Nude Motion, 5 s sample |
| `t24-layouts/` | all eight T24 layouts in turn (2 s each), a reference for every layout call |
| `t26/` | T26 Vintage Story (9:16 only): all nine layouts in turn, 1.6 s each (14.4 s total). Copied from the T26 package `runtime/` (same code the automatic adapter uses). |
| `t27/` | T27 Video Wall Kinetic Typography, 5 s sample. Copied from the T27 package `runtime/`; needs the cut-out frames for the presenter. |

## Media

Put the clip's frames in `template/sample5/media/` (not in the repository):

```bash
scripts/extract_frames.sh templatechoose_demo.mp4 template/sample5/media/huige
python3 scripts/matte.py template/sample5/media/huige 0 149 template/sample5/media/cut   # cut-out for T24 / T27
```

T26 is vertical and reads `template/sample5/media26/huige` + `media26/cut` (1080×1920 frames). Its scene defaults to
`../../sample5/media26`; override with `window.HUIGE_TEMPLATE_MEDIA` or place the frames there.

```bash
node scripts/render.mjs template/sample5/t24/index.html --out out/t24.mp4
node scripts/render.mjs template/sample5/t27/index.html --out out/t27.mp4
node scripts/render.mjs template/sample5/t26/index.html --ar 9:16 --out out/t26.mp4
```

The `--ar` flag sets a portrait viewport and `window.EV_AR`; without it the renderer is 16:9. Then add the voice, SFX and
captions as in [`references/pipeline.md`](../../references/pipeline.md).
