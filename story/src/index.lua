---@diagnostic disable: undefined-field

package.path = "?.lua;../story/src/?.lua;../story/src/?/init.lua"
print("当前 package.path: ", package.path)


---@class Gwin 
print(type(_G.Gwin))
local Gwin = _G.Gwin
---@class Character
local Character =_G.Character
print("Lua: 脚本开始运行...")

-- Gwin.applyScreenFilter("HIGHCONTRAST")
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

function Gwin.receiveInput(event)
    if event.type == "move" then
        -- print("鼠标移动到:", event.x, event.y)
    elseif event.type == "click" then
        Character.createNewCharacter("/assets/spine/","Gardin1")
        print("鼠标点击:", event.button)
    elseif event.type == "down" then
        Character.deleteCharacter("Gardin1")
        print("按下键盘:", event.keycode)
    elseif event.type == "up" then
        print("抬起键盘:", event.keycode)
    end
end
