import * as PIXI from 'pixi.js';
import { SpineCharacter } from './client/character/SpineCharacter.js';
import type { icon } from './types/desktop.js';
import { MixedLayer } from './client/effectsLayer/mixedLayer.js';
let ICONS:icon[] =[]
// 创建 PixiJS 应用
export const app = new PIXI.Application({
  resizeTo: window,
  backgroundAlpha: 0,
  antialias: true,
});
document.body.appendChild(app.view);

async function boot() {
  // 先确保 SpineCharacter 类已正确导入
  if (!SpineCharacter) {
    throw new Error('SpineCharacter 未定义，请检查导入路径');
  }

  // 加载 Spine JSON 资源
  const spineJsons = import.meta.glob(
    '/assets/spine/**/*.json',
    { query: '?url', import: 'default', eager: true }
  ) as Record<string, string>;
  // 创建角色实例，并传入舞台
  const character = new SpineCharacter(app.stage);
  // 等待角色加载完成
  await character.loadFromGlob(spineJsons);
  // 事件绑定要在实例创建之后
  if (!window.electronAPI) console.warn('electronAPI 未定义，事件绑定失败');
    //鼠标移动
  window.electronAPI.onGlobalMouseMove(pos => {
    // console.log('mouse move', pos);
    let closedBB = character.getClosestBoundingBox(pos.x, pos.y);
    if (character.state!=='holdHead'&&closedBB.name==="Head"&&closedBB.distance<20) {
        character.holdHead();
      }
  });



  //TODO:滤镜


window.electronAPI.getDesktopIcons(icons => {
  ICONS=icons
  console.log('图标数据:', icons);

  for (const item of icons) {
    // 创建一个小圆点表示图标
    const dot = new PIXI.Graphics();
    dot.beginFill(0xff0000); // 红色
    dot.drawCircle(0, 0, 5); // 半径 5
    dot.endFill();

    // 设置位置
    dot.x = item.position.x+20;
    dot.y = item.position.y+15;
    // 添加到舞台
    app.stage.addChild(dot);
  }
});

  window.electronAPI.onGlobalMouseDown(info => {
    character.getHitBoundingBox(info.x, info.y);
    console.log("closed bb",character.getClosestBoundingBox(info.x, info.y))
    // character.walk(true)
    console.log('mouse down', info);
  });

  window.electronAPI.onGlobalKeyDown(ev => {
    console.log('key down', ev.keycode, ev.ctrl, ev.alt, ev.shift);
    switch(ev.keycode) {
      case 30: // A:
        character.walk(true);
        break;
      case 32: // D:
        character.walk(false);
        break;
      case 17: // W:
        character.jump();
        break;
      case 18: // E:
        character.openDeskTopIcon(ICONS[0].target);
        break;
      case 33: // F:
          character.lookAround();
          break;
    }
  });
  
    
  
  // setInterval(() => {
  //   // character.debugBoundingBoxes();
  // }, 16); // 大约每帧发送一次 (60 FPS)
  console.log('角色加载完成', character);
}




// 调用 boot，并捕获异常
boot().catch(err => {
  console.error('Boot 出错:', err);
});
