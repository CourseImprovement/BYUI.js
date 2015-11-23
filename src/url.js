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