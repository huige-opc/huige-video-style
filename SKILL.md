---
name: huige-video-style
description: Edit talking-head videos in Huige Video Style — kinetic motion graphics, a morphing presenter window, solid high-saturation color cards, bilingual Chinese + English captions, and no background music. Use when asked to edit, design, or animate a talking-head / vlog / product-promo video "in Huige Video Style", or when given a raw video plus a bilingual SRT to turn into a motion-designed video.
---

# Huige Video Style

A motion-design house style for Huige's talking-head videos (bilingual creator, Chinese + English). The speaker stays on screen the whole time inside a window that keeps changing shape, while bold solid-color cards, giant condensed words and real screen recordings pop in exactly on the words she says.

Read these before building:
- `references/templates.md` — **the 22 named templates (T01–T21, T23 and T24; T18 and T22 were retired)** with sample images. The user picks them by ID or name ("use T10 HUD Keynote for this part").
- `references/style-guide.md` — the look: palette, type, Huige window, motion vocabulary, themes, signature beats, captions.
- `references/pipeline.md` — step-by-step production, from raw video to delivered masters.
- `references/engine-api.md` — how to write a section with the bundled engine (`engine/`, `template/section/`).
- `references/concept-sections.md` — turning a 10 s T30–T200 concept into an N-second hand-written section: timing, window continuity, scene boundaries, clarity rules and the layout gate.
- `references/architecture-and-positioning.md` — how `template/` and `templates/` fit together, demo vs sample5 vs concepts vs examples, editing vs generation positioning, and the presenter-screen-share issue.

## Templates

| ID | Chinese name | Name | Best for |
|---|---|---|---|
| T01 | 酸性青柠 | Acid Lime Kinetic | openings, hooks, bold claims, wins |
| T02 | 电光蓝控制台 | Electric Blue Console | numbers, results, comparisons |
| T03 | 暗黑 3D 舞台 | Dark 3D Stage | real screen recordings, demos |
| T04 | 纸张 | Paper | pain points, calm explanations |
| T05 | 红色放射 | Red Sunburst | key point, call to action, finale |
| T06 | 品牌紫 | Brand Purple | product reveal |
| T07 | 卡通 Huige | Cartoon Huige | storytelling (needs her cartoon clips) |
| T08 | 霓虹讲解 | Neon Explainer | explaining a concept, tutorials |
| T09 | 作品墙开场 | Showcase Wall Opener | channel/series openings, launches |
| T10 | HUD 发布会 | HUD Keynote | announcements, milestones |
| T11 | HUD 仪表盘 | HUD Dashboard | how-to, workflows, features, iteration |
| T12 | 旧报纸 | Old Newspaper | stories, look-backs, opinion, calling out a problem |
| T13 | 科技蓝 | Tech Blue | tech, AI and product talks, agendas, chapter titles, comparing options |
| T14 | 未来科技 | Future Style | big news, rules / key points, AI and future topics, endings |
| T15 | 学习风 | Learning Style | education, study tips, vocabulary and reading, videos for kids and parents |
| T16 | 漫画风 | Comic Pop | playful talks, before-vs-after comparisons, key points, tip lists |
| T17 | 科学风 | Science Network | tech and AI trends, science topics, how learning works, future outlooks |
| T20 | 快节奏社媒 | Fast-Paced Social Media | TikTok / Shorts / Reels energy: kinetic word-by-word captions, stickers, beat cuts (laid out 16:9) |
| T21 | 简洁极简 | Clean & Minimal | tutorials, business analysis, education: serif headlines, hairlines, slow motion |
| T23 | 创意波普 | Creative Pop | playful tutorials, step lists, workflows, creator tips: seven-colour rounded cards, big keyword stickers, simple icons, arrows, sparkles; seven layouts (splash, 7-step row, hub, vertical cards, path, split showcase, icon burst) |
| T24 | 奢华裸色 | Luxury Nude Motion | premium personal-brand talks, frameworks, step-by-step methods, product intros: solid nude stage #D8C5B5, presenter cut-out with a soft shadow, large 3D white type, floating ivory cards, numbered steps, fine icons, light-sweep transitions; eight layouts (hero, steps, icon tiles, orbit, statement, feature card, timeline, icon grid) |
| T19 | 真实影像引入 | Footage Intro | bringing in real footage / news clips: cut-out + fast swaps through the background images or footage the user imports (no bundled images), footage push-in, presenter circle that keeps the footage clear, captions that move off the footage |

