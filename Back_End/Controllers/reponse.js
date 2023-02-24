const {request,response} = require('express');
const db = require('../Models/models');

// Get all responses for a patient by the authenticated doctor
const getReponsesByMedecin = async (req, res) => {
  const medecinId = req.user.id; 
  const patientId = req.params.id;

  try {
    // Find all responses for the patient and populate the associated question
    const responses = await db.reponse.find({ patient: patientId }, 'reponseText').populate('question');

    if (!responses || responses.length === 0) {
      res.status(404).send('No responses found for the patient');// If no responses are found, return a 404 error response
    } else {
      res.send(responses);// Otherwise, return the responsesText in the response object
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching responses');// If an error occurs, log the error and return a 500 error response
  }
};


// Get all responses added by the authenticated patient
const getReponsesByPatient = async (req, res) => {
    const patientId = req.user.id; 
  
    try {
      // Find all responses for the patient and populate the associated question
      const responses = await db.reponse.find({ patient: patientId }, 'reponseText').populate('question')
  
      if (!responses || responses.length === 0) {
        res.status(404).send('No responses found for the patient');
      } else {
        res.send(responses);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching responses');
    }
};


// Get the response added by a patient to a specific question by the authenticated doctor
const getReponseByQuestion = async (req, res) => {
    const medecinId = req.user.id;
    const questionId = req.params.id;
  
    try {
      // Find the response with the given question id and the patient who has the given doctor in their liste_de_medecins
      const response = await db.reponse.findOne({ question: questionId, patient: { $in: db.patient.find({ liste_de_medecins: medecinId }) } }, 'reponseText').populate('patient').populate('question');
  
      if (!response) {
        return res.status(404).send('No response found for the given question and medecin');
      }
  
      return res.send(response);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error fetching response');
    }
};
  
// Add a response from a patient
const addReponseByPatient = async (req, res) => {
    try {
      const patientId = req.user.id;
      const { id: questionId } = req.params;
      const { reponse } = req.body;
      
      // Check if the question exists
      const question = await db.question.findById(questionId);
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
      // Check if a response for this question already exists  
      const existingReponse = await db.reponse.findOne({ question: questionId, patient: patientId });
      if (existingReponse) {
        return res.status(400).json({ message: 'A response for this question already exists' });
      }
      // Create a new response object and save it to the database
      const newReponse = new db.reponse({
        question: questionId,
        patient: patientId,
        reponse,
      });
  
      await newReponse.save();
      return res.status(201).json({ reponse: newReponse });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error adding response' });
    }
};
  
  

const reponse={
    getReponsesByMedecin,
    getReponsesByPatient,
    getReponseByQuestion,
    addReponseByPatient
}
module.exports=reponse

