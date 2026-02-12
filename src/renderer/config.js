const { ipcRenderer } = require('electron');

class ConfigUI {
  constructor() {
    this.config = null;
    this.keysGrid = document.getElementById('keysGrid');
    this.modal = document.getElementById('keyModal');
    this.keyForm = document.getElementById('keyForm');
    this.editingKeyId = null;
    
    this.setupEventListeners();
    this.setupSettingsListeners();
  }

  setupEventListeners() {
    ipcRenderer.on('config-loaded', (event, config) => {
      this.config = config;
      this.renderKeys();
      this.updateSettingsUI();
    });

    document.getElementById('addKeyBtn').addEventListener('click', () => {
      this.openModal();
    });

    document.getElementById('exportBtn').addEventListener('click', async () => {
      const result = await ipcRenderer.invoke('export-config');
      if (result.success) {
        this.showNotification('Configuration exported successfully');
      }
    });

    document.getElementById('importBtn').addEventListener('click', async () => {
      const result = await ipcRenderer.invoke('import-config');
      if (result.success) {
        this.showNotification('Configuration imported successfully');
      } else if (result.error) {
        this.showNotification('Error: ' + result.error, 'error');
      }
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset to default configuration?')) {
        this.config = { ...this.config, keys: this.getDefaultKeys() };
        this.saveConfig();
        this.renderKeys();
        this.showNotification('Configuration reset to default');
      }
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('deleteBtn').addEventListener('click', () => {
      if (this.editingKeyId && confirm('Are you sure you want to delete this key?')) {
        this.deleteKey(this.editingKeyId);
        this.closeModal();
      }
    });

    this.keyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveKey();
    });

    document.querySelector('.modal').addEventListener('click', (e) => {
      if (e.target === document.querySelector('.modal')) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  setupSettingsListeners() {
    const layoutSelect = document.getElementById('layout');
    const positionSelect = document.getElementById('position');
    const autoHideCheckbox = document.getElementById('autoHide');
    const opacitySlider = document.getElementById('opacity');
    const opacityValue = document.getElementById('opacityValue');
    const alwaysOnTopCheckbox = document.getElementById('alwaysOnTop');
    const showInTaskbarCheckbox = document.getElementById('showInTaskbar');

    layoutSelect.addEventListener('change', () => {
      if (layoutSelect.value === 'horizontal') {
        if (positionSelect.value !== 'top' && positionSelect.value !== 'bottom') {
          positionSelect.value = 'bottom';
        }
      } else {
        if (positionSelect.value !== 'left' && positionSelect.value !== 'right') {
          positionSelect.value = 'right';
        }
      }
      this.saveSettings();
    });

    positionSelect.addEventListener('change', () => {
      if (positionSelect.value === 'top' || positionSelect.value === 'bottom') {
        layoutSelect.value = 'horizontal';
      } else {
        layoutSelect.value = 'vertical';
      }
      this.saveSettings();
    });

    autoHideCheckbox.addEventListener('change', () => {
      this.saveSettings();
    });

    let debounceTimer;
    opacitySlider.addEventListener('input', () => {
      opacityValue.textContent = opacitySlider.value;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.saveSettings();
      }, 300);
    });

    alwaysOnTopCheckbox.addEventListener('change', () => {
      this.saveSettings();
    });

    showInTaskbarCheckbox.addEventListener('change', () => {
      this.saveSettings();
    });
  }

  updateSettingsUI() {
    if (!this.config) return;

    document.getElementById('layout').value = this.config.layout || 'horizontal';
    document.getElementById('position').value = this.config.position || 'bottom';
    document.getElementById('autoHide').checked = this.config.autoHide !== false;
    document.getElementById('opacity').value = this.config.opacity || 0.95;
    document.getElementById('opacityValue').textContent = this.config.opacity || 0.95;
    document.getElementById('alwaysOnTop').checked = this.config.alwaysOnTop !== false;
    document.getElementById('showInTaskbar').checked = this.config.showInTaskbar === true;
  }

  saveSettings() {
    const newConfig = {
      layout: document.getElementById('layout').value,
      position: document.getElementById('position').value,
      autoHide: document.getElementById('autoHide').checked,
      opacity: parseFloat(document.getElementById('opacity').value),
      alwaysOnTop: document.getElementById('alwaysOnTop').checked,
      showInTaskbar: document.getElementById('showInTaskbar').checked
    };

    ipcRenderer.send('update-config', newConfig);
    this.showNotification('Settings saved');
  }

  renderKeys() {
    if (!this.config || !this.config.keys) return;
    
    this.keysGrid.innerHTML = '';
    
    this.config.keys.forEach(key => {
      const keyCard = this.createKeyCard(key);
      this.keysGrid.appendChild(keyCard);
    });
  }

  createKeyCard(key) {
    const card = document.createElement('div');
    card.className = 'key-card';
    card.innerHTML = `
      <div class="label">${this.escapeHtml(key.label)}</div>
      <div class="value">${this.escapeHtml(key.value)}</div>
      <span class="type ${key.type}">${key.type}</span>
    `;
    
    card.addEventListener('click', () => {
      this.openModal(key);
    });
    
    return card;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  openModal(key = null) {
    this.editingKeyId = key ? key.id : null;
    
    document.getElementById('modalTitle').textContent = key ? 'Edit Key' : 'Add New Key';
    document.getElementById('keyId').value = key ? key.id : '';
    document.getElementById('keyLabel').value = key ? key.label : '';
    document.getElementById('keyValue').value = key ? key.value : '';
    document.getElementById('keyType').value = key ? key.type : 'text';
    document.getElementById('keyWidth').value = key ? (key.width || 1) : 1;
    
    document.getElementById('deleteBtn').style.display = key ? 'inline-block' : 'none';
    
    this.modal.classList.add('active');
  }

  closeModal() {
    this.modal.classList.remove('active');
    this.editingKeyId = null;
    this.keyForm.reset();
  }

  saveKey() {
    const label = document.getElementById('keyLabel').value.trim();
    const value = document.getElementById('keyValue').value;
    const type = document.getElementById('keyType').value;
    const width = parseInt(document.getElementById('keyWidth').value) || 1;
    
    if (!label || value === '') {
      alert('Please fill in all required fields');
      return;
    }
    
    const keyData = {
      id: this.editingKeyId || this.generateId(),
      label,
      value,
      type,
      width: width > 1 ? width : undefined
    };
    
    if (this.editingKeyId) {
      const index = this.config.keys.findIndex(k => k.id === this.editingKeyId);
      if (index !== -1) {
        this.config.keys[index] = keyData;
      }
    } else {
      this.config.keys.push(keyData);
    }
    
    this.saveConfig();
    this.renderKeys();
    this.closeModal();
    this.showNotification(this.editingKeyId ? 'Key updated' : 'Key added');
  }

  deleteKey(keyId) {
    const index = this.config.keys.findIndex(k => k.id === keyId);
    if (index !== -1) {
      this.config.keys.splice(index, 1);
      this.saveConfig();
      this.renderKeys();
      this.showNotification('Key deleted');
    }
  }

  saveConfig() {
    ipcRenderer.send('update-config', { keys: this.config.keys });
  }

  generateId() {
    return 'key_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getDefaultKeys() {
    return [
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
    ];
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
      color: white;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  new ConfigUI();
});