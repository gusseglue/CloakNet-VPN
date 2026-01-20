const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Key validation
  validateKey: (key) => ipcRenderer.invoke('validate-key', key),
  
  // VPN connection
  connect: (key) => ipcRenderer.invoke('connect', key),
  disconnect: () => ipcRenderer.invoke('disconnect'),
  
  // Status
  getStatus: () => ipcRenderer.invoke('get-status'),
  
  // Settings
  clearSavedKey: () => ipcRenderer.invoke('clear-saved-key'),
  
  // Window controls
  minimize: () => ipcRenderer.send('minimize'),
  close: () => ipcRenderer.send('close'),
  
  // Events
  onRequestConnect: (callback) => ipcRenderer.on('request-connect', callback)
});
