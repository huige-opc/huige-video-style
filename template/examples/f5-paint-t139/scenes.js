/* T139 情绪上色 Brush Repaint · 37.4–50.9 s（概念模板手写改版 · 13.5s）
 * 同一句话 三种情绪（开心/委屈/愤怒）→ 完全不一样 → 声音有层次 → 表达有温度
 * 三场：① 奶油纸面 + 三张情绪色卡 ② 深色怒场 + 三色对照 ③ 奶油纸面 + 五层声线 + 温度计
 * 运镜/转场沿用模板（wipe/push + 相机缓推）；窗口：f4 结尾圆形 → 左侧大卡 → f6 开头圆形 */
(function () {
  const M = K.T.mo, X = M.X, clamp = EV.clamp, C = EV;
  const INK = '#2a211a', CREAM = '#fbf1e2', CREAM2 = '#f5e9d4', DARK = '#241a15';
  const RED = '#e5383b', BLUE = '#2a4bd7', LIME = '#c8f22e', OR = '#ff7a1a', PUR = '#7a4bff';
  const mono = (p, x, y, txt, col, px, ls, sty) => M.txt(p, x, y, M.f(700, px || 24, M.MONO), col, txt,
    Object.assign({ letterSpacing: (ls == null ? 3 : ls) + 'px', zIndex: 6 }, sty || {}));
  const CN = (p, x, y, txt, px, col, w, sty) => X(p, x, y, px, col, txt, w || 900, M.CN, Object.assign({ lineHeight: 1, zIndex: 5 }, sty || {}));
  const spark = (p, x, y, sz, col) => M.svg(p, x, y, sz, sz,
    `<path d="M${sz / 2} 0 L${sz * .6} ${sz * .4} L${sz} ${sz / 2} L${sz * .6} ${sz * .6} L${sz / 2} ${sz} L${sz * .4} ${sz * .6} L0 ${sz / 2} L${sz * .4} ${sz * .4}Z" fill="${col}"/>`,
    { zIndex: 6, transformOrigin: '50% 50%' });
  const blob = (p, x, y, w, h, col, op) => M.box(p, x, y, { width: w + 'px', height: h + 'px', background: col, borderRadius: '50%', filter: 'blur(46px)', opacity: op, zIndex: 1 });
  const face = (card, type, col) => {
    const eyes = `<circle cx="33" cy="41" r="5" fill="${col}"/><circle cx="63" cy="41" r="5" fill="${col}"/>`;
    const mouth = type === 'joy' ? `<path d="M29 58 Q48 78 67 58" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`
      : type === 'sad' ? `<path d="M30 69 Q48 51 66 69" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`
      : `<path d="M25 34 L43 42" stroke="${col}" stroke-width="6" stroke-linecap="round"/><path d="M71 34 L53 42" stroke="${col}" stroke-width="6" stroke-linecap="round"/><path d="M31 70 H65" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`;
    return M.svg(card, 102, 20, 96, 96, `<circle cx="48" cy="48" r="40" fill="none" stroke="${col}" stroke-width="5" opacity=".85"/>${eyes}${mouth}`, { zIndex: 8 });
  };
  const brush = (p, x, y, sz) => M.svg(p, x, y, sz, sz * .55, `<path d="M4 12 L${sz * .62} 12" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${sz * .62} 2 L${sz - 4} 6 L${sz * .66} 22 Z" fill="${RED}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`, { zIndex: 7, transformOrigin: '20% 50%' });

  M.TB[0] = [0, 5.35]; M.TB[1] = [5.35, 8.2]; M.TB[2] = [8.2, 12.6];
  const TL = { x: 1620, y: 60, w: 230, h: 230, r: 115, s: 3, o: 1 };
  const LEFT = { x: 120, y: 140, w: 720, h: 800, r: 20, s: 1.05, o: 1 };
  const BL = { x: 110, y: 760, w: 210, h: 210, r: 105, s: 3, o: 1 };

  M.story({
    bg: CREAM, sbg: [CREAM, DARK, CREAM2], tr: ['wipe', 'wipe'], dur: 13.5, end: false, trd: .34,
    ring: t => t < 5.35 ? { color: INK, width: 6, shadow: .3 } : t < 9.1 ? { color: '#fffaf0', width: 8, shadow: .4 } : { color: INK, width: 6, shadow: .3 },
    wins: [TL, LEFT, TL],
    caps: [], port: { box: [0, 40, 1920, 1000] },
    scenes: [
      /* ① 同一句话 · 三种情绪：奶油纸面 + 三张色卡 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: `linear-gradient(140deg,${CREAM} 0%,#fff8ec 55%,#f7e6cc 100%)`, zIndex: 0 });
        s.dots = M.dots(c, 'rgba(90,61,43,.10)', 42, 1.7); s.dots.style.zIndex = 1;
        s.bl = [blob(c, 1240, 640, 380, 300, LIME, .28), blob(c, 900, 30, 300, 240, BLUE, .16), blob(c, 20, 880, 340, 260, RED, .14)];
        s.kick = mono(c, 110, 104, 'SAME SENTENCE · 同一句话', INK, 24, 3, { opacity: .82 });
        s.h1 = CN(c, 104, 148, '一句话', 150, INK);
        s.h2 = CN(c, 110, 318, '三种情绪', 96, RED);
        s.ul = M.path(c, 110, 424, 470, 34, 'M4 22 C 120 4, 260 34, 400 14 S 460 20, 466 18', RED, 10, 'opacity=".7"');
        s.sub = mono(c, 116, 470, '开心 · 委屈 · 愤怒 · 同一句', 'rgba(42,33,26,.62)', 26, 2);
        s.cards = [
          { txt: '开心', en: 'JOY', bg: LIME, fg: INK, x: 106, r: -4, t0: .02, type: 'joy' },
          { txt: '委屈', en: 'GRIHUIGENCE', bg: BLUE, fg: '#fff', x: 436, r: 2.5, t0: 2.07, type: 'sad' },
          { txt: '愤怒', en: 'ANGER', bg: RED, fg: '#fff', x: 766, r: -2, t0: 4.15, type: 'angry' }
        ].map(o => {
          const d = M.box(c, o.x, 552, { width: '290px', height: '248px', background: o.bg, borderRadius: '18px', boxShadow: '0 14px 0 rgba(42,33,26,.2)', zIndex: 5, transformOrigin: '50% 50%' });
          M.txt(d, 0, 126, M.f(900, 56, M.CN), o.fg, o.txt, { top: '126px', left: '0px', width: '290px', textAlign: 'center', lineHeight: 1 });
          M.txt(d, 0, 206, M.f(700, 17, M.MONO), o.fg, o.en, { top: '206px', left: '0px', width: '290px', textAlign: 'center', letterSpacing: '3px', opacity: .8, lineHeight: 1 });
          o.d = d; o.f = face(d, o.type, o.fg); return o;
        });
        s.note = mono(c, 108, 842, '同一句话 换一种情绪说', 'rgba(42,33,26,.55)', 22, 2);
        /* 右侧：调色盘 + 画笔 */
        s.pal = M.svg(c, 1260, 520, 300, 250, `<path d="M150 10 C 250 8, 296 76, 268 148 C 244 206, 180 190, 158 222 C 138 250, 56 236, 34 170 C 8 92, 52 12, 150 10Z" fill="#fffaf0" stroke="${INK}" stroke-width="5"/>`, { zIndex: 5, transformOrigin: '50% 50%' });
        s.palDots = [[1382, 594, LIME], [1460, 582, BLUE], [1478, 636, RED], [1356, 686, OR]].map(([x, y, col]) => M.box(c, x, y, { width: '46px', height: '46px', borderRadius: '50%', background: col, zIndex: 8, transformOrigin: '50% 50%' }));
        s.br = brush(c, 1210, 786, 190);
        s.palT = mono(c, 1420, 780, '换颜色 · RECOLOR', 'rgba(42,33,26,.6)', 20, 2);
        s.sp1 = spark(c, 1010, 150, 38, OR);
        s.sp2 = spark(c, 1140, 470, 26, PUR);
        return s;
      }, (s, t, a) => {
        M.rise(s.kick, t, a + .0, 99, { dy: 18 });
        M.hero(s.h1, t, a + .04, 99, { dx: -90 });
        M.hero(s.h2, t, a + .2, 99, { dx: -70 });
        M.draw(s.ul, t, a + .34, .5);
        M.rise(s.sub, t, a + .4, 99, { dy: 18 });
        s.cards.forEach((o, i) => {
          const u = M.os((t - a - o.t0) / .32), v = M.env(t, a + o.t0, 99, .32);
          o.d.style.opacity = v.a.toFixed(3);
          o.d.style.transform = `rotate(${(o.r + (1 - u) * 12).toFixed(2)}deg) scale(${(.8 + .2 * v.e).toFixed(3)}) translateY(${(Math.sin((t - a) * 1.8 + i * 1.7) * 3).toFixed(1)}px)`;
        });
        M.rise(s.note, t, a + .52, 99, { dy: 14 });
        M.pop(s.pal, t, a + .55, 99, { from: .6 });
        s.pal.style.transform = `rotate(${(-4 + 3 * Math.sin((t - a) * 1.4)).toFixed(2)}deg)`;
        s.palDots.forEach((e, i) => M.pop(e, t, a + .7 + i * .08, 99, { from: .3 }));
        M.rise(s.br, t, a + .95, 99, { dy: 20 });
        s.br.style.transform = `rotate(${(-6 + 5 * Math.sin((t - a) * 2)).toFixed(2)}deg)`;
        M.rise(s.palT, t, a + 1.05, 99, { dy: 14 });
        s.sp1.style.opacity = clamp((t - a - .8) / .3).toFixed(3); s.sp1.style.transform = `rotate(${((t - a) * 26).toFixed(1)}deg)`;
        s.sp2.style.opacity = clamp((t - a - 1.0) / .3).toFixed(3); s.sp2.style.transform = `rotate(${(-((t - a) * 22)).toFixed(1)}deg)`;
      }],
      /* ② 愤怒 · 完全不一样：深色场 + 三色对照 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: `radial-gradient(900px 620px at 62% 42%,#3a211c 0%,${DARK} 62%,#180f0c 100%)`, zIndex: 0 });
        s.dots = M.dots(c, 'rgba(255,250,240,.10)', 46, 1.7); s.dots.style.zIndex = 1;
        s.bl = [blob(c, 900, 120, 460, 380, RED, .34), blob(c, 1500, 700, 380, 320, OR, .24), blob(c, 1650, 40, 240, 220, LIME, .12)];
        s.kick = mono(c, 906, 132, 'ANGER · 愤怒', OR, 24, 3);
        s.big = CN(c, 890, 168, '怒', 300, RED, 900, { textShadow: '0 10px 0 rgba(0,0,0,.35)' });
        s.ne = CN(c, 1210, 236, '≠', 180, LIME, 900, { transformOrigin: '50% 50%' });
        s.l1 = CN(c, 902, 500, '愤怒的时候', 60, '#fff');
        s.l2 = CN(c, 902, 574, '该怎么说', 60, '#fff');
        s.chip = M.box(c, 900, 676, { background: '#fffaf0', color: INK, font: M.f(900, 62, M.CN), padding: '14px 26px', borderRadius: '10px', boxShadow: `10px 10px 0 ${RED}`, zIndex: 6, transformOrigin: '0 50%' }, '完全不一样');
        s.sw = [['开心', LIME, INK], ['委屈', BLUE, '#fff'], ['愤怒', RED, '#fff']].map(([txt, bg, fg], i) => {
          const row = M.box(c, 1396, 470 + i * 112, { width: '392px', height: '88px', background: bg, color: fg, borderRadius: '10px', boxShadow: '0 10px 0 rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', boxSizing: 'border-box', zIndex: 6, transformOrigin: '0 50%' });
          M.txt(row, 0, 20, M.f(900, 46, M.CN), fg, txt, { position: 'static' });
          M.txt(row, 0, 32, M.f(700, 18, M.MONO), fg, ['JOY', 'GRIHUIGENCE', 'ANGER'][i], { position: 'static', letterSpacing: '3px', opacity: .75 });
          row.base = -6; return row;
        });
        s.swk = M.svg(c, 1700, 470 + 2 * 112 + 26, 40, 40, `<path d="M4 22 L16 34 L38 8" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`, { zIndex: 8 });
        s.sp = spark(c, 1720, 330, 44, OR);
        return s;
      }, (s, t, a) => {
        M.rise(s.kick, t, a + .08, 99, { dy: 16 });
        M.hero(s.big, t, a + .16, 99, { dx: -110 });
        M.pop(s.ne, t, a + .5, 99, { from: 1.8 });
        s.ne.style.transform = `rotate(${(-8 + 3 * Math.sin((t - a) * 2)).toFixed(2)}deg) scale(${(1 + .05 * Math.sin((t - a) * 3)).toFixed(3)})`;
        M.rise(s.l1, t, a + .18, 99, { dy: 24 });
        M.rise(s.l2, t, a + .28, 99, { dy: 24 });
        M.pop(s.chip, t, a + 1.55, 99, { from: 1.4 });
        /* 45.3s 之后“完全不一样”卡片退场，避免和“你的声音啊”同屏残留 */
        const gx = 1 - M.i2(clamp((t - a - 2.68) / .26));
        s.chip.style.opacity = (parseFloat(s.chip.style.opacity || '1') * gx).toFixed(3);
        s.chip.style.transform += ` translateX(${(-34 * (1 - gx)).toFixed(1)}px) translateY(${(10 * (1 - gx)).toFixed(1)}px)`;
        s.sw.forEach((row, i) => {
          M.slide(row, t, a + .72 + i * .16, 99, { dx: 420, base: `rotate(${row.base}deg)` });
        });
        M.pop(s.swk, t, a + 1.22, 99, { from: .2 });
        s.sp.style.opacity = clamp((t - a - .9) / .3).toFixed(3);
        s.sp.style.transform = `rotate(${((t - a) * 28).toFixed(1)}deg)`;
      }],
      /* ③ 声音有层次 · 表达有温度：五层声线 + 温度计 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: `linear-gradient(125deg,${CREAM2} 0%,#fdf6e8 60%,#ffe9cf 100%)`, zIndex: 0 });
        s.dots = M.dots(c, 'rgba(90,61,43,.09)', 42, 1.7); s.dots.style.zIndex = 1;
        s.bl = [blob(c, 1180, 120, 380, 320, OR, .2), blob(c, 40, 760, 340, 280, PUR, .12)];
        s.kick = mono(c, 110, 104, 'YOUR VOICE · 你的声音', INK, 24, 3, { opacity: .82 });
        s.h = CN(c, 106, 142, '有层次', 132, INK);
        const LC = [LIME, BLUE, RED, OR, PUR];
        s.waves = LC.map((col, i) => {
          const y = 320 + i * 72;
          const p = M.path(c, 110, y, 870, 70, `M4 38 C 110 4, 250 66, 380 34 S 610 4, 730 36 S 840 62, 866 30`, col, 24);
          return p;
        });
        s.labs = ['惊喜', '讽刺', '夸奖', '无奈', '温柔'].map((txt, i) => M.txt(c, 1014, 338 + i * 72, M.f(700, 24, M.CN), 'rgba(42,33,26,.62)', txt, { letterSpacing: '2px', zIndex: 6 }));
        s.therm = M.svg(c, 1270, 300, 120, 300, `<rect x="46" y="16" width="28" height="196" rx="14" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="60" cy="238" r="34" fill="none" stroke="${INK}" stroke-width="5"/><rect class="fill" x="52" y="188" width="16" height="24" rx="8" fill="${RED}"/><circle class="fill2" cx="60" cy="238" r="24" fill="${RED}"/>`, { zIndex: 6 });
        s.tick = [[92, 50], [92, 90], [92, 130], [92, 170]].map(([x, y]) => M.box(s.therm, x, y, { width: '18px', height: '4px', background: 'rgba(42,33,26,.45)', zIndex: 7 }));
        s.warm = M.box(c, 108, 720, { background: `linear-gradient(100deg,${OR},${RED})`, color: '#fff', font: M.f(900, 82, M.CN), padding: '10px 34px', borderRadius: '14px', boxShadow: '0 16px 0 rgba(229,56,59,.22)', zIndex: 6, transformOrigin: '0 50%' }, '有温度');
        s.sub = CN(c, 112, 868, '表达，开始有了温度', 34, 'rgba(42,33,26,.62)', 500);
        s.pal = M.svg(c, 1210, 650, 300, 240, `<path d="M150 8 C 244 6, 292 72, 264 142 C 242 200, 176 184, 156 214 C 136 240, 56 228, 34 164 C 10 90, 56 10, 150 8Z" fill="#fffaf0" stroke="${INK}" stroke-width="5"/>`, { zIndex: 5, transformOrigin: '50% 50%' });
        s.palDots = [[1332, 716, LIME], [1408, 706, BLUE], [1424, 762, RED], [1306, 808, PUR]].map(([x, y, col]) => M.box(c, x, y, { width: '42px', height: '42px', borderRadius: '50%', background: col, zIndex: 8, transformOrigin: '50% 50%' }));
        s.sp = spark(c, 1160, 470, 36, OR);
        return s;
      }, (s, t, a) => {
        M.rise(s.kick, t, a + .02, 99, { dy: 16 });
        M.hero(s.h, t, a + .06, 99, { dx: -80 });
        s.waves.forEach((p, i) => M.draw(p, t, a + .5 + i * .12, .45));
        s.labs.forEach((e, i) => { e.style.opacity = clamp((t - a - .58 - i * .12) / .25).toFixed(3); });
        M.pop(s.pal, t, a + .35, 99, { from: .6 });
        s.pal.style.transform = `rotate(${(-3 + 3 * Math.sin((t - a) * 1.3)).toFixed(2)}deg)`;
        s.palDots.forEach((e, i) => M.pop(e, t, a + .45 + i * .07, 99, { from: .3 }));
        M.pop(s.warm, t, a + 2.62, 99, { from: 1.35 });
        const u = clamp((t - a - 2.67) / .85);
        s.therm.querySelector('.fill').setAttribute('height', (24 + 170 * u).toFixed(1));
        s.therm.querySelector('.fill').setAttribute('y', (212 - 170 * u).toFixed(1));
        M.rise(s.sub, t, a + 2.88, 99, { dy: 14 });
        s.sp.style.opacity = clamp((t - a - 2.0) / .3).toFixed(3);
        s.sp.style.transform = `rotate(${((t - a) * 24).toFixed(1)}deg)`;
      }]
    ]
  });

  /* 窗口从 f4 结尾的右上圆直接开始，不回全屏；结尾保持同一位，接 f6 */
  C.huigeKeys = [{ t: 0, d: 0, L: TL }, { t: 5.07, d: .6, L: LEFT }, { t: 7.88, d: .34, L: BL }, { t: 8.3, d: .46, L: TL }];
  C.src0 = 37.4; C.end = 13.5; C.huigeDir = '../media/huige';
  C.face = { x: .5193, y: .2904, h: .341 }; C.src = { w: 1920, h: 1080 };

  /* ④ 收尾定格 49.75–50.9：有温度（左侧，不压右上人物圆） */
  C.scene({
    t0: 12.35, t1: 13.55, z: 3, quiet: true, bg: CREAM2,
    build(L) {
      const st = {};
      st.bg = M.box(L, 0, 0, { width: '1920px', height: '1080px', background: `linear-gradient(140deg,${CREAM2} 0%,#fff7e8 100%)`, zIndex: 0 });
      st.dots = M.dots(L, 'rgba(90,61,43,.08)', 42, 1.7);
      st.k = mono(L, 112, 220, 'WARMTH · 温度', 'rgba(42,33,26,.62)', 24, 4);
      st.h = CN(L, 108, 272, '有温度', 150, INK);
      st.ul = M.path(L, 112, 452, 520, 40, 'M4 26 C 140 6, 320 40, 512 16', OR, 14, 'opacity=".85"');
      st.chip = M.box(L, 116, 520, { background: RED, color: '#fff', font: M.f(900, 42, M.CN), padding: '12px 26px', borderRadius: '12px', boxShadow: '0 14px 0 rgba(229,56,59,.22)', zIndex: 6, transformOrigin: '0 50%' }, '同一句话 · 说出十种感觉');
      st.sun = M.svg(L, 900, 620, 160, 160, `<circle cx="80" cy="80" r="34" fill="${OR}"/>${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<line x1="${80 + Math.cos(a) * 48}" y1="${80 + Math.sin(a) * 48}" x2="${80 + Math.cos(a) * 68}" y2="${80 + Math.sin(a) * 68}" stroke="${OR}" stroke-width="8" stroke-linecap="round"/>`; }).join('')}`, { zIndex: 6, transformOrigin: '50% 50%' });
      return st;
    },
    update(lt, st) {
      const u = clamp((lt - .02) / .3);
      st.k.style.opacity = u.toFixed(3);
      st.h.style.opacity = M.o3(u).toFixed(3);
      st.h.style.transform = `translateX(${(-60 * (1 - M.o5(u))).toFixed(1)}px)`;
      M.draw(st.ul, lt, .12, .4);
      const c2 = clamp((lt - .16) / .3);
      st.chip.style.opacity = c2.toFixed(3);
      st.chip.style.transform = `scale(${M.os(c2).toFixed(3)})`;
      st.sun.style.opacity = clamp((lt - .2) / .3).toFixed(3);
      st.sun.style.transform = `rotate(${(lt * 60).toFixed(1)}deg) scale(${(.7 + .3 * clamp((lt - .2) / .3)).toFixed(3)})`;
    }
  });
})();
