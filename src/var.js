byui.fn('save', function(name){
	byui.globals[name] = this.context;
});

byui.fn('get', function(name){
	return byui(byui.globals[name]);
})