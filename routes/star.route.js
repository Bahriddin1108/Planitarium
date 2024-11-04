const {Router}=require('express')

const { 
    getAllStars,
    createNewStar, 
    getStarById, 
    updateStar, 
    deleteStar
} = require('../controllers/star.controllers')
const upload = require('../utils/fileUpload')
const { adminAccess,protected } = require('../middlewares/auth')

const router=Router()


router.get('/',getAllStars)
router.get('/:id',getStarById)

router.post('/',adminAccess,protected,upload.single('image'),createNewStar)
router.put('/:id',adminAccess,protected,updateStar)

router.delete('/:id',adminAccess,protected,deleteStar)

module.exports=router