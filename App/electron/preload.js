const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onPythonOutput: (callback) => ipcRenderer.on('python-output', callback),
  onTorDone: (callback) => ipcRenderer.on('tor-done', callback),
  startHopping: () => ipcRenderer.send('start-hopping')
});

