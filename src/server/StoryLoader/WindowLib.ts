import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lauxlib, lua } from "./StoryLoader.js";
import { getOrCreateScreenFilterProcess } from "../process/screeenFilter.js";
import { getDesktopIconPosition, openEXE } from "../utils/desktop.js";
import { openDesktopIcon } from "../ipc/desktop.handler.js";
import { getOrCreateDeskTopOpnerProcess } from "../process/exeOpner.js";
import { useExternalforSingle } from "../process/Input.js";
import { InputState } from "../hooks/uiohook.js";

export class WindowLib{
    public libNames:{name:string,func:Function}[]=[]
    L: any;
    constructor(L){
        this.L =L
        this.libNames = [
            {name:"demofunc", func: this.testfunc.bind(this) },
            {name:"applyScreenFilter",func:this.applyScreenFilterFromLua.bind(this)},
            {name:"openExe",func:this.openEXE.bind(this)},
            {name:'openDesktopIcon',func:this.openDesktopIcon.bind(this)},
            {name:"getDesktopIconPos",func:this.lua_getDesktopIconPos.bind(this)},
            {name:"getEvent",func:this.getEvent.bind(this)}
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
        lua.lua_setglobal(this.L, "Gwin"); // Window = {...}
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
    // 在主进程：提供给 Lua 调用的接口
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
        const target = interop.tojs(L,1)
        useExternalforSingle(target,()=>getOrCreateDeskTopOpnerProcess(),"utf16le")
        return 0
    }
    // 把异步函数注入到 Lua 全局环境
    // 创建一个 JS 函数作为 Lua 函数
    private lua_getDesktopIconPos(L: fengari.lua_State): number  {
        // 检查参数：用户必须传一个回调函数（Lua function）
        if (lua.lua_isfunction(L, 1) === 0) {
            return lauxlib.luaL_error(L, "getDesktopIconPos() 需要一个回调函数作为参数");
        }
        // 把回调函数保存到 upvalue 或者栈上，这里我们把它留在栈顶
        // 实际上下面会 pop，所以我们先复制一份到 registry 更安全（可选）
        lua.lua_pushvalue(L, 1);              // 复制一份回调
        const callback_ref = lauxlib.luaL_ref(L, lua.LUA_REGISTRYINDEX); // 保存引用
        // 启动异步操作
        (async () => {
            try {
                const icons = await getDesktopIconPosition();
                // 异步成功后，回到 Lua 线程恢复执行回调
                // 注意：我们现在是在 JS 线程，不能直接操作 L（除非你用 worker+Atomics，这里我们用 fengari 的调度方式）
                // 最简单最安全的做法：用 setTimeout 0 切回主线程再调用
                setTimeout(() => {
                    // 重新获取 Lua 状态（如果你是单例可以全局保存 L）
                    const LL = L; // 假设你全局能访问到 L
                    // 先恢复回调函数
                    lua.lua_rawgeti(LL, lua.LUA_REGISTRYINDEX, callback_ref);
                    // 推入 nil 作为 err（成功）
                    lua.lua_pushnil(LL);
                    // 推入结果（数组转 Lua table）
                    interop.push(LL, icons);  // fengari-interop 的 push 能自动转数组/对象
                    // 调用回调：回调(nil, result)
                    const status = lua.lua_pcall(LL, 2, 0, 0);
                    if (status !== lua.LUA_OK) {
                        const err = lua.lua_tostring(LL, -1);
                        console.error("Lua callback error:", err);
                        lua.lua_pop(LL, 1);
                    }
                    // 释放引用
                    lauxlib.luaL_unref(LL, lua.LUA_REGISTRYINDEX, callback_ref);
                }, 0);
            } catch (err: any) {
                setTimeout(() => {
                    const LL = L;
                    lauxlib.luaL_rawgeti(LL, lua.LUA_REGISTRYINDEX, callback_ref);
                    // 推入错误信息
                    interop.push(LL, err?.message || err || "unknown error");
                    // 第二个参数 nil 表示失败
                    lua.lua_pushnil(LL);
                    lua.lua_pcall(LL, 2, 0, 0); // 忽略回调自己的错误
                    lauxlib.luaL_unref(LL, lua.LUA_REGISTRYINDEX, callback_ref);
                }, 0);
            }
        })();

        // Lua 函数本身返回 0（不返回值，因为是异步）
        return 0;
    };
    private getEvent(L){
         interop.push(L,InputState)
        return 1
    }
}
