/**
 * Init the BYUI object
 * @type {Object}
 * @namespace byui
 */
var byui = window.byui = window.byui || {};

/**
 * Include other modules into the program
 * @memberOf byui
 * @function
 * @param  {String} path e.g. ('path') ('ui.button')
 */
byui.include = function(path){
	var comp = path.split(/\./g);
	var url = 'core/';
	for (var i = 0; i < comp.length; i++){
		url += comp[i] + (i == comp.length - 1 ? '.js' : '/');
	}
	byui._ready.queue++;
	byui.http.get(url, function(js){
		eval(js);
		byui._ready.loaded++;
	});
}

/**
 * Variable to save the queue and the number of modules loaded
 * @type {Object}
 */
byui._ready = {
	queue: 0,
	loaded: 0,
	interval: null;
}

/**
 * Run the function once all the modules are loaded
 * @param  {Function} callback The function to be called
 * @function
 * @memberOf byui
 */
byui.ready = function(callback){
	byui._ready.interval = setInterval(function(){
		if (byui._ready.queue == byui._ready.loaded){
			callback();
			clearInterval(byui._ready.interval);
		}
	}, 100);
}

/**
 * Init the byui.http object
 * @namespace byui.http
 * @memberOf byui
 * @type {Object}
 */
byui.http = byui.http || {};

/**
 * Perform a basic ajax call
 * @param  {Object} obj [description]
 * @function
 * @memberOf byui.http
 */
byui.http.ajax = function(obj){
	var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
      	if (obj.callback){
      		obj.callback(xmlHttp.responseText);
      	}
      }
  }
  xmlHttp.open(obj.method, obj.url, obj.async); // true for asynchronous 
  xmlHttp.send(null);
}

/**
 * Perform a basic get request
 * @param  {String}   url      Path to GET
 * @param  {Function} callback Callback function once its returned
 * @function
 * @memberOf byui.http
 */
byui.http.get = function(url, callback){
	byui.http.ajax({
		method: 'GET',
		callback: callback,
		url: url,
		async: true
	});
}

/**
 * Throw an error
 * @param  {String} msg  Name of the message
 * @param  {String} path Path where the error was thrown
 * @memberOf byui
 * @function
 */
byui.error = function(msg, path){
	throw msg + ', found in ' + path;
}