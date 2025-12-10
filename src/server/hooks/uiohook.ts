// src/main/hooks/uiohook.ts
import { uIOhook } from 'uiohook-napi';
import { win } from '../../main.js';
import { convertToLocal } from '../utils/position.js';

export function startGlobalHooks() {
  if (!win) return;
  uIOhook.start();
  uIOhook.on('mousemove', (e) => {
    const pos = convertToLocal(win, e.x, e.y);
    win.webContents.send('global-mouse-move', pos);
  });

  uIOhook.on('mousedown', (e) => {
    const pos = convertToLocal(win, e.x, e.y);
    win.webContents.send('global-mouse-down', { ...pos, button: e.button });
  });

  uIOhook.on('mouseup', (e) => {
    const pos = convertToLocal(win, e.x, e.y);
    win.webContents.send('global-mouse-up', { ...pos, button: e.button });
  });

  uIOhook.on('keydown', (e) => {
    win.webContents.send('global-key-down', {
      keycode: e.keycode,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      shift: e.shiftKey,
    });
  });

  uIOhook.on('keyup', (e) => {
    win.webContents.send('global-key-up', {
      keycode: e.keycode,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      shift: e.shiftKey,
    });
  });

  
}