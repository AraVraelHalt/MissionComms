const { ipcMain } = require('electron');
const net = require('net');

/**
* Registers IPC handler for connecting to peer
*
* @param {BrowserWindow}
*/
function registerInitConnListener(win) {
  ipcMain.handle('conn-to-peer', async (event, userInput) => {
    return new Promise((resolve) => {
      const client = net.createConnection({ host: '127.0.0.1', port: 6000 }, () => {
        client.write(`JSCLIENTv1|${userInput}`);
      });

      let finished = false;

      const cleanup = () => {
        if (!finished) {
          finished = true;
          client.destroy();
        }
      };

      client.on('data', (data) => {
        if (finished) return;

        const response = data.toString().trim();
        cleanup();

        if (response === 'VALID') {
          win.loadFile('electron/loading/loading.html');
          resolve('OK');
        } else {
          resolve('INVALID');
        }
      });

      client.on('error', (err) => {
        cleanup();
        resolve('INVALID');
      });

      client.on('end', cleanup);
      client.on('close', cleanup);
    });
  });
}

module.exports = { 
  registerInitConnListener 
};

