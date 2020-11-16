var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/checkcart', function(req, res, next) {
  res.render('client/cart/Check-cart');
});

module.exports = router;
