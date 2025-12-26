export class BitmapTextIPC{
    constructor(){}
    public init(){
        this.load();this.create()
        this.remove();this.setContent()
        this.setPos();this.setStyle()
        this.setScale();this.setRotation()
    }
    private load(){
        window.electronAPI.text.bitText.loadFont((id,url)=>{
            
        })
    }
    private create(){
        window.electronAPI.text.bitText.create((id,content,style,trans)=>{

        })
    }
    private remove(){
        window.electronAPI.text.bitText.remove((id)=>{

        })
    }
    private setContent(){
        window.electronAPI.text.bitText.setContent((id,content)=>{

        })
    }
    private setPos(){
        window.electronAPI.text.bitText.setPos((id,x,y)=>{

        })
    }
    private setStyle(){
        window.electronAPI.text.bitText.setStyle((id,style)=>{

        })
    }
    private setScale(){
        window.electronAPI.text.bitText.setScale((id,scaleX,scaleY)=>{

        })
    }
    private setRotation(){
        window.electronAPI.text.bitText.setRotation((id,rotation)=>{

        })
    }
    
}