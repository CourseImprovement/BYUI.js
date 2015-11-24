byui.fn('keys', function(){
	return Object.keys(this.context);
})

byui.fn('obj', function(base){
	switch (this.type()){
		case 'object':  return this.context;
		case 'xml': {
			return createObject(this.context);
		}
		default: {
			var o = {};
			o[base] = this.context;
			return o;
		}
	}
})

byui.extend('createObject', function(node){
	var name = node.nodeName.toLowerCase();
	var result = {_name: name};
	result[name] = {};
	var attrs = node.attributes;
	for (var i = 0; i < attrs.length; i++){
		var attrName = attrs[i].name;
		var attrVal = attrs[i].value;
		result[name][attrName] = attrVal;
	}
	var children = node.children;
	var org = {};
	for (var i = 0; i < children.length; i++){
		if (!org[children[i].nodeName.toLowerCase()]) org[children[i].nodeName.toLowerCase()] = [children[i]];
		else org[children[i].nodeName.toLowerCase()].push(children[i]);
	}
	var keys = Object.keys(org);
	for (var i = 0; i < keys.length; i++){
		if (org[keys[i]].length == 1){
			var o = byui.createObject(org[keys[i]][0]);
			result[name][keys[i]] = o[o._name];
		}
		else{

		}
	}

	return result;
});