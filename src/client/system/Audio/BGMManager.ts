export class BGMManager{
    private context:AudioContext
    public output:GainNode
    private MixVideos:Map<string,AudioBufferSourceNode> 
    private sourceMap?:Record<string,string>
    private bufferCache: Map<string, AudioBuffer> = new Map();
    constructor(con:AudioContext){
        this.context =con
        this.output =this.context.createGain()
    }
    public async load(files:Record<string,string>){
        this.sourceMap =files
    }
    public async setVolume(volume:number){
        this.output.gain.value =volume
    }
    public async play(id: string, loop: boolean = true) {
        // 0. 安全检查：确保资源表已加载且ID存在
        if (!this.sourceMap || !this.sourceMap[id]) {
            console.warn(`BGMManager: Audio ID '${id}' not found.`);
            return;
        }
        try {
            // 2. 等待资源加载/获取（这是一个异步过程）
            const buffer = await this.getAudioBuffer(id);
            // 3. 创建全新的 Source Node (AudioBufferSourceNode 是一次性的)
            const source = this.context.createBufferSource();
            source.buffer = buffer;
            source.loop = loop;
            // 4. 【连接】连到 BGMManager 自己的 output 上
            source.connect(this.output);
            // 5. 启动
            source.start(0);
            // 6. 更新当前播放的引用，以便下次 stop() 能找到它
            this.MixVideos[id] = source;

        } catch (error) {
            console.error(`BGMManager: Failed to play '${id}'`, error);
        }
    }
    public stopSingle(id:string){

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