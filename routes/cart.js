var express = require('express');
var router = express.Router();

// todo 確認購物車內容
router.get('/', function(req, res, next) {
    // res.render('layout/cart-layout');
  });

// todo 確認購物車內容
router.get('/checkcart', function(req, res, next) {
  res.render('cart/Check-cart');
});

module.exports = router;
