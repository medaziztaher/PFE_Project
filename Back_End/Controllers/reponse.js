const {request,response} = require('express');
const db = require('../Models/models');

// Get all responses for a patient by a medecin
const getResponsesByMedecin = async (req, res) => {
  const medecinId = req.user.id; // Get the ID of the logged in medecin
  const patientId = req.params.id;

  try {
    const responses = await db.reponse.find({ patient: patientId }).populate('question');

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
const getResponsesByPatient = async (req, res) => {
    const patientId = req.user.id; // Get the ID of the logged in patient
  
    try {
      const responses = await db.reponse.find({ patient: patientId }).populate('question');
  
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
const getResponseByQuestion = async (req, res) => {
    const medecinId = req.user.id;
    const questionId = req.params.id;
  
    try {
      const response = await db.reponse.findOne({ question: questionId, patient: { $in: db.patient.find({ liste_de_medecins: medecinId }) } })
                                       .populate('patient')
                                       .populate('question');
  
      if (!response) {
        return res.status(404).send('No response found for the given question and medecin');
      }
  
      return res.send(response);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error fetching response');
    }
};
  
const addReponseByPatient = async (req, res) => {
    try {
      const patientId = req.user.id;
      const { id: questionId } = req.params;
      const { reponse } = req.body;
  
      const question = await db.question.findById(questionId);
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      const existingReponse = await db.reponse.findOne({ question: questionId, patient: patientId });
      if (existingReponse) {
        return res.status(400).json({ message: 'A response for this question already exists' });
      }
  
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
    getResponsesByMedecin,
    getResponsesByPatient,
    getResponseByQuestion,
    addReponseByPatient
}
module.exports=reponse

