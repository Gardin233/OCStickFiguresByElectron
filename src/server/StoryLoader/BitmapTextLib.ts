import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lua } from './StoryLoader.js';
import { BitTextSender } from '../ipc/Bittext.js';
import { resourcesBase, storyBase } from '../../global.js';
import path from 'path';
export class BitTextLib{
    private libNames:{name:string,func:Function}[]=[]
    L: any;
    constructor(LuaL){
        this.L =LuaL
        this.libNames = [
            {name:"create",func:this.createBitText.bind(this)},
            {name:"remove",func:this.removeBitText.bind(this)},
            {name:"setContent",func:this.setContent.bind(this)},
            {name:'loadFont',func:this.loadFont.bind(this)},
            
            {name:'setPos',func:this.setPos.bind(this)},
            {name:'setScale',func:this.setScale.bind(this)},
            {name:'setRotation',func:this.setRotation.bind(this)},
            {name:'setStyle',func:this.setStyle.bind(this)},
        ];
    }
    public init(){
        lua.lua_newtable(this.L); 
            for(const item of this.libNames){
                lua.lua_pushcfunction(this.L, item.func); 
                lua.lua_setfield(this.L,-2, item.name);
            }
        lua.lua_setglobal(this.L, "BitText"); 
    }
    private loadFont(L){
        const id =interop.tojs(L,1)
        const url =interop.tojs(L,2)
        const FontUrl =path.join(storyBase,'assets',url)
        BitTextSender.sendLoadFont(id,FontUrl)
    }
    private createBitText(L){
        const id =interop.tojs(L,1)
        const content =interop.tojs(L,2)
        const style =JSON.parse(interop.tojs(L,3))
        const trans =JSON.parse(interop.tojs(L,4))
        BitTextSender.create(id,content,style,trans)
    }
    private removeBitText(L){
        const id =interop.tojs(L,1)
        BitTextSender.remove(id)
    }
    private setStyle(L){
        const id =interop.tojs(L,1)
        const style =JSON.parse(interop.tojs(L,2))
        BitTextSender.setStyle(id,style)
    }
    private setContent(L){
        const id =interop.tojs(L,1)
        const content =interop.tojs(L,2)
        BitTextSender.setContent(id,content)
    }
    private setPos(L){
        const id =interop.tojs(L,1)
        const x =interop.tojs(L,2)
        const y =interop.tojs(L,3)
        BitTextSender.setPos(id,x,y)
    }
    private setScale(L){
        const id =interop.tojs(L,1)
        const scaleX =interop.tojs(L,2)
        const scaleY =interop.tojs(L,3)
        BitTextSender.setScale(id,scaleX,scaleY)
    }
    private setRotation(L){
        const id =interop.tojs(L,1)
        const rotation =interop.tojs(L,2)
        BitTextSender.setRotation(id,rotation)
    }
}
