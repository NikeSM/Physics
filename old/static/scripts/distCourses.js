$(document).ready(function () {
	var imgs = $('img');
	for(var i = 0; i < imgs.length; i++) {
		var img = $(imgs[i]);
		var src = img.attr('src');
		img.attr('src', './static/image/' + src) 
	}
});