// electron-api.d.ts
export {}

declare global {
  interface Window {
    electronAPI: {
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
      }
    }
  }
}
