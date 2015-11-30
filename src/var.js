byui.fn('save', function(name){
	byui.globals[name] = this.context;
});

byui.extend('get', function(name){
	var raw = byui.globals[name];
	if (byui.fn._internal.getType(raw) == 'xml') return $(raw);
	return byui(raw);
});

byui.extend('type', function(obj){
	return byui.fn._internal.getType(obj);
})