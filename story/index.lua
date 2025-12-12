---@diagnostic disable: undefined-field
package.path = package.path .. ";story/?.lua;story/?/init.lua"
-- story/test.lua
-- 取得当前脚本所在目录l
---@class Gwin 
local Gwin = _G.Gwin
---@class Character
local Character =_G.Character
print("Lua: 脚本开始运行...")

print(Gwin.demofunc("try"))
-- Gwin.applyScreenFilter("HIGHCONTRAST")
-- GWin.openExe("C:\\Windows\\System32\\notepad.exe")
-- local a=GWin.getDesktopIconPos()
--     print(a)
Character.createNewCharacter("/assets/spine/","Gardin")
-- print(a)
local function loop()
    while true do
        local e = Gwin.getEvent()
        print(e.mouse.x)
        coroutine.yield()
    end
end

local co = coroutine.create(loop)

-- Gwin.getDesktopIconPos(function(err, icons)
--     if err then
--         print("获取桌面图标失败:", err)
--         return
--     end
--     print("找到", #icons, "个图标")
--     for i, icon in ipairs(icons) do
--         -- print(icon.name,icon.position.x,icon.position.y,icon.target)
--         -- if icon.name =="此电脑" then
--             -- print("got it!")
--             -- print(icon.name,icon.position.x,icon.position.y,icon.target)
--             -- Gwin.openDesktopIcon(icon.target)
--         -- end
--     end
-- end)

