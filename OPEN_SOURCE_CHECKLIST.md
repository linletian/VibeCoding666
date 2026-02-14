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

- [x] 增加最小 CI 检查（`npm ci`、构建、可选 lint）
  - 当前已存在 `.github/workflows/release.yml`：包含 `npm ci` + `npm run build`，但仅在 `tag (v*)` 触发
  - 建议补充 `pull_request/push` 触发的 `ci.yml`，用于日常变更守门
- [ ] 增加基础测试或 smoke test（至少覆盖启动与打包流程）

## P4 发布执行

- [ ] 配置 GitHub 远程仓库并推送 `main`（当前已配置远程 `Github`，但未建立 `main` 上游跟踪，远程同步状态待确认）
- [ ] 推送标签（含 `v0.3.0`）（当前本地已有 `v0.1.0/v0.2.0/v0.3.0/v0.3.2/v0.3.3/v0.3.4`；因当前环境 SSH 权限不足，无法直接校验远程标签）
- [ ] 创建 GitHub Release（附变更说明）
- [ ] 上传构建产物（macOS/Windows/Linux）
- [ ] 上传 checksum（如 `sha256`）

## 当前复盘（2026-02-14）

- P0/P1/P2 均已完成，可满足基础开源仓库规范
- 当前主要阻塞在 P4：需确认 `main`/`tag` 到远程的同步与 Release 资产发布闭环
- 当前工作区仍有未提交改动：`OPEN_SOURCE_CHECKLIST.md`，新增未跟踪文件：`WINDOWS_RELEASE_CHECKLIST.md`

## 许可证决策（MIT vs GPL）

- [x] 决策并确认许可证：
  - [x] 选择 MIT（宽松，便于商用与闭源集成）
  - [ ] 选择 GPL（强 copyleft，衍生分发需同协议开源）
- [x] 将决策同步到 `LICENSE`、`README.md`、`package.json`
