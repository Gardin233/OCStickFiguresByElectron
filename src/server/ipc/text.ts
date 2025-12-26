import { win } from "../../main.js";

export class TextSender{
    constructor(){}    
    public static create(id:string,content:string,style:any,trans:any){
        win.webContents.send("create-common-text",id,content,style,trans)
    }
    public static setPos(id:string,x:number,y:number){
        win.webContents.send("set-common-pos",id,x,y)
    }
    public static setStyle(id:string,style:any){
        win.webContents.send("set-common-style",id,style)
    }
    public static setContent(id:string,content:string){
        win.webContents.send("set-common-content",id,content)
    }
    public static setScale(id:string,scaleX:number,scaleY:number){
        win.webContents.send("set-common-scale",id,scaleX,scaleY)
    }
    public static setRotation(id:string,rotation:number){
        win.webContents.send("set-common-rotation",id,rotation)
    }
    public static remove(id:string){
        win.webContents.send("remove-common-text",id)
    }
}