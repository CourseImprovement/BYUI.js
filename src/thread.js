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