const express = require('express');
const router = express.Router();
const question = require('../Controllers/question');
const signin = require('../middleware/signin');

// Get all questions added by a doctor to a patient
router.get('/patient/question', signin, question.getQuestionsByPatient);

// Get all questions added by a doctor to his  different patients
router.get('/medecin/question', signin, question.getAllQuestionByMedecin);

// Get all questions of a specific category for a user (either patient or doctor)
router.get('/question/category/:categorie', signin, question.getAllQuestionsByCategorie);

// Get all questions of a specific date for a user (either patient or doctor)
router.get('/question/date', signin, question.getAllQuestionsByDate);
// Add questions by doctor to one of his patients
router.post('/question/add', signin, question.ajouterquestions);


module.exports = router;