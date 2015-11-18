byui._code = '';
byui.compile = function(){
	var included = Object.keys(byui._included);
	var total = included.length;
	var spot = 0;
	byui.http.get('core/core.js', function(core){
		byui._code += byui.cleanCode(core);
		for (var i = 0; i < included.length; i++){
			var comp = included[i].split(/\./g);
			var url = 'core/';
			for (var i = 0; i < comp.length; i++){
				url += comp[i] + (i == comp.length - 1 ? '.js' : '/');
			}
			byui.http.get(url, function(js){
				byui._code += byui.cleanCode(js);
				if (spot++ == total){
					console.log(byui._code);
				}
			});
		}
	});
}

byui.cleanCode = function(code){
	var starComments = /(?:\/\*(?:[\s\S]*?)\*\/)|(?:\/\/(?:.*))/g;
	var lineComments = /\/\/.*/g;
	var newLines = /\n\n/g;
	return code.replace(starComments, '').replace(lineComments, '').replace(newLines, '');
}