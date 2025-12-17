import * as PIXI  from 'pixi.js' 
import { SpineCharacter } from "./SpineCharacter.js";
import { AttachmentType } from 'pixi-spine';
import { BoundingBoxAttachment, Spine } from '@pixi-spine/runtime-3.8'
import { pointToSegmentDistance } from '../../utils/pos.js'

/**
 * @description 
 * 碰撞箱检测类
 * 
 */
export class HitChecker{
    private boundingBoxes: PIXI.Graphics[] = []; 
    constructor(private character: SpineCharacter){}
      /**
       * 返回命中的 BoundingBox 名称
       * @param globalX 屏幕坐标X
       * @param globalY 屏幕坐标Y
       */
    public getHitBoundingBox(globalX: number, globalY: number): string | null {
      if (!this.character.renderer.spine) return null;
      const skeleton = this.character.renderer.spine.skeleton;
      skeleton.updateWorldTransform();
    
      for (const slot of skeleton.slots) {
        const attachment = slot.getAttachment();
        if (!attachment || attachment.type !== AttachmentType.BoundingBox) continue;
        const bb = attachment as BoundingBoxAttachment;
        const verts: number[] = new Array(bb.worldVerticesLength);
        bb.computeWorldVertices(slot, 0, bb.worldVerticesLength, verts, 0, 2);    
        const scaleX = this.character.renderer.spine.scale.x;
        const scaleY = this.character.renderer.spine.scale.y;
    
        for (let i = 0; i < verts.length; i += 2) {
          verts[i] = verts[i] * scaleX + this.character.renderer.spine.x;
          verts[i + 1] = verts[i + 1] * scaleY + this.character.renderer.spine.y;
        }
    
        // 将顶点从 Spine 坐标统一转换为全局坐标
        for (let i = 0; i < verts.length; i += 2) {
          const p = this.character.renderer.container.toGlobal(new PIXI.Point(verts[i], verts[i + 1]));
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
    public getBoxs(){
      const data =[]
        const skeleton = this.character.renderer.spine.skeleton;
      skeleton.updateWorldTransform();
         for (const slot of skeleton.slots) {
        const attachment = slot.getAttachment();
        if (!attachment || attachment.type !== AttachmentType.BoundingBox) continue;
        const bb = attachment as BoundingBoxAttachment;
        const verts: number[] = new Array(bb.worldVerticesLength);
        bb.computeWorldVertices(slot, 0, bb.worldVerticesLength, verts, 0, 2);    
        const scaleX = this.character.renderer.spine.scale.x;
        const scaleY = this.character.renderer.spine.scale.y;
    
        for (let i = 0; i < verts.length; i += 2) {
          verts[i] = verts[i] * scaleX + this.character.renderer.spine.x;
          verts[i + 1] = verts[i + 1] * scaleY + this.character.renderer.spine.y;
        }
    
        // 将顶点从 Spine 坐标统一转换为全局坐标
        for (let i = 0; i < verts.length; i += 2) {
          const p = this.character.renderer.container.toGlobal(new PIXI.Point(verts[i], verts[i + 1]));
          // console.log('转换后点:', p);
          verts[i] = p.x;
          verts[i + 1] = p.y;
        }
      data.push({name:slot.data.name,verts:verts})
      }
      return data
    }
    /**
     * 获取离鼠标最近的碰撞箱名称 + 该碰撞箱的距离
     */
    public getClosestBoundingBox(globalX: number, globalY: number): {name: string | null,distance: number} {
      if (!this.character.renderer.spine) return { name: null, distance: Infinity };
    
      const skeleton = this.character.renderer.spine.skeleton;
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
          const p = this.character.renderer.spine.toGlobal(new PIXI.Point(verts[i], verts[i + 1]));
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
    //获取所有碰撞箱距离指定坐标的距离
    public getBoundingBoxDistance(globalX: number, globalY: number): {name: string | null,distance: number} []{
      if (!this.character.renderer.spine) return [{ name: null, distance: Infinity }];
    
      const skeleton = this.character.renderer.spine.skeleton;
      skeleton.updateWorldTransform();
    
      let closestName: string | null = null;
    
      const data:{ name: string, distance: number}[] =[]
      for (const slot of skeleton.slots) {
        const attachment = slot.getAttachment();
        if (!attachment || attachment.type !== AttachmentType.BoundingBox) continue;
    
        const bb = attachment as BoundingBoxAttachment;
        const verts: number[] = new Array(bb.worldVerticesLength);
        bb.computeWorldVertices(slot, 0, bb.worldVerticesLength, verts, 0, 2);
    
        // 局部坐标→全局坐标
        const worldVerts: number[] = []
        for (let i = 0; i < verts.length; i += 2) {
          const p = this.character.renderer.spine.toGlobal(new PIXI.Point(verts[i], verts[i + 1]));
          worldVerts.push(p.x, p.y);
        }
        let dist = Infinity;
        // 如果点在多边形内 → 为0，直接返回最近
        if (this.pointInPolygon(globalX, globalY, worldVerts)) {
           dist = 0;
        }
    
        // 点到多边形每条边求最小距离
        
        for (let i = 0; i < worldVerts.length; i += 2) {
          const x1 = worldVerts[i];
          const y1 = worldVerts[i + 1];
          const j = (i + 2) % worldVerts.length;
          const x2 = worldVerts[j];
          const y2 = worldVerts[j + 1];
          const d = pointToSegmentDistance(globalX, globalY, x1, y1, x2, y2);
          if (d < dist) dist = d;
        }
        data.push({name:slot.data.name,distance:dist}) 
      }
      return data
    }
    /**
     * 显示 Spine 碰撞箱的真实范围
     * 每帧调用以跟随动画实时更新
     */
    public debugBoundingBoxes() {
      if (!this.character.renderer.spine) return;
      const skeleton = this.character.renderer.spine.skeleton;
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
          this.character.renderer.container.addChild(g);
          this.boundingBoxes.push(g);
        }
        g.lineStyle(2, 0xff0000);
        // Spine 世界坐标 → 屏幕坐标
        const first = this.character.renderer.spine.toGlobal(new PIXI.Point(verts[0], verts[1]));
        g.moveTo(first.x, first.y);
    
        for (let i = 2; i < verts.length; i += 2) {
          const p = this.character.renderer.spine.toGlobal(new PIXI.Point(verts[i], verts[i + 1]));
          g.lineTo(p.x, p.y);
        }
        g.lineTo(first.x, first.y);
    
        index++;
      }
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


}