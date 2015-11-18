byui._code = '';
byui.compile = function(){
	var included = Object.keys(byui._included);
	byui.http.get('core/core.js', function(core){
		var code = byui.cleanCode(core);
	});
}

byui.cleanCode = function(code){
	var starComments = /(?:\/\*(?:[\s\S]*?)\*\/)|(?:\/\/(?:.*))/g;
	var lineComments = /\/\/.*/g;
	var newLines = /\n\n/g;
	return code.replace(starComments, '').replace(lineComments, '').replace(newLines, '');
}