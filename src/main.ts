process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { getDesktopIconPosition } from './server/utils/desktop.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { convertToLocal } from './server/utils/position.js';
import { icon } from './types/desktop.js';
import { createWindow, setGlobalHooks } from './server/utils/windowLoader/basic/basicWindow.js';
import { setWindow } from './server/utils/windowLoader/basic/setting.js';
import { lua, StoryLoader } from './server/StoryLoader/StoryLoader.js';

export let SYS_ICONS:icon[]=[] 
export let win: BrowserWindow | null = null
export const Wdirname = dirname(fileURLToPath(import.meta.url));
async function Start() {
  win =await createWindow()
 
  setWindow(win)
  setGlobalHooks()
  win.webContents.once("did-finish-load",()=>{
 
  const story =new StoryLoader()
  story.Init()
  story.run()
}) 

ipcMain.handle('get-desktop-icons', async () => {
    SYS_ICONS =await getDesktopIconPosition()
    for(const item of SYS_ICONS){
      item.position =convertToLocal(win,item.position.x,item.position.y)
    }
    return SYS_ICONS;
  })
}

// app 生命周期
app.whenReady().then(Start).then(() => {
  // openEXE('C:\\Windows\\System32\\notepad.exe')
//   setInterval(() => {
// }, 16); // 大约每帧发送一次 (60 FPS)

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) Start()
})

