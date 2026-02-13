# VibeCoding666 - 项目文档

## 项目概述

VibeCoding666 是一个跨平台的屏幕软键盘应用程序，使用 Electron 构建。它允许用户自定义按键内容，并通过点击将内容自动输入到当前激活的窗口中。该应用支持多种布局方式、自动隐藏功能以及全局快捷键。

## 项目结构

```
VibeCoding666/
├── src/
│   ├── main.js                 # Electron 主进程
│   └── renderer/
│       ├── keyboard.html       # 主键盘界面
│       ├── keyboard.css        # 键盘样式
│       ├── keyboard.js         # 键盘渲染器逻辑
│       ├── config.html         # 设置窗口界面
│       ├── config.css          # 设置样式
│       └── config.js           # 设置渲染器逻辑
├── simple/
│   └── server.js              # 轻量级 HTTP 服务器版本
├── package.json               # 项目配置
├── README.md                  # 项目说明
└── CHANGELOG.md               # 更新日志
```

## 技术栈

- **Electron**: 跨平台桌面应用框架
- **robotjs**: 系统级输入模拟库
- **HTML5/CSS3**: 用户界面
- **JavaScript (ES6+)**: 应用逻辑

## 核心功能

### 主要特性

1. **自定义按键**: 每个按键可自定义显示标签和输入内容
2. **智能排布**: 水平排布自动绑定上下边缘吸附，垂直排布自动绑定左右边缘吸附
3. **UI 优化**: 针对垂直模式优化的紧凑型标题栏
4. **独立设置**: 设置窗口不再随主窗口跳动，操作更稳定
5. **跨平台支持**: macOS (Intel/Apple Silicon)、Windows、Linux
6. **系统级输入**: 点击自动输入到当前激活窗口
7. **可配置外观**: 调整透明度、窗口置顶
8. **全局快捷键**: `Ctrl/Cmd + Alt + K` 显示/隐藏
9. **配置导入导出**: 方便备份和分享
10. **自动隐藏功能**: 键盘可以自动折叠成细条，鼠标悬停时展开

### 布局模式

- **水平布局**: 所有按键排列在单行中（屏幕宽度的90%）
- **垂直布局**: 所有按键排列在单列中（屏幕高度的70%）
- **自动布局切换**: 拖拽到顶部/底部边缘切换为水平布局；左/右边缘切换为垂直布局

## 构建与运行

### 开发环境设置

```bash
# 完整桌面应用（推荐）
cd VibeCoding666
npm install
npm start
```

### 轻量级服务器版

```bash
cd VibeCoding666/simple
npm install
node server.js
```

### 构建命令

```bash
npm start                    # 启动 Electron 应用
npm run postinstall         # 重建原生依赖
npm run build               # 构建所有平台
npm run build:mac           # 构建 macOS (.dmg)
npm run build:win           # 构建 Windows (.exe)
npm run build:linux         # 构建 Linux (.AppImage, .deb)
npm run rebuild             # 手动重建 robotjs
npx electron-rebuild -f -w robotjs  # 强制重建
```

## 代码规范

### JavaScript 规范

- 使用 ES6+ 特性（类、箭头函数、const/let）
- 2空格缩进
- 字符串使用单引号
- 多行对象/数组使用尾随逗号
- 不使用分号（项目偏好）

### 命名约定

```javascript
// 类: 帕斯卡命名法
class VibeCoding666 { }

// 方法/变量: 驼峰命名法
loadConfig() { }
this.mainWindow

// 常量: 大写下划线
const PORT = 3456

// 私有方法: 前缀下划线
_setupHandlers() { }
```

### 导入顺序

```javascript
// 1. 内置 Node.js 模块
const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

// 2. 外部 npm 包
const robot = require('robotjs')

// 3. 内部模块
// const utils = require('./utils')
```

### 错误处理

```javascript
// 始终将文件操作包装在 try-catch 中
loadConfig() {
  try {
    if (fs.existsSync(this.configPath)) {
      const data = fs.readFileSync(this.configPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading config:', error)
  }
  return this.getDefaultConfig()
}
```

## 关键实现细节

### 原生模块处理

robotjs 需要本地编译。优雅地处理其缺失情况：

```javascript
let robot
try {
  robot = require('robotjs')
} catch (e) {
  console.error('robotjs not available')
}
```

### 窗口配置

主键盘窗口使用特殊标志实现覆盖行为：
- `focusable: false` - 防止抢夺焦点
- `type: 'panel'` - 面板窗口类型
- `alwaysOnTop: true` - 置顶显示
- `transparent: true` - 允许透明

### IPC 通信

```javascript
// 主进程到渲染进程
win.webContents.send('config-loaded', config)

// 渲染进程到主进程
ipcRenderer.send('key-pressed', keyData)

// 渲染进程监听
ipcRenderer.on('config-loaded', (event, config) => { })
```

## 测试

目前没有正式的测试套件。手动测试步骤：
1. 运行 `npm start`
2. 验证键盘是否出现
3. 在文本编辑器中聚焦时点击按键
4. 测试配置窗口（⚙ 按钮）
5. 测试全局快捷键（Ctrl/Cmd+Alt+K）

## 依赖项

- **electron**: ^22.3.27 （桌面框架）
- **electron-builder**: 构建工具
- **robotjs**: ^0.6.0 （原生输入模拟）

## 常见问题

1. **原生模块构建失败**: 运行 `npx electron-rebuild -f -w robotjs`
2. **Python distutils 错误**: `python3 -m pip install setuptools`
3. **网络问题**: 使用 `--registry=https://registry.npmmirror.com`

## 配置存储

用户配置存储在：
- macOS: `~/Library/Application Support/VibeCoding666/`
- Windows: `%APPDATA%/VibeCoding666/`
- Linux: `~/.config/VibeCoding666/`

格式: JSON，包含 `keys` 数组和显示设置。

## 版本历史

### v0.2.1 (2026-02-12)
- 修复了垂直布局模式下的标题栏按钮显示
- 修复了设置窗口定位（与主窗口解耦以防止跳动）
- 减小了垂直模式下标题栏按钮尺寸至20x20px
- 强制执行布局和吸附位置之间的严格绑定

### v0.2.0 (2026-02-12)
- 添加了自动隐藏功能
- 添加了鼠标悬停展开/折叠功能
- 添加了单行水平布局和单列垂直布局
- 添加了自动布局切换功能
- 添加了响应式尺寸调整
- 添加了边缘吸附功能
- 添加了平滑动画效果

### v0.1.0 (2026-02-12)
- 初始发布版本
- 跨平台屏幕键盘支持
- 可自定义按键
- 系统级输入模拟
- 全局快捷键支持
- 配置导入导出功能