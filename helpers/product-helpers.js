const mongoose= require("mongoose")


const productSchema=new mongoose.Schema({
  name:String,
  category:String,
  price:String,
  description:String
})

const Product=new mongoose.model("product",productSchema)
module.exports=Product;
module.exports={
  addProduct:(product,response)=>{
    const newProduct=new Product({
      name:product.Name,
      category:product.Category,
      price:product.Price,
      description:product.Description
    })
    newProduct.save(function(err,data){
      response(data)
    })
  },
  getAllProducts:()=>{
    return new Promise((resolve,reject)=>{
      Product.find({},function(err,foundProducts){
        if(!err){
          if(foundProducts){
            resolve(foundProducts)
          }
        }
      })
    })
  },
  deleteProduct:(productId)=>{
    return new Promise((resolve,reject)=>{
      Product.findOneAndDelete({_id:productId}).then((response)=>{})
    })
  },
  getProductDetails:(productId)=>{
    return new Promise(async(resolve ,reject)=>{
    const foundProduct=await Product.findOne({_id:productId})
    resolve(foundProduct)
    })
  },
  updateProduct:(productId,productDetails)=>{
    return new Promise((resolve,reject)=>{
      Product.updateOne({_id:productId},{
        $set:{
          name:productDetails.Name,
          category:productDetails.Category,
          price:productDetails.Price,
          description:productDetails.Description
        }
      }).then((response)=>{
        resolve()
      })
    })
  }
}
