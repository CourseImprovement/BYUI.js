/**
 * Init the BYUI url namespace
 * @type {Object}
 * @namespace byui.url
 * @memberOf byui
 */
byui.url = byui.url || {}

/**
 * Init the BYUI url params
 * @type {Object}
 * @memberOf byui
 * @namespace byui.url.params
 */
byui.url.params = byui.url.params || {}

// Set all the current variables
byui.url.params._current = (function(){
	var map = {};
  var loc = window.location.href;
  if (loc.indexOf('#') > -1){
    loc = loc.split('#')[0];
  }
  var hashes = loc.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
      hash = hashes[i].split('=');
      map[hash[0]] = hash[1];
  }
  return map;
})()

/**
 * Get the param if exists
 * @param  {String} name The name of the param or * may be used
 * @return {String|Object} 
 * @function
 * @memberOf byui.url.params     
 */
byui.url.params.get = function(name){
	if (!name) byui.error('Expected string for url', 'byui.url.params.get');
	if (name == '*'){
		return byui.url.params._current;
	}
	else{
		return byui.url.params._current[name];
	}
}