const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const objectId = require("mongodb").ObjectId
const productHelpers=require("./product-helpers")

mongoose.connect("mongodb://localhost:27017/shoppingDB",{useNewUrlParser:true})

const userSchema=new mongoose.Schema({
  name:String,
  email:String,
  password:String,
})
const productsSchema=new mongoose.Schema({
  item:String,
  quantity:Number
})
const cartSchema=new mongoose.Schema({
  user:String,
  products:[productsSchema]
})
const User =new mongoose.model("user",userSchema)
const Cart=new mongoose.model("cart",cartSchema)


module.exports={
  userSignup:(userInfo)=>{
    return new Promise(async(resolve,reject)=>{
      userInfo.Password=await bcrypt.hash(userInfo.Password,10)
      const user=new User({
        name:userInfo.Name,
        email:userInfo.Email,
        password:userInfo.Password
      })
      user.save(function(err,data){
        resolve(data)
      })
    })

  },
  userLogin:(userInfo)=>{
    const response={}
    return new Promise((resolve,reject)=>{
       User.findOne({email:userInfo.Email},function(err,foundUser){
        if(!err){
          if(foundUser){
            bcrypt.compare(userInfo.Password,foundUser.password).then((status)=>{
              if(status){
                response.status=status
                response.user=foundUser
                resolve(response)
              }else{
                resolve({status:false})
              }
            })
          }else{
            resolve({status:false})
          }
        }else{
          console.log(err);
        }
      })
    })
  },
  addToCart:(productId,userId)=>{
    return new Promise((resolve,reject)=>{
      Cart.findOne({user:userId},function(err,userCart){
        if(userCart){
          let productExist=userCart.products.findIndex(product=> product.item==productId)
          if(productExist!==-1){
            Cart.updateOne({user:objectId(userId),"products.item":objectId(productId)},
            {
              $inc:{"products.$.quantity":1}
            }).then(()=>{
                resolve()
            })
          }else{
            let product={
              item:productId,
              quantity:1
            }
            Cart.updateOne({user:objectId(userId)},
            {
              $push:{products:product}

            }).then((response)=>{
                resolve()
            })
          }
        }else{
          const cart=new Cart({
            user:userId,
            products:[{
              item:productId,
              quantity:1
            }]
          })
          cart.save()
        }
      })
    })
  },
  getCartProducts:(userId)=>{
    return new Promise((resolve,reject)=>{
      const cartItems=[];
       Cart.findOne({user:userId},function(err,foundCart){
         let productCount=foundCart.products.length
         foundCart.products.forEach(async function(product){
           const productDetails=await productHelpers.getProductDetails(product.item)
           cartItems.push({
             user:userId,
             id:productDetails._id,
             name:productDetails.name,
             category:productDetails.category,
             price:productDetails.price,
             description:productDetails.description,
             quantity:product.quantity
           })
           if(productCount!==0){
           if(cartItems.length==productCount){
             resolve(cartItems)
           }
         }else{
           resolve(0)
         }
         })
      })

      })
  },
  changeProductQuantity:(userId,productId,increment)=>{
    increment=parseInt(increment)
    return new Promise((resolve,reject)=>{
      Cart.updateOne({user:userId,"products.item":productId},
      {
        $inc:{"products.$.quantity":increment}
      }).then(()=>{
          resolve()
      })
    })
  },
  removeCartItem:(userId,productId)=>{
    return new Promise((resolve,reject)=>{
    Cart.findOneAndUpdate({ user:userId },
    { $pull: { products: { item: productId} } },
    { new: true },
    function(err){
      if (err){
         console.log(err)
      }
    }).clone().then((response)=>{
        resolve()
      })
    })
  },
  getCartCount:(userId)=>{
    return new Promise(async(resolve,reject)=>{
      let count=0
      let cart=await Cart.findOne({user:userId})
      if(cart){
        count=cart.products.length
      }
      resolve(count)
    })
  }
}
