const express = require('express');
const router = express.Router();
const reponse = require("../Controllers/reponse")
const signin = require('../middleware/signin');


// Get the response added by a patient to a specific question by the authenticated doctor
router.get('/medecin/question/:questionId/reponse',signin,reponse.getReponseByQuestion)

// Get all responses for a patient by the authenticated doctor
router.get('/medecin/patient/:id/reponse',signin, reponse.getReponsesByMedecin)

// Get all responses added by the authenticated patient
router.get('/patient/reponse', signin, reponse.getReponsesByPatient)

// Add a response from a patient
router.post('/patient/reponse/:id', signin, reponse.addReponseByPatient)



module.exports = router;