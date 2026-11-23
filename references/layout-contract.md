# 布局契约（硬约束 · 2026-11-23 起每段必过）

> 来源：2026-11-23 技能介绍片做了近 20 版仍反复「修 A 破 B」。根因是边渲染边试，没有先定死坐标。
> 现在改成：**先定坐标 → 再写代码 → 两条门禁 → 联系表 → 才渲染**。

## 一、画面分区（1920×1080，屏幕坐标）

| 区域 | 范围 | 放什么 | 硬约束 |
|---|---|---|---|
| 顶部页眉 | y 40–120 | kicker / 标题 / 页码 | 与内容区之间留一条 10px 分隔线 |
| 内容区 | y 130–858 | 主画面 | 所有文字完整落在安全区内 |
| 字幕区 | y 862–1080 | 只有烧录字幕 | **任何文字不得进入**（贴图/卡片可以垫在字幕后面） |
| 安全区 | x 90–1830，y 40–1040 | 全部文字 | 出界即错 |

- 相机推镜最多 2%：`engine/tmotion.js` 的 camera push 已锁为 `1 + .02k`。超过 2% 时贴边元素会漂出安全区（实测 4.5% 时左侧 110px 的页眉漂到 81px）。
- **文字换场一律逐场渲染 + 硬拼**：`node scripts/render_section.mjs <section> "a:b,c:d,..." <out.mp4>`（内部用 `?scene=N` + `--from/--to` 逐场渲染，再 `ffmpeg concat -c copy`）。成片仍是单文件；中间片段只在工作区，不作为交付物。这是残影的物理级根治，引擎里的 cut 重叠修复只是第二道保险。
- 字幕区是真字幕，不是留白：预览里的灰带是字幕底板，烧字后会被填满。

## 二、人物窗（#huige）

1. 整窗必须落在画框内（x 0–1920，y 0–1080）：**要么完整，要么隐藏，不能半个头像**。
   `M.c(x,y,d)` 的 x/y 是**左上角**，不是中心点。
2. 采样点只允许全显或全隐（0.05–0.95 之间的半透明算错）。
3. 人物窗上不得压文字（交集 > 10% 文本面积即错）。
4. 场景边界处用 `d: 0` 硬切；不要跨 cut 滑窗。

## 三、不做自创 UI

不加模板本身没有的进度条、时间码、底部常驻条、刻度尺；装饰只用模板已有组件。
T09/HUD 类模板自带的时间码+刻度尺（`T.hudFrame`）默认不加，除非用户明确要。

## 三½、页眉与页脚（2026-11-23 辉哥打回两次后定）

- **禁止「mono kicker + 大标题 + 灰色副标题」三连堆**：kicker 若只是把标题再写一遍（如 `TODAY · 今天讲两件事` 压在 `今天讲两件事` 上），直接删。页眉只留一个大标题；确需副题时一行、更小、更淡。
- **禁止漂浮页脚小字**（如左下角 `23 TEMPLATE LOOKS · 一套视觉系统`）：信息放进内容里（卡片标签、图例），不要悬在空白处当装饰。
- 小号英文标签只在承载真信息时用（模板编号、时间码、页码），并且不做成每场必备的模板件。

## 四、动效与节奏

- 每 3–5 秒一个视觉事件；单场 ≤ 8 秒；一场只做一次入场。
- 数字用滚动计数（`M.count`），不要静态贴上去。
- 持续动效必须有信息意义：计数、扫描、波形、跑马灯；纯装饰抖动不要。
- 快切（<1.2s）首帧必须已经是完整构图，不能从空场开始。

## 四½、修复优先级（2026-11-23 辉哥定）

**源头 > 规则 > 脚本兜底**，顺序不能倒：

1. **模板/组件问题 → 改组件**：`T.head`（页眉只许一主一副）、`M.chipbox`（显式尺寸胶囊）、`M.arrow`（显式端点箭头）、`tmotion.js` 的 cut 边界不重叠。
2. **AI 执行规则 → 改 SKILL.md / references**：禁 kicker+title+sub 三连、禁漂浮页脚、色块必须显式宽高。
3. **脚本门禁 → 只做兜底**：`check_contract.mjs` 的「压图形 / 色块没包住字 / 连线穿卡」。不指望脚本覆盖一切——源头不修，问题会换个样子再来。

## 四¾、生成后三层自检（2026-11-24 辉哥定，439s 全片实战沉淀）

**每次生成/修改片段后，AI 必须自己跑完三层检查，全部通过才允许交付。禁止让用户当质检员。**

1. **门禁脚本**：`check_layout.mjs --srt <srt> --offset <段绝对起点>` + `check_contract.mjs` + 密度检查；采样点必须覆盖**每一拍的中段**（不是只抽首尾）。
2. **AI 亲眼目检**：`render.mjs --stills` 抽 3–4 帧并实际看图——重叠 / 遮挡 / 文字居中 / 对比度 / 人物窗位置。只看代码不算检查。
3. **脚本兜底（final_qa）**：渲染出 mp4 后跑 `scripts/final_qa.mjs`——对同一时刻的「页面 still」和「mp4 帧」比平均亮度（64×36 灰度），diff>12% 判 FAIL。它专抓「stills 正常但视频异常」的问题，是最后一道闸。

任何一层 FAIL 必须修复后重跑，禁止跳层。

