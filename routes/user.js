var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get("/login",function(req,res,next){
  res.render("user/login")
})

router.get("/signup",function(req,res,next){
  res.render("user/signup")
})

router.get("/cart",function(req,res,next){
  res.render("user/cart")
})
module.exports = router;
