byui.fn('asName', function(){
	switch (this.type()){
		case 'string': {
			var lower = this.context.toLowerCase();
			var words = lower.split(byui.fn._internal.regex.SPACE);
			for (var i = 0; i < words.length; i++){
				words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
			}
			return words.join(' ');
		}
		default: return undefined;
	}
});

byui.fn('asEmail', function(ext){
	switch (this.type()){
		case 'string': {
			var raw = this.raw();
			if (raw.indexOf('@') > -1) return raw;
			return raw + '@' + ext;
		}	
		default: return undefined;
	}
});

byui.fn('replace', function(what, withVal){
	if (withVal == undefined || withVal == null) withVal = '';
	switch (this.type()){
		case 'string': {
			var regex = new RegExp(what, 'g');
			this.context = this.context.replace(regex, withVal);
		}
	}
	return this;
});

byui.fn('split', function(val){
	if (byui.fn._internal.getType(val) != 'string') return;
	switch (this.type()){
		case 'string': {
			this.context = this.context.split(val);
		}
	}
	return this;
});