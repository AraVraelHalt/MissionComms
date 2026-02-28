const { ipcMain } = require('electron');
const net = require('net');

/**
* Registers IPC handler for canceling connection
* to peer
*
* @param {BrowserWindow}
* @param {port}
* @param {host}
*/
function cancelPeerConnection(win, PORT=6000, HOST="127.0.0.1") {
  return new Promise((resolve, reject) => {
    
    const client = new net.Socket();

    client.connect(PORT, HOST, () => {
      client.write("JSCLIENTv2|cancelPeerConn");
    });

    client.on('data', (data) => {
      try {
        const response = data.toString().trim();
        if (win.webContents.navigationHistory.canGoBack()) {
          win.webContents.navigationHistory.goBack();
        }
        resolve(response);
      } catch (err) {
        reject(err);
      } finally {
        client.destroy(); // clean up
      }
    });
 
    client.on('error', (err) => reject(err));

  });
}

/**
* Registers the IPC handler with Electron main process
*/
function registerCancelConnHandler(win) {
  ipcMain.handle('cancel-peer-conn', async () => {
    return await cancelPeerConnection(win);
  });
}

module.exports = {
  cancelPeerConnection,
  registerCancelConnHandler
};

