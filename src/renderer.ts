import * as PIXI from 'pixi.js';
import { SpineCharacter } from './client/character/SpineCharacter.js';
import type { icon } from './types/desktop.js';
import { MouseMoveEvent,KeyBoardDownEvent, MouseDownEvent, MouseUPEvent, KeyBoardUpEvent } from './client/ipc/iosys.js';
export let ICONS:icon[] =[]

// 创建 PixiJS 应用
export const app = new PIXI.Application({
  resizeTo: window,
  backgroundAlpha: 0,
  antialias: true,
});
document.body.appendChild(app.view);
async function boot() {
  // 加载 Spine JSON 资源
  const spineJsons = import.meta.glob(
    '/assets/spine/**/*.json',
    { query: '?url', import: 'default', eager: true }
  ) as Record<string, string>;
  // 创建角色实例，并传入舞台
  const character = new SpineCharacter(app.stage);
  // 等待角色加载完成
  await character.load(spineJsons)
  // console.log('角色加载完成', character);
  // 事件绑定要在实例创建之后
  if (!window.electronAPI) console.warn('electronAPI 未定义，事件绑定失败');

  setInterval(async()=>{
  // 渲染进程
const icons = await window.electronAPI.getDesktopIcons();
  console.log('图标数据:', icons);
  ICONS=icons
  //清空标记点
  app.stage.children.forEach(child => {
    //@ts-ignore 
    if (child.isIconDot) app.stage.removeChild(child);
  });
  for (const item of ICONS) {
    // 创建一个小圆点表示图标
    const dot = new PIXI.Graphics();
    dot.beginFill(0xff0000); // 红色
    dot.drawCircle(0, 0, 5); // 半径 5
    dot.endFill();
    //@ts-ignore 
    dot.isIconDot = true; // 标记方便下次清除
    dot.x = item.position.x+20;
    dot.y = item.position.y+15;
    app.stage.addChild(dot);
    
  }
},2000)


  //键盘鼠标事件监听注册
  MouseMoveEvent(character)
  KeyBoardDownEvent(character)
  MouseDownEvent(character)
  MouseUPEvent(character)
  KeyBoardUpEvent(character)
  // setInterval(() => {
  //   // character.debugBoundingBoxes();
  // }, 16); // 大约每帧发送一次 (60 FPS)
}
// 调用 boot，并捕获异常
boot().catch(err => {
  console.error('Boot 出错:', err);
});
