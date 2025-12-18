import { AudioPlayData, volumeNodes } from "../../../types/desktop.js";

export class BGMManager{
    private context:AudioContext //音频上下文
    private sourceMap?:Record<string,string>={} //资源ID对照表
    private bufferCache: Map<string, AudioBuffer> = new Map();//缓存层
    private MixAudios:Map<string,volumeNodes>=new Map()//混合层（音频节点与音量节点）
    public output:GainNode//总输出
   
  
    constructor(con:AudioContext){
        this.context =con
        this.output =this.context.createGain()
    }
    //注册资源
    public load(files:{id:string,url:string}[]){
        for(const item of files){
            this.sourceMap[item.id]=item.url
        }
    }
    //卸载资源
    public unload(id:string){
        delete this.sourceMap[id]
    }
    //缓冲资源
    public async preload(id:string){
        await this.getAudioBuffer(id)
    }
    //卸载缓冲
    public async release(id:string){
        this.bufferCache.delete(id)
    }
    //压入混合层
    public async mix(id:string){
        try{
            if (this.MixAudios.has(id)) return; // 已经存在就不重复创建
            const gain = this.context.createGain();
            gain.connect(this.output);
            this.MixAudios.set(id, { gain });
        }catch(err){
            console.error(err)
        }
    }
    //播放
    public async play(id: string,data:AudioPlayData) {
        const buffer = await this.getAudioBuffer(id);
        const channel = this.MixAudios.get(id);
        if (!channel) throw new Error(`BGM ${id} 未 mix`);

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


    public stopSingle(id:string){
          const channel = this.MixAudios.get(id);
        if (!channel?.source) return;
        channel.source.stop();
        channel.source.disconnect();
        channel.source = undefined;
    }
    // 辅助方法：加载音频资源
    private async getAudioBuffer(name: string): Promise<AudioBuffer> {
        if (!this.sourceMap || !this.sourceMap[name]) {
        throw new Error(`BGM ${name} not loaded! Call loadBGMFiles first.`);
        }
        try{
            if (this.bufferCache.has(name)) return this.bufferCache.get(name)!;
            const response = await fetch(this.sourceMap[name]);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.bufferCache.set(name, audioBuffer);
            return audioBuffer;
        }catch(err){
            console.error(err)
        }
    }
    
}