import { AudioPlayData } from "./desktop.js"

// electron-api.d.ts
export {}

declare global {
  interface Window {
    electronAPI: {
      close:()=>void
      minimize:()=>void
      toggleMaximize:()=>void
      character: {
        createNewSpine: (callback: (files: Record<string, string>, id: string) => void) => void
        deleteSpine: (callback: (id: string) => void) => void
        getHitBox: (callback:(id: string)=>void) => Promise<any>
        sendGetHitBox:(id,data)=>void
        sendCheckHit:(id,data)=>void
        checkHit: (callback:(id: string, x: number, y: number)=>void) => Promise<boolean>
        sendGetPosToHitBoxDistance:(id,data)=>void
        getPosToHitboxDistance: (callback:(id: string, x: number, y: number)=>void) => Promise<{ x: number, y: number }>
        showHitBox: (callback:(id: string)=>void) => void
        playAnimation: (callback:(id: string, layer: number, animation: string, isloop: boolean)=>void) => void
        setPos: (callback:(id: string, x: number, y: number)=>void) => void
        moveTo: (callback:(id: string, x: number, y: number, func?: string)=>void) => void
        flip: (callback:(id: string, isLeft: boolean)=>void) => void
      },
      text:{
        createText:(callback:(id: string, content: string, style: any)=>void) => void,
        deleteText:(callback:(id: string)=>void) => void,
        setText:(callback:(id: string, content: string)=>void) => void,
        setStyle:(callback:(id: string, style: any)=>void) => void
      }
    }
  }
}
