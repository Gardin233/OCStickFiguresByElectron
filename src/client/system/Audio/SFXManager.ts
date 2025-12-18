
import { AudioPlayData, volumeNodes } from "../../../types/desktop.js";

export class SFXManager{
    private context:AudioContext
    private sourceMap:Record<string,string>
    private bufferCache: Map<string, AudioBuffer> = new Map();//缓存层
    private MixAudios:Map<string,volumeNodes>=new Map()//混合层（音频节点与音量节点）
    public output:GainNode //音量
    
    constructor(con:AudioContext){
        this.context =con
        this.output =this.context.createGain()

    }   
    public  load(files:{id:string,url:string}[]){
        for(const item of files){
            this.sourceMap[item.id]=item.url
        }
    }
    public async unload(id:string){
        delete this.sourceMap[id]
    }
    public async preload(id:string){
        await this.getAudioBuffer(id)
    }
    public async release(id:string){
        this.bufferCache.delete(id)
    }
    public async mix(id:string){
       if(this.MixAudios.has(id)) return;
       const gain =this.context.createGain()
       gain.connect(this.output)
       this.MixAudios.set(id,{gain})
    }
    public async play(id:string,data:AudioPlayData){
        const buffer =await this.getAudioBuffer(id)
        const channel =this.MixAudios.get(id)
        if(!channel)  throw new Error(`SFX ${id} 未载入混合层`);

         // 每次播放新建 SourceNode
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.loop = data.loop ?? true;
        source.connect(channel.gain);

        if (data.volume !== undefined) {
            channel.gain.gain.value = data.volume;
        }

        source.start();
        channel.source = source; // 保存当前播放的 source
    }
    //设置总音量
    public async setVolume(volume:number){
        this.output.gain.value =volume
    }
        // 辅助方法：加载音频资源
    private async getAudioBuffer(name: string): Promise<AudioBuffer> {
        if (this.bufferCache.has(name)) return this.bufferCache.get(name)!;
        const response = await fetch(this.sourceMap[name]);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.bufferCache.set(name, audioBuffer);
        return audioBuffer;
    }
}