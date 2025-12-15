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
  //
  getHitBox:(callback)=>{
  ipcRenderer.on('get-hit-box',(_,id)=>callback(id))
  },
  sendGetHitBox:(data)=>{
    ipcRenderer.send('send-get-hit-box',data)
  },
  showHitBox:(callback)=>{
    ipcRenderer.on('show-hit-box',(_,id)=>callback(id))
  },
  //
  checkHit:(callback)=>{
     ipcRenderer.on('check-hit-box',(_,id,x,y)=>callback(id,x,y))
  },
  sendCheckHit:(data)=>{
    ipcRenderer.on('send-check-hit',data)
  },
  //
  getPosToHitboxInstance:(callback)=>{
     ipcRenderer.on('get-pos-to-hit-box-instance',(_,id,x,y)=>callback(id,x,y))
  },
  sendGetPosToHitBoxInstance:(data)=>{
    ipcRenderer.on('send-get-pos-to-hit-box-instance',data)
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
