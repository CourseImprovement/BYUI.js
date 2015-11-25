/**
 * byui().addFunc(function(){});
 */
byui.fn('addFunc', function(func){
	if (byui.fn._internal.getType(this.context) != 'array') this.context = [];
	this.context.push(func);
});

/**
 * byui().start();
 */
byui.fn('start', function(){
	if (!this.threadPoolSetup) this.poolSetup();
	var _this = this;
	for (var i = 0; i < _this.threadPoolSetup.total; i++){
		(function(idx){
			setTimeout(function(){
				if (byui.fn._internal.getType(_this.context[idx]) == 'function'){
					_this.context[idx]();
					if (++_this.threadPoolSetup.spot == _this.threadPoolSetup.total){
						if (_this.threadPoolSetup.init.done) _this.threadPoolSetup.init.done(_this.threadPoolSetup.error, _this.threadPoolSetup.success);
					}
				}
			}, 10);
		})(i);
	}
})

/**
 * obj = {
 * 	done: func
 * }
 */
byui.fn('poolSetup', function(obj){
	if (!byui.fn._internal.getType(obj) == 'object') throw 'Invalid ajaxPool, expected object';
	this.threadPoolSetup = {
		init: obj,
		total: this.context.length,
		spot: 0,
		success: {},
		error: []
	}
});