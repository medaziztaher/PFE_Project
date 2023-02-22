const express = require('express');
const router = express.Router();
const reponse = require("../Controllers/reponse")
const auth =require("../middleware/auth")

router.get('/medecin/question/:questionId/reponse',auth,reponse.getResponseByQuestion)
router.get('/medecin/patient/:id/response',auth, reponse.getResponsesByMedecin);
router.get('/patient/response', auth, reponse.getResponsesByPatient);
router.post('/patient/reponse/:id', auth, reponse.addReponseByPatient);



module.exports = router;