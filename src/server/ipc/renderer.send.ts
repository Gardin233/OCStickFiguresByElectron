import { win } from "../../main.js";

export function sendCreateNewSpineMessage(files:Record<string,string>){
    if (win && !win.isDestroyed() && win.webContents) {
         win.webContents.send("create-new-spine",files)
         console.log("主进程发送成功: create-new-spine"); // <--- 新增
    } else {
         console.error("主进程发送失败: 窗口不可用。"); // <--- 新增
    }
}