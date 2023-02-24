const {request,response} = require('express');
const db = require('../Models/models');


//Add a specific medicament to a patient by doctor

const ajoutermedicament = async (req, res) => {
  try {
    // Find the patient by ID
    const patient = await db.pat.findById(req.params.patientId);
    
    // If the patient doesn't exist, return a 404 error
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Create a new medication record in the database
    const medicament = await db.medicament.create({
      patient: patient._id,
      medecin: req.user._id, 
      date_de_debut: req.body.date_de_debut, 
      date_de_fin: req.body.date_de_fin, 
      description: req.body.description 
    });
    
    // Add the new medication record to the patient's list of medications
    patient.liste_de_medicaments.push(medicament._id);
    
    // Save the patient's updated medication list to the database
    await db.pat.save();

    // Return a success response with the new medication record
    return res.status(201).json({ medicament });
  } catch (error) {
    // If there's an error, log it and return a 500 error
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}


//Get medicaments of one of his patients by doctor
const getmedicamentbymedecin = async (req, res) => {
  try {
    const medecinId = req.user._id;
    const patientId = req.params.patientId;

    // Find the medecin by ID
    const medecin = await db.med.findById(medecinId);
    if (!medecin) {
      // If the medecin is not found, return an error message
      return res.status(404).json({ message: 'Medecin not found' });
    }

    // Find the patient by ID
    const patient = await db.pat.findById(patientId);
    if (!patient) {
      // If the patient is not found, return an error message
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if the medecin is authorized to view the patient's medicaments
    const isAuthorized = patient.liste_de_medecins.includes(medecinId);
    if (!isAuthorized) {
      // If the medecin is not authorized, return an error message
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find all the medicaments for the given patient
    const medicaments = await db.medicament.find({ patient: patientId, medecin: medecinId });

    // Return the medicaments as a response
    return res.json(medicaments);
  } catch (error) {
    // If there's an error, log it and return a server error message
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
}


//Get all patient's medicaments by doctor 

const getAllMedicamentsForPatient = async (req, res) => {
  const patientId  = req.user._id
  try {
    // Find the patient with the extracted ID and populate their medication list with the details
    const patient = await db.pat.findById(patientId).populate('liste_de_medicaments');
    // If no patient is found with the ID, throw an error
    if (!patient) {
      throw new Error(`Could not find patient with ID ${patientId}`);
    }
    // Extract the patient's medication list from the populated patient object
    const medicaments = patient.liste_de_medicaments;
    // Return the medication list as a response
    return res.json(medicaments);
    } catch (error) {
    // Log any errors that occur and return an error response with the error message
    console.error(error);
    return res.status(400).json({ message: error.message });
    }
    };



//Get all medicaments by patient 
const getMedicamentByPatient = async (req, res) => {
  const medecinId = req.params.medecinId;
  const patientId = req.user._id;

  try {
    // Verify if the user is a medecin
    if (patientId !== medecinId) {
      return res.status(401).json({ error: 'You are not authorized to perform this action' });
    }

    // Find all medicaments sent to the patient by the medecin
    const medicaments = await db.medicament.find({ patient: patientId, medecin: medecinId });

    if (!medicaments) {
      return res.status(404).json({ error: 'No medicaments found for this patient and medecin' });
    }

    res.status(200).json({ medicaments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};







const medicament = {
    ajoutermedicament,
    getmedicamentbymedecin,
    getAllMedicamentsForPatient,
    getMedicamentByPatient
}
module.exports=medicament
