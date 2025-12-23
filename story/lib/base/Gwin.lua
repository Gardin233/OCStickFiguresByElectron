---@meta
---@class Gwin
local Gwin = {}
---comment
---@param id string 窗口ID
---@param url string story文件夹下page页面的路径
---@param data { 
---  width: number,height: number,
---  x: number,y: number,
---  title?: string,
---  frame?: boolean,              
---  transparent?: boolean,        
---  skipTaskbar?: boolean,        
---  fullscreen?: boolean,
---  resizable?: boolean;} 传递给story的数据(只有长宽坐标是必选项)
function Gwin.createNewWindow(id, url, data)end

return Gwin