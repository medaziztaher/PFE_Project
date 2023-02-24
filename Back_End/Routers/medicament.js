const express = require('express');
const router = express.Router();
const medicament = require("../Controllers/medicament")
const auth = require('../middleware/auth');

//Add a specific medicament to a patient by doctor
router.post('/patients/:patientId/medicaments',auth, medicament.ajoutermedicament);

//Get all patient's medicaments by patient 
router.get('medicaments/medecins/:medecinId',auth, medicament.getMedicamentByPatient);

//Get patient's medicaments by doctor
router.get('/patients/:patientId/medicaments',auth,medicament.getmedicamentbymedecin);

//Get all patient's medicaments by doctor 
router.get('/medicaments',auth,medicament.getAllMedicamentsForPatient);

module.exports = router;