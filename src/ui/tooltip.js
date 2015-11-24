byui.fn('tooltip', function(ele){
	ele = $(ele);
	ele.mouseover(function(){
		var msg = ele.attr('title');
		if (!msg || msg.length == 0) return;
		var swidth = $(window).width();
		var offset = ele.offset();
		$('#byui-tooltip').remove();
		var tooltip = $('body').append('<div id="byui-tooltip"></div>').find('#byui-tooltip');
		tooltip.html(msg);
		tooltip.css({left: (offset.left - tooltip.width() - 65) + 'px', top: (offset.top - tooltip.height() - 15) + 'px'});
	});
	ele.mouseout(function(){
		$('#byui-tooltip').remove();
	})
});