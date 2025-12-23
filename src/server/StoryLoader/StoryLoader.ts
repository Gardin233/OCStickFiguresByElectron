import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { WindowLib } from "./WinLib.js";
import { CharacterLib } from "./Character.js";
import { InputManager } from "./listener/uiohook.js";
import { AudioLib } from "./AudioLib.js";
import { TimeManager } from "./listener/time.js";

import { to_luastring } from "fengari";
import { SysLib } from "./SysLib.js";

export const lua = fengari.lua;
export const lauxlib = fengari.lauxlib;
export const lualib = fengari.lualib;
export class StoryLoader{
    private L = lauxlib.luaL_newstate();
    private characterLib:CharacterLib
    private windowLib:WindowLib
    private audioLib:AudioLib
    private inputMgr:InputManager
    private timeMgr:TimeManager
    private SysLib:SysLib
    constructor(){
        this.SysLib = new SysLib(this.L)
        this.windowLib=new WindowLib(this.L)
        this.characterLib=new CharacterLib(this.L)
        this.audioLib= new AudioLib(this.L)
        this.inputMgr = new InputManager(this.L);
        this.timeMgr =new TimeManager(this.L)
        lualib.luaL_openlibs(this.L);//打开 Lua 标准库 (print, math, string 等)
        interop.luaopen_js(this.L);//启用 JS 互操作库 (关键步骤) 这让 Lua 可以理解 JS 的对象和函数
        this.L.global
    }
    public Init(){
        this.SysLib.Init()
        this.windowLib.Init()
        this.characterLib.Init()
        this.audioLib.Init()
        this.inputMgr.start();
        this.timeMgr.start()
    }
    // 示例调用
    public run(){
        const luaFilePath = path.resolve(path.dirname("./"), "./story/src/index.lua");
        try {
            //执行 Lua 代码
            const status = lauxlib.luaL_dofile(this.L, luaFilePath);
            // 检查是否有语法错误
            if(status !== lua.LUA_OK) {
                const errorMsg = lua.lua_tojsstring(this.L, -1);
                console.error("Lua 运行错误:", errorMsg);
            }
        } catch (err) {
            console.error("文件读取失败:", err);
        }
    }
}