/* T159 明暗快切 Flash Cut: black/white split, huge characters, the window flips B&W ↔ colour on beats. */
(function () { const M = K.T.mo, X = M.X, R = '#e63946';
  const split = (c, inv) => { M.box(c, 0, 0, { width: '960px', height: '1080px', background: inv ? '#2a2cf2' : '#d4ff2e' }); M.box(c, 960, 0, { width: '960px', height: '1080px', background: inv ? '#ff2b3d' : '#2a2cf2' }); };
  const beat = (s, t, a) => { const k = Math.floor((t - a) * 2.5); s.bg.style.opacity = k % 2; };
  M.story({ bg: '#000', sbg: ['#000', '#fff', '#000'], tr: ['shutter', 'shutter'], ring: () => ({ color: '#ffffff', width: 10, shadow: .4 }),
    wins: [M.c(760, 300, 400), M.q(110, 240, 520, 520, 0), M.q(1250, 210, 540, 640, 2, 1.5)],
    caps: [], port: { box: [0, 40, 1920, 1000] },
    scenes: [
      [c => { split(c); return { bg: M.box(c, 0, 0, { width: '1920px', height: '1080px', background: 'linear-gradient(90deg,#d4ff2e 50%,#2a2cf2 50%)' }), l: X(c, 200, 280, 460, '#0b0b0d', '卡', 900, M.CN, { zIndex: 5 }), r: X(c, 1260, 280, 460, '#ffffff', '住', 900, M.CN, { zIndex: 5, textShadow: '0 8px 0 rgba(11,11,13,.35)' }), bar: M.box(c, 0, 1040, { width: '1920px', height: '10px', background: R, transformOrigin: '0 50%' }) }; },
       (s, t, a) => { M.pop(s.l, t, a + .1, 99, { from: 1.6 }); M.pop(s.r, t, a + .3, 99, { from: 1.6 }); s.bg.style.opacity = (Math.floor((t - a) * 2.5) % 2) * .14; s.bar.style.transform = `scaleX(${Math.min(1, Math.max(0, (t - a) / 3))})`; }],
      [c => ({ w: ['越练', '越看', '越丧', '越停'].map((n, i) => { const bg = ['#d4ff2e','#2a2cf2','#ff2b3d','#8a5cff'][i]; return X(c, 760 + (i % 2) * 520, 220 + Math.floor(i / 2) * 340, 200, i === 0 ? '#0b0b0d' : '#fff', n, 900, M.CN, { background: bg, padding: '0 20px', borderRadius: '18px', boxShadow: '0 12px 0 rgba(11,11,13,.18)' }); }) }),
       (s, t, a) => s.w.forEach((e, i) => { e.style.opacity = t > a - .1 + i * .4 ? 1 : 0; e.style.transform = `scale(${(1 + .3 * Math.max(0, 1 - (t - a + .1 - i * .4) * 6)).toFixed(3)})`; })],
      [c => { split(c, 1); return { bg: M.box(c, 0, 0, { width: '1920px', height: '1080px', background: R }), l: X(c, 160, 320, 260, '#000', '剪得快', 900), r: X(c, 160, 620, 140, '#fff', '看得爽 ✦', 900) }; },
       (s, t, a) => { s.bg.style.opacity = (Math.floor((t - a) * 3) % 2) * (t < a + 1.5); M.hero(s.l, t, a - .1, 99); M.hero(s.r, t, a + .3, 99); }]
    ] });
})();
