const express = require('express');
const router = express.Router();
const question = require('../Controllers/question');
const auth = require('../middleware/auth');

// Get all questions added by a doctor to a patient
router.get('/patient/question', auth, question.getQuestionsByPatient);

// Get all questions added by a doctor to his  different patients
router.get('/medecin/question', auth, question.getAllQuestionByMedecin);

// Get all questions of a specific category for a user (either patient or doctor)
router.get('/question/category/:categorie', auth, question.getAllQuestionsByCategorie);

// Get all questions of a specific date for a user (either patient or doctor)
router.get('/question/date', auth, question.getAllQuestionsByDate);
// Add questions by doctor to one of his patients
router.post('/question/add', auth, question.ajouterquestions);


module.exports = router;