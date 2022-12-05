const mongoose=require("mongoose")
const bcrypt=require("bcrypt")

mongoose.connect("mongodb://localhost:27017/shoppingDB",{useNewUrlParser:true})

const userSchema=new mongoose.Schema({
  name:String,
  email:String,
  password:String,
})
const User =new mongoose.model("user",userSchema)

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
  }
}
