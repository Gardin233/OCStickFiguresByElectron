const { contextBridge, ipcRenderer } = require('electron')
/**
 * @param path {string} exe path
 */
contextBridge.exposeInMainWorld('electronAPI', {
  character:{
    //TODO:
  createNewSpine:(callback)=>{
    ipcRenderer.on("create-new-spine",(_,files,id)=>callback(files,id))
  },
  deleteSpine:(callback)=>{
    ipcRenderer.on("delete-spine",(_,id)=>callback(id))
  },
  getHitBox:(id)=>{
   return ipcRenderer.invoke('get-hit-box',id)
  },
  showHitBox:(callback)=>{
    ipcRenderer.on('show-hit-box',(_,id)=>callback(id))
  },
  checkHit:(id,x,y)=>{
    return ipcRenderer.invoke('check-hit-box',id,x,y)
  },
  getPosToHitboxInstance:(id,x,y)=>{
    return ipcRenderer.invoke('get-pos-to-hit-box',id,x,y)
  },
  
  playAnimation:(callback)=>{
    ipcRenderer.on('play-animation',(_,id,layer,animation,isloop)=>callback(id,layer,animation,isloop))
  },
  setPos:(callback)=>{
    ipcRenderer.on('set-pos',(_,id,x,y)=>callback(id,x,y))
  },
  moveTo:(id,x,y,func)=>{
    ipcRenderer.on('move-to',id,x,y,func)
  },
  flip:(id,isLeft)=>{
    ipcRenderer.on('flip',id,isLeft)
  }
  }
  
})
