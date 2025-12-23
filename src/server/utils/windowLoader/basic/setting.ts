import { app,  BrowserWindow } from "electron"
import { join } from "path"

export async function setWindow(win:BrowserWindow){
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
  if (process.env.NODE_ENV === 'development'&&!app.isPackaged) {
    win.webContents.openDevTools({ mode: 'detach' })
  }
  // 渲染完成后设置点击穿透，但允许前端自己处理模型点击
  win.once('ready-to-show', async() => {
    win.show()
    // 渲染层 PixiJS 需要自己做 hit test 来判断点击是否在模型上
    win.setIgnoreMouseEvents(true, { forward: true })
  })


}