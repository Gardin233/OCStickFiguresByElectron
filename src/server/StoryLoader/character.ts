import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lauxlib, lua } from "./StoryLoader.js";
import { CharacterIPCSender} from "../ipc/character.js";
import { app } from "electron";
import { getcheckHitAsync, getHitBoxAsync, getPosToHitBoxDistanceAsync} from "../Async/Character.js";
import { pathToFileURL } from "url";
import {  storyBase } from "../../global.js";
export class CharacterLib{
    private libNames:{name:string,func:Function}[]=[]
    L: any;
    constructor(L){
        this.L =L
        this.libNames = [
            {name:"createNewCharacter",func:this.createNewCharacterSpine.bind(this)},
            {name:"deleteCharacter",func:this.delete.bind(this)},
            {name:"getHitBox",func:this.getHitBox.bind(this)},
            {name:"showHitBox",func:this.showHitBox.bind(this)},
            {name:"checkHit",func:this.checkHit.bind(this)},
            {name:"getPosToHitBoxDistance",func:this.getPosToHitBoxDistance.bind(this)},
            {name:"playAnimation",func:this.playAnimation.bind(this)},
            {name:"setPos",func:this.setPos.bind(this)},
            {name:"moveTo",func:this.moveTo.bind(this)},
            {name:"flip",func:this.flip.bind(this)}
        ];
    }
    public Init(){
        lua.lua_newtable(this.L); 
        for(const item of this.libNames){
            lua.lua_pushcfunction(this.L, item.func); 
            lua.lua_setfield(this.L,-2, item.name);
        }
        lua.lua_setglobal(this.L, "Character"); 
    }
private createNewCharacterSpine(L) {
    // 1. 获取 Lua 传入的参数
    const rawUrl = interop.tojs(L, 1); // 例如: "/spine/gardin.json"
    const id = interop.tojs(L, 2);     // 例如: "gardin"
    const spineFiles: Record<string, string> = {};
    // 2. 统一基础路径
    const fullJsonPath = path.join(storyBase,'assets', rawUrl);
    if (!fs.existsSync(fullJsonPath)) {
        console.error("Spine 文件不存在:", fullJsonPath);
        return 0;
    }
    const fileUrl = pathToFileURL(fullJsonPath).href;
    console.log("发送给渲染进程的 Spine 主文件:", fileUrl);
    spineFiles[id] =fileUrl
    CharacterIPCSender.sendCreateNewSpineMessage(spineFiles, id);
    return 0;
}
    private delete(L){
        const id =interop.tojs(L,1)
        CharacterIPCSender.sendDeleteSpine(id)
        return 0
    }
    //TODO
    private getHitBox(L){
        return getHitBoxAsync(L)
    }
    private showHitBox(L){
        const id =interop.tojs(L,1)
        CharacterIPCSender.sendShowHitBox(id)
        return 0
    }
    private checkHit(L){
        return getcheckHitAsync(L)
    }
    private getPosToHitBoxDistance(L){
        // console.log("fuck")
        return getPosToHitBoxDistanceAsync(L)
    }
    private playAnimation(L){
        console.log("动画播放函数已经被触发")
        const id =interop.tojs(L,1)
        const layer=interop.tojs(L,2)
        const animation =interop.tojs(L,3)
        const isLoop =interop.tojs(L,4)
        CharacterIPCSender.sendPlayAnimation(id,layer,animation,isLoop)
        return 0
    }
    private setPos(L){
        console.log("设置坐标函数已经被触发")
        const id =interop.tojs(L,1)
        const x =interop.tojs(L,2)
        const y =interop.tojs(L,2)
        CharacterIPCSender.sendSetPos(id,x,y)
        return 0
    }
    private moveTo(L){
        // console.log("移动函数已经被触发")
        const id =interop.tojs(L,1)
        const x =interop.tojs(L,2)
        const y =interop.tojs(L,3)
        const func =interop.tojs(L,4)
        CharacterIPCSender.sendMoveTo(id,x,y,func)
        return 0

    }
    private flip(L){
        // console.log("反转函数已经被触发")
        const id =interop.tojs(L,1)
        const isLeft =interop.tojs(L,2)
        CharacterIPCSender.sendFlip(id,isLeft)
        return 0
    }
}