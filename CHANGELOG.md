# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2026-02-13

## [0.3.3] - 2026-02-13

### Added

- JS 驱动的拖拽支持：为水平/垂直布局添加了拖拽监听器与 `window-drag` IPC，用于更平滑的鼠标拖动移动

### Changed

- 改进窗口尺寸与位置计算：展开/收起尺寸会根据 `position` 与按键数量自适应，展开/收起时尽量保持锚点不变
- 将拖拽从 CSS `-webkit-app-region: drag` 切换为 JS 控制的拖拽，更新了相关游标样式和控制按钮布局
- 为水平和垂直布局添加细窄滚动条样式以提升视觉一致性
- 在主进程中增加 `setWindowBoundsWithEdgeCorrection()` 方法以保证窗口不会超出工作区

### Fixed

- 修正吸附到屏幕边缘时的定位计算，避免在多显示器或非零工作区坐标下出现位置偏移或闪烁

### Technical

- 新增 `window-drag` IPC 事件与 `attachDragListeners()` 的实现，主进程增加边界校正与拖动处理逻辑
- 移除部分 CSS 上的 `-webkit-app-region: drag`，改由渲染进程发送拖拽增量到主进程处理


### Added

- Split keyboard.html into separate horizontal and vertical layout files for better maintainability
- Added keyboard-common.js for shared utilities between layouts
- New single-row layout design for horizontal docked mode

### Changed

- Improved horizontal layout UI with cleaner design:
  - Removed window shadow for seamless docked appearance
  - Simplified control buttons (32x32px)
  - Added subtle title text for brand visibility
- Enhanced layout switching mechanism with smooth transitions
- Optimized vertical layout collapsed state dimensions

### Fixed

- Fixed layout transition flickering when switching between horizontal and vertical modes
- Fixed vertical layout collapsed width (changed from 12px to 80px)

### Technical

- Refactored layout system with getKeyboardFile() method
- Improved IPC communication for layout changes
- Better code organization with separate layout files

## [0.3.1] - 2026-02-13

### Added

- Visual display position picker in settings: click screen edges to select position
- Open source community files (LICENSE, CODE_OF_CONDUCT, CONTRIBUTING, SECURITY)

### Changed

- Vertical layout buttons now auto-adjust height with 3-line text limit
- Removed layout dropdown from settings (layout now determined by position)
- Updated README with latest features

### Fixed

- Text overflow in vertical layout buttons now shows ellipsis after 3 lines

## [0.3.0] - 2026-02-13

### Added

- Interactive uninstall tools for macOS and Linux:
  - `npm run uninstall:mac`
  - `npm run uninstall:linux`
- NSIS custom uninstall flow for Windows with optional user-data cleanup.
- New uninstall helper script for NSIS packaging: `scripts/nsis-uninstall.nsh`.

### Changed

- Updated default keyboard presets to Chinese quick-prompt phrases.
- Updated `README` with cross-platform uninstall instructions.
- Bumped app version from `0.2.1` to `0.3.0`.

## [0.2.1] - 2026-02-12

### Fixed

- Title bar button display in vertical layout mode.
- Settings window positioning (decoupled from main window to prevent jumping).

### Changed

- Reduced title bar button size to 20x20px in vertical mode for better space efficiency.
- Enforced strict binding between layout and snapping position (Top/Bottom ↔ Horizontal, Left/Right ↔ Vertical).

## [0.2.0] - 2026-02-12

### Added

- **Auto-hide feature**: Keyboard automatically collapses to a thin bar when snapped to screen edges
- **Mouse hover expand/collapse**: Hover over the collapsed bar to expand the full keyboard, move away to collapse after 1 second
- **Single-row horizontal layout**: All keys arranged in a single horizontal row (90% of screen width)
- **Single-column vertical layout**: All keys arranged in a single vertical column (70% of screen height)
- **Automatic layout switching**: Dragging to top/bottom edges switches to horizontal layout; left/right edges switch to vertical layout
- **Responsive sizing**: Keyboard dimensions adapt to screen size using percentages
- **Edge snapping with drag-to-snap**: Drag keyboard near any edge to automatically snap to it
- **Smooth animations**: Expand and collapse transitions with opacity and size changes

### Changed

- Improved window positioning logic for better multi-monitor support
- Updated configuration UI with layout, position, and auto-hide settings
- Refactored IPC communication between main and renderer processes

### Fixed

- Window focus issues preventing input to target applications
- Keyboard layout rendering for both orientations
- Edge detection and snapping accuracy

## [0.1.0] - 2026-02-12

### Added

- Initial release of VibeCoding666
- Cross-platform on-screen keyboard (macOS, Windows, Linux)
- Customizable keys with configurable labels and input values
- System-level input simulation using robotjs
- Global shortcut (Ctrl/Cmd+Alt+K) to toggle visibility
- Configuration window for key customization
- Config import/export functionality
- Always-on-top overlay window with transparency support
- Basic horizontal keyboard layout with multiple rows

[0.3.2]: https://github.com/yourusername/vibecoding666/compare/v0.3.1...v0.3.2
[0.3.3]: https://github.com/yourusername/vibecoding666/compare/v0.3.2...v0.3.3
[0.3.1]: https://github.com/yourusername/vibecoding666/compare/v0.3.0...v0.3.1
[0.2.1]: https://github.com/yourusername/vibecoding666/compare/v0.2.0...v0.2.1
[0.3.0]: https://github.com/yourusername/vibecoding666/compare/v0.2.1...v0.3.0
[0.2.0]: https://github.com/yourusername/vibecoding666/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/yourusername/vibecoding666/releases/tag/v0.1.0
