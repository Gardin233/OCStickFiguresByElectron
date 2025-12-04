import { app, BrowserWindow, screen } from 'electron'

import { openEXE } from './server/utils/openApps.js'
import { uIOhook } from 'uiohook-napi'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

let win: BrowserWindow | null = null
const __dirname = dirname(fileURLToPath(import.meta.url));
// 获取窗口屏幕位置偏移 & 屏幕缩放
function convertToLocal(win, globalX, globalY) {
  const [winX, winY] = win.getPosition();
  const scale = win.webContents.getZoomFactor() * screen.getPrimaryDisplay().scaleFactor;

  return {
    x: (globalX - winX) / scale,
    y: (globalY - winY) / scale
  };
}
function createWindow() {
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
    focusable: true,             // 可聚焦（方便调试/交互）
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
  win.once('ready-to-show', () => {
    win.show()
    // true + forward，让非交互区域穿透桌面
    // 渲染层 PixiJS 需要自己做 hit test 来判断点击是否在模型上
    win.setIgnoreMouseEvents(true, { forward: true })
    //  win.setIgnoreMouseEvents(false)
  })

  // 启动全局钩子
  uIOhook.start();

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
