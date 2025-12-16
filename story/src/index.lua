---@diagnostic disable: undefined-field

package.path = "?.lua;../story/src/?.lua;../story/src/?/init.lua"
print("当前 package.path: ", package.path)


---@class Gwin 
local Gwin = _G.Gwin
---@class Character
local Character =_G.Character
print("Lua: 脚本开始运行...")

-- Gwin.applyScreenFilter("OPPOSITE")
-- GWin.openExe("C:\\Windows\\System32\\notepad.exe")
-- local a=GWin.getDesktopIconPos()
--     print(a)
Character.createNewCharacter("/assets/spine/","Gardin")
--回调函数


print("Lua 脚本初始化完成")


-- Gwin.getDesktopIconPos(function(err, icons)
--     if err then
--         print("获取桌面图标失败:", err)
--         return
--     end
--     print("找到", #icons, "个图标")
--     for i, icon in ipairs(icons) do
--         print(icon.name,icon.position.x,icon.position.y,icon.target)
--         if icon.name =="此电脑" then
--             print("got it!")
--             print(icon.name,icon.position.x,icon.position.y,icon.target)
--             Gwin.openDesktopIcon(icon.target)
--         end
--     end
-- end)
-- Character.showHitBox("Gardin")
function Gwin.receiveInput(event)
    if event.type == "move" then
        Character.moveTo("Gardin",event.x,event.y,"line")
        -- print("鼠标移动到:", event.x, event.y)
    elseif event.type == "click" then
        -- Character.createNewCharacter("/assets/spine/","Gardin1")
        print("鼠标点击:", event.button)
        Character.setPos("Gardin",event.x-1000,event.y-1000)---因为是队列，所以在移动事件清空前不会进行下一步操作
        Character.checkHit("Gardin",event.x,event.y,function (err,data)
            if err then
                print(err)
            end
            print(data.name)
        end)
        -- Character.getHitBox("Gardin",function (err,data)
        --     print(data[1].name,data[1].verts)
        -- end)

        -- Character.getPosToHitBoxDistance("Gardin",event.x,event.y,function (err,boxes)
        --     if err then
        --         print(err)
        --     end
        --     print(boxes[1].name,boxes[1].distance)

        -- end)
        
        -- Character.setPos("Gardin",10,20)
        -- Character.moveTo("Gardin",120,121,'line')
    elseif event.type == "down" then
        print("按下键盘:", event.keycode)
        Character.flip("Gardin",false)
    elseif event.type == "up" then
        -- Character.playAnimation("Gardin",0,"jump",false)
        print("抬起键盘:", event.keycode)
        Character.flip("Gardin",true)
    end
end