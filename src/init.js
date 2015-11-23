/**
 * RULES:
 * 	1. If it's not been developed yet, return undefined
 */


window.byui = (function(){

	var version = '0.2.0',
			_byui = function(selector){
				return new _byui.init(selector);
			};

	// basic checks
	if (!window.$ || !window.jQuery) throw 'Expected jQuery, please include';

	_byui.init = function(selector){
		this.initalContext = selector;
		this.context = this.initalContext;
		this.errors = [];
		this.type();
		_byui.fn._internal.clean(this);
	}

	_byui.globals = {};
	_byui.template = {};

	_byui.fn = function(name, obj){
		_byui.fn[name] = obj;
	}

	_byui.version = version;

	_byui.extend = function(name, obj){
		_byui[name] = obj;
	}

	_byui.fn._internal = {
		getType: function(obj){
			var t = Object.prototype.toString.call(obj);
			return t.replace('[object ', '').replace(']', '').toLowerCase();
		},
		clean: function(a){
			switch (a.type()){
				case 'string': {
					if (a.exists('@')) a.context = a.context.split('@')[0];
				}
			}
		},
		regex: {
			SPACE: / /g
		}
	}

	_byui.fn.type = function(expected){
		if (!!expected) return expected === this.baseType;
		this.baseType = _byui.fn._internal.getType(this.context);
		return this.baseType
	}

	_byui.fn.raw = function(){return this.initalContext;}

	_byui.init.prototype = _byui.fn;

	return _byui;

})();