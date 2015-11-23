/**
 * Init the xml namespace
 * @namespace byui.xml
 * @memberOf byui
 * @type {Object}
 */
byui.xml = byui.xml || {}

/**
 * Create a XML string node
 * Example Usage:
 * 		
 * @param  {String} name  The node name
 * @param  {Object} attrs The attributes in an object form
 * @return {String}       The constructructed XML string
 */
byui.xml.createNode = function(name, attrs){
	byui.require('types');
	if (!byui.types.isObject(attrs)) byui.error('Invalid attr arg');
	var node = '<' + name;
	for (var key in attrs){
		node += ' ' + key + '="' + attrs[key] + '"';
	}
	return node + ' />';
}

/**
 * Create a new node from old node
 * @param  {XMLNode} oldXml The old xml node
 * @param  {String} name  The node name
 * @param  {Object} {oldName: newName}
 * @param  {Boolean} removeExtra Remove the extra attrs
 * @return {String}       The constructructed XML string
 */
byui.xml.createNodeFromOld = function(oldXml, name, attrs, removeExtra){
	byui.require('lib');
	if (!window.$) byui.error('Import JQuery');
	var result;
	

	return result;
}