When the user names templates, use exactly those for those parts. When they don't, choose per section from "Best for" and follow the mixing rules in `references/templates.md`. T08–T17, T23 and T24 have ready-made helpers in `engine/templates.js`. T01–T23 have a full demo section in `template/demo/t01` … `template/demo/t23` (all on the same 15 s intro, so they are easy to compare and copy from). From T24 on, new templates get a short sample instead, in `template/sample5/`: `t24/` plus `t24-layouts/` (5 s, all eight layouts), `t26/` (9:16 only, all nine layouts at 1.6 s each) and `t27/` (5 s video-wall). T26 needs `--ar 9:16` when rendering; its frames live in `sample5/media26/`. T24 cuts the presenter out with `scripts/matte.py`, like T19. T19 also uses `scripts/matte.py` (AI cut-out, keeps natural face colour; the GPL-3.0 model downloads on first use) and `scripts/caption_zones.py` (moves each caption to the clearest zone and adds a soft plate on busy footage). T19 never ships or invents background images: it only uses images and clips the user provides (their footage, screen recordings, photos), passed in as frame folders. Never draw brand logos on a T19 title card, and remove logos visible in imported backgrounds; its headline and tags come only from the script. Every template is 16:9 (1920×1080); vertical references are re-laid out for landscape.

## Typography, reveal and density (accepted 2026-11-22)

- Keep each template's own type system; never flatten every section to one default bold font.
- Three-level hierarchy: mono/small-caps kicker → one display line → light body/subline. Never stack several equal-size 900-weight blocks.
- Centre text vertically in cards/pills; shared 110 px left margin and 44 px inner padding.
- Reveal every element at the spoken word/cue from the SRT/ASR; never batch-reveal early or leave a planned element outside the section's time range.
- Give each element a real entrance. Idle motion only when it carries information: scan line, light sweep, path draw, counter, camera push, or a glow pulse tied to a spoken beat. **No cheap motion (2026-11-23):** no whole-card bobbing, breathing, shaking, jitter or random float just to look animated. Static is better than decorative motion. Minimal templates stay restrained. Accepted motion reference: `projects/20261122_HUIGE风格基线/out/FULL117_CN-EN.mp4`.
- Auxiliary elements are content-related (arrows, book stairs, mic/film icons, stamps, comparison labels), never random decoration.
- Read `references/typography-and-reveal.md` before building; the accepted 117.7 s master lives in `projects/20261122_HUIGE风格基线/`.

## Concept templates T30–T200

162 additional free concept templates are installed in `template/concepts/` (T30–T200; not every ID is used). Each is a 10-second, silent, three-scene story with bilingual **sample** captions and real transitions (push / rise / zoom / iris / wipe / flip / shutter / blur / slide); the presenter window morphs between scenes. All are 16:9 and 9:16; those marked `logo/text only` need no presenter footage. Sample copy and numbers are illustrative (marked 示例 / sample on screen) — replace them before delivering.

```bash
node scripts/render.mjs template/concepts/t101/index.html --stills check/t101 --times 2,5 \
  --query "huige=/absolute/path/to/frames&srcw=1920&srch=1080"
node scripts/render.mjs template/concepts/t101/index.html --ar 9:16 \
  --query "huige=/absolute/path/to/frames&srcw=1920&srch=1080" --out out/T101_9x16.mp4
```

