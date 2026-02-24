const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onPythonOutput: (callback) => ipcRenderer.on('python-output', callback),
  onTorDone: (callback) => ipcRenderer.on('tor-done', callback),
  onServerOutput: (callback) => ipcRenderer.on('server-output', callback),
  onServerStarted: (callback) => ipcRenderer.on('server-started', callback), 
  startHopping: () => ipcRenderer.send('start-hopping'),

  sendToServer: (userInput, callback) => {
    const channel = 'server-response';
    const listener = (event, response) => {
      callback(response);
      ipcRenderer.removeListener(channel, listener); // clean up
    };

    ipcRenderer.on(channel, listener);
    ipcRenderer.send('send-to-server', userInput);
  },
  
  // TOR INFO
  getSecureNode: async () => {
    return await ipcRenderer.invoke('get-secure-node');
  }
});

