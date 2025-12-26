import { win } from "../../main.js";

export class BitTextSender{
    constructor(){}
    public static sendLoadFont(id:string,url:string){
        win.webContents.send("load-font",id,url)
    }
    public static create(id:string,content:string,style:any,trans:any){
        win.webContents.send("create-bit-text",id,content,style,trans)
    }
    public static setPos(id:string,x:number,y:number){
        win.webContents.send("set-bit-pos",id,x,y)
    }
    public static setStyle(id:string,style:any){
        win.webContents.send("set-bit-style",id,style)
    }
    public static setContent(id:string,content:string){
        win.webContents.send("set-bit-content",id,content)
    }
    public static setScale(id:string,scaleX:number,scaleY:number){
        win.webContents.send("set-bit-scale",id,scaleX,scaleY)
    }
    public static setRotation(id:string,rotation:number){
        win.webContents.send("set-bit-rotation",id,rotation)
    }
    public static remove(id:string){
        win.webContents.send("remove-bit-text",id)
    }
}