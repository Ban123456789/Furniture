$(document).ready(function () {
    // gotop
    $(function(){ $('.go-top').click(function(){ 
        $('html,body').animate({scrollTop:$('body').offset().top}, 1000);});  
    }); 

    // about page banner content
    $('.about-banner-first').fadeIn(1000);
    $('.about-banner-second').fadeIn(2000);

    // check-cart coupon驗證
    $('#checkCoupon').click( function(e){
        e.preventDefault();
        $.ajax({
            url: '/cart/checkcart/checkcoupon',
            type: 'POST',
            data: {
                coupon: $("input[name='coupon']").val(),
            },
            dataType: 'JSON', // 預期從後端回傳的資料格式
            success: function(res){
                console.log(res);
            },
        });
    });
});