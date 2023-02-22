const express = require('express');
const router = express.Router();
const question = require('../Controllers/question');
const auth = require('../middleware/auth');

// Get all questions added by the medecins of the logged in patient
router.get('/patient/question', auth, question.getQuestionsByPatient);

// Get all questions added by the logged in medecin
router.get('/medecin/question', auth, question.getAllQuestionByMedecin);

// Get all questions by category
router.get('/question/category/:categorie', auth, question.getAllQuestionsByCategorie);

// Get all questions within a date range
router.get('/question/date', auth, question.getAllQuestionsByDate);
// Route for a medecin to add questions to a patient
router.post('/question/add', auth, question.ajouterquestions);


module.exports = router;