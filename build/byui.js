/**
 * RULES:
 * 	1. If it's not been developed yet, return undefined
 */


window.byui = (function(){

	var version = '0.2.0',
			name = 'byui',
			_byui = function(selector){
				return new _byui.init(selector);
			};

	// basic checks
	if (!window.$ || !window.jQuery) throw 'Expected jQuery, please include';

	_byui.init = function(selector){
		if (selector == null) selector = window;
		this.initalContext = selector;
		this.context = this.initalContext;
		this.errors = [];
		this.type();
		this.x99909 = true;
		if (this.baseType == 'object' && this.initalContext.x99909){
			this.context = this.initalContext.context;
			this.baseType = this.initalContext.baseType;
			this.initalContext = this.initalContext.initalContext;
		}
		_byui.fn._internal.clean(this);
	}

	_byui.globals = {};
	_byui.template = {};

	_byui.fn = function(name, obj){
		_byui.fn[name] = obj;
	}

	_byui.version = version;
	_byui.name = name;

	_byui.extend = function(name, obj){
		_byui[name] = obj;
	}

	_byui.fn._internal = {
		getType: function(obj){
			var t = Object.prototype.toString.call(obj);
			var ty = t.replace('[object ', '').replace(']', '').toLowerCase();
			if (ty.indexOf('element') > -1 || ty == 'xmldocument') return 'xml';
			return ty;
		},
		clean: function(a){
			switch (a.type()){
				case 'string': {
					if (a.exists('http')){
						try{
							var u = new URL(a.context);
						}
						catch (e){
							var err = 'Invalid URL';
							a.errors.push(err);
							console.log(err);
						}
						break;
					}
					else if (a.exists('@')){
						a.context = a.context.split('@')[0];
						break;
					}
					else if (a.context.match(_byui.fn._internal.regex.ALL_NUMBERS)){
						var num = new Number(a.context).valueOf();
						if (!isNaN(num)){
							a.context = num;
						}
						break;
					}
				}
			}
		},
		regex: {
			SPACE: / /g,
			ALL_NUMBERS: /[0-9]+$/g
		},
		shortcuts: []
	}

	_byui.fn.type = function(expected){
		if (!!expected) return expected === this.baseType;
		this.baseType = _byui.fn._internal.getType(this.context);
		return this.baseType
	}

	_byui.fn.$ = function(selector){
		return $(selector);
	}

	_byui.fn.raw = function(){return this.initalContext;}

	_byui.init.prototype = _byui.fn;

	return _byui;

})();
/**
 * {
 * 		calls: [
 * 			{
 * 				url: '',
 * 				data: {},
 * 				headers: {},
 * 				name: '',
 * 				callAfter: ''
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
					if (!c.name) c.name = idx + 1;
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
byui.fn('len', function(){
	switch (this.type()){
		case 'array': case 'string': {
			return this.context.length;
		}
		default: {
			return undefined;
		}
	}
});

byui.fn('remove', function(idx, num){
	if (!num){
		num = 1;
	}
	switch (this.type()){
		case 'string': {
			if (idx == 0){
				this.context = this.context.slice(1);
			}
			else{
				this.context = this.context.slice(0, num) + this.context.slice((num + 1));
			}
			return this;
		}
		case 'array': {
			this.context.splice(idx, num);
			return this;
		}
	}
});

byui.fn('exists', function(what){
	switch (this.type()){
		case 'string': case 'array': {
			return this.context.indexOf(what) > -1;
		}
		case 'number': {
			var str = this.context + '';
			return str.indexOf(what) > -1;
		}
		case 'object': {
			var keys = this.keys();
			return keys.indexOf(what) > -1;
		}
		default: {
			return undefined;
		}
	}
});

/**
 * Do we pass the value through?
 */
byui.fn('val', function(idx){
	var includeJquery = false;
	if (byui.fn._internal.getType(idx) == 'string' && idx == 'jquery') includeJquery = true;
	switch (this.type()){
		case 'string': case 'array': {
			if (byui.fn._internal.getType(idx) == 'number'){
				return this.context[idx];
			}
		}
		default: {
			if (includeJquery) return $(this.context);
			return this.context;
		}
	}
});

byui.fn('index', function(val){
	switch (this.type()){
		case 'string': case 'array': {
			return this.context.indexOf(val);
		}
		default: {
			return undefined;
		}
	}
});

byui.fn('same', function(obj){
	var str = JSON.stringify(obj);
	var str2 = JSON.stringify(this.context);
	return str == str2 && this.type() == byui.fn._internal.getType(obj);
});

byui.fn('filter', function(obj){
	if (obj.returnValue == null || obj.returnValue == undefined) obj.returnValue = false;
	if (!obj.type) obj.type == 'out';
	var ary = [];
	switch (this.type()){
		case 'array': {
			var len = this.len();
			for (var i = 0; i < len; i++){
				if (obj.type == 'out' && this.context[i] != obj.val) ary.push(this.context[i]);
				else if (obj.type == 'in' && this.context[i] == obj.val) ary.push(this.context[i]);
			}
			break;
		}
		default: {
			this.context = '';
		}
	}
	if (obj.returnValue){
		return byui(ary);
	}
	else{
		this.context = ary;
		return this;
	}
});

