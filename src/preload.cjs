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
  sendGetHitBox:(id,data)=>{
    ipcRenderer.send('send-get-hit-box',id,data)
  },
  showHitBox:(callback)=>{ipcRenderer.on('show-hit-box',(_,id)=>callback(id))},
  //
  checkHit:(callback)=>{
     ipcRenderer.on('check-hit-box',(_,id,x,y)=>callback(id,x,y))
  },
  sendCheckHit:(id,data)=>{
    ipcRenderer.send('send-check-hit',id,data)
  },
  //
  getPosToHitboxDistance:(callback)=>{
     ipcRenderer.on('get-pos-to-hit-box-distance',(_,id,x,y)=>callback(id,x,y))
  },
  sendGetPosToHitBoxDistance:(id,data)=>{
    ipcRenderer.send('send-get-pos-to-hit-box-distance',id,data)
  },

  playAnimation:(callback)=>{
    ipcRenderer.on('play-animation',(_,id,layer,animation,isloop)=>callback(id,layer,animation,isloop))
  },
  setPos:(callback)=>{
    ipcRenderer.on('set-pos',(_,id,x,y)=>callback(id,x,y))
  },
  moveTo:(callback)=>{
    ipcRenderer.on('move-to',(_,id,x,y,func)=>callback(id,x,y,func))
  },
  flip:(callback)=>{
    ipcRenderer.on('flip',(_,id,isLeft)=>callback(id,isLeft))
  }
  }
  
})
