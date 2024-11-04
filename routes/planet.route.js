const {Router}=require('express')


const upload = require('../utils/fileUpload')
const { getAllPlanets, createNewPlanet, getPlanetById, updatePlanet, deletePlanet } = require('../controllers/planet.controller')
const {protected, adminAccess, apiKeyAccess}=require('../middlewares/auth')
const router=Router()


router.get('/',apiKeyAccess,getAllPlanets)
router.get('/:id',getPlanetById)

router.post('/',protected,adminAccess,upload.single('image'),createNewPlanet)
router.put('/:id',protected,adminAccess,updatePlanet)
 
router.delete('/:id',protected,adminAccess,deletePlanet)

module.exports=router