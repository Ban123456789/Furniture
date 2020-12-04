const { json } = require('body-parser');
var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin');;

// todo 確認購物車內容
router.get('/', function(req, res, next) {
    // res.render('layout/cart-layout');
  });

// todo 確認購物車內容
router.get('/checkcart', function(req, res, next) {
  
    res.render('cart/Check-cart');
});

// todo 填寫個人資料
router.get('/personal', function(req, res, next) {
    res.render('cart/Personal');
});

// todo 結帳去
router.get('/pay', function(req, res, next) {
    res.render('cart/Pay');
});

// todo 完成訂單
router.get('/finish', function(req, res, next) {
    res.render('cart/Finish');
});

module.exports = router;
