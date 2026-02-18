const { app, BrowserWindow } = require('electron');
const startTor = require("./launch_tor");
const startServer = require("./launch_server");

// ----------------------
// Background Proccesses
// ----------------------
const torProcess = startTor();
const serverProcess = startServer();

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
}

app.whenReady().then(createWindow);

// ----------------------
// Kill
// ----------------------
app.on("will-quit", () => {
  torProcess.kill();
  serverProcess.kill();
});
