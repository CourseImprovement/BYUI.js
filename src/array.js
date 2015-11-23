byui.fn('len', function(){
	switch (this.type()){
		case 'array': case 'string': {
			return this.context.length;
		}
		default: {
			return undefined;
		}
	}
});

byui.fn('remove', function(idx, num){
	if (!num){
		num = 1;
	}
	switch (this.type()){
		case 'string': {
			if (idx == 0){
				this.context = this.context.slice(1);
			}
			else{
				this.context = this.context.slice(0, num) + this.context.slice((num + 1));
			}
			return this;
		}
		case 'array': {
			this.context.splice(idx, num);
			return this;
		}
	}
});

byui.fn('exists', function(what){
	switch (this.type()){
		case 'string': case 'array': {
			return this.context.indexOf(what) > -1;
		}
		case 'number': {
			var str = this.context + '';
			return str.indexOf(what) > -1;
		}
		case 'object': {
			var keys = this.keys();
			return keys.indexOf(what) > -1;
		}
		default: {
			return undefined;
		}
	}
});

/**
 * Do we pass the value through?
 */
byui.fn('val', function(idx){
	switch (this.type()){
		case 'string': case 'array': {
			if (byui.fn._internal.getType(idx) == 'number'){
				return this.context[idx];
			}
		}
		default: {
			return this.context;
		}
	}
});

byui.fn('index', function(val){
	switch (this.type()){
		case 'string': case 'array': {
			return this.context.indexOf(val);
		}
		default: {
			return undefined;
		}
	}
});

byui.fn('same', function(obj){
	var str = JSON.stringify(obj);
	var str2 = JSON.stringify(this.context);
	return str == str2 && this.type() == byui.fn._internal.getType(obj);
});

byui.fn('filter', function(obj){
	if (obj.returnValue == null || obj.returnValue == undefined) obj.returnValue = false;
	if (!obj.type) obj.type == 'out';
	var ary = [];
	switch (this.type()){
		case 'array': {
			var len = this.len();
			for (var i = 0; i < len; i++){
				if (obj.type == 'out' && this.context[i] != obj.val) ary.push(this.context[i]);
				else if (obj.type == 'in' && this.context[i] == obj.val) ary.push(this.context[i]);
			}
			break;
		}
		default: {
			this.context = '';
		}
	}
	if (obj.returnValue){
		return byui(ary);
	}
	else{
		this.context = ary;
		return this;
	}
});

byui.fn('each', function(callback){
	var keys = this.keys();
	var len = keys.length;
	for (var i = 0; i < len; i++){
		var val = callback(i, this.context[keys[i]]);
	}
});