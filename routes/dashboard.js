var express = require('express');
const { route } = require('.');
// const { app } = require('firebase-admin');
// const { route } = require('.');
var router = express.Router();
var firebaseDb = require('../connection/firebase_admin');

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
                productsArr
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
            ontheshelf,
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
        ontheshelf
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
    res.render('dashboard/db-orders');
});

// todo 其他
router.get('/others', function(req, res, next) {
    res.render('dashboard/db-others');
});

module.exports = router;
