#!/usr/bin/env node
/* Huige layout gate for hand-written sections.
 *
 *   node scripts/check_layout.mjs SECTION/index.html --times 1,4.5,9
 *
 * Flags (FAIL, exit 1):
 *   - text-on-text overlap (two visible text elements covering each other)
 *   - text under the presenter window (#huige)
 *   - text outside the 1920x1080 frame
 * WARN:
 *   - an empty third of the frame (no text or card) in a busy scene
 *
 * It reads the live DOM after renderAt(t), so it works for engine scenes and
 * concept-template sections alike (no screenshots, no OCR). */
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const entry = args[0] && !args[0].startsWith('--') ? args[0] : null;
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
if (!entry) { console.error('usage: check_layout.mjs SECTION/index.html --times a,b,c'); process.exit(2); }
const times = opt('times', '1,4,7').split(',').map(Number);

const req = createRequire(resolve('noop.js'));
let pw; for (const m of ['playwright', 'playwright-core']) { try { pw = req(m); break; } catch { } }
if (!pw) { console.error('Install Playwright first: npm i playwright'); process.exit(2); }

const browser = await pw.chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security', '--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('[page error]', e.message));
const query = opt('query', '');
await page.goto(pathToFileURL(resolve(entry)).href + (query ? '?' + query : ''));
await page.waitForFunction(() => window.READY);
await page.evaluate(() => window.READY);

let fails = 0, warns = 0;
for (const t of times) {
  const rep = await page.evaluate(async t => {
    window.renderAt(t);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const vis = el => el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
    const rect = el => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
    const inter = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    const zOf = l => { const z = parseInt(getComputedStyle(l).zIndex, 10); return Number.isFinite(z) ? z : 0; };
    const fullOpaque = l => {
      const cs = getComputedStyle(l), r = l.getBoundingClientRect();
      const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
      const a = m ? (m[1].split(',').length > 3 ? parseFloat(m[1].split(',')[3]) : 1) : 0;
      return a > .95 && r.width >= 1900 && r.height >= 1060;
    };
    const allLayers = [...document.querySelectorAll('.layer')].filter(l => getComputedStyle(l).display !== 'none');
    allLayers.sort((a, b) => zOf(b) - zOf(a));
    const cover = allLayers.find(fullOpaque);
    const cutoff = cover ? zOf(cover) : -1;
    /* a full-frame opaque scene hides lower layers, so only check that scene and anything above it */
    const layers = allLayers.filter(l => zOf(l) >= cutoff);
    /* texts inside a scene that is currently wiping/sliding are mid-transition, not laid out */
    const trans = el => {
      let p = el.parentElement;
      while (p && !p.classList.contains('layer')) {
        const s = p.style;
        if (s && parseFloat(s.width) >= 1900) {
          if (s.clipPath) return true;
          if (s.opacity && parseFloat(s.opacity) < .95) return true;
          if (s.transform) {
            if (/rotate[XY]/.test(s.transform)) return true;
            const m = [...s.transform.matchAll(/translate(?:X|Y)?\(\s*(-?[\d.]+)px/g)];
            if (m.some(x => Math.abs(parseFloat(x[1])) > 40)) return true;
          }
        }
        p = p.parentElement;
      }
      return false;
    };
    const texts = [], panels = [];
    for (const l of layers) {
      l.querySelectorAll('*').forEach(el => {
        if (el.closest('#huige')) return;
        if (trans(el)) return;
        if (!vis(el)) return;
        const r = rect(el); if (r.w < 3 || r.h < 3) return;
        const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (own) {
          texts.push({ el, text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46), ...r, fs: parseFloat(getComputedStyle(el).fontSize) });
          return;
        }
        const tag = el.tagName;
        const cs = getComputedStyle(el);
        const bgOn = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
        const borderOn = parseFloat(cs.borderTopWidth) >= 2 || parseFloat(cs.borderLeftWidth) >= 2;
        const area = r.w * r.h;
        const translucent = parseFloat(cs.opacity) < .5 || /blur/.test(cs.filter);
        if (!translucent && (tag === 'IMG' || tag === 'SVG' || bgOn || borderOn) && area > 12000 && area < 0.8 * 1920 * 1080) {
          panels.push({ el, ...r, area });
        }
      });
    }
    const ev = document.getElementById('huige');
    const evR = ev && vis(ev) ? rect(ev) : null;
    const overlaps = [], cardOverlaps = [], underHuige = [], outside = [];
    for (let i = 0; i < texts.length; i++) {
      const a = texts[i];
      if (a.x < -2 || a.y < -2 || a.x + a.w > 1922 || a.y + a.h > 1082) outside.push(a);
      if (evR) { const ia = inter(a, evR); if (ia > 0.1 * a.w * a.h) underHuige.push({ ...a, frac: +(ia / (a.w * a.h)).toFixed(2) }); }
      for (let j = i + 1; j < texts.length; j++) {
        const b = texts[j];
        const ia = inter(a, b);
        if (ia > 0.25 * Math.min(a.w * a.h, b.w * b.h)) overlaps.push({ a: a.text, b: b.text, frac: +(ia / Math.min(a.w * a.h, b.w * b.h)).toFixed(2) });
      }
      for (const p of panels) {
        if (p.el.contains(a.el) || a.el.contains(p.el)) continue;
        const ip = inter(a, p);
        if (ip > 0.25 * a.w * a.h) cardOverlaps.push({ text: a.text, frac: +(ip / (a.w * a.h)).toFixed(2) });
      }
    }
    // empty zones: 6 x 3 over the content area (top 60 .. 960)
    const empty = [];
    if (texts.length >= 6) {
      const zw = 320, zh = 300, y0 = 60;
      for (let cx = 0; cx < 6; cx++) for (let cy = 0; cy < 3; cy++) {
        const z = { x: cx * zw, y: y0 + cy * zh, w: zw, h: zh };
        const hasText = texts.some(a => { const cxp = a.x + a.w / 2, cyp = a.y + a.h / 2; return cxp >= z.x && cxp < z.x + z.w && cyp >= z.y && cyp < z.y + z.h; });
        if (hasText) continue;
        const cov = panels.reduce((s, p) => s + inter(p, z), 0) / (z.w * z.h);
        if (cov < 0.18 && z.y < 900) empty.push({ cx, cy });
      }
    }
    return { t, texts: texts.length, overlaps, cardOverlaps, underHuige, outside, empty };
  }, t);
  const f = rep.overlaps.length + rep.cardOverlaps.length + rep.underHuige.length + rep.outside.length;
  fails += f; warns += rep.empty.length;
  console.log(`\n[t=${t.toFixed(2)}] texts=${rep.texts}  ${f ? 'FAIL' : 'OK'}  emptyZones=${rep.empty.length}`);
  rep.overlaps.forEach(o => console.log(`  FAIL overlap  \"${o.a}\" × \"${o.b}\"  ${Math.round(o.frac * 100)}%`));
  rep.cardOverlaps.forEach(o => console.log(`  FAIL text-on-card \"${o.text}\"  ${Math.round(o.frac * 100)}%`));
  rep.underHuige.forEach(o => console.log(`  FAIL over-huige \"${o.text}\"  ${Math.round(o.frac * 100)}%`));
  rep.outside.forEach(o => console.log(`  FAIL outside  \"${o.text}\"  x=${Math.round(o.x)} y=${Math.round(o.y)} ${Math.round(o.w)}x${Math.round(o.h)}`));
  if (rep.empty.length) console.log('  WARN empty zones (col,row): ' + rep.empty.map(z => `${z.cx},${z.cy}`).join(' '));
}