```bash
HQ="huige=file:///…/media/huige&srcw=1280&srch=720&face=.5,.26,.42&hloop=151"
node scripts/final_qa.mjs s11 out/sections/s11_cut.mp4 5,10,19,22.5   # 末尾打印 VIDEO QA OK 才算过
```

## 四⅔、渲染根因记录（源头已修，勿回退）

- **`--font-render-hinting=none` 是模式相关的（2026-11-24 定论）**：**视频模式（--out）严禁携带**——它会让人物 img 不绘制（人物窗全黑），但 stills/探针全部正常，极具迷惑性。`render.mjs` 已按模式自动区分（`--out` 不加、截图/门禁模式保留历史上校准过的组合），勿回退。实证：stills（带 flag）与无 flag 视频 diff≈1%。
- **HQ 媒体路径禁止 URL 编码（2026-11-24 实证）**：`huige=file:///…%E6%8A%80…/media/huige` 这种编码写法会让人物帧全部加载失败 → **stills 里人物窗也是黑的**，final_qa 出现 diff≈26% 的假阳性。必须传原始中文路径（`huige=file:///D:/…/HUIGE技能介绍/media/huige`），Chrome 会自行编码。stills 黑窗时先查路径，再查渲染器。
- **窗口切换单系统规则**：段内人物窗口切换只允许 `C.huigeKeys` 一条链（每 key `d: 0`）；禁止与 `M.setup` 的 keys / `M.story` 同时驱动同一个窗口——双系统打架会黑窗或跳窗。
- **居中禁止 `display:''` 回切**：`style.display=''` 会清掉内联 `display:flex`，胶囊文字会跑到左上角。居中一律用 `textAlign:'center'`（+ `lineHeight:(h-8)+'px'` 或 paddingTop）；用 display 切换时必须显式赋 `'flex'`。

## 五、每段固定四步

```bash
# 1) 抽 8 帧（按口播 cue 时间）
node scripts/render.mjs sN/index.html --stills check/sN --times <t1,t2,...> \
  --query "huige=file:///.../media/huige&srcw=1280&srch=720&face=.5,.26,.42&hloop=151" \
  --browser "C:/Program Files/Google/Chrome/Application/chrome.exe"

# 2) 通用门禁：互压 / 压人物 / 越界 / cut 时机
node scripts/check_layout.mjs sN/index.html --times <...> --srt <srt> --offset <start> --query "..."

# 3) 契约门禁：安全区 / 字幕区 / 人物窗完整与不透明
node scripts/check_contract.mjs sN/index.html --times <...> --query "..." \
  --browser "C:/Program Files/Google/Chrome/Application/chrome.exe"

# 4) 联系表：一次看完
python scripts/contact.py check/sN_sheet.jpg check/sN
```

两条门禁都 `OK` + 联系表无硬问题，才渲染成片。渲染后旧版进 `.trash/`。

**判据校准记录（2026-11-23）**：`check_contract.mjs` 先在 `projects/20261123_HUIGE技能介绍/s4` 上跑出 4 类真错——
页眉越界（右 1841 > 1830）、COMIC 标签侵入字幕区（bottom 875）、页眉被 4.5% 相机推镜推到 x=81/74、以及第 3/4 场标题贴边；
修完（相机锁 2%、wall 入场去掉纵向位移、坐标内收）后同一批采样点全部 `CONTRACT OK`。坏例被拦、好例放行，判据成立。

## 六、常见破法（都踩过）

| 现象 | 根因 | 正确做法 |
|---|---|---|
| 页眉压在照片上 | 内容区和页眉没分区 | 内容从 y≥130 起，页眉 40–120 |
| 浅色卡变「白板」、字看不清 | 整块遮罩盖住花底 | 不用全遮罩；换装文字时用底色一致的面板 |
| 标签胶囊侵入字幕 | 内容排到 y>860 | 所有文字收在 858 以内 |
| 半个头像 | 窗口 x/y 当中心点 | x/y 是左上角；BR 圆窗示例 (1640,800,240) |
| 开场人压数字 | 入场窗没收就上字 | 数字开场先隐人物，第 2 场再出 |
| 贴边元素渐渐出界 | 相机推镜 4.5% | 锁 2%，或把贴边元素放在 x≥120 |
| 半透明残影 | 窗口在 cut 上滑动 | 边界 key `d: 0` |
| 转场瞬间旧画面残影（新场背景上浮着旧场元素） | cut 边界两场同时 display 约 0.2s，旧场里 z-index≥1 的子元素逃出层叠上下文，盖到新场背景上 | `tmotion.js` 已改：cut 边界两场不重叠（旧场 `end = b - 1e-3`，新场 `start = a`）。**根因是层叠，不是透明度** |
| 视频里人物窗全黑，stills 却正常 | 渲染器视频模式（--out）带了 `--font-render-hinting=none`，人物 img 不绘制 | `render.mjs` 已按模式区分（--out 不带）；渲染后必跑 `final_qa.mjs` 兜底（§四⅔、四¾） |
| 胶囊/卡片文字跑到左上角不居中 | `style.display=''` 清掉内联 `display:flex` | 居中用 `textAlign:'center'` + `lineHeight`；display 切换显式赋 `'flex'` |
| 人物窗黑窗/跳窗 | `C.huigeKeys` 与 `M.setup` keys / `M.story` 双系统同时驱动同一窗口 | 段内窗口切换只放 `C.huigeKeys` 一条链 |
