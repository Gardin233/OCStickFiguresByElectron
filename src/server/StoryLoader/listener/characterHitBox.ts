import { ipcMain } from "electron";
export class characteHitBox{

constructor(){   
    ipcMain.on("send-get-pos-to-hit-box-instance",(data)=>{
    console.log(data)  
    })
    ipcMain.on("send-check-hit",(data)=>{
        console.log(data)
    })
    ipcMain.on("send-get-hit-box",(data)=>{
        console.log(data)
    })
}
}