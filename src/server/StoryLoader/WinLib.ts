import { lua } from "./StoryLoader.js";
import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { WindowCreateOptions } from "../../types/window.js";
import { wc } from "../../main.js";
export class WindowLib{
        private funcNames:{name:string,func:Function}[]=[]
        L: any;
        constructor(L){
            this.L =L
            this.funcNames = [
                 {name:"createNewWindow",func:this.createNewWindow.bind(this)},
                
            ];
        }
        public Init(){
            lua.lua_newtable(this.L); // 创建 table 
            for(const item of this.funcNames){
                lua.lua_pushcfunction(this.L, item.func); 
                lua.lua_setfield(this.L,-2, item.name);
            }
            // 将 table 注册到 Lua
            lua.lua_setglobal(this.L, "Gwin"); 
        }

        private createNewWindow(L){
        const id =interop.tojs(L,1)
        const url=interop.tojs(L,2)
        const Ldata=interop.tojs(L,3)
        const data:WindowCreateOptions={
            width: Ldata.get('width'),             // 默认值可内部设置
            height: Ldata.get('height'),
            x: Ldata.get('x'),
            y: Ldata.get('y'),
            title: Ldata.get('title'),
            frame: Ldata.get('frame'),           
            transparent: Ldata.get('transparent'),       // 窗口透明
            skipTaskbar: Ldata.get('skipTaskbar'),        // 跳过任务栏
            fullscreen: Ldata.get('fullscreen'),
            resizable: Ldata.get('resizable')
        }
        wc.create(id,url,data)
        return 0
    }
}