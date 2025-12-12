---@meta
---@class Gwin
local Gwin = {}

---@param t "IDLE"|"OPPOSITE"|"GRAYSCALE"|"HIGHCONTRAST"
---@return nil
function Gwin.applyScreenFilter(t) end
---测试函数
---@param s any
function Gwin.demofunc(s) end
---@param target string 桌面图标名称
function Gwin.openDesktopIcon(target)end
---@param src string 桌面图标路径
function Gwin.openExe(src)end
---comment
---@param callback fun(err:any, icons: {name:string, position:{x:number, y:number}, target:string}[])
function Gwin.getDesktopIconPos(callback)end


return Gwin