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
---预载BGM
---@param id string 唯一标识符
function Audio.preloadBGM(id)end
---预载SFX
---@param id string 唯一标识符
function Audio.preloadSFX(id)end
---卸载BGM
---@param id string 唯一标识符
function Audio.releaseBGM(id)end
---卸载SFX
---@param id string 唯一标识符
function Audio.releaseSFX(id)end
---将音频压入BGM混合层
---@param id string 唯一标识符
function Audio.mixBGM(id)end
---将音频压入SFX混合层
---@param id string 唯一标识符
function Audio.mixSFX(id)end
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
---把BGM移出混合层
---@param id string 唯一标识符
function Audio.removeBGM(id)end
---把SFX移出混合层
---@param id string 唯一标识符
function Audio.removeSFX(id)end

return Audio