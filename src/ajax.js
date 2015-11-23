/**
 * {
 * 		calls: [
 * 			{
 * 				url: '',
 * 				data: {},
 * 				headers: {},
 * 				name: ''
 * 			}
 * 		],
 * 		done: function(errors, success){},
 * 		stopOnFail: false,
 * 		progress: function(spot, total){}
 * }
 */
byui.extend('ajaxPool', function(obj){
	if (!byui.fn._internal.getType(obj) == 'object') throw 'Invalid ajaxPool, expected object';
	this.ajaxConfig = {
		init: obj,
		total: obj.calls.length,
		spot: 0,
		success: {},
		error: []
	}
	if (obj.stopOnFail == undefined || obj.stopOnFail == null) obj.stopOnFail = false;
	var _this = this;
	function checkComplete(err){
		if (++_this.ajaxConfig.spot == _this.ajaxConfig.total || (err && obj.stopOnFail)){
			obj.done(_this.ajaxConfig.error, _this.ajaxConfig.success);
			return;
		}
		if (obj.progress){
			obj.progress(_this.ajaxConfig.spot, _this.ajaxConfig.total);
		}
	}
	for (var i = 0; i < this.ajaxConfig.total; i++){
		var c = this.ajaxConfig.init.calls[i];
		c.method = !c.method ? 'GET' : c.method;
		(function(idx, c){
			$.ajax({
				method: c.method,
				url: c.url,
				data: c.data,
				headers: c.headers,
				success: function(data){
					if (!c.name) c.name = idx;
					_this.ajaxConfig.success[c.name] = data;
					checkComplete();
				},
				error: function(a, b, c){
					_this.ajaxConfig.error.push({
						code: b,
						msg: c
					})
					checkComplete(true);
				}
			})
		})(i, c);
	}
});

function test2(){
	byui.ajaxPool({
		calls: [
			{
				url: 'https://courseimprovement.github.io/BYUI.js/test/all.html'
			},
			{
				url: 'https://courseimprovement.github.io/BYUI.js/package.json'
			},
			{
				url: 'https://courseimprovement.github.io/BYUI.js/Gruntfile.js'
			},
			{
				url: 'https://courseimprovement.github.io/BYUI.js/README.md'
			},
			{
				url: 'https://courseimprovement.github.io/BYUI.js/build/byui.js'
			},
			{
				url: 'https://courseimprovement.github.io/BYUI.js/src/ajax.js'
			},
			{
				url: 'https://courseimprovement.github.io/BYUI.js/src/array.js'
			},
			{
				url: 'https://courseimprovement.github.io/BYUI.js/src/csv.js'
			},
			{
				url: 'https://courseimprovement.github.io/BYUI.js/src/init.js'
			},
			{
				url: 'https://courseimprovement.github.io/BYUI.js/src/xml.js'
			}
		],
		done: function(err, succ){
			console.log(err);
			console.log(succ);
		},
		stopOnFail: false,
		progress: function(spot, total){
			console.log(Math.floor((spot / total) * 100) + '%');
		}
	});
}