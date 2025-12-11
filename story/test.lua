package.path = package.path .. ";story/?.lua;story/?/init.lua"
-- story/test.lua
-- 取得当前脚本所在目录

---@class Gwin
---@diagnostic disable-next-line: undefined-field
local Gwin = _G.Gwin

print("Lua: 脚本开始运行...")

print(GWin.demofunc("try"))
-- GWin.applyScreenFilter("OPPOSITE")

