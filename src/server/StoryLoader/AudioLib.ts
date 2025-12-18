import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lua } from "./StoryLoader.js";
import { AudioIPCSender } from "../ipc/audio.js";
export class AudioLib{
    private L:any;
    private libNames:{name:string,func:Function}[]
    constructor(LuaL){
        this.L=LuaL
        this.libNames=[
            {name:'loadBGMFiles',func:this.loadBGMFiles.bind(this)},
            {name:'loadSFXFiles',func:this.loadSFXFiles.bind(this)},
            {name:'unloadBGM',func:this.unloadBGM.bind(this)},
            {name:'unloadSFX',func:this.unloadSFX.bind(this)},
            {name:'preloadBGM',func:this.preloadBGM.bind(this)},
            {name:'preloadSFX',func:this.preloadSFX.bind(this)},
            {name:'releaseBGM',func:this.releaseBGM.bind(this)},
            {name:'releaseSFX',func:this.releaseSFX.bind(this)},
            {name:'mixBGM',func:this.mixBGM.bind(this)},
            {name:'mixSFX',func:this.mixSFX.bind(this)},
            {name:'playBGM',func:this.playBGM.bind(this)},
            {name:'playSFX',func:this.playSFX.bind(this)},
            {name:'removeBGM',func:this.removeBGM.bind(this)},
            {name:'removeSFX',func:this.removeSFX.bind(this)}
        ]
    }
    public Init(){
        lua.lua_newtable(this.L); 
        for(const item of this.libNames){
            lua.lua_pushcfunction(this.L, item.func); 
            lua.lua_setfield(this.L,-2, item.name);
        }
        lua.lua_setglobal(this.L, "Audio"); 
    }
    public loadBGMFiles(){
        const luaTable = interop.tojs(this.L, 1)
        const bgms = []
        for (let i = 1; ; i++) {
        if (!luaTable.has(i)) break; // 如果没有这个索引了，跳出循环
        const item = luaTable.get(i); // 获取嵌套的 Table 包装对象

        bgms.push({
            id: item.get('id'),
            url: item.get('url')
        });
        }
        AudioIPCSender.loadBGMFiles(bgms)
        return 0
    }
    public loadSFXFiles(){
        const luaTable = interop.tojs(this.L, 1)

        const sfxs = []
        for (let i = 1; ; i++) {
        if (!luaTable.has(i)) break; // 如果没有这个索引了，跳出循环
        const item = luaTable.get(i); // 获取嵌套的 Table 包装对象
        sfxs.push({
            id: item.get('id'),
            url: item.get('url')
        });
        }
        AudioIPCSender.loadSFXFiles(sfxs)
        return 0
    }
    public unloadBGM(){
        const id = interop.tojs(this.L,1)
        AudioIPCSender.unloadBGM(id)
        return 0
    }
    public unloadSFX(){
        const id = interop.tojs(this.L,1)
        AudioIPCSender.unloadSFX(id)
        return 0
    }
    public preloadBGM(){
        const id = interop.tojs(this.L,1)
        AudioIPCSender.preloadBGM(id)
        return 0
    }
    public preloadSFX(){
        const id = interop.tojs(this.L,1)
        AudioIPCSender.preloadSFX(id)
        return 0
    }
    public releaseBGM(){
        const id = interop.tojs(this.L,1)
        AudioIPCSender.releaseBGM(id)
        return 0
    }
    public releaseSFX(){
        const id = interop.tojs(this.L,1)
        AudioIPCSender.releaseSFX(id)
        return 0
    
    }
    public mixBGM(){
        const id = interop.tojs(this.L,1)
        AudioIPCSender.mixBGM(id)
        return 0
    }
    public mixSFX(){
        const id = interop.tojs(this.L,1)
        AudioIPCSender.mixSFX(id)
        return 0
    }
    public playBGM(){
        const id = interop.tojs(this.L,1)
        const Ldata =interop.tojs(this.L,2)
        const data ={
            volume:Ldata.get('volume'),
            startTime:Ldata.get('startTime'),
            loop:Ldata.get('loop'),
            fadeIn:Ldata.get('fadeIn')
        }
        AudioIPCSender.playBGM(id,data)
        return 0
        
    }
    public playSFX(){
        const id = interop.tojs(this.L,1)
        const Ldata =interop.tojs(this.L,2)
        const data ={
            volume:Ldata.get('volume'),
            startTime:Ldata.get('startTime'),
            loop:Ldata.get('loop'),
            fadeIn:Ldata.get('fadeIn')
        }
        AudioIPCSender.playSFX(id,data)
        return 0
        
    }
    public removeBGM(){
        const id = interop.tojs(this.L,1)
        AudioIPCSender.removeBGM(id)
        return 0
    
    }
    public removeSFX(){
        const id = interop.tojs(this.L,1)
        AudioIPCSender.releaseSFX(id)
        return 0
    }
}