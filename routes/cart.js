const { json } = require('body-parser');
var express = require('express');
const { route } = require('.');
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
  let payUid = '';
  let payArr = [];
  let discount = '1';
  let total = 0;
  let final = 0;
  let payable = {};
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
            if(data.val().uid === items.val().uid && data.val().ontheshelf === 'true'){
              cartObj = data.val();
              cartObj.quantity = items.val().quantity;
              // console.log(cartObj);
              cartArr.push(cartObj);
            }else if(data.val().uid === items.val().uid && data.val().ontheshelf === 'false'){
              firebaseDb.ref(`auth/${authUid}/cart`).child(items.val().cartUid).remove();
            };
          });
        });
      });
      return firebaseDb.ref(`auth/${authUid}/payable`).once('value');
    }).then( pay => {
      let payPath = firebaseDb.ref(`auth/${authUid}/payable`).push();
      let key = payPath.key;
        cartArr.forEach( items => {
          total += items.price * items.quantity;
          items.price = items.price.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        });
        // console.log(discount);
        total = total.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        final = total.toString().replace(/[ ]/g, "").replace(/,/gi, '')*1*discount+100;
        final = final.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        // console.log(final);
        payable = {
          total: total,
          discount: discount,
          shipping: 100,
          final: final,
        };
        pay.forEach( data => {
          payArr.push(data.val().uid);
          payUid = data.val().uid;
        });
      let set = new Set(payArr);
        if(set.has(payUid)){
          firebaseDb.ref(`auth/${authUid}/payable`).child(payUid).update(payable);
        }else{
          payable.uid = key;
          payPath.set(payable);
        };

        res.render('cart/Check-cart', {
          cartArr,
          total,
          final
        });
    });
});
// 刪除購物車內容
router.post('/checkcart/delcart', function(req, res){
  const id = req.body.uid;
    firebaseDb.ref('auth').once('value').then( auth => {
      auth.forEach( data => {
        if(data.val().user === req.session.email){
          firebaseDb.ref(`auth/${data.val().uid}/cart`).once('value').then( cart => {
            cart.forEach( items => {
              if(items.val().uid === id){
                firebaseDb.ref(`auth/${data.val().uid}/cart`).child(items.val().cartUid).remove();
                res.send({
                  status: '刪除成功'
                });
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
        firebaseDb.ref('auth').once('value').then( auth => {
          auth.forEach( data => {
            if(req.session.email === data.val().user){
              firebaseDb.ref(`auth/${data.val().uid}`).update({
                discount: '100%'
              });
            };
          });
        });
      }else{
        message = {
          status: '連結成功',
          coupon: '沒有此序號'
        };
        firebaseDb.ref('auth').once('value').then( auth => {
          auth.forEach( data => {
            if(req.session.email === data.val().user){
              firebaseDb.ref(`auth/${data.val().uid}`).update({
                discount: '100%'
              });
            };
          });
        });
      }; 
      // console.log(couponObj);
      res.send(message);
    });
});

// todo 填寫個人資料
router.get('/personal', function(req, res, next) {
  let personalObj = {};
  let user = '';
    firebaseDb.ref('auth').once('value').then( auth => {
      auth.forEach( data => {
        if(data.val().user === req.session.email){
          user = data.val().uid;
        };
      });
      return firebaseDb.ref(`auth/${user}/personal`).once('value');
    }).then( personal => {
      personal.forEach( data => {
        personalObj = data.val();
      });
      // console.log(personalObj);
      res.render('cart/Personal', {
        personalObj,
      });
    });
});
// 送出個人資訊
router.post('/personal/send', function(req, res){
  let personal = {
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    payfor: req.body.payfor,
    remarks: req.body.remarks
  };
  let user = '';
  let arr = [];
  let check = '';
    firebaseDb.ref('auth').once('value').then( auth => {
      auth.forEach( data => {
        if(data.val().user === req.session.email){
          user = data.val().uid;
        };
      });
      return firebaseDb.ref(`auth/${user}/personal`).once('value');
    }).then( personalData => {
      let personalPath = firebaseDb.ref(`auth/${user}/personal`).push();
      let key = personalPath.key;
        personalData.forEach( data => {
          arr.push(data.val().uid);
          check = data.val().uid;
        });
        // console.log(arr);
      let set = new Set(arr);
        if(set.has(check)){
          firebaseDb.ref(`auth/${user}/personal`).child(check).update(personal);
        }else{
          personal.uid = key
          personalPath.set(personal);
        };
        res.redirect('/cart/pay');
    });
}); // 回上一步個資只能更改，不能再新增(每隻帳號只有一組個資，訂單備註可以空)

// todo 結帳去
router.get('/pay', function(req, res, next) {
  let user = '';
  let productsArr = [];
  let cartArr = [];
  let cartObj = {};
  let payableObj = {};
  let personalObj = {};
    firebaseDb.ref('auth').once('value').then( auth => {
      auth.forEach( data => {
        if(data.val().user === req.session.email){
          user = data.val().uid;
        };
      });
      return firebaseDb.ref('products').once('value');
    }).then( products => {
      products.forEach( data => {
        productsArr.push(data.val());
      });
      return firebaseDb.ref(`auth/${user}/cart`).once('value');
    }).then( cart => {
      cart.forEach( data => {
        productsArr.forEach( items => {
          if(items.uid === data.val().uid){
            cartObj = items;
            cartObj.quantity = data.val().quantity;
            cartArr.push(cartObj);
          }
        });
      });
      return firebaseDb.ref(`auth/${user}/payable`).once('value');
    }).then( payable => {
      payable.forEach( data => {
        if(data.val().discount === 1){
          payableObj = data.val();
          payableObj.discount = '未使用優惠券'
        }else{
          payableObj = data.val();
          payableObj.discount = payableObj.discount*100;
        };
      });
      return firebaseDb.ref(`auth/${user}/personal`).once('value');
    }).then( personal => {
      personal.forEach( data => {
        personalObj = data.val();
      });
      cartArr.forEach( data => {
        data.price = data.price.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      });
      // console.log(cartArr);
      res.render('cart/Pay', {
        cartArr,
        payableObj,
        personalObj
      });
    });
});

// todo 完成訂單
router.get('/finish', function(req, res, next) {
    res.render('cart/Finish');
});

module.exports = router;
