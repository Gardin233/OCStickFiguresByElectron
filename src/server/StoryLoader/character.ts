import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lauxlib, lua } from "./StoryLoader.js";
import { sendCreateNewSpineMessage, sendDeleteSpine, sendFlip, sendMoveTo, sendPlayAnimation, sendSetPos, sendShowHitBox } from "../ipc/renderer.send.js";
import { app } from "electron";
import { getcheckHitAsync, getHitBoxAsync, getPosToHitBoxDistanceAsync} from "../Async/Character.js";
export class CharacterLib{
    private libNames:{name:string,func:Function}[]=[]
    L: any;
    constructor(L){
        this.L =L
        this.libNames = [
            {name:"demofunc", func: this.demofunc.bind(this) },
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
    private demofunc(L){
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
    private createNewCharacterSpine(L){
        const url =interop.tojs(L,1)
        const id =interop.tojs(L,2)
        console.log("来自lua的位置",url)
        // 主进程提前处理目录，构造 Spine 所需的文件结构
        const absDir = path.join(app.getAppPath(),"..", url);
        console.log(absDir)
    if (!fs.existsSync(absDir)) {
        throw new Error("目录不存在: " + absDir);
    }

    const files = fs.readdirSync(absDir);
    const spineFiles: Record<string, string> = {};

    for (const file of files) {
        const full = path.join(absDir, file);
        const ext = path.extname(file).toLowerCase();

        if (ext === ".json") {
            spineFiles[file] = "file://" + full.replace(/\\/g, "/");
        }
    }
    console.log(spineFiles)
        sendCreateNewSpineMessage(spineFiles,id)
        return 0
    }
    private delete(L){
        const id =interop.tojs(L,1)
        sendDeleteSpine(id)
        return 0
    }
    //TODO
    private getHitBox(L){
        return getHitBoxAsync(L)
    }
    private showHitBox(L){
        const id =interop.tojs(L,1)
        sendShowHitBox(id)
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
        sendPlayAnimation(id,layer,animation,isLoop)
        return 0
    }
    private setPos(L){
        console.log("设置坐标函数已经被触发")
        const id =interop.tojs(L,1)
        const x =interop.tojs(L,2)
        const y =interop.tojs(L,2)
        sendSetPos(id,x,y)
        return 0
    }
    private moveTo(L){
        // console.log("移动函数已经被触发")
        const id =interop.tojs(L,1)
        const x =interop.tojs(L,2)
        const y =interop.tojs(L,3)
        const func =interop.tojs(L,4)
        sendMoveTo(id,x,y,func)
        return 0

    }
    private flip(L){
        // console.log("反转函数已经被触发")
        const id =interop.tojs(L,1)
        const isLeft =interop.tojs(L,2)
        sendFlip(id,isLeft)
        return 0
    }
}