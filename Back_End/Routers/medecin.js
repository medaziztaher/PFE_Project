const express = require('express');
const router = express.Router();
const medecin = require("../Controllers/medecin")
const auth =require("../middleware/auth")

router.post('/signup',medecin.signup)
router.post('/auth',auth)

module.exports=router
