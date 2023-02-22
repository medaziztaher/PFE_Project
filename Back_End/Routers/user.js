const express = require('express');
const router = express.Router();
const signup=require("../signup/signup")
const auth =require("../middleware/auth")

router.post('/signup',signup)
router.post('/auth',auth)

module.exports=router