The concepts load `engine/tmotion.js` (installed) and expect presenter frames via `--query huige=...`; no frames are bundled.

### Turning a 10 s concept into an N-second section
Full recipe, worked frame map and checklist: `references/concept-sections.md`.
- Copy `template/concepts/tNNN`; point `index.html` at `../engine` and add `engine/tmotion.js`.
- Set `M.TB` (the three scene ranges) before `M.story`, and pass `dur` (section seconds) plus `end:false` (no automatic full-frame return). `M.story` also accepts `trd` (transition length; 0.3–0.35 s is safest).
- After `M.story`, override `C.src0`, `C.end`, `C.huigeDir`, `C.face` and `C.src`, then set `C.huigeKeys` by hand so the window starts and ends exactly on the neighbouring sections' poses. A two-step pose (shrink to a corner, then fly to the target) keeps the window from crossing headlines.
- Put each scene boundary on the spoken topic change, not on the template's 10 s grid, and fade the previous topic's cards out 0.2–0.3 s before the boundary.
- Prefer clip transitions (`wipe`, `shutter`, `zoom`): `push` leaves old-scene strips at the frame edge, and `flip` exposes the stage background.
- Write `caps: []` and let the delivered bilingual ASS supply captions.
- Four accepted reference implementations live in `template/examples/`: `f0-flashcut-t159`, `f5-paint-t139`, `f6a-bento-t158`, `f6b-spectrum-t106` (300 / 405 / 500 / 352 frames). Copy one as a starting point; its README lists the frame map and the rules encoded.

## Non-negotiables

1. **16:9, 1920×1080, 30 fps.** No chapter bars, shot numbers, timecodes or watermarks in the output.
2. **No background music, ever.** This includes music inside any clip or template, which must be muted. Keep the speaker's original voice untouched (trim only). Add short SFX only (whoosh, pop, click, impact, ding, applause). Final loudness is about **-16 LUFS**.
3. **The speaker's whole head is always visible**, from hair to chin, in every window shape. Never crop the face; calibrate the face position on every new shoot.
4. **Never overwrite** source videos, old projects or approved samples. Every output goes to a new versioned folder (`v1_samples/`, `v1_full/`, `v2_full/` ...).
5. **Never invent facts, numbers or software screens.** Show real UI only from real screen recordings. Label anything conceptual `ILLUSTRATIVE` and draw it without fake numbers. Show stated results (scores, prices, dates) exactly as spoken.
6. **Bilingual captions:** Chinese line on top, English line underneath, built from the speaker's bilingual SRT. Obvious typos or machine-translation errors may be fixed **in the burned captions only**. Never edit the original SRT, and tell the user which lines were corrected.
7. **When only captions change, don't touch the video design.**
8. **Workflow:** for a new series or a first video, make about three short sample sections in different themes, get approval, then do the full video. For a follow-up video in an approved style, go straight to the full video.

## Deliverables

- `NAME_CN-EN.mp4`: burned bilingual captions.
- `NAME_Clean.mp4`: no captions. Skip it if the user says they only want the captioned version.
- `NAME_CN-EN.srt`: editable paired captions.
- The SFX stem (`.wav`) and an editable project zip.

## Quick start

```bash
# 1. media
scripts/extract_frames.sh raw/talk.mp4 media/huige          # speaker as 30 fps JPGs
scripts/extract_frames.sh raw/screen.mp4 media/screen     # real screen recording(s)
# 2. sections: copy template/section/ per 15–40 s chunk, write scenes.js (see references/engine-api.md)
node scripts/render.mjs s1/index.html --stills check/s1 --times 1,4,8,12   # layout check
node scripts/check_layout.mjs s1/index.html --times 1,4,8,12               # overlap / over-face / empty-zone gate
node scripts/render.mjs s1/index.html --out sec/s1.mp4                     # silent render
node scripts/render.mjs s1/index.html --cues sec/s1_cues.json              # sound cues
# 3. audio + captions + assembly
python3 scripts/merge_cues.py sec/all_cues.json sec/s1_cues.json:0 sec/s2_cues.json:37.4
python3 scripts/sfx.py sec/all_cues.json 73.667 sec/sfx.wav
python3 scripts/captions.py raw/talk.srt 0 99999 out/NAME_CN-EN display_fix.json
scripts/assemble.sh raw/talk.mp4 sec/sfx.wav out/NAME_CN-EN.ass out/NAME sec/s1.mp4 sec/s2.mp4
```

