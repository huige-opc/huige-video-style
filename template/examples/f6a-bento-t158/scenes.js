/* T158 模块拼贴 Bento · 方法二「玩一个游戏」· 50.9–67.5667s（16.667s / 500 帧）
 * 就一句话（你可真有意思）→ 用不同情绪说十遍 → 每一遍都是不同的场景
 * 三场：① 游戏卡 + 六字句 ② 深色场十张情绪卡 ③ 四个情绪场景卡；窗口 TL → TL → BR（接 f6b） */
(function () {
  const M = K.T.mo, X = M.X, clamp = EV.clamp, C = EV;
  const INK = '#2a211a', CREAM = '#f2efe9', DARK = '#14100e';
  const LIME = '#c8f22e', BLUE = '#2a4bd7', RED = '#e5383b', OR = '#ff7a1a', PUR = '#7a4bff', TEAL = '#14b8a6';
  const mono = (p, x, y, txt, col, px, ls, sty) => M.txt(p, x, y, M.f(700, px || 24, M.MONO), col, txt,
    Object.assign({ letterSpacing: (ls == null ? 3 : ls) + 'px', zIndex: 6 }, sty || {}));
  const CN = (p, x, y, txt, px, col, w, sty) => X(p, x, y, px, col, txt, w || 900, M.CN, Object.assign({ lineHeight: 1, zIndex: 5 }, sty || {}));
  const spark = (p, x, y, sz, col) => M.svg(p, x, y, sz, sz,
    `<path d="M${sz / 2} 0 L${sz * .6} ${sz * .4} L${sz} ${sz / 2} L${sz * .6} ${sz * .6} L${sz / 2} ${sz} L${sz * .4} ${sz * .6} L0 ${sz / 2} L${sz * .4} ${sz * .4}Z" fill="${col}"/>`,
    { zIndex: 7, transformOrigin: '50% 50%' });
  const face = (card, type, col, x, y, sz) => {
    const eyes = `<circle cx="33" cy="41" r="5" fill="${col}"/><circle cx="63" cy="41" r="5" fill="${col}"/>`;
    const mouth = type === 'joy' ? `<path d="M29 58 Q48 78 67 58" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`
      : type === 'sad' ? `<path d="M30 69 Q48 51 66 69" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`
      : type === 'wry' ? `<path d="M28 62 Q48 74 68 56" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`
      : `<path d="M25 34 L43 42" stroke="${col}" stroke-width="6" stroke-linecap="round"/><path d="M71 34 L53 42" stroke="${col}" stroke-width="6" stroke-linecap="round"/><path d="M31 70 H65" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`;
    return M.svg(card, x, y, sz, sz, `<circle cx="48" cy="48" r="40" fill="none" stroke="${col}" stroke-width="5" opacity=".85"/>${eyes}${mouth}`, { zIndex: 8 });
  };
  const tile = (p, x, y, w, h, bg, fg, txt, fs, sty) => {
    const d = M.box(p, x, y, Object.assign({ width: w + 'px', height: h + 'px', background: bg, color: fg, borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', font: M.f(900, fs || 52, M.CN), boxSizing: 'border-box', zIndex: 4, transformOrigin: '50% 50%' }, sty || {}), txt);
    return d;
  };
  const TL = { x: 1620, y: 60, w: 230, h: 230, r: 115, s: 3, o: 1 };
  const BR = { x: 1580, y: 600, w: 260, h: 260, r: 130, s: 3, o: 1 };

  M.TB[0] = [0, 5.7]; M.TB[1] = [5.7, 10.6]; M.TB[2] = [10.6, 15.9];

  M.story({
    bg: CREAM, sbg: [CREAM, DARK, '#f7f4ee'], tr: ['wipe', 'wipe'], dur: 16.6667, end: false, trd: .34,
    ring: t => t < 5.7 ? { color: INK, width: 6, shadow: .3 } : t < 10.6 ? { color: '#ffffff', width: 7, shadow: .45 } : { color: INK, width: 6, shadow: .3 },
    wins: [TL, TL, BR],
    caps: [], port: { box: [0, 40, 1920, 1000] },
    scenes: [
      /* ① 玩一个游戏 · 就一句话 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: `linear-gradient(135deg,${CREAM} 0%,#fff9ef 55%,#f5e7d2 100%)`, zIndex: 0 });
        s.dots = M.dots(c, 'rgba(42,33,26,.10)', 44, 1.7); s.dots.style.zIndex = 1;
        s.kick = mono(c, 100, 104, 'METHOD 02 · 玩个游戏', INK, 26, 3);
        s.h = CN(c, 96, 146, '玩一个游戏', 116, INK);
        s.sub = CN(c, 100, 288, '一句话，说十遍', 40, 'rgba(42,33,26,.6)', 500);
        s.card = M.card(c, 96, 356, 780, 212, '#fff', { border: '5px solid ' + INK, borderRadius: '26px', boxShadow: '0 18px 0 rgba(42,33,26,.14)', zIndex: 5 });
        const CC = [LIME, BLUE, RED, OR, PUR, TEAL], TX = ['你', '可', '真', '有', '意', '思'];
        s.chars = TX.map((ch, i) => {
          const d = M.box(s.card, 24 + i * 124, 40, { width: '106px', height: '106px', background: CC[i], color: i === 0 || i === 4 ? INK : '#fff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', font: M.f(900, 60, M.CN), zIndex: 7, transformOrigin: '50% 50%' }, ch);
          return d;
        });
        s.six = mono(c, 100, 596, '六个字 · SIX CHARACTERS', 'rgba(42,33,26,.55)', 22, 3);
        s.badge = M.box(c, 1290, 330, { background: RED, color: '#fff', font: M.f(900, 100, M.CN), padding: '4px 28px', borderRadius: '18px', boxShadow: '0 14px 0 rgba(229,56,59,.25)', zIndex: 7, transformOrigin: '50% 50%' }, '×10');
        s.bt = [
          tile(c, 1210, 480, 300, 190, INK, '#fff', '10 遍', 56),
          tile(c, 1210, 700, 300, 190, LIME, INK, '不同场景', 64),
          tile(c, 968, 480, 210, 190, BLUE, '#fff', '情绪', 56),
          tile(c, 968, 700, 210, 190, PUR, '#fff', '一句', 56)
        ];
        s.start = M.box(c, 100, 660, { background: INK, color: LIME, font: M.f(700, 34, M.MONO), letterSpacing: '4px', padding: '16px 28px', borderRadius: '12px', zIndex: 6, transformOrigin: '0 50%' }, 'GAME START ▸');
        s.sp1 = spark(c, 840, 250, 40, OR);
        s.sp2 = spark(c, 940, 900, 30, PUR);
        return s;
      }, (s, t, a) => {
        M.rise(s.kick, t, a - .12, 99, { dy: 16 });
        M.hero(s.h, t, a - .1, 99, { dx: -80 });
        M.rise(s.sub, t, a + .0, 99, { dy: 16 });
        M.pop(s.card, t, a + 3.5, 99, { from: .7 });
        s.chars.forEach((d, i) => M.pop(d, t, a + 3.95 + i * .09, 99, { from: .3 }));
        M.rise(s.six, t, a + 4.55, 99, { dy: 12 });
        M.pop(s.badge, t, a + .45, 99, { from: 1.5 });
        s.badge.style.transform = `rotate(${(-6 + 2.5 * Math.sin((t - a) * 2)).toFixed(2)}deg)`;
        s.bt.forEach((d, i) => M.pop(d, t, a + .0 + i * .12, 99, { from: .45 }));
        s.start.style.opacity = clamp((t - a - .9) / .25).toFixed(3);
        s.start.style.transform = `translateX(${(-20 * (1 - clamp((t - a - .9) / .3))).toFixed(1)}px)`;
        s.sp1.style.opacity = clamp((t - a - 1.4) / .3).toFixed(3); s.sp1.style.transform = `rotate(${((t - a) * 26).toFixed(1)}deg)`;
        s.sp2.style.opacity = clamp((t - a - 2.0) / .3).toFixed(3); s.sp2.style.transform = `rotate(${(-((t - a) * 22)).toFixed(1)}deg)`;
      }],
      /* ② 说十遍：十张情绪卡 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: `radial-gradient(1000px 700px at 55% 45%,#2a1f1a 0%,${DARK} 65%,#0b0807 100%)`, zIndex: 0 });
        s.dots = M.dots(c, 'rgba(255,250,240,.10)', 48, 1.7); s.dots.style.zIndex = 1;
        s.kick = mono(c, 100, 104, 'SAME WORDS · 同一句话', '#fff', 24, 3, { opacity: .8 });
        s.h1 = CN(c, 96, 146, '用不同情绪', 96, '#fff');
        s.h2 = CN(c, 96, 252, '说十遍', 130, LIME);
        s.six = M.box(c, 100, 430, { background: '#fffaf0', color: INK, font: M.f(900, 44, M.CN), padding: '14px 24px', borderRadius: '14px', boxShadow: `8px 8px 0 ${RED}`, zIndex: 6, transformOrigin: '0 50%' }, '你可真有意思');
        s.x10 = M.box(c, 100, 560, { background: RED, color: '#fff', font: M.f(900, 90, M.CN), padding: '2px 24px', borderRadius: '16px', zIndex: 7, transformOrigin: '50% 50%' }, '×10');
        const CC = ['#ff4b4b', '#ff9f40', '#ffe14a', '#5be37d', '#3fa9ff', '#4b4bff', '#b05bff', LIME, TEAL, '#ff5fa2'];
        s.chips = CC.map((bg, i) => {
          const d = M.box(c, 880 + (i % 5) * 182, 350 + Math.floor(i / 5) * 300, { width: '162px', height: '250px', background: bg, color: i === 2 || i === 7 ? INK : '#fff', borderRadius: '22px', boxShadow: '0 12px 0 rgba(0,0,0,.32)', zIndex: 5, transformOrigin: '50% 50%', overflow: 'hidden' });
          M.txt(d, 0, 16, M.f(900, 64, M.MONO), i === 2 || i === 7 ? INK : '#fff', String(i + 1).padStart(2, '0'), { top: '16px', left: '16px' });
          M.txt(d, 0, 196, M.f(700, 17, M.CN), i === 2 || i === 7 ? INK : 'rgba(255,255,255,.9)', '你可真有意思', { top: '198px', left: '0px', width: '162px', textAlign: 'center', letterSpacing: '1px' });
          return d;
        });
        s.sp = spark(c, 790, 300, 44, OR);
        return s;
      }, (s, t, a) => {
        M.rise(s.kick, t, a + .04, 99, { dy: 14 });
        M.hero(s.h1, t, a + .1, 99, { dx: -70 });
        M.hero(s.h2, t, a + .26, 99, { dx: -70 });
        M.pop(s.six, t, a + .5, 99, { from: 1.2 });
        M.pop(s.x10, t, a + 1.2, 99, { from: 1.5 });
        s.x10.style.transform = `rotate(${(-5 + 3 * Math.sin((t - a) * 2.2)).toFixed(2)}deg)`;
        s.chips.forEach((d, i) => {
          const u = M.os((t - a - .9 - i * .12) / .3), v = M.env(t, a + .9 + i * .12, 99, .3);
          d.style.opacity = v.a.toFixed(3);
          d.style.transform = `scale(${(.6 + .4 * v.e).toFixed(3)}) translateY(${(Math.sin((t - a) * 1.7 + i) * 3).toFixed(1)}px)`;
        });
        s.sp.style.opacity = clamp((t - a - 1.6) / .3).toFixed(3); s.sp.style.transform = `rotate(${((t - a) * 26).toFixed(1)}deg)`;
      }],
      /* ③ 每一遍都是不同的场景 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: `linear-gradient(140deg,#f7f4ee 0%,#fff8ec 60%,#f3e6d2 100%)`, zIndex: 0 });
        s.dots = M.dots(c, 'rgba(42,33,26,.09)', 44, 1.7); s.dots.style.zIndex = 1;
        s.kick = mono(c, 96, 104, 'EVERY TAKE · 每一遍', INK, 24, 3);
        s.h1 = CN(c, 92, 144, '每一遍', 100, INK);
        s.h2 = CN(c, 92, 250, '不同场景', 100, RED);
        const EM = [['惊喜', 'SURPRISE', LIME, INK, 'joy'], ['讽刺', 'IRONY', PUR, '#fff', 'wry'], ['真心夸奖', 'PRAISE', BLUE, '#fff', 'smile'], ['哭笑不得', 'HELPLESS', OR, '#fff', 'sad']];
        s.cards = EM.map(([txt, en, bg, fg, faceType], i) => {
          const d = M.box(c, 96 + (i % 2) * 460, 360 + Math.floor(i / 2) * 240, { width: '430px', height: '220px', background: bg, color: fg, borderRadius: '24px', boxShadow: '0 14px 0 rgba(42,33,26,.2)', zIndex: 5, transformOrigin: '50% 50%' });
          face(d, faceType === 'smile' ? 'joy' : faceType, fg, 24, 66, 96);
          M.txt(d, 138, 54, M.f(900, 48, M.CN), fg, txt, { top: '54px', left: '138px', lineHeight: 1 });
          M.txt(d, 140, 124, M.f(700, 17, M.MONO), fg, en, { top: '124px', left: '140px', letterSpacing: '3px', opacity: .8, lineHeight: 1 });
          M.txt(d, 140, 168, M.f(700, 20, M.MONO), fg, 'SCENE 0' + (i + 1), { top: '168px', left: '140px', letterSpacing: '2px', opacity: .65, lineHeight: 1 });
          return d;
        });
        s.line = M.box(c, 96, 842, { background: INK, color: '#fff', font: M.f(700, 42, M.CN), padding: '14px 26px', borderRadius: '12px', zIndex: 6, whiteSpace: 'nowrap', transformOrigin: '0 50%' }, '每一遍，都是不同的场景');
        const MC = [LIME, BLUE, RED, OR, PUR, TEAL, '#ff5fa2', '#ffd23f', '#14b8a6', '#4d8bff'];
        s.mini = MC.map((col, i) => {
          const d = M.box(c, 1050 + (i % 5) * 146, 206 + Math.floor(i / 5) * 156, { width: '128px', height: '132px', background: '#fff', border: `4px solid ${col}`, borderRadius: '14px', color: INK, zIndex: 5, transformOrigin: '50% 50%', boxShadow: '0 8px 0 rgba(42,33,26,.12)' });
          M.txt(d, 0, 10, M.f(900, 44, M.MONO), col, String(i + 1).padStart(2, '0'), { top: '12px', left: '0px', width: '128px', textAlign: 'center', lineHeight: 1 });
          M.txt(d, 0, 84, M.f(700, 13, M.MONO), 'rgba(42,33,26,.55)', 'TAKE', { top: '84px', left: '0px', width: '128px', textAlign: 'center', letterSpacing: '2px', lineHeight: 1 });
          return d;
        });
        s.x10 = M.box(c, 1150, 560, { width: '180px', height: '180px', borderRadius: '50%', border: `8px solid ${RED}`, color: RED, font: M.f(900, 52, M.CN), lineHeight: '164px', textAlign: 'center', zIndex: 7, transformOrigin: '50% 50%' }, '×10');
        s.sp = spark(c, 1000, 620, 42, OR);
        return s;
      }, (s, t, a) => {
        M.rise(s.kick, t, a + .04, 99, { dy: 14 });
        M.hero(s.h1, t, a + .1, 99, { dx: -70 });
        M.hero(s.h2, t, a + .24, 99, { dx: -70 });
        s.cards.forEach((d, i) => {
          const t0 = a + [.15, 1.7, 2.65, 2.85][i], u = M.os((t - t0) / .32), v = M.env(t, t0, 99, .32);
          d.style.opacity = v.a.toFixed(3);
          d.style.transform = `scale(${(.7 + .3 * v.e).toFixed(3)}) translateY(${(Math.sin((t - a) * 1.8 + i) * 3).toFixed(1)}px)`;
        });
        s.mini.forEach((d, i) => M.pop(d, t, a + .3 + i * .06, 99, { from: .4 }));
        M.rise(s.line, t, a + 4.15, 99, { dy: 18 });
        const sv = M.env(t, a + 1.2, 99, .34), su = M.os((t - a - 1.2) / .34);
        s.x10.style.opacity = sv.a.toFixed(3);
        s.x10.style.transform = `rotate(${(-14 + 8 * (1 - su)).toFixed(2)}deg) scale(${(1 + .2 * (1 - su)).toFixed(3)})`;
        s.sp.style.opacity = clamp((t - a - 1.5) / .3).toFixed(3); s.sp.style.transform = `rotate(${((t - a) * 24).toFixed(1)}deg)`;
      }]
    ]
  });

  C.huigeKeys = [{ t: 0, d: 0, L: TL }, { t: 10.3, d: .6, L: BR }];
  C.src0 = 50.9; C.end = 16.6667; C.huigeDir = '../media/huige';
  C.face = { x: .5193, y: .2904, h: .341 }; C.src = { w: 1920, h: 1080 };

  /* 收尾 66.5–67.57：十个场景，交给下一段 */
  C.scene({
    t0: 15.62, t1: 16.75, z: 3, quiet: true, bg: '#f7f4ee',
    build(L) {
      const st = {};
      st.bg = M.box(L, 0, 0, { width: '1920px', height: '1080px', background: 'linear-gradient(140deg,#f7f4ee,#fff8ec)', zIndex: 0 });
      st.dots = M.dots(L, 'rgba(42,33,26,.08)', 44, 1.7);
      st.k = mono(L, 96, 220, 'TEN TAKES · 十遍', 'rgba(42,33,26,.6)', 24, 4);
      st.h = CN(L, 92, 270, '十个场景', 140, INK);
      st.x = M.box(L, 820, 300, { width: '200px', height: '200px', borderRadius: '50%', border: `9px solid ${RED}`, color: RED, font: M.f(900, 60, M.CN), lineHeight: '182px', textAlign: 'center', zIndex: 7, transformOrigin: '50% 50%' }, '×10');
      st.chip = M.box(L, 100, 500, { background: LIME, color: INK, font: M.f(900, 40, M.CN), padding: '12px 26px', borderRadius: '12px', boxShadow: '0 14px 0 rgba(42,33,26,.18)', zIndex: 6, transformOrigin: '0 50%' }, '下一句，你会发现');
      st.sp = spark(L, 620, 700, 44, OR);
      return st;
    },
    update(lt, st) {
      const u = clamp((lt - .02) / .3);
      st.k.style.opacity = u.toFixed(3);
      st.h.style.opacity = M.o3(u).toFixed(3);
      st.h.style.transform = `translateX(${(-60 * (1 - M.o5(u))).toFixed(1)}px)`;
      const c2 = clamp((lt - .12) / .3);
      st.x.style.opacity = c2.toFixed(3); st.x.style.transform = `rotate(-12deg) scale(${M.os(c2).toFixed(3)})`;
      const c3 = clamp((lt - .2) / .3);
      st.chip.style.opacity = c3.toFixed(3); st.chip.style.transform = `scale(${M.os(c3).toFixed(3)})`;
      st.sp.style.opacity = clamp((lt - .25) / .3).toFixed(3); st.sp.style.transform = `rotate(${(lt * 40).toFixed(1)}deg)`;
    }
  });
})();
