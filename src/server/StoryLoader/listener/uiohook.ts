import { uIOhook, EventType, UiohookKeyboardEvent, UiohookMouseEvent, UiohookWheelEvent } from 'uiohook-napi';
import { lua } from 'fengari';
import * as interop from 'fengari-interop';
import { win } from '../../../main.js';
import { convertToLocal, localToConvert } from '../../utils/position.js';
//TODO:粗糙的队列处理。。。
export class InputManager {
    private L: any; // Lua VM
    private luaCallbackName: string;
    private queue: Array<{ type: string, event: any }> = [];
    private intervalId: NodeJS.Timeout | null = null;

    constructor(L: any, luaCallbackName = 'receiveInput') {
        this.L = L;
        this.luaCallbackName = luaCallbackName;
    }
    start() {
        // 注册 uiohook 事件
        uIOhook.on('mousemove', (e: UiohookMouseEvent) => this.emit('mousemove', e));
        uIOhook.on('mousedown', (e: UiohookMouseEvent) => this.emit('click', e));
        uIOhook.on('mouseup',(e:UiohookMouseEvent)=>this.emit('mouseup',e))
        uIOhook.on('keydown', (e: UiohookKeyboardEvent) => this.emit('keydown', e));
        uIOhook.on('keyup', (e: UiohookKeyboardEvent) => this.emit('keyup', e));
        uIOhook.on('wheel',(e:UiohookWheelEvent)=>this.emit('wheel',e))     
        uIOhook.start();
        // 启动队列处理，保证在主线程调用 Lua
        this.intervalId = setInterval(() => this.flushQueue(), 5);
    }
    stop() {
        uIOhook.stop();
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = null;
    }

    private emit(type: string, event: any) {
        // 事件仅入队，不直接调用 Lua
        this.queue.push({ type, event });
    }

    private flushQueue() {
        while (this.queue.length > 0) {
            const { type, event } = this.queue.shift()!;

            // 获取 Lua 回调
            // lua.lua_getglobal(this.L, this.luaCallbackName);
            lua.lua_getglobal(this.L, 'Gsys');
                if (lua.lua_type(this.L, -1) !== lua.LUA_TTABLE) {
                    // console.error('Lua table Gwin not found');
                    lua.lua_pop(this.L, 1);
                    continue;
                }

                // 获取回调函数
                lua.lua_getfield(this.L, -1, 'receiveInput');
                    if (lua.lua_type(this.L, -1) !== lua.LUA_TFUNCTION) {
                    // console.error('Lua callback Gwin.receiveInput not found');
                    lua.lua_pop(this.L, 2); // 弹出函数和表
                    continue;
                }

                // 弹出表，只保留函数在栈顶
                lua.lua_remove(this.L, -2);
            // if (lua.lua_type(this.L, -1) !== lua.LUA_LUA_TTABLE) {
            //     console.error('Lua callback not found for event', type);
            //     lua.lua_pop(this.L, 1);
            //     continue;
            // }

            // 只传纯数据给 Lua
            const pos =convertToLocal(win,event.x,event.y)
            const luaEvent = {
                type,
                time:event.time,
                x: pos.x,
                y: pos.y,
                direction:event.direction,
                amout:event.amount,
                rotation:event.rotation,
                button: event.button,
                keycode: event.keycode,
                clicks: event.clicks,
                altKey: event.altKey,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
                metaKey: event.metaKey,
            };
            interop.push(this.L, luaEvent); // 栈顶: table
            lua.lua_call(this.L, 1, 0);
        }
    }


}
