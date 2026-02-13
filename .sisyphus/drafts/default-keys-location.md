# Draft: 默认按键设置位置（VibeCoding666）

## Requirements (confirmed)
- 用户问题：默认按键设置在哪里配置？

## Findings (codebase)

### Electron 桌面版（主要入口）
- **默认按键（首次运行/无配置文件时）**：`src/main.js` → `getDefaultConfig()` → `keys` 数组（约 22–41 行）
- **用户配置文件路径**：`src/main.js` 构造函数里：
  - `path.join(app.getPath('userData'), 'vibecoding666-config.json')`
- **加载优先级/覆盖规则**：`src/main.js` → `loadConfig()`：
  - `return { ...this.getDefaultConfig(), ...JSON.parse(data) }`
  - 说明：用户配置存在时会以“浅合并”覆盖默认；若用户 JSON 里有 `keys`，会整体替换默认 `keys` 数组。

### 设置窗口“重置为默认”按钮的默认按键
- `src/renderer/config.js` → `getDefaultKeys()`：包含更完整的键盘布局（数字/QWERTY/Space/Enter/Backspace 等）
- 点击重置会 `ipcRenderer.send('update-config', { keys: ... })`，从而覆盖主进程当前 keys 并写入配置文件。

### 键盘 UI 展示顺序（决定哪些 key 会显示）
- `src/renderer/keyboard.js`：`renderHorizontalSingleRow()` / `renderVerticalSingleColumn()` 内有硬编码 `keyOrder`（按 id 过滤/排序）
- 说明：即使 `config.keys` 里有更多 key，如果 id 不在 `keyOrder`，也不会被渲染出来。

### 轻量级服务器版（simple/）
- `simple/server.js` 内也有自己的默认 keys（与 Electron 版独立）

## Open Questions
- 你问的“默认按键”指：
  1) 应用首次启动默认显示的按键（main.js），还是
  2) 设置页“重置默认”的那套按键（config.js），还是
  3) simple/server.js 的默认按键？

## Scope Boundaries
- INCLUDE：定位默认 keys 定义位置、配置文件路径与覆盖规则、UI 渲染顺序的关键点
- EXCLUDE：改代码/实现统一默认值（需要你确认你想改哪一种默认）
