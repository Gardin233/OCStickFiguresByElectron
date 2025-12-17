import { BGMManager } from "./BGMManager.js";
import { SFXManager } from "./SFXManager.js";
/**
 * [ BGM Source ] ----> [ BGM Gain ] ----\
                                          \
 [ SFX Source 1] --\                     --> [ Main Gain ] --> [ Speakers ]
                    > [ SFX Gain ] ----/      (主音量节点)      (Destination)
 [ SFX Source 2] --/
 */
export class AudioController{
    public BGMM:BGMManager
    public SFMM:SFXManager
    public mainVoice:GainNode
    private context:AudioContext
    constructor(){}
    public async Init(){
        if(this.context)return
        this.context =new AudioContext()
        this.mainVoice =this.context.createGain()
        this.mainVoice.connect(this.context.destination) //将主音量连接到物理输出（扬声器）

        this.BGMM =new BGMManager(this.context)
        this.SFMM= new SFXManager(this.context)
        this.BGMM.output.connect(this.mainVoice)
        this.SFMM.output.connect(this.mainVoice)
        // 如果被 suspend，尝试 resume
        if (this.context.state === 'suspended') {
            await this.context.resume();
        }
    }
    public setMainVoice(volume:number){
        this.mainVoice.gain.value =volume
    }
}