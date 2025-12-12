import { startGlobalHooks } from "../hooks/uiohook.js";
import { setupDesktopHandler } from "./desktop.handler.js";
import { setExeHandler } from "./exe.handler.js";
import { setScreenHandler } from "./filter.handler.js";

export function ServerIpcInit(){
    startGlobalHooks()
    setupDesktopHandler()
    setExeHandler()
    setScreenHandler()
    
}