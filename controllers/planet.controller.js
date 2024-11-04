const Star=require('../models/star.model')
const Planet=require('../models/planet.model')
const ErrorResponse=require('../utils/errorResponse')
const asyncHandler=require('../middlewares/async')


//@description    Get all planets 
//@route          GET/api/v1/planets
//@access         Public/ with apiKey

exports.getAllPlanets=asyncHandler(async(req,res,next)=>{
    const pageLimit= process.env.DEFAULT_PAGE_LIMIT||5
    const limit=parseInt(req.query.limit)
    const page=parseInt(req.query.page)
    const total=await Planet.countDocuments()
    
    const planets=await Planet
    .find()
    .skip((page-1)*limit)
    .limit(limit)
    res.status(200).json({
        success:true,
        currentpage:page,
        pageCount:Math.ceil(total/limit),
        nextPage:Math.ceil(total/limit)< page+1 ? null: page+1 ,
        data:planets
    })
})

//@description    Get one planet 
//@route          GET/api/v1/planets/:id
//@access         Public/ with apiKey

exports.getPlanetById=asyncHandler(async(req,res,next)=>{
    const planet=await Planet.findById(req.params.id)
    res.status(200).json({
        success:true,
        data:planet
    })
})


//@description    Create new Planet
//@route          POST/api/v1/planets
//@access         Private/Admin

exports.createNewPlanet=asyncHandler(async(req,res,next)=>{
    const star=await Star.findOne({name:req.body.star})
    const newPlanet=await Planet.create({
        name:req.body.name,
        distanceToStar:req.body.distanceToStar,
        diametr:req.body.diametr,
        yearDuration:req.body.yearDuration,
        dayDuration:req.body.dayDuration,
        satelities:req.body.satelities,
        temperature:req.body.temperature,
        sequenceNumber:req.body.sequenceNumber,
        image:'uploads/'+req.file.filename,
        star:star._id
    })
    await Star.findOneAndUpdate({name:req.body.star},
        {$push: {planets:newPlanet._id}},
        {new:true,upsert:true}
    )
    res.status(200).json({
        success:true,
        data:newPlanet
    })
   
})

//@description    Update planet
//@route          PUT/api/v1/planets/:id
//@access         Private/Admin

exports.updatePlanet=asyncHandler(async(req,res,next)=>{
    const planet=await Planet.findById(req.params.id)
   // console.log(req.body)
    const editedPlanet=await ({
        name:req.body.name|| planet.name,
        distanceToStar:req.body.distanceToStar||planet.distanceToStar,
        diametr:req.body.diametr || planet.diametr,
        yearDuration:req.body.yearDuration||planet.yearDuration,
        dayDuration:req.body.dayDuration||planet.dayDuration,
        temperature:req.body.temperature || planet.temperature,
        sequenceNumber:req.body.sequenceNumber||planet.sequenceNumber,
        satelities:req.body.satelities||planet.satelities,
        
        
    })

    const updatedPlanet=await Star.findByIdAndUpdate(req.params.id,editedPlanet,{new:true})

    res.status(200).json({
        success:true,
        data:editedPlanet
    })
   
})

//@description    Delete planet
//@route          DELETE/api/v1/planets/:id
//@access         Private/Admin

exports.deletePlanet=asyncHandler(async(req,res,next)=>{
    await Planet.findByIdAndDelete(req.params.id)
  

     res.status(200).json({
        success:true,
        data:'Deleted successfully'
    })
})