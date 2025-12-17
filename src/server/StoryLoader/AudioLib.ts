import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lua } from "./StoryLoader.js";
export class AudioLib{
    private L:any;
    private libNames:{name:string,func:Function}[]
    constructor(LuaL){
        this.L=LuaL
        this.libNames=[
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
}