byui.fn('each', function(callback){
	var keys = this.keys();
	var len = keys.length;
	for (var i = 0; i < len; i++){
		var val = callback(i, this.context[keys[i]]);
	}
});
byui.extend('client', (function(){
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion); 
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome" 
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version" 
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox" 
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent 
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
	          (verOffset=nAgt.lastIndexOf('/')) ) 
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion); 
	 majorVersion = parseInt(navigator.appVersion,10);
	}
	var OSName="Unknown OS";
	if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
	if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
	if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

	return {
		browser: browserName + ':' + fullVersion,
		os: OSName
	}
})());
/*!
	Papa Parse
	v4.1.2
	https://github.com/mholt/PapaParse
*/
(function(g){function D(a){this._handle=null;this._finished=this._paused=!1;this._input=null;this._baseIndex=0;this._partialLine="";this._start=this._rowCount=0;this._nextChunk=null;this.isFirstChunk=!0;this._completeResults={data:[],errors:[],meta:{}};(function(a){var c=L(a);c.chunkSize=parseInt(c.chunkSize);a.step||a.chunk||(c.chunkSize=null);this._handle=new P(c);this._handle.streamer=this;this._config=c}).call(this,a);this.parseChunk=function(a){if(this.isFirstChunk&&k(this._config.beforeFirstChunk)){var c=
this._config.beforeFirstChunk(a);void 0!==c&&(a=c)}this.isFirstChunk=!1;c=this._partialLine+a;this._partialLine="";a=this._handle.parse(c,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var m=a.meta.cursor;this._finished||(this._partialLine=c.substring(m-this._baseIndex),this._baseIndex=m);a&&a.data&&(this._rowCount+=a.data.length);c=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(M)g.postMessage({results:a,workerId:e.WORKER_ID,finished:c});
else if(k(this._config.chunk)){this._config.chunk(a,this._handle);if(this._paused)return;this._completeResults=a=void 0}this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(a.data),this._completeResults.errors=this._completeResults.errors.concat(a.errors),this._completeResults.meta=a.meta);!c||!k(this._config.complete)||a&&a.meta.aborted||this._config.complete(this._completeResults);c||a&&a.meta.paused||this._nextChunk();return a}};this._sendError=function(a){k(this._config.error)?
this._config.error(a):M&&this._config.error&&g.postMessage({workerId:e.WORKER_ID,error:a,finished:!1})}}function y(a){a=a||{};a.chunkSize||(a.chunkSize=e.RemoteChunkSize);D.call(this,a);var b;this._nextChunk=B?function(){this._readChunk();this._chunkLoaded()}:function(){this._readChunk()};this.stream=function(a){this._input=a;this._nextChunk()};this._readChunk=function(){if(this._finished)this._chunkLoaded();else{b=new XMLHttpRequest;this._config.withCredentials&&(b.withCredentials=this._config.withCredentials);
B||(b.onload=I(this._chunkLoaded,this),b.onerror=I(this._chunkError,this));b.open("GET",this._input,!B);this._config.chunkSize&&(b.setRequestHeader("Range","bytes="+this._start+"-"+(this._start+this._config.chunkSize-1)),b.setRequestHeader("If-None-Match","webkit-no-cache"));try{b.send()}catch(a){this._chunkError(a.message)}B&&0===b.status?this._chunkError():this._start+=this._config.chunkSize}};this._chunkLoaded=function(){if(4==b.readyState)if(200>b.status||400<=b.status)this._chunkError();else{var a;
if(!(a=!this._config.chunkSize)){a=this._start;var e;e=b.getResponseHeader("Content-Range");e=parseInt(e.substr(e.lastIndexOf("/")+1));a=a>e}this._finished=a;this.parseChunk(b.responseText)}};this._chunkError=function(a){this._sendError(b.statusText||a)}}function z(a){a=a||{};a.chunkSize||(a.chunkSize=e.LocalChunkSize);D.call(this,a);var b,c,m="undefined"!==typeof FileReader;this.stream=function(a){this._input=a;c=a.slice||a.webkitSlice||a.mozSlice;m?(b=new FileReader,b.onload=I(this._chunkLoaded,
this),b.onerror=I(this._chunkError,this)):b=new FileReaderSync;this._nextChunk()};this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()};this._readChunk=function(){var a=this._input;this._config.chunkSize&&(a=c.call(a,this._start,Math.min(this._start+this._config.chunkSize,this._input.size)));a=b.readAsText(a,this._config.encoding);m||this._chunkLoaded({target:{result:a}})};this._chunkLoaded=function(a){this._start+=this._config.chunkSize;
this._finished=!this._config.chunkSize||this._start>=this._input.size;this.parseChunk(a.target.result)};this._chunkError=function(){this._sendError(b.error)}}function w(a){a=a||{};D.call(this,a);var b;this.stream=function(a){b=a;return this._nextChunk()};this._nextChunk=function(){if(!this._finished){var a=this._config.chunkSize,e=a?b.substr(0,a):b;b=a?b.substr(a):"";this._finished=!b;return this.parseChunk(e)}}}function P(a){function b(){h&&J&&(c("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+
e.DefaultDelimiter+"'"),J=!1);if(a.skipEmptyLines)for(var b=0;b<h.data.length;b++)1===h.data[b].length&&""===h.data[b][0]&&h.data.splice(b--,1);if(a.header&&0===l.length&&h){for(b=0;a.header&&0===l.length&&b<h.data.length;b++)for(var d=0;d<h.data[b].length;d++)l.push(h.data[b][d]);h.data.splice(0,1)}if(h&&(a.header||a.dynamicTyping)){for(b=0;b<h.data.length;b++){for(var d={},t=0;t<h.data[b].length;t++){if(a.dynamicTyping){var p=h.data[b][t],u=h.data[b],f=t,p="true"===p||"TRUE"===p?!0:"false"===p||
"FALSE"===p?!1:m.test(p)?parseFloat(p):p;u[f]=p}a.header&&(t>=l.length?(d.__parsed_extra||(d.__parsed_extra=[]),d.__parsed_extra.push(h.data[b][t])):d[l[t]]=h.data[b][t])}a.header&&(h.data[b]=d,t>l.length?c("FieldMismatch","TooManyFields","Too many fields: expected "+l.length+" fields but parsed "+t,b):t<l.length&&c("FieldMismatch","TooFewFields","Too few fields: expected "+l.length+" fields but parsed "+t,b))}a.header&&h.meta&&(h.meta.fields=l)}b=h;return b}function c(a,b,c,d){h.errors.push({type:a,
code:b,message:c,row:d})}var m=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,g=this,f=0,u,d,p=!1,t=!1,J,l=[],h={data:[],errors:[],meta:{}};if(k(a.step)){var F=a.step;a.step=function(c){h=c;a.header&&0===l.length?b():(b(),0!==h.data.length&&(f+=c.data.length,a.preview&&f>a.preview?d.abort():F(h,g)))}}this.parse=function(c,t,m){var f;if(!a.newline){var l;l=c.substr(0,1048576);l=l.split("\r");if(1===l.length)l="\n";else{for(var g=0,k=0;k<l.length;k++)"\n"===l[k][0]&&g++;l=g>=l.length/2?"\r\n":"\r"}a.newline=
l}J=!1;if(!a.delimiter){l=a.newline;for(var g=[",","\t","|",";",e.RECORD_SEP,e.UNIT_SEP],F,x=0;x<g.length;x++){for(var Q=g[x],q=0,E=0,k=void 0,n=(new N({delimiter:Q,newline:l,preview:10})).parse(c),v=0;v<n.data.length;v++){var H=n.data[v].length,E=E+H;"undefined"===typeof k?k=H:1<H&&(q+=Math.abs(H-k),k=H)}0<n.data.length&&(E/=n.data.length);("undefined"===typeof f||q<f)&&1.99<E&&(f=q,F=Q)}(f=a.delimiter=F)?a.delimiter=f:(J=!0,a.delimiter=e.DefaultDelimiter);h.meta.delimiter=a.delimiter}F=L(a);a.preview&&
a.header&&F.preview++;u=c;d=new N(F);h=d.parse(u,t,m);b();return p?{meta:{paused:!0}}:h||{meta:{paused:!1}}};this.paused=function(){return p};this.pause=function(){p=!0;d.abort();u=u.substr(d.getCharIndex())};this.resume=function(){p=!1;g.streamer.parseChunk(u)};this.aborted=function(){return t};this.abort=function(){t=!0;d.abort();h.meta.aborted=!0;k(a.complete)&&a.complete(h);u=""}}function N(a){a=a||{};var b=a.delimiter,c=a.newline,m=a.comments,g=a.step,f=a.preview,u=a.fastMode;if("string"!==typeof b||
-1<e.BAD_DELIMITERS.indexOf(b))b=",";if(m===b)throw"Comment character same as delimiter";if(!0===m)m="#";else if("string"!==typeof m||-1<e.BAD_DELIMITERS.indexOf(m))m=!1;"\n"!=c&&"\r"!=c&&"\r\n"!=c&&(c="\n");var d=0,p=!1;this.parse=function(a,e,l){function h(a){x.push(a);E=d}function k(b){if(l)return r();"undefined"===typeof b&&(b=a.substr(d));q.push(b);d=D;h(q);z&&w();return r()}function B(b){d=b;h(q);q=[];v=a.indexOf(c,d)}function r(a){return{data:x,errors:C,meta:{delimiter:b,linebreak:c,aborted:p,
truncated:!!a,cursor:E+(e||0)}}}function w(){g(r());x=[];C=[]}if("string"!==typeof a)throw"Input must be a string";var D=a.length,G=b.length,A=c.length,y=m.length,z="function"===typeof g;d=0;var x=[],C=[],q=[],E=0;if(!a)return r();if(u||!1!==u&&-1===a.indexOf('"')){G=a.split(c);for(A=0;A<G.length;A++){q=G[A];d+=q.length;if(A!==G.length-1)d+=c.length;else if(l)break;if(!m||q.substr(0,y)!==m){if(z){if(x=[],h(q.split(b)),w(),p)break}else h(q.split(b));if(f&&A>=f)return x=x.slice(0,f),r(!0)}}return r()}for(var n=
a.indexOf(b,d),v=a.indexOf(c,d);;)if('"'===a[d])for(n=d,d++;;){n=a.indexOf('"',n+1);if(-1===n)return l||C.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:x.length,index:d}),k();if(n===D-1)return y=a.substring(d,n).replace(/""/g,'"'),k(y);if('"'===a[n+1])n++;else{if(a[n+1]===b){q.push(a.substring(d,n).replace(/""/g,'"'));d=n+1+G;n=a.indexOf(b,d);v=a.indexOf(c,d);break}if(a.substr(n+1,A)===c){q.push(a.substring(d,n).replace(/""/g,'"'));B(n+1+A);n=a.indexOf(b,d);if(z&&
(w(),p))return r();if(f&&x.length>=f)return r(!0);break}}}else if(m&&0===q.length&&a.substr(d,y)===m){if(-1===v)return r();d=v+A;v=a.indexOf(c,d);n=a.indexOf(b,d)}else if(-1!==n&&(n<v||-1===v))q.push(a.substring(d,n)),d=n+G,n=a.indexOf(b,d);else if(-1!==v){q.push(a.substring(d,v));B(v+A);if(z&&(w(),p))return r();if(f&&x.length>=f)return r(!0)}else break;return k()};this.abort=function(){p=!0};this.getCharIndex=function(){return d}}function U(){var a=document.getElementsByTagName("script");return a.length?
a[a.length-1].src:""}function V(a){var b=a.data;a=K[b.workerId];var c=!1;if(b.error)a.userError(b.error,b.file);else if(b.results&&b.results.data){var e={abort:function(){c=!0;R(b.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:S,resume:S};if(k(a.userStep)){for(var g=0;g<b.results.data.length&&(a.userStep({data:[b.results.data[g]],errors:b.results.errors,meta:b.results.meta},e),!c);g++);delete b.results}else k(a.userChunk)&&(a.userChunk(b.results,e,b.file),delete b.results)}b.finished&&!c&&
R(b.workerId,b.results)}function R(a,b){var c=K[a];k(c.userComplete)&&c.userComplete(b);c.terminate();delete K[a]}function S(){throw"Not implemented.";}function W(a){a=a.data;"undefined"===typeof e.WORKER_ID&&a&&(e.WORKER_ID=a.workerId);"string"===typeof a.input?g.postMessage({workerId:e.WORKER_ID,results:e.parse(a.input,a.config),finished:!0}):(g.File&&a.input instanceof File||a.input instanceof Object)&&(a=e.parse(a.input,a.config))&&g.postMessage({workerId:e.WORKER_ID,results:a,finished:!0})}function L(a){if("object"!==
typeof a)return a;var b=a instanceof Array?[]:{},c;for(c in a)b[c]=L(a[c]);return b}function I(a,b){return function(){a.apply(b,arguments)}}function k(a){return"function"===typeof a}var B=!g.document&&!!g.postMessage,M=B&&/(\?|&)papaworker(=|&|$)/.test(g.location.search),O=!1,T,K={},X=0,e={parse:function(a,b){b=b||{};if(b.worker&&e.WORKERS_SUPPORTED){var c;if(e.WORKERS_SUPPORTED){if(!O&&null===e.SCRIPT_PATH)throw Error("Script path cannot be determined automatically when Papa Parse is loaded asynchronously. You need to set Papa.SCRIPT_PATH manually.");
c=e.SCRIPT_PATH||T;c+=(-1!==c.indexOf("?")?"&":"?")+"papaworker";c=new g.Worker(c);c.onmessage=V;c.id=X++;K[c.id]=c}else c=!1;c.userStep=b.step;c.userChunk=b.chunk;c.userComplete=b.complete;c.userError=b.error;b.step=k(b.step);b.chunk=k(b.chunk);b.complete=k(b.complete);b.error=k(b.error);delete b.worker;c.postMessage({input:a,config:b,workerId:c.id})}else{c=null;if("string"===typeof a)c=b.download?new y(b):new w(b);else if(g.File&&a instanceof File||a instanceof Object)c=new z(b);return c.stream(a)}},
unparse:function(a,b){function c(a){if("object"!==typeof a)return[];var b=[],c;for(c in a)b.push(c);return b}function g(a,b){var c="";"string"===typeof a&&(a=JSON.parse(a));"string"===typeof b&&(b=JSON.parse(b));var e=a instanceof Array&&0<a.length,h=!(b[0]instanceof Array);if(e){for(var f=0;f<a.length;f++)0<f&&(c+=u),c+=k(a[f],f);0<b.length&&(c+=d)}for(f=0;f<b.length;f++){for(var m=e?a.length:b[f].length,r=0;r<m;r++)0<r&&(c+=u),c+=k(b[f][e&&h?a[r]:r],r);f<b.length-1&&(c+=d)}return c}function k(a,
b){if("undefined"===typeof a||null===a)return"";a=a.toString().replace(/"/g,'""');var c;if(!(c="boolean"===typeof f&&f||f instanceof Array&&f[b]))a:{c=a;for(var d=e.BAD_DELIMITERS,h=0;h<d.length;h++)if(-1<c.indexOf(d[h])){c=!0;break a}c=!1}return c||-1<a.indexOf(u)||" "===a.charAt(0)||" "===a.charAt(a.length-1)?'"'+a+'"':a}var f=!1,u=",",d="\r\n";if("object"===typeof b){"string"===typeof b.delimiter&&1===b.delimiter.length&&-1===e.BAD_DELIMITERS.indexOf(b.delimiter)&&(u=b.delimiter);if("boolean"===
typeof b.quotes||b.quotes instanceof Array)f=b.quotes;"string"===typeof b.newline&&(d=b.newline)}"string"===typeof a&&(a=JSON.parse(a));if(a instanceof Array){if(!a.length||a[0]instanceof Array)return g(null,a);if("object"===typeof a[0])return g(c(a[0]),a)}else if("object"===typeof a)return"string"===typeof a.data&&(a.data=JSON.parse(a.data)),a.data instanceof Array&&(a.fields||(a.fields=a.meta&&a.meta.fields),a.fields||(a.fields=a.data[0]instanceof Array?a.fields:c(a.data[0])),a.data[0]instanceof
Array||"object"===typeof a.data[0]||(a.data=[a.data])),g(a.fields||[],a.data||[]);throw"exception: Unable to serialize unrecognized input";}};e.RECORD_SEP=String.fromCharCode(30);e.UNIT_SEP=String.fromCharCode(31);e.BYTE_ORDER_MARK="\ufeff";e.BAD_DELIMITERS=["\r","\n",'"',e.BYTE_ORDER_MARK];e.WORKERS_SUPPORTED=!B&&!!g.Worker;e.SCRIPT_PATH=null;e.LocalChunkSize=10485760;e.RemoteChunkSize=5242880;e.DefaultDelimiter=",";e.Parser=N;e.ParserHandle=P;e.NetworkStreamer=y;e.FileStreamer=z;e.StringStreamer=
w;"undefined"!==typeof module&&module.exports?module.exports=e:k(g.define)&&g.define.amd?define(function(){return e}):g.Papa=e;if(g.jQuery){var C=g.jQuery;C.fn.parse=function(a){function b(){if(0===f.length)k(a.complete)&&a.complete();else{var b=f[0];if(k(a.before)){var d=a.before(b.file,b.inputElem);if("object"===typeof d){if("abort"===d.action){c("AbortError",b.file,b.inputElem,d.reason);return}if("skip"===d.action){m();return}"object"===typeof d.config&&(b.instanceConfig=C.extend(b.instanceConfig,
d.config))}else if("skip"===d){m();return}}var g=b.instanceConfig.complete;b.instanceConfig.complete=function(a){k(g)&&g(a,b.file,b.inputElem);m()};e.parse(b.file,b.instanceConfig)}}function c(b,c,e,f){k(a.error)&&a.error({name:b},c,e,f)}function m(){f.splice(0,1);b()}var w=a.config||{},f=[];this.each(function(a){if("INPUT"!==C(this).prop("tagName").toUpperCase()||"file"!==C(this).attr("type").toLowerCase()||!g.FileReader||!this.files||0===this.files.length)return!0;for(a=0;a<this.files.length;a++)f.push({file:this.files[a],
inputElem:this,instanceConfig:C.extend({},w)})});b();return this}}M?g.onmessage=W:e.WORKERS_SUPPORTED&&(T=U(),document.body?document.addEventListener("DOMContentLoaded",function(){O=!0},!0):O=!0);y.prototype=Object.create(D.prototype);y.prototype.constructor=y;z.prototype=Object.create(D.prototype);z.prototype.constructor=z;w.prototype=Object.create(w.prototype);w.prototype.constructor=w})("undefined"!==typeof window?window:this);

