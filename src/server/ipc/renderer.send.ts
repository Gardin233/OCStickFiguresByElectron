import { win } from "../../main.js";

export function sendCreateNewSpineMessage(files:Record<string,string>,id:string){
    if (win && !win.isDestroyed() && win.webContents) {
         win.webContents.send("create-new-spine",files,id)
         console.log("主进程发送成功: create-new-spine"); // <--- 新增
    } else {
         console.error("主进程发送失败: 窗口不可用。"); // <--- 新增
    }
}
export function sendDeleteSpine(id:string){
     if (win && !win.isDestroyed() && win.webContents) {
         win.webContents.send("delete-spine",id)
         console.log("主进程发送成功: create-new-spine"); // <--- 新增
    } else {
         console.error("主进程发送失败: 窗口不可用。"); // <--- 新增
    }
}
//TODO
export function sendSetPos(id:string,x:number,y:number){
     win.webContents.send('set-pos',id,x,y)
}
export function sendFlip(id:string,isLeft:boolean){
     win.webContents.send("flip",id,isLeft)
}
export function sendPlayAnimation(id:string,layer:string,animation:string,isLoop:string){
     win.webContents.send("play-animation",id,layer,animation,isLoop)
}
export function sendMoveTo(id:string,x:number,y:number,func:string){
     win.webContents.send("move-to",id,x,y,func)
}
export function sendShowHitBox(id:string){
     win.webContents.send('show-hit-box',id)
}
export async function sendGetHitBox(id:string){
     win.webContents.send('get-hit-box',id)
}
export async function sendGetcheckHit(id:string,x:number,y:number) {
     win.webContents.send('check-hit-box',id,x,y)
}
export async function sendGetPosToHitBoxDistance(id:string,x:number,y:number) {
    console.log("发送距离请求")
     win.webContents.send("get-pos-to-hit-box-distance",id,x,y)
}