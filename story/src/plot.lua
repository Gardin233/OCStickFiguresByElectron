---@class Gwin 
local Gwin = _G.Gwin
---@class Character
local Character =_G.Character
---@class Audio
local Audio =_G.Audio
local Timeline = require "timeline"
local times = 0
math.randomseed(os.time())

-- 经典爱心参数方程
local function getHeartPoint(t)
    local sin_t = math.sin(t)
    local cos_t = math.cos(t)
    local x = 16 * sin_t * sin_t * sin_t
    local y = 13 * cos_t - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t)
    return x, y
end

local begin = Timeline(function(builder)
    builder.sleep(0.2)
    Character.createNewCharacter("/spine/gardin.json", "gardin")
    builder.sleep(2)
    Character.playAnimation('gardin', 0, 'walk', true)

    -- ==================== 参数调整：画一个更大的爱心 ====================
    local points = 80                  -- 点数增加到80，更圆滑密集
    local scale = 28                   -- 【关键】放大倍数，从15 → 28，爱心整体大一倍多
    local centerX = 960                -- 中心X向右偏移（假设常见1920x1080屏幕居中）
    local centerY = 540                -- 中心Y居中（1080 / 2）
    local windowSize = 260             -- 窗口稍小一点，避免太大重叠过多，视觉更清晰
                                       -- 如果你喜欢重叠密集感，可以保持300或更大

    -- 可选：如果你屏幕分辨率更高（如2560x1440），可以进一步调整
    -- centerX = 1280, centerY = 720, scale = 35~40

    -- 预先生成所有爱心点
    local heartPoints = {}
    for i = 1, points do
        local t = (i - 1) * (2 * math.pi) / points
        local px, py = getHeartPoint(t)
        heartPoints[i] = {
            x = centerX + px * scale,
            y = centerY - py * scale
        }
    end

    -- 依次弹出窗口，形成大爱心形状
    for i = 1, points do
        local pt = heartPoints[i]
        Gwin.createNewWindow(
            "heart_wdw_" .. i,
            'demo.html',
            {
                width = windowSize,
                height = windowSize,
                x = math.floor(pt.x - windowSize / 2),
                y = math.floor(pt.y - windowSize / 2),
                title = '❤️',
                frame = false
            }
        )
        builder.sleep(0.12)  -- 稍加快一点弹出速度，让节奏更流畅（原0.15→0.12）
    end

    -- 可选：完成后保持显示，或过一段时间自动关闭
    -- builder.sleep(15)
    -- for i = points, 1, -1 do  -- 逆序关闭更有仪式感
    --     Gwin.closeWindow("heart_wdw_" .. i)
    --     builder.sleep(0.08)
    -- end
end)

return begin