Requirements: Node 18+ with `playwright` (Chromium), Python 3 with `numpy` (add `jieba` for automatic caption keywords), FFmpeg with libass and libx264, and the fonts listed in `engine/fonts/README.md` (burned captions use Smiley Sans Oblique / 得意黑). ASR (local Whisper or Volcengine) and TTS (Fish or another engine) are external; each user installs and configures their own environment.

## External ASR and TTS | 外部语音环境

This skill does not install or run ASR/TTS. Use **local Whisper** (openai-whisper / faster-whisper) or **Volcengine ASR** for speech timing, and **Fish TTS or another engine** for voice. Each user configures the environment. Pass the resulting SRT or transcript JSON with `--srt` / `--transcript-json`; see `HUIGE-Core/scripts/import_transcript.py`.

本技能不安装、不运行 ASR/TTS。语音识别用本地 Whisper 或火山 ASR，配音用 Fish 或其他引擎，环境由用户自行配置；结果以 SRT 或 transcript JSON 通过 `--srt` / `--transcript-json` 传入。

## Delivery rule (2026-11-22): full mode only
<!-- 落地: HUIGE-Core/core/pipeline.py:edit() 的 --allow-draft 闸门 -->

Deliveries are always built in the **manual section workflow**: copy `template/section/`, write `scenes.js` by hand for each 3–10 s section with the template's full helpers (marquee, HUD, plexus, 7-colour cards, sunburst, …), render, caption, assemble. The `HUIGE-Core/` automatic adapter is a **rough draft generator only** — never deliver its output. `HUIGE-Core/core/pipeline.py edit` now refuses to run unless `--allow-draft` is passed; use that flag only for a throwaway draft, never for a master.

## Draft mode (HUIGE-Core, not for delivery)

For a quick rough draft, the bundled `HUIGE-Core/` can run the Registry-driven pipeline (planner → installed templates → preview → final → QA): `HUIGE-Core/core/pipeline.py edit raw/talk.mp4 jobs/NAME --install-root .. --templates T01 --aspect 16:9 --srt raw/talk.srt --allow-draft`. It also accepts `--transcript-json` with an existing Volcengine / talkcraft timestamps result. ASR is not bundled; provide an SRT or transcript. The adapter only borrows each template's window/colour/pattern and a generic card layer; it does not run the template's hand-authored scenes, so its layout/motion fidelity is not delivery quality. Windows setup and the Git Bash / font / Chromium notes are in `HUIGE-Core/docs/windows.md`. Use only template IDs installed under `--install-root`; T26 is 9:16 only.

## Before delivering, verify

- The frame count of the final equals the source video's frame count. Section boundaries must be frame-exact.
- The whole video decodes without errors, and loudness is about -16 LUFS.
- Run `scripts/check_layout.mjs` on every section at 2–3 spoken-cue times; it must print `LAYOUT OK` (no text-on-text, text-on-card, text-over-presenter or off-frame text). Empty-zone WARNs are reviewed by eye.
- On a contact sheet (`scripts/contact_sheet.sh`), no text sits under the Huige window, nothing is cut off at the frame edge, captions don't collide with graphics, and the face is never cropped.
- The Huige window pose at the end of each section equals the pose at the start of the next, so joins are invisible.
