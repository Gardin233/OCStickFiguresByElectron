import fs from "fs"
import path from "path";
import * as fengari from 'fengari'
import * as interop from 'fengari-interop'
import { lauxlib, lua } from "./StoryLoader.js";
export class SonwindowLib{
    private libNames:{name:string,func:Function}[]=[]
    L: any;
    constructor(LoL) {
        this.L =LoL
        this.libNames=[

        ]
    }
    public Init(){
        
    }

}