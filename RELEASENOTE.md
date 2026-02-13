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