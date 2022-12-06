const express = require('express');
const router = express.Router();
const productHelpers=require("../helpers/product-helpers")

/* GET admin listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render("admin/view-products",{products});
  })

});
router.get('/add-product', function(req, res, next) {
  res.render("admin/add-products");
});


router.post("/add-product",function(req,res){
  productHelpers.addProduct(req.body,(addedProduct)=>{
    req.files.uploadedFile.mv("./public/images/"+addedProduct._id+".jpeg",(err,done)=>{
      if(!err){
        res.render("admin/add-products")
      }
    })
  })
})

router.get("/delete-product/:proId",function(req,res){
  const productId=req.params.proId
  productHelpers.deleteProduct(productId).then((response)=>{
  })
  res.redirect("/admin")
})

router.get('/edit-product/:productId',async function(req, res, next) {
  const productDetails=await productHelpers.getProductDetails(req.params.productId)
  res.render("admin/edit-products",{productDetails});
});

router.post("/edit-product/:productId",function(req,res){
  productHelpers.updateProduct(req.params.productId,req.body).then(()=>{
    res.redirect("/admin")
  })
  if(req.files.uploadedFile){
    const Image=req.files.uploadedFile
    Image.mv("./public/images/"+req.params.productId+".jpeg")
  }
})


module.exports = router;
