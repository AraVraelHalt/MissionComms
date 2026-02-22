const { app, BrowserWindow } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');

// ----------------------
// Background Processes
// ----------------------
let torPID;
let pyProcess;
let serverProcess;

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

  win.loadFile('electron/hopper/hopping.html');
  
  return win;
}

// ----------------------
// Tor Startup
// ----------------------
function startTor(win) {
  return new Promise((resolve, reject) => {
    if (!win) return reject(new Error('Window is undefined!'));

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
          resolve(); 
        }

        win.webContents.send('python-output', line);
      }
    });

    pyProcess.stderr.on('data', (data) => console.error(data.toString()));
    pyProcess.on('exit', (code) => {
      reject(new Error(`Tor process exited with code ${code}`));
    });
  });
}

// ----------------------
// Server Startup
// ----------------------
function startServer(win) {
  const serverPath = path.join(__dirname, '..', 'python', 'server.py');
  serverProcess = spawn('python3', [serverPath]);

  serverProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log('[Server]', output);
    win.webContents.send('server-output', output);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error('[Server Error]', data.toString());
  });

  win.webContents.send('server-started');
}

// ----------------------
// Application
// ----------------------
app.on('before-quit', () => {
  if (torPID) process.kill(torPID);
  if (pyProcess) pyProcess.kill();
  if (serverProcess) serverProcess.kill();
});

app.whenReady().then(async () => {
  const win = createWindow();
  await startTor(win);
  startServer(win);
  win.loadFile('electron/main_frame/main_frame.html');
});
