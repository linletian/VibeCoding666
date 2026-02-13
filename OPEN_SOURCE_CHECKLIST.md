# Open Source Release Checklist

用于将项目发布到 GitHub 开源的关键任务清单（按优先级）。

## P0 必做（阻塞开源）

- [x] 新增 `LICENSE` 文件（与当前声明一致：MIT 或改为 GPL）
- [x] 校正 GitHub Actions 结构：将当前 `.github` 文件迁移为 `.github/workflows/release.yml`
- [x] 在 `README.md` 中确认并对齐实际许可证说明（与 `LICENSE` 一致）

## P1 高优先级（强烈建议发布前完成）

- [x] 新增 `CONTRIBUTING.md`
- [x] 新增 `CODE_OF_CONDUCT.md`
- [x] 新增 `SECURITY.md`
- [x] 增加 GitHub Issue 模板：`.github/ISSUE_TEMPLATE/*`
- [x] 增加 PR 模板：`.github/pull_request_template.md`

## P2 元信息完善

- [x] 在 `package.json` 增加 `license`
- [x] 在 `package.json` 增加 `repository`
- [x] 在 `package.json` 增加 `homepage`
- [x] 在 `package.json` 增加 `bugs`
- [x] 在 `package.json` 增加 `author`
- [x] 在 `package.json` 增加 `engines`

## P3 质量与自动化

- [ ] 增加最小 CI 检查（`npm ci`、构建、可选 lint）
- [ ] 增加基础测试或 smoke test（至少覆盖启动与打包流程）

## P4 发布执行

- [ ] 配置 GitHub 远程仓库并推送 `main`
- [ ] 推送标签（含 `v0.3.0`）
- [ ] 创建 GitHub Release（附变更说明）
- [ ] 上传构建产物（macOS/Windows/Linux）
- [ ] 上传 checksum（如 `sha256`）

## 许可证决策（MIT vs GPL）

- [x] 决策并确认许可证：
  - [x] 选择 MIT（宽松，便于商用与闭源集成）
  - [ ] 选择 GPL（强 copyleft，衍生分发需同协议开源）
- [x] 将决策同步到 `LICENSE`、`README.md`、`package.json`
