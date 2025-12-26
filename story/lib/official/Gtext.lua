---@class GText
local GText={}
---@class GBitText
local GBitText={}
---@class Text
local Text =_G.Text
---@class BitText
local BitText =_G.BitText
local json=require("story.lib.base.json.json")


function GText.create(id,content,style,trans)
    local encodedStyle = json.encode(style)
    local encodedTrans = json.encode(trans)
    Text.create(id,content,encodedStyle,encodedTrans)
end
function GText.remove(id)
    Text.remove(id)
end
function GText.setStyle(id,style)
    local encodedStyle = json.encode(style)
    Text.setStyle(id,encodedStyle)
end
function GText.setContent(id,content)
    Text.setContent(id,content)
end
----------------------------------------------------------------------------------
--- GBitText API
----------------------------------------------------------------------------------
function GBitText.create(id,content,style,trans)
    local encodedStyle = json.encode(style)
    local encodedTrans = json.encode(trans)
    BitText.create(id,content,encodedStyle,encodedTrans)
end

function GBitText.setStyle(id,style)
    local encodedStyle =json.encode(style)
    BitText.setStyle(id,encodedStyle)
end
return GText,GBitText