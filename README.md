# VibeCoding666

一个跨平台的屏幕软键盘应用，支持自定义按键内容，点击后自动输入到当前激活窗口。

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

## 许可

MIT
