byui.fn('save', function(name){
	byui.globals[name] = this.context;
});

byui.extend('get', function(name){
	return byui(byui.globals[name]);
})