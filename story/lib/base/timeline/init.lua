---@author @Weacksdy
---感谢他提供的时间线的解决方案！！！
-- ./lib/forge/timeline/init.lua

-- 管理时间线的对象, 需每帧调用 `update` <br>
---一个简单的使用示例: <br>
---```lua
---local Timeline = require "forge.timeline"
---local tml = Timeline(function(builder)
---    builder.sleep(1.0)
---    print("1.0 seconds passed")
---    builder.sleep(0.5)
---    print("1.5 seconds passed")
---    builder.sleep_frame(30)
---    print("1.5 + 30 frames passed")
---    builder.stop()
---    print("This message should not be printed")
---end)
---```
---在它的父对象中每帧调用 `tml:update(dt)`, 同时确保 `timeline`<br>
--- 的寿命短于父对象, 以防执行不净或垂悬引用。<br>
--- 
--- 关于 `Forge.Timeline.Builder` 的用法, 请将鼠标悬于 `builder` 上查看。
---@class Forge.Timeline
---@field co            thread               内部的时间线协程
---@field remain_time   number               秒倒计时
---@field remain_frames number               帧数倒计时
---@field state         Forge.Timeline.State 时间线状态
---@overload fun(co_func: fun(builder: Forge.Timeline.Builder)): Forge.Timeline 创建一个时间线
local Timeline = {}

---@alias Forge.Timeline.State "running" | "sleep" | "sleep_frame" | "stop"

local path = (...):gsub("%.init$", "")
---@class Forge.Timeline.Builder
local Builder = require(path .. ".builder")

-- 时间线的构造函数, 与直接调用 Timeline 等价
---@param co_func fun(builder: Forge.Timeline.Builder)
---@return Forge.Timeline
function Timeline:new(co_func)
    local tml = setmetatable({}, { __index = self })
    tml.co = coroutine.create(co_func)
    tml.remain_time = 0.0
    tml.remain_frames = 0
    tml.state = "running"

    return tml
end

---@diagnostic disable-next-line: param-type-mismatch
setmetatable(Timeline, { __call = Timeline.new })

function Timeline:update(dt)
    local old_state = self.state

    if self.state == "stop" then
        return
    end

    -- 处理基于时间的休眠
    if self.state == "sleep" then
        self.remain_time = self.remain_time - dt
        if self.remain_time <= 0 then
            self.state = "running"
        end
    end

    -- 处理基于帧数的休眠
    if self.state == "sleep_frame" then
        self.remain_frames = self.remain_frames - 1
        self.remain_time = self.remain_time - dt
        if self.remain_frames <= 0 then
            self.state = "running"
        end
    end

    -- 处理正常运行, 直到遇到休眠
    if self.state == "running" then
        ---@type boolean, Forge.Timeline.Builder.Action?
        local okay, action-- = coroutine.resume(self.co, Builder)
        if old_state == "running" then
            okay, action = coroutine.resume(self.co, Builder)
        elseif old_state == "sleep" then
            okay, action = coroutine.resume(self.co, -self.remain_time)
        elseif old_state == "sleep_frame" then
            okay, action = coroutine.resume(self.co, -self.remain_time)
            self.remain_time = 0.0
        end
        if not okay then
            error("Error in coroutine: \n" .. tostring(action))
        end
        if action then
            if action.type == "sleep" then
                self.state = "sleep"
                self.remain_time = self.remain_time + action.props.time
            elseif action.type == "sleep_frame" then
                self.state = "sleep_frame"
                self.remain_frames = self.remain_frames + action.props.frame
            elseif action.type == "stop" then
                self.state = "stop"
            else
                error("Unknown action type: " .. action.type)
            end
        end
        if coroutine.status(self.co) == "dead" then
            self.state = "stop"
        end
    end
end

return Timeline
