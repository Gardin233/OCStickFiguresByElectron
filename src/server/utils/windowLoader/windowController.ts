import { app, BrowserWindow, ipcMain } from "electron";
import { Wdirname } from "../../../main.js";
import path, { join } from "path";
import { WindowCreateOptions } from "../../../types/window.js";
import { resourcesBase } from "../../../global.js";
export class windowController{
    public wins:Map<string,BrowserWindow>= new Map()
    constructor(){
      ipcMain.on('win:close', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        win?.close()
      })
      ipcMain.on('win:minimize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        win?.minimize()
      })
      ipcMain.on('win:toggle-maximize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) return
        win.isMaximized() ? win.unmaximize() : win.maximize()
      })
    }
    public create(id:string,url:string,data:WindowCreateOptions){
      if(this.wins.has(id)){
        console.log("id冲突")
        return
      }
      console.log("创建新窗体")
      const userWin = new BrowserWindow({
        width:data.width,
        height:data.height,
        x: data.x,
        y: data.y,
        frame: data.frame??true,
        transparent: data.transparent??false,           // 窗口透明
        resizable: data.resizable??true,           // 窗口大小可调整
        // backgroundColor: 'transparent',
        fullscreen: data.fullscreen??false,           // 全屏
        hasShadow: false,
        skipTaskbar: data.skipTaskbar??false,           // 不显示任务栏
        focusable: true,             // 可聚焦（方便调试/交互）
        webPreferences: {
          contextIsolation: true,
          // sandbox: true,
          webSecurity: false,           // 关闭 web 安全（允许跨域、file:// 加载）
          nodeIntegration: false,
          preload: join(Wdirname,'preload.cjs') 
        }
      })
      this.wins.set(id,userWin)
      const storyPagePath = path.join(resourcesBase, '..', 'story/page', url);
      userWin.loadFile(path.join(storyPagePath))
      userWin.on('page-title-updated', (e) => {
          e.preventDefault();
      });
      if (data.title) {
        userWin.setTitle(data.title)   
      }
    }
    public setPos(id:string,x:number,y:number){
      if(!this.wins.has(id))return
      const w =this.wins.get(id)
      const bounds = w.getBounds(); // 获取当前 width 和 height
      w.setBounds({x:x,y:y,height:bounds.height,width:bounds.width})
    }
    public setSize(id:string,height:number,width:number){
      if(!this.wins.has(id))return
      const w =this.wins.get(id)
      const bounds = w.getBounds(); // 获取当前 width 和 height
      w.setBounds({x:bounds.x,y:bounds.y,height:height,width:width})
    }
}