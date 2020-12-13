var express = require('express');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin');
var stringTag = require('striptags');
var moment = require('moment');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('dashboard/db-addproducts');
});

// todo 商品管理
router.get('/addproducts', function(req, res, next) {
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
            res.render('dashboard/db-addproducts', {
                categoriesArr,
                productsArr,
            });
        });
});
// 新增分類
router.post('/category/creat', function (req, res) {
    const category = firebaseDb.ref('/categories').push();
    const id = category.key;
        category.set({
            id: id,
            name: req.body.name,
            path: req.body.path
        }).then( () => {
            console.log('新增類別成功');
            res.redirect('/dashboard/addproducts');
        }).catch( () => {
            console.log('新增類別失敗');
            res.redirect('/dashboard/addproducts');
        } );
});
// 刪除分類
router.post('/category/del/:id', function(req, res){
    const id = req.params.id;
    let categoryData = [];
        firebaseDb.ref('/categories').child(id).remove();
        res.redirect('/dashboard/addproducts');
        firebaseDb.ref('/categories').once('value').then( category => {
            category.forEach( data => {
                categoryData.push(data.val().name);
            });
            // console.log(categoryData);
            return firebaseDb.ref('/products').once('value');
        }).then( products => {
            // 分類刪除，商品列表相同分類也會跟著刪除
            products.forEach( pdata => {
                if(categoryData.indexOf(pdata.val().category) === -1){
                    firebaseDb.ref('/products').child(pdata.val().uid).remove();
                }
            });
        });
});
// 編輯類別
router.post('/category/edit/:id', function(req, res){
    const id = req.params.id;
    const data = {
        name: req.body.name,
        path: req.body.path
    };
        firebaseDb.ref('categories').child(id).update(data).then( () => {
            console.log('編輯類別成功');
            res.redirect('/dashboard/addproducts');
        }).catch( () => {
            console.log('編輯類別失敗');
            res.redirect('/dashboard/addproducts');
        })

});
// 新增商品
router.post('/product/creat', function(req, res){
    const products = firebaseDb.ref('/products').push();
    const key = products.key;
    let ontheshelf = '';
        if(req.body.ontheshelf === 'true'){
            ontheshelf = 'true';
        }else{
            ontheshelf = 'false';
        };
        console.log(req.body.ontheshelf);
        products.set({
            img: req.body.img,
            datail: req.body.detail,
            product: req.body.product,
            id: req.body.id,
            category: req.body.category,
            origin: req.body.origin,
            price: req.body.price,
            stock: req.body.stock,
            unit: req.body.unit,
            ontheshelf: ontheshelf,
            uid: key
        }).then( () => {
            console.log('新增商品成功');
            res.redirect('/dashboard/addproducts');
        }).catch( () => {
            console.log('新增商品失敗');
            res.redirect('/dashboard/addproducts');
        } );
});
// 編輯商品
router.post('/product/edit/:id', function(req, res){
    const id = req.params.id;
    let ontheshelf = '';
        if(req.body.ontheshelf === 'true'){
            ontheshelf = 'true';
        }else{
            ontheshelf = 'false';
        };
    const data = {
        img: req.body.img,
        datail: req.body.detail,
        product: req.body.product,
        id: req.body.id,
        category: req.body.category,
        origin: req.body.origin,
        price: req.body.price,
        stock: req.body.stock,
        unit: req.body.unit,
        ontheshelf: ontheshelf
    };
        firebaseDb.ref('products').child(id).update(data).then( () => {
            console.log('編輯文章成功');
            res.redirect('/dashboard/addproducts');
        }).catch( () => {
            console.log('編輯文章失敗');
            res.redirect('/dashboard/addproducts');
        })
});
// 刪除商品
router.post('/product/del/:id', function(req, res){
    const id = req.params.id;
        firebaseDb.ref('/products').child(id).remove();
        res.redirect('/dashboard/addproducts');
});

// todo 訂單查詢
router.get('/orders', function(req, res, next) {
    let orderArr = [];
        firebaseDb.ref('order').once('value').then( order => {
            order.forEach( data => {
                orderArr.push(data.val());
            });
            res.render('dashboard/db-orders', {
                orderArr,
                moment
            });
        });
});
// 編輯買家資訊
router.post('/orders/editpersonal', function(req, res){
    const id = req.body.uid;
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let address = req.body.address;
        res.send({name,email,phone,address,id});
});

// todo 其他
router.get('/others', function(req, res, next) {
    let couponArr = [];
    let newsArr = [];
        firebaseDb.ref('coupon').once('value').then( coupon => {
            coupon.forEach( data => {
                couponArr.push(data.val());
            });
            return firebaseDb.ref('news').once('value');
        }).then( news => {
            news.forEach( data => {
                newsArr.push(data.val());
            });
            res.render('dashboard/db-others', {
                couponArr,
                newsArr,
                moment,
                stringTag
            });
        });
});
// 新增優惠券
router.post('/others/addcoupon', function(req, res){
    const couponPath = firebaseDb.ref('coupon').push();
    const key = couponPath.key;
    const createTime = Math.floor(Date.now() / 1000);
    const expirydate = new Date(req.body.expirydate).getTime() / 1000;
        couponPath.set({
            coupon: req.body.coupon,
            discount: req.body.discount,
            expirydate: expirydate,
            createTime: createTime,
            uid: key
        }).then( success => {
            console.log('新增優惠券成功');
            res.redirect('/dashboard/others');
        });
});
// 刪除優惠券
router.post('/others/del/:id', function(req, res){
    const id = req.params.id;
        firebaseDb.ref('coupon').child(id).remove()
        .then( success => {
            console.log('刪除優惠券成功');
            res.redirect('/dashboard/others');
        });
});
// 編輯優惠券
router.post('/others/edit/:id', function(req, res){
    const id = req.params.id;
    const expirydate = new Date(req.body.expirydate).getTime() / 1000;
        firebaseDb.ref('coupon').child(id).update({
            coupon: req.body.coupon,
            discount: req.body.discount,
            expirydate: expirydate,
        }).then( success => {
            console.log('編輯優惠券成功');
            res.redirect('/dashboard/others');
        });
});
// 新增最新消息
router.post('/others/addnews', function(req, res){
    const newsPath = firebaseDb.ref('news').push();
    const key = newsPath.key;
    const date = new Date(req.body.date).getTime() / 1000;
        newsPath.set({
            date: date,
            content: req.body.news,
            uid: key
        }).then( success => {
            console.log('新增文章成功');
            res.redirect('/dashboard/others');
        });
});
// 刪除最新消息
router.post('/others/delnews/:id', function(req, res){
    const id = req.params.id;
        firebaseDb.ref('news').child(id).remove().then( success => {
            console.log('刪除最新消息成功');
            res.redirect('/dashboard/others');
        });
});
// 編輯最新消息
router.post('/others/editnews/:id', function(req, res){
    const id = req.params.id;
    const date = new Date(req.body.date).getTime() / 1000;
        firebaseDb.ref('news').child(id).update({
            date: date,
            content: req.body.news
        }).then( success => {
            console.log('編輯最新消息成功');
            res.redirect('/dashboard/others');
        });

});

module.exports = router;
