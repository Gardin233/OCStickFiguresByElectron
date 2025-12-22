import { app } from "electron";
import path from "path";

export const resourcesBase = app.isPackaged ? process.resourcesPath : app.getAppPath();
export const externalBase = app.isPackaged ? process.resourcesPath :path.join( app.getAppPath(),'..');