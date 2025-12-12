---meta
---@class Character 角色类
local Character = {}
---创建新角色
---@param url string 引用的模型url
---@param name string 角色的唯一标识符 
function Character.createNewCharacter(url,name)end


---硬移动角色
---@param x number 基于全屏的x坐标
---@param y number 基于全屏的y坐标
function Character:setPosition(name,x,y)end
---删除角色
---@return nil
function Character:deleteCharacter()end


return Character