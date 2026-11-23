#!/usr/bin/env node
/* final_qa.mjs · 逐段视频兜底检查（渲染成 mp4 后必跑，2026-11-24 从 439s 全片实战沉淀）
 * 原理：同一时刻分别取「渲染 mp4 帧」和「页面 PNG still」，比较平均亮度（64×36 灰度）。
 * 人物窗丢失（黑窗）、图层缺失都会造成 mp4 明显偏暗/偏亮 → FAIL。
 * 实测：黑窗旧版 diff≈22% FAIL，正常版 diff≈1% OK。
 *
 * 用法（在项目根目录运行）：
 *   node <skill>/scripts/final_qa.mjs s11 out/sections/s11_cut.mp4 5,10,19,22.5
 * 未给时间则自动取 20%/45%/70%/92% 四个采样点。
 * 环境变量：HQ（huige=... 查询串，必填，**媒体路径用原始中文，禁止 URL 编码**——编码会让人物帧全部
 *   加载失败，stills 人物窗黑窗、出现 diff≈26% 假阳性）、SKILL（技能根）、CHROME（Chrome 路径）。
 *
 * 必须用它兜底的原因：stills 模式和探针都正常 ≠ 视频模式正常
 * （--font-render-hinting=none 曾导致视频模式人物 img 不绘制成黑窗，stills 全部正常）。
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';

const [sec, mp4, timesArg] = process.argv.slice(2);
if (!sec || !mp4) { console.error('usage: final_qa.mjs SECTION out.mp4 [times]'); process.exit(2); }
const SKILL = process.env.SKILL || 'C:/Users/LH/.claude/skills/huige-video-style';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const HQ = process.env.HQ || '';
if (!HQ) { console.error('missing HQ env (huige=... query string)'); process.exit(2); }
const F = (a) => spawnSync(a[0], a.slice(1), { encoding: 'buffer' });

const dur = parseFloat(F(['ffprobe', '-v', 'error', '-i', resolve(mp4), '-show_entries', 'format=duration', '-of', 'csv=p=0']).stdout.toString());
if (!(dur > 0)) { console.error('cannot read duration'); process.exit(2); }
const times = timesArg ? timesArg.split(',').map(Number) : [0.2, 0.45, 0.7, 0.92].map(p => +(dur * p).toFixed(2));

const tmp = resolve('check', `.qa_${sec}`);
rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });

/* 1) 页面 PNG stills（已知正确的渲染路径） */
const page = resolve(sec, 'index.html');
const r = spawnSync(process.execPath, [join(SKILL, 'scripts', 'render.mjs'), page, '--stills', tmp,
  '--times', times.join(','), '--query', HQ, '--browser', CHROME], { cwd: SKILL, stdio: 'pipe' });
if (r.status !== 0) { console.error('stills render failed'); process.exit(2); }

/* 2) 平均亮度（64×36 灰度） */
const lum = (file) => {
  const raw = F(['ffmpeg', '-v', 'error', '-i', file, '-vf', 'format=gray,scale=64:36', '-f', 'rawvideo', '-']).stdout;
  let s = 0; for (const b of raw) s += b; return s / raw.length;
};

let fail = 0;
for (const t of times) {
  const tag = t.toFixed(2).padStart(7, '0');
  const still = join(tmp, `t_${tag}.png`);
  const frame = join(tmp, `f_${tag}.png`);
  F(['ffmpeg', '-v', 'error', '-y', '-ss', String(t), '-i', resolve(mp4), '-frames:v', '1', frame]);
  const a = lum(still), b = lum(frame);
  const diff = Math.abs(a - b) / Math.max(a, 1);
  const ok = diff < 0.12;
  if (!ok) fail++;
  console.log(`t=${t}s  still=${a.toFixed(1)}  mp4=${b.toFixed(1)}  diff=${(diff * 100).toFixed(1)}%  ${ok ? 'OK' : 'FAIL ← 人物/图层疑似丢失'}`);
}
console.log(fail === 0 ? 'VIDEO QA OK' : `VIDEO QA FAIL (${fail}/${times.length})`);
process.exit(fail === 0 ? 0 : 1);
