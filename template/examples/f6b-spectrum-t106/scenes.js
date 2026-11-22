/* T106 光谱实验 Spectrum · 表达弹性 · 67.5667–79.3s（11.733s / 352 帧）
 * 同样是六个字 → 装下完全不同的东西 → 看起来很傻但训练表达弹性 → 不再只有一个频道
 * 三场：① 六字棱镜分光 ② 深色光谱情绪条 + 弹性仪表 ③ 彩虹频道弧；窗口 BR → LEFT → BR（接 f7） */
(function () {
  const M = K.T.mo, X = M.X, clamp = EV.clamp, C = EV;
  const INK = '#1d2433', LIGHT = '#f3f5f8', DARK = '#06070d';
  const COL = ['#ff4b4b', '#ff9f40', '#ffe14a', '#5be37d', '#3fa9ff', '#4b4bff', '#b05bff'];
  const EMO = ['惊喜', '讽刺', '夸奖', '无奈', '温柔', '坚定', '幽默'];
  const mono = (p, x, y, txt, col, px, ls, sty) => M.txt(p, x, y, M.f(700, px || 24, M.MONO), col, txt,
    Object.assign({ letterSpacing: (ls == null ? 3 : ls) + 'px', zIndex: 6 }, sty || {}));
  const CN = (p, x, y, txt, px, col, w, sty) => X(p, x, y, px, col, txt, w || 900, M.CN, Object.assign({ lineHeight: 1, zIndex: 5 }, sty || {}));
  const spark = (p, x, y, sz, col) => M.svg(p, x, y, sz, sz,
    `<path d="M${sz / 2} 0 L${sz * .6} ${sz * .4} L${sz} ${sz / 2} L${sz * .6} ${sz * .6} L${sz / 2} ${sz} L${sz * .4} ${sz * .6} L0 ${sz / 2} L${sz * .4} ${sz * .4}Z" fill="${col}"/>`,
    { zIndex: 7, transformOrigin: '50% 50%' });
  const BR = { x: 1580, y: 600, w: 260, h: 260, r: 130, s: 3, o: 1 };
  const LEFT = { x: 110, y: 170, w: 400, h: 500, r: 30, s: 1.15, o: 1 };

  M.TB[0] = [0, 4.2]; M.TB[1] = [4.2, 8.1]; M.TB[2] = [8.1, 11.4];

  M.story({
    bg: LIGHT, sbg: [LIGHT, DARK, '#eef1f6'], tr: ['wipe', 'zoom'], dur: 11.7333, end: false, trd: .34,
    ring: t => t < 4.2 ? { color: INK, width: 6, shadow: .3 } : t < 8.1 ? { color: '#ffffff', width: 7, shadow: .45 } : { color: INK, width: 6, shadow: .3 },
    wins: [BR, LEFT, BR],
    caps: [], port: { box: [0, 40, 1920, 1000] },
    scenes: [
      /* ① 六个字 → 棱镜分光 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: `linear-gradient(135deg,${LIGHT} 0%,#ffffff 55%,#e9f0fb 100%)`, zIndex: 0 });
        s.dots = M.dots(c, 'rgba(29,36,51,.09)', 46, 1.7); s.dots.style.zIndex = 1;
        s.kick = mono(c, 96, 106, '你会发现 · NOTICE', 'rgba(29,36,51,.62)', 24, 3);
        s.h = CN(c, 92, 146, '同样是六个字', 96, INK);
        const CC = [COL[0], COL[1], COL[2], COL[3], COL[4], COL[5]];
        s.tiles = CC.map((bg, i) => M.box(c, 96 + i * 132, 300, { width: '114px', height: '114px', background: bg, color: i === 2 ? INK : '#fff', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', font: M.f(900, 62, M.CN), boxShadow: '0 10px 0 rgba(29,36,51,.16)', zIndex: 5, transformOrigin: '50% 50%' }, ['你', '可', '真', '有', '意', '思'][i]));
        s.arrow = M.path(c, 896, 336, 72, 40, 'M0 20 H62', '#7f8ca3', 9);
        s.tip = M.svg(c, 948, 320, 34, 72, `<path d="M0 34 L30 4 L30 64Z" fill="#7f8ca3"/>`, { zIndex: 6 });
        const ME = [['真夸', 'SINCERE', COL[3], '真心觉得你有趣'], ['讽刺', 'IRONY', COL[5], '嘴上夸，实际在损'], ['敷衍', 'PERFUNCTORY', COL[4], '随口应付你']];
        s.cardsM = ME.map(([txt, en, bg, note], i) => {
          const d = M.box(c, 966, 158 + i * 180, { width: '586px', height: '150px', background: bg, color: i === 0 ? INK : '#fff', borderRadius: '20px', boxShadow: '0 12px 0 rgba(29,36,51,.14)', zIndex: 5, transformOrigin: '0 50%' });
          M.txt(d, 26, 22, M.f(900, 52, M.CN), i === 0 ? INK : '#fff', txt, { top: '22px', left: '26px', lineHeight: 1 });
          M.txt(d, 28, 98, M.f(700, 15, M.MONO), i === 0 ? INK : '#fff', en, { top: '98px', left: '28px', letterSpacing: '3px', opacity: .85, lineHeight: 1 });
          M.txt(d, 214, 30, M.f(900, 24, M.CN), i === 0 ? INK : '#fff', '你可真有意思', { top: '30px', left: '214px', whiteSpace: 'nowrap', lineHeight: 1 });
          M.txt(d, 214, 80, M.f(500, 20, M.CN), i === 0 ? 'rgba(42,33,26,.72)' : 'rgba(255,255,255,.85)', note, { top: '80px', left: '214px', whiteSpace: 'nowrap', lineHeight: 1 });
          return d;
        });
        s.hero = CN(c, 92, 744, '装下完全不同的东西', 60, INK);
        s.sub = CN(c, 96, 826, '情绪一变，意思就变', 32, 'rgba(29,36,51,.6)', 500);
        s.sp = spark(c, 760, 220, 38, COL[1]);
        return s;
      }, (s, t, a) => {
        M.rise(s.kick, t, a - .25, 99, { dy: 14 });
        M.hero(s.h, t, a - .2, 99, { dx: -70 });
        s.tiles.forEach((d, i) => M.pop(d, t, a + .0 + i * .07, 99, { from: .35 }));
        M.draw(s.arrow, t, a + .55, .35);
        s.tip.style.opacity = clamp((t - a - .85) / .2).toFixed(3);
        s.cardsM.forEach((d, i) => M.slide(d, t, a + 1.65 + i * .3, 99, { dx: 220 }));
        M.hero(s.hero, t, a + 2.72, 99, { dx: -60 });
        M.rise(s.sub, t, a + 3.0, 99, { dy: 14 });
        s.sp.style.opacity = clamp((t - a - 2.2) / .3).toFixed(3); s.sp.style.transform = `rotate(${((t - a) * 26).toFixed(1)}deg)`;
      }],
      /* ② 看起来很傻，但练表达弹性 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: `radial-gradient(1000px 700px at 55% 45%,#151824 0%,${DARK} 70%,#04050a 100%)`, zIndex: 0 });
        s.dots = M.dots(c, 'rgba(255,255,255,.09)', 50, 1.7); s.dots.style.zIndex = 1;
        s.kick = mono(c, 600, 104, '这个练习啊 · THE DRILL', '#fff', 24, 3, { opacity: .8 });
        s.h = CN(c, 596, 146, '看起来很傻', 92, '#fff');
        s.stamp = M.box(c, 1200, 140, { width: '150px', height: '150px', borderRadius: '50%', border: `7px solid ${COL[0]}`, color: COL[0], font: M.f(900, 70, M.CN), lineHeight: '136px', textAlign: 'center', zIndex: 7, transformOrigin: '50% 50%' }, '傻');
        const HS = [260, 330, 210, 380, 300, 250, 350];
        s.bars = COL.map((col, i) => M.box(c, 604 + i * 126, 760 - HS[i], { width: '84px', height: HS[i] + 'px', background: col, borderRadius: '16px', opacity: .92, filter: 'blur(.2px)', transformOrigin: '50% 100%', zIndex: 5 }));
        s.labs = EMO.map((txt, i) => mono(c, 596 + i * 126, 786, txt, '#fff', 26, 1, { width: '100px', textAlign: 'center' }));
        s.g = M.svg(c, 1530, 300, 300, 300, `<circle cx="150" cy="150" r="116" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="22"/><path class="arc" d="M62 218 A116 116 0 0 1 238 218" fill="none" stroke="${COL[4]}" stroke-width="22" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>`, { zIndex: 6, transformOrigin: '50% 50%' });
        s.gt = mono(c, 1540, 620, '表达弹性', '#fff', 26, 2);
        s.gv = M.box(c, 1616, 408, { width: '128px', color: '#fff', font: M.f(900, 72, M.MONO), textAlign: 'center', zIndex: 7 }, '0');
        s.sp = spark(c, 1490, 190, 36, COL[3]);
        return s;
      }, (s, t, a) => {
        M.rise(s.kick, t, a - .2, 99, { dy: 14 });
        M.hero(s.h, t, a - .15, 99, { dx: -60 });
        M.pop(s.stamp, t, a + .25, 99, { from: 1.6 });
        s.stamp.style.transform = `rotate(${(-12 + 4 * Math.sin((t - a) * 2)).toFixed(2)}deg)`;
        s.bars.forEach((b, i) => {
          const u = clamp((t - a - .0 - i * .06) / .5);
          b.style.opacity = (.92 * u).toFixed(3);
          b.style.transform = `scaleY(${M.o3(u).toFixed(3)})`;
        });
        s.labs.forEach((e, i) => { e.style.opacity = clamp((t - a - .05 - i * .06) / .25).toFixed(3); });
        M.pop(s.g, t, a - .1, 99, { from: .7 });
        const gu = clamp((t - a - 2.8) / .9);
        s.g.querySelector('.arc').setAttribute('stroke-dashoffset', (1 - M.o3(gu)).toFixed(3));
        s.gv.textContent = Math.round(gu * 100);
        const gv0 = clamp((t - a + .1) / .3);
        s.gt.style.opacity = gv0.toFixed(3); s.gv.style.opacity = gv0.toFixed(3);
        s.sp.style.opacity = clamp((t - a - 1.3) / .3).toFixed(3); s.sp.style.transform = `rotate(${((t - a) * 24).toFixed(1)}deg)`;
      }],
      /* ③ 不再只有一个频道 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: `linear-gradient(140deg,#eef1f6 0%,#ffffff 60%,#e8f0fb 100%)`, zIndex: 0 });
        s.dots = M.dots(c, 'rgba(29,36,51,.08)', 46, 1.7); s.dots.style.zIndex = 1;
        s.kick = mono(c, 96, 104, 'CHANNELS · 频道', 'rgba(29,36,51,.62)', 24, 3);
        s.h1 = CN(c, 92, 144, '不再只有', 90, INK);
        s.h2 = CN(c, 92, 246, '一个频道', 112, COL[5]);
        s.arcs = COL.map((col, i) => { const x0 = i * 18, x1 = 760 - i * 18, r = 380 - i * 18; return M.path(c, 320, 470 - i * 22, 760, 420, `M${x0} 420 A ${r} ${r} 0 0 1 ${x1} 420`, col, 16, 'opacity=".85"'); });
        s.chips = COL.map((col, i) => {
          const ang = Math.PI * (1 - (i + 1) / 8), R = 430;
          const x = 700 + Math.cos(ang) * R - 64, y = 890 - Math.sin(ang) * R - 33;
          const d = M.box(c, x, y, { width: '128px', height: '66px', background: '#fff', color: INK, border: `4px solid ${col}`, borderRadius: '12px', zIndex: 7, transformOrigin: '50% 50%', boxShadow: '0 8px 0 rgba(29,36,51,.12)' });
          M.txt(d, 0, 5, M.f(900, 25, M.CN), INK, EMO[i], { top: '5px', left: '0px', width: '128px', textAlign: 'center', lineHeight: 1 });
          M.txt(d, 0, 42, M.f(700, 11, M.MONO), 'rgba(29,36,51,.5)', 'CH0' + (i + 1), { top: '42px', left: '0px', width: '128px', textAlign: 'center', letterSpacing: '1px', lineHeight: 1 });
          return d;
        });
        s.badge = M.box(c, 1230, 300, { background: COL[5], color: '#fff', font: M.f(900, 54, M.MONO), padding: '12px 24px', borderRadius: '14px', zIndex: 7, transformOrigin: '50% 50%' }, '×7');
        s.line = M.box(c, 96, 850, { background: INK, color: '#fff', font: M.f(700, 40, M.CN), padding: '12px 26px', borderRadius: '12px', zIndex: 6, whiteSpace: 'nowrap', transformOrigin: '0 50%' }, '表达有弹性 · 说话有层次');
        s.sp = spark(c, 1180, 640, 40, COL[1]);
        return s;
      }, (s, t, a) => {
        M.rise(s.kick, t, a + .05, 99, { dy: 14 });
        M.hero(s.h1, t, a + .18, 99, { dx: -60 });
        M.hero(s.h2, t, a + .3, 99, { dx: -60 });
        s.arcs.forEach((p, i) => M.draw(p, t, a + .5 + i * .05, .65));
        s.chips.forEach((d, i) => M.pop(d, t, a + .72 + i * .08, 99, { from: .4 }));
        M.pop(s.badge, t, a + 1.05, 99, { from: 1.4 });
        M.rise(s.line, t, a + 1.15, 99, { dy: 16 });
        s.sp.style.opacity = clamp((t - a - 1.7) / .3).toFixed(3); s.sp.style.transform = `rotate(${((t - a) * 26).toFixed(1)}deg)`;
      }]
    ]
  });

  C.huigeKeys = [{ t: 0, d: 0, L: BR }, { t: 4.0, d: .55, L: LEFT }, { t: 7.9, d: .55, L: BR }];
  C.src0 = 67.5666667; C.end = 11.7333; C.huigeDir = '../media/huige';
  C.face = { x: .5193, y: .2904, h: .341 }; C.src = { w: 1920, h: 1080 };

  /* 收尾 78.67–79.3：多频道，接 f7 */
  C.scene({
    t0: 11.1, t1: 11.79, z: 3, quiet: true, bg: '#eef1f6',
    build(L) {
      const st = {};
      st.bg = M.box(L, 0, 0, { width: '1920px', height: '1080px', background: 'linear-gradient(140deg,#eef1f6,#ffffff)', zIndex: 0 });
      st.dots = M.dots(L, 'rgba(29,36,51,.07)', 46, 1.7);
      st.d = COL.map((col, i) => M.box(L, 150 + i * 64, 520, { width: '40px', height: '40px', borderRadius: '50%', background: col, zIndex: 6, transformOrigin: '50% 50%' }));
      st.k = mono(L, 150, 300, 'MULTI-CHANNEL · 多频道', 'rgba(29,36,51,.6)', 24, 4);
      st.h = CN(L, 146, 350, '不止一个频道', 128, INK);
      st.chip = M.box(L, 150, 600, { background: COL[5], color: '#fff', font: M.f(900, 38, M.CN), padding: '12px 26px', borderRadius: '12px', zIndex: 6, transformOrigin: '0 50%' }, '表达弹性，练出来的');
      return st;
    },
    update(lt, st) {
      const u = clamp((lt - .02) / .3);
      st.k.style.opacity = u.toFixed(3);
      st.h.style.opacity = M.o3(u).toFixed(3);
      st.h.style.transform = `translateX(${(-60 * (1 - M.o5(u))).toFixed(1)}px)`;
      st.d.forEach((e, i) => M.pop(e, lt, .1 + i * .06, 99, { from: .2 }));
      const c3 = clamp((lt - .2) / .3);
      st.chip.style.opacity = c3.toFixed(3); st.chip.style.transform = `scale(${M.os(c3).toFixed(3)})`;
    }
  });
})();
