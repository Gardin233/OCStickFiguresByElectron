import * as PIXI from 'pixi.js'
import { SpineRenderer } from './SpineRenderer.js'
import { HitChecker } from './HitChecker.js'
import { Animator } from './Animator.js'
import { Mover } from './Mover.js'

export class SpineCharacter { 
  public renderer:SpineRenderer
  public hitChecker:HitChecker
  public animator:Animator =new Animator()
  public mover:Mover
  constructor(stage: PIXI.Container) {
    this.renderer =new SpineRenderer(stage)
  }
  //渲染图形后再注册其他组件
  async load(globPattern: Record<string, string>) {
    await this.renderer.loadFromGlob(globPattern)
    this.animator.setSpine(this.renderer.spine)
    this.mover = new Mover(this.renderer.spine)
    this.hitChecker = new HitChecker(this)
  }
}
