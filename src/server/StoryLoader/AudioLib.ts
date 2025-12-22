import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lua } from "./StoryLoader.js";
import { AudioManager } from "../audio/AudioManager.js";
import { app } from "electron";
export class AudioLib{
    private L:any;
    private libNames:{name:string,func:Function}[]
    private audioManager =new AudioManager()
    constructor(LuaL){
        this.L=LuaL
        this.libNames=[
            {name:'loadBGMFiles',func:this.loadBGMFiles.bind(this)},
            {name:'loadSFXFiles',func:this.loadSFXFiles.bind(this)},
            {name:'unloadBGM',func:this.unloadBGM.bind(this)},
            {name:'unloadSFX',func:this.unloadSFX.bind(this)},
            {name:'playBGM',func:this.playBGM.bind(this)},
            {name:'playSFX',func:this.playSFX.bind(this)},
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
        const resourcesBase = app.isPackaged ? process.resourcesPath : app.getAppPath();
        for (let i = 1; ; i++) {
        if (!luaTable.has(i)) break; // 如果没有这个索引了，跳出循环
        const item = luaTable.get(i); // 获取嵌套的 Table 包装对象
        bgms.push({
            id: item.get('id'),
            url: path.join(resourcesBase,'..','story','assets',item.get('url'))
        });
        }
        this.audioManager.loadBGMFiles(bgms)
        console.log('发送注册请求给BGM管理器')
        return 0
    }
    public loadSFXFiles(){
        const luaTable = interop.tojs(this.L, 1)
        const resourcesBase = app.isPackaged ? process.resourcesPath : app.getAppPath();
        const sfxs = []
        for (let i = 1; ; i++) {
        if (!luaTable.has(i)) break; // 如果没有这个索引了，跳出循环
        const item = luaTable.get(i); // 获取嵌套的 Table 包装对象
        sfxs.push({
            id: item.get('id'),
            url: path.join(resourcesBase,'..','story','assets',item.get('url'))
        });
        }
        console.log('处理后',sfxs)
        return 0
    }
    public unloadBGM(){
        const id = interop.tojs(this.L,1)
        this.audioManager.unloadBGM(id)
        return 0
    }
    public unloadSFX(){
        const id = interop.tojs(this.L,1)
        this.audioManager.unloadSFX(id)
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
        this.audioManager.playBGM(id,data)
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
        this.audioManager.playSFX(id,data)
        return 0
        
    }

}