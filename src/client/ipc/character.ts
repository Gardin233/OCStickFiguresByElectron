import { app } from "../../renderer.js";
import { SpineCharacter } from "../character/SpineCharacter.js"

export class CharacterIPC{
    constructor() {}
    public Init() {
        this.create()
    }
    private async create(){
        window.electronAPI.createNewSpine(async (files)=>{
            // 加载 Spine JSON 资源
        console.log("renderer接收到",files)
        const character = new SpineCharacter(app.stage);
        await character.load(files);
        return "ok"
        })
    }
}