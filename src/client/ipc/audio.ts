import { AudioController } from "../system/Audio/AudioController.js";

export class AudioIPC{
    private audioController:AudioController
    constructor(auc:AudioController){
        this.audioController=auc
    }
    public Init(){
        this.loadBGMFiles();this.loadSFXFiles()
        this.unloadBGM();this.unloadSFX()
        this.preloadBGM();this.preloadSFX()
        this.releaseBGM();this.releaseSFX()
        this.mixBGM();this.mixSFX()
        this.playBGM();this.playSFX()
        this.removeBGM();this.removeSFX()
    }
    private loadBGMFiles(){
        window.electronAPI.audio.loadBGMFiles((bgms)=>{
            this.audioController.BGMM.load(bgms)
        })
    }
    private loadSFXFiles(){
        window.electronAPI.audio.loadSFXFiles((sfxs)=>{
            this.audioController.SFMM.load(sfxs)
        })
    }
    private unloadBGM(){
        window.electronAPI.audio.unloadBGM((id)=>{
            this.audioController.BGMM.unload(id)
        })
    }
    private unloadSFX(){
        window.electronAPI.audio.unloadSFX((id)=>{
            this.audioController.SFMM.unload(id)
        })
    }
    private preloadBGM(){
        window.electronAPI.audio.preloadBGM(async(id)=>{
            await this.audioController.BGMM.preload(id).catch(err => console.error(err))
        })
    }
    private preloadSFX(){
        window.electronAPI.audio.preloadSFX((id)=>{
            this.audioController.SFMM.preload(id)
        })
    }
    private releaseBGM(){
        window.electronAPI.audio.releaseBGM((id)=>{
            this.audioController.BGMM.release(id)
        })
    }
    private releaseSFX(){
        window.electronAPI.audio.releaseSFX((id)=>{
            this.audioController.SFMM.release(id)
        })
    }
    private mixBGM(){
        window.electronAPI.audio.mixBGM((id)=>{
            this.audioController.BGMM.mix(id)
        })
    }
    private mixSFX(){
        window.electronAPI.audio.mixSFX((id)=>{
            this.audioController.SFMM.mix(id)
        })
    }
    private playBGM(){
        window.electronAPI.audio.playBGM((id,data)=>{
            this.audioController.BGMM.play(id,data)
        })
    }
    private playSFX(){
        window.electronAPI.audio.playSFX((id,data)=>{
            this.audioController.SFMM.play(id,data)
        })
    }
    private removeBGM(){
        window.electronAPI.audio.removeBGM((id)=>{
            // this.audioController.BGMM.
        })
    }
    private removeSFX(){
        window.electronAPI.audio.removeSFX((id)=>{
            // this.audioController
        })
    }
}