const {request,response} = require('express');
const db = require('../Models/models');

const ajoutermedicament = async (req, res) => {
  try {
    const patient = await db.patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }


    const medicament = await db.medicament.create({
      patient: patient._id,
      medecin: req.user._id,
      date_de_debut: req.body.date_de_debut,
      date_de_fin: req.body.date_de_fin,
      description: req.body.description
    });
    patient.liste_de_medicaments.push(medicament._id);
    await patient.save();

    return res.status(201).json({ medicament });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}


const getmedicamentbymedecin =async (req, res) => {
    try {
      const medecinId = req.params.medecinId;
      const patientId = req.params.patientId;
  
      const medecin = await db.medecin.findById(medecinId);
      if (!medecin) {
        return res.status(404).json({ message: 'Medecin not found' });
      }
      const patient = await db.patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      const isAuthorized = patient.liste_de_medecins.includes(medecinId);
      if (!isAuthorized) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const medicaments = await db.medicament.find({ patient: patientId, medecin: medecinId });
  
      return res.json(medicaments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error' });
    }
}

const getAllMedicamentsForPatient = async (req, res) => {
  const { patientId } = req.params;
  try {
    const patient = await db.patient.findById(patientId).populate('liste_de_medicaments');
    if (!patient) {
      throw new Error(`Could not find patient with ID ${patientId}`);
    }
    const medicaments = patient.liste_de_medicaments;
    return res.json(medicaments);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

const getMedicamentByPatient = async (req, res) => {
  const { patientId, medecinId } = req.params;
  const { _id } = req.user;

  try {
    // Verify if the user is a medecin
    if (_id !== medecinId) {
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
