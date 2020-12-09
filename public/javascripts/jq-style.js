$(document).ready(function () {
    // gotop
    $(function(){ $('.go-top').click(function(){ 
        $('html,body').animate({scrollTop:$('body').offset().top}, 1000);});  
    }); 

    // about page banner content
    $('.about-banner-first').fadeIn(1000);
    $('.about-banner-second').fadeIn(2000);

    // 刪除購物車清單
    // $('.delCart').click(function (e) { 
        // e.preventDefault();
        // let uid = $('.delCart').data('uid');
            // console.log($('.delCart').data('uid'));
            // $.ajax({
            //     url: `/cart/checkcart/del/${uid}`,
            //     type: 'POST',
            //     success: function(res){
            //         console.log(res);
            //     },  
            // });
        
    // });

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
                console.log(res.coupon);
                if(res.coupon === '此序號已過期'){
                    $('#couponResult').html(`<small class="text-danger">${res.coupon}</small>`);
                }else if(res.coupon === '沒有此序號'){
                    $('#couponResult').html(`<small class="text-danger">${res.coupon}</small>`);
                }else{
                    $('#couponResult').html(`<small class="text-success">此優惠券折扣 ${res.coupon.discount}</small>`);
                };
            },
        });
    });
});