#!/usr/bin/env node
/* 项目布局契约门禁 v2
 *   node tools/check_contract.mjs sN/index.html --times 1,3,5.5,9,14.5,18,24 --query "huige=..." [--browser ...]
 *
 * 硬约束（FAIL）：
 *   1. 文本必须在安全区：x 90..1830，y 40..1040
 *   2. 文本不得进入字幕区：底部 > 862 且中心 y > 862
 *   3. 文本不得压在人物窗（#huige）上（交集 > 10% 文本面积）
 *   4. 人物窗必须完整在画框内；采样点不得半透明（0.05–0.95）
 *   5. 文本不得压在别的图形/色块上（任何有底色/描边/图片的兄弟元素，交集 > 12% 文本面积，尺寸 > 400px²）
 *      —— 文字必须放进它的色块里（成为子元素），不许"贴"在图形上
 *   6. 色块必须包住内容：有色块的元素，其可见子元素的外接框不得超出它 12px 以上（防止零尺寸胶囊把字漏在外面）
 *   7. 连线（SVG path）不得穿过卡片：沿路径采样 40 点，连续 4 点落在非祖先色块内即算穿过
 */
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const entry = args[0] && !args[0].startsWith('--') ? args[0] : null;
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
if (!entry) { console.error('usage: check_contract.mjs SECTION/index.html --times a,b,c [--query ...] [--browser ...]'); process.exit(2); }
const times = opt('times', '1,4,7').split(',').map(Number);
const SAFE = { x0: 90, y0: 40, x1: 1830, y1: 1040 };
const CAP_Y = 862;

