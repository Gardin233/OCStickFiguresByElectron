import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lauxlib, lua } from "./StoryLoader.js";
import { getOrCreateScreenFilterProcess } from "../process/screeenFilter.js";
import { getDesktopIconPosition, openEXE } from "../utils/desktop.js";
import { getOrCreateDeskTopOpnerProcess } from "../process/exeOpner.js";
import { useExternalforSingle } from "../process/Input.js";

import { getDesktopIconPosAsync } from "../Async/getDesktopIconPosAsync.js";

/**
 * @class WindowLib Win系统库。用于操纵window系统的交互
 */
export class WindowLib{
    private funcNames:{name:string,func:Function}[]=[]
    L: any;
    constructor(L){
        this.L =L
        this.funcNames = [
            {name:"demofunc", func: this.testfunc.bind(this) },
            {name:"applyScreenFilter",func:this.applyScreenFilterFromLua.bind(this)},
            {name:"openExe",func:this.openEXE.bind(this)},
            {name:'openDesktopIcon',func:this.openDesktopIcon.bind(this)},
            {name:"getDesktopIconPos",func:this.openDesktopIcon.bind(this)},
        ];
    }
    public Init(){
        lua.lua_newtable(this.L); // 创建 table 
        for(const item of this.funcNames){
            lua.lua_pushcfunction(this.L, item.func); 
            lua.lua_setfield(this.L,-2, item.name);
        }
        // 将 table 注册到 Lua
        lua.lua_setglobal(this.L, "Gwin"); //Gwin={}
    }
    private testfunc(L){
        // 定义你想注入的 JS 函数 (使用 Lua C API 格式)
        // 注意：这次我们重新引入 interop 的部分功能，但仍然使用 C-style 结构   
        // 读取参数 
        // 使用 interop 的 tojs 工具，确保将栈索引 1 的内容正确转换为 JS 类型
        const msg = interop.tojs(L, 1); 
        console.log("【JS C-API Final 尝试】Lua 正在调用我:", msg);
        // --- 步骤 2: 构建并推入返回值 ---
        const response_msg = "我是来自 Electron 的最终返回值: " + msg;
        // 使用 interop.push 将 JS 字符串推入 Lua 栈
        // 这种方法比 lua.lua_pushlstring 更加健壮，能确保类型正确
        interop.push(L, response_msg); 
        // --- 步骤 3: 返回值数量 ---
        // C 函数的职责是返回推入栈的返回值数量
        return 1; 
    }; 
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
    };
    
}
