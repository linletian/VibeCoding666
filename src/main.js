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
        { id: '1', label: '帮我改 bug', value: '帮我改 bug', type: 'text' },
        { id: '2', label: '继续改 bug', value: '继续改 bug', type: 'text' },
        { id: '3', label: '不要改变量！', value: '不要改变量！', type: 'text' },
        { id: '4', label: '下一步是啥？', value: '下一步是啥？', type: 'text' },
        { id: '5', label: '中文回答！', value: '中文回答！', type: 'text' },
        { id: '6', label: '可以', value: '可以', type: 'text' },
        { id: '7', label: '直接写代码，别再问我', value: '直接写代码，别再问我', type: 'text' },
        { id: '8', label: '什么意思？', value: '什么意思？', type: 'text' },
        { id: '9', label: '666', value: '666', type: 'text' },
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
    const position = this.config.position || 'bottom';
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    const horizontalWidth = Math.round(screenWidth * 0.9);
    const horizontalExpandedHeight = 48;
    
    // Calculate vertical height based on key count
    // Header(~62px) + Padding(~16px) + Keys(N * 40px)
    let verticalHeight = Math.round(screenHeight * 0.7);
    if (this.config && this.config.keys) {
      const estimatedHeight = 80 + (this.config.keys.length * 40);
      // Limit to 80% screen height or estimated height, whichever is smaller
      // But ensure a minimum height (e.g. 200px)
      verticalHeight = Math.min(Math.max(200, estimatedHeight), Math.round(screenHeight * 0.8));
    }

    if (expanded) {
      if (layout === 'vertical') {
        return { width: 80, height: verticalHeight };
      }
      return { width: horizontalWidth, height: horizontalExpandedHeight };
    }

    // Collapsed trigger bar dimensions should follow edge direction
    if (position === 'top' || position === 'bottom') {
      return { width: horizontalWidth, height: 12 };
    }

    return { width: 12, height: verticalHeight };
  }

  getWindowPosition() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { x: workAreaX, y: workAreaY, width: workAreaWidth, height: workAreaHeight } = primaryDisplay.workArea;
    const { width, height } = this.getWindowDimensions(this.isExpanded);
    const position = this.config.position || 'bottom';

    switch (position) {
      case 'top':
        return { x: Math.round(workAreaX + (workAreaWidth - width) / 2), y: workAreaY };
      case 'bottom':
        return { x: Math.round(workAreaX + (workAreaWidth - width) / 2), y: workAreaY + workAreaHeight - height };
      case 'left':
        return { x: workAreaX, y: Math.round(workAreaY + (workAreaHeight - height) / 2) };
      case 'right':
        return { x: workAreaX + workAreaWidth - width, y: Math.round(workAreaY + (workAreaHeight - height) / 2) };
      default:
        return { x: Math.round(workAreaX + (workAreaWidth - width) / 2), y: workAreaY + workAreaHeight - height };
    }
  }
  getKeyboardFile() {
    const layout = this.config.layout || 'horizontal';
    if (layout === 'horizontal') {
      return path.join(__dirname, 'renderer', 'keyboard-horizontal.html');
    }
    return path.join(__dirname, 'renderer', 'keyboard-vertical.html');
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

    if (typeof this.mainWindow.setHasShadow === 'function') {
      this.mainWindow.setHasShadow(false);
    }

    this.mainWindow.loadFile(this.getKeyboardFile());

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    this.mainWindow.webContents.on('did-finish-load', () => {
      // 使用可能已经更新的 windowBounds
      if (this.windowBounds) {
        this.setWindowBoundsWithEdgeCorrection(this.windowBounds);
      }
      this.mainWindow.show();
      const configToSend = {...this.config, layout: this.config.layout || "horizontal"};
      this.mainWindow.webContents.send('config-loaded', configToSend);
    });
  }

  setWindowBoundsWithEdgeCorrection(bounds) {
    if (!this.mainWindow) return;

    const position = this.config.position || 'bottom';
    this.mainWindow.setBounds(bounds);

    const actualBounds = this.mainWindow.getBounds();
    const primaryDisplay = screen.getPrimaryDisplay();
    const { x: workAreaX, y: workAreaY, width: workAreaWidth, height: workAreaHeight } = primaryDisplay.workArea;

    let correctedX = actualBounds.x;
    let correctedY = actualBounds.y;

    if (position === 'top') {
      correctedY = workAreaY;
    } else if (position === 'bottom') {
      correctedY = workAreaY + workAreaHeight - actualBounds.height;
    } else if (position === 'left') {
      correctedX = workAreaX;
    } else if (position === 'right') {
      correctedX = workAreaX + workAreaWidth - actualBounds.width;
    }

    if (correctedX !== actualBounds.x || correctedY !== actualBounds.y) {
      this.mainWindow.setBounds({
        x: correctedX,
        y: correctedY,
        width: actualBounds.width,
        height: actualBounds.height,
      });
    }

    this.windowBounds = this.mainWindow.getBounds();
  }

  expandWindow() {
    if (!this.mainWindow) return;
    this.isExpanded = true;
    const { width, height } = this.getWindowDimensions(true);
    const position = this.config.position || 'bottom';
    const currentBounds = this.mainWindow.getBounds();
    
    // 基于当前位置计算新位置，保持在原地展开
    let x = currentBounds.x;
    let y = currentBounds.y;

    if (position === 'bottom') {
      // 底部吸附：保持底部位置不变，向上延伸
      y = currentBounds.y + currentBounds.height - height;
    } else if (position === 'right') {
      // 右侧吸附：保持右侧位置不变，向左延伸
      x = currentBounds.x + currentBounds.width - width;
    } 
    // top 和 left 只需要保持 x, y 不变（因为是左上角锚点），只是宽高变化

    this.windowBounds = { x, y, width, height };
    this.setWindowBoundsWithEdgeCorrection(this.windowBounds);
    this.mainWindow.webContents.send('expand-keyboard');
  }

  collapseWindow() {
    if (!this.mainWindow) return;
    this.isExpanded = false;
    const { width, height } = this.getWindowDimensions(false);
    const position = this.config.position || 'bottom';
    const currentBounds = this.mainWindow.getBounds();

    // 基于当前位置计算新位置，保持在原地折叠
    let x = currentBounds.x;
    let y = currentBounds.y;

    if (position === 'bottom') {
      // 底部吸附：保持底部位置不变，新 y = 旧底部 - 新高度
      y = currentBounds.y + currentBounds.height - height;
    } else if (position === 'right') {
      // 右侧吸附：保持右侧位置不变，新 x = 旧右侧 - 新宽度
      x = currentBounds.x + currentBounds.width - width;
    }
    // top 和 left 只需要保持 x, y 不变

    this.windowBounds = { x, y, width, height };
    this.setWindowBoundsWithEdgeCorrection(this.windowBounds);
    this.mainWindow.webContents.send('collapse-keyboard');
  }

  snapToEdge() {
    if (!this.mainWindow) return;

    const primaryDisplay = screen.getPrimaryDisplay();
    const { x: workAreaX, y: workAreaY, width: workAreaWidth, height: workAreaHeight } = primaryDisplay.workArea;
    const { x: currentX, y: currentY, width, height } = this.mainWindow.getBounds();

    const distances = {
      top: currentY - workAreaY,
      bottom: (workAreaY + workAreaHeight) - (currentY + height),
      left: currentX - workAreaX,
      right: (workAreaX + workAreaWidth) - (currentX + width)
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

    const oldLayout = this.config.layout;
    this.config.position = closestEdge;
    this.saveConfig();

    // 切换位置后强制展开
    this.isExpanded = true;

    // Recalculate position with new layout
    const newPos = this.getWindowPosition();
    const newDims = this.getWindowDimensions(this.isExpanded);
    this.windowBounds = { ...newPos, width: newDims.width, height: newDims.height };
    this.setWindowBoundsWithEdgeCorrection(this.windowBounds);

    // 如果布局改变，重新加载对应的HTML文件
    if (oldLayout !== this.config.layout) {
      this.mainWindow.loadFile(this.getKeyboardFile());
    } else {
      const configToSend = {...this.config, layout: this.config.layout || "horizontal"};
      this.mainWindow.webContents.send('config-loaded', configToSend);
      this.mainWindow.webContents.send('expand-keyboard');
    }
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
      // Auto-calculate layout based on position
      if (newConfig.position === 'top' || newConfig.position === 'bottom') {
        newConfig.layout = 'horizontal';
      } else if (newConfig.position === 'left' || newConfig.position === 'right') {
        newConfig.layout = 'vertical';
      }

      const needsResize = newConfig.layout && newConfig.layout !== this.config.layout;
      const needsReposition = newConfig.position && newConfig.position !== this.config.position;

      // 只要位置或布局改变，就强制展开
      if (needsResize || needsReposition) {
        this.isExpanded = true;
      }

      this.config = { ...this.config, ...newConfig };
      this.saveConfig();

      if (this.mainWindow) {
        this.mainWindow.setAlwaysOnTop(this.config.alwaysOnTop);
        this.mainWindow.setOpacity(this.config.opacity);

        // 如果布局改变，需要先隐藏窗口，加载新HTML后再显示
        if (needsResize) {
          this.mainWindow.hide();
          // 预计算新的窗口尺寸和位置
          const { width, height } = this.getWindowDimensions(this.isExpanded);
          const { x, y } = this.getWindowPosition();
          this.windowBounds = { x, y, width, height };
          this.mainWindow.loadFile(this.getKeyboardFile());
        } else if (needsReposition) {
          const { width, height } = this.getWindowDimensions(this.isExpanded);
          const { x, y } = this.getWindowPosition();
          this.windowBounds = { x, y, width, height };
          this.setWindowBoundsWithEdgeCorrection(this.windowBounds);
          const configToSend = {...this.config, layout: this.config.layout || "horizontal"};
          this.mainWindow.webContents.send('config-loaded', configToSend);
          this.mainWindow.webContents.send('expand-keyboard');
        } else {
          const configToSend = {...this.config, layout: this.config.layout || "horizontal"};
          this.mainWindow.webContents.send('config-loaded', configToSend);
        }
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

    ipcMain.on('window-drag', (event, { deltaX, deltaY }) => {
      if (!this.mainWindow) return;

      const position = this.config.position || 'bottom';
      const bounds = this.mainWindow.getBounds();
      const primaryDisplay = screen.getPrimaryDisplay();
      const { x: workAreaX, y: workAreaY, width: workAreaWidth, height: workAreaHeight } = primaryDisplay.workArea;
      
      let newX = bounds.x;
      let newY = bounds.y;

      // 仅允许沿贴合边缘的轴向移动，并限制在 WorkArea 内
      if (position === 'top' || position === 'bottom') {
        newX += deltaX;
        // 限制 X 范围：不超出左边界，且右侧不超出右边界
        newX = Math.max(workAreaX, Math.min(newX, workAreaX + workAreaWidth - bounds.width));
      } else { // left or right
        newY += deltaY;
        // 限制 Y 范围：不超出上边界，且底部不超出下边界
        newY = Math.max(workAreaY, Math.min(newY, workAreaY + workAreaHeight - bounds.height));
      }

      // 如果位置没有实际变化，则不更新（避免不必要的 IPC 和重绘）
      if (newX !== bounds.x || newY !== bounds.y) {
        this.mainWindow.setBounds({ 
          x: newX,
          y: newY,
          width: bounds.width,
          height: bounds.height
        });
        
        // 更新 windowBounds 以保持记录
        this.windowBounds = this.mainWindow.getBounds();
      }
    });

    // Old move-window handler (deprecated or keep for other IPCs?)
    // Keeping it but logic is superseded by window-drag for mouse dragging
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
            this.setWindowBoundsWithEdgeCorrection(this.windowBounds);
            const configToSend = {...this.config, layout: this.config.layout || "horizontal"};
      this.mainWindow.webContents.send('config-loaded', configToSend);
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
