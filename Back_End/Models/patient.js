const mongoose = require('mongoose');

const options = { discriminatorKey: 'role' };

// define the base user schema
const patient = new mongoose.Schema(
  {
    date_naissance: { type: Date },
    sexe: { type: String, enum: ['homme', 'femme'], required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
  },
    liste_de_medecins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'medecin' }],
    liste_de_medicaments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'medicament' }],
    list_de_reponses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reponse' }]
  },
  {timestamps : true}
);
const pat = mongoose.model('pat', patient);


module.exports=pat