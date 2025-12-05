import { icon } from "./desktop.js";

// electron-api.d.ts
export {}
declare global {
  interface Window {
    electronAPI: {
    getDesktopIcons:(callback:(icons:icon[])=>void)=>void
    openEXE: (path: string) => Promise<any>;
    simulateDoubleClick: (pos: { x: number; y: number }) => void;
    onGlobalMouseMove: (callback: (pos: { x: number; y: number }) => void) => void;
    onGlobalMouseDown: (callback: (data: { x: number; y: number; button: number }) => void) => void;
    onGlobalKeyDown: (callback: (ev: { keycode: number; ctrl: boolean; alt: boolean; shift: boolean }) => void) => void;
  }
}
}
