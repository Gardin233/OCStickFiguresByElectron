import { lua,lauxlib } from "../StoryLoader/StoryLoader.js";
import * as interop from 'fengari-interop';
import * as fengari from 'fengari';
import { getDesktopIconPosition } from "../utils/desktop.js";

/**
 * 异步获取桌面图标位置，并通过 Lua 回调返回
 * @param L Lua 状态
 */
export function getDesktopIconPosAsync(L: fengari.lua_State): number {
    if (lua.lua_isfunction(L, 1) === 0) {
        return lauxlib.luaL_error(L, "getDesktopIconPos() 需要一个回调函数作为参数");
    }
    lua.lua_pushvalue(L, 1);
    const callback_ref = lauxlib.luaL_ref(L, lua.LUA_REGISTRYINDEX);
    (async () => {
        try {
            const icons = await getDesktopIconPosition();
            setTimeout(() => {
                const LL = L;
                lua.lua_rawgeti(LL, lua.LUA_REGISTRYINDEX, callback_ref);
                lua.lua_pushnil(LL);          // err = nil
                interop.push(LL, icons);     // result
                lua.lua_pcall(LL, 2, 0, 0);
                lauxlib.luaL_unref(LL, lua.LUA_REGISTRYINDEX, callback_ref);
            }, 0);
        } catch (err: any) {
            setTimeout(() => {
                const LL = L;
                lua.lua_rawgeti(LL, lua.LUA_REGISTRYINDEX, callback_ref);
                interop.push(LL, err?.message || err || "unknown error");
                lua.lua_pushnil(LL);
                lua.lua_pcall(LL, 2, 0, 0);
                lauxlib.luaL_unref(LL, lua.LUA_REGISTRYINDEX, callback_ref);
            }, 0);
        }
    })();
    return 0;
}
