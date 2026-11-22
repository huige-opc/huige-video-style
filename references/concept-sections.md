# Concept templates as N-second sections (2026-11-22, accepted)

The 162 T30–T200 templates in `template/concepts/` are 10-second stories. They are the best starting skeleton for a
**hand-written** section: three scenes, real transitions and a camera push are already coded. Rewrite every graphic and
every word for the actual script; keep the motion grammar.

Use this workflow when a section should feel punchier than the T01–T24 named templates, or when replacing an existing
section in an approved master.

## 1 · Copy and wire

```
cp -r template/concepts/tNNN s5
```
- `s5/index.html`: point the CSS/scripts at `../engine/`, and add `<script src="../engine/tmotion.js"></script>` after
  `templates.js` (concepts depend on `K.T.mo`).
- Keep `caps: []` in `M.story`; the delivered bilingual ASS supplies captions. Do not double-burn template captions.
- Replace all sample copy, sample numbers and fake UI. Show only what the speaker says.

## 2 · Timing: three scenes, any duration

```js
M.TB[0] = [0, 5.35]; M.TB[1] = [5.35, 8.2]; M.TB[2] = [8.2, 12.6];
M.story({ dur: 13.5, end: false, trd: .34, tr: ['wipe', 'wipe'], wins: [...], scenes: [...] });
C.src0 = 37.4; C.end = 13.5; C.huigeDir = '../media/huige';
C.face = { x: .5193, y: .2904, h: .341 }; C.src = { w: 1920, h: 1080 };
```
- `M.TB` is the three scene ranges **in section-local seconds**; set it before `M.story`.
- `dur` = section length; `C.end` must equal it. Frame count = `round(dur * 30)`.
- `end: false` removes the template's automatic full-frame return, so the last pose can match the next section.
- `trd` (default .6) shortens transitions; .3–.35 s is safest.
- `M.setup` overwrites `C.huigeDir / C.face / C.src` with sample values — always override them **after** `M.story`.

## 3 · Window continuity

Neighbouring sections must share the presenter pose at the cut.
- Start pose = previous section's end pose; end pose = next section's start pose.
- Set `C.huigeKeys` by hand after `M.story`; do not rely on the template's default wins.
- When the window must cross the frame, use two keys: shrink to a corner first, then fly to the target. A single
  long move passes over headlines and looks like a glitch.
- Example (accepted): `T159` starts at `{1250,210,540,640}`; `T139` starts/ends on the top-right circle `{1620,60,230,230}`;
  `T158` ends bottom-right `{1580,600,260,260}` where `T106` starts.

## 4 · Scene boundaries follow the spoken topic

Do not inherit the template's 10-second grid. Put every scene boundary on the phrase where the topic changes, and fade
the previous topic's cards 0.2–0.3 s before the cut.
- Bad: second scene held to 46.5 s while “你的声音啊” started at 45.6 s → the 44 s graphics looked like residue.
- Good: boundary at 45.6 s, old chip exits 45.3 s, wipe .34 s, next scene's title already entering.

## 5 · Transitions and camera

- Prefer clip transitions: `wipe`, `shutter`, `iris`, `zoom`. `push` leaves old-scene strips at the frame edge; `flip`
  exposes the stage background at the edges.
- Do not run a long window move and a scene transition in the same 0.4 s; the presenter card covers the incoming copy.
- The template's slow camera push stays on; do not add global zoom/shake to `engine.js`.

## 6 · Clarity beats cleverness

Fast-paced viewers do not decode metaphors. One-glance rule: if the graphic needs a second mapping, replace it.
- Bad: six characters → prism → seven colour rays (“装下完全不同的东西”). The metaphor needs optics knowledge.
- Good: six characters → arrow → three cards 真夸 / 讽刺 / 敷衍, each with the same sentence and one plain explanation.
- Keep only literal metaphors: thermometer = temperature, palette = change emotion, channels = multiple channels.
- Labels carry content words (惊喜 / 讽刺 / 夸奖). Serial numbers (`LAYER 01`, `CH01`) are small print, never the label.

## 7 · Layout gate before rendering

```
node scripts/check_layout.mjs s5/index.html --times 1,4.5,9
```
It reads the live DOM after `renderAt(t)` and FAILs on:
- text-on-text overlap;
- text sitting on another card (not its own);
- text under the presenter window;
- text outside 1920×1080.
WARNs list empty thirds of the frame. It ignores mid-transition scenes and layers hidden by an opaque scene.

Rules that keep the gate meaningful:
- Set `lineHeight: 1` on stacked labels so it measures glyph boxes, not padded line boxes.
- Validate the gate with a deliberate bad case (move a line chip onto cards) — it must print FAIL.
- Run it at 2–3 spoken-cue times per section; delivery requires `LAYOUT OK`.

## 8 · Accepted frame map (117.7 s master)

| Range | Template | Frames |
|---|---|---|
| 0–10.0 | T159 Flash Cut (concept, rewritten) | 300 |
| 10.0–37.4 | T04 / T15 / T23 / T13 | 822 |
| 37.4–50.9 | T139 Brush Repaint (concept, 13.5 s) | 405 |
| 50.9–67.5667 | T158 Bento (concept, 16.667 s) | 500 |
| 67.5667–79.3 | T106 Spectrum (concept, 11.733 s) | 352 |
| 79.3–117.7 | T21 / T05 | 1151 |

Total 3530 frames. Project and sources: `projects/20261122_HUIGE风格基线/`.

## 9 · Checklist

- [ ] `index.html` loads `tmotion.js`; `caps: []`.
- [ ] `M.TB` + `dur` + `end:false` + `trd` set; `C.src0/C.end/C.huigeDir/C.face/C.src` overridden after `M.story`.
- [ ] First/last window pose equals the neighbouring sections.
- [ ] Every scene boundary sits on a spoken topic change; old cards exit before the cut.
- [ ] Content words, not metaphor chains; numbers only as secondary labels.
- [ ] `check_layout.mjs` prints `LAYOUT OK`; bad-case validation done once per rule change.
- [ ] Section frame count = `round(dur*30)`; section joins are frame-exact in the concat.
