local Character = _G.Character
local SpineCharacter
local _class_0
local _base_0 = {
	showHitBox = function(self, func)
		return Character.getHitBox(self.id, func)
	end
}
if _base_0.__index == nil then
	_base_0.__index = _base_0
end
_class_0 = setmetatable({
	__init = function(self)
		self.id = ''
		return Character.createNewCharacter(url, id)
	end,
	__base = _base_0,
	__name = "SpineCharacter"
}, {
	__index = _base_0,
	__call = function(cls, ...)
		local _self_0 = setmetatable({ }, _base_0)
		cls.__init(_self_0, ...)
		return _self_0
	end
})
_base_0.__class = _class_0
SpineCharacter = _class_0
return _class_0

