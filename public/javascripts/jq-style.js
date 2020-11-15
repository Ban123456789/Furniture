$(document).ready(function () {
    // gotop
    $(function(){ $('.go-top').click(function(){ 
        $('html,body').animate({scrollTop:$('body').offset().top}, 1000);});  
    }); 

    // about page banner content
    $('.about-banner-first').fadeIn(1000);
    $('.about-banner-second').fadeIn(2000);
});