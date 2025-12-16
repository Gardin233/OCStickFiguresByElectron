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
        this.getPosToHitBoxDistance();this.checkHit();
    }
    private  async create(){
        window.electronAPI.character.createNewSpine(async (files,id)=>{
            const character = new SpineCharacter(app.stage);
            await character.load(files);
            characters[id]=character
            return "ok"
        })
    }
    private delete(){
     window.electronAPI.character.deleteSpine((id)=>{
        const character = characters[id]
        character.renderer.destory()
        delete characters[id]

        return "ok";
     })
    }
    private  setAnimation(){
        window.electronAPI.character.playAnimation((id,layer,animation,isLoop)=>{
            characters[id].animator.play(layer,animation,isLoop)
        })
    }
    private setPos(){
        window.electronAPI.character.setPos((id,x,y)=>{
            characters[id].mover.setPosition(x,y)
        })
    }
    private moveTo(){
        window.electronAPI.character.moveTo((id,x,y,func)=>{
            characters[id].mover.moveTo(x,y)
        })
    }
    private showHitBox(){
        window.electronAPI.character.showHitBox((id)=>{
            setInterval(()=>{
                  characters[id].hitChecker.debugBoundingBoxes()
            },16)
          
        })
    }
    private flip(){
        window.electronAPI.character.flip((id,isLeft)=>{
            console.log(id,isLeft)
            characters[id].animator.flip(isLeft)
        })
    }

    //TODO
    private getHitBox(){
        window.electronAPI.character.getHitBox((id)=>{
            const boxes =characters[id].hitChecker.getBoxs()
            window.electronAPI.character.sendGetHitBox(id,boxes)
            
        })
    }
    private getPosToHitBoxDistance(){
        window.electronAPI.character.getPosToHitboxDistance((id,x,y)=>{
          const data =characters[id].hitChecker.getBoundingBoxDistance(x,y)  
          window.electronAPI.character.sendGetPosToHitBoxDistance(id,data)
        })
    }
    private checkHit(){
        window.electronAPI.character.checkHit((id,x,y)=>{
            const data =characters[id].hitChecker.getHitBoundingBox(x,y)
            window.electronAPI.character.sendCheckHit(id,data)
        })
    } 
}