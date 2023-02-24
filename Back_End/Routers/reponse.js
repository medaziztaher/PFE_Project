const express = require('express');
const router = express.Router();
const reponse = require("../Controllers/reponse")
const auth =require("../middleware/auth")


// Get the response added by a patient to a specific question by the authenticated doctor
router.get('/medecin/question/:questionId/reponse',auth,reponse.getReponseByQuestion)

// Get all responses for a patient by the authenticated doctor
router.get('/medecin/patient/:id/reponse',auth, reponse.getReponsesByMedecin)

// Get all responses added by the authenticated patient
router.get('/patient/reponse', auth, reponse.getReponsesByPatient)

// Add a response from a patient
router.post('/patient/reponse/:id', auth, reponse.addReponseByPatient)



module.exports = router;