---meta
---@class Text
local Text={}
---@class BitText
local BitText={}
---------------------------------------------------------------
---normal text API
---------------------------------------------------------------
---创建一个常规文本
---@param id string 唯一标识符
---@param content string 文本内容
---@param style string 样式的json字符串
---@param trans string 默认的位置和角度变换json字符串
function Text.create(id,content,style,trans)end


---修改文本样式
---@param id string 唯一标识符
---@param style string 样式的json字符串
function Text.setStyle(id,style)end

---修改文本内容
---@param id string 唯一标识符
---@param content string 文本内容
function Text.setContent(id,content)end

---设置文本位置
---@param id string 唯一标识符
---@param x number 文本x坐标
---@param y number 文本y坐标
function Text.setPos(id,x,y)end

---设置文本缩放
---@param id string 唯一标识符
---@param scaleX number X轴缩放比例
---@param scaleY number Y轴缩放比例
function Text.setScale(id,scaleX,scaleY)end

---设置角度
---@param id string 唯一标识符
---@param rotation number 角度
function Text.setRotation(id,rotation)end
---移除文本
---@param id string 唯一标识符
function Text.remove(id)end
---------------------------------------------------------------
---bitmap text API
--------------------------------------------------------------- 
---注册字体
---@param id string 字体唯一标识符
---@param url string 字体文件路径(基于story/assets文件夹)
function BitText.loadFont(id,url)end
---创建一个bitmap风格的文本
---@param id string 唯一标识符
---@param content string 文本内容
---@param style string 样式的json字符串
---@param trans string 默认的位置和角度变换json字符串
function BitText.create(id,content,style,trans)end

---设置bitmap风格文本位置
---@param id string 唯一标识符
---@param x number 文本x坐标
---@param y number 文本y坐标
function BitText.setPos(id,x,y)end

---设置缩放
---@param id string 唯一标识符
---@param scaleX number X轴缩放比例
---@param scaleY number Y轴缩放比例
function BitText.setScale(id,scaleX,scaleY)end

---设置角度
---@param id string 唯一标识符
---@param rotation number 角度
function BitText.setRotation(id,rotation)end

---修改bitmap风格文本内容
---@param id string 唯一标识符  
---@param content string 文本内容
function BitText.setContent(id,content)end
---修改bitmap风格文本样式
---@param id any
---@param style any
function BitText.setStyle(id,style)end
---删除bitmap风格文本
---@param id string 唯一标识符
function BitText.remove(id)end


return Text,BitText