# v0.3.4 Release Notes

## Overview
This release improves readability in light appearance by automatically switching title and control button text to darker colors that match key text contrast.

## What's New

### ✨ UX Improvements
- **Auto light-mode text adaptation**: product title text and top-right control buttons now switch to dark text color under system light appearance
- **Consistent visual contrast**: control buttons now use light-mode background/hover states for clearer visibility on bright surfaces

### 🐛 Bug Fixes
- Fixed poor visibility for minimize/config/close controls in light mode
- Fixed product title text being too faint in light mode on both horizontal and vertical layouts

### 🔨 Modified Files
- `src/renderer/keyboard.css`
- `src/renderer/keyboard-horizontal.css`
- `src/renderer/keyboard-vertical.css`

---

# v0.3.3 Release Notes

## Overview
This release improves window dragging and positioning, fixes edge snapping issues, and replaces CSS-based dragging with JS-driven drag handlers for more reliable behavior across displays.

## What's New

### ✨ New Features
- **JS-driven dragging**: renderer now attaches drag listeners and sends `window-drag` IPC delta events to the main process for smoother, script-controlled window movement

### 🔧 Technical Improvements
- **Window bounds correction**: added `setWindowBoundsWithEdgeCorrection()` in `src/main.js` to ensure the window stays within the current display work area
- **Adaptive sizing**: expanded/collapsed dimensions now consider `position` and key count to compute sensible heights
- **CSS changes**: removed some `-webkit-app-region: drag` rules and added cursor/scrollbar tweaks for horizontal and vertical layouts

### 🐛 Bug Fixes
- Fixed window positioning when snapping to edges to avoid off-screen placement and flicker in multi-monitor setups

### 🔨 Modified Files
- `src/main.js` - window bounds, expand/collapse behavior, edge-corrected positioning
- `src/renderer/keyboard-common.js` - drag listener and IPC sending
- `src/renderer/keyboard-horizontal.css`, `src/renderer/keyboard-vertical.css` - drag cursor and scrollbar tweaks

---

# v0.3.2 Release Notes

## Overview
This release focuses on UI improvements for horizontal layout and refactoring the layout system for better maintainability.

## What's New

### ✨ New Features
- **Improved Horizontal Layout**: Optimized UI for horizontal docked mode with a cleaner single-row design
  - Removed window shadow for seamless docked appearance
  - Simplified control buttons (32x32px) positioned at the right end
  - Added subtle title text for brand visibility

### 🔧 Technical Improvements
- **Layout System Refactoring**: Split monolithic keyboard.html into separate files:
  - `keyboard-horizontal.html` - Dedicated horizontal layout
  - `keyboard-vertical.html` - Dedicated vertical layout  
  - `keyboard-common.js` - Shared JavaScript utilities
  - Better code organization and maintainability

- **Enhanced Layout Switching**: Improved the layout change mechanism:
  - Window now hides before loading new layout HTML to prevent visual glitches
  - Smooth transition between horizontal and vertical modes
  - Preserved window position and state during layout changes

### 🐛 Bug Fixes
- Fixed layout transition flickering when switching from horizontal to vertical mode in settings
- Fixed vertical layout collapsed state dimensions (width: 80px instead of 12px)

### 📁 New Files
- `src/renderer/keyboard-horizontal.html`
- `src/renderer/keyboard-horizontal.css`
- `src/renderer/keyboard-vertical.html`
- `src/renderer/keyboard-vertical.css`
- `src/renderer/keyboard-common.js`

### 🔨 Modified Files
- `src/main.js` - Added getKeyboardFile() method, improved layout switching logic
- `src/renderer/keyboard.css` - Added horizontal layout specific styles
- `src/renderer/keyboard.html` - Added single-row layout structure
- `src/renderer/keyboard.js` - Added legacy button event handlers
- `README.md` - Documentation updates

## Upgrade Notes
No breaking changes. Users can upgrade seamlessly.

---

**Full Changelog**: https://github.com/linletian/vibecoding666/compare/v0.3.1...v0.3.2

---

# v0.3.1 Release Notes

**Release Date:** February 13, 2026

## What's New

