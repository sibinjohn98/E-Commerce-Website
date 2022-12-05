const express = require('express');
const router = express.Router();
const productHelpers = require("../helpers/product-helpers")
const userHelpers = require("../helpers/user-helpers")

/* GET home page. */
router.get('/', function(req, res, next) {
  const user=req.session.user
  let cartCount=null
  if(user){
    cartCount=1
  }
  res.render('index',{user});
})

router.get("/login",function(req,res,next){
  if(req.session.loggedIn){
    res.redirect("/")
  }else{
  res.render("user/login",{loginErr:req.session.loginErr})
  req.session.loginErr=false
  }
})

router.get("/signup",function(req,res,next){
  res.render("user/signup")
})

router.get("/cart",function(req,res,next){
  res.render("user/cart")
})

router.post("/signup",function(req,res){
  req.body=JSON.parse(JSON.stringify(req.body));
  userHelpers.userSignup(req.body).then((response)=>{
    console.log(response)
    req.session.user=response
    req.session.loggedIn=true
    res.redirect("/")
  })

})
router.post("/login",function(req,res){
  req.body=JSON.parse(JSON.stringify(req.body));
  userHelpers.userLogin(req.body).then((response)=>{
    if(response.status){
      req.session.user=response.user
      req.session.loggedIn=true
      res.redirect("/")
    }else{
      req.session.loginErr=true
      res.redirect("/login")
    }
  })
})




module.exports = router;
