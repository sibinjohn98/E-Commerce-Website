const global.mongoose=require("mongoose")


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
const productSchema=new mongoose.Schema({
  name:String,
  category:String,
  price:String,
  description:String
})

const Product=new mongoose.model("product",productSchema)
const User =new mongoose.model("user",userSchema)
const Cart=new mongoose.model("cart",cartSchema)
module.exports=Product;
module.exports=User;
module.exports=Cart
