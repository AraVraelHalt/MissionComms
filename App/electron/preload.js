const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onPythonOutput: (callback) => ipcRenderer.on('python-output', callback),
  onTorDone: (callback) => ipcRenderer.on('tor-done', callback),
  onServerOutput: (callback) => ipcRenderer.on('server-output', callback),
  onServerStarted: (callback) => ipcRenderer.on('server-started', callback), 
  startHopping: () => ipcRenderer.send('start-hopping'),

  connToPeer: (value) => ipcRenderer.invoke('conn-to-peer', value),

  cancelPeerConn: () => ipcRenderer.invoke('cancel-peer-conn'), 

  // TOR INFO
  getSecureNode: async () => {
    return await ipcRenderer.invoke('get-secure-node');
  }
});

