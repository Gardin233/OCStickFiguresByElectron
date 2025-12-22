import { app, BrowserWindow } from "electron";
import { Wdirname } from "../../../main.js";
import path, { join } from "path";
import { WindowCreateOptions } from "../../../types/window.js";
import { resourcesBase } from "../../../global.js";

export class windowController{
    public wins:Map<string,BrowserWindow>= new Map()
    constructor(){

    }
    public create(id:string,url:string,data:WindowCreateOptions){
      console.log("创建新窗体")
        const userWin = new BrowserWindow({
            width:data.width,
            height:data.height,
            x: data.x,
            y: data.y,
            frame: data.frame??true,
            transparent: false,           // 窗口透明
            // backgroundColor: 'transparent',
            hasShadow: false,
            skipTaskbar: false,           // 不显示任务栏
            focusable: true,             // 可聚焦（方便调试/交互）
            webPreferences: {
              contextIsolation: true,
              // sandbox: true,
              webSecurity: false,           // 关闭 web 安全（允许跨域、file:// 加载）
              nodeIntegration: false,
              preload: join(Wdirname,'preload.cjs') 
            }
          })
          const storyPagePath = path.join(resourcesBase, '..', 'story/page', url);
          userWin.loadFile(path.join(storyPagePath))
          userWin.setTitle(data.title)
          userWin.on('page-title-updated', (e) => {
            e.preventDefault();
          });
          this.wins.set(id,userWin)

    }
}