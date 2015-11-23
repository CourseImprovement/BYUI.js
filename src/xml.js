byui.extend('createNode', function(name, obj){
	var keys = Object.keys(obj);
	var xml = $('<' + name + '></' + name + '>');
	for (var i = 0; i < keys.length; i++){
		switch (byui.fn._internal.getType(obj[keys[i]])){
			case 'string': case 'number': case 'boolean': {
				$(xml).attr(keys[i], obj[keys[i]]);
				break;
			}
			case 'undefined': case 'null':{
				$(xml).attr(keys[i], '');
				break;
			}
			case 'object': {
				var child = byui.createNode(keys[i], obj[keys[i]]);
				$(xml).append(child);
				break;
			}
			case 'array': {
				var ary = obj[keys[i]];
				for (var j = 0; j < ary.length; j++){
					var child = byui.createNode(keys[i], ary[j]);
					$(xml).append(child);
				}
				break;
			}
		}
	}
	return $(xml)[0];
});

byui.fn('createNode', function(name, obj){
	this.context = byui.createNode(name, obj);
	return this;
});

byui.extend('registerXmlTemplate', function(obj){
	if (byui.fn._internal.getType(obj.obj) != 'object') throw 'Expected object';
	var keys = Object.keys(obj.obj);
	if (keys.length > 1) throw 'Only 1 key is allowed';
	if (keys.length == 0) throw 'Expected object';
	var name = keys[0];
	byui.template[obj.name] = {
		config: obj.obj,
		xml: byui.createNode(name, obj.obj[name]),
		functions: obj.functions,
		paths: obj.paths
	};
});

byui.extend('getTemplate', function(name){
	return byui.template[name];
})

function test(){
	var example = {
		test: {
			test: 'test'
		}
	}
	byui.registerXmlTemplate({
		name: 'example',
		obj: example,
		functions: {
			addPerson: function(first, last, email){
				email = byui(email).val();
				first = byui(first).asName();
				last = byui(last).asName();
				var xml = byui.createNode('person', {
					first: first,
					last: last,
					email: email
				});
				var t = byui.template.example;
				$(byui.template.example.xml).find(t.paths.topPeople).append(xml);
			},
			getPerson: function(email){
				var t = byui.template.example;
				email = byui(email).val();
				return $(byui.template.example.xml).find(t.paths.topPeople + '[email=' + email + ']')[0];
			}
		},
		paths: {
			topPeople: 'semester[code=FA15] > people > person'
		}
	})
}