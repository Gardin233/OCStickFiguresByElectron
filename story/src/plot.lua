
---@class Gwin 
local Gwin = _G.Gwin
---@class Character
local Character =_G.Character
---@class Audio
local Audio =_G.Audio
local Timeline = require "timeline"
local begin=Timeline(function (builder)
    builder.sleep(0.2)
  Character.createNewCharacter("/assets/spine/","gardin")
    builder.sleep(2)
    Character.playAnimation('gardin',0,'walk',true)
    while true do
        builder.sleep(2)
        print("2秒一次")
    end
    builder.stop()
end)

return begin