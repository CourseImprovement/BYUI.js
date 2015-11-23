/**
 * Globals namespace
 * @type {Object}
 * @namespace byui.globals
 * @memberOf byui
 */
byui.globals = byui.globals || {}

// Basic "database" for the objects
byui.globals._db = {};

/**
 * Add value to the global variables
 * @param {String} name  Name of the variable
 * @param {Object} value Value of the variable
 * @function
 * @memberOf byui.globals
 */
byui.globals.add = function(name, value){
	if (!byui.globals.exists(name)) byui.globals._db[name] = [value];
	else byui.globals._db[name].push(value);
}

/**
 * Variable exists
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 * @function
 * @memberOf byui.globals
 */
byui.globals.exists = function(name){
	byui.require('types');
	return byui.types.isArray(byui.globals._db[name]) && byui.globals._db[name].length > 0;
}

/**
 * Get a global variable
 * @param  {String} name Name of the variable
 * @return {Object}      The variable value
 * @function
 * @memberOf byui.globals
 */
byui.globals.get = function(name){
	if (!byui.globals.exists(name)) return null;
	return byui.globals._db[name][byui.globals._db[name].length - 1]; // return the most recent
}

/**
 * Clear the global variables
 * @param  {String} name String|*
 * @function
 * @memberOf byui.globals
 */
byui.globals.clear = function(name){
	if (name == '*') byui.globals._db = {};
	delete byui.globals._db[name];
}

/**
 * Get the previous value for the variable
 * @param  {String} name The name of the variable
 * @return {[type]}      The variable
 * @function
 * @memberOf byui.globals
 */
byui.globals.prev = function(name){
	if (!byui.globals.exists(name)) return null;
	else if (byui.globals._db[name].length == 1) return byui.globals.get(name);
	return byui.globals._db[name][byui.globals._db[name].length - 2];
}