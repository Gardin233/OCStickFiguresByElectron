// src/main/hooks/uiohook.ts
import { EventType, uIOhook, UiohookKeyboardEvent, UiohookMouseEvent, UiohookWheelEvent, WheelDirection } from 'uiohook-napi';
import { win } from '../../main.js';
import { convertToLocal } from '../utils/position.js';
export const InputState:{mouse:UiohookMouseEvent,wheel:UiohookWheelEvent
  keyboard:UiohookKeyboardEvent} = {
  mouse: {
    type: EventType.EVENT_MOUSE_CLICKED,
    time: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    x: 0,
    y: 0,
    button: undefined,
    clicks: 0
  },
  wheel:{
    type: EventType.EVENT_MOUSE_WHEEL,
    time: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    x: 0,
    y: 0,
    clicks: 0,
    amount: 0,
    direction: WheelDirection.VERTICAL,
    rotation: 0
  },
  keyboard: {
    type: EventType.EVENT_KEY_PRESSED,
    time: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    keycode: 0
  },
};

export function startGlobalHooks() {
  if (!win) return;
  uIOhook.start();
  uIOhook.on('mousemove', (e) => {
    const pos = convertToLocal(win, e.x, e.y);
    InputState.mouse = InputState.mouse = {
    type: e.type,
    time: e.time,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
    x: pos.x,
    y: pos.y,
    button: e.button,
    clicks: e.clicks
  };
    InputState.mouse.x =pos.x
    InputState.mouse.y =pos.y
  });

  uIOhook.on('mousedown', (e) => {
    const pos = convertToLocal(win, e.x, e.y);
    InputState.mouse ={
    type: e.type,
    time: e.time,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
    x: pos.x,
    y: pos.y,
    button: e.button,
    clicks: e.clicks
  };
    InputState.mouse.x =pos.x
    InputState.mouse.y =pos.y
  });

  uIOhook.on('mouseup', (e) => {
    const pos = convertToLocal(win, e.x, e.y);
    InputState.mouse ={
    type: e.type,
    time: e.time,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
    x: pos.x,
    y: pos.y,
    button: e.button,
    clicks: e.clicks
  };
    InputState.mouse.x =pos.x
    InputState.mouse.y =pos.y
  });

  uIOhook.on('keydown', (e) => {
    InputState.keyboard ={
    type: e.type,
    time: e.time,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
    keycode: e.keycode
  };
  });

  uIOhook.on('keyup', (e) => {
    InputState.keyboard={
    type: e.type,
    time: e.time,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
    keycode: e.keycode
  };
  });
  uIOhook.on("wheel",(e)=>{
    InputState.wheel ={
    type: e.type,
    time: e.time,
    altKey: e.altKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    shiftKey: e.shiftKey,
    x: e.x,
    y: e.y,
    amount: e.amount,
    clicks: e.clicks,
    direction: e.direction,
    rotation: e.rotation,
  };
  })
  
}