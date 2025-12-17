export class SFXManager{
    private context:AudioContext
    public output:GainNode //音量
    private source:Record<string,string>
    private instances:Record<string,AudioBufferSourceNode>
    constructor(con:AudioContext){
        this.context =con
        this.output =this.context.createGain()

    }   
    public async load(files:Record<string,string>){
        this.source=files
    }
}