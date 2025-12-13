import { app } from "../../renderer.js";
import { SpineCharacter } from "../character/SpineCharacter.js"

const characters:Record<string,SpineCharacter>={}
export class CharacterIPC{
    constructor() {}
    public Init() {
        this.create()
        this.delete()
    }
    private async create(){
        window.electronAPI.createNewSpine(async (files,id)=>{
            // 加载 Spine JSON 资源
        console.log("renderer接收到",files,name)
        const character = new SpineCharacter(app.stage);
        await character.load(files);
        characters[id]=character
        return "ok"
        })
    }
    private async delete(){
     window.electronAPI.deleteSpine((id)=>{
        const character = characters[id]
        character.renderer.destory()
        delete characters[id]

        return "ok";
     })
    }
}