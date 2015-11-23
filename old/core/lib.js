/**
 * Init byui.lib
 * @namespace byui.lib
 * @memberOf byui
 * @type {Object}
 */
byui.lib = byui.lib || {}

byui.lib._libs = {
	jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js',
	angular: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-beta.1/angular.min.js',
	angularRoute: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-beta.1/angular-route.min.js',
	highcharts: 'https://cdnjs.cloudflare.com/ajax/libs/highcharts/4.1.9.1/highcharts.js'
}

/**
 * Include a popular library
 * @param  {String} name Name of the library
 * @return {[type]}      [description]
 * @function
 * @memberOf byui.lib
 */
byui.lib.include = function(name){
	var url = byui.lib._libs[name];
	if (url){
		byui._ready.queue++;
		byui.http.get(url, function(js){
			eval(js);
			byui._ready.loaded++;
		});
	}
	else{
		byui.error('Library not added, please add');
	}
}