import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lua } from './StoryLoader.js';
import { TextSender } from '../ipc/text.js';
export class TextLib{
    private libNames:{name:string,func:Function}[]=[]
    L: any;
    constructor(LuaL){
        this.L =LuaL
        this.libNames = [
            {name:"create",func:this.create.bind(this)},
            {name:'remove',func:this.remove.bind(this)},
            {name:'setPos',func:this.setPos.bind(this)},
            {name:'setStyle',func:this.setStyle.bind(this)},
            {name:'setContent',func:this.setContent.bind(this)},
            {name:'setScale',func:this.setScale.bind(this)},
            {name:'setRotation',func:this.setRotation.bind(this)}
        ];
    }
    public init(){
        lua.lua_newtable(this.L); 
            for(const item of this.libNames){
                lua.lua_pushcfunction(this.L, item.func); 
                lua.lua_setfield(this.L,-2, item.name);
            }
        lua.lua_setglobal(this.L, "Text"); 
    }
    private create(L){
        const id =interop.tojs(L,1)
        const content=interop.tojs(L,2)
        const style =JSON.parse(interop.tojs(L,3))
        const trans =JSON.parse(interop.tojs(L,4))
        TextSender.create(id,content,style,trans)
    }
    private remove(L){
        const id =interop.tojs(L,1)
        TextSender.remove(id)
    }
    private setPos(L){
        const id =interop.tojs(L,1)
        const x =interop.tojs(L,2)
        const y =interop.tojs(L,3)
        TextSender.setPos(id,x,y)
    }
    private setStyle(L){
        const id =interop.tojs(L,1)
        const style =JSON.parse(interop.tojs(L,2))
        TextSender.setStyle(id,style)
    }
    private setContent(L){
        const id =interop.tojs(L,1)
        const content =interop.tojs(L,2)
        TextSender.setContent(id,content)
    }
    private setScale(L){
        const id =interop.tojs(L,1)
        const scaleX=interop.tojs(L,2)
        const scaleY= interop.tojs(L,3)
        TextSender.setScale(id,scaleX,scaleY)
    }
    private setRotation(L){
        const id =interop.tojs(L,1)
        const rotation =interop.tojs(L,2)
        TextSender.setRotation(id,rotation)
    }
}
