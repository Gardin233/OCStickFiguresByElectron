import { lua } from 'fengari';
import * as interop from 'fengari-interop';

export class TimeManager {
    private L: any;
    private queue: Array<{ type: string, dt: number }> = [];
    private running: boolean = false;
    private lastTimestamp: bigint = 0n; // 使用 BigInt 存储纳秒级时间

    constructor(L: any) {
        this.L = L;
    }

    start() {
        if (this.running) return;
        this.running = true;
        // 初始化高精度时间戳 (纳秒)
        this.lastTimestamp = process.hrtime.bigint();
        const loop = () => {
            if (!this.running) return;
            const now = process.hrtime.bigint();
            // 计算纳秒差值并转换为秒 (1秒 = 1,000,000,000 纳秒)
            const deltaTimeInSeconds = Number(now - this.lastTimestamp) / 1_000_000_000;
            this.lastTimestamp = now;
            // 触发更新逻辑
            this.emit('update', deltaTimeInSeconds);
            this.flushQueue();
            // 递归进入下一个事件循环
            setImmediate(loop);
        };
        setImmediate(loop);
    }
    stop() {
        this.running = false;
    }
    private emit(type: string, dt: number) {
        this.queue.push({ type, dt });
    }

    private flushQueue() {
        while (this.queue.length > 0) {
            const data = this.queue.shift()!;

            lua.lua_getglobal(this.L, 'Gwin');
            if (lua.lua_type(this.L, -1) !== lua.LUA_TTABLE) {
                lua.lua_pop(this.L, 1);
                continue;
            }
            lua.lua_getfield(this.L, -1, 'update'); // 或者改为 'update'
            if (lua.lua_type(this.L, -1) !== lua.LUA_TFUNCTION) {
                lua.lua_pop(this.L, 2);
                continue;
            }
            lua.lua_remove(this.L, -2);
            // 传递包含 dt (秒) 的对象给 Lua
            interop.push(this.L, {
                type: data.type,
                dt: data.dt
            });
            if (lua.lua_pcall(this.L, 1, 0, 0) !== 0) {
                console.error("Lua Error:", lua.lua_tostring(this.L, -1));
                lua.lua_pop(this.L, 1);
            }
        }
    }
}