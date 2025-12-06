const { contextBridge, ipcRenderer } = require('electron')
/**
 * @param path {string} exe path
 */
contextBridge.exposeInMainWorld('electronAPI', {
  openEXE: (path) => ipcRenderer.invoke('open-exe', path),

  onGlobalMouseMove: (callback) => {
    ipcRenderer.on('global-mouse-move', (_, pos) => callback(pos))
  },

  onGlobalMouseDown: (callback) => {
    ipcRenderer.on('global-mouse-down', (_, info) => callback(info))
  },
  onGlobalMouseUp: (callback) => {
    ipcRenderer.on('global-mouse-up', (_, info) => callback(info))
  },

  onGlobalKeyDown: (callback) => {
    ipcRenderer.on('global-key-down', (_, ev) => callback(ev))
  },
  onGlobalKeyUp: (callback) => {
    ipcRenderer.on('global-key-up', (_, ev) => callback(ev))
  },
  
  getDesktopIcons: (callback)=> {
      ipcRenderer.on('get-desktop-icons', (_, icons) => callback(icons))
  },
  openDesktopIcon: (name) => {
      ipcRenderer.send('open-desktop-icon', name);
    }
})
