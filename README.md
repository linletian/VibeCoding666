# VibeCoding666

**Current release: v0.3.3**

这是一个严肃的抽象搞笑项目！但是笑归笑，闹归闹，别拿 Vibe Coding 当玩笑！

一个专门为 Vibe Coding 设计的屏幕软键盘快捷键，灵感来源一位小红书博主求 Vibe Coding 快捷键盘。本项目可以鼠标一键输入“帮我修 bug”、“继续修 bug”、“中文回答我！”、“直接写代码”等常用 Vibe Coding 对话内容。所有按键内容也都可以自定义。

项目取名 VibeCoding666 是祝福大家在 Vibe Coding 过程中全程 666。本项目也是全程使用 Vibe Coding 方式开发的，包括架构选型。嗯…… 除了 README 里这三段简介。

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
