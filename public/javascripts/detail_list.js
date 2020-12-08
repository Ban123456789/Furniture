$(document).ready(function() {
	//以ul li包子選單
	$('.cart>li>a').click(function(event) {
		event.preventDefault();
		$(this).toggleClass('active');
		$(this).siblings('ul').slideToggle(2000);
		});
	//html以div h3 h5包子選單
	$('.list h3').click(function(event) {
		$(this).toggleClass('active');
		$(this).siblings('h5').slideToggle(2000);
	});
});
