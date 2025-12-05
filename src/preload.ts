// src/preload.ts

import { win } from "./main.js";
import { convertToLocal } from "./server/utils/position.js";
import { icon } from "./types/desktop.js";

/**
 * @description Preload script for Electron
 * This script is useless because of something I dont know how to solve.
 * So this script is for reference only.
 * The part that actually works is preload.cjs
 * zh-CN:
 * preload script
 * 这个代码没什么用，因为我不知道怎么解决一些问题。
 * 所以这个代码仅供参考。
 * 实际上起作用的是 preload.cjs
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openEXE: (path: string) => ipcRenderer.invoke('open-exe', path),

  onGlobalMouseMove: (callback: (pos: { x: number; y: number }) => void) => {
    ipcRenderer.on('global-mouse-move', (_, pos) => callback(pos))
  },

  onGlobalMouseDown: (callback: (data: { x: number; y: number; button: number }) => void) => {
    ipcRenderer.on('global-mouse-down', (_, info) => callback(info))
  },

  onGlobalKeyDown: (callback: (ev: { keycode: number; ctrl: boolean; alt: boolean; shift: boolean }) => void) => {
    ipcRenderer.on('global-key-down', (_, ev) => callback(ev))
  },
  getDesktopIcons: (callback: (icons: icon[]) => void) => {
  ipcRenderer.on('get-desktop-icons', (_, icons: icon[]) => callback(icons))
},
 simulateDoubleClick: (pos: { x: number; y: number }) => {
    pos =convertToLocal(win,pos.x,pos.y)
    ipcRenderer.send('simulate-double-click', pos);
  }

})
