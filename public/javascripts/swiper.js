var mySwiper = new Swiper('.swiper-container', {
    effect : 'fade',
    autoplay:true,//等同于以下设置
    autoplay: {
      delay: 3000,
      stopOnLastSlide: false,
      disableOnInteraction: true,
    },
    loop: true,
  });