import * as PIXI from 'pixi.js'
import { BoundingBoxAttachment, Spine } from '@pixi-spine/runtime-3.8'
export class Animator{
  private spine:Spine
  private defaultAnimation:string="stand"
  private toLeft:boolean
  constructor(){}
  public setSpine(spine: Spine ,defaultAn="stand") {
    this.spine = spine
    this.defaultAnimation=defaultAn
    this.spine.state.addAnimation(0, this.defaultAnimation, true, 0)
  }
  //动作
  public play(layer:number, animation:string,loop:boolean=false) {
    if (!this.spine) return
    this.spine.state.setAnimation(layer, animation, loop)
  }
  public flip(toLeft:boolean){
    this.toLeft = toLeft 
    // 翻转模型方向（仅x轴镜像）
    this.spine.scale.x = (this.toLeft ? 1 : -1) * Math.abs(this.spine.scale.x);
  }
  
}