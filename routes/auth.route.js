const {Router}=require('express')
const { 
    register, 
    login,
    getProfile,
    updateDetails,
    updatePassword,
    paymentBalance,
    activateProfile
} = require('../controllers/auth.controllers')
const {protected}=require('../middlewares/auth')
const router=Router()


router.post('/register',register)
router.post('/login',login)
router.get('/profile',protected,getProfile)
router.put('/update',protected,updateDetails)
router.put('/updatePassword',protected,updatePassword)

router.put('/paymentbalance',protected,paymentBalance)
router.put('/activate',protected,activateProfile)

module.exports=router