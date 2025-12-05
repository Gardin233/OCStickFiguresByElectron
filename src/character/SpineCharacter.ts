import * as PIXI from 'pixi.js'
import { Attachment,BoundingBoxAttachment, Spine } from '@pixi-spine/runtime-3.8'
import { AttachmentType } from 'pixi-spine'
import { app } from '../renderer.js'
import { characterAnimation } from '../types/animation.js'
import { pointToSegmentDistance } from '../client/utils/pos.js'
import { win } from '../main.js'


/**
 * 控制 Spine 角色显示与交互的类
 * @param container - PIXI容器：承载 Spine 动画对象和交互区域
 * @param spine -Spine 动画实例
 * @param loader - PIXI 全局资源加载器
 * @param stage - 主舞台容器  
 * @param boundingBoxes - 碰撞箱边框图形数组,存储边框图形
 * World(全局屏幕坐标)
 * └─ container(整体移动/旋转/缩放)
 *    └─ Spine(骨骼坐标系原点)
 *     └─ Bone + Slot + Attachment(子局部坐标)

 */
const MODEL_SCALE = 0.2

export class SpineCharacter {
  public container: PIXI.Container
  private spine!: Spine
  private loader = PIXI.Loader.shared
  private stage: PIXI.Container
  private boundingBoxes: PIXI.Graphics[] = []; 
  private speed = 0.25;
  private isWalking = false
  private toLeft = true
  public state:characterAnimation='stand'
  constructor(stage: PIXI.Container) {
    this.stage = stage
    this.container = new PIXI.Container()
    this.container.interactive = true // 允许点击事件
    this.stage.addChild(this.container)
    // 监听窗口大小变化，动态更新模型位置及点击区域
    window.addEventListener('resize', this.onResize.bind(this))
    app.ticker.add(() => {
    // 每帧更新位置
    if(this.isWalking) {
       this.spine.x += (this.toLeft ? -1 : 1) * this.speed; 
    }
     
    })
  }

  /**
   * 通过 Vite / Webpack 的 glob 导入 Spine 模型文件
   * @param globPattern - 文件映射，如 {"model": "/assets/spine/stickman.json"}
   */
  async loadFromGlob(globPattern: Record<string, string>) {
    const jsonUrl = Object.values(globPattern)[0]

    if (!jsonUrl) {
      // 未找到模型时给出提示
      const text = new PIXI.Text(
        '请将 Spine 3.8 模型放入 assets/spine 文件夹',
        { fill: 0xffffff }
      )
      text.x = 20
      text.y = 20
      text.alpha = 0.8
      this.stage.addChild(text)
      return
    }

    // 加载 Spine JSON 模型
    this.loader.add('model', jsonUrl).load((loader, resources) => {
      const res = resources['model'] as any

      // 创建 Spine 动画对象并添加到容器
      this.spine = new Spine(res.spineData)
      this.container.addChild(this.spine)

      // 设置模型缩放、初始位置
      this.spine.scale.set(MODEL_SCALE)
      this.spine.x = app.renderer.width / 2.5
      this.spine.y = app.renderer.height /1
      console.log('动画列表:', this.spine.spineData.animations)

      // 播放默认动画
      this.spine.state.setAnimation(0, 'stand', true)
    })
  }


