import * as PIXI from 'pixi.js'
import { Spine } from '@pixi-spine/runtime-3.8'
import { app } from '../../renderer.js'

const MODEL_SCALE = 0.2

export class SpineRenderer {
  public container = new PIXI.Container()
  public spine!: Spine
  private stage: PIXI.Container

  constructor(stage: PIXI.Container) {
    this.stage = stage
    this.stage.addChild(this.container)
    this.container.interactive = true

    // 窗口变化自动更新位置
    window.addEventListener('resize', () => this.updatePosition())
  }

  async loadFromGlob(globPattern: Record<string, string>): Promise<void> {
    const jsonUrl = Object.values(globPattern)[0]

    if (!jsonUrl) {
      const tip = new PIXI.Text('请将 Spine 模型放入 assets/spine 文件夹', {
        fill: 0xffffff,
        fontSize: 24,
      })
      tip.position.set(20, 20)
      this.stage.addChild(tip)
      throw new Error('No spine json file')
    }

    // 用 Promise 包住 PIXI Loader 的回调
    await new Promise<void>((resolve, reject) => {
      PIXI.Loader.shared
        .reset() // 防止重复加载
        .add('model', jsonUrl)
        .load((loader, resources) => {
          const spineData = (resources.model as any)?.spineData
          if (!spineData) {
            reject(new Error('加载 Spine 数据失败'))
            return
          }
          this.spine = new Spine(spineData)
          this.container.addChild(this.spine)

          this.spine.scale.set(MODEL_SCALE)
          this.updatePosition()

          // 默认播放站立
          this.spine.state.setAnimation(0, 'stand', true)
          console.log('Spine 加载成功，可用动画：', this.spine.spineData.animations.map(a => a.name))

          resolve()
        })
    })
  }

  /** 统一的位置更新 */
  private updatePosition() {
    if (!this.spine) return
    const { width, height } = app.screen || app.renderer.screen
    this.spine.x = width / 2.5
    this.spine.y = height * 1.01
  }
}