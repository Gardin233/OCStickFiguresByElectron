---meta

---@class Audio
Audio={}
---注册BGM文件
---@param urls {id:string,url:string}[] 文件链接数组
function Audio.loadBGMFiles(urls)end
---注册SFX文件
---@param urls {id:string,url:string}[] 文件链接数组
function Audio.loadSFXFiles(urls)end
---卸载指定BGM
---@param id string 唯一标识符
function Audio.unloadBGM(id)end
---卸载指定SFX
---@param id string 唯一标识符
function Audio.unloadSFX(id)end
---播放BGM
---@param id string 唯一标识符
---@param data {volume:number,
---loop:boolean,fadeIn:number ,startTime:number} 播放参数
function Audio.playBGM(id,data)end
---播放SFX
---@param id string 唯一标识符
---@param data {volume:number,
---loop:boolean,fadeIn:number ,startTime:number} 播放参数
function Audio.playSFX(id,data)end


return Audio