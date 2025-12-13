const { contextBridge, ipcRenderer } = require('electron')
/**
 * @param path {string} exe path
 */
contextBridge.exposeInMainWorld('electronAPI', {
  openEXE: (path) => ipcRenderer.invoke('open-exe', path),
  createNewSpine:(callback)=>{
    ipcRenderer.on("create-new-spine",(_,files,id)=>callback(files,id))
  },
  deleteSpine:(callback)=>{
    ipcRenderer.on("delete-spine",(_,id)=>callback(id))
  },
  getDesktopIcons: ()=> ipcRenderer.invoke('get-desktop-icons'),
  openDesktopIcon: (name) => {
      ipcRenderer.send('open-desktop-icon', name);
  },
  changeScreenFilter:(type)=>{
    ipcRenderer.send('change-screen-filter', type);
  }
})
