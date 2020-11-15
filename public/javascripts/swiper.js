var mySwiper = new Swiper('#swiperOne', {
    effect : 'fade',
    autoplay:true,//等同于以下设置
    autoplay: {
      delay: 3000,
      stopOnLastSlide: false,
      disableOnInteraction: true,
    },
    loop: true,
});

var swiperTwo = new Swiper('#swiperTwo',{
    // effect : 'fade',
    // autoplay: false,//等同于以下设置
    autoplay: {
      delay: 3000,
      stopOnLastSlide: false,
      disableOnInteraction: true,
    },
    loop: true,
    breakpoints: {
      415: {  //当屏幕宽度大于等于320
        slidesPerView: 2,
        spaceBetween: 10
      },
      768: {  //当屏幕宽度大于等于768 
        slidesPerView: 3,
        spaceBetween: 20
      },
      1200: {  //当屏幕宽度大于等于1280
        slidesPerView: 4,
        spaceBetween: 30
      }
    },
// 分頁器
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
    },
});