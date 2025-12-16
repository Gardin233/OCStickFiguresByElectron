---@diagnostic disable: missing-return
---meta
---@class Character 角色类
local Character = {}
---创建新角色
---@param url string 引用的模型url
---@param id string 角色的唯一标识符 
function Character.createNewCharacter(url,id)end

---删除角色
---@param id string
---@return nil
function Character.deleteCharacter(id)end
---获取碰撞箱
---@param id string 角色唯一标识符
---@param func fun(err:string,data:{name:string,verts:number[]}[])
function Character.getHitBox(id,func)end
---展示碰撞箱
---@param id string 角色唯一标识符
function Character.showHitBox(id)end
---检测被触碰的碰撞箱
---@param id string 角色的唯一标识符
---@param x number 基于全屏的x坐标
---@param y number 基于全屏的y坐标
---@param func fun(err:string,data)
function Character.checkHit(id,x,y,func)end
---获取点坐标于碰撞箱间的距离
---@param id string 角色的唯一标识符
---@param x number 基于全屏的x坐标
---@param y number 基于全屏的y坐标
---@param func fun(err:string,data)
function Character.getPosToHitBoxDistance(id,x,y,func)end
---comment
---@param id string
---@param layer number 动画叠加在第几层
---@param animation any
---@param isLoop any
function Character.playAnimation(id,layer,animation,isLoop)end

---硬移动角色
---@param x number 基于全屏的x坐标
---@param y number 基于全屏的y坐标
function Character.setPos(id,x,y)end
---comment
---@param id string
---@param x number
---@param y number
---@param type "line"|"more"
function Character.moveTo(id,x,y,type)end
---comment
---@param id string 角色的唯一标识符
---@param isLeft boolean 朝左为默认方向
function Character.flip(id,isLeft)end