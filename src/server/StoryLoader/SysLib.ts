import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lauxlib, lua } from "./StoryLoader.js";
import { getOrCreateScreenFilterProcess } from "../process/screeenFilter.js";
import { openEXE } from "../utils/desktop.js";
import { useExternalforSingle } from "../process/Input.js";
import { getDesktopIconPosAsync } from "../Async/Desktop.js";
import { wc, win } from "../../main.js";
import { convertToLocal } from "../utils/position.js";
import { screen } from "electron";

/**
 * @class SysLib 系统库。用于操纵系统的交互
 */
export class SysLib{
    private funcNames:{name:string,func:Function}[]=[]
    L: any;
    constructor(L){
        this.L =L
        this.funcNames = [
            {name:"applyScreenFilter",func:this.applyScreenFilterFromLua.bind(this)},
            {name:"openExe",func:this.openEXE.bind(this)},
            {name:'openDesktopIcon',func:this.openDesktopIcon.bind(this)},
            {name:"getDesktopIconPos",func:this.openDesktopIcon.bind(this)},
            {name:"getScreenSize",func: this.getScreenSize.bind(this)},
        ];
    }
    public Init(){
        lua.lua_newtable(this.L); // 创建 table 
        for(const item of this.funcNames){
            lua.lua_pushcfunction(this.L, item.func); 
            lua.lua_setfield(this.L,-2, item.name);
        }
        // 将 table 注册到 Lua
        lua.lua_setglobal(this.L, "Gsys"); //Gsys={}
    }
    private applyScreenFilterFromLua(L) {
        const filter =interop.tojs(L,1)
        useExternalforSingle(filter,()=>getOrCreateScreenFilterProcess())
        return 0
    }
    private openEXE(L) {
        const url =interop.tojs(L,1)
        openEXE(url)
        return 0
    }
    private openDesktopIcon(L){
        return getDesktopIconPosAsync(L);
    }
    private getScreenSize(L){
        const {width,height} = screen.getPrimaryDisplay().size
        console.log(width,height)
        const canvasPos = convertToLocal(win,width,height)
        interop.push(L,{width:canvasPos.x,height:canvasPos.y})
        return 1
    }
    
}
