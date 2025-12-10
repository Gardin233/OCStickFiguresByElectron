// src/entities/Mover.ts

import { Spine } from '@pixi-spine/runtime-3.8'
import * as PIXI from 'pixi.js'

export class Mover {
  private spine: Spine
  private speed = 0.25
  private direction: -1 | 1 = 1   // 1 向右，-1 向左
  private isWalking = false

  constructor(spine: Spine) {
    this.spine = spine
    // 用 shared ticker 更规范（和 PIXI 官方推荐一致）
    PIXI.Ticker.shared.add(this.update, this)
  }

  /** 开始走路（自动处理方向翻转） */
  public walk(toLeft: boolean) {
    this.isWalking = true
    this.direction = toLeft ? -1 : 1

    // 关键：只翻转 X 轴，防止重复翻转导致缩放异常
    const targetScaleX = Math.abs(this.spine.scale.x)
    this.spine.scale.x = this.direction * targetScaleX
  }

  /** 停止走路 */
  public stop() {
    this.isWalking = false
  }

  /** 瞬间移动到某个位置（常用于传送、初始化定位） */
  public setPosition(x: number, y: number) {
    this.spine.x = x
    this.spine.y = y
  }

  /** 缓动移动过去（丝滑感拉满） */
  public moveTo(x: number, y: number, duration = 1) {
    // 停止当前走路
    this.stop()
    const startX = this.spine.x
    const startY = this.spine.y
    const endX = x
    const endY = y
    let elapsed = 0

    const ticker = (delta: number) => {
      elapsed += delta / 60 // 转为秒
      const t = Math.min(elapsed / duration, 1)
      // 线性插值（可用 easeInOut 替换更丝滑）
      this.spine.x = startX + (endX - startX) * t
      this.spine.y = startY + (endY - startY) * t
      if (t >= 1) {
        PIXI.Ticker.shared.remove(ticker)
      }
    }
    PIXI.Ticker.shared.add(ticker)
  }

  /** 每帧更新（私有） */
  private update(delta: number) {
    if (this.isWalking) {
      this.spine.x += this.direction * this.speed * delta // 帧率无关！更平滑！
    }
  }
  /** 清理（切换场景或销毁角色时调用） */
  public destroy() {
    PIXI.Ticker.shared.remove(this.update, this)
  }
  /**获取当前坐标点 */
  public getPosition(){
    return {x:this.spine.x,y:this.spine.y}
  }
}