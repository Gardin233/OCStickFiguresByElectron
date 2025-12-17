export type Position= { x:number,y:number}
export interface icon{
    name:string
    position:Position
    target:string
}
//原版，反色，灰度，高对比
export type fullScreenFilter =
"IDLE"|"OPPOSITE"|"GRAYSCALE"|"HIGHCONTRAST"

export type AudioPlayData ={
    volume:number //音量
    loop:boolean    //是否循环
    fadeIn:number   //淡入时间
    startTime:number //开始时间
}