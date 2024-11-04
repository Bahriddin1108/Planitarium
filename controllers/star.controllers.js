const Star=require('../models/star.model')
const ErrorResponse=require('../utils/errorResponse')
const asyncHandler=require('../middlewares/async')

//const errorResponse = require('../utils/errorResponse')


//@description    Get all stars 
//@route          GET/api/v1/star
//@access         Public/ with apiKey

exports.getAllStars=asyncHandler(async(req,res,next)=>{
    const stars=await Star.find()
    res.status(200).json({
        success:true,
        data:stars
    })
})


//@description    Create new Star
//@route          POST/api/v1/stars
//@access         Private/Admin

exports.createNewStar=asyncHandler(async(req,res,next)=>{
    const newStar=await Star.create({
        name:req.body.name,
        temperature:req.body.temperature,
        massa:req.body.massa,
        diametr:req.body.diametr,
        image:'uploads/'+req.file.filename
    })
    res.status(200).json({
        success:true,
        data:newStar
    })
   
})

//@description    Get all star by id 
//@route          GET/api/v1/star/:id
//@access         Public/ with apiKey

exports.getStarById=asyncHandler(async(req,res,next)=>{
    const star=await Star.findById(req.params.id)
    res.status(200).json({
        success:true,
        data:star
    })
})


//@description    Update star
//@route          PUT/api/v1/stars/:id
//@access         Private/Admin

exports.updateStar=asyncHandler(async(req,res,next)=>{
    const star=await Star.findById(req.params.id)
   // console.log(req.body)
    const editedStar=await ({
        name:req.body.name|| star.name,
        temperature:req.body.temperature || star.temperature,
        massa:req.body.massa || star.massa ,
        diametr:req.body.diametr ||star.diametr,
        image:'uploads/'+req.file.filename
    })

    const updatedStar=await Star.findByIdAndUpdate(req.params.id,editedStar,{new:true})

    res.status(200).json({
        success:true,
        data:updatedStar
    })
   
})

//@description    Delete star
//@route          DELETE/api/v1/stars/:id
//@access         Private/Admin

exports.deleteStar=asyncHandler(async(req,res,next)=>{
    await Star.findByIdAndDelete(req.params.id)
  

     res.status(200).json({
        success:true,
        data:'Deleted successfully'
    })
})
