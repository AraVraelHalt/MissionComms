const { ipcMain } = require('electron');
const net = require('net');

/**
* Requests secure node info from server
*
* @returns promise for { nickname, country }
*/
function requestSecureNode() {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    client.connect(6000, '127.0.0.1', () => {
      client.write("JSCLIENTv2|getSecureNode");
    });

    client.on('data', (data) => {
      try {
        const json = JSON.parse(data.toString());
        resolve(json);
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
function registerSecureNodeHandler() {
  ipcMain.handle('get-secure-node', async () => {
    return await requestSecureNode();
  });
}

module.exports = {
  requestSecureNode,
  registerSecureNodeHandler
};
