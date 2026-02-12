const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let robot;
try {
  robot = require('robotjs');
} catch (e) {
  console.error('robotjs not installed. Run: npm install robotjs');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(getKeyboardHTML());
  } else if (req.url === '/style.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end(getCSS());
  } else if (req.url === '/input') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        simulateInput(data.text, data.type);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

function simulateInput(text, type) {
  if (type === 'special') {
    const keyMap = {
      'backspace': 'backspace',
      'enter': 'return',
      'tab': 'tab',
      'escape': 'escape',
      'delete': 'delete',
      'space': 'space'
    };
    if (keyMap[text]) {
      robot.keyTap(keyMap[text]);
    }
  } else {
    robot.typeString(text);
  }
}

function getCSS() {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #2c3e50;
      padding: 20px;
      min-height: 100vh;
    }
    .keyboard {
      max-width: 1000px;
      margin: 0 auto;
      background: rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 20px;
      backdrop-filter: blur(10px);
    }
    .row {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .key {
      min-width: 50px;
      height: 50px;
      background: linear-gradient(145deg, #3498db, #2980b9);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      padding: 0 15px;
      transition: all 0.1s;
      box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    }
    .key:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    }
    .key:active {
      transform: translateY(1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .key.wide { min-width: 100px; }
    .key.extra-wide { min-width: 300px; }
    .key.special { background: linear-gradient(145deg, #e74c3c, #c0392b); }
    .title {
      text-align: center;
      color: white;
      margin-bottom: 20px;
      font-size: 24px;
    }
    .instructions {
      text-align: center;
      color: rgba(255,255,255,0.7);
      margin-top: 20px;
      font-size: 14px;
    }
  `;
}

function getKeyboardHTML() {
  const keys = [
    { row: ['1','2','3','4','5','6','7','8','9','0'] },
    { row: ['Q','W','E','R','T','Y','U','I','O','P'] },
    { row: ['A','S','D','F','G','H','J','K','L'] },
    { row: ['Z','X','C','V','B','N','M'] },
    { row: [
      { label: '@gmail.com', value: '@gmail.com', wide: true },
      { label: '+86', value: '+86' },
      { label: '.com', value: '.com' },
      { label: 'Space', value: ' ', extraWide: true },
      { label: '← Backspace', value: 'backspace', wide: true, special: true },
      { label: 'Enter ↵', value: 'enter', wide: true, special: true }
    ]}
  ];

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>OnScreen Keyboard</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <div class="keyboard">
        <h1 class="title">OnScreen Keyboard</h1>
  `;

  keys.forEach(keyRow => {
    html += '<div class="row">';
    keyRow.row.forEach(key => {
      if (typeof key === 'string') {
        html += `<button class="key" onclick="sendInput('${key.toLowerCase()}')">${key}</button>`;
      } else {
        const classes = ['key'];
        if (key.wide) classes.push('wide');
        if (key.extraWide) classes.push('extra-wide');
        if (key.special) classes.push('special');
        html += `<button class="${classes.join(' ')}" onclick="sendInput('${key.value}', ${key.special ? 'true' : 'false'})">${key.label}</button>`;
      }
    });
    html += '</div>';
  });

  html += `
        <p class="instructions">Click any key to type into the active window</p>
      </div>
      <script>
        async function sendInput(text, isSpecial = false) {
          try {
            const response = await fetch('/input', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, type: isSpecial ? 'special' : 'text' })
            });
            const result = await response.json();
            if (!result.success) {
              console.error('Input failed:', result.error);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }
      </script>
    </body>
    </html>
  `;

  return html;
}

const PORT = 3456;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║         OnScreen Keyboard Server Started               ║
╠════════════════════════════════════════════════════════╣
║  Open your browser to: http://localhost:${PORT}         ║
║                                                        ║
║  Click keys to type into any active window!            ║
╚════════════════════════════════════════════════════════╝
  `);
  
  const url = `http://localhost:${PORT}`;
  const platform = process.platform;
  let cmd;
  if (platform === 'darwin') cmd = `open "${url}"`;
  else if (platform === 'win32') cmd = `start "${url}"`;
  else cmd = `xdg-open "${url}"`;
  
  exec(cmd, (error) => {
    if (error) {
      console.log('Please manually open:', url);
    }
  });
});