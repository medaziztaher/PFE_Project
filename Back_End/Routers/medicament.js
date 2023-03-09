const express = require('express');
const router = express.Router();
const medicament = require("../Controllers/medicament")
const signin = require('../middleware/signin');

//Add a specific medicament to a patient by doctor
router.post('/patients/medicaments',signin, medicament.ajoutermedicament);

//Get all patient's medicaments by patient 
router.get('medicaments/medecins/:medecinId',signin, medicament.getMedicamentByPatient);

//Get patient's medicaments by doctor
router.get('/patients/:patientId/medicaments',signin,medicament.getmedicamentbymedecin);

//Get all patient's medicaments by doctor 
router.get('/medicaments',signin,medicament.getAllMedicamentsForPatient);

module.exports = router;