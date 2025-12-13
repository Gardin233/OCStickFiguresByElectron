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