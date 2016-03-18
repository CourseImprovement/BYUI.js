/**
 * RULES:
 * 	1. If it's not been developed yet, return undefined
 */


window.byui = (function(){

	var version = '0.2.0',
			name = 'byui',
			_byui = function(selector){
				return new _byui.init(selector);
			};

	// basic checks
	if (!window.$ || !window.jQuery) throw 'Expected jQuery, please include';

	_byui.init = function(selector){
		if (selector == null) selector = window;
		this.initalContext = selector;
		this.context = this.initalContext;
		this.errors = [];
		this.type();
		this.x99909 = true;
		if (this.baseType == 'object' && this.initalContext.x99909){
			this.context = this.initalContext.context;
			this.baseType = this.initalContext.baseType;
			this.initalContext = this.initalContext.initalContext;
		}
		_byui.fn._internal.clean(this);
	}

	_byui.globals = {};
	_byui.template = {};

	_byui.fn = function(name, obj){
		_byui.fn[name] = obj;
	}

	_byui.version = version;
	_byui.name = name;

	_byui.extend = function(name, obj){
		_byui[name] = obj;
	}

	_byui.fn._internal = {
		getType: function(obj){
			var t = Object.prototype.toString.call(obj);
			var ty = t.replace('[object ', '').replace(']', '').toLowerCase();
			if (ty.indexOf('element') > -1 || ty == 'xmldocument') return 'xml';
			return ty;
		},
		clean: function(a){
			switch (a.type()){
				case 'string': {
					if (a.exists('http')){
						try{
							var u = new URL(a.context);
						}
						catch (e){
							var err = 'Invalid URL';
							a.errors.push(err);
							console.log(err);
						}
						break;
					}
					else if (a.exists('@')){
						a.context = a.context.split('@')[0];
						break;
					}
					else if (a.context.match(_byui.fn._internal.regex.ALL_NUMBERS)){
						var num = new Number(a.context).valueOf();
						if (!isNaN(num)){
							a.context = num;
						}
						break;
					}
				}
			}
		},
		regex: {
			SPACE: / /g,
			ALL_NUMBERS: /[0-9]+$/g
		},
		shortcuts: []
	}

	_byui.fn.type = function(expected){
		if (!!expected) return expected === this.baseType;
		this.baseType = _byui.fn._internal.getType(this.context);
		return this.baseType
	}

	_byui.fn.$ = function(selector){
		return $(selector);
	}

	_byui.fn.raw = function(){return this.initalContext;}

	_byui.init.prototype = _byui.fn;

	return _byui;

})();