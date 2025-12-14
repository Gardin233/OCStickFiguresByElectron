// electron-api.d.ts
export {}

declare global {
  interface Window {
    electronAPI: {
      character: {
        createNewSpine: (callback: (files: Record<string, string>, id: string) => void) => void
        deleteSpine: (callback: (id: string) => void) => void
        getHitBox: (id: string) => Promise<any>
        showHitBox: (callback:(id: string)=>void) => void
        checkHit: (id: string, x: number, y: number) => Promise<boolean>
        getPosToHitboxInstance: (id: string, x: number, y: number) => Promise<{ x: number, y: number }>
        playAnimation: (callback:(id: string, layer: number, animation: string, isloop: boolean)=>void) => void
        setPos: (callback:(id: string, x: number, y: number)=>void) => void
        moveTo: (callback:(id: string, x: number, y: number, func?: string)=>void) => void
        flip: (callback:(id: string, isLeft: boolean)=>void) => void
      }
    }
  }
}
