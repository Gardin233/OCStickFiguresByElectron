import { app, BrowserWindow, ipcMain, screen } from 'electron'

import { getDesktopIconPosition, openEXE } from './server/utils/desktop.js'
import { uIOhook } from 'uiohook-napi'
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import { convertToLocal } from './server/utils/position.js';
import { icon } from './types/desktop.js';
import { exec, execFile } from 'child_process';
import { stdout } from 'process';
let icons:icon[]=[] 
export let win: BrowserWindow | null = null
const __dirname = dirname(fileURLToPath(import.meta.url));

async function createWindow() {
  //创建窗体
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  win = new BrowserWindow({
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
      nodeIntegration: false,
      preload: join(__dirname,'preload.cjs') 
    }
  })
  console.log(process.versions.node);
  ipcMain.handle('open-exe', async (event, path: string) => {
    try {
      const result = await openEXE(path);
      return result;
    } catch (error) {
      throw error;
    }
  })
  ipcMain.on('open-desktop-icon',(event,name)=>{
    console.log("主进程已接收双击请求")
    console.log(name)
    // exe 路径
    const exePath = path.join(process.cwd(), "external", "openDesktopIcon.exe");
    // 启动子进程
    const child = execFile(exePath, (err, stdout, stderr) => {
    if (err) {
      console.error("执行失败:", err);
      return;
    }
    if (stdout) console.log("输出:", stdout);
    if (stderr) console.error("错误输出:", stderr);
  });  
  // let fixedName = name.replace(/ - 快捷方式$/, "");
  console.log(name)
  child.stdin.setDefaultEncoding('utf16le'); // 关键！
  child.stdin.write(name + "\n");

    
  })
    // 打开独立 DevTools 窗口
  win.webContents.openDevTools({ mode: 'detach' })
  win.setAlwaysOnTop(true, "screen-saver")

  // 加载前端页面
  const devServerUrl = process.env.VITE_DEV_SERVER_URL
  if (devServerUrl) {
    win.loadURL(devServerUrl)
  } else {
    win.loadFile(join(app.getAppPath(), 'dist', 'index.html'))
  }

  // 开发模式打开 DevTools
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools({ mode: 'detach' })
  }

  // 渲染完成后设置点击穿透，但允许前端自己处理模型点击
  win.once('ready-to-show', async() => {
    win.show()
    // 渲染层 PixiJS 需要自己做 hit test 来判断点击是否在模型上
    win.setIgnoreMouseEvents(true, { forward: true })
  })
  // 启动全局钩子
  uIOhook.start();
   icons =await getDesktopIconPosition()
    for(const item of icons){
      item.position =convertToLocal(win,item.position.x,item.position.y)
    }
    // console.log(icons)
   win.webContents.once('did-finish-load', () => {
  win.webContents.send('get-desktop-icons', icons)
});
  // 鼠标移动
  uIOhook.on('mousemove', event => {
    const pos = convertToLocal(win, event.x, event.y);
    win.webContents.send('global-mouse-move', { x: pos.x, y: pos.y });
  });
  // 鼠标点击
  uIOhook.on('mousedown', event => {
    const pos = convertToLocal(win, event.x, event.y);
    win.webContents.send('global-mouse-down', { x: pos.x, y: pos.y, button: event.button });
  });
  uIOhook.on('mouseup',event=>{
    const pos =convertToLocal(win,event.x,event.y)
  })
  // 键盘按键
  uIOhook.on('keydown', ev => {
    win.webContents.send('global-key-down', { keycode: ev.keycode, ctrl: ev.ctrlKey, alt: ev.altKey, shift: ev.shiftKey });
  });


}


// app 生命周期
app.whenReady().then(createWindow).then(() => {
  // openEXE('C:\\Windows\\System32\\notepad.exe')
//   setInterval(() => {

// }, 16); // 大约每帧发送一次 (60 FPS)
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
