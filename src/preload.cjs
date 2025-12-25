const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  close:()=>{ipcRenderer.send(`win:close`)},
  minimize:()=>{ipcRenderer.send(`win:minimize`)},
  toggleMaximize:()=>{ipcRenderer.send(`win:toggle-maximize`)},
  character:{
    //创建与删除角色
    createNewSpine:(callback)=>{ipcRenderer.on("create-new-spine",(_,files,id)=>callback(files,id))},
    deleteSpine:(callback)=>{ipcRenderer.on("delete-spine",(_,id)=>callback(id))},
    //获取碰撞箱
    getHitBox:(callback)=>{ipcRenderer.on('get-hit-box',(_,id)=>callback(id))},
    sendGetHitBox:(id,data)=>{ipcRenderer.send('send-get-hit-box',id,data)},
    //显示碰撞箱
    showHitBox:(callback)=>{ipcRenderer.on('show-hit-box',(_,id)=>callback(id))},
    //检查点击碰撞
    checkHit:(callback)=>{ipcRenderer.on('check-hit-box',(_,id,x,y)=>callback(id,x,y))},
    sendCheckHit:(id,data)=>{ipcRenderer.send('send-check-hit',id,data)},
    //获取点到碰撞箱距离
    getPosToHitboxDistance:(callback)=>{ipcRenderer.on('get-pos-to-hit-box-distance',(_,id,x,y)=>callback(id,x,y))},
    sendGetPosToHitBoxDistance:(id,data)=>{ipcRenderer.send('send-get-pos-to-hit-box-distance',id,data)},
    //播放动画
    playAnimation:(callback)=>{ipcRenderer.on('play-animation',(_,id,layer,animation,isloop)=>callback(id,layer,animation,isloop))},
    //设置坐标点
    setPos:(callback)=>{ipcRenderer.on('set-pos',(_,id,x,y)=>callback(id,x,y))},
    //移动
    moveTo:(callback)=>{ipcRenderer.on('move-to',(_,id,x,y,func)=>callback(id,x,y,func))},
    //翻转
    flip:(callback)=>{ipcRenderer.on('flip',(_,id,isLeft)=>callback(id,isLeft))}
  },
  text:{
    createText:(callback)=>{ipcRenderer.on('create-text',(_,id,content,style)=>callback(id,content,style))},
    deleteText:(callback)=>{ipcRenderer.on('delete-text',(_,id)=>callback(id))},
    setText:(callback)=>{ipcRenderer.on('set-text',(_,id,content)=>callback(id,content))},
    setStyle:(callback)=>{ipcRenderer.on('set-style',(_,id,style)=>callback(id,style))}
  }
})
