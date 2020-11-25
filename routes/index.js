var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin');

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
  let categoriesArr = []; 
  let productsArr = [];
  let category = req.query.category || '全部商品';
      // console.log(category);   
      firebaseDb.ref('categories').once('value').then( data => {
          data.forEach( categories => {
              categoriesArr.push(categories.val());
          });
          // console.log(categoriesArr);
          return firebaseDb.ref('products').once('value');
      }).then( data => {
          data.forEach( products => {
              if(category === products.val().category){
                  productsArr.push(products.val());
              }else if(category === '全部商品'){
                  productsArr.push(products.val());
              }
          });
          // console.log(productsArr);
          res.render('client/products', {
              categoriesArr,
              productsArr,
              category
          });
      });
});

// todo 產品細節
router.get('/detail', function(req, res, next) {
  res.render('client/Product-detail', { title: 'Expressssss' });
});

// todo 關於我們
router.get('/about', function(req, res, next) {
  res.render('client/about', { title: 'Expressssss' });
});

// todo 我的收藏
router.get('/favorites', function(req, res, next) {
  res.render('client/favorites', { title: 'Expressssss' });
});


module.exports = router;
