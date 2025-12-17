import { BrowserWindow,screen } from "electron";
// 获取窗口屏幕位置偏移 & 屏幕缩放
export function convertToLocal(win:BrowserWindow, globalX:number, globalY:number) {
  const [winX, winY] = win.getPosition();
  const scale = win.webContents.getZoomFactor() * screen.getPrimaryDisplay().scaleFactor;

  return {
    x: (globalX - winX) / scale,
    y: (globalY - winY) / scale
  };
}
//获取web坐标
export function localToConvert(win:BrowserWindow,screenX:number,screenY:number){
  const [winX, winY] = win.getPosition();
  const scale = win.webContents.getZoomFactor() * screen.getPrimaryDisplay().scaleFactor;
  return{
    x:screenX*scale+winX,
    y:screenY*scale+winY
}
}