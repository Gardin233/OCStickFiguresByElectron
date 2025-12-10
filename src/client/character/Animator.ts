import * as PIXI from 'pixi.js'
import { characterAnimation } from "../../types/animation.js";
import { BoundingBoxAttachment, Spine } from '@pixi-spine/runtime-3.8'
export class Animator{
  public state:characterAnimation='stand'
  private spine:Spine
  private toLeft:boolean
  constructor(){}
  public setSpine(spine: Spine) {
    this.spine = spine
     this.spine.state.addAnimation(0, 'stand', true, 0)
  }
  //动作
  public jump() {
    if (!this.spine) return
    this.spine.state.setAnimation(0, 'jump', false)
    this.spine.state.addAnimation(0, 'stand', true, 0)
  }

  public walk(toLeft: boolean)  {
    this.spine.state.setAnimation(0, 'walk', true)
    this.toLeft = toLeft 
    // 翻转模型方向（仅x轴镜像）
    this.spine.scale.x = (this.toLeft ? 1 : -1) * Math.abs(this.spine.scale.x);
  }
  public stopWalk() {
    this.spine.state.setAnimation(0, 'stand', true)
  }
  public holdHead() {
    this.spine.state.setAnimation(0, 'holdHead', false)
    this.spine.state.addAnimation(0, 'stand', true, 0)
  }
  public lookAround() {
    this.spine.state.setAnimation(0, 'lookAround', false)
    this.spine.state.addAnimation(0, 'stand', true, 0)
  }
  public openDeskTopIcon(name:string) {
    this.spine.state.setAnimation(0, 'open', false)
    // 监听完成事件（只触发一次）
    const onComplete = (trackEntry: any) => {
      if (trackEntry.animation.name === 'open') {
        console.log('动画播放完毕, 执行双击事件')
        window.electronAPI.openDesktopIcon(name)
        // 执行完之后立即解绑，避免重复触发
        this.spine.state.removeListener(listener)
      }
    }
// Spine 官方要求监听器是对象
    const listener = {
      complete: onComplete
    }
    this.spine.state.addListener(listener)
  }
}