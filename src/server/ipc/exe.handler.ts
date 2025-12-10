import { ipcMain } from "electron";
import { openEXE } from "../utils/desktop.js";

export function setExeHandler(){
      ipcMain.handle('open-exe', async (event, path: string) => {
        try {
          const result = await openEXE(path);
          return result;
        } catch (error) {
          throw error;
        }
      })
}