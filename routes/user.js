const express = require('express');
const router = express.Router();
const productHelpers = require("../helpers/product-helpers")
const userHelpers = require("../helpers/user-helpers")
const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect("/login")
  }
}

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

router.get("/cart",verifyLogin,async function(req,res){
  let products= await userHelpers.getCartProducts(req.session.user._id)
  if(products){
  res.render("user/cart",{cartEmpty:false,products})
}else{
  res.render("user/cart",{cartEmpty:true})
}
})

router.post("/add-to-cart/:productId",verifyLogin,function(req,res){
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
    if(response.products.length==0){
      res.render("user/cart",{cartEmpty:true})
    }else{
      res.redirect("/cart")
    }
  })
})

router.get("/place-order/:userId",async function(req,res){
  let userId=req.params.userId
  let cartProducts=await userHelpers.getCartProducts(userId)
  res.render("user/place-order",{cartProducts})
})
router.get("/payment-gateway/:totalPrice",function(req,res){
  console.log(req.params.totalPrice);
})

router.post("/place-order",async function(req,res){
  let products= await userHelpers.getCartProducts(req.body.userId)
  userHelpers.placeOrder(req.body,products).then((response)=>{
    if(response=="placed"){
      res.render("user/order-success")
    }
  })
})

router.get("/orders",async function(req,res){
  let order=await userHelpers.getOrderedProducts(req.session.user._id)
  res.render("user/orders",{order})
})
module.exports = router;