/* motion audit: fast cuts are cut frames, not animated frames */
const motion = await page.evaluate(() => {
  const scenes = (window.EV && window.EV.scenes) || [];
  const fast = scenes.filter(s => s.t1 > s.t0 && s.t1 - s.t0 < 1.2);
  const animatedFast = fast.filter(s => typeof s.update === 'function').map(s => [s.t0, s.t1]);
  const keys = (window.EV && window.EV.huigeKeys) || [];
  const glideAtFast = keys.filter(k => k.d > 0 && fast.some(s => k.t < s.t1 && k.t + k.d > s.t0)).map(k => [k.t, k.d]);
  return { fast: fast.length, animatedFast, glideAtFast };
});
let motionFails = 0;
motion.animatedFast.forEach(([a, b]) => { motionFails++; console.log(`  FAIL fast-shot animation  ${a.toFixed(2)}–${b.toFixed(2)}s (${(b - a).toFixed(2)}s shot)`); });
motion.glideAtFast.forEach(([t, d]) => { motionFails++; console.log(`  FAIL presenter glide inside fast cut  t=${t.toFixed(2)}s d=${d.toFixed(2)}s`); });
if (motionFails) { fails += motionFails; console.log(`\nMOTION FAIL  (${motionFails})`); }
else console.log(`\nMOTION OK  (${motion.fast} fast shots, no in-frame animation, no window glide)`);
await browser.close();
console.log(`\n${fails ? 'LAYOUT FAIL' : 'LAYOUT OK'}  (${fails} fail, ${warns} empty-zone warns)`);
process.exit(fails ? 1 : 0);
