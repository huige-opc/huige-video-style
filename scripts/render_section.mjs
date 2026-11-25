#!/usr/bin/env node
/* 逐场渲染 + 硬拼接：文字换场不留任何双场帧（残影物理上不可能出现）
 *
 *   HQ="huige=file:///.../media/huige&srcw=1280&srch=720&face=.5,.26,.42&hloop=151" \
 *   node tools/render_section.mjs s3 "0:7.25,7.25:12.15,12.15:17,17:23.18" out/sections/s3_cut.mp4
 *
 * 每个区间用 ?scene=N 只渲染那一场，再 ffmpeg concat -c copy。
 * 环境变量：SKILL（技能根目录）、CHROME（Chrome 路径）。
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';

const [sec, ranges, out] = process.argv.slice(2);
if (!sec || !ranges || !out) { console.error('usage: render_section.mjs SECTION "a:b,c:d,..." OUT.mp4'); process.exit(2); }
const SKILL = process.env.SKILL || 'C:/Users/LH/.claude/skills/huige-video-style';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const HQ = process.env.HQ || '';
const segs = ranges.split(',').map(s => s.split(':').map(Number));
const tmpDir = join('check', '.segments_' + sec.replace(/[\\/]/g, '_'));
mkdirSync(tmpDir, { recursive: true });
const list = [];
segs.forEach(([a, b], i) => {
  const tmp = resolve(tmpDir, `sc${i}.mp4`);
  if (existsSync(tmp)) unlinkSync(tmp);
  const r = spawnSync(process.execPath, [join(SKILL, 'scripts', 'render.mjs'), resolve(sec, 'index.html'),
    '--out', tmp, '--from', String(a), '--to', String(b),
    '--query', HQ + '&scene=' + i, '--browser', CHROME], { cwd: SKILL, stdio: 'inherit' });
  if (r.status !== 0) { console.error('scene', i, 'failed'); process.exit(1); }
  list.push(tmp);
});
const listFile = resolve(tmpDir, 'list.txt');
writeFileSync(listFile, list.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
const r2 = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', out], { stdio: 'inherit' });
if (r2.status !== 0) process.exit(1);
console.log('done', out, segs.length, 'scenes');
