const express = require('express');
const router = express.Router();
const user = require("../Controllers/user")
const signup=require("../signup/signup")
const signin =require("../middleware/signin")

/*
router.get("/verify/:userId/:uniqueString",admin.getverifiaction)

router.get("/verify/:userId/:uniqueString",admin.verified)
*/
router.post('/signup',signup)

router.post('/signin',signin)

router.post('/',signin,user.enoyer_inv)

router.get('/',signin,user.receive_inv)

router.patch('/invitations/:id', signin,user.accept_inv)

router.put('./invitations/:id/refuses',signin,user.refuse_inv)

router.post('/:id',signin,user.sendMessage)

router.get('/:id',signin,user.get_discution)


module.exports=router
