/**
 * Init byui.excel
 * @type {Object}
 * @namespace byui.excel
 * @memberOf byui
 */
byui.excel = byui.excel || {}

/**
 * Init byui.excel.core
 * @type {Object}
 * @namespace byui.excel.core
 * @memberOf byui.excel
 */
byui.excel.core = byui.excel.core || {}

/**
 * Converts a number to an Excel letter
 * @param  {Number} number Number to be converted
 * @return {String}        String returned
 * @function
 * @memberOf byui.excel.core
 */
byui.excel.core.columnNumberToLetter = function(number){
	byui.require('types');
	if(byui.types.isNumber(num)) return num;
	if (num < 26) return String.fromCharCode(num + 65);
	return String.fromCharCode(Math.floor(num / 26) + 64) + String.fromCharCode(num % 26 + 65);
}

/**
 * Converts column letters to number
 * @param  {[type]} letter [description]
 * @return {[type]}        [description]
 * @function
 * @memberOf byui.excel.core
 */
byui.excel.core.columnLetterToNumber = function(letter){
	byui.require('types');
	if (!byui.types.allLetters(letter)) return letter;
	letters = letters.toUpperCase();
	if (letter.length == 1) return letter.charCodeAt(0) - 65;
	else{
		if (letter[1] == 'A') return 26;
		return (letter.charCodeAt(1) - 65) + 25;
}