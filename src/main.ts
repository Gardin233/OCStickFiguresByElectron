import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { getDesktopIconPosition } from './server/utils/desktop.js'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { convertToLocal } from './server/utils/position.js';
import { icon } from './types/desktop.js';
import { startGlobalHooks } from './server/hooks/uiohook.js';
import { setupDesktopHandler } from './server/ipc/desktop.handler.js';
import { setExeHandler } from './server/ipc/exe.handler.js';
import { setScreenHandler } from './server/ipc/filter.handler.js';
export let icons:icon[]=[] 
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
   
  //  console.log(icons)
   
  startGlobalHooks()
  setupDesktopHandler()
  setExeHandler()
  setScreenHandler()
    // console.log(icons)
ipcMain.handle('get-desktop-icons', async () => {
  icons =await getDesktopIconPosition()
   for(const item of icons){
      item.position =convertToLocal(win,item.position.x,item.position.y)
    }
  return icons;
})
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

