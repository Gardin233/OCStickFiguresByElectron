// MixedLayer.ts 
import * as PIXI from "pixi.js"

/**
 * @description
 * MixedLayer 混合层类
 * 用于在屏幕顶层添加滤镜效果（如反色、模糊、颜色矩阵等）
 * 但因为局限于pixijs的图层，而非我希望的整个屏幕预计将用其他解决办法解决
 */
export class MixedLayer {
  private app: PIXI.Application       // PIXI 应用实例
  private layer: PIXI.Container        // 最上层容器，用来挂滤镜
  private overlay: PIXI.Graphics       // 透明全屏图形，用于让滤镜产生作用
  private filters: PIXI.Filter[] = []  // 当前应用的所有滤镜
  private enabled = false              // 是否启用该层（可见性）

  constructor(app: PIXI.Application) {
    this.app = app

    this.layer = new PIXI.Container()
    this.layer.zIndex = 99999          // 确保显示在所有内容上层
    this.layer.sortableChildren = true // 支持排序

    // 创建全屏透明覆盖层，承载滤镜
    this.overlay = new PIXI.Graphics()
    this.overlay.beginFill(0xffffff, 0.001) // 几乎完全透明，不影响鼠标
    this.overlay.drawRect(0, 0, window.innerWidth, window.innerHeight)
    this.overlay.endFill()

    this.layer.addChild(this.overlay)
    app.stage.addChild(this.layer)

    // 初始化大小并监听窗口变化
    this.updateSize()
    window.addEventListener("resize", () => this.updateSize())
  }

  /**
   * 调整覆盖层大小，使其一直覆盖窗口
   */
  private updateSize() {
    this.overlay.clear()
    this.overlay.beginFill(0xffffff, 0.001)
    this.overlay.drawRect(0, 0, window.innerWidth, window.innerHeight)
    this.overlay.endFill()
  }

addFilter(filter: PIXI.Filter) {
  if (!this.filters) {
    this.filters = []
  }
  this.filters.push(filter)

  // 关键：重新赋值到渲染层
  this.app.stage.filters = [...this.filters]
}


  /**
   * 动态移除指定滤镜
   */
  removeFilter(filter: PIXI.Filter) {
    this.filters = this.filters.filter(f => f !== filter)
    this.updateFilters()
  }

  /**
   * 清空所有滤镜
   */
  clearFilters() {
    this.filters = []
    this.updateFilters()
  }

  /**
   * 应用当前过滤器数组到层容器
   */
  private updateFilters() {
    this.layer.filters = this.filters.length > 0 ? this.filters : null
  }

  /**
   * 显示混合层及滤镜效果
   */
  enable() {
    this.enabled = true
    this.layer.visible = true
  }

  /**
   * 隐藏混合层，停用滤镜
   */
  disable() {
    this.enabled = false
    this.layer.visible = false
  }
}
