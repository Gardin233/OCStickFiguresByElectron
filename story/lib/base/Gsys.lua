---@meta
---@class Gsys
---@field receiveInput fun(event: {
---     type: "mousemove" |"mouseup"|"click"|"keydown"|"keyup"|"wheel",
---     x: number,
---     y: number,
---     button: number?,
---     keycode: number?,
---     clicks: number?,
---     direction:number,
---     amout:number,
---     rotation:number,
---     altKey: boolean?,
---     ctrlKey: boolean?,
---     shiftKey: boolean?,
---     metaKey: boolean? })
local Gsys = {}

---@param t "IDLE"|"OPPOSITE"|"GRAYSCALE"|"HIGHCONTRAST"
---@return nil
function Gsys.applyScreenFilter(t) end
---测试函数
---@param s any
function Gsys.demofunc(s) end
---@param target string 桌面图标名称
function Gsys.openDesktopIcon(target)end
---@param src string 桌面图标路径
function Gsys.openExe(src)end
---comment
---@param callback fun(err:any, icons: {name:string, position:{x:number, y:number}, target:string}[])
function Gsys.getDesktopIconPos(callback)end
---获取屏幕尺寸
---@return {width:number, height:number}
function Gsys.getScreenSize()end

return Gsys