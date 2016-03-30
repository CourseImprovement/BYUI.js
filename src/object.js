byui.fn('keys', function(){
	return Object.keys(this.context);
})

byui.fn('obj', function(base){
	switch (this.type()){
		case 'object':  return this.context;
		case 'xml': {
			return byui.createObject(this.context);
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
	result[name] = {
		children: []
	};
	var attrs = node.attributes;
	if (attrs && attrs.length > 0){
		for (var i = 0; i < attrs.length; i++){
			var attrName = attrs[i].name;
			var attrVal = attrs[i].value;
			result[name][attrName] = attrVal;
		}
	} 
	var children = node.children;
	if (children){
		for (var i = 0; i < children.length; i++){
			result[name].children.push(byui.createObject(children[i]));
		}
	}
	return result;
});

/**
 * base = {
 * 		graph: {
 * 			margin: {
 * 			top: 30,
 * 			left: 30,
 * 			bottom: 30,
 * 			right: 30
 * 		},
 * 		width: 500,
 * 		height: 300
 * 		},
 * 		x: {
 * 			format: '02d'
 * 		},
 * 		y: {
 * 			format: '0.0%'
 * 		}
 * };
 */
byui.extend('default', function(param, base){
	var type = byui.type(param);

	if (type == "object") {
		var keys = Object.keys(base);
		var len = keys.length;

		for (var i = 0; i < len; ++i) {
			var key = keys[i];

			if (param[key] != undefined) {
				if (byui.type(base[key]) == "object") {
					base[key] = byui.default(param[key], base[key]);
				} else {
					base[key] = param[key];
				}
			}
		}
	}
	
	return base;
});
