---@diagnostic disable: undefined-field

package.path = "?.lua;../story/src/?.lua;../story/src/?/init.lua"
print("当前 package.path: ", package.path)


---@class Gwin 
local Gwin = _G.Gwin
---@class Character
local Character =_G.Character
---@class Audio
local Audio =_G.Audio
print("Lua: 脚本开始运行...")

-- Gwin.applyScreenFilter("OPPOSITE")
-- GWin.openExe("C:\\Windows\\System32\\notepad.exe")
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
        Audio.loadBGMFiles({
    {id="Flooding_Greengrape",url="/assets/music/Flooding_Greengrape.ogg"},
    {id="alarm_loop_sound",url="alarm_loop_sound.ogg"}})

function Gwin.receiveInput(event)
    if event.type == "move" then
        Character.moveTo("Gardin",event.x,event.y,"line")
        -- print("鼠标移动到:", event.x, event.y)
    elseif event.type == "click" then
        -- Character.createNewCharacter("/assets/spine/","Gardin1")
        print("鼠标点击:", event.button)
        -- Character.setPos("Gardin",event.x-1000,event.y-1000)---因为是队列，所以在移动事件清空前不会进行下一步操作
        Character.checkHit("Gardin",event.x,event.y,function (err,data)
            if err then
                print('错误')
                print(err)
            end
            print("没啥事")
            print(data)
        end)
        
    elseif event.type == "down" then
        print("按下键盘:", event.keycode)    
        Audio.mixBGM("Flooding_Greengrape")
        
        Character.flip("Gardin",false)
    elseif event.type == "up" then
        Audio.preloadBGM('Flooding_Greengrape')
        print("抬起键盘:", event.keycode)
   Audio.playBGM("Flooding_Greengrape",{volume=1,startTime=0,loop=false,fadeIn=1})
     
    end
end