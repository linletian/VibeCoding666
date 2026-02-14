# VibeCoding666

## 人类专用章节

这是一个严肃但又抽象的项目！笑归笑，闹归闹，别拿 Vibe Coding 当玩笑！

一个专门为 Vibe Coding 设计的屏幕软键盘快捷键，灵感来源一位小红书博主求 Vibe Coding 快捷键盘。本项目可以鼠标一键输入“帮我修 bug”、“继续修 bug”、“中文回答我！”、“直接写代码”等常用 Vibe Coding 对话内容。所有按键内容也都可以自定义。

项目取名 VibeCoding666 是祝福大家在 Vibe Coding 过程中全程 666。本项目也是全程使用 Vibe Coding 方式开发的，包括架构选型。除了 README 里这章节。

目前只在 macOS 13.7 上做了测试。其他进展后续更新。

## 最新版本

- 当前版本：`v0.3.4`（2026-02-14）
- 本次更新：修复系统浅色外观下控制按钮与产品标题文字对比度不足的问题，自动切换为与按键文字一致的深色文字，提升可见性

## 快速开始

### 方案一：完整桌面应用（推荐）

```bash
cd VibeCoding666
npm install
npm start
```

### 方案二：轻量级服务器版

```bash
cd VibeCoding666/simple
npm install
node server.js
```

## 功能特性

- **自定义按键**：每个按键可自定义显示标签和输入内容
- **智能排布**：水平排布自动绑定上下边缘吸附，垂直排布自动绑定左右边缘吸附
- **UI 优化**：针对垂直模式优化的紧凑型标题栏
- **独立设置**：设置窗口不再随主窗口跳动，操作更稳定
- **跨平台支持**：macOS (Intel/Apple Silicon)、Windows、Linux
- **系统级输入**：点击自动输入到当前激活窗口
- **可配置外观**：调整透明度、窗口置顶
- **全局快捷键**：`Ctrl/Cmd + Alt + K` 显示/隐藏
- **配置导入导出**：方便备份和分享

## 系统要求

### macOS
```bash
xcode-select --install
```

### Windows
以管理员身份运行 PowerShell：
```powershell
npm install --global windows-build-tools
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install libxtst-dev libpng++-dev
```

### Linux (Fedora/RHEL)
```bash
sudo dnf install libXtst-devel libpng-devel
```

## 安装问题

如果安装失败，通常是原生模块编译问题：

```bash
# 清理缓存
npm cache clean --force
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

## 系统权限与安全提示

> ⚠️ 本项目依赖 `robotjs` 进行系统级输入模拟。若点击按键后没有输入，通常不是功能异常，而是被系统权限或安全策略拦截。

### macOS（重点）

首次运行后，请授予“辅助功能”权限：

1. 打开 **系统设置** → **隐私与安全性** → **辅助功能**
2. 将运行本项目的程序加入并开启权限：
	- 开发运行：`Terminal` / `iTerm`（你在哪个终端执行 `npm start`，就给哪个终端授权）
	- 打包运行：`VibeCoding666.app`
3. 关闭并重新启动应用

若仍无法输入，可继续检查：

- **隐私与安全性** → **输入监控**：将对应终端或 `VibeCoding666.app` 加入允许列表后重启应用
- **隐私与安全性** → **自动化**：若出现相关弹窗，允许控制目标应用

### Windows

Windows 可能因权限级别或安全软件拦截导致输入失败：

1. 右键以“**管理员身份运行**”启动应用（或启动应用的终端）
2. 若目标程序也是管理员权限，请确保本应用同样以管理员权限运行
3. 在 Windows Defender/第三方杀软中，将应用目录加入信任或白名单

### Linux

Linux 桌面环境差异较大，常见限制如下：

1. **Wayland** 会话通常限制模拟输入，建议切换到 **X11/Xorg** 会话后再使用
2. 确认已安装依赖（见上方 Linux 系统要求）
3. 若通过远程桌面或沙箱环境运行，可能被会话策略拦截，请在本地桌面会话中测试

## 使用说明

1. **显示/隐藏**：快捷键 `Ctrl/Cmd + Alt + K`
2. **移动位置**：按住标题栏拖动
3. **自定义按键**：点击 ⚙ 设置按钮
4. **配置管理**：支持导入/导出 JSON 配置文件

## 技术栈

- **Electron**: 跨平台桌面框架
- **robotjs**: 系统级输入模拟
- **HTML5/CSS3**: 用户界面

## 配置文件位置

- macOS: `~/Library/Application Support/VibeCoding666/`
- Windows: `%APPDATA%/VibeCoding666/`
- Linux: `~/.config/VibeCoding666/`

## 卸载说明

### Windows

使用安装包自带的卸载程序时，会弹出确认框：
- 选择 `No`：仅卸载程序，保留用户数据
- 选择 `Yes`：卸载程序并删除用户数据（配置和自定义按键）

### macOS

可运行卸载工具：
```bash
npm run uninstall:mac
```

脚本会先卸载应用，再询问是否清除用户数据（配置和自定义按键）。

### Linux

可运行卸载工具：
```bash
npm run uninstall:linux
```

脚本会先尝试卸载 `vibecoding666` 包（如已安装），再询问是否清除用户数据（配置和自定义按键）。

## 许可

MIT（详见 `LICENSE`）
