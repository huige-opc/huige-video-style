# Typography, progressive reveal and density (accepted 2026-11-22)

Rules distilled from the accepted 117.7 s / 9-template master
(`projects/20261122_HUIGE风格基线/`). Apply them to every new video; the auto adapter does not satisfy them.

## 1 · Keep each template's own type system

Never flatten all sections into one default bold font. Use the template's palette and type:

| Template | Type system |
|---|---|
| T01 Acid Lime | Anton + Noto Sans CJK SC Black |
| T04 Paper | Anton display, ink/red/blue on warm paper |
| T05 Red Sunburst | Anton / Noto Black display, red field |
| T12 Old Newspaper | newspaper serif headline + typewriter labels |
| T13 Tech Blue | cyan tech title, mono/HUD labels, thin frame |
| T14 Future | Space Mono kicker + gradient Chinese display (Noto Black, background-clip) + light Inter/Noto sub |
| T15 Learning | bubbly rounded CN (font `Lr.CN`, stroke `.008`), cream/star fills |
| T17 Science | heavy white sciHead with one cyan keyword, mono chip |
| T21 Clean & Minimal | Playfair Display serif + Inter body, hairlines, no bold stacking |
| T23 Creative Pop | heavy sticker type + Playfair italic labels |

## 2 · Three-level hierarchy, never a stack of equal-size 900-weight blocks

- Level 1: mono / small-caps kicker (Space Mono / Inter, 20–26 px, letter-spaced).
- Level 2: one display line (Chinese or English); a second line is smaller or a different colour/serif.
- Level 3: light body/subline (400–500 weight, 32–40 px), shorter than the display line.
- Chinese dense characters: do **not** stroke-heavy them. Bubbly CN uses stroke `.008` (`.05` fills counters and makes 硬练 unreadable).
- Cards/pills: flex `alignItems:center`, consistent padding (24–36 px), right-side English/HUD labels.
- One shared left margin (110 px) and 44 px inner padding; keep text out of the caption zone.

## 3 · Progressive reveal tied to speech

- Every element's `t0` comes from the SRT/ASR word or cue it illustrates; do not reveal a batch early.
- Check the spoken timestamps and place: title at the phrase start, chips/cards at the noun they name, summary line at the conclusion.
- Keep a visible element until the next idea; never leave a long empty stretch where a later element could have appeared.
- Scene boundaries follow the spoken topic change (not a template's fixed 10 s grid); fade the previous topic's cards out 0.2–0.3 s before the cut, and never let a transition overlap a long window move.
- Ensure every planned element is inside the section's time range (a 3.8 s section cannot have clues at 8 s).

## 4 · Animation on the element itself

- Entrance: slide / pop / wipe / draw / rise, not just opacity.
- Idle: gentle float, glow pulse, rotation, drifting particles, light sweep, scan line.
- Auxiliary elements must be content-related: arrows for a path, book stairs for learning, mic/film icons for dubbing, stamps for a problem, labels for a comparison. No random decoration.
- Minimal templates (T21) stay restrained: slow rise, hairline draws, compass rotation — do not force busy motion.

## 5 · Verify before delivery

- Render stills at **full opacity** (not mid-fade); measure text bounding boxes and check no decoration sits behind the glyphs.
- Check vertical centring in cards/pills and no accidental overlap from rotations.
- Run `scripts/check_layout.mjs SECTION/index.html --times ...` before rendering: it flags text-on-text, text-on-card, text-over-presenter, off-frame text, and large empty zones (WARN). Keep stacked lines on `lineHeight: 1` so the gate measures glyph boxes rather than padded line boxes.
- Contact sheet every 1–3 s; no empty frames, no text off-canvas, no text over the presenter's face.
- Captions: Smiley Sans Oblique, CN 48 px (keyword 62), EN 34 px sentence case, no punctuation, orange `#FF7A00` 1.3×, no bold.
- Full master: frame count equals source, -16 LUFS, QA no FAIL; intentional static/reading-speed WARNs must be explained.

## 6 · Clarity over metaphor (2026-11-22)

- One-glance rule: the graphic must say what the sentence says within half a second. If it needs a second mapping
  (prism → spectrum → “many emotions”), replace it with a literal card.
- Accepted rewrite: six characters → arrow → three cards 真夸 / 讽刺 / 敷衍, each repeating the sentence plus one plain
  line (“真心觉得你有趣” / “嘴上夸，实际在损” / “随口应付你”).
- Literal metaphors only: thermometer = warmth, palette = switching emotion, channels = range.
- Labels carry content words (惊喜 / 讽刺 / 夸奖); serial numbers (`LAYER 01`, `CH01`) are small print, never the label.
- Test: show one frame to someone who has not heard the voice-over; they should be able to say what it is about.