const req = createRequire(resolve('noop.js'));
let pw; for (const m of ['playwright', 'playwright-core']) { try { pw = req(m); break; } catch { } }
if (!pw) { console.error('Install Playwright first: npm i playwright'); process.exit(2); }
const browser = await pw.chromium.launch({ executablePath: opt('browser', process.env.CHROME) || undefined, args: ['--allow-file-access-from-files', '--disable-web-security', '--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('[page error]', e.message));
await page.goto(pathToFileURL(resolve(entry)).href + (opt('query', '') ? '?' + opt('query', '') : ''));
await page.waitForFunction(() => window.READY);
await page.evaluate(() => window.READY);

let fails = 0;
for (const t of times) {
  const rep = await page.evaluate(({ t, SAFE, CAP_Y }) => {
    window.renderAt(t);
    const vis = el => { let o = 1, p = el; while (p && p.id !== 'stage') { const s = getComputedStyle(p); if (s.display === 'none' || s.visibility === 'hidden') return false; o *= parseFloat(s.opacity || '1'); p = p.parentElement; } return o > 0.05; };
    const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, b: r.y + r.height, r: r.x + r.width }; };
    const inter = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.y, b.y));
    const huige = document.getElementById('huige');
    const hv = huige && vis(huige);
    const hR = hv ? rect(huige) : null;
    const hO = huige ? parseFloat(getComputedStyle(huige).opacity) : 0;
    const out = [], under = [], caption = [], onGraphic = [], tinyChip = [], pathCross = [];
    const panels = [];   /* any opaque block/line/image that is not a full-frame background */
    const texts = [];
    document.querySelectorAll('#stage *').forEach(el => {
      if (el.closest('#huige')) return;
      if (!vis(el)) return;
      const r = rect(el); if (r.w < 2 || r.h < 2) return;
      const cs = getComputedStyle(el);
      const bgOn = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
      const borderOn = parseFloat(cs.borderTopWidth) >= 2 || parseFloat(cs.borderLeftWidth) >= 2;
      const translucent = parseFloat(cs.opacity) < .45;
      const area = r.w * r.h;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (own) texts.push({ el, txt: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30), ...r });
      if (!translucent && (el.tagName === 'IMG' || el.tagName === 'SVG' || bgOn || borderOn) && area > 400 && area < .8 * 1920 * 1080) panels.push({ el, area, ...r });
    });
    /* 1-3 文本安全区 / 字幕区 / 人物窗 */
    for (const a of texts) {
      if (a.x < SAFE.x0 - 2 || a.y < SAFE.y0 - 2 || a.r > SAFE.x1 + 2 || a.b > SAFE.y1 + 2) out.push({ txt: a.txt, ...a });
      if (a.b > CAP_Y && (a.y + a.h / 2) > CAP_Y) caption.push({ txt: a.txt, b: a.b });
      if (hR) { const ia = inter(a, hR); if (ia > .1 * a.w * a.h) under.push({ txt: a.txt, frac: +(ia / (a.w * a.h)).toFixed(2) }); }
      /* 5 文本压在别的图形上 */
      for (const p of panels) {
        if (p.el === a.el || p.el.contains(a.el) || a.el.contains(p.el)) continue;
        if (p.w >= 1900 && p.h >= 1060) continue;
        /* 背景板：完全包住文字、且在文字之前绘制 → 是底板，不算压字 */
        if (a.x >= p.x && a.y >= p.y && a.r <= p.r && a.b <= p.b && (p.el.compareDocumentPosition(a.el) & 4)) continue;
        const ix = Math.max(0, Math.min(a.r, p.r) - Math.max(a.x, p.x));
        const iy = Math.max(0, Math.min(a.b, p.b) - Math.max(a.y, p.y));
        const ip = ix * iy;
        /* 压上去就算错：只要有 6×6px 以上的真实交叠（边缘切字也要拦），或面积占比 > 12% */
        if ((ix > 6 && iy > 6) || ip > .12 * a.w * a.h) onGraphic.push({ txt: a.txt, frac: +(ip / (a.w * a.h)).toFixed(2), ix: Math.round(ix), iy: Math.round(iy) });
      }
    }
    /* 6 色块没包住内容 */
    document.querySelectorAll('#stage *').forEach(el => {
      if (el.closest('#huige')) return;
      if (!vis(el)) return;
      const cs = getComputedStyle(el);
      const bgOn = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
      if (!bgOn) return;
      const r = rect(el); if (r.w < 4 || r.h < 4) return;
      if (r.w > .8 * 1920 && r.h > .8 * 1080) return;
      let u = null;
      [...el.children].forEach(ch => { if (!vis(ch)) return; const c = rect(ch); if (c.w < 1 || c.h < 1) return; u = u ? { x: Math.min(u.x, c.x), y: Math.min(u.y, c.y), r: Math.max(u.r, c.r), b: Math.max(u.b, c.b) } : c; });
      if (!u) return;
      const over = Math.max(r.x - u.x, r.y - u.y, u.r - r.r, u.b - r.b);
      if (over > 12) tinyChip.push({ txt: (el.textContent || '').trim().slice(0, 18), over: +over.toFixed(0) });
    });
    /* 7 连线穿卡 */
    document.querySelectorAll('#stage svg path').forEach(pa => {
      const svg = pa.closest('svg');
      if (!svg || !vis(svg) || pa.closest('#huige')) return;
      /* 只查描边线（fill:none）；实心图形（星星等）不算连线 */
      if (getComputedStyle(pa).fill !== 'none') return;
      const total = pa.getTotalLength ? pa.getTotalLength() : 0;
      if (!total || total < 20) return;
      const N = 40, pts = [];
      for (let i = 0; i <= N; i++) { const p = pa.getPointAtLength(total * i / N); const m = pa.getScreenCTM(); const q = new DOMPoint(p.x, p.y).matrixTransform(m); pts.push({ x: q.x, y: q.y }); }
      for (const p of panels) {
        if (p.el.contains(svg) || svg.contains(p.el)) continue;
        if (p.w >= 1900 && p.h >= 1060) continue;
        if (p.el.tagName === 'SVG' && p.area < 2000) continue;
        const sr = svg.getBoundingClientRect();
        if (sr.x >= p.x && sr.y >= p.y && sr.right <= p.r && sr.bottom <= p.b && (p.el.compareDocumentPosition(svg) & 4)) continue;
        let run = 0, worst = 0;
        for (const q of pts) { const inside = q.x > p.x && q.x < p.r && q.y > p.y && q.y < p.b; run = inside ? run + 1 : 0; worst = Math.max(worst, run); }
        if (worst >= 4) pathCross.push({ txt: (pa.getAttribute('d') || '').slice(0, 40), worst, pr: [Math.round(p.x), Math.round(p.y), Math.round(p.w), Math.round(p.h)] });
      }
    });
    const hb = hR ? (hR.x < -2 || hR.y < -2 || hR.r > 1922 || hR.b > 1082) : false;
    const partial = hv && hO > .05 && hO < .95;
    return { out, caption, under, onGraphic, tinyChip, pathCross, hb, partial, hO, hR };
  }, { t, SAFE, CAP_Y });
  const bad = rep.out.length + rep.caption.length + rep.under.length + rep.onGraphic.length + rep.tinyChip.length + rep.pathCross.length + (rep.hb ? 1 : 0) + (rep.partial ? 1 : 0);
  fails += bad;
  console.log(`[t=${t.toFixed(2)}] ${bad ? 'FAIL' : 'OK'}`);
  rep.out.forEach(o => console.log(`  FAIL 走出安全区  "${o.txt}"`));
  rep.caption.forEach(o => console.log(`  FAIL 侵入字幕区  "${o.txt}"  bottom=${o.b.toFixed(0)}`));
  rep.under.forEach(o => console.log(`  FAIL 压在人物窗  "${o.txt}"  ${Math.round(o.frac * 100)}%`));
  rep.onGraphic.forEach(o => console.log(`  FAIL 压在图形上  "${o.txt}"  ${Math.round(o.frac * 100)}% (${o.ix}×${o.iy}px)`));
  rep.tinyChip.forEach(o => console.log(`  FAIL 色块没包住字  "${o.txt}"  超出 ${o.over}px`));
  rep.pathCross.forEach(o => console.log(`  FAIL 连线穿过卡片  ${o.worst}/40  d="${o.txt}"  panel=${o.pr}`));
  if (rep.hb) console.log(`  FAIL 人物窗出框  x=${rep.hR.x.toFixed(0)} y=${rep.hR.y.toFixed(0)}`);
  if (rep.partial) console.log(`  FAIL 人物窗半透明  opacity=${rep.hO}`);
}
console.log(`\n${fails ? 'CONTRACT FAIL' : 'CONTRACT OK'}`);
await browser.close();
process.exit(fails ? 1 : 0);
