const express = require('express');
const router = express.Router();
const user = require("../Controllers/user")
const signup=require("../signup/signup")
const auth =require("../middleware/auth")



router.post('/signup',signup)

router.post('/auth',auth)

router.post('/',auth,user.enoyer_inv)

router.get('/',auth,user.receive_inv)

router.patch('/invitations/:id', auth,user.accept_inv)

router.put('./invitations/:id/refuses',auth,user.refuse_inv)

router.post('/:id',auth,user.sendMessage)

router.get('/:id',auth,user.get_discution)


module.exports=router