### Visual Position Picker
The settings window now features an intuitive visual display position picker. Instead of selecting from a dropdown, you can now click directly on screen edges (top, bottom, left, right) to position your keyboard. This makes it much easier to visualize where your keyboard will appear.

### Open Source Community Files
We've added comprehensive open source community documentation:
- **LICENSE**: MIT License
- **CODE_OF_CONDUCT.md**: Community guidelines
- **CONTRIBUTING.md**: How to contribute to the project
- **SECURITY.md**: Security policies and reporting
- **Issue templates**: Bug reports and feature requests
- **Pull request template**: Standardized PR format

## Improvements

### UI Enhancements
- **Vertical layout buttons** now auto-adjust their height to accommodate longer text
- Text is limited to a maximum of 3 lines with ellipsis (...) for overflow
- Removed the Layout dropdown from settings - the layout is now automatically determined by the position you select:
  - Top/Bottom positions → Horizontal layout
  - Left/Right positions → Vertical layout

## Bug Fixes
- Fixed text overflow in vertical layout buttons - long text now properly truncates with ellipsis after 3 lines

## Contributors
- Ultraworked with [Sisyphus](https://github.com/code-yeongyu/oh-my-opencode)

## Installation

### macOS
Download the `.dmg` file and drag VibeCoding666 to your Applications folder.

### Windows
Download and run the `.exe` installer. Administrator privileges are required for proper installation.

### Linux
Download the `.AppImage` file, make it executable (`chmod +x VibeCoding666.AppImage`), and run it. Or install the `.deb` package for Debian/Ubuntu systems.

## Verification

You can verify the integrity of downloaded files using the provided checksums in the release assets.

---

**Full Changelog**: https://github.com/yourusername/vibecoding666/compare/v0.3.0...v0.3.1

---

# v0.2.0 Release Notes

## 🎉 What's New

### Auto-Hide Feature
The keyboard now intelligently hides when not in use. When you drag the keyboard to any screen edge, it collapses into a thin, semi-transparent bar. Simply hover your mouse over the bar to expand the full keyboard, and it will automatically collapse again when you move away.

**How to use:**
1. Drag the keyboard to any screen edge (top, bottom, left, or right)
2. The keyboard automatically snaps and collapses to a thin bar
3. Hover over the bar to expand the keyboard
4. Move your mouse away and wait 1 second for it to collapse again

### Smart Layout Switching
The keyboard automatically switches between horizontal and vertical layouts based on which edge you snap it to:
- **Top/Bottom edges** → Horizontal layout (single row)
- **Left/Right edges** → Vertical layout (single column)

No manual configuration needed - just drag and the layout adapts!

### Responsive Sizing
Keyboard dimensions now adapt to your screen size:
- **Horizontal mode**: 90% of screen width × 80px height
- **Vertical mode**: 80px width × 70% of screen height

This ensures the keyboard looks great on any display, from laptops to ultrawide monitors.

### Improved Single-Line Layouts

#### Horizontal Layout
All keys are now arranged in a single scrollable row, perfect for placement at the top or bottom of your screen.

#### Vertical Layout
All keys are arranged in a single scrollable column, ideal for side placement without taking up horizontal workspace.

## 🚀 Getting Started

### Installation
```bash
cd VibeCoding666
npm install
npm start
```

### Quick Tips
- **Global shortcut**: `Ctrl/Cmd + Alt + K` to show/hide
- **Drag to snap**: Drag near any edge to snap automatically
- **Configure keys**: Click the ⚙️ button to customize
- **Auto-hide**: Enabled by default, can be disabled in settings

## 🐛 Known Issues

- macOS Dock may interfere with bottom edge detection
- Some applications may require accessibility permissions for input simulation

## 🔧 System Requirements

- **macOS**: 10.14+ (Intel & Apple Silicon)
- **Windows**: Windows 10+
- **Linux**: Ubuntu 18.04+ / Debian 9+ / Fedora 30+

## 📦 Download

Pre-built binaries will be available in the Releases section soon.

## 🙏 Credits

Built with:
- [Electron](https://www.electronjs.org/) - Cross-platform desktop framework
- [robotjs](https://github.com/octalmage/robotjs) - Native input simulation

---

**Full Changelog**: [v0.1.0...v0.2.0](https://github.com/yourusername/vibecoding666/compare/v0.1.0...v0.2.0)