var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('dashboard/db-addproducts');
});

// todo 商品管理
router.get('/addproducts', function(req, res, next) {
    res.render('dashboard/db-addproducts');
  });

module.exports = router;
