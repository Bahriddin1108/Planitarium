const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const jwt=require('jsonwebtoken')
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[
           /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
           'Please enter valid email' 
        ]

    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    adminStatus:{
        type:Boolean,
        default:false
    },
    apiKey:{
        type:String,
        required:true,
        unique:true,
    },
    balance:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
//Hashing password with bcrypt
userSchema.pre('save', async function(next){
if (!this.isModified('password')) {
    next()
}
const salt= await bcrypt.genSalt(10)
this.password=await bcrypt.hash(this.password,salt)
}) 
// Generate jwt token
userSchema.methods.generateJwtToken=function(){
    return jwt.sign({id:this._id,email:this.email},process.env.JWT_TOKEN_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,

    })
}

//Check user password with entered password
userSchema.methods.matchPassword= async function(enterPassword){
    return await bcrypt.compare(enterPassword.toString() , this.password)
}


module.exports=mongoose.model('User',userSchema)