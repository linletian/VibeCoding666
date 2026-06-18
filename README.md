# VibeCoding666

English | [中文](README_CN.md)

## Human-Only Section

This is a serious yet abstract project! Joke around if you want, but don’t treat Vibe Coding as a joke.

This is an on-screen keyboard shortcut tool built specifically for Vibe Coding. It was inspired by a RedNote user asking for a Vibe Coding shortcut keyboard. With one mouse click, you can quickly input common prompts such as “Help me fix this bug,” “Keep fixing the bug,” “Reply to me in Chinese!”, and “Write the code directly.” All key contents are fully customizable. Simply attach it to either side of your screen workspace and you can use it freely.

The name VibeCoding666 is a blessing for everyone to stay “666” (smooth and awesome) throughout Vibe Coding. This project was also developed fully in a Vibe Coding style, including architectural decisions—except for this section in the README.

The framework is designed to be compatible with macOS/Windows/Linux, but only macOS is actively built and tested by the maintainer (currently on macOS 13.7).

![Screenshot](docs/screenshot.png)

## Latest Version

- Current version: `v0.3.4` (2026-02-14)
- This update: fixed low contrast of control buttons and product title text under light system appearance by automatically switching to dark text (matching key label color) for better visibility

## Quick Start

### Option 1: Full Desktop App (Recommended)

```bash
cd VibeCoding666
npm install
npm start
```

### Option 2: Lightweight Server Version

```bash
cd VibeCoding666/simple
npm install
node server.js
```

### Option 3: Build Local `.app` (Self-Use)

See [Self-Use Scaffold](#self-use-scaffold-macos-local-build) for building a local `.app` you can launch directly. No publishing, no notarization.

## Features

- **Custom keys**: each key can define its own display label and input content
- **Smart layout behavior**: horizontal layout auto-binds to top/bottom edge snapping; vertical layout auto-binds to left/right edge snapping
- **UI optimization**: compact title bar optimized for vertical mode
- **Independent settings window**: settings no longer jump with the main window, improving stability
- **Cross-platform framework**: macOS (Intel/Apple Silicon), Windows, Linux — only macOS is actively built and tested
- **System-level input**: click to type into the currently active window
- **Configurable appearance**: adjust opacity and always-on-top behavior
- **Global shortcut**: `Ctrl/Cmd + Alt + K` to show/hide
- **Config import/export**: convenient for backup and sharing

## System Requirements

### macOS
```bash
xcode-select --install
```

### Windows
Run PowerShell as Administrator:
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

## Self-Use Scaffold (macOS Local Build)

This section covers the local-use build path: clone, configure, and produce a `.app` you can launch directly. No publishing, no notarization, no App Store submission — just a `.app` bundle for personal use on this machine.

> **Scope**: This scaffold is maintained for **macOS only**. The codebase and `package.json` build configuration remain cross-platform compatible (Windows/Linux targets are retained for framework completeness), but only macOS is actively built and tested.

### Prerequisites

- Node.js ≥ 18
- Xcode Command Line Tools (`xcode-select --install`)

> The Electron download mirror in `package.json` defaults to `npmmirror.com`. If you need a different mirror, edit `build.electronDownload.mirror` (or remove the field to use the default).

### Build & Launch

```bash
npm install
npm run build:mac
open dist/mac/VibeCoding666.app
```

`npm run build:mac` automatically detects your machine's architecture — on an Intel Mac it produces `dist/mac/VibeCoding666.app` (x86_64); on Apple Silicon it produces `dist/mac-arm64/VibeCoding666.app` (arm64). The output is an unpacked `.app` bundle (not a DMG installer).

> To build the other architecture explicitly (e.g. produce arm64 on an Intel Mac), pass the flag: `npx electron-builder --mac --arm64`. To build both at once: `npx electron-builder --mac --x64 --arm64`.

### Optional: Install to /Applications

```bash
cp -R dist/mac/VibeCoding666.app /Applications/
```

### First-Launch Gatekeeper

The first launch may show a Gatekeeper warning because the `.app` is unsigned. Either:

- Right-click the `.app` in Finder → **Open**, or
- Run once: `xattr -cr dist/mac/VibeCoding666.app`

### Permissions

On first launch, grant **Accessibility** permission to `VibeCoding666.app` itself (not Terminal) under **System Settings → Privacy & Security → Accessibility**. See [System Permissions & Security Notes](#system-permissions--security-notes) for the full troubleshooting flow.

### Config Location

`~/Library/Application Support/VibeCoding666/`

Delete this directory to fully reset the app's state.

## Installation Troubleshooting

If installation fails, it is usually caused by native module build issues:

```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## System Permissions & Security Notes

> ⚠️ This project relies on `robotjs` to simulate system-level input. If clicking keys does not type anything, it is usually not a functional bug, but blocked by system permissions or security policies.

### macOS (Most Important)

After first launch, grant **Accessibility** permission:

1. Open **System Settings** → **Privacy & Security** → **Accessibility**
2. Add and enable the program used to run this project:
   - Dev run: `Terminal` / `iTerm` (whichever terminal runs `npm start`)
   - Packaged run: `VibeCoding666.app`
3. Quit and relaunch the app

If input still does not work, continue checking:

- **Privacy & Security** → **Input Monitoring**: allow the terminal or `VibeCoding666.app`, then relaunch
- **Privacy & Security** → **Automation**: if related prompts appear, allow control of target apps

### Windows

Input may fail due to privilege level mismatch or security software interception:

1. Start the app (or terminal running it) with **Run as administrator**
2. If the target app also runs as administrator, ensure this app runs as administrator too
3. Add the app directory to Windows Defender / third-party antivirus trust or whitelist

### Linux

Linux desktop environments vary a lot. Common limitations:

1. **Wayland** sessions often restrict input simulation; switch to **X11/Xorg** and try again
2. Ensure required dependencies are installed (see Linux requirements above)
3. Remote desktop or sandbox environments may block input through session policies; test in a local desktop session

## Usage

1. **Show/hide**: shortcut `Ctrl/Cmd + Alt + K`
2. **Move position**: drag by holding the title bar
3. **Customize keys**: click the ⚙ settings button
4. **Config management**: supports JSON config import/export

## Tech Stack

- **Electron**: cross-platform desktop framework
- **robotjs**: system-level input simulation
- **HTML5/CSS3**: user interface

## Config File Location

- macOS: `~/Library/Application Support/VibeCoding666/`
- Windows: `%APPDATA%/VibeCoding666/`
- Linux: `~/.config/VibeCoding666/`

## Uninstall

### Windows

When using the uninstaller bundled with the installer, a confirmation dialog appears:
- Select `No`: uninstall app only, keep user data
- Select `Yes`: uninstall app and delete user data (config and custom keys)

### macOS

Run the uninstall script:
```bash
npm run uninstall:mac
```

The script first uninstalls the app, then asks whether to remove user data (config and custom keys).

### Linux

Run the uninstall script:
```bash
npm run uninstall:linux
```

The script first tries to remove the `vibecoding666` package (if installed), then asks whether to remove user data (config and custom keys).

## License

MIT (see `LICENSE`)
