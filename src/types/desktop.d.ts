export interface icon{
    name:string
    position:{x:number,y:number}
    target:string
}
//原版，反色，灰度，高对比
export type fullScreenFilter =
"IDLE"|"OPPOSITE"|"GRAYSCALE"|"HIGHCONTRAST"