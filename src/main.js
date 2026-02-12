const { app, BrowserWindow, ipcMain, screen, globalShortcut, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let robot;
try {
  robot = require('robotjs');
} catch (e) {
  console.error('robotjs not available. Please run: npm install');
}

class VibeCoding666 {
  constructor() {
    this.mainWindow = null;
    this.configWindow = null;
    this.configPath = path.join(app.getPath('userData'), 'vibecoding666-config.json');
    this.config = this.loadConfig();
    this.windowBounds = null;
    this.isExpanded = true;
  }

  getDefaultConfig() {
    return {
      keys: [
        { id: '1', label: '1', value: '1', type: 'text' },
        { id: '2', label: '2', value: '2', type: 'text' },
        { id: '3', label: '3', value: '3', type: 'text' },
        { id: '4', label: '4', value: '4', type: 'text' },
        { id: '5', label: '5', value: '5', type: 'text' },
        { id: '6', label: '6', value: '6', type: 'text' },
        { id: '7', label: '7', value: '7', type: 'text' },
        { id: '8', label: '8', value: '8', type: 'text' },
        { id: '9', label: '9', value: '9', type: 'text' },
        { id: '0', label: '0', value: '0', type: 'text' },
        { id: 'q', label: 'Q', value: 'q', type: 'text' },
        { id: 'w', label: 'W', value: 'w', type: 'text' },
        { id: 'e', label: 'E', value: 'e', type: 'text' },
        { id: 'r', label: 'R', value: 'r', type: 'text' },
        { id: 't', label: 'T', value: 't', type: 'text' },
        { id: 'y', label: 'Y', value: 'y', type: 'text' },
        { id: 'u', label: 'U', value: 'u', type: 'text' },
        { id: 'i', label: 'I', value: 'i', type: 'text' },
        { id: 'o', label: 'O', value: 'o', type: 'text' },
        { id: 'p', label: 'P', value: 'p', type: 'text' },
        { id: 'a', label: 'A', value: 'a', type: 'text' },
        { id: 's', label: 'S', value: 's', type: 'text' },
        { id: 'd', label: 'D', value: 'd', type: 'text' },
        { id: 'f', label: 'F', value: 'f', type: 'text' },
        { id: 'g', label: 'G', value: 'g', type: 'text' },
        { id: 'h', label: 'H', value: 'h', type: 'text' },
        { id: 'j', label: 'J', value: 'j', type: 'text' },
        { id: 'k', label: 'K', value: 'k', type: 'text' },
        { id: 'l', label: 'L', value: 'l', type: 'text' },
        { id: 'z', label: 'Z', value: 'z', type: 'text' },
        { id: 'x', label: 'X', value: 'x', type: 'text' },
        { id: 'c', label: 'C', value: 'c', type: 'text' },
        { id: 'v', label: 'V', value: 'v', type: 'text' },
        { id: 'b', label: 'B', value: 'b', type: 'text' },
        { id: 'n', label: 'N', value: 'n', type: 'text' },
        { id: 'm', label: 'M', value: 'm', type: 'text' },
        { id: 'space', label: 'Space', value: ' ', type: 'text', width: 3 },
        { id: 'enter', label: 'Enter', value: '\n', type: 'text', width: 2 },
        { id: 'backspace', label: '⌫', value: 'backspace', type: 'special', width: 2 },
        { id: 'email', label: '@email.com', value: '@email.com', type: 'text', width: 2 },
        { id: 'phone', label: '+86', value: '+86', type: 'text' },
        { id: 'dot', label: '.', value: '.', type: 'text' },
        { id: 'comma', label: ',', value: ',', type: 'text' },
        { id: 'question', label: '?', value: '?', type: 'text' },
        { id: 'exclaim', label: '!', value: '!', type: 'text' },
      ],
      layout: 'horizontal',
      position: 'bottom',
      autoHide: true,
      opacity: 0.95,
      alwaysOnTop: true,
      showInTaskbar: false
    };
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf8');
        return { ...this.getDefaultConfig(), ...JSON.parse(data) };
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    return this.getDefaultConfig();
  }

  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  getWindowDimensions(expanded = true) {
    const layout = this.config.layout || 'horizontal';
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    const horizontalWidth = Math.round(screenWidth * 0.9);
    const verticalHeight = Math.round(screenHeight * 0.7);

    if (expanded) {
      if (layout === 'vertical') {
        return { width: 80, height: verticalHeight };
      }
      return { width: horizontalWidth, height: 80 };
    } else {
      // Collapsed dimensions
      if (layout === 'vertical') {
        return { width: 12, height: verticalHeight };
      }
      return { width: horizontalWidth, height: 12 };
    }
  }

  getWindowPosition() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
    const { width, height } = this.getWindowDimensions(this.isExpanded);
    const position = this.config.position || 'bottom';

    switch (position) {
      case 'top':
        return { x: Math.round((screenWidth - width) / 2), y: 0 };
      case 'bottom':
        return { x: Math.round((screenWidth - width) / 2), y: screenHeight - height };
      case 'left':
        return { x: 0, y: Math.round((screenHeight - height) / 2) };
      case 'right':
        return { x: screenWidth - width, y: Math.round((screenHeight - height) / 2) };
      default:
        return { x: Math.round((screenWidth - width) / 2), y: screenHeight - height };
    }
  }

  createMainWindow() {
    const { width, height } = this.getWindowDimensions(true);
    const { x, y } = this.getWindowPosition();

    this.mainWindow = new BrowserWindow({
      width,
      height,
      x,
      y,
      frame: false,
      transparent: true,
      alwaysOnTop: this.config.alwaysOnTop,
      skipTaskbar: !this.config.showInTaskbar,
      resizable: false,
      minimizable: false,
      maximizable: false,
      focusable: false,
      type: 'panel',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      },
      opacity: this.config.opacity,
      show: false
    });

    this.mainWindow.loadFile(path.join(__dirname, 'renderer', 'keyboard.html'));

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    this.mainWindow.webContents.on('did-finish-load', () => {
      this.windowBounds = { x, y, width, height };
      this.mainWindow.setBounds(this.windowBounds);
      this.mainWindow.show();
      this.mainWindow.webContents.send('config-loaded', this.config);
    });
  }

  expandWindow() {
    if (!this.mainWindow) return;
    this.isExpanded = true;
    const { width, height } = this.getWindowDimensions(true);
    const { x, y } = this.getWindowPosition();
    this.windowBounds = { x, y, width, height };
    this.mainWindow.setBounds(this.windowBounds);
    this.mainWindow.setSize(width, height);
    this.mainWindow.webContents.send('expand-keyboard');
  }

  collapseWindow() {
    if (!this.mainWindow) return;
    this.isExpanded = false;
    const { width, height } = this.getWindowDimensions(false);
    const { x, y } = this.getWindowPosition();
    this.windowBounds = { x, y, width, height };
    this.mainWindow.setBounds(this.windowBounds);
    this.mainWindow.setSize(width, height);
    this.mainWindow.webContents.send('collapse-keyboard');
  }

  snapToEdge() {
    if (!this.mainWindow) return;

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
    const [currentX, currentY] = this.mainWindow.getPosition();
    const { width, height } = this.getWindowDimensions(true);

    const distances = {
      top: currentY,
      bottom: screenHeight - (currentY + height),
      left: currentX,
      right: screenWidth - (currentX + width)
    };

    let closestEdge = 'bottom';
    let minDistance = distances.bottom;

    for (const [edge, distance] of Object.entries(distances)) {
      if (distance < minDistance) {
        minDistance = distance;
        closestEdge = edge;
      }
    }

    // Auto-switch layout based on edge
    if (closestEdge === 'top' || closestEdge === 'bottom') {
      this.config.layout = 'horizontal';
    } else {
      this.config.layout = 'vertical';
    }

    this.config.position = closestEdge;
    this.saveConfig();

    // Recalculate position with new layout
    const newPos = this.getWindowPosition();
    const newDims = this.getWindowDimensions(this.isExpanded);
    this.windowBounds = { ...newPos, width: newDims.width, height: newDims.height };
    this.mainWindow.setBounds(this.windowBounds);

    this.mainWindow.webContents.send('config-loaded', this.config);
  }

  createConfigWindow() {
    if (this.configWindow) {
      this.configWindow.focus();
      return;
    }

    this.configWindow = new BrowserWindow({
      width: 900,
      height: 700,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      title: 'VibeCoding666 Configuration'
    });

    this.configWindow.loadFile(path.join(__dirname, 'renderer', 'config.html'));

    this.configWindow.on('closed', () => {
      this.configWindow = null;
    });

    this.configWindow.webContents.on('did-finish-load', () => {
      this.configWindow.webContents.send('config-loaded', this.config);
    });
  }

  simulateInput(text) {
    if (!robot) {
      console.error('robotjs not available');
      return;
    }

    try {
      robot.typeString(text);
    } catch (error) {
      console.error('Input simulation error:', error);
    }
  }

  simulateSpecial(key) {
    if (!robot) {
      console.error('robotjs not available');
      return;
    }

    try {
      const keyMap = {
        'backspace': 'backspace',
        'enter': 'return',
        'tab': 'tab',
        'escape': 'escape',
        'delete': 'delete',
        'home': 'home',
        'end': 'end',
        'pageup': 'pageup',
        'pagedown': 'pagedown',
        'up': 'up',
        'down': 'down',
        'left': 'left',
        'right': 'right'
      };

      if (keyMap[key]) {
        robot.keyTap(keyMap[key]);
      }
    } catch (error) {
      console.error('Special key simulation error:', error);
    }
  }

  setupIpcListeners() {
    ipcMain.on('key-pressed', (event, keyData) => {
      if (keyData.type === 'special') {
        this.simulateSpecial(keyData.value);
      } else {
        this.simulateInput(keyData.value);
      }
    });

    ipcMain.on('update-config', (event, newConfig) => {
      if (newConfig.layout === 'horizontal') {
        if (newConfig.position && newConfig.position !== 'top' && newConfig.position !== 'bottom') {
          newConfig.position = 'bottom';
        }
      } else if (newConfig.layout === 'vertical') {
        if (newConfig.position && newConfig.position !== 'left' && newConfig.position !== 'right') {
          newConfig.position = 'right';
        }
      }

      if (newConfig.position === 'top' || newConfig.position === 'bottom') {
        newConfig.layout = 'horizontal';
      } else if (newConfig.position === 'left' || newConfig.position === 'right') {
        newConfig.layout = 'vertical';
      }

      const needsResize = newConfig.layout && newConfig.layout !== this.config.layout;
      const needsReposition = newConfig.position && newConfig.position !== this.config.position;

      this.config = { ...this.config, ...newConfig };
      this.saveConfig();

      if (this.mainWindow) {
        this.mainWindow.setAlwaysOnTop(this.config.alwaysOnTop);
        this.mainWindow.setOpacity(this.config.opacity);

        if (needsResize || needsReposition) {
          const { width, height } = this.getWindowDimensions(this.isExpanded);
          const { x, y } = this.getWindowPosition();
          this.windowBounds = { x, y, width, height };
          this.mainWindow.setBounds(this.windowBounds);
        }

        this.mainWindow.webContents.send('config-loaded', this.config);
      }
    });

    ipcMain.on('open-config', () => {
      this.createConfigWindow();
    });

    ipcMain.on('close-keyboard', () => {
      if (this.mainWindow) {
        this.mainWindow.close();
      }
    });

    ipcMain.on('minimize-keyboard', () => {
      if (this.mainWindow) {
        this.collapseWindow();
      }
    });

    ipcMain.on('move-window', (event, { x, y }) => {
      if (this.mainWindow) {
        const [currentX, currentY] = this.mainWindow.getPosition();
        this.mainWindow.setPosition(currentX + x, currentY + y);
      }
    });

    ipcMain.on('snap-to-edge', () => {
      this.snapToEdge();
    });

    ipcMain.on('request-expand', () => {
      this.expandWindow();
    });

    ipcMain.on('request-collapse', () => {
      if (this.config.autoHide !== false) {
        this.collapseWindow();
      }
    });

    ipcMain.on('get-config', (event) => {
      event.reply('config-loaded', this.config);
    });

    ipcMain.handle('export-config', async () => {
      const result = await dialog.showSaveDialog(this.configWindow || this.mainWindow, {
        defaultPath: 'vibecoding666-config.json',
        filters: [{ name: 'JSON', extensions: ['json'] }]
      });

      if (!result.canceled) {
        fs.writeFileSync(result.filePath, JSON.stringify(this.config, null, 2));
        return { success: true };
      }
      return { success: false };
    });

    ipcMain.handle('import-config', async () => {
      const result = await dialog.showOpenDialog(this.configWindow || this.mainWindow, {
        filters: [{ name: 'JSON', extensions: ['json'] }],
        properties: ['openFile']
      });

      if (!result.canceled && result.filePaths.length > 0) {
        try {
          const data = fs.readFileSync(result.filePaths[0], 'utf8');
          const importedConfig = JSON.parse(data);
          this.config = { ...this.getDefaultConfig(), ...importedConfig };
          this.saveConfig();

          if (this.mainWindow) {
            const { width, height } = this.getWindowDimensions(this.isExpanded);
            const { x, y } = this.getWindowPosition();
            this.windowBounds = { x, y, width, height };
            this.mainWindow.setBounds(this.windowBounds);
            this.mainWindow.webContents.send('config-loaded', this.config);
          }

          if (this.configWindow) {
            this.configWindow.webContents.send('config-loaded', this.config);
          }

          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      }
      return { success: false };
    });
  }

  registerGlobalShortcuts() {
    globalShortcut.register('CommandOrControl+Alt+K', () => {
      if (this.mainWindow) {
        if (this.mainWindow.isVisible()) {
          this.mainWindow.hide();
        } else {
          this.mainWindow.show();
        }
      }
    });
  }

  init() {
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupIpcListeners();
      this.registerGlobalShortcuts();

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('will-quit', () => {
      globalShortcut.unregisterAll();
    });
  }
}

const vibeCoding666App = new VibeCoding666();
vibeCoding666App.init();
