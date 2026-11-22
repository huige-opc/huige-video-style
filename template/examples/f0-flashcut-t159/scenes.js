/* T159 明暗快切 Flash Cut · 痛点开场 0–10s（满血手工版：运镜沿用概念模板，画面元素重做）
 * 很多人练口播 → 对着镜头干说 → 说完看回放 → 像个机器人 → 越看越沮丧 → 越不想练
 * 三场：① 取景器+镜头 ② 回放屏+机器人 ③ 四色循环标签+卡住印章 ④ 收尾定格（窗口停在 T04 CARD，与 f1 无缝） */
(function () {
  const M = K.T.mo, X = M.X, clamp = EV.clamp, C = EV;
  const LIME = '#d4ff2e', BLUE = '#2a2cf2', RED = '#ff2b3d', PUR = '#8a5cff', INK = '#0b0b0d', WHITE = '#ffffff';
  const mono = (p, x, y, txt, col, px, ls, sty) => M.txt(p, x, y, M.f(700, px || 26, M.MONO), col, txt,
    Object.assign({ letterSpacing: (ls == null ? 3 : ls) + 'px', zIndex: 6 }, sty || {}));
  const spark = (p, x, y, sz, col) => M.svg(p, x, y, sz, sz,
    `<path d="M${sz / 2} 0 L${sz * .6} ${sz * .4} L${sz} ${sz / 2} L${sz * .6} ${sz * .6} L${sz / 2} ${sz} L${sz * .4} ${sz * .6} L0 ${sz / 2} L${sz * .4} ${sz * .4}Z" fill="${col}"/>`,
    { zIndex: 6, transformOrigin: '50% 50%' });
  const corners = (p, i, col) => M.svg(p, 0, 0, 1920, 1080, [
    `M${i} ${i + 78} V${i} H${i + 78}`,
    `M${1920 - i - 78} ${i} H${1920 - i} V${i + 78}`,
    `M${1920 - i} ${1080 - i - 78} V${1080 - i} H${1920 - i - 78}`,
    `M${i + 78} ${1080 - i} H${i} V${1080 - i - 78}`
  ].map(d => `<path d="${d}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="square"/>`).join(''), { zIndex: 7 });
  const camIcon = (p, x, y, col) => M.svg(p, x, y, 170, 120,
    `<rect x="8" y="26" width="112" height="74" rx="14" fill="none" stroke="${col}" stroke-width="8"/><path d="M120 50 L158 30 V96 L120 76 Z" fill="none" stroke="${col}" stroke-width="8" stroke-linejoin="round"/><circle cx="64" cy="63" r="20" fill="none" stroke="${col}" stroke-width="8"/>`,
    { zIndex: 6 });
  const robotIcon = (p, x, y) => M.svg(p, x, y, 250, 250,
    `<line x1="125" y1="58" x2="125" y2="30" stroke="${INK}" stroke-width="9"/><circle cx="125" cy="22" r="14" fill="${RED}"/><rect x="20" y="58" width="210" height="152" rx="44" fill="${LIME}" stroke="${INK}" stroke-width="10"/><circle cx="88" cy="130" r="17" fill="${INK}"/><circle cx="162" cy="130" r="17" fill="${INK}"/><circle cx="94" cy="124" r="6" fill="#fff"/><circle cx="168" cy="124" r="6" fill="#fff"/><rect x="80" y="168" width="90" height="18" rx="9" fill="${INK}"/><rect x="-2" y="96" width="20" height="58" rx="10" fill="${INK}"/><rect x="232" y="96" width="20" height="58" rx="10" fill="${INK}"/>`,
    { zIndex: 6, transformOrigin: '50% 52%' });

  M.story({
    bg: RED, sbg: [LIME, WHITE, RED], tr: ['shutter', 'shutter'],
    ring: t => t < 3.45 ? { color: WHITE, width: 10, shadow: .4 }
      : t < 6.65 ? { color: INK, width: 6, shadow: .28 }
      : t < 9.2 ? { color: WHITE, width: 10, shadow: .4 }
      : { color: INK, width: 6, shadow: .28 },
    wins: [M.c(760, 300, 400), M.q(110, 240, 520, 520, 0), M.q(1250, 210, 540, 640, 2, 1.5)],
    caps: [], port: { box: [0, 40, 1920, 1000] },
    scenes: [
      /* ① 取景器 + 镜头：很多人练口播，上来对着镜头干说 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: `linear-gradient(90deg,${LIME} 50%,${BLUE} 50%)`, zIndex: 0 });
        s.lDots = M.dots(c, 'rgba(11,11,13,.16)', 46, 2); s.lDots.style.zIndex = 1; s.lDots.style.clipPath = 'inset(0 50% 0 0)';
        s.rGrid = M.grid(c, 'rgba(255,255,255,.11)', 92, 2); s.rGrid.style.zIndex = 1; s.rGrid.style.clipPath = 'inset(0 0 0 50%)';
        s.flash = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: WHITE, opacity: 0, zIndex: 2 });
        s.cor = corners(c, 34, WHITE);
        s.kick = mono(c, 198, 96, '口播痛点 · THE PROBLEM', INK, 34, 2);
        s.kicksub = mono(c, 200, 150, 'SPEAKING PRACTICE', 'rgba(11,11,13,.62)', 20, 5);
        s.rec = M.box(c, 1490, 96, { width: '16px', height: '16px', background: RED, borderRadius: '50%', zIndex: 6, transformOrigin: '50% 50%' });
        s.recT = mono(c, 1518, 84, 'REC', WHITE, 26, 4);
        s.take = mono(c, 1518, 134, 'TAKE 037', 'rgba(255,255,255,.72)', 20, 4);
        s.l = X(c, 194, 262, 440, INK, '干', 900, M.CN, { zIndex: 5, lineHeight: 1 });
        s.r = X(c, 1244, 262, 440, WHITE, '说', 900, M.CN, { zIndex: 5, lineHeight: 1, textShadow: '0 10px 0 rgba(11,11,13,.3)' });
        s.lab1 = mono(c, 204, 742, '对着镜头', 'rgba(11,11,13,.72)', 30, 2);
        s.lab2 = mono(c, 1352, 742, '直接开说', 'rgba(255,255,255,.85)', 30, 2);
        s.cam = camIcon(c, 296, 806, INK);
        s.camT = mono(c, 486, 850, 'LENS · 镜头', INK, 22, 3);
        s.arrow = M.path(c, 0, 0, 1920, 1080, 'M470 872 C700 906 1000 892 1178 818', INK, 5);
        s.tip = M.svg(c, 1150, 792, 46, 46, `<path d="M4 34 L40 6 L32 40 L22 28 Z" fill="${INK}"/>`, { zIndex: 6 });
        s.ng = M.box(c, 1466, 838, { background: LIME, color: INK, font: M.f(900, 56, M.CN), padding: '10px 26px', borderRadius: '14px', boxShadow: '0 14px 0 rgba(11,11,13,.26)', zIndex: 6, transformOrigin: '50% 50%' }, 'NG ×12');
        s.s1 = spark(c, 1700, 250, 46, LIME);
        s.s2 = spark(c, 676, 176, 34, WHITE);
        s.s3 = spark(c, 150, 954, 40, INK);
        s.bar = M.box(c, 0, 1040, { width: '1920px', height: '10px', background: RED, transformOrigin: '0 50%', zIndex: 6 });
        return s;
      }, (s, t, a) => {
        const f = M.env(t, a + .05, 99, .3);
        s.cor.style.opacity = (.85 * f.a).toFixed(3);
        M.rise(s.kick, t, a + .1, 99, { dy: 22 });
        M.rise(s.kicksub, t, a + .16, 99, { dy: 16 });
        M.rise(s.recT, t, a + .2, 99, { dy: 14 });
        M.rise(s.take, t, a + .24, 99, { dy: 14 });
        s.rec.style.opacity = f.a.toFixed(3);
        s.rec.style.transform = `scale(${(1 + .3 * Math.max(0, Math.sin((t - a) * 7))).toFixed(3)})`;
        M.rise(s.cam, t, a + .42, 99, { dy: 26 });
        M.rise(s.camT, t, a + .48, 99, { dy: 18 });
        M.draw(s.arrow, t, a + .58, .55);
        s.tip.style.opacity = clamp((t - a - 1.0) / .18).toFixed(3);
        M.hero(s.l, t, a + .64, 99, { dx: -90 });
        M.hero(s.r, t, a + .8, 99, { dx: 90 });
        M.rise(s.lab1, t, a + .92, 99, { dy: 18 });
        M.rise(s.lab2, t, a + .96, 99, { dy: 18 });
        const t0 = a + 2.05, u = M.os((t - t0) / .3), v = M.env(t, t0, 99, .3);
        s.ng.style.opacity = v.a.toFixed(3);
        s.ng.style.transform = `rotate(${(-8 + 5 * (1 - u)).toFixed(2)}deg) scale(${(.6 + .4 * v.e).toFixed(3)}) translateY(${(Math.sin((t - t0) * 2.6) * 3).toFixed(1)}px)`;
        const sp = [[s.s1, 2.15, 46], [s.s2, 1.9, 34], [s.s3, 2.3, 40]];
        sp.forEach(([e, t0, sz], i) => { e.style.opacity = clamp((t - a - t0) / .3).toFixed(3); e.style.transform = `rotate(${((t - a) * (18 + i * 6)).toFixed(1)}deg)`; });
        s.flash.style.opacity = (t > a + .5 && Math.floor((t - a) * 2.5) % 2) ? .1 : 0;
        s.bar.style.transform = `scaleX(${clamp((t - a) / 3).toFixed(3)})`;
      }],
      /* ② 回放屏 + 机器人：说完就看回放，觉得自己像一个机器人 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: 'linear-gradient(135deg,#ffffff 0%,#ffffff 58%,#e8f3ff 100%)', zIndex: 0 });
        s.dots = M.dots(c, 'rgba(42,44,242,.10)', 48, 2); s.dots.style.zIndex = 1;
        s.kick = mono(c, 742, 102, '回放复盘 · REPLAY', INK, 28, 2);
        s.kicksub = mono(c, 742, 140, 'TAKE 037 · 00:37', 'rgba(11,11,13,.55)', 18, 4);
        s.h = X(c, 736, 170, 146, INK, '看回放', 900, M.CN, { zIndex: 5, lineHeight: 1 });
        s.chip = M.box(c, 738, 330, { background: BLUE, color: WHITE, font: M.f(900, 52, M.CN), padding: '10px 28px', borderRadius: '12px', boxShadow: '0 12px 0 rgba(42,44,242,.22)', zIndex: 6, transformOrigin: '0 50%' }, '像个机器人');
        s.card = M.card(c, 740, 424, 720, 346, WHITE, { border: '5px solid ' + INK, borderRadius: '24px', boxShadow: '0 24px 0 rgba(11,11,13,.16)', zIndex: 4 });
        s.d1 = M.box(c, 770, 456, { width: '14px', height: '14px', borderRadius: '50%', background: RED, zIndex: 6 });
        s.d2 = M.box(c, 794, 456, { width: '14px', height: '14px', borderRadius: '50%', background: LIME, zIndex: 6 });
        s.d3 = M.box(c, 818, 456, { width: '14px', height: '14px', borderRadius: '50%', background: BLUE, zIndex: 6 });
        s.tag = mono(c, 852, 450, 'PLAYBACK · 00:37 / 01:12', 'rgba(11,11,13,.62)', 19, 2);
        s.play = M.box(c, 768, 494, { width: '92px', height: '92px', borderRadius: '50%', background: INK, zIndex: 6, transformOrigin: '50% 50%' });
        s.tri = M.svg(c, 798, 518, 36, 40, `<polygon points="0,0 36,20 0,40" fill="#fff" transform="translate(2,0)"/>`, { zIndex: 7, transformOrigin: '0 50%' });
        const HS = [40, 70, 55, 90, 65, 100, 48, 78, 62, 95, 58, 84, 50, 72, 96, 60, 86, 52, 76, 64, 92, 56];
        s.bars = HS.map((h, i) => {
          const col = [INK, INK, BLUE, INK, RED, INK, PUR][i % 7];
          const b = M.box(c, 886 + i * 24, 622 - h, { width: '12px', height: h + 'px', background: col, borderRadius: '6px', zIndex: 5, transformOrigin: '50% 100%' });
          b.h = h; return b;
        });
        s.tc = mono(c, 886, 636, '00:37', 'rgba(11,11,13,.6)', 22, 2);
        s.tc2 = mono(c, 1310, 636, '01:12', 'rgba(11,11,13,.35)', 22, 2);
        s.track = M.box(c, 886, 690, { width: '560px', height: '8px', borderRadius: '4px', background: 'rgba(11,11,13,.14)', zIndex: 5 });
        s.fill = M.box(c, 886, 690, { width: '560px', height: '8px', borderRadius: '4px', background: INK, transformOrigin: '0 50%', zIndex: 6 });
        s.head = M.box(c, 882, 682, { width: '24px', height: '24px', borderRadius: '50%', background: RED, border: '3px solid #fff', boxShadow: '0 3px 8px rgba(0,0,0,.3)', zIndex: 7 });
        s.robot = robotIcon(c, 1500, 318);
        s.rlab = M.box(c, 1492, 596, { background: INK, color: LIME, font: M.f(700, 22, M.MONO), letterSpacing: '2px', padding: '10px 18px', borderRadius: '8px', zIndex: 7 }, 'ROBOTIC · 像机器人');
        s.link = M.path(c, 0, 0, 1920, 1080, 'M1130 378 C1240 322 1380 344 1492 404', INK, 4);
        s.node = M.box(c, 1482, 394, { width: '18px', height: '18px', borderRadius: '50%', background: RED, zIndex: 7 });
        s.sp = spark(c, 1744, 232, 40, RED);
        return s;
      }, (s, t, a) => {
        M.rise(s.kick, t, a + .08, 99, { dy: 18 });
        M.rise(s.kicksub, t, a + .12, 99, { dy: 14 });
        M.hero(s.h, t, a + .28, 99, { dx: -80 });
        M.panel(s.card, t, a + .42, 99, { r: 24 });
        [s.d1, s.d2, s.d3, s.tag].forEach((e, i) => M.pop(e, t, a + .58 + i * .04, 99, { from: .7 }));
        M.pop(s.play, t, a + .7, 99, { from: .6 });
        M.pop(s.tri, t, a + .74, 99, { from: .4 });
        s.bars.forEach((b, i) => {
          const v = M.env(t, a + .8 + i * .015, 99, .3);
          b.style.opacity = v.a.toFixed(3);
          const k = M.o3(clamp((t - a - .8 - i * .015) / .3));
          b.style.transform = `scaleY(${(k * (.92 + .08 * Math.sin(t * 6 + i * .9))).toFixed(3)})`;
        });
        s.tc.style.opacity = clamp((t - a - .9) / .25).toFixed(3);
        s.tc2.style.opacity = clamp((t - a - .95) / .25).toFixed(3);
        const pr = M.o3(clamp((t - a - .9) / 1.1)) * .52;
        s.fill.style.transform = `scaleX(${pr.toFixed(4)})`;
        s.head.style.left = (882 + 560 * pr) + 'px';
        s.head.style.opacity = clamp((t - a - .9) / .2).toFixed(3);
        const v = M.env(t, a + 2.1, 99, .3);
        M.pop(s.chip, t, a + 2.1, 99, { from: 1.5 });
        M.pop(s.robot, t, a + 2.16, 99, { from: .5 });
        s.robot.style.transform = `rotate(${(Math.sin((t - a) * 1.9) * 2).toFixed(2)}deg) translateY(${(Math.sin((t - a) * 2.3) * 3).toFixed(1)}px)`;
        M.draw(s.link, t, a + 2.38, .35);
        s.node.style.opacity = clamp((t - a - 2.62) / .16).toFixed(3);
        M.rise(s.rlab, t, a + 2.5, 99, { dy: 16 });
        s.sp.style.opacity = clamp((t - a - 2.4) / .3).toFixed(3);
        s.sp.style.transform = `rotate(${((t - a) * 30).toFixed(1)}deg)`;
      }],
      /* ③ 四色循环标签 + 卡住：越看越沮丧，越不想练 */
      [c => {
        const s = {};
        s.bg = M.box(c, 0, 0, { width: '1920px', height: '1080px', background: `linear-gradient(160deg,${RED} 0%,${RED} 55%,#c11c2c 100%)`, zIndex: 0 });
        s.dots = M.dots(c, 'rgba(255,255,255,.15)', 50, 2); s.dots.style.zIndex = 1;
        s.ring = M.svg(c, 90, 195, 1110, 570, `<ellipse cx="555" cy="285" rx="548" ry="262" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="6" stroke-dasharray="16 18"/>`, { zIndex: 2, transformOrigin: '555px 285px' });
        s.kick = mono(c, 124, 98, 'THE LOOP · 死循环', WHITE, 30, 3);
        const TG = [['越练', LIME, INK], ['越看', BLUE, WHITE], ['越丧', WHITE, RED], ['越停', PUR, WHITE]];
        s.tags = TG.map(([txt, bg, fg], i) => {
          const d = M.box(c, 130 + (i % 2) * 550, 232 + Math.floor(i / 2) * 296,
            { width: '480px', height: '200px', background: bg, color: fg, font: M.f(900, 112, M.CN), display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '22px', boxShadow: '0 16px 0 rgba(0,0,0,.24)', zIndex: 5 }, txt);
          d.style.transformOrigin = '50% 50%'; return d;
        });
        s.loop = M.box(c, 615, 451, { width: '60px', height: '60px', background: WHITE, color: RED, font: M.f(900, 21, M.MONO), display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', zIndex: 7, transformOrigin: '50% 50%', boxShadow: '0 8px 0 rgba(0,0,0,.2)' }, 'LOOP');
        s.line = M.box(c, 130, 760, { background: WHITE, color: INK, font: M.f(600, 44, M.CN), padding: '14px 28px', borderRadius: '10px', zIndex: 6, boxShadow: '0 12px 0 rgba(0,0,0,.2)', whiteSpace: 'nowrap' }, '越看越沮丧 · 越不想练');
        s.stamp = M.box(c, 956, 782, { width: '120px', height: '120px', borderRadius: '50%', border: '7px solid #fff', color: '#fff', font: M.f(900, 40, M.CN), lineHeight: '106px', textAlign: 'center', zIndex: 7, transformOrigin: '50% 50%' }, '卡住');
        s.s1 = spark(c, 1120, 132, 42, LIME);
        s.s2 = spark(c, 86, 700, 34, WHITE);
        return s;
      }, (s, t, a) => {
        s.ring.style.opacity = clamp((t - a - .2) / .4).toFixed(3);
        s.ring.style.transform = `rotate(${((t - a) * 7).toFixed(1)}deg)`;
        M.rise(s.kick, t, a + .1, 99, { dy: 18 });
        s.tags.forEach((e, i) => {
          const t0 = a + .28 + i * .22, v = M.env(t, t0, 99, .32), u = M.os((t - t0) / .32);
          e.style.opacity = v.a.toFixed(3);
          e.style.transform = `scale(${(.55 + .45 * v.e).toFixed(3)}) translateY(${(Math.sin((t - a) * 2 + i * 1.6) * 3).toFixed(1)}px)`;
        });
        M.pop(s.loop, t, a + 1.25, 99, { from: 1.8 });
        s.loop.style.transform = `scale(${(1 + .06 * Math.sin((t - a) * 5)).toFixed(3)}) rotate(-6deg)`;
        M.rise(s.line, t, a + .85, 99, { dy: 24 });
        const t0 = a + 2.0;
        const sv = M.env(t, t0, 99, .3), su = M.os((t - t0) / .3);
        s.stamp.style.opacity = sv.a.toFixed(3);
        s.stamp.style.transform = `rotate(${(-12 + 8 * (1 - su)).toFixed(2)}deg) scale(${(1 + .25 * (1 - su)).toFixed(3)})`;
        s.s1.style.opacity = clamp((t - a - .6) / .3).toFixed(3);
        s.s1.style.transform = `rotate(${((t - a) * 26).toFixed(1)}deg)`;
        s.s2.style.opacity = clamp((t - a - 1.0) / .3).toFixed(3);
        s.s2.style.transform = `rotate(${(-((t - a) * 20)).toFixed(1)}deg)`;
      }]
    ]
  });

  /* 窗口收在 f1 的 CARD 上（去掉概念模板默认的 9.2s 全屏），接缝无跳变 */
  C.huigeKeys = C.huigeKeys.filter(k => k.t < 9.1);

  /* ④ 收尾定格 9.3–10.0：越不想练（画面留在左侧，不压右侧人物） */
  C.scene({
    t0: 9.28, t1: 10.05, z: 3, quiet: true, bg: RED,
    build(L) {
      const st = {};
      st.bg = M.box(L, 0, 0, { width: '1920px', height: '1080px', background: `linear-gradient(150deg,${RED} 0%,#c11c2c 100%)`, zIndex: 0 });
      st.dots = M.dots(L, 'rgba(255,255,255,.14)', 50, 2);
      st.k = mono(L, 150, 236, 'STOP THE LOOP', 'rgba(255,255,255,.8)', 26, 5);
      st.h = X(L, 144, 288, 116, WHITE, '越不想练', 900, M.CN, { zIndex: 5, lineHeight: 1 });
      st.chip = M.box(L, 150, 452, { background: LIME, color: INK, font: M.f(900, 40, M.CN), padding: '12px 26px', borderRadius: '12px', boxShadow: '0 14px 0 rgba(0,0,0,.22)', zIndex: 6, transformOrigin: '0 50%' }, '先停下来 · PAUSE');
      st.ring = M.svg(L, 140, 700, 120, 120, `<path d="M60 14 A46 46 0 1 1 22 88" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M18 96 L18 62 L52 78 Z" fill="#fff"/>`, { zIndex: 6, transformOrigin: '50% 50%' });
      st.s = spark(L, 96, 560, 38, LIME);
      return st;
    },
    update(lt, st, t) {
      const u = clamp((lt - .02) / .32);
      st.k.style.opacity = u.toFixed(3);
      st.h.style.opacity = M.o3(u).toFixed(3);
      st.h.style.transform = `translateX(${(-70 * (1 - M.o5(u))).toFixed(1)}px)`;
      const c = clamp((lt - .14) / .3);
      st.chip.style.opacity = c.toFixed(3);
      st.chip.style.transform = `scale(${M.os(c).toFixed(3)})`;
      st.ring.style.opacity = clamp((lt - .2) / .3).toFixed(3);
      st.ring.style.transform = `rotate(${(lt * 160).toFixed(1)}deg)`;
      st.s.style.opacity = clamp((lt - .3) / .3).toFixed(3);
    }
  });

  /* 本片用 1920×1080 源帧；M.setup 的默认值在这里改回项目路径 */
  C.huigeDir = '../media/huige';
  C.face = { x: .5193, y: .2904, h: .341 };
  C.src = { w: 1920, h: 1080 };
})();
