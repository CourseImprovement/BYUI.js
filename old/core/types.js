/**
 * Get all the types
 * @type {Object}
 * @namespace byui.types
 * @memberOf byui
 */
byui.types = byui.types || {}

/**
 * Get the base type
 * @param  {Object} obj [description]
 * @return {String}     The type. e.g. Array|Object|String
 */
byui.types.base = function(obj){
	var type = Object.prototype.toString.call(obj);
	return type.replace('[object ', '').replace(']', '');
}

/** 
 * Is an array
 * @param  {Anything}  obj Anything
 * @return {Boolean}
 * @memberOf byui.types
 */
byui.types.isArray = function(obj){
	return byui.types.base(obj) === 'Array';
}

/**
 * Is an Object
 * @param  {Anything}  obj Anything
 * @return {Boolean}
 * @memberOf byui.types
 */
byui.types.isObject = function(obj){
	return byui.types.base(obj) === 'Object';
}

/**
 * Is a string
 * @param  {Anything}  obj Anything
 * @return {Boolean}
 * @memberOf byui.types
 */
byui.types.isString = function(obj){
	return byui.types.base(obj) === 'String';
}

/**
 * Is a null or undefined
 * @param  {Anything}  obj Anything
 * @return {Boolean}
 * @memberOf byui.types
 */
byui.types.isNull = function(obj){
	var base = byui.types.base(obj);
	return base === 'Null' || base === 'Undefined';
}

/**
 * Is a number
 * @param  {Anything}  obj Anything
 * @return {Boolean}
 * @memberOf byui.types
 */
byui.types.isNull = function(obj){
	return byui.types.base(obj) === 'Number';
}

/**
 * Check if all the characters are letters
 * @param  {String} str String of text
 * @return {Boolean}   
 */
byui.types.allLetters = function(str){
	if (!byui.types.isString(str)) return false;
	var matched = str.match(/[a-zA-Z]+/g);
	return matched && matched[0].length == str.length;
}