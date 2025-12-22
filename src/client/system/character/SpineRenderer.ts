import * as PIXI from 'pixi.js'
import { Spine } from '@pixi-spine/runtime-3.8'
import { app } from '../../../renderer.js'

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

// 建议更名为更直观的名字，如 loadModel 或 loadFromJson
async loadModel(jsonUrl: string): Promise<void> {
  console.log("加载路径:", jsonUrl);

  // 1. 基础校验
  if (!jsonUrl) {
    const tip = new PIXI.Text('未找到 Spine 配置文件', {
      fill: 0xffffff,
      fontSize: 24,
    });
    tip.position.set(20, 20);
    this.stage.addChild(tip);
    throw new Error('No spine json file');
  }

  // 2. 用 Promise 包装加载过程
  await new Promise<void>((resolve, reject) => {
    // 这里的 PIXI.Loader.shared 是 PIXI v6 及以下版本的写法
    PIXI.Loader.shared
      .reset() 
      .add('model', jsonUrl)
      .load((loader, resources) => {
        const resource = resources.model as any;
        const spineData = resource?.spineData;

        if (!spineData) {
          reject(new Error(`加载 Spine 数据失败: ${jsonUrl}`));
          return;
        }

        // 清理旧模型（如果有）
        if (this.spine) {
          this.container.removeChild(this.spine);
          this.spine.destroy();
        }

        this.spine = new Spine(spineData);
        this.container.addChild(this.spine);

        this.spine.scale.set(MODEL_SCALE);
        this.updatePosition();

        console.log('Spine 加载成功，可用动画：', 
          this.spine.spineData.animations.map(a => a.name)
        );

        resolve();
      });
  });
}

  /** 统一的位置更新 */
  private updatePosition() {
    if (!this.spine) return
    const { width, height } = app.screen || app.renderer.screen
    this.spine.x = width / 2.5
    this.spine.y = height * 1.01
  }
  public destory(){
      if (this.container?.parent) {
      this.container.parent.removeChild(this.container)
    }

    // 2. 销毁 Pixi / Spine 对象
    this.container?.destroy({ children: true })
    this.spine?.destroy?.()
  }
}