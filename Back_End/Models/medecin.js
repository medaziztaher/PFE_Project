const mongoose = require('mongoose');

// define the base user schema
const medecin = new mongoose.Schema(
  {
    specialite: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
  },
    liste_de_patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'patient' }],
    liste_de_questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'question'}],
  },
  {timestamps :true}
);

const med = mongoose.model('med', medecin);


module.exports=med