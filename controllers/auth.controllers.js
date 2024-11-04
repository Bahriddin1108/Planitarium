const User=require('../models/user.model')
const ErrorResponse=require('../utils/errorResponse')
const asyncHandler=require('../middlewares/async')
const uuid=require('uuid')
//const errorResponse = require('../utils/errorResponse')


//@description    Register new user
//@route          POST/api/v1/auth/register
//@access         Public  
exports.register=asyncHandler( async (req,res,next)=>{
   
        const{name,email,password}=req.body
        const apiKey=uuid.v4()
        
        const user=await User.create({
            name:name,
            password:password,
            email:email,
            apiKey:apiKey
        })

    const token=user.generateJwtToken()

        res.status(201).json({
            success:true,
            data:user,
            token
        })
    } 
)


//@description    Login user
//@route          POST/api/v1/auth/login
//@access         Public  


exports.login=asyncHandler( async (req,res,next)=>{
    const{email,password}=req.body

    //Validate email && password
    if(!email||!password){
        return next(new ErrorResponse('Palease provide email and password',400))
    }
    const user= await User.findOne({email:email})
    //Check for the user
    if(!user){
        return next(new ErrorResponse('This user already existed',401))
        
    }

    // Check for password
    const isMatch = await user.matchPassword(password)

    if(!isMatch){
        return next(new ErrorResponse('invalid', 401))
    }
    const token=user.generateJwtToken()
    res.status(200).json({
        success:true,
        data:user,
        token 
    })
})

//@description    Get profile user
//@route          Get/api/v1/auth/profile
//@access         Private


exports.getProfile=asyncHandler( async (req,res,next)=>{
    const user=await User.findById(req.user._id)
    
   
    res.status(200).json({
        success:true,
        data:user,
    })
})

//@description    Update profile user
//@route          Put/api/v1/auth/update
//@access         Private


exports.updateDetails=asyncHandler( async (req,res,next)=>{
    const user=await User.findById(req.user._id)
    const fieldsToUpdate={
        name:req.body.name|| user.name,
        email:req.body.emai|| user.email,
        
    }
   const updateUser=await User.findByIdAndUpdate(req.user._id,fieldsToUpdate,{
    new:true,
    runValidators:true
   })
    res.status(200).json({
        success:true,
        data:updateUser,
    })
})

//@description    Update profile user
//@route          Put/api/v1/auth/update
//@access         Private


exports.updatePassword=asyncHandler( async (req,res,next)=>{
    const user=await User.findById(req.user._id)
    
    //Check current password
    if(await user.matchPassword(req.body.currentPassword)){
        return next(new ErrorResponse('Old password is incorrect',400))
    }
    user.password=req.body.newPassword
    await user.save()
    const token=user.generateJwtToken()

   
    res.status(200).json({
        success:true,
        data:user,
    })
})


//@description    Payment Balance
//@route          Put/api/v1/auth/paymentBalance
//@access         Private


exports.paymentBalance=asyncHandler( async (req,res,next)=>{
   //CLICK, PAYME
   const user= await User.findById(req.user._id)
  console.log(user.balance)
   const upadeteUser= await User.findByIdAndUpdate(req.user._id,
    {balance:(user.balance+req.body.payment)},
    {new:true}
   )

    res.status(200).json({
        success:true,
        data:upadeteUser,
    })
})

//@description    Activate Status
//@route          Put/api/v1/auth/activate
//@access         Private


exports.activateProfile=asyncHandler( async (req,res,next)=>{
    const apicost=process.env.API_COST
    const user=await User.findById(req.user._id)
    
    if(user.balance<apicost){
        let needMoney=apicost-user.balance
        return next(new ErrorResponse(`Your balance is less than ${apicost}. You need ${needMoney} more`,400))
    }
    
    await User.findByIdAndUpdate(req.user._id,
        {balance:(user.balance-apicost),isActive:true},
        {new:true,runValidators:true}
    )
 
     res.status(200).json({
         success:true,
         data:"Activated",
     })
 })