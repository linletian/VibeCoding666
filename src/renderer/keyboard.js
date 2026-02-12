const { ipcRenderer } = require('electron');

class KeyboardUI {
  constructor() {
    this.config = null;
    this.container = document.getElementById('keyboardContainer');
    this.keysContainer = document.getElementById('keyboardKeys');
    this.titleBar = document.getElementById('titleBar');
    this.edgeTrigger = document.getElementById('edgeTrigger');
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.isPinned = false;
    this.hideTimeout = null;
    this.mouseInWindow = false;

    this.setupEventListeners();
    this.setupDragHandlers();
    this.setupEdgeTrigger();
    this.setupAutoHide();
    this.addPinButton();
  }

  setupEventListeners() {
    ipcRenderer.on('config-loaded', (event, config) => {
      this.config = config;
      this.applyLayout();
      this.renderKeys();
    });

    document.getElementById('minimizeBtn').addEventListener('click', () => {
      ipcRenderer.send('minimize-keyboard');
    });

    document.getElementById('configBtn').addEventListener('click', () => {
      ipcRenderer.send('open-config');
    });

    document.getElementById('closeBtn').addEventListener('click', () => {
      ipcRenderer.send('close-keyboard');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        ipcRenderer.send('close-keyboard');
      }
    });
  }

  setupDragHandlers() {
    this.titleBar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.window-controls')) return;
      this.isDragging = true;
      this.dragOffset.x = e.screenX;
      this.dragOffset.y = e.screenY;
      document.body.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;

      const deltaX = e.screenX - this.dragOffset.x;
      const deltaY = e.screenY - this.dragOffset.y;

      ipcRenderer.send('move-window', { x: deltaX, y: deltaY });

      this.dragOffset.x = e.screenX;
      this.dragOffset.y = e.screenY;
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        document.body.classList.remove('dragging');
        ipcRenderer.send('snap-to-edge');
      }
    });
  }

  setupEdgeTrigger() {
    this.edgeTrigger.addEventListener('mouseenter', () => {
      if (!this.isPinned) {
        this.showKeyboard();
      }
    });
  }

  setupAutoHide() {
    this.container.addEventListener('mouseenter', () => {
      this.mouseInWindow = true;
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
    });

    this.container.addEventListener('mouseleave', () => {
      this.mouseInWindow = false;
      if (!this.isPinned) {
        this.scheduleHide();
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.isPinned && !this.container.contains(e.target)) {
        this.hideKeyboard();
      }
    });
  }

  addPinButton() {
    const pinBtn = document.createElement('button');
    pinBtn.className = 'pin-btn';
    pinBtn.innerHTML = '📌';
    pinBtn.title = 'Pin keyboard (keep visible)';
    pinBtn.addEventListener('click', () => {
      this.isPinned = !this.isPinned;
      pinBtn.classList.toggle('pinned', this.isPinned);
      pinBtn.title = this.isPinned ? 'Unpin keyboard' : 'Pin keyboard (keep visible)';
      ipcRenderer.send('set-pinned', this.isPinned);
    });
    this.container.appendChild(pinBtn);
  }

  applyLayout() {
    if (!this.config) return;

    const layout = this.config.layout || 'horizontal';
    const position = this.config.position || 'bottom';

    this.container.classList.remove('horizontal', 'vertical');
    this.container.classList.add(layout);

    this.container.setAttribute('data-position', position);

    if (this.config.autoHide !== false) {
      this.container.classList.add('hidden');
    }
  }

  showKeyboard() {
    this.container.classList.remove('hidden');
    ipcRenderer.send('keyboard-visibility', true);
  }

  hideKeyboard() {
    if (this.isPinned) return;
    this.container.classList.add('hidden');
    ipcRenderer.send('keyboard-visibility', false);
  }

  scheduleHide() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.hideTimeout = setTimeout(() => {
      if (!this.mouseInWindow && !this.isPinned) {
        this.hideKeyboard();
      }
    }, 1000);
  }

  renderKeys() {
    if (!this.config || !this.config.keys) return;

    this.keysContainer.innerHTML = '';

    const layout = this.config.layout || 'horizontal';

    if (layout === 'vertical') {
      this.renderVerticalLayout();
    } else {
      this.renderHorizontalLayout();
    }
  }

  renderHorizontalLayout() {
    const rows = [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
      ['email', 'phone', 'dot', 'comma', 'question', 'exclaim', 'space', 'backspace', 'enter']
    ];

    rows.forEach(rowIds => this.renderKeyRow(rowIds));
  }

  renderVerticalLayout() {
    const columns = [
      ['1', 'q', 'a', 'z'],
      ['2', 'w', 's', 'x'],
      ['3', 'e', 'd', 'c'],
      ['4', 'r', 'f', 'v'],
      ['5', 't', 'g', 'b'],
      ['6', 'y', 'h', 'n'],
      ['7', 'u', 'j', 'm'],
      ['8', 'i', 'k', 'email'],
      ['9', 'o', 'l', 'phone'],
      ['0', 'p', 'space', 'dot'],
      ['comma', 'question', 'exclaim', 'backspace'],
      ['enter']
    ];

    columns.forEach(colIds => this.renderKeyRow(colIds));
  }

  renderKeyRow(keyIds) {
    const row = document.createElement('div');
    row.className = 'key-row';

    keyIds.forEach(id => {
      const keyData = this.config.keys.find(k => k.id === id);
      if (keyData) {
        const keyButton = this.createKeyButton(keyData);
        row.appendChild(keyButton);
      }
    });

    this.keysContainer.appendChild(row);
  }

  createKeyButton(keyData) {
    const button = document.createElement('button');
    button.className = 'key';
    button.textContent = keyData.label;

    if (keyData.width && keyData.width > 1) {
      button.classList.add(`wide-${keyData.width}`);
    }

    if (keyData.type === 'special') {
      button.classList.add('special');
    }

    button.addEventListener('click', () => {
      this.animateKeyPress(button);
      ipcRenderer.send('key-pressed', keyData);
    });

    return button;
  }

  animateKeyPress(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 100);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new KeyboardUI();
});
