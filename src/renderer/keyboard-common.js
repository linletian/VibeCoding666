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
      this.applyPosition();
      this.renderKeys();
    });

    ipcRenderer.on('expand-keyboard', () => {
      this.expand();
    });

    ipcRenderer.on('collapse-keyboard', () => {
      this.collapse();
    });

    const minimizeBtn = document.getElementById('minimizeBtn');
    const configBtn = document.getElementById('configBtn');
    const closeBtn = document.getElementById('closeBtn');

    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        ipcRenderer.send('minimize-keyboard');
      });
    }

    if (configBtn) {
      configBtn.addEventListener('click', () => {
        ipcRenderer.send('open-config');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        ipcRenderer.send('close-keyboard');
      });
    }

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

  applyPosition() {
    if (!this.config) return;
    const position = this.config.position || 'bottom';
    document.body.classList.remove('top', 'bottom', 'left', 'right');
    document.body.classList.add(position);
  }

  renderKeys() {
    if (!this.config || !this.config.keys) return;
    this.keysContainer.innerHTML = '';
    const layout = document.body.dataset.layout || this.config.layout || 'horizontal';
    
    if (layout === 'horizontal') {
      this.renderHorizontal();
    } else {
      this.renderVertical();
    }
  }

  renderHorizontal() {
    const row = document.createElement('div');
    row.className = 'key-row';
    this.config.keys.forEach(keyData => {
      const keyButton = this.createKeyButton(keyData);
      row.appendChild(keyButton);
    });
    this.keysContainer.appendChild(row);
  }

  renderVertical() {
    this.config.keys.forEach(keyData => {
      const row = document.createElement('div');
      row.className = 'key-row';
      const keyButton = this.createKeyButton(keyData);
      row.appendChild(keyButton);
      this.keysContainer.appendChild(row);
    });
  }

  createKeyButton(keyData) {
    const button = document.createElement('button');
    button.className = 'key';
    const span = document.createElement('span');
    span.className = 'key-label';
    span.textContent = keyData.label;
    button.appendChild(span);

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