byui.fn('csv', function(obj){
	switch (this.type()){
		case 'string': {
			var p = Papa.parse(this.context);
			this.context = p.data;
			this.errors = p.errors;
		}
	}
	return this;
})
/**
 * byui(csv).graph({
 * 		graph: {
 * 			margin: {
	 * 			top: #,
	 * 			left: #,
	 * 			bottom: #,
	 * 			right: #
	 * 		},
	 * 		width: #,
	 * 		height: #
 * 		},
 * 		x: {
 * 			format: ''
 * 		},
 * 		y: {
 * 			format: ''
 * 		}
 * })
 */
byui.fn('graph', function(p){
	var params = p;
	if (!window.d3) throw 'Please import d3';

});
byui.fn('sum', function(){
	switch (this.type()){
		case 'array': {
			var sum = 0;
			for (var i = 0; i < this.context.length; i++){
				if (byui.fn._internal.getType(this.context[i]) == 'number'){
					sum += this.context[i];
				}
			}
			return sum;
		}
		default: {
			return undefined;
		}
	}
});

byui.fn('avg', function(){
	switch (this.type()){
		case 'array': {
			var sum = this.sum();
			var len = this.len();
			return sum / len;
		}
		default: {
			return undefined;
		}
	}
});

byui.fn('percent', function(obj){
	if (!obj.percision) obj.percision = 1;
	if (obj.occurance == undefined || obj.occurance == null) obj.occurance = true;
	obj.percision = Math.pow(10, obj.percision);
	var hasValue = byui.fn._internal.getType(JSON.stringify(obj.val)) == 'string';
	switch (this.type()){
		case 'number': {
			var val = Math.floor(this.context * obj.percision) / obj.percision;
			return val + '%';
		}
		case 'array': {
			if (hasValue && obj.occurance){
				var total = this.len();
				var filtered = this.filter({val: obj.val, returnValue: true, type: 'in'});
				var filteredTotal = filtered.len();
				var norm = (filteredTotal / total) * 100;
				var result = Math.floor(norm * obj.percision) / obj.percision;
				return result + '%';
			}
			else if (hasValue && !obj.occurance){
				var sum = this.sum();
				var filtered = this.filter({val: obj.val, returnValue: true, type: 'in'});
				var filteredSum = filtered.sum();
				var norm = (filteredSum / sum) * 100;
				var result = Math.floor(norm * obj.percision) / obj.percision;
				return result + '%';
			}
		}
		default: {
			return undefined;
		}
	}
});
byui.fn('keys', function(){
	return Object.keys(this.context);
})

