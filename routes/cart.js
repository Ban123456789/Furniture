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
  let cartArr = [];
  let authUid = '';
  let cartObj = {};
  let discount = '';
  let total = 0;
  let final = 0;
    firebaseDb.ref('auth').once('value').then( auth => {
      auth.forEach( data => {
        if(data.val().user === req.session.email){
          // console.log(data.val().user);
          authUid = data.val().uid;
          if(data.val().discount){
            discount = data.val().discount.replace(/%/g, "")/100;
          }
        };
      });
      return firebaseDb.ref(`auth/${authUid}/cart`).once('value');
    }).then( cart => {
      firebaseDb.ref('products').once('value').then( products => {
        products.forEach( data => {
          cart.forEach( items => {
            if(data.val().uid === items.val().uid){
              cartObj = data.val();
              cartObj.quantity = items.val().quantity;
              console.log(cartObj);
              cartArr.push(cartObj);
            };
          });
        });
        cartArr.forEach( items => {
          total += items.price * items.quantity;
          items.price = items.price.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        });
        console.log(discount);
        total = total.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        final = total.toString().replace(/[ ]/g, "").replace(/,/gi, '')*1*discount+100;
        final = final.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        console.log(final);
        res.render('cart/Check-cart', {
          cartArr,
          total,
          final
        });
      });
    });
});
// 刪除購物車內容
router.post('/checkcart/del/:id', function(req, res){
  const id = req.params.id;
    firebaseDb.ref('auth').once('value').then( auth => {
      auth.forEach( data => {
        if(data.val().user === req.session.email){
          firebaseDb.ref(`auth/${data.val().uid}/cart`).once('value').then( cart => {
            cart.forEach( items => {
              if(items.val().uid === id){
                firebaseDb.ref(`auth/${data.val().uid}/cart`).child(items.val().cartUid).remove();
                res.redirect('/cart/checkcart');
              };
            });
          });
        };
      });
    });
});
// 驗證優惠券
router.post('/checkcart/checkcoupon', function(req, res){ 
  let couponObj = {};
  let message = {};
  const now = Math.floor(Date.now() / 1000);
    firebaseDb.ref('coupon').once('value').then( coupon => {
      coupon.forEach( data => {
        if(req.body.coupon === data.val().coupon){
          couponObj = data.val();
        };
      });
      if(couponObj && couponObj.expirydate >= now){
        message = {
          status: '連結成功',
          coupon: couponObj,
          effectiveDate: true
        };
        firebaseDb.ref('auth').once('value').then( auth => {
          auth.forEach( data => {
            if(req.session.email === data.val().user){
              firebaseDb.ref(`auth/${data.val().uid}`).update({
                discount: couponObj.discount
              });
            };
          });
        });
      }else if(couponObj.expirydate < now){
        message = {
          status: '連結成功',
          coupon: '此序號已過期'
        };
      }else{
        message = {
          status: '連結成功',
          coupon: '沒有此序號'
        };
      }; 
      console.log(couponObj);
      res.send(message);
    });
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
