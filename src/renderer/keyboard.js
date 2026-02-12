const { ipcRenderer } = require('electron');

class KeyboardUI {
  constructor() {
    this.config = null;
    this.container = document.getElementById('keyboardContainer');
    this.keysContainer = document.getElementById('keyboardKeys');
    this.isExpanded = true;
    this.mouseInWindow = false;
    this.hideTimeout = null;

    this.setupEventListeners();
    this.setupMouseHandlers();
  }

  setupEventListeners() {
    ipcRenderer.on('config-loaded', (event, config) => {
      this.config = config;
      this.applyLayout();
      this.renderKeys();
    });

    ipcRenderer.on('expand-keyboard', () => {
      this.expand();
    });

    ipcRenderer.on('collapse-keyboard', () => {
      this.collapse();
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

  setupMouseHandlers() {
    this.container.addEventListener('mouseenter', () => {
      this.mouseInWindow = true;
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
      if (!this.isExpanded) {
        ipcRenderer.send('request-expand');
      }
    });

    this.container.addEventListener('mouseleave', () => {
      this.mouseInWindow = false;
      if (this.isExpanded && this.config && this.config.autoHide !== false) {
        this.scheduleCollapse();
      }
    });
  }

  scheduleCollapse() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.hideTimeout = setTimeout(() => {
      if (!this.mouseInWindow && this.isExpanded) {
        ipcRenderer.send('request-collapse');
      }
    }, 1000);
  }

  expand() {
    this.isExpanded = true;
    this.container.classList.remove('collapsed');
    this.container.classList.add('expanded');
  }

  collapse() {
    this.isExpanded = false;
    this.container.classList.remove('expanded');
    this.container.classList.add('collapsed');
  }

  applyLayout() {
    if (!this.config) return;

    const layout = this.config.layout || 'horizontal';
    const position = this.config.position || 'bottom';

    document.body.classList.remove('horizontal', 'vertical', 'top', 'bottom', 'left', 'right');
    document.body.classList.add(layout, position);
  }

  renderKeys() {
    if (!this.config || !this.config.keys) return;

    this.keysContainer.innerHTML = '';

    const layout = this.config.layout || 'horizontal';

    if (layout === 'horizontal') {
      this.renderHorizontalSingleRow();
    } else {
      this.renderVerticalSingleColumn();
    }
  }

  renderHorizontalSingleRow() {
    const row = document.createElement('div');
    row.className = 'key-row';

    const keyOrder = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
      'z', 'x', 'c', 'v', 'b', 'n', 'm',
      'email', 'phone', 'dot', 'comma', 'question', 'exclaim',
      'space', 'backspace', 'enter'
    ];

    keyOrder.forEach(id => {
      const keyData = this.config.keys.find(k => k.id === id);
      if (keyData) {
        const keyButton = this.createKeyButton(keyData);
        row.appendChild(keyButton);
      }
    });

    this.keysContainer.appendChild(row);
  }

  renderVerticalSingleColumn() {
    const keyOrder = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
      'z', 'x', 'c', 'v', 'b', 'n', 'm',
      'email', 'phone', 'dot', 'comma', 'question', 'exclaim',
      'space', 'backspace', 'enter'
    ];

    keyOrder.forEach(id => {
      const keyData = this.config.keys.find(k => k.id === id);
      if (keyData) {
        const row = document.createElement('div');
        row.className = 'key-row';
        const keyButton = this.createKeyButton(keyData);
        row.appendChild(keyButton);
        this.keysContainer.appendChild(row);
      }
    });
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
