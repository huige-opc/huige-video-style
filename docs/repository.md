# 独立仓库说明 | Repository

## 目标仓库

`https://github.com/huige-opc/huige-video-style`

状态：**已发布**。仓库地址即上方 URL；本地版本与远端 `master` 同步。

## 仓库定位

- 这是 `huige-video-style` 技能的独立仓库，不依赖 `skills` 单体仓库。
- 根目录就是技能根：`SKILL.md`、`engine/`、`scripts/`、`template/`、`templates/`、`HUIGE-Core/` 一起发布。
- 23 套模板随仓库发布，不再拆成单独 ZIP。
- 模板卡与 Huige 动作帧随仓库发布：`references/samples/`、`assets/huige-poses/`。
- 许可：根目录 [`LICENSE`](../LICENSE)，自有 MIT，版权方 `huige-opc`。
- ASR/TTS 不随仓库安装：用户自行配置本地 Whisper / 火山 ASR 与 Fish / 其他 TTS。

## 不提交的内容

`.gitignore` 已排除：

- `node_modules/`、`.venv/`、`__pycache__/`
- `media/`、`template/demo/media/`、`template/sample5/media*`
- `jobs/`、`out/`、`sec/`、`check/`、`.trash/`
- 渲染产物与日志（`*.mp4`、`*.mov`、`*.wav`、`*.log`）

## 发布前检查

1. `LICENSE` 为自有 MIT，版权方 `huige-opc`。
2. `README.md` 的仓库地址与 `package.json` 的 `repository` 一致。
3. 运行 checksum 校验：`sha256sum -c HUIGE-Core/checksums.sha256` 与各模板 checksum。
4. 确认 `git status` 没有 `node_modules`、`.venv`、媒体帧、`jobs/` 或旧产物。
5. 远端已配置并完成首次推送：

```sh
git remote -v
git push -u origin master
```

## 发布后可选

- 在 GitHub 仓库描述中写明：Claude skill + deterministic video engine + 23 templates。
- 需要给外部用户下载时，再补 Releases 或安装包；当前 README 已按“本地预装”写，不依赖远端资产。
