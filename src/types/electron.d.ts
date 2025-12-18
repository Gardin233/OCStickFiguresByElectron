import { AudioPlayData } from "./desktop.js"

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
      },
      audio:{
        //注册音频文件
        loadBGMFiles:(callback:(BGMs:{id:string,url:string}[])=>void)=>void,
        loadSFXFiles:(callback:(SFXs:{id:string,url:string}[])=>void)=>void,
        //删除注册
        unloadBGM:(callback:(id:string)=>void)=>void,
        unloadSFX:(callback:(id:string)=>void)=>void, 
        //预载
        preloadBGM:(callback:(id:string)=>void)=>void,
        preloadSFX:(callback:(id:string)=>void)=>void,
        //卸载
        releaseBGM:(callback:(id:string)=>void)=>void,
        releaseSFX:(callback:(id:string)=>void)=>void,
        //压入混合层
        mixBGM:(callback:(id:string)=>void)=>void,
        mixSFX:(callback:(id:string)=>void)=>void,
        //启用播放
        playBGM:(callback:(id:string,data:AudioPlayData)=>void)=>void,
        playSFX:(callback:(id:string,data:AudioPlayData)=>void)=>void,
        //移出混合层
        removeBGM:(callback:(id:string)=>void)=>void,
        removeSFX:(callback:(id:string)=>void)=>void,
            
      }
    }
  }
}
