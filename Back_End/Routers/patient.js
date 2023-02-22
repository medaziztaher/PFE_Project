const express = require('express');
const router = express.Router();
const patient = require("../Controllers/patient")
const auth =require("../middleware/auth")

router.post('/signup',patient.patientSignup)
router.post('/auth',auth)

module.exports=router
