const mongoose = require('mongoose');

const options = { discriminatorKey: 'role' };

// define the base user schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    adresse: { type: String },
    liste_d_invitations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'invitation' }],
    liste_de_messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message' }]
  },
  options
);

// define the medecin sub-document schema
const medecinSchema = new mongoose.Schema(
  {
    specialite: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    liste_de_patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    liste_de_questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'question'}]
  },
  options,
);

// define the patient sub-document schema
const patientSchema = new mongoose.Schema(
  {
    date_naissance: { type: Date },
    sexe: { type: String, enum: ['homme', 'femme'], required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    liste_de_medecins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    liste_de_medicaments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'medicament' }],
    list_de_reponses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reponse' }]
  },
  options,
);

// create the models and attach the sub-document schemas
const user = mongoose.model('user', userSchema);
const medecin = user.discriminator('medecin', medecinSchema);
const patient = user.discriminator('patient', patientSchema);

module.exports = {
    user,
    medecin,
    patient
}
