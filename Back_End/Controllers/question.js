const db = require("../Models/models")

// Function to add questions by a medecin to a specific patient
const ajouterquestions = async (req, res) => {
    const { patientId, questions } = req.body;
    const medecinId = req.user.id;
  
    try {
      // Find the patient and medecin in the database
      const patient = await db.patient.findById(patientId);
      const medecin = await db.medecin.findById(medecinId);
  
      if (!patient || !medecin) {
        throw new Error('Patient or medecin not found');
      }
  
      // Check if the medecin has permission to add questions to the patient
      if (!patient.liste_de_medecins.includes(medecinId)) {
        throw new Error('Unauthorized');
      }
  
      // Create the new questions and save them to the database
      const newQuestions = await db.question.create(questions);
  
      // Add the questions to the patient's list of questions and save to the database
      patient.list_de_questions.push(...newQuestions);
      await patient.save();
  
      // Add the questions to the medecin's list of questions and save to the database
      medecin.liste_de_questions.push(...newQuestions);
      await medecin.save();
  
      return res.status(201).json({ message: 'Questions added successfully', questions: newQuestions });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
};


const getQuestionsByPatient = async (req, res) => {
    try {
      const patientId = req.user.id;
      const patient = await db.patient.findById(patientId).populate({
        path: 'liste_de_medecins',
        populate: [
          { path: 'liste_de_questions' },
          {
            path: 'liste_de_reponses',
            match: { patient: patientId }
          }
        ],
      });
  
      const questions = patient.liste_de_medecins.reduce((acc, medecin) => {
        const unansweredQuestions = medecin.liste_de_questions.filter(q => !q.liste_de_reponses.length);
        acc.push(...unansweredQuestions);
        return acc;
      }, []);
  
      return res.json({ questions });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
};
  

const getAllQuestionByMedecin = async (req, res) => {
  try {
    const medecinId = req.user.id;
    const medecin = await db.medecin.findById(medecinId).populate('liste_de_questions');

    return res.json({ questions: medecin.liste_de_questions });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

const getAllQuestionsByCategorie = async (req, res) => {
  try {
    const { categorie } = req.params;
    const questions = await db.question.find({ categorie }).populate('_creator');

    return res.json({ questions });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

const getAllQuestionsByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    const questions = await db.question
      .find({ createdAt: { $gte: start, $lt: end } })
      .populate('_creator');

    return res.json({ questions });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

const question = {
    ajouterquestions,
    getQuestionsByPatient,
    getAllQuestionByMedecin,
    getAllQuestionsByCategorie,
    getAllQuestionsByDate,
};


module.exports= question


