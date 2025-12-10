import { fullScreenFilter, icon } from "./desktop.js";

// electron-api.d.ts
export {}
declare global {
  interface Window {
    electronAPI: {
    changeScreenFilter:(type:fullScreenFilter)=>Promise<any>
    openDesktopIcon: (name: string) => Promise<any>,
    getDesktopIcons:(callback:(icons:icon[])=>void)=>void
    openEXE: (path: string) => Promise<any>;
    onGlobalMouseMove: (callback: (pos: { x: number; y: number }) => void) => void;
    onGlobalMouseDown: (callback: (data: { x: number; y: number; button: number }) => void) => void;
    onGlobalMouseUp: (callback: (data: { x: number; y: number; button: number }) => void) => void;
    onGlobalKeyDown: (callback: (ev: { keycode: number; ctrl: boolean; alt: boolean; shift: boolean }) => void) => void;
    onGlobalKeyUp: (callback: (ev: { keycode: number; ctrl: boolean; alt: boolean; shift: boolean }) => void) => void;
  }
}
}
