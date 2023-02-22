const express = require('express');
const router = express.Router();
const medicament = require("../Controllers/medicament")
const auth = require('../middleware/auth');


router.post('/medecin/patient/:patientId/medicament', auth,medicament.ajoutermedicament)
router.get('/patient/:patientId/medecin/:medecinId/medicament', auth,medicament.getmedicamentbymedecin)
router.get('/patient/:patientId/medicament',auth,medicament.getAllMedicamentsForPatient)
router.get('/medecin/:medecinId/patient/:patientId', auth, medicament.getMedicamentByPatient);



module.exports=router