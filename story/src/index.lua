local Libpath  = "./story/src/?.lua;./story/src/?/init.lua;"
local Libpath2 = "./story/lib/base/?.lua;./story/lib/complib/?.lua;./story/lib/?.lua;./story/lib/?/init.lua;"
package.path = Libpath .. Libpath2 .. package.path
local Timeline = require "base.timeline"
print("当前 package.path: ", package.path)

---@class Gsys
local Gsys = _G.Gsys
---@class Gwin 
local Gwin = _G.Gwin
---@class Character
local Character =_G.Character
---@class Audio
local Audio =_G.Audio
print("Lua: 脚本开始运行...")
-- GWin.openExe("C:\\Windows\\System32\\notepad.exe")
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
local screenSize =Gsys.getScreenSize()
print(screenSize.width,screenSize.height)
Audio.loadBGMFiles({
    {id="Flooding_Greengrape",url="/music/Flooding_Greengrape.ogg"},
    {id ="alarm_loop_sound",url="/music/alarm_loop_sound.ogg"}}
)
local tml = Timeline(function(builder)
    builder.sleep(1.0)
    print("1.0 seconds passed")
    builder.sleep(0.5)
    print("1.5 seconds passed")
    Gwin.createNewWindow("wd",'hello.html',{width=600,height=600,x=0,y=0,title='带默认标头的标题设置'})
    -- Gwin.applyScreenFilter("OPPOSITE")
    Gwin.createNewWindow("wdw",'demo.html',{width=600,height=600,x=99,y=99,title='你好',frame=false})
    builder.sleep_frame(30)
    print("1.5 + 30 frames passed")
    builder.stop()
    print("This message should not be printed")
end)

function Gsys.receiveInput(event)

    if event.type == "mousemove" then
    elseif event.type =="mouseup" then
        -- Character.moveTo("Gardin",event.x,event.y,"line")
        -- print("鼠标移动到:", event.x, event.y)
    elseif event.type == "click" then
        -- Character.createNewCharacter("/assets/spine/","Gardin1")
        print("鼠标点击:", event.button)
        -- Character.setPos("Gardin",event.x-1000,event.y-1000)---因为是队列，所以在移动事件清空前不会进行下一步操作
        -- Character.checkHit("Gardin",event.x,event.y,function (err,data)
        --     if err then
        --         print('错误')
        --         print(err)
        --     end
        --     print("没啥事")
        --     print(data)
        -- end) 
    elseif event.type == "wheel" then
        print(event.direction)
    elseif event.type == "keydown" then
        print("按下键盘:", event.keycode)    
        -- Character.flip("Gardin",false)
    elseif event.type == "keyup" then
        print("抬起键盘:", event.keycode)
        -- Audio.playBGM("Flooding_Greengrape",{volume=1,startTime=0,loop=false,fadeIn=1})
    end
end
local begin =require("plot")
function Gsys.update(data)
    tml.update(tml,data.dt)
    begin.update(begin,data.dt)
end