const express = require('express');
const router = express.Router();
const productHelpers = require("../helpers/product-helpers")
const userHelpers = require("../helpers/user-helpers")

/* GET home page. */
router.get('/', async function(req, res, next) {
  const user=req.session.user
  let cartCount=null
  if(user){
    cartCount=await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products)=>{
    res.render('index',{user,products,cartCount});
  })

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

router.get("/logout",function(req,res){
  req.session.destroy()
  res.redirect("/")
})

router.get("/cart",async function(req,res,next){
  let products=await userHelpers.getCartProducts(req.session.user._id)
  let cartCount=await userHelpers.getCartCount(req.session.user._id)
  if(cartCount===0){
    res.render("user/cart",{cartEmpty:true})
  }else{
    res.render("user/cart",{cartEmpty:false,products})
  }

})

router.post("/add-to-cart/:productId",function(req,res){
  userHelpers.addToCart(req.params.productId,req.session.user._id).then((response)=>{
    res.redirect("/")
  })
})

router.post("/change-product-quantity/:userId/:productId",function(req,res){
  userHelpers.changeProductQuantity(req.params.userId,req.params.productId,req.body.increment).then((response)=>{
    res.redirect("/cart")
  })
})

router.get("/remove-cart-item/:userId/:productId",function(req,res){
  userHelpers.removeCartItem(req.params.userId,req.params.productId).then((response)=>{
    res.redirect("/cart")
  })
})

module.exports = router;
