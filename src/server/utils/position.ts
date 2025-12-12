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
//取真实坐标
export function localToConvert(win:BrowserWindow,screenX:number,screenY:number){
  const [winX, winY] = win.getPosition();
  const scale = win.webContents.getZoomFactor() * screen.getPrimaryDisplay().scaleFactor;
  return{
    x:screenX*scale+winX,
    y:screenY*scale+winY
}
}//两点距离计算
export function pointToSegmentDistance(px: number, py: number,
                               x1: number, y1: number,
                               x2: number, y2: number): number {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

