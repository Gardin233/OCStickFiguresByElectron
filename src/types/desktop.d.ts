export type Position= { x:number,y:number}
export interface icon{
    name:string
    position:Position
    target:string
}
//原版，反色，灰度，高对比
export type fullScreenFilter =
"IDLE"|"OPPOSITE"|"GRAYSCALE"|"HIGHCONTRAST"

export interface AudioPlayData{
    volume:number //音量
    loop:boolean    //是否循环
    fadeIn:number   //淡入时间
    startTime:number //开始时间
}
//混合器位置
export interface volumeNodes{
    gain:GainNode
    source?: AudioBufferSourceNode; // 可选，当前正在播放的节点
}