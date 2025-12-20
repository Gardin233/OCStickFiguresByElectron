import * as PIXI from 'pixi.js';
import type { icon } from './types/desktop.js';
import { CharacterIPC } from './client/ipc/character.js';
import { SpineCharacter } from './client/system/character/SpineCharacter.js';
export let ICONS:icon[] =[]

// 创建 PixiJS 应用
export const app = new PIXI.Application({
  resizeTo: window,
  backgroundAlpha: 0,
  antialias: true,
});
document.body.appendChild(app.view);

async function boot() {

  // console.log('角色加载完成', character);
  // 事件绑定要在实例创建之后
  if (!window.electronAPI) console.warn('electronAPI 未定义，事件绑定失败');
//   setInterval(async()=>{
//   //清空标记点
//   app.stage.children.forEach(child => {
//     //@ts-ignore 
//     if (child.isIconDot) app.stage.removeChild(child);
//   });
//   // for (const item of ICONS) {
//   //   // 创建一个小圆点表示图标
//   //   const dot = new PIXI.Graphics();
//   //   dot.beginFill(0xff0000); // 红色
//   //   dot.drawCircle(0, 0, 5); // 半径 5
//   //   dot.endFill();
//   //   //@ts-ignore 
//   //   dot.isIconDot = true; // 标记方便下次清除
//   //   dot.x = item.position.x+20;
//   //   dot.y = item.position.y+15;
//   //   app.stage.addChild(dot);
    
//   // }
// },2000)
const characters:Record<string,SpineCharacter>={}
const chara=new CharacterIPC(characters)
chara.Init()

// setInterval(() => {
  //   // character.debugBoundingBoxes();
  // }, 16); // 大约每帧发送一次 (60 FPS)
}
// 调用 boot，并捕获异常
boot().catch(err => {
  console.error('Boot 出错:', err);
});
