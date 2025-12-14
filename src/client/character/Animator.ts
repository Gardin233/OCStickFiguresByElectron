import * as PIXI from 'pixi.js'
import { BoundingBoxAttachment, Spine } from '@pixi-spine/runtime-3.8'
export class Animator{
  private spine:Spine
  private defaultAnimation:string="stand"
  private toLeft:boolean

// 用于临时存储 complete 监听器的移除函数（便于取消）
    private removeCompleteListener?: () => void;
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
  //TODO:功能未验证
public async mustFirstPlay(animation: string): Promise<void> {
        if (!this.spine) return;
        // 防止重复播放同一个动画时重复等待
        const current = this.spine.state.getCurrent(0);
        if (current && current.animation.name === animation && !current.loop) {
            // 已经在播放这个非循环动画了，直接继续等待它的 complete
        } else {
            // 强制设置该动画（非循环）
            this.spine.state.setAnimation(0, animation, false);
            // 紧接着排队默认站立动画（循环）
            this.spine.state.addAnimation(0, this.defaultAnimation, true, 0);
        }
        // 返回 Promise，等待 track 0 的 complete 事件
        return new Promise<void>((resolve) => {
            const listener = {
                complete: (entry: any) => {
                    if (entry.trackIndex === 0 && entry.animation.name === animation) {
                        // 指定动画播放完毕
                        this.spine.state.removeListener(listener);
                        this.removeCompleteListener = undefined;
                        resolve();
                    }
                }
            };
            this.spine.state.addListener(listener);
            this.removeCompleteListener = () => this.spine.state.removeListener(listener);
        });
    }
}