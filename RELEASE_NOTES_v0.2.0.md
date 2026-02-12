# Release Notes - VibeCoding666 v0.2.0

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
