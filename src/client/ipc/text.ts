import { Text } from "../system/text/common/Text.js";

export class TextIPC {
 public textList:Map<string, Text>;
    constructor() {
        this.textList = new Map<string, Text>();
    }
    public init(){
        this.create();this.remove();
        this.setContent();this.setPos()
        this.setStyle();this.setScale()
        this.setRotation()
    }
     private create(){
        window.electronAPI.text.commonText.create((id,content,style,trans)=>{
            
        })
    }
    private remove(){
        window.electronAPI.text.commonText.remove((id)=>{

        })
    }
    private setContent(){
        window.electronAPI.text.commonText.setContent((id,content)=>{

        })
    }
    private setPos(){
        window.electronAPI.text.commonText.setPos((id,x,y)=>{

        })
    }
    private setStyle(){
        window.electronAPI.text.commonText.setStyle((id,style)=>{

        })
    }
    private setScale(){
        window.electronAPI.text.commonText.setScale((id,scaleX,scaleY)=>{

        })
    }
    private setRotation(){
        window.electronAPI.text.commonText.setRotation((id,rotation)=>{

        })
    }
    
}