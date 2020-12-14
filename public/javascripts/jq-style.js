$(document).ready(function () {
    // gotop
    $(function(){ $('.go-top').click(function(){ 
        $('html,body').animate({scrollTop:$('body').offset().top}, 1000);});  
    }); 

    // about page banner content
    $('.about-banner-first').fadeIn(1000);
    $('.about-banner-second').fadeIn(2000);
    
    // todo products
    // 加入珍藏
    $('.favBtn').click(function (e) { 
        e.preventDefault();
        $.ajax({
            url: '/products/fav',
            type: 'POST',
            data: {
                uid: $(this).data('uid')
            },
            // dataType: 'JSON', // 預期從後端回傳的資料格式
            success: function(res){
                console.log(res);
                if(res.status === '尚未登入'){
                    window.location.replace('/auth');
                }else if(res.status === '已登入' && res.repeat === false){
                    swal({
                        icon: "success",
                        text: "成功加入最愛",
                        button: false,
                        timer: 2000
                    });
                }else{
                    swal({
                        icon: "warning",
                        text: "此商品已加入最愛",
                        button: false,
                        timer: 2000
                    });
                };
            },
        });
    });
    // 刪除珍藏
    $('.Xfav').click(function(e){
        e.preventDefault();
        $.ajax({
            url: '/products/delfav',
            type: 'POST',
            data: {
                uid: $(this).data('uid')
            },
            success: function(res){
                if(res.checkDel){
                    setTimeout(function(){
                        location.reload();
                        swal({
                            icon: "warning",
                            text: "已刪除最愛",
                            button: false,
                            timer: 2000
                        });
                    },1000)
                };
            },
        }); 
    });
    // 加入購物車
    $('.addCart').click(function (e) { 
        e.preventDefault();
        $.ajax({
            url: '/products/addcart',
            type: 'POST',
            data: {
                uid: $(this).data('uid')
            },
            success: function(res){
                if(res.status === '已連線' && res.addCart === true){
                    swal({
                        icon: "success",
                        text: "成功加入購物車",
                        button: false,
                        timer: 2000
                    });
                }else{
                    window.location.replace('/auth');
                }
            },
        });
    });
    // 商品細節中的加到購物車
    $('#detailAddCart').click(function (e) { 
        e.preventDefault();
        const uid = $(this).data('uid');
        const quantity = $(`#detail${uid}`).val();
        $.ajax({
            url: '/detail/addcart',
            type: 'POST',
            data: {
                uid: uid,
                quantity: quantity
            },
            success: function(res){
              if(res.status === 'success'){
                swal({
                    icon: "success",
                    text: "成功加入購物車",
                    button: false,
                    timer: 2000
                });
              }else{
                window.location.replace('/auth');
              };  
            },
        });
    });
    
    
    // todo check-cart
    // 刪除購物車清單
    $('.delCart').click(function (e) { 
        e.preventDefault();
        $.ajax({
            url: '/cart/checkcart/delcart',
            type: 'POST',
            data: {
                uid: $(this).data('uid'),
            },
            success: function(res){
                if(res.status === '刪除成功'){
                    setTimeout(function(){
                        location.reload();
                    },1000);
                };
            },
        });
    });

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
        setTimeout(function(){
            location.reload();
        },1000) //這裡做1秒延遲重整是因為我資料送到資料庫的時間太慢，導致我頁面重整完，我資料還沒進到資料庫
    });

    // todo dashboard
    // oder
    $('.orderEdit').click(function (e) { 
        e.preventDefault();
        const uid = $(this).data('uid');
        const name = $(`#editForm${uid} input[name='name']`).val();
        const phone = $(`#editForm${uid} input[name='phone']`).val();
        const email = $(`#editForm${uid} input[name='email']`).val();
        const address = $(`#editForm${uid} input[name='address']`).val();
        $.ajax({
            url: '/dashboard/orders/editpersonal',
            type: 'POST',
            data: {
                uid: uid,
                name: name,
                email: email,
                phone: phone,
                address: address
            },
            success: function (res) {
                
            },
        });
        setTimeout(function(){
            location.reload();
        },1000)
    });
});