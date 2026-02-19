const { app, BrowserWindow } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');

// ----------------------
// Background Processes
// ----------------------
let torPID;
let pyProcess;

// ----------------------
// Electron Window
// ----------------------
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#121212',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('electron/index.html');
  
  return win;
}

// ----------------------
// Tor Startup
// ----------------------
function startTor(win) {
  if (!win) return console.error('Window is undefined!');
  
  const daemonPath = path.join(__dirname, '..','python', 'tor', 'tor_daemon.py');
  pyProcess = spawn('python3', [daemonPath]);
  
  pyProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.startsWith("__TOR_PID__:")) {
        torPID = parseInt(line.split(":")[1], 10);
        continue;
      }

      if (line.includes("Bootstrapped 100%")) {
        win.webContents.send('tor-done');
      }

      win.webContents.send('python-output', line);
    }
  });

  pyProcess.stderr.on('data', (data) => console.error(data.toString()));  
}





app.on('before-quit', () => {
  if (torPID) process.kill(torPID);
  if (pyProcess) pyProcess.kill();
});

app.whenReady().then(() => {
  const win = createWindow();
  startTor(win);
});
