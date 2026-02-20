const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onPythonOutput: (callback) => ipcRenderer.on('python-output', callback),
  onTorDone: (callback) => ipcRenderer.on('tor-done', callback),
  onServerOutput: (callback) => ipcRenderer.on('server-output', callback),
  onServerStarted: (callback) => ipcRenderer.on('server-started', callback), 
  startHopping: () => ipcRenderer.send('start-hopping')
});

