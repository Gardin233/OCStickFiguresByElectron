import { BrowserWindow,screen } from "electron";
import { join } from "path";
import { Wdirname } from "../../../../main.js";
import { ServerIpcInit } from "../../../ipc/index.js";
export async function createWindow() {
  //创建窗体
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const win = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,           // 窗口透明
    // backgroundColor: 'transparent',
    hasShadow: false,
    alwaysOnTop: true,           // 保持在最上层
    skipTaskbar: true,           // 不显示任务栏
    focusable: false,             // 可聚焦（方便调试/交互）
    webPreferences: {
      contextIsolation: true,
      // sandbox: true,
      webSecurity: false,           // 关闭 web 安全（允许跨域、file:// 加载）
      nodeIntegration: false,
      preload: join(Wdirname,'preload.cjs') 
    }
  })
win.webContents.session.setPermissionCheckHandler(() => true);
win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': ['script-src \'self\' \'unsafe-eval\'; object-src \'self\'']
    }
  });
});
  console.log(process.versions.node);
  return win
    

}
export function setGlobalHooks(){  // 启动全局钩子
  //  console.log(icons)
  ServerIpcInit()

  }