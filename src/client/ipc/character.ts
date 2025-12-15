import { app } from "../../renderer.js";
import { SpineCharacter } from "../character/SpineCharacter.js"

const characters:Record<string,SpineCharacter>={}
export class CharacterIPC{
    constructor() {}
    public Init() {
        this.create();this.delete();
        this.setAnimation();this.flip()
        this.setPos();this.moveTo();
        this.showHitBox();this.getHitBox()
        this.getPosToHitBoxInstance();this.checkHit();
    }
    private async create(){

        window.electronAPI.character.createNewSpine(async (files,id)=>{
            // 加载 Spine JSON 资源
        // console.log("renderer接收到",files,id)
        const character = new SpineCharacter(app.stage);
        await character.load(files);
        characters[id]=character
        return "ok"
        })
    }
    private async delete(){
     window.electronAPI.character.deleteSpine((id)=>{
        const character = characters[id]
        character.renderer.destory()
        delete characters[id]

        return "ok";
     })
    }
    private async setAnimation(){
        window.electronAPI.character.playAnimation((id,layer,animation,isLoop)=>{
            characters[id].animator.play(layer,animation,isLoop)
        })
    }
    private async setPos(){
        window.electronAPI.character.setPos((id,x,y)=>{
            characters[id].mover.setPosition(x,y)
        })
    }
    private async moveTo(){
        window.electronAPI.character.moveTo((id,x,y,func)=>{
            characters[id].mover.moveTo(x,y)
        })
    }
    private async showHitBox(){
        window.electronAPI.character.showHitBox((id)=>{
            setInterval(()=>{
                  characters[id].hitChecker.debugBoundingBoxes()
            },16)
          
        })
    }
    private async flip(){
        window.electronAPI.character.flip((id,isLeft)=>{
            characters[id].animator.flip(isLeft)
        })
    }

    //TODO
    private getHitBox(){
        window.electronAPI.character.getHitBox((id)=>{
            const boxes =characters[id].hitChecker.getBoxs()
            console.log(boxes)
            window.electronAPI.character.sendGetHitBox(boxes)
            
        })
    }
    private getPosToHitBoxInstance(){
        
        window.electronAPI.character.getPosToHitboxInstance((id,x,y)=>{
          const data =characters[id].hitChecker.getBoundingBoxInstance(x,y)  
          window.electronAPI.character.sendGetPosToHitBoxInstance(data)
        })
    }
    private checkHit(){
        window.electronAPI.character.checkHit((id,x,y)=>{
            const data =characters[id].hitChecker.getHitBoundingBox(x,y)
            window.electronAPI.character.sendCheckHit(data)
        })
    } 
}