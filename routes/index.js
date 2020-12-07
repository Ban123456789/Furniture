var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin');
var firebase = require('../connection/firebase_client');
var moment = require('moment');
const { route, use } = require('./dashboard');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expressssss' });
});

// todo 首頁
router.get('/main', function(req, res, next) {
  let newsArr = [];
    firebaseDb.ref('news').once('value').then( news => {
      news.forEach( data => {
        newsArr.push(data.val());
      });
      newsArr.reverse();
      res.render('client/main', {
        newsArr,
        moment
      });
    });
});

// todo 登入註冊
router.get('/auth', function(req, res, next){
  const message = req.flash('message');
    res.render('client/signin', {
      message
    });
});
// 註冊
router.post('/auth/register', function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  const checkPassword = req.body.checkPassword;
  const authPath = firebaseDb.ref('auth').push();
  const id = authPath.key;

    if(password === checkPassword){
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        req.flash('message', '註冊成功!');
        authPath.set({
          user: email,
          uid: id
        });
        console.log('註冊成功');
        res.redirect('/auth');
      })
      .catch((error) => {
        let errMessage = '';
        if(error.message === 'Password should be at least 6 characters'){
            errMessage = '密碼至少六個字元!!!'
        }else if(error.message === 'The email address is badly formatted.'){
            errMessage = '請輸入有效郵件!!!';
        }else if(error.message === 'The email address is already in use by another account.'){
            errMessage = '此郵件已註冊過摟!!!'
        };
        req.flash('message', errMessage);
        res.redirect('/auth');
      });
    }else{
      req.flash('message', '請輸入相同的密碼><');
      console.log('密碼與確認密碼不符');
      res.redirect('/auth');
    };
});
// 登入
router.post('/auth/signin', function(req, res){
  const email = req.body.email;
  const password = req.body.password;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      req.session.uid = user.user.uid;
      req.session.email = user.user.email;
      console.log('登入成功');
      res.redirect('/products');
    })
    .catch((error) => {
      let errorMessage = '';
        if(error.code === 'auth/wrong-password'){
            errorMessage = '密碼輸入錯誤!';
        }else if(error.code === 'auth/user-not-found'){
            errorMessage = '此帳號尚未註冊或是輸入錯誤!'
        };
        req.flash('message', errorMessage);
        console.log('登入失敗');
        res.redirect('/auth');
    });
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
              };
          });
          productsArr.forEach( data => {
            data.price = data.price.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            data.origin = data.origin.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
          });
          // console.log(productsArr);
          res.render('client/products', {
              categoriesArr,
              productsArr,
              category
          });
      });
});
// 加到購物車
router.post('/addcart/:id', function(req, res){
  const id = req.params.id;
  let cartArr = [];
  let userUid = '';
  let checkRepeat = 'false';
    if(req.session.uid){
      firebaseDb.ref('auth').once('value').then( auth => {
        auth.forEach( data => {
          if(data.val().user === req.session.email){
            userUid = data.val().uid;
          };
        });
        return firebaseDb.ref(`auth/${userUid}/cart`).once('value');
      }).then( cart => {
        let cartPath = firebaseDb.ref(`/auth/${userUid}/cart`).push();
        let uid = cartPath.key;
          cart.forEach( items => {
            cartArr.push(items.val().uid);
          });
        let set = new Set(cartArr);
        // console.log(set.has(id));
          if(set.has(id)){
            cart.forEach( items => {
              if(items.val().uid === id){
                firebaseDb.ref(`/auth/${userUid}/cart`).child(items.val().cartUid).update({
                  quantity: items.val().quantity*1+1
                });
              };
            });
          }else{
            cartPath.set({
              uid: id,
              cartUid: uid,
              quantity: '1'
            });
          };
      });

      res.redirect('/products');
    }else{
      res.redirect('/auth');
    };
});
// 加到最愛

// todo 產品細節
router.get('/detail/:id', function(req, res, next) {
  const id = req.params.id;
  let productDetail = {};
    firebaseDb.ref('/products').once('value').then( products => {
      products.forEach( data => {
        if(data.val().uid === id){
          productDetail = data.val();
        };
      });
      productDetail.price = productDetail.price.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      productDetail.origin = productDetail.origin.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      // console.log(productDetail);
      res.render('client/Product-detail', {
        productDetail
      });
    });
});
// 計算價格
router.post('/detail/:id/total', function(req, res){
  const id = req.params.id;
  const quantity = req.body.quantity;
  let total = '';
    firebaseDb.ref('/products').once('value').then( products => {
      products.forEach( data => {
        if(data.val().uid === id){
          total = data.val().price * quantity;
        };
      });
    });
    res.redirect(`/detail/${id}`);
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
