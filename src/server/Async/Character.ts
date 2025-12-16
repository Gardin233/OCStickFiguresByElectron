import * as fengari from 'fengari';
import * as interop from 'fengari-interop';
import { lauxlib, lua } from "../StoryLoader/StoryLoader.js";
import { sendGetcheckHit, sendGetHitBox, sendGetPosToHitBoxDistance } from '../ipc/renderer.send.js';
import { ipcMain } from 'electron';

export function getHitBoxAsync(L) {
    const id = interop.tojs(L, 1);

    // 检查第二个参数是否是回调函数
    if (lua.lua_isfunction(L, 2) === 0) {
        return lauxlib.luaL_error(L, "第二个参数不是回调函数");
    }

    // 把 Lua 回调函数压栈并注册引用
    lua.lua_pushvalue(L, 2);
    const callback_ref = lauxlib.luaL_ref(L, lua.LUA_REGISTRYINDEX);

    // 创建 ipcMain listener，只处理对应 id 的返回
    const listener = (event, recvId, data) => {
        //  console.log("收到事件", recvId, data);
        if (recvId !== id) return;

        // 从注册表取出 Lua 回调函数
        lua.lua_rawgeti(L, lua.LUA_REGISTRYINDEX, callback_ref);
        const luaBoxes = [];
    for (const box of data) {
        // 每个 box 转成 table
        luaBoxes.push({
            name: box.name,
            verts: [...box.verts] // 数组也会被转换成 Lua table
        });
    }
        // 压入参数：err=nil, result=data
        lua.lua_pushnil(L);      // err
        interop.push(L, luaBoxes);   // result
        // 调用 Lua 回调
        lua.lua_pcall(L, 2, 0, 0);
        // 清理引用和 listener
        lauxlib.luaL_unref(L, lua.LUA_REGISTRYINDEX, callback_ref);
        ipcMain.removeListener("send-get-hit-box", listener);
    };

    ipcMain.on("send-get-hit-box", listener);

    // 发送请求给渲染器
    sendGetHitBox(id);

    return 0; // Lua 调用时返回值 0
}
export function getcheckHitAsync(L){
    const id =interop.tojs(L,1)
    const x =interop.tojs(L,2)
    const y =interop.tojs(L,3)
    if (lua.lua_isfunction(L, 4) === 0) {
        return lauxlib.luaL_error(L, "第四个参数不是回调函数");
    }        
     // 把 Lua 回调函数压栈并注册引用
    lua.lua_pushvalue(L, 4);
    const callback_ref = lauxlib.luaL_ref(L, lua.LUA_REGISTRYINDEX);

    const listener =(event,recvId,data)=>{
        if (recvId !== id) return;
         // 从注册表取出 Lua 回调函数
        lua.lua_rawgeti(L, lua.LUA_REGISTRYINDEX, callback_ref);
        const hitPart={name:data}
         // 压入参数：err=nil, result=data
        lua.lua_pushnil(L);      // err
        interop.push(L, hitPart);   // result
        // 调用 Lua 回调
        lua.lua_pcall(L, 2, 0, 0);
        // 清理引用和 listener
        lauxlib.luaL_unref(L, lua.LUA_REGISTRYINDEX, callback_ref);
        ipcMain.removeListener("send-check-hit", listener);
    }
    ipcMain.on("send-check-hit",listener)
    sendGetcheckHit(id,x,y)

    return 0
}
export function getPosToHitBoxDistanceAsync(L){
 
        const id =interop.tojs(L,1)
        const x =interop.tojs(L,2)
        const y =interop.tojs(L,3)
        if (lua.lua_isfunction(L, 4) === 0) {
        return lauxlib.luaL_error(L, "第四个参数不是回调函数");
    }
     // 把 Lua 回调函数压栈并注册引用
    lua.lua_pushvalue(L, 4);
    const callback_ref = lauxlib.luaL_ref(L, lua.LUA_REGISTRYINDEX);
    const listener =(event,recvId,data)=>{
        if (recvId !== id)return;
        lua.lua_rawgeti(L,lua.LUA_REGISTRYINDEX,callback_ref)
        const boxes=[]
        // console.log(data)
        for(const box of data){
            boxes.push({name:box.name,distance:box.distance})
        }
        lua.lua_pushnil(L);
        interop.push(L,boxes);
        lua.lua_pcall(L, 2, 0, 0);
        lauxlib.luaL_unref(L, lua.LUA_REGISTRYINDEX, callback_ref);
        ipcMain.removeListener("send-get-pos-to-hit-box-distance", listener);
    }
    ipcMain.on("send-get-pos-to-hit-box-distance",listener)
    sendGetPosToHitBoxDistance(id,x,y)
    return 0
}