byui.fn('obj', function(base){
	switch (this.type()){
		case 'object':  return this.context;
		case 'xml': {
			return byui.createObject(this.context);
		}
		default: {
			var o = {};
			o[base] = this.context;
			return o;
		}
	}
})

byui.extend('createObject', function(node){
	var name = node.nodeName.toLowerCase();
	var result = {_name: name};
	result[name] = {
		children: []
	};
	var attrs = node.attributes;
	if (attrs && attrs.length > 0){
		for (var i = 0; i < attrs.length; i++){
			var attrName = attrs[i].name;
			var attrVal = attrs[i].value;
			result[name][attrName] = attrVal;
		}
	} 
	var children = node.children;
	if (children){
		for (var i = 0; i < children.length; i++){
			result[name].children.push(byui.createObject(children[i]));
		}
	}
	return result;
});

byui.extend('default', function(base, param){
	
});
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
byui.fn('asName', function(){
	switch (this.type()){
		case 'string': {
			var lower = this.context.toLowerCase();
			var words = lower.split(byui.fn._internal.regex.SPACE);
			for (var i = 0; i < words.length; i++){
				words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
			}
			return words.join(' ');
		}
		default: return undefined;
	}
});

byui.fn('asEmail', function(ext){
	switch (this.type()){
		case 'string': {
			var raw = this.raw();
			if (raw.indexOf('@') > -1) return raw;
			return raw + '@' + ext;
		}	
		default: return undefined;
	}
});

