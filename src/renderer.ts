import * as PIXI from 'pixi.js';
import { SpineCharacter } from './character/SpineCharacter.js';

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
  if (window.electronAPI) {
    window.electronAPI.onGlobalMouseMove(pos => {
      console.log('mouse move', pos);
    });

    window.electronAPI.onGlobalMouseDown(info => {
      character.getHitBoundingBox(info.x, info.y);
      character.isPointInside(info.x, info.y);
      character.walk(true)
      console.log('mouse down', info);
    });

    window.electronAPI.onGlobalKeyDown(ev => {
      console.log('key down', ev.keycode, ev.ctrl, ev.alt, ev.shift);
    });
  } else {
    console.warn('electronAPI 未定义，事件绑定失败');
  }
  setInterval(() => {
    // character.debugBoundingBoxes();
  }, 16); // 大约每帧发送一次 (60 FPS)
  console.log('角色加载完成', character);
}

// 调用 boot，并捕获异常
boot().catch(err => {
  console.error('Boot 出错:', err);
});
