import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lauxlib, lua } from "./StoryLoader.js";
export class CharacterLib{
    public libNames:{name:string,function:Function}[]=[]
    L: any;
    constructor(L){
        this.L =L
        // this.libNames = [
        //     { name: "demofunc", function: this.demofunc.bind(this) }
        // ];
    }
    public Init(){
        for(const func of this.libNames){
            lua.lua_pushcfunction(this.L, this.demofunc); 
            lua.lua_setglobal(this.L, func.name);
        }
    }
    public demofunc(L){
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

}