byui.fn('asUrl', function(){
	if (this.errors.length > 0) return '';
	return this.context;
});

byui.fn('replace', function(what, withVal){
	if (withVal == undefined || withVal == null) withVal = '';
	switch (this.type()){
		case 'string': {
			var regex = new RegExp(what, 'g');
			this.context = this.context.replace(regex, withVal);
		}
	}
	return this;
});

byui.fn('split', function(val){
	if (byui.fn._internal.getType(val) != 'string') return;
	switch (this.type()){
		case 'string': {
			this.context = this.context.split(val);
		}
	}
	return this;
});

byui.fn('hex', function(decode){
	if (decode){
		var j;
    var hexes = this.context.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    this.context = back;
	}
	else{
		var hex, i;

    var result = "";
    for (i=0; i<this.context.length; i++) {
        hex = this.context.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    this.context = result
	}
	return this;
})

byui.extend('strTemplate', function(name, val){
	byui.strTemplate[name] = val;
});

byui.fn('strTemplate', function(name){
	if (this.baseType == 'object'){
		var template = byui(byui.strTemplate[name]);
		var keys = this.keys();
		for (var i = 0; i < keys.length; i++){
			template.replace('\\$\\{' + keys[i] + '\}', this.context[keys[i]]);
		}
		return template;
	}
	return byui('');
});

byui.fn('str', function(){
	switch (this.type()){
		case 'string': return this.context;
		case 'number': return this.context + '';
		case 'date': return this.context.toString();
		case 'object': return JSON.stringify(this.context);
		case 'xml': return (new XMLSerializer()).serializeToString(this.context);
		default: return this.context + '';
	}
});
byui.extend('thread', function(){
	return (function(){function g(c){this.s=Math.max(2,c|0);this.j=[];this.a=this.g=0;this.b={start:0,end:0,time:0}}var h=window.URL||window.webkitURL;if(!h)throw Error("This browser does not support Blob URLs");if(!window.Worker)throw Error("This browser does not support Web Workers");g.prototype.o={JSON:function(){var c=func;self.addEventListener("message",function(d){d=d.data;for(var b=new DataView(d),a=d.byteLength,e=Array(a),f=0;f<a;f++)e[f]=String.fromCharCode(b.getUint8(f));b=JSON.parse(e.join(""));b=
c.apply(c,b);try{d=JSON.stringify(b)}catch(g){throw Error("Parallel function must return JSON serializable response");}a="undefined"===typeof d?0:d.length;e=new ArrayBuffer(a);b=new DataView(e);for(f=0;f<a;f++)b.setUint8(f,d.charCodeAt(f)&255);self.postMessage(e,[e]);self.close()})},i:function(){var c=func;self.addEventListener("message",function(d){var b=d.data;d=new DataView(b);for(var b=b.byteLength/4,a=Array(b),e=0;e<b;e++)a[e]=d.getInt32(4*e);a=c.apply(c,a);a instanceof Array||(a=[a]);var b=
a.length,f=new ArrayBuffer(4*b);d=new DataView(f);for(e=0;e<b;e++)d.setInt32(4*e,a[e]);self.postMessage(f,[f]);self.close()})},h:function(){var c=func;self.addEventListener("message",function(d){var b=d.data;d=new DataView(b);for(var b=b.byteLength/8,a=Array(b),e=0;e<b;e++)a[e]=d.getFloat64(8*e);a=c.apply(c,a);a instanceof Array||(a=[a]);var b=a.length,f=new ArrayBuffer(8*b);d=new DataView(f);for(e=0;e<b;e++)d.setFloat64(8*e,a[e]);self.postMessage(f,[f]);self.close()})}};g.prototype.m={JSON:function(c){try{var d=
JSON.stringify(c)}catch(e){throw Error("Arguments provided to parallel function must be JSON serializable");}len=d.length;c=new ArrayBuffer(len);for(var b=new DataView(c),a=0;a<len;a++)b.setUint8(a,d.charCodeAt(a)&255);return c},i:function(c){len=c.length;for(var d=new ArrayBuffer(4*len),b=new DataView(d),a=0;a<len;a++)b.setInt32(4*a,c[a]);return d},h:function(c){len=c.length;for(var d=new ArrayBuffer(8*len),b=new DataView(d),a=0;a<len;a++)b.setFloat64(8*a,c[a]);return d}};g.prototype.l={JSON:function(c){var d=
new DataView(c);c=c.byteLength;for(var b=Array(c),a=0;a<c;a++)b[a]=String.fromCharCode(d.getUint8(a));if(b.length)return JSON.parse(b.join(""))},i:function(c){var d=new DataView(c);c=c.byteLength/4;for(var b=Array(c),a=0;a<c;a++)b[a]=d.getInt32(4*a);return b},h:function(c){var d=new DataView(c);c=c.byteLength/8;for(var b=Array(c),a=0;a<c;a++)b[a]=d.getFloat64(8*a);return b}};g.prototype.c=function(c,d,b,a){this.a||(this.b.start=(new Date).valueOf());if(this.a<this.s){this.a++;c=new Worker(c);d=this.m[b](d);
var e=this.l[b],f=this;c.addEventListener("message","JSON"===b?function(b){a.call(f,e(b.data));f.ready()}:function(b){a.apply(f,e(b.data));f.ready()});c.postMessage(d,[d])}else this.g++,this.j.push([c,d,b,a])};g.prototype.ready=function(){this.a--;this.g?(this.c.apply(this,this.j.shift()),this.g--):this.a||(this.b.end=(new Date).valueOf(),this.b.time=this.b.end-this.b.start)};g.prototype.f=function(c,d){var b=c.name,a=c.toString();if(!b)for(b="$"+(10*Math.random()|0);-1!==a.indexOf(b);)b+=10*Math.random()|
0;b=this.o[d].toString().replace(/^.*?[\n\r]+/gi,"").replace(/\}[\s]*$/,"").replace(/\/\*\*\/name\/\*\*\//gi,b).replace(/\/\*\*\/func\/\*\*\//gi,a);return h.createObjectURL(new Blob([b],{type:"text/javascript"}))};g.prototype.process=function(c,d){var b=this.f(c,"JSON"),a=this;return function(){a.c(b,[].slice.call(arguments),"JSON",d)}};g.prototype.processInt32=function(c,d){var b=this.f(c,"Int32"),a=this;return function(){a.c(b,[].slice.call(arguments),"Int32",d)}};g.prototype.processFloat64=function(c,
d){var b=this.f(c,"Float64"),a=this;return function(){a.c(b,[].slice.call(arguments),"Float64",d)}};return g})();
});

/**
 * obj = {
 * 		threads: 2,
 * 		calls: [[func, callback], [func, callback]]
 * }
 */
byui.extend('threadPool', function(obj){
	if (!obj) throw new Error('Invalid thread config');
	if (!obj.calls) throw new Error('Invalid calls');
	var params = obj;
	var num = params.threads ? params.threads : 2;
	var MT = new (byui.thread())(num);
	for (var i = 0; i < params.calls.length; i++){
		if (params.calls[i].length != 2) throw new Error('Invalid thread call setup');
		MT.process(params.calls[i][0], params.calls[i][1])();
	}
});
byui.fn('url', function(action, param){
	if (this.type() == 'global'){
		switch (action){
			case 'reload': {
				this.context.location.reload();
				break;
			}
			case 'redirect': {
				this.context.location.href = param;
				break;
			}
			case 'host': {
				try {
					var u = new URL(this.url());
					return u.hostname;
				}
				catch (e){
					return '';
				}
			}
			case 'base': {
				try {
					var u = new URL(this.url());
					return u.protocol + '//' + u.hostname;
				}
				catch (e){
					return '';
				}
			}
			default: return this.context.location.href;
		}
	}
})

byui.extend('params', (function(){
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
    if (hashes[0] == loc) return {};
    return map;
})());
byui.fn('save', function(name){
	byui.globals[name] = this.context;
});

byui.extend('get', function(name){
	var raw = byui.globals[name];
	if (byui.fn._internal.getType(raw) == 'xml') return $(raw);
	return byui(raw);
});

byui.extend('type', function(obj){
	return byui.fn._internal.getType(obj);
});
byui.extend('createNode', function(name, obj){
	var keys = Object.keys(obj);
	var xml = $('<' + name + '></' + name + '>');
	for (var i = 0; i < keys.length; i++){
		switch (byui.fn._internal.getType(obj[keys[i]])){
			case 'string': case 'number': case 'boolean': {
				if (keys[i] == '$text'){
					$(xml).append(obj[keys[i]]);
				}
				else{
					if (keys[i].charAt(0) != '_'){
						$(xml).attr(keys[i], obj[keys[i]]);
					}
				}
				break;
			}
			case 'undefined': case 'null':{
				$(xml).attr(keys[i], '');
				break;
			}
			case 'object': {
				var child = byui.createNode(keys[i], obj[keys[i]]);
				$(xml).append(child);
				break;
			}
			case 'array': {
				var ary = obj[keys[i]];
				for (var j = 0; j < ary.length; j++){
					var child = byui.createNode(keys[i], ary[j]);
					$(xml).append(child);
				}
				break;
			}
		}
	}
	return $(xml)[0];
});

byui.fn('find', function(path){
	this.context = $(this.context).find(path)[0];
	return this;
})

byui.fn('xml', function(name){
	switch (this.type()){
		case 'object': {
			var xml = byui.createNode(name, this.context);
			this.context = xml;
			break;
		}
	}
	return this;
})

byui.extend('registerXmlTemplate', function(obj){
	if (byui.fn._internal.getType(obj.obj) != 'object') throw 'Expected object';
	var keys = Object.keys(obj.obj);
	if (keys.length > 1) throw 'Only 1 key is allowed';
	if (keys.length == 0) throw 'Expected object';
	var name = keys[0];
	byui.template[obj.name] = {
		config: obj.obj,
		xml: byui.createNode(name, obj.obj[name]),
		functions: obj.functions,
		paths: obj.paths
	};
});

byui.extend('getTemplate', function(name){
	return byui.template[name];
})

byui.fn('encodeXml', function(){
	if (this.type() == 'string'){
		this.context = this.replace("\&", '&amp;').replace("\<", '&lt;').replace("\>", '&gt;').val();
	}
	return this;
})

function test(){
	var example = {
		test: {
			test: 'test'
		}
	}
	byui.registerXmlTemplate({
		name: 'example',
		obj: example,
		functions: {
			addPerson: function(first, last, email){
				email = byui(email).val();
				first = byui(first).asName();
				last = byui(last).asName();
				var xml = byui.createNode('person', {
					first: first,
					last: last,
					email: email
				});
				var t = byui.template.example;
				$(byui.template.example.xml).find(t.paths.topPeople).append(xml);
			},
			getPerson: function(email){
				var t = byui.template.example;
				email = byui(email).val();
				return $(byui.template.example.xml).find(t.paths.topPeople + '[email=' + email + ']')[0];
			}
		},
		paths: {
			topPeople: 'semester[code=FA15] > people > person'
		}
	})
}