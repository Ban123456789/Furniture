var express = require('express');
const { route } = require('.');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('dashboard/db-addproducts');
});

// todo 商品管理
router.get('/addproducts', function(req, res, next) {
    res.render('dashboard/db-addproducts');
    
});
router.post('/category/creat', function (res, req) {
    console.log(req.body);
});

// todo 訂單查詢
router.get('/orders', function(req, res, next) {
    res.render('dashboard/db-orders');
});

// todo 其他
router.get('/others', function(req, res, next) {
    res.render('dashboard/db-others');
});

module.exports = router;
