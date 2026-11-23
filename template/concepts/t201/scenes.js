/* T201 工业管线 Industrial Pipeline — real P&ID language:
 * source silo → gate valve → vessel (level rises) → centrifugal pump → filter → fill line → conveyor.
 * Flow is drawn INSIDE the pipe (animated cyan dashes), the whole route stays one continuous system;
 * gauges, readouts and the counter are live. 10 s, silent, sample copy. */
(function () {
  const C = EV, M = K.T.mo, { el, clamp } = C;
  const STEEL = '#7c858e', STL = '#aab3ba', STD = '#4b545c', BODY = '#394047',
        CY = '#4cc9f0', Y = '#f2c14e', TXT = '#eef1f3', MUT = '#98a1a8', GRN = '#58c98a';

  const G = (id, stops) => `<defs><linearGradient id="${id}" x1="0" x2="1">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`;

  M.setup({
    noface: true, bg: '#2b2f33', port: { box: [60, 70, 1800, 770] },
    captions: M.caps([
      ['原料进管，全程封闭', 'Raw material enters, fully sealed'],
      ['泵送、过滤、稳压', 'Pumped, filtered, regulated'],
      ['成品出厂，一条线跑完', 'Finished goods out, one continuous line']
    ]),
    build(L) {
      const s = {};
      const plate = (x, y, cn, en) => {
        const g = M.box(L, x, y, { padding: '8px 15px', background: 'rgba(18,21,24,.74)', border: '1px solid rgba(170,179,186,.3)', borderRadius: '8px' });
        M.X(g, 0, 0, 22, TXT, cn, 900, M.CN);
        M.txt(g, 0, 28, M.f(700, 12, M.MONO), MUT, en, { letterSpacing: '2.4px' });
        return g;
      };

      /* ---------- backdrop ---------- */
      s.grid = M.grid(L, 'rgba(255,255,255,.034)', 60);
      M.box(L, 0, 0, { width: '1920px', height: '1080px', background: 'radial-gradient(ellipse at 50% 42%, rgba(255,255,255,.05), transparent 58%), radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,.38))' });

      /* ---------- title block ---------- */
      s.eyebrow = M.txt(L, 84, 44, M.f(700, 16, M.MONO), '#8a939c', 'HUIGE PROCESS / P&ID · SHEET 01', { letterSpacing: '3px' });
      s.title = M.X(L, 80, 68, 64, TXT, '工业管线', 900, M.CN);
      s.sub = M.X(L, 84, 146, 24, MUT, 'PIPELINE · 从原料到成品', 700, M.CN);

      /* ---------- live readout ---------- */
      s.sys = M.box(L, 1500, 84, { width: '324px', textAlign: 'right' });
      M.txt(s.sys, 0, 0, M.f(700, 15, M.MONO), MUT, 'SYSTEM 01 · RUNNING', { letterSpacing: '2px' });
      s.flowT = M.txt(s.sys, 0, 26, M.f(700, 15, M.MONO), CY, 'FLOW 0.0 L/MIN');
      s.presT = M.txt(s.sys, 0, 52, M.f(700, 15, M.MONO), MUT, 'PRESSURE 0.00 MPa');

      /* ---------- framing legs (behind the pipe) ---------- */
      s.legs = M.svg(L, 0, 0, 1920, 1080, `<g stroke="${STD}" stroke-width="9" stroke-linecap="round"><path d="M152 468 L142 742"/><path d="M280 468 L292 742"/><path d="M142 742H292" stroke-width="7"/></g>`);

      /* ---------- pipe: one continuous orthogonal route ---------- */
      const FEED = 'M210 560 H600', PROC = 'M920 560 H1450 V728';
      s.pipes = M.svg(L, 0, 0, 1920, 1080, G('pipeG', [[0, STD], [.5, STEEL], [1, STD]]));
      s.feedD = M.path(s.pipes, 0, 0, 1920, 1080, FEED, STD, 34);
      s.feedL = M.path(s.pipes, 0, 0, 1920, 1080, FEED, STEEL, 22);
      s.procD = M.path(s.pipes, 0, 0, 1920, 1080, PROC, STD, 34);
      s.procL = M.path(s.pipes, 0, 0, 1920, 1080, PROC, STEEL, 22);
      const FLOW = 'M210 560 H600 M920 560 H1450 V728';
      s.flowG = M.path(s.pipes, 0, 0, 1920, 1080, FLOW, CY, 17);
      s.flow = M.path(s.pipes, 0, 0, 1920, 1080, FLOW, CY, 7);
      [s.flowG, s.flow].forEach(p => { p.removeAttribute('pathLength'); p.setAttribute('stroke-dasharray', '20 30'); p.setAttribute('stroke-linecap', 'round'); p.style.opacity = '0'; });

      /* direction chevrons on the pipe */
      s.chev = M.svg(L, 0, 0, 1920, 1080, `<g fill="${CY}">${[470, 1050, 1240, 1400].map(x => `<path d="M${x} 547 L${x + 18} 560 L${x} 573 Z"/>`).join('')}</g>`);

      /* ---------- source silo ---------- */
      s.silo = M.svg(L, 110, 210, 200, 360, `
        ${G('siloG', [[0, '#313840'], [.2, '#525b63'], [.5, '#68737c'], [.8, '#4a525a'], [1, '#2e343a']])}
        <clipPath id="silClip"><path d="M8 0 H192 V250 L130 350 H70 L8 250 Z"/></clipPath>
        <path d="M8 0 H192 V250 L130 350 H70 L8 250 Z" fill="url(#siloG)" stroke="${STL}" stroke-width="4"/>
        <ellipse cx="100" cy="1" rx="92" ry="15" fill="${STL}" opacity=".85"/>
        <path d="M8 64H192M8 128H192M8 192H192" stroke="${STD}" stroke-width="2" opacity=".5"/>
        <g clip-path="url(#silClip)">${Array.from({ length: 7 }, (_, i) => `<circle class="dot" cx="${52 + (i * 37) % 100}" cy="0" r="6" fill="${Y}" opacity="0"/>`).join('')}</g>`, { transformOrigin: '50% 50%' });
      s.dots = [...s.silo.querySelectorAll('circle.dot')];

      /* ---------- gate valve ---------- */
      s.valve = M.svg(L, 0, 0, 1920, 1080, `
        <g stroke="${STL}" stroke-width="4" fill="${BODY}">
          <path d="M368 528 L432 560 L368 592 Z"/><path d="M432 528 L368 560 L432 592 Z"/>
        </g>
        <line x1="400" y1="528" x2="400" y2="488" stroke="${STL}" stroke-width="6"/>
        <g class="wheel" style="transform-origin:400px 482px">
          <circle cx="400" cy="482" r="24" fill="none" stroke="${Y}" stroke-width="5"/>
          <path d="M400 460V504M378 482H422" stroke="${Y}" stroke-width="4"/>
        </g>`, { transformOrigin: '50% 50%' });
      s.wheel = s.valve.querySelector('.wheel');

      /* ---------- vessel ---------- */
      s.tank = M.svg(L, 600, 272, 320, 548, `
        ${G('tkG', [[0, '#31383f'], [.18, '#4d565e'], [.5, '#5c666f'], [.82, '#454d55'], [1, '#2f353b']])}
        <ellipse cx="160" cy="520" rx="160" ry="28" fill="#262c31" stroke="${STL}" stroke-width="3"/>
        <rect x="0" y="28" width="320" height="492" fill="url(#tkG)" stroke="${STL}" stroke-width="3"/>
        <ellipse cx="160" cy="28" rx="160" ry="28" fill="#6b757e" stroke="${STL}" stroke-width="3"/>
        <path d="M22 140H298M22 400H298" stroke="${STD}" stroke-width="2" opacity=".35"/>
        <rect x="-12" y="254" width="20" height="68" rx="4" fill="${STL}" stroke="${STD}" stroke-width="2"/>
        <rect x="312" y="254" width="20" height="68" rx="4" fill="${STL}" stroke="${STD}" stroke-width="2"/>
        <rect x="302" y="84" width="14" height="412" rx="7" fill="#20252a" stroke="${STD}" stroke-width="2"/>
        <g stroke="#66717a" stroke-width="2">${Array.from({ length: 10 }, (_, i) => `<line x1="304" y1="${94 + i * 44}" x2="314" y2="${94 + i * 44}"/>`).join('')}</g>`, { transformOrigin: '50% 50%' });

      s.liquid = M.box(L, 612, 470, { width: '296px', height: '0px', background: 'linear-gradient(180deg, rgba(76,201,240,.88), rgba(31,126,164,.92))', boxShadow: '0 0 30px rgba(76,201,240,.2)' });
      s.surf = el(s.liquid, 'div', 'abs', { left: '0', top: '-2px', width: '296px', height: '4px', background: '#b4efff', opacity: '.9', borderRadius: '2px' });
      s.bubbles = [0, 1, 2].map(i => el(s.liquid, 'div', 'abs', { left: (50 + i * 82) + 'px', bottom: '0', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,.4)' }));

      /* level marker (the strip itself lives in the vessel SVG) */
      s.lvl = M.box(L, 896, 800, { width: '26px', height: '5px', background: CY, borderRadius: '3px', boxShadow: '0 0 10px rgba(76,201,240,.8)' });

      /* pressure gauge on the vessel top */
      s.gauge = M.svg(L, 790, 292, 116, 116, `
        <circle cx="58" cy="58" r="48" fill="#22272c" stroke="${STL}" stroke-width="4"/>
        ${Array.from({ length: 11 }, (_, i) => { const a = (-210 + i * 24) * Math.PI / 180; const r1 = 36, r2 = i % 5 === 0 ? 26 : 30; return `<line x1="${(58 + Math.cos(a) * r1).toFixed(1)}" y1="${(58 + Math.sin(a) * r1).toFixed(1)}" x2="${(58 + Math.cos(a) * r2).toFixed(1)}" y2="${(58 + Math.sin(a) * r2).toFixed(1)}" stroke="${i % 5 === 0 ? '#cfd6db' : '#7c858e'}" stroke-width="${i % 5 === 0 ? 3 : 2}"/>`; }).join('')}
        <line class="nd" x1="58" y1="58" x2="58" y2="24" stroke="${Y}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="58" cy="58" r="6" fill="${Y}"/>
        <text x="58" y="92" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" fill="${MUT}">MPa</text>`, { transformOrigin: '50% 50%' });
      s.needle = s.gauge.querySelector('.nd');

      /* ---------- pump ---------- */
      s.pump = M.svg(L, 1015, 485, 150, 150, `
        <circle cx="75" cy="75" r="66" fill="${BODY}" stroke="${STL}" stroke-width="7"/>
        <circle cx="75" cy="75" r="48" fill="none" stroke="${STD}" stroke-width="2"/>
        <g class="imp">${[0, 90, 180, 270].map(a => `<path d="M75 75 L75 36" stroke="${STL}" stroke-width="10" stroke-linecap="round" transform="rotate(${a} 75 75)"/>`).join('')}</g>
        <circle cx="75" cy="75" r="12" fill="${Y}" stroke="#c99a2b" stroke-width="2"/>
        <rect x="22" y="151" width="106" height="14" rx="4" fill="${STD}"/>`, { transformOrigin: '50% 50%' });
      s.imp = s.pump.querySelector('.imp');

      /* ---------- filter ---------- */
      s.filter = M.svg(L, 1268, 352, 104, 392, `
        ${G('fltG', [[0, '#31383f'], [.2, '#525b63'], [.5, '#66717a'], [.8, '#4a525a'], [1, '#2f353b']])}
        <rect x="7" y="26" width="90" height="340" rx="34" fill="url(#fltG)" stroke="${STL}" stroke-width="4"/>
        <rect x="28" y="6" width="48" height="28" rx="6" fill="${STL}" stroke="${STD}" stroke-width="2"/>
        <g stroke="${STD}" stroke-width="2" opacity=".55">${Array.from({ length: 12 }, (_, i) => `<line x1="18" y1="${62 + i * 24}" x2="86" y2="${62 + i * 24}"/>`).join('')}</g>`, { transformOrigin: '50% 50%' });

      /* ---------- fill line + conveyor ---------- */
      s.belt = M.box(L, 1340, 800, { width: '520px', height: '26px', background: 'repeating-linear-gradient(90deg,#4e575f 0 36px,#3b4249 36px 72px)', borderTop: `3px solid #69737c`, borderBottom: '3px solid #2a3035', borderRadius: '4px' });
      s.rollers = M.svg(L, 1340, 818, 520, 46, `<g fill="${BODY}" stroke="${STD}" stroke-width="3">${Array.from({ length: 9 }, (_, i) => `<circle cx="${26 + i * 58}" cy="18" r="11"/>`).join('')}</g>`);
      s.crates = [0, 1, 2, 3].map(i => M.box(L, 1400 + i * 120, 732, {
        width: '96px', height: '68px', borderRadius: '3px',
        background: 'repeating-linear-gradient(90deg,#e0b043 0 22px,#c99a2b 22px 27px)',
        border: '3px solid #8f6f1f', boxSizing: 'border-box', boxShadow: '0 8px 16px rgba(0,0,0,.28)'
      }));
      s.spout = M.svg(L, 1426, 714, 48, 22, `<rect x="10" y="-14" width="28" height="16" rx="3" fill="${STL}" stroke="${STD}" stroke-width="2"/><path d="M0 0H48L38 22H10 Z" fill="${STL}" stroke="${STD}" stroke-width="3"/>`);
      s.drops = [0, 1, 2].map(i => M.box(L, 1443 + i * 6, 736, { width: '6px', height: '9px', borderRadius: '50%', background: CY, opacity: '0' }));

      /* output counter */
      s.outBox = M.box(L, 1600, 548, { width: '260px', textAlign: 'right' });
      M.txt(s.outBox, 0, 0, M.f(700, 15, M.MONO), MUT, 'OUTPUT · SHIPPED', { letterSpacing: '2.4px' });
      s.counter = M.txt(s.outBox, 0, 22, M.f(900, 74, M.AN), TXT, '000');
      s.done = M.box(L, 1600, 676, { padding: '8px 16px', background: 'rgba(88,201,138,.12)', border: '2px solid rgba(88,201,138,.6)', borderRadius: '8px' });
      M.txt(s.done, 0, 0, M.f(700, 21, M.CN), GRN, '交付 ✓  DELIVERED');

      /* ---------- labels ---------- */
      s.pSilo = plate(330, 226, '原料仓', 'SILO  S-01');
      s.pTank = plate(596, 224, '反应罐', 'VESSEL  T-01');
      s.pPump = plate(1000, 664, '离心泵', 'PUMP  P-01');
      s.pFilter = plate(1236, 300, '过滤器', 'FILTER  F-01');

      return s;
    },
    update(s, t) {
      /* backdrop + header */
      s.grid.style.opacity = M.o3(t / .5).toFixed(3);
      s.grid.style.transform = `translate(${(-t * 3).toFixed(1)}px, ${(-t * 1.5).toFixed(1)}px)`;
      M.hero(s.title, t, .25, 9.65, { dx: -80, din: .5 });
      M.rise(s.eyebrow, t, .32, 9.7, { dy: 16 });
      M.rise(s.sub, t, .4, 9.7, { dy: 18 });
      M.rise(s.sys, t, .45, 9.7, { dy: 20 });

      /* pipe draws in, then flow runs inside it */
      M.draw(s.feedD, t, .45, .9); M.draw(s.feedL, t, .55, .9);
      M.draw(s.procD, t, 1.05, 1.1); M.draw(s.procL, t, 1.15, 1.1);
      const fv = M.o3((t - 1.95) / .6);
      s.flow.style.opacity = (fv * .95).toFixed(3); s.flowG.style.opacity = (fv * .16).toFixed(3);
      const off = (-(t - 1.9) * 165).toFixed(1);
      s.flow.setAttribute('stroke-dashoffset', off); s.flowG.setAttribute('stroke-dashoffset', off);
      const chev = s.chev.querySelector('g');
      chev.style.opacity = (fv * (.45 + .55 * (0.5 + 0.5 * Math.sin(t * 5)))).toFixed(3);

      /* source */
      M.pop(s.legs, t, .42, 9.7, { from: .96 });
      M.pop(s.silo, t, .52, 9.7, { from: .8 });
      s.dots.forEach((c, i) => {
        const u = ((t * .17 + i * .15) % 1), y = 34 + u * 268;
        c.setAttribute('cy', y.toFixed(1));
        c.style.opacity = (t > .8 ? (.8 * (1 - u * .45)).toFixed(2) : 0);
      });

      /* valve opens */
      M.pop(s.valve, t, .72, 9.7, { from: .6 });
      s.wheel.style.transform = `rotate(${(-120 * M.o3((t - .9) / .8)).toFixed(1)}deg)`;

      /* vessel fills */
      M.pop(s.tank, t, .88, 9.7, { from: .86 });
      const fill = M.o3((t - 1.35) / 1.7), top = 800 - 330 * fill;
      s.liquid.style.opacity = t > 1.25 ? 1 : 0;
      s.liquid.style.top = top.toFixed(1) + 'px';
      s.liquid.style.height = (810 - top).toFixed(1) + 'px';
      s.surf.style.transform = `translateY(${(Math.sin(t * 3.1) * 1.1).toFixed(1)}px)`;
      const lh = 810 - top;
      s.bubbles.forEach((b, i) => {
        const u = ((t * .23 + i * .33) % 1);
        b.style.bottom = (u * lh).toFixed(1) + 'px';
        b.style.opacity = (t > 2.0 ? (.5 * (1 - u)) : 0).toFixed(2);
      });
      s.lvl.style.top = (top - 2).toFixed(1) + 'px';
      s.lvl.style.opacity = t > 1.35 ? 1 : 0;

      /* pressure gauge sweeps, then breathes */
      const gt = clamp((t - 3.3) / .9), wobble = t > 4.2 ? Math.sin(t * 2.1) * 3.5 : 0;
      s.needle.setAttribute('transform', `rotate(${(-68 + 136 * M.o3(gt) + wobble).toFixed(1)} 58 58)`);
      M.pop(s.gauge, t, 3.05, 9.7, { from: .8 });

      /* pump + filter come on line */
      M.pop(s.pump, t, 2.85, 9.7, { from: .7 });
      s.imp.setAttribute('transform', `rotate(${(Math.max(0, t - 2.9) * 265).toFixed(1)} 75 75)`);
      M.pop(s.filter, t, 3.1, 9.7, { from: .7 });

      /* conveyor + fill */
      M.rise(s.belt, t, 6.3, 9.7, { dy: 36 });
      M.rise(s.rollers, t, 6.34, 9.7, { dy: 36 });
      s.belt.style.backgroundPosition = `${(-(t - 6.3) * 190).toFixed(0)}px 0`;
      s.crates.forEach((c, i) => {
        const e = M.o3((t - (6.5 + i * .22)) / .45);
        c.style.opacity = e.toFixed(3);
        c.style.transform = `translateX(${(((1 - e) * 170) + Math.max(0, t - 6.3) * 9).toFixed(1)}px)`;
      });
      M.pop(s.spout, t, 6.4, 9.7, { from: .8 });
      s.drops.forEach((d, i) => {
        const u = ((t * .9 + i * .34) % 1);
        d.style.opacity = (t > 6.75 ? (.85 * (1 - u)) : 0).toFixed(2);
        d.style.transform = `translateY(${(u * 46).toFixed(1)}px)`;
      });
      M.rise(s.outBox, t, 6.55, 9.7, { dy: 22 });
      M.count(s.counter, 128, t, 6.9, 2.1, v => String(Math.round(+v)).padStart(3, '0'));
      M.pop(s.done, t, 9.0, 9.95, { from: .7 });

      /* labels */
      M.rise(s.pSilo, t, .78, 9.7, { dy: 20 });
      M.rise(s.pTank, t, 1.02, 9.7, { dy: 20 });
      M.rise(s.pPump, t, 3.05, 9.7, { dy: 20 });
      M.rise(s.pFilter, t, 3.3, 9.7, { dy: 20 });

      /* live numbers */
      M.count(s.flowT, 24, t, 1.2, 1.0, v => `FLOW ${(+v).toFixed(1)} L/MIN`);
      M.count(s.presT, 1.82, t, 3.35, 1.0, v => `PRESSURE ${(+v).toFixed(2)} MPa`);
    }
  });
})();
