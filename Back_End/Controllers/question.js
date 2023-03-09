const {request,response} = require ("express")
const db = require("../Models/models")

// Add questions by doctor to one of his patients
const ajouterquestions = async (req, res) => {
    const patientId = req.params.id
    const questions = req.body.questions;
    const medecinId = req.user._id;
  
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

// Get all questions added by a doctor to a patient
const getQuestionsByPatient = async (req, res) => {
  try {
    // Get the patient ID from the request user object.
    const patientId = req.user._id;
    // Find the patient in the database and populate their list of doctors with their questions and answers.
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
    // Get all the unanswered questions for the patient.
    const questions = patient.liste_de_medecins.reduce((acc, medecin) => {
      const unansweredQuestions = medecin.liste_de_questions.filter(q => !q.liste_de_reponses.length);
      acc.push(...unansweredQuestions);
      return acc;
    }, []);
    // Return the unanswered questions as a JSON object.
    return res.json({ questions });
  } catch (error) {
    // Handle errors and return a JSON object with an error message.
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

  

// Get all questions added by a doctor to his  different patients
const getAllQuestionByMedecin = async (req, res) => {
  try {
    // Get the id of the authenticated medecin user from the request object
    const medecinId = req.user._id;

    // Find the medecin by id and populate the questions they added
    const medecin = await db.medecin.findById(medecinId).populate('liste_de_questions', 'text');

    // Return the questions added by the medecin in the response
    return res.json({ questions: medecin.liste_de_questions });
  } catch (error) {
    // Log any errors that occur and return an error response
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};



// Get all questions of a specific category for a user (either patient or doctor)
const getAllQuestionsByCategorie = async (req, res) => {
  try {
    // extract category from request parameters
    const { categorie } = req.params;
    
    // extract user information (id and role) from authenticated user
    const { role, userId } = req.user;

    // check user role to determine which sub-document schema to use
    if (role === 'patient') {
      // find the patient using their user id, and populate their list of medecins with their respective questions
      const foundPatient = await db.patient.findById(userId).populate({
        path: 'liste_de_medecins',
        populate: { path: 'liste_de_questions', match: { categorie } }
      });
      
      // extract the questions for the specific category from all medecins and return only their text
      const questions = foundPatient.liste_de_medecins.reduce((acc, medecin) => {
        acc.push(...medecin.liste_de_questions.filter(q => q.categorie === categorie));
        return acc;
      }, []).map(q => q.text);

      // return the list of questions to the user
      return res.json({ questions });
    } else if (role === 'medecin') {
      // find the medecin using their user id, and populate their list of patients with their respective questions
      const foundMedecin = await db.medecin.findById(userId).populate({
        path: 'liste_de_patients',
        populate: { path: 'liste_de_questions', match: { categorie } }
      });
      
      // extract the questions for the specific category from all patients and return only their text
      const questions = foundMedecin.liste_de_patients.reduce((acc, patient) => {
        acc.push(...patient.liste_de_questions.filter(q => q.categorie === categorie));
        return acc;
      }, []).map(q => q.text);

      // return the list of questions to the user
      return res.json({ questions });
    } else {
      // if user role is not recognized, return an error
      return res.status(401).json({ error: 'Invalid user role' });
    }
  } catch (error) {
    // if there is an error, log it and return an error response to the user
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};


// Get all questions of a specific date for a user (either patient or doctor)
const getAllQuestionsByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    const { role, userId } = req.user;

    // Check if user is a patient
    if (role === 'patient') {
      // Get the patient with the given user ID and populate their `liste_de_medecins` array with only the questions created within the given date range
      const patient = await db.patient.findById(userId).populate({
        path: 'liste_de_medecins',
        populate: {
          path: 'liste_de_questions',
          match: { createdAt: { $gte: start, $lt: end } }
        }
      });

      // Map the questions to an array of their `texte` values and send them in the response
      const questions = patient.liste_de_medecins.reduce((acc, medecin) => {
        acc.push(...medecin.liste_de_questions.filter(q => q.createdAt >= start && q.createdAt < end));
        return acc;
      }, []).map(q => q.text);

      return res.json({ questions });
    } else if (role === 'medecin') { // Check if user is a doctor
      // Get the doctor with the given user ID and populate their `liste_de_patients` array with only the questions created within the given date range
      const medecin = await db.medecin.findById(userId).populate({
        path: 'liste_de_patients',
        populate: {
          path: 'liste_de_questions',
          match: { createdAt: { $gte: start, $lt: end } }
        }
      });

      // Map the questions to an array of their `texte` values and send them in the response
      const questions = medecin.liste_de_patients.reduce((acc, patient) => {
        acc.push(...patient.liste_de_questions.filter(q => q.createdAt >= start && q.createdAt < end));
        return acc;
      }, []).map(q => q.text);

      return res.json({ questions });
    } else {
      return res.status(401).json({ error: 'Invalid user type' });
    }
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


