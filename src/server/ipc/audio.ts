import { BrowserWindow } from "electron";
import { win } from "../../main.js";

export class AudioIPCSender{
    // private Mywin:BrowserWindow
    constructor(window) {
        // this.win=window
    }
    public static loadBGMFiles(bgms){
        win.webContents.send('load-bgm-files',bgms)
    }
    public static loadSFXFiles(id){
        win.webContents.send('load-sfx-files',id)
    }
    public static unloadBGM(id){
        win.webContents.send('unload-bgm',id)
    }
    public static unloadSFX(id){
        win.webContents.send('unload-sfx',id)
    }
    public static preloadBGM(id){
        win.webContents.send('preload-bgm',id)
    }
    public static preloadSFX(id){
        win.webContents.send('preload-sfx',id)
    }
    public static releaseBGM(id){
        win.webContents.send('release-bgm',id)
    }
    public static releaseSFX(id){
        win.webContents.send('release-sfx',id)
    }
    public static mixBGM(id){
        win.webContents.send('mix-bgm',id)
    }
    public static mixSFX(id){
        win.webContents.send('mix-sfx',id)
    }
    public static playBGM(id,data){
        win.webContents.send('play-bgm',id,data)
    }
    public static playSFX(id,data){
        win.webContents.send('play-sfx',id,data)
    }
    public static removeBGM(id){
        win.webContents.send('remove-bgm',id)
    }
    public static removeSFX(id){
        win.webContents.send('remove-sfx',id)
    }
}