  /**
   * 点在多边形内判定
   * @param x 点X
   * @param y 点Y
   * @param verts 多边形顶点数组 [x0,y0,x1,y1,...]
   */
private pointInPolygon(x: number, y: number, verts: number[]): boolean {
    let inside = false;
    for (let i = 0, j = verts.length / 2 - 1; i < verts.length / 2; j = i++) {
      const xi = verts[i * 2], yi = verts[i * 2 + 1];
      const xj = verts[j * 2], yj = verts[j * 2 + 1];
      const intersect = ((yi > y) !== (yj > y)) &&
                        (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * 返回命中的 BoundingBox 名称
   * @param globalX 屏幕坐标X
   * @param globalY 屏幕坐标Y
   */
public getHitBoundingBox(globalX: number, globalY: number): string | null {
  if (!this.spine) return null;
  const skeleton = this.spine.skeleton;
  skeleton.updateWorldTransform();

  for (const slot of skeleton.slots) {
    const attachment = slot.getAttachment();
    if (!attachment || attachment.type !== AttachmentType.BoundingBox) continue;
    const bb = attachment as BoundingBoxAttachment;
    const verts: number[] = new Array(bb.worldVerticesLength);
    bb.computeWorldVertices(slot, 0, bb.worldVerticesLength, verts, 0, 2);    
    const scaleX = this.spine.scale.x;
    const scaleY = this.spine.scale.y;

    for (let i = 0; i < verts.length; i += 2) {
      verts[i] = verts[i] * scaleX + this.spine.x;
      verts[i + 1] = verts[i + 1] * scaleY + this.spine.y;
    }

    // 将顶点从 Spine 坐标统一转换为全局坐标
    for (let i = 0; i < verts.length; i += 2) {
      const p = this.container.toGlobal(new PIXI.Point(verts[i], verts[i + 1]));
      // console.log('转换后点:', p);
      verts[i] = p.x;
      verts[i + 1] = p.y;
    }
    if (this.pointInPolygon(globalX, globalY, verts)) {
      console.log('命中碰撞箱:', slot.data.name);
      return slot.data.name;
    }
  }

  console.log('未命中任何碰撞箱');
  return null;
}
/**
 * 点到线段的最短距离
 */

/**
 * 获取离鼠标最近的碰撞箱名称 + 该碰撞箱的距离
 */
public getClosestBoundingBox(globalX: number, globalY: number): {
  name: string | null,
  distance: number
} {
  if (!this.spine) return { name: null, distance: Infinity };

  const skeleton = this.spine.skeleton;
  skeleton.updateWorldTransform();

  let closestName: string | null = null;
  let minDist = Infinity;

  for (const slot of skeleton.slots) {
    const attachment = slot.getAttachment();
    if (!attachment || attachment.type !== AttachmentType.BoundingBox) continue;

    const bb = attachment as BoundingBoxAttachment;
    const verts: number[] = new Array(bb.worldVerticesLength);
    bb.computeWorldVertices(slot, 0, bb.worldVerticesLength, verts, 0, 2);

    // 局部坐标→全局坐标
    const worldVerts: number[] = []
    for (let i = 0; i < verts.length; i += 2) {
      const p = this.spine.toGlobal(new PIXI.Point(verts[i], verts[i + 1]));
      worldVerts.push(p.x, p.y);
    }

    // 如果点在多边形内 → 为0，直接返回最近
    if (this.pointInPolygon(globalX, globalY, worldVerts)) {
      return { name: slot.data.name, distance: 0 };
    }

    // 点到多边形每条边求最小距离
    let dist = Infinity;
    for (let i = 0; i < worldVerts.length; i += 2) {
      const x1 = worldVerts[i];
      const y1 = worldVerts[i + 1];
      const j = (i + 2) % worldVerts.length;
      const x2 = worldVerts[j];
      const y2 = worldVerts[j + 1];
      const d = pointToSegmentDistance(globalX, globalY, x1, y1, x2, y2);
      if (d < dist) dist = d;
    }
    if (dist < minDist) {
      minDist = dist;
      closestName = slot.data.name;
    }
  }
  return { name: closestName, distance: minDist };
}

/**
 * 显示 Spine 碰撞箱的真实范围
 * 每帧调用以跟随动画实时更新
 */
public debugBoundingBoxes() {
  if (!this.spine) return;
  const skeleton = this.spine.skeleton;
  skeleton.updateWorldTransform();

  let index = 0;
  for (const slot of skeleton.slots) {
    const attachment = slot.getAttachment();
    if (!attachment || attachment.type !== AttachmentType.BoundingBox) continue;
    const bb = attachment as BoundingBoxAttachment;
    const vertsCount = bb.worldVerticesLength;
    const verts: number[] = new Array(vertsCount);
    bb.computeWorldVertices(slot, 0, vertsCount, verts, 0, 2);
    let g: PIXI.Graphics;
    if (this.boundingBoxes[index]) {
      g = this.boundingBoxes[index];
      g.clear();
    } else {
      g = new PIXI.Graphics();
      this.container.addChild(g);
      this.boundingBoxes.push(g);
    }
    g.lineStyle(2, 0xff0000);
    // Spine 世界坐标 → 屏幕坐标
    const first = this.spine.toGlobal(new PIXI.Point(verts[0], verts[1]));
    g.moveTo(first.x, first.y);

    for (let i = 2; i < verts.length; i += 2) {
      const p = this.spine.toGlobal(new PIXI.Point(verts[i], verts[i + 1]));
      g.lineTo(p.x, p.y);
    }
    g.lineTo(first.x, first.y);

    index++;
  }
}

  /**
   * @descriptionq 设置模型位置
   * @param x  X坐标
   * @param y  Y坐标
   * @
   */
public setPosition(x: number, y: number) {
    if (!this.spine) return
    this.spine.x = x
    this.spine.y = y
  }
  /**
   * 窗口尺寸变化时更新模型与点击区域
   */
  private onResize() {
    if (!this.spine) return

    // 更新模型位置
    this.spine.x = app.renderer.width / 2.5
    this.spine.y = app.renderer.height * 1.01

  }
  public jump() {
    if (!this.spine) return
    this.spine.state.setAnimation(0, 'jump', false)
    this.spine.state.addAnimation(0, 'stand', true, 0)
  }
  public walk(toLeft: boolean)  {
    this.isWalking = true
    this.spine.state.setAnimation(0, 'walk', true)
    this.toLeft = toLeft 
    // 翻转模型方向（仅x轴镜像）
    this.spine.scale.x = (this.toLeft ? 1 : -1) * Math.abs(this.spine.scale.x);
    
  }
  public stopWalk() {
  this.isWalking = false
  this.spine.state.setAnimation(0, 'stand', true)
  }
  public holdHead() {
    this.spine.state.setAnimation(0, 'holdHead', false)
    // this.spine.state.addAnimation(0, 'stand', true, 0)
  }
  public lookAround() {
    this.spine.state.setAnimation(0, 'lookAround', false)
    this.spine.state.addAnimation(0, 'stand', true, 0)
  }
  public doubleClick(x:number,y:number) {
    console.log('双击事件触发')
    this.spine.state.setAnimation(0, 'open', false)
    window.electronAPI.simulateDoubleClick({x:x,y:y})
}
}
