var express = require('express');
var router = express.Router();

/* GET admin listing. */
router.get('/', function(req, res, next) {
  res.render("admin/view-products");
});
router.get('/add-product', function(req, res, next) {
  res.render("admin/add-products");
});
router.get('/edit-product', function(req, res, next) {
  res.render("admin/edit-products");
});

module.exports = router;
