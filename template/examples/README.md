# Accepted concept-template sections (reference implementations)

Four hand-written sections from the accepted 117.7 s master (`projects/20261122_HUIGE风格基线/`). They show how to turn a
10 s T30–T200 concept into a longer, script-specific section. Each folder is a complete `index.html` + `scenes.js`.

| Folder | Based on | Length | Frames | What it demonstrates |
|---|---|---|---|---|
| `f0-flashcut-t159` | T159 Flash Cut | 10.0 s | 300 | split-colour intro, viewfinder/REC, replay screen, robot sticker, 4-colour loop tags, stamp |
| `f5-paint-t139` | T139 Brush Repaint | 13.5 s | 405 | emotion colour cards, dark anger scene with 3-colour comparison, five labelled voice layers + thermometer |
| `f6a-bento-t158` | T158 Bento | 16.667 s | 500 | bento tiles, six-character sentence card, 10 emotion cards, 4 scene cards + 10 TAKE minis |
| `f6b-spectrum-t106` | T106 Spectrum | 11.733 s | 352 | six characters → three literal meaning cards, seven emotion bars + flexibility gauge, rainbow channel arc |

## How to use

1. Copy one folder into your project, e.g. `cp -r template/examples/f5-paint-t139 project/s5`.
   The examples ship no media: run them from the skill tree and the presenter shows as a black circle. Only the layout
   and motion are meant to be inspected there.
2. `index.html` already points at `../../../engine/`; inside a project it must point at `../engine/`.
   Keep the `tmotion.js` script tag.
3. In `scenes.js`, point `C.huigeDir` at your presenter frames (the examples use `../media/huige`), set `C.src0` to the
   section start (seconds) and keep `C.end` equal to the section duration. `C.face` must be calibrated for the shoot.
4. Replace every graphic's copy with the actual script; keep the timings mapped to spoken cues.
5. Check before rendering:
   ```
   node scripts/check_layout.mjs project/s5/index.html --times 1,5,9
   ```
   It must print `LAYOUT OK`.

## Rules these examples encode

- Scene boundaries sit on the spoken topic change, not on the template's 10 s grid (`M.TB`, `dur`, `end:false`, `trd`).
- Window start/end poses equal the neighbouring sections' poses (`C.huigeKeys` set by hand).
- Clip transitions (`wipe`, `zoom`, `shutter`), no `push`/`flip` at section joins.
- Literal cards over metaphor chains; content words as labels, serial numbers as small print.
- Stacked labels use `lineHeight: 1` so the layout gate measures glyph boxes.
- `caps: []` — captions come from the delivered ASS.

Full recipe: `references/concept-sections.md`.
