import { win } from "../../main.js";
export class CharacterIPCSender{
 constructor() {}
     static sendCreateNewSpineMessage(files:Record<string,string>,id:string){
          if (win && !win.isDestroyed() && win.webContents) {
               win.webContents.send("create-new-spine",files,id)
               console.log("主进程发送成功: create-new-spine"); 
          } else {
               console.error("主进程发送失败: 窗口不可用。"); 
          }
     }
     static sendDeleteSpine(id:string){
          if (win && !win.isDestroyed() && win.webContents) {
          win.webContents.send("delete-spine",id)
          console.log("主进程发送成功: create-new-spine"); 
          } else {
               console.error("主进程发送失败: 窗口不可用。"); 
          }
     }

     static sendSetPos(id:string,x:number,y:number){
          win.webContents.send('set-pos',id,x,y)
     }
     static sendFlip(id:string,isLeft:boolean){
          win.webContents.send("flip",id,isLeft)
     }
     static sendPlayAnimation(id:string,layer:string,animation:string,isLoop:string){
          win.webContents.send("play-animation",id,layer,animation,isLoop)
     }
     static sendMoveTo(id:string,x:number,y:number,func:string){
          win.webContents.send("move-to",id,x,y,func)
     }
     static sendShowHitBox(id:string){
          win.webContents.send('show-hit-box',id)
     }
     static async  sendGetHitBox(id:string){
          win.webContents.send('get-hit-box',id)
     }
     static async sendGetcheckHit(id:string,x:number,y:number) {
          win.webContents.send('check-hit-box',id,x,y)
     }
     static async sendGetPosToHitBoxDistance(id:string,x:number,y:number) {
          console.log("发送距离请求")
          win.webContents.send("get-pos-to-hit-box-distance",id,x,y)
     }
}
