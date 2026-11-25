#!/usr/bin/env python3
"""把一组抽帧拼成联系表（4 列），用于一次看完一段的所有关键帧。

usage: contact.py OUT.jpg FRAME_DIR [COLS]
每张缩放到 640x360，带文件名。
"""
import sys, os
from PIL import Image, ImageDraw

out, d = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
files = sorted(f for f in os.listdir(d) if f.lower().endswith(('.png', '.jpg')))
if not files:
    sys.exit('no frames in ' + d)
W, H, PAD, LAB = 640, 360, 12, 26
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (W + PAD) + PAD, rows * (H + LAB + PAD) + PAD), (24, 24, 26))
dr = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(os.path.join(d, f)).convert('RGB').resize((W, H), Image.LANCZOS)
    x = PAD + (i % cols) * (W + PAD)
    y = PAD + (i // cols) * (H + LAB + PAD)
    sheet.paste(im, (x, y))
    dr.text((x + 4, y + H + 6), f, fill=(200, 200, 200))
sheet.save(out, quality=92)
print('contact ->', out, len(files), 'frames')
