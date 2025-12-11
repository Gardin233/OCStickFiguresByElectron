import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lauxlib, lua } from "./StoryLoader.js";
import { getOrCreateScreenFilterProcess } from "../process/screeenFilter.js";
export class WindowLib{
    public libNames:{name:string,func:Function}[]=[]
    L: any;
    constructor(L){
        this.L =L
        this.libNames = [
            { name: "demofunc", func: this.changeScreenFilter.bind(this) },
            {name:"applyScreenFilter",func:this.applyScreenFilterFromLua.bind(this)}
        ];
    }
    public Init(){
        // 创建 table
        lua.lua_newtable(this.L); // Window table
        for(const item of this.libNames){
            lua.lua_pushcfunction(this.L, item.func); 
            lua.lua_setfield(this.L,-2, item.name);
        }
        // 将 table 注册到 Lua
        lua.lua_setglobal(this.L, "GWin"); // Window = {...}
    }
    public changeScreenFilter(L){
        // --- 注入环节开始：使用 Lua C-API 方式 ---
        // 4. 定义你想注入的 JS 函数 (使用 Lua C API 格式)
        // 注意：这次我们重新引入 interop 的部分功能，但仍然使用 C-style 结构   
        // --- 步骤 1: 读取参数 ---
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
    // 在主进程：提供给 Lua 调用的接口
    public applyScreenFilterFromLua(f) {
        const filter =interop.tojs(f,1)
        const p = getOrCreateScreenFilterProcess();
          // 直接写入命令 + 换行（子进程应循环读取 stdin）
        if (p.stdin && !p.stdin.destroyed) {
            const success = p.stdin.write(filter + '\n', 'utf8');
            if (!success) {
                console.warn('stdin 缓冲区满，稍后会自动发送');
            }
        } else {
            console.error('子进程 stdin 不可用，可能已关闭');
            // 尝试重启
            setTimeout(() => {
                const retryChild = getOrCreateScreenFilterProcess();
                retryChild.stdin?.write(filter + '\n', 'utf8');
            }, 500);
        }
        return 0
    }

}

