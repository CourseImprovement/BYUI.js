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