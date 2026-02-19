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
    backgroundColor: '#121212'
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
    const output = data.toString().trim();
    if (!torPID) torPID = parseInt(output, 10);
    win.webContents.send('python-output', output);
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
