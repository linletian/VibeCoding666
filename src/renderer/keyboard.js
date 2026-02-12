const { ipcRenderer } = require('electron');

class KeyboardUI {
  constructor() {
    this.config = null;
    this.keysContainer = document.getElementById('keyboardKeys');
    this.titleBar = document.getElementById('titleBar');
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    
    this.setupEventListeners();
    this.setupDragHandlers();
  }

  setupEventListeners() {
    ipcRenderer.on('config-loaded', (event, config) => {
      this.config = config;
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
      this.isDragging = false;
      document.body.classList.remove('dragging');
    });
  }

  renderKeys() {
    if (!this.config || !this.config.keys) return;
    
    this.keysContainer.innerHTML = '';
    
    const row1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const row2 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
    const row3 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
    const row4 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
    const row5 = ['email', 'phone', 'dot', 'comma', 'question', 'exclaim', 'space', 'backspace', 'enter'];
    
    this.renderKeyRow(row1);
    this.renderKeyRow(row2);
    this.renderKeyRow(row3);
    this.renderKeyRow(row4);
    this.renderKeyRow(row5);
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