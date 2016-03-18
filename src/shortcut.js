byui.extend('shortcut', function(shortcut, callback){
	if (byui.fn._internal.getType(shortcut) != 'string') throw 'Expected string';
	if (!callback) throw 'Expected callback';
	this.fn._internal.shortcuts.push({
		shortcut: parseShortcut(shortcut),
		callback: callback
	});
	function parseShortcut(str){
		var shift = false;
		var ctrl = false;
		var key = -1;
		if (str.indexOf('+') > -1){
			var comps = str.split('+');
			shift = comps[0].toLowerCase() == 'shift';
			ctrl = comps[0].toLowerCase() == 'ctrl';
			key = comps[1].toLowerCase().charCodeAt(0);
		}
		else{
			key = str.toLowerCase().charCodeAt(0);
		}
		return {
			shift: shift,
			ctrl: ctrl,
			key: key
		};
	}
	var _byui = this;
	$(window).bind('keypress', function(e){
		var code = String.fromCharCode(e.keyCode).toLowerCase().charCodeAt(0);
		for (var i = 0; i < _byui.fn._internal.shortcuts.length; i++){
			var c = _byui.fn._internal.shortcuts[i];
			if (e.shiftKey != c.shortcut.shift) continue;
			if (e.ctrlKey != c.shortcut.ctrl) continue;
			if (code == c.shortcut.key) c.callback();
		}
	});
});

byui.shortcut('shift+a', function(){
	console.log('yup');
});