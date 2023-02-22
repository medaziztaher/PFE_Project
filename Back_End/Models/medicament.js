const mongoose = require('mongoose');

const medicamentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'patient' },
    medecin: { type: mongoose.Schema.Types.ObjectId, ref: 'medecin' },
    date_de_debut: { type: Date, required: true },
    date_de_fin: { type: Date, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const medicament = mongoose.model('medicament', medicamentSchema);

module.exports = medicament