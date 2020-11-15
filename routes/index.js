var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expressssss' });
});

// todo 首頁
router.get('/main', function(req, res, next) {
  res.render('client/main', { title: 'Expressssss' });
});

// todo 產品型錄
router.get('/products', function(req, res, next) {
  res.render('client/Products', { title: 'Expressssss' });
});

// todo 產品細節
router.get('/detail', function(req, res, next) {
  res.render('client/Product-detail', { title: 'Expressssss' });
});

// todo 關於我們
router.get('/about', function(req, res, next) {
  res.render('client/about', { title: 'Expressssss' });
});

module.exports = router;
