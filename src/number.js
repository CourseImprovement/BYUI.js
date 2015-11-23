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

byui.fn('toNum', function(){
	switch (this.type()){
		case 'string': {
			this.context = new Number(this.context).valueOf();
			if (isNaN(this.context)){
				this.context = '';
			}
			return this;
		}
		default: {
			this.context = '';
			return this;
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