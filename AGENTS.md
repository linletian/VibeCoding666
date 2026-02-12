# AGENTS.md

Guidance for AI agents working on the VibeCoding666 codebase.

## Project Overview

Cross-platform on-screen keyboard application built with Electron. Supports customizable keys that send input to the currently focused window.

## Build Commands

```bash
npm start                    # Start Electron app
npm run postinstall         # Rebuild native dependencies
npm run build               # Build for all platforms
npm run build:mac           # Build macOS (.dmg)
npm run build:win           # Build Windows (.exe)
npm run build:linux         # Build Linux (.AppImage, .deb)
npm run rebuild             # Manual rebuild of robotjs
npx electron-rebuild -f -w robotjs  # Force rebuild
```

## Architecture

```
src/
├── main.js                  # Electron main process
└── renderer/
    ├── keyboard.html        # Main keyboard UI
    ├── keyboard.css         # Keyboard styles
    ├── keyboard.js          # Keyboard renderer logic
    ├── config.html          # Settings window UI
    ├── config.css           # Settings styles
    └── config.js            # Settings renderer logic

simple/
└── server.js               # Lightweight HTTP server alternative
```

## Code Style

### JavaScript

- Use ES6+ features (classes, arrow functions, const/let)
- 2-space indentation
- Single quotes for strings
- Trailing commas in multi-line objects/arrays
- No semicolons (project preference)

### Naming Conventions

```javascript
// Classes: PascalCase
class VibeCoding666 { }

// Methods/Variables: camelCase
loadConfig() { }
this.mainWindow

// Constants: UPPER_SNAKE_CASE
const PORT = 3456

// Private methods: prefix with _
_setupHandlers() { }
```

### Import Order

```javascript
// 1. Built-in Node.js modules
const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

// 2. External npm packages
const robot = require('robotjs')

// 3. Internal modules
// const utils = require('./utils')
```

### Error Handling

```javascript
// Always wrap file operations in try-catch
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

### Electron Patterns

Main Process (main.js):
- Use ipcMain for handling renderer messages
- Use BrowserWindow for creating windows
- Store window references to prevent GC
- Register global shortcuts in app.whenReady()

Renderer Process (keyboard.js, config.js):
- Use ipcRenderer to communicate with main
- Handle config-loaded event to initialize UI

### CSS Guidelines

- Use CSS variables for colors
- Flexbox for layout
- Mobile-first responsive design
- Avoid !important

### HTML Guidelines

- Semantic HTML5 elements
- Data attributes for JavaScript hooks (data-id)
- IDs for unique elements
- Classes for styling hooks

## Key Implementation Details

### Native Module Handling

robotjs requires native compilation. Handle its absence gracefully:

```javascript
let robot
try {
  robot = require('robotjs')
} catch (e) {
  console.error('robotjs not available')
}
```

### Window Configuration

Main keyboard window uses special flags for overlay behavior:
- `focusable: false` - Prevents stealing focus
- `type: 'panel'` - Panel window type
- `alwaysOnTop: true` - Stay on top
- `transparent: true` - Allow transparency

### IPC Communication

```javascript
// Main to Renderer
win.webContents.send('config-loaded', config)

// Renderer to Main
ipcRenderer.send('key-pressed', keyData)

// Renderer listening
ipcRenderer.on('config-loaded', (event, config) => { })
```

## Testing

No formal test suite exists. Test manually:
1. Run `npm start`
2. Verify keyboard appears
3. Click keys while focused on text editor
4. Test config window (⚙ button)
5. Test global shortcut (Ctrl/Cmd+Alt+K)

## Dependencies

- **electron**: ^22.3.27 (Desktop framework)
- **electron-builder**: Build tool
- **robotjs**: ^0.6.0 (Native input simulation)

## Common Issues

1. **Native module build fails**: Run `npx electron-rebuild -f -w robotjs`
2. **Python distutils error**: `python3 -m pip install setuptools`
3. **Network issues**: Use `--registry=https://registry.npmmirror.com`

## Configuration

User config stored at:
- macOS: `~/Library/Application Support/VibeCoding666/`
- Windows: `%APPDATA%/VibeCoding666/`
- Linux: `~/.config/VibeCoding666/`

Format: JSON with `keys` array